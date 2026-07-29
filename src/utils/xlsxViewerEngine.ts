/**
 * Workbook parsing for the read-only XLSX viewer.
 *
 * SheetJS is intentionally loaded with a dynamic import. The initial page does
 * not fetch or evaluate the workbook parser; it is requested only after a file
 * has been chosen.
 */

import type { WorkBook } from 'xlsx';

export type WorkbookErrorCode = 'readFailed' | 'emptyWorkbook' | 'missingSheet';

export class WorkbookViewerError extends Error {
  constructor(public readonly code: WorkbookErrorCode) {
    super(code);
    this.name = 'WorkbookViewerError';
  }
}

export interface SheetView {
  name: string;
  rows: string[][];
  rowCount: number;
  columnCount: number;
}

export interface WorkbookView {
  sheetNames: readonly string[];
  readSheet: (name: string) => SheetView;
}

function displayCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

function hasWorkbookSignature(arrayBuffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(arrayBuffer);
  if (bytes.length < 4) return false;

  // XLSX/XLSM are ZIP containers.
  const zip =
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    ((bytes[2] === 0x03 && bytes[3] === 0x04) ||
      (bytes[2] === 0x05 && bytes[3] === 0x06) ||
      (bytes[2] === 0x07 && bytes[3] === 0x08));
  if (zip) return true;

  // Common XLS files use the OLE Compound File container.
  const oleHeader = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
  const ole =
    bytes.length >= oleHeader.length &&
    oleHeader.every((value, index) => bytes[index] === value);
  if (ole) return true;

  // Early BIFF streams can be stored without an OLE wrapper.
  return bytes[0] === 0x09 && [0x00, 0x02, 0x04, 0x08].includes(bytes[1]);
}

function createWorkbookView(workbook: WorkBook, XLSX: typeof import('xlsx')): WorkbookView {
  const sheetNames = [...workbook.SheetNames];
  if (sheetNames.length === 0) {
    throw new WorkbookViewerError('emptyWorkbook');
  }

  return {
    sheetNames,
    readSheet(name: string): SheetView {
      const worksheet = workbook.Sheets[name];
      if (!worksheet) {
        throw new WorkbookViewerError('missingSheet');
      }

      // Keep SheetJS' default value behavior so formula cells show their stored
      // calculation result instead of the formula source.
      const values = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });
      const rows = values.map((row) => row.map(displayCell));
      const columnCount = rows.reduce((widest, row) => Math.max(widest, row.length), 0);

      return {
        name,
        rows,
        rowCount: rows.length,
        columnCount,
      };
    },
  };
}

export async function parseWorkbookBuffer(arrayBuffer: ArrayBuffer): Promise<WorkbookView> {
  try {
    if (!hasWorkbookSignature(arrayBuffer)) {
      throw new WorkbookViewerError('readFailed');
    }
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    return createWorkbookView(workbook, XLSX);
  } catch (error) {
    if (error instanceof WorkbookViewerError) throw error;
    throw new WorkbookViewerError('readFailed');
  }
}

export async function openWorkbook(file: File): Promise<WorkbookView> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    return await parseWorkbookBuffer(arrayBuffer);
  } catch (error) {
    if (error instanceof WorkbookViewerError) throw error;
    throw new WorkbookViewerError('readFailed');
  }
}
