import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import {
  parseWorkbookBuffer,
  WorkbookViewerError,
} from '@/utils/xlsxViewerEngine';

function workbookBuffer(): ArrayBuffer {
  const workbook = XLSX.utils.book_new();
  const summary = XLSX.utils.aoa_to_sheet([
    ['Name', 'Value'],
    ['Stored formula result', null],
  ]);
  summary.B2 = { t: 'n', f: '2+3', v: 5 };
  summary['!ref'] = 'A1:B2';
  XLSX.utils.book_append_sheet(workbook, summary, 'Summary');
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([['Second sheet']]),
    'Notes',
  );
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
}

describe('xlsxViewerEngine', () => {
  it('lists sheets and returns two-dimensional display values', async () => {
    const workbook = await parseWorkbookBuffer(workbookBuffer());
    expect(workbook.sheetNames).toEqual(['Summary', 'Notes']);
    expect(workbook.readSheet('Summary')).toMatchObject({
      name: 'Summary',
      rowCount: 2,
      columnCount: 2,
      rows: [
        ['Name', 'Value'],
        ['Stored formula result', '5'],
      ],
    });
  });

  it('uses a stable error for a missing sheet', async () => {
    const workbook = await parseWorkbookBuffer(workbookBuffer());
    expect(() => workbook.readSheet('Missing')).toThrowError(
      expect.objectContaining<Partial<WorkbookViewerError>>({ code: 'missingSheet' }),
    );
  });

  it('opens a legacy XLS workbook', async () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([['Legacy value']]),
      'Legacy',
    );
    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xls' }) as ArrayBuffer;
    const parsed = await parseWorkbookBuffer(buffer);
    expect(parsed.readSheet('Legacy').rows).toEqual([['Legacy value']]);
  });

  it('uses a stable error for unreadable bytes', async () => {
    await expect(parseWorkbookBuffer(new ArrayBuffer(0))).rejects.toMatchObject({
      code: 'readFailed',
    });
  });
});
