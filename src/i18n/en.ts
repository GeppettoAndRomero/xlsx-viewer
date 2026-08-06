import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Excel Viewer — Open XLSX in Your Browser, No Upload | runlocally',
    description:
      'Open XLSX, XLSM, and XLS workbooks in your browser. Switch worksheets and scroll through cells in a read-only table without uploading the file.',
    ogTitle: 'Excel Viewer — Open Workbooks in Your Browser',
    ogDescription:
      'View XLSX, XLSM, and XLS worksheets locally in a read-only browser table. Your workbook is not uploaded.',
  },

  hero: {
    h1: 'Excel Workbook Viewer',
    tagline:
      'Open XLSX, XLSM, or XLS files in your browser, switch sheets, and inspect cells without uploading the workbook.',
  },

  intro: {
    h2: 'View an Excel workbook without an office suite',
    paras: [
      'This viewer opens one Excel workbook and presents each worksheet as a read-only table. Sheet tabs let you move between worksheets, while fixed row and column headings keep your place as you scroll.',
      'Rows and columns are windowed when a sheet is large, so only the visible part of the table is added to the page. Parsing still uses your device memory, and the practical workbook size depends on the browser and device.',
    ],
  },

  privacy: {
    h2: 'Workbook data stays in the browser',
    lead:
      'The file is read by SheetJS Community Edition in your browser. The viewer has no upload or server-side workbook processing step:',
    points: [
      'Workbook bytes are read from the file you select on your device.',
      'Worksheet values are turned into a table in the page.',
      'No request is made with your workbook data.',
      'The source code is available under the MIT license.',
    ],
    note:
      'You can inspect the browser Network panel while opening a workbook to verify that no request carries the file.',
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use the viewer',
    steps: [
      {
        h3: 'Choose one workbook',
        p: 'Select an XLSX, XLSM, or XLS file, or drop one onto the page.',
      },
      {
        h3: 'Choose a worksheet',
        p: 'Use the sheet tabs above the table to move between worksheets.',
      },
      {
        h3: 'Inspect the cells',
        p: 'Scroll vertically and horizontally through the read-only table. Close it when you want to open another workbook.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my workbook uploaded?',
      a: 'No. The workbook is parsed in your browser, and the viewer does not send its contents to a server. You can verify this in the browser Network panel.',
    },
    {
      q: 'Which Excel formats can I open?',
      a: 'The file picker accepts XLSX, XLSM, and legacy XLS workbooks. Password-protected, damaged, or unsupported workbook structures may not open.',
    },
    {
      q: 'How are formulas displayed?',
      a: 'The viewer displays the calculation result stored in the workbook. It does not recalculate formulas, so a result may be missing or out of date if the file was saved without a current cached value.',
    },
    {
      q: 'Can I edit or save the workbook?',
      a: 'No. This tool is for viewing only. It does not edit cells, run macros, or write a workbook file.',
    },
    {
      q: 'Can it show images embedded in a worksheet?',
      a: 'No. SheetJS Community Edition does not process embedded workbook images, so the viewer cannot preview them.',
    },
    {
      q: 'What happens with large worksheets?',
      a: 'The table renders a window of visible rows and columns instead of creating every cell in the page at once. Workbook parsing still uses device memory, so capacity varies by browser and device.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      'Built and maintained by Geppetto, with AI assistance used for parts of the code and copy.',
    securityText: 'Security',
  },

  related: {
    h2: 'Related tools',
    blogLinkText: 'Read the technical notes',
  },
};
