import { test, expect, type Page } from '@playwright/test';
import * as XLSX from 'xlsx';
import {
  dropWorkbook,
  openSampleWorkbook,
  waitReady,
} from './_helpers';

function trackExternalRequests(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (
      !url.startsWith('http://localhost:4321') &&
      !url.startsWith('data:') &&
      !url.startsWith('blob:')
    ) {
      external.push(url);
    }
  });
  return external;
}

function makeLargeWorkbookBase64(): string {
  const workbook = XLSX.utils.book_new();
  const rows = Array.from({ length: 1000 }, (_, row) =>
    Array.from({ length: 100 }, (_, column) => `R${row + 1}C${column + 1}`),
  );
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), 'Large');
  const bytes = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }) as Buffer;
  return bytes.toString('base64');
}

test.describe('XLSX viewer', () => {
  test('opens a real multi-sheet workbook and sends no workbook data off-origin', async ({
    page,
  }) => {
    const external = trackExternalRequests(page);
    await page.goto('/xlsx-viewer/');
    await waitReady(page);
    await openSampleWorkbook(page);

    await expect(page.getByTestId('file-name')).toHaveText('multi-sheet.xlsx');
    await expect(page.getByTestId('sheet-name')).toHaveText('Summary');
    await expect(page.getByTestId('row-count')).toHaveText('4');
    await expect(page.getByTestId('col-count')).toHaveText('4');
    await expect(page.getByRole('cell', { name: 'Pens', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: '4.5', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: '12.5', exact: true })).toBeVisible();

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('switches worksheets using the read-only sheet tabs', async ({ page }) => {
    await page.goto('/xlsx-viewer/');
    await waitReady(page);
    await openSampleWorkbook(page);

    await page.getByRole('tab', { name: 'Notes', exact: true }).click();
    await expect(page.getByTestId('sheet-name')).toHaveText('Notes');
    await expect(page.getByTestId('row-count')).toHaveText('3');
    await expect(page.getByTestId('col-count')).toHaveText('2');
    await expect(
      page.getByRole('cell', { name: 'Embedded images are not shown', exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Read-only view.', { exact: false })).toBeVisible();
  });

  test('virtualizes both rows and columns in a large worksheet', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'chromium',
      'windowed-rendering DOM check (one engine is enough)',
    );
    await page.goto('/xlsx-viewer/');
    await waitReady(page);
    await dropWorkbook(page, {
      b64: makeLargeWorkbookBase64(),
      name: 'large.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    await page.getByTestId('xlsx-table').waitFor();

    await expect(page.getByTestId('row-count')).toHaveText('1000');
    await expect(page.getByTestId('col-count')).toHaveText('100');
    const renderedRows = await page.locator('tr[data-row]').count();
    const renderedCells = await page.locator('tr[data-row]').first().locator('td').count();
    expect(renderedRows).toBeGreaterThan(0);
    expect(renderedRows).toBeLessThan(100);
    expect(renderedCells).toBeGreaterThan(0);
    expect(renderedCells).toBeLessThan(40);
  });

  test('shows a localized error for an unsupported file', async ({ page }) => {
    await page.goto('/xlsx-viewer/ja/');
    await waitReady(page);
    await dropWorkbook(page, {
      b64: btoa('not a workbook'),
      name: 'notes.txt',
      type: 'text/plain',
    });

    await expect(page.getByTestId('error')).toContainText('notes.txt');
    await expect(page.getByTestId('xlsx-table')).toHaveCount(0);
  });

  test('shows a readable error for a damaged workbook', async ({ page }) => {
    await page.goto('/xlsx-viewer/');
    await waitReady(page);
    await dropWorkbook(page, {
      b64: btoa('not valid xlsx data'),
      name: 'damaged.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await expect(page.getByTestId('error')).toContainText('could not be read');
    await expect(page.getByTestId('xlsx-table')).toHaveCount(0);
  });
});
