import { type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

export const SAMPLE_XLSX_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/multi-sheet.xlsx', import.meta.url)),
).toString('base64');

export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

export async function dropWorkbook(
  page: Page,
  options: { b64: string; name: string; type: string },
) {
  await page.evaluate(({ b64, name, type }) => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    const file = new File([bytes], name, { type });
    window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
  }, options);
}

export async function openSampleWorkbook(page: Page) {
  await dropWorkbook(page, {
    b64: SAMPLE_XLSX_B64,
    name: 'multi-sheet.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  await page.getByTestId('xlsx-table').waitFor();
}

/** Shared helper used by the covenant and locale specs. */
export async function viewWorkbook(page: Page): Promise<void> {
  await openSampleWorkbook(page);
}
