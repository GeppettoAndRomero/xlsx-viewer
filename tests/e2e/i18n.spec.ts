import { test, expect } from '@playwright/test';
import { waitReady, viewWorkbook } from './_helpers';

// Content routing is engine-independent; one browser is enough.
test.describe('i18n', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'content routing (one engine)');
  });

  for (const loc of [
    { path: '/xlsx-viewer/', lang: 'en' },
    { path: '/xlsx-viewer/ja/', lang: 'ja' },
  ]) {
    test(`opens a workbook on the ${loc.lang} route (#5)`, async ({ page }) => {
      await page.goto(loc.path);
      await waitReady(page);
      await viewWorkbook(page);
    });
  }

  test('serves every locale with the correct <html lang>', async ({ page }) => {
    const expected: Array<[string, string]> = [
      ['/xlsx-viewer/', 'en'],
      ['/xlsx-viewer/ja/', 'ja'],
      ['/xlsx-viewer/zh/', 'zh-Hans'],
      ['/xlsx-viewer/de/', 'de'],
      ['/xlsx-viewer/es/', 'es'],
    ];
    for (const [path, lang] of expected) {
      await page.goto(path);
      expect(await page.getAttribute('html', 'lang'), `lang on ${path}`).toBe(lang);
    }
  });
});
