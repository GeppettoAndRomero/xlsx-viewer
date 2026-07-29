import * as XLSX from 'xlsx';
import { fileURLToPath, URL } from 'node:url';
import * as fs from 'node:fs';

XLSX.set_fs(fs);

const workbook = XLSX.utils.book_new();

const summary = XLSX.utils.aoa_to_sheet([
  ['Item', 'Quantity', 'Unit price', 'Total'],
  ['Pens', 3, 1.5, null],
  ['Paper', 2, 4, null],
  ['Grand total', null, null, null],
]);
summary.D2 = { t: 'n', f: 'B2*C2', v: 4.5 };
summary.D3 = { t: 'n', f: 'B3*C3', v: 8 };
summary.D4 = { t: 'n', f: 'SUM(D2:D3)', v: 12.5 };
summary['!ref'] = 'A1:D4';
XLSX.utils.book_append_sheet(workbook, summary, 'Summary');

const notes = XLSX.utils.aoa_to_sheet([
  ['Topic', 'Detail'],
  ['Privacy', 'Workbook stays in the browser'],
  ['Images', 'Embedded images are not shown'],
]);
XLSX.utils.book_append_sheet(workbook, notes, 'Notes');

const unicode = XLSX.utils.aoa_to_sheet([
  ['言語', '値'],
  ['日本語', '表計算'],
  ['中文', '工作簿'],
  ['Español', 'hoja'],
]);
XLSX.utils.book_append_sheet(workbook, unicode, 'Unicode');

XLSX.writeFile(
  workbook,
  fileURLToPath(new URL('./multi-sheet.xlsx', import.meta.url)),
  { bookType: 'xlsx' },
);
