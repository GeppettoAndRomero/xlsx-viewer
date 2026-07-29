import { describe, expect, it } from 'vitest';
import {
  sanitizeFileName,
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateTotalSize,
} from '@/utils/fileValidation';

const file = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('Excel workbook file validation', () => {
  it('accepts XLSX, XLSM, and XLS extensions without case sensitivity', () => {
    expect(validateFileExtension('report.XLSX').valid).toBe(true);
    expect(validateFileExtension('macros.xlsm').valid).toBe(true);
    expect(validateFileExtension('legacy.xls').valid).toBe(true);
  });

  it('rejects an unrelated extension', () => {
    expect(validateFileExtension('report.csv').valid).toBe(false);
  });

  it('accepts workbook MIME types and an empty browser-provided MIME type', () => {
    expect(
      validateFileMimeType(
        file(
          'report.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ),
      ).valid,
    ).toBe(true);
    expect(
      validateFileMimeType(
        file('macros.xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.12'),
      ).valid,
    ).toBe(true);
    expect(validateFileMimeType(file('legacy.xls', 'application/vnd.ms-excel')).valid).toBe(true);
    expect(validateFileMimeType(file('report.xlsx')).valid).toBe(true);
  });

  it('rejects a conflicting non-workbook MIME type', () => {
    expect(validateFileMimeType(file('report.xlsx', 'text/plain')).valid).toBe(false);
    expect(validateFile(file('report.xlsx', 'text/plain')).valid).toBe(false);
  });

  it('accepts a valid workbook and rejects a non-workbook', () => {
    expect(
      validateFile(
        file(
          'report.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ),
      ).valid,
    ).toBe(true);
    expect(validateFile(file('photo.png', 'image/png')).valid).toBe(false);
  });

  it('keeps the inherited aggregate size guard', () => {
    expect(validateTotalSize([file('a.xlsx', '', 10 * 1024 * 1024)]).valid).toBe(true);
    expect(
      validateTotalSize([
        file('a.xlsx', '', 2 * 1024 * 1024 * 1024),
        file('b.xlsx', '', 1),
      ]).valid,
    ).toBe(false);
  });

  it('replaces reserved filename characters', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.xlsx')).toBe('a_b_c_d_e_.xlsx');
  });
});
