import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { validateFile } from '@/utils/fileValidation';
import {
  openWorkbook,
  WorkbookViewerError,
  type SheetView,
  type WorkbookView,
} from '@/utils/xlsxViewerEngine';
import { computeVirtualWindow } from '@/utils/virtualWindow';

const ROW_HEIGHT = 34;
const COLUMN_WIDTH = 160;
const ROW_GUTTER_WIDTH = 64;
const ROW_VIRTUALIZE_THRESHOLD = 200;
const COLUMN_VIRTUALIZE_THRESHOLD = 40;

interface Copy {
  uploadHeading: string;
  uploadSubtitle: string;
  dropClick: string;
  dropOr: string;
  dropSupported: string;
  loading: string;
  errorWrongType: string;
  errorMultiple: string;
  errorRead: string;
  errorEmptyWorkbook: string;
  errorMissingSheet: string;
  fileLabel: string;
  sheetLabel: string;
  rowCount: string;
  colCount: string;
  tableLabel: string;
  sheetsLabel: string;
  rowNumberHeader: string;
  columnLabel: string;
  loadAnother: string;
  close: string;
  noCells: string;
  readOnlyNote: string;
}

const copy: Record<string, Copy> = {
  en: {
    uploadHeading: 'Open an Excel workbook',
    uploadSubtitle: 'View one workbook in your browser. The workbook is not uploaded.',
    dropClick: 'Choose a workbook',
    dropOr: 'or drop one anywhere on the page',
    dropSupported: 'Supported: XLSX, XLSM, XLS',
    loading: 'Opening workbook…',
    errorWrongType: '{name} is not an XLSX, XLSM, or XLS workbook.',
    errorMultiple: 'Choose one workbook at a time.',
    errorRead: 'The workbook could not be read. It may be damaged, encrypted, or use an unsupported feature.',
    errorEmptyWorkbook: 'The workbook does not contain any worksheets.',
    errorMissingSheet: 'The selected worksheet could not be found.',
    fileLabel: 'File',
    sheetLabel: 'Sheet',
    rowCount: 'Rows',
    colCount: 'Columns',
    tableLabel: 'Workbook cells',
    sheetsLabel: 'Workbook sheets',
    rowNumberHeader: 'Row',
    columnLabel: 'Column',
    loadAnother: 'Open another workbook',
    close: 'Close viewer',
    noCells: 'This worksheet has no cells to display.',
    readOnlyNote: 'Read-only view. Editing, saving, and embedded image previews are not available.',
  },
  ja: {
    uploadHeading: 'Excel ブックを開く',
    uploadSubtitle: '1 件のブックをブラウザ内で閲覧します。ファイルはアップロードされません。',
    dropClick: 'ブックを選ぶ',
    dropOr: 'またはページ上に 1 件ドロップ',
    dropSupported: '対応形式: XLSX、XLSM、XLS',
    loading: 'ブックを開いています…',
    errorWrongType: '{name} は XLSX・XLSM・XLS 形式のブックではありません。',
    errorMultiple: '一度に選べるブックは 1 件です。',
    errorRead: 'ブックを読み取れませんでした。破損、暗号化、未対応の機能が原因の可能性があります。',
    errorEmptyWorkbook: 'このブックにはワークシートがありません。',
    errorMissingSheet: '選択したワークシートが見つかりません。',
    fileLabel: 'ファイル',
    sheetLabel: 'シート',
    rowCount: '行',
    colCount: '列',
    tableLabel: 'ブックのセル',
    sheetsLabel: 'ブックのシート',
    rowNumberHeader: '行',
    columnLabel: '列',
    loadAnother: '別のブックを開く',
    close: 'ビューアーを閉じる',
    noCells: 'このシートには表示できるセルがありません。',
    readOnlyNote: '閲覧専用です。編集、保存、埋め込み画像のプレビューには対応していません。',
  },
  zh: {
    uploadHeading: '打开 Excel 工作簿',
    uploadSubtitle: '在浏览器中查看一个工作簿。文件不会上传。',
    dropClick: '选择工作簿',
    dropOr: '或将一个文件拖到页面任意位置',
    dropSupported: '支持：XLSX、XLSM、XLS',
    loading: '正在打开工作簿…',
    errorWrongType: '{name} 不是 XLSX、XLSM 或 XLS 工作簿。',
    errorMultiple: '每次请选择一个工作簿。',
    errorRead: '无法读取工作簿。文件可能已损坏、已加密，或使用了不支持的功能。',
    errorEmptyWorkbook: '此工作簿不包含工作表。',
    errorMissingSheet: '找不到所选工作表。',
    fileLabel: '文件',
    sheetLabel: '工作表',
    rowCount: '行',
    colCount: '列',
    tableLabel: '工作簿单元格',
    sheetsLabel: '工作簿中的工作表',
    rowNumberHeader: '行',
    columnLabel: '列',
    loadAnother: '打开另一个工作簿',
    close: '关闭查看器',
    noCells: '此工作表中没有可显示的单元格。',
    readOnlyNote: '仅供查看。不支持编辑、保存或预览嵌入的图片。',
  },
  de: {
    uploadHeading: 'Excel-Arbeitsmappe öffnen',
    uploadSubtitle: 'Zeige eine Arbeitsmappe im Browser an. Die Datei wird nicht hochgeladen.',
    dropClick: 'Arbeitsmappe auswählen',
    dropOr: 'oder eine Datei auf der Seite ablegen',
    dropSupported: 'Unterstützt: XLSX, XLSM, XLS',
    loading: 'Arbeitsmappe wird geöffnet…',
    errorWrongType: '{name} ist keine XLSX-, XLSM- oder XLS-Arbeitsmappe.',
    errorMultiple: 'Bitte wähle jeweils eine Arbeitsmappe aus.',
    errorRead: 'Die Arbeitsmappe konnte nicht gelesen werden. Sie ist möglicherweise beschädigt, verschlüsselt oder verwendet eine nicht unterstützte Funktion.',
    errorEmptyWorkbook: 'Diese Arbeitsmappe enthält keine Tabellenblätter.',
    errorMissingSheet: 'Das ausgewählte Tabellenblatt wurde nicht gefunden.',
    fileLabel: 'Datei',
    sheetLabel: 'Tabelle',
    rowCount: 'Zeilen',
    colCount: 'Spalten',
    tableLabel: 'Zellen der Arbeitsmappe',
    sheetsLabel: 'Tabellenblätter',
    rowNumberHeader: 'Zeile',
    columnLabel: 'Spalte',
    loadAnother: 'Andere Arbeitsmappe öffnen',
    close: 'Ansicht schließen',
    noCells: 'Dieses Tabellenblatt enthält keine anzeigbaren Zellen.',
    readOnlyNote: 'Nur zur Ansicht. Bearbeiten, Speichern und die Vorschau eingebetteter Bilder sind nicht verfügbar.',
  },
  es: {
    uploadHeading: 'Abrir un libro de Excel',
    uploadSubtitle: 'Consulta un libro en el navegador. El archivo no se sube.',
    dropClick: 'Seleccionar un libro',
    dropOr: 'o soltar uno en cualquier parte de la página',
    dropSupported: 'Formatos admitidos: XLSX, XLSM, XLS',
    loading: 'Abriendo el libro…',
    errorWrongType: '{name} no es un libro XLSX, XLSM o XLS.',
    errorMultiple: 'Selecciona un solo libro cada vez.',
    errorRead: 'No se pudo leer el libro. Puede estar dañado, cifrado o usar una función no compatible.',
    errorEmptyWorkbook: 'El libro no contiene hojas.',
    errorMissingSheet: 'No se encontró la hoja seleccionada.',
    fileLabel: 'Archivo',
    sheetLabel: 'Hoja',
    rowCount: 'Filas',
    colCount: 'Columnas',
    tableLabel: 'Celdas del libro',
    sheetsLabel: 'Hojas del libro',
    rowNumberHeader: 'Fila',
    columnLabel: 'Columna',
    loadAnother: 'Abrir otro libro',
    close: 'Cerrar el visor',
    noCells: 'Esta hoja no contiene celdas para mostrar.',
    readOnlyNote: 'Vista de solo lectura. No permite editar, guardar ni previsualizar imágenes incrustadas.',
  },
};

type ViewStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ConversionManagerProps {
  locale?: string;
}

function columnName(index: number): string {
  let value = index + 1;
  let label = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

function nextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t = copy[locale] ?? copy.en;
  const [status, setStatus] = useState<ViewStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [workbook, setWorkbook] = useState<WorkbookView | null>(null);
  const [sheet, setSheet] = useState<SheetView | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(480);
  const [viewportWidth, setViewportWidth] = useState(960);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);

  const finishGlobalDrop = useCallback(() => {
    window.dispatchEvent(new CustomEvent('filesProcessed'));
  }, []);

  const resetScroll = useCallback(() => {
    setScrollTop(0);
    setScrollLeft(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setStatus('idle');
    setErrorMessage('');
    setFileName('');
    setWorkbook(null);
    setSheet(null);
    resetScroll();
    const input = document.getElementById('xlsx-file-input') as HTMLInputElement | null;
    if (input) input.value = '';
  }, [resetScroll]);

  const localizedEngineError = useCallback(
    (error: unknown): string => {
      if (error instanceof WorkbookViewerError) {
        if (error.code === 'emptyWorkbook') return t.errorEmptyWorkbook;
        if (error.code === 'missingSheet') return t.errorMissingSheet;
      }
      return t.errorRead;
    },
    [t],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      const requestId = ++requestIdRef.current;
      try {
        if (files.length === 0) return;
        if (files.length !== 1) {
          setStatus('error');
          setErrorMessage(t.errorMultiple);
          setWorkbook(null);
          setSheet(null);
          return;
        }

        const file = files[0];
        if (!validateFile(file).valid) {
          setStatus('error');
          setErrorMessage(t.errorWrongType.replace('{name}', file.name));
          setWorkbook(null);
          setSheet(null);
          return;
        }

        setStatus('loading');
        setErrorMessage('');
        setFileName(file.name);
        setWorkbook(null);
        setSheet(null);
        resetScroll();
        await nextPaint();

        const loaded = await openWorkbook(file);
        const firstSheet = loaded.readSheet(loaded.sheetNames[0]);
        if (requestId !== requestIdRef.current) return;

        setWorkbook(loaded);
        setSheet(firstSheet);
        setStatus('ready');
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        setWorkbook(null);
        setSheet(null);
        setStatus('error');
        setErrorMessage(localizedEngineError(error));
      } finally {
        finishGlobalDrop();
      }
    },
    [finishGlobalDrop, localizedEngineError, resetScroll, t],
  );

  const selectSheet = useCallback(
    (name: string) => {
      if (!workbook || sheet?.name === name) return;
      try {
        setSheet(workbook.readSheet(name));
        setErrorMessage('');
        setStatus('ready');
        resetScroll();
      } catch (error) {
        setErrorMessage(localizedEngineError(error));
        setStatus('error');
      }
    },
    [localizedEngineError, resetScroll, sheet?.name, workbook],
  );

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      void handleFiles((event as CustomEvent<File[]>).detail ?? []);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || status !== 'ready') return;
    const measure = () => {
      setViewportHeight(element.clientHeight || 480);
      setViewportWidth(element.clientWidth || 960);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [status, sheet?.name]);

  const rowCount = sheet?.rowCount ?? 0;
  const columnCount = sheet?.columnCount ?? 0;
  const rowWindow =
    rowCount > ROW_VIRTUALIZE_THRESHOLD
      ? computeVirtualWindow({
          offset: scrollTop,
          viewportSize: viewportHeight,
          itemSize: ROW_HEIGHT,
          itemCount: rowCount,
        })
      : {
          startIndex: 0,
          endIndex: rowCount,
          startPad: 0,
          endPad: 0,
          totalSize: rowCount * ROW_HEIGHT,
        };
  const columnWindow =
    columnCount > COLUMN_VIRTUALIZE_THRESHOLD
      ? computeVirtualWindow({
          offset: Math.max(0, scrollLeft - ROW_GUTTER_WIDTH),
          viewportSize: Math.max(0, viewportWidth - ROW_GUTTER_WIDTH),
          itemSize: COLUMN_WIDTH,
          itemCount: columnCount,
          overscan: 3,
        })
      : {
          startIndex: 0,
          endIndex: columnCount,
          startPad: 0,
          endPad: 0,
          totalSize: columnCount * COLUMN_WIDTH,
        };

  const visibleRows = sheet?.rows.slice(rowWindow.startIndex, rowWindow.endIndex) ?? [];
  const visibleColumns = Array.from(
    { length: columnWindow.endIndex - columnWindow.startIndex },
    (_, index) => columnWindow.startIndex + index,
  );
  const hasLeftPad = columnWindow.startPad > 0;
  const hasRightPad = columnWindow.endPad > 0;
  const renderedColumnCount =
    1 + visibleColumns.length + Number(hasLeftPad) + Number(hasRightPad);
  const tableWidth = ROW_GUTTER_WIDTH + columnWindow.totalSize;

  const onPick = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    void handleFiles(Array.from(input.files ?? []));
    input.value = '';
  };

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          class="xlsx-dropzone"
          onClick={() => document.getElementById('xlsx-file-input')?.click()}
        >
          <span class="xlsx-dropzone__icon" aria-hidden="true">📊</span>
          <span class="xlsx-dropzone__title">{t.dropClick}</span>
          <span class="xlsx-dropzone__hint">{t.dropOr}</span>
          <span class="xlsx-dropzone__hint">{t.dropSupported}</span>
        </button>
        <input
          id="xlsx-file-input"
          type="file"
          accept=".xlsx,.xlsm,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel"
          onChange={onPick}
          style="display: none;"
        />
      </AppCard>

      {status === 'loading' && (
        <div class="xlsx-status" role="status" aria-live="polite" data-testid="loading">
          <span class="xlsx-spinner" aria-hidden="true" />
          {t.loading}
        </div>
      )}

      {status === 'error' && (
        <div class="xlsx-error" role="alert" data-testid="error">
          <span aria-hidden="true">⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {status === 'ready' && workbook && sheet && (
        <section class="xlsx-viewer" aria-label={t.tableLabel}>
          <div class="xlsx-toolbar">
            <div class="xlsx-meta">
              <span title={fileName}>
                {t.fileLabel}: <strong data-testid="file-name">{fileName}</strong>
              </span>
              <span>
                {t.sheetLabel}: <strong data-testid="sheet-name">{sheet.name}</strong>
              </span>
              <span>
                {t.rowCount}: <strong class="num" data-testid="row-count">{String(rowCount)}</strong>
              </span>
              <span>
                {t.colCount}: <strong class="num" data-testid="col-count">{String(columnCount)}</strong>
              </span>
            </div>
            <button
              type="button"
              class="xlsx-close"
              onClick={reset}
              aria-label={t.close}
              title={t.close}
              data-testid="close-viewer"
            >
              ×
            </button>
          </div>

          <div class="xlsx-sheet-tabs" role="tablist" aria-label={t.sheetsLabel}>
            {workbook.sheetNames.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={name === sheet.name}
                class={name === sheet.name ? 'xlsx-sheet-tab is-active' : 'xlsx-sheet-tab'}
                onClick={() => selectSheet(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <p class="xlsx-readonly-note">{t.readOnlyNote}</p>

          {rowCount === 0 || columnCount === 0 ? (
            <div class="xlsx-empty" data-testid="empty-sheet">{t.noCells}</div>
          ) : (
            <div
              class="xlsx-table-scroll"
              ref={scrollRef}
              role="region"
              aria-label={`${t.tableLabel}: ${sheet.name}`}
              tabIndex={0}
              onScroll={(event) => {
                setScrollTop(event.currentTarget.scrollTop);
                setScrollLeft(event.currentTarget.scrollLeft);
              }}
            >
              <table
                class="xlsx-table"
                data-testid="xlsx-table"
                style={{ width: `${Math.max(tableWidth, viewportWidth)}px` }}
              >
                <thead>
                  <tr>
                    <th
                      class="xlsx-table__gutter"
                      scope="col"
                      style={{ width: `${ROW_GUTTER_WIDTH}px` }}
                    >
                      <span class="visually-hidden">{t.rowNumberHeader}</span>
                    </th>
                    {hasLeftPad && (
                      <th
                        class="xlsx-table__pad"
                        aria-hidden="true"
                        style={{ width: `${columnWindow.startPad}px` }}
                      />
                    )}
                    {visibleColumns.map((columnIndex) => (
                      <th
                        key={columnIndex}
                        scope="col"
                        title={`${t.columnLabel} ${columnName(columnIndex)}`}
                        style={{ width: `${COLUMN_WIDTH}px` }}
                      >
                        {columnName(columnIndex)}
                      </th>
                    ))}
                    {hasRightPad && (
                      <th
                        class="xlsx-table__pad"
                        aria-hidden="true"
                        style={{ width: `${columnWindow.endPad}px` }}
                      />
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rowWindow.startPad > 0 && (
                    <tr class="xlsx-table__spacer" aria-hidden="true">
                      <td
                        colSpan={renderedColumnCount}
                        style={{ height: `${rowWindow.startPad}px` }}
                      />
                    </tr>
                  )}
                  {visibleRows.map((row, visibleRowIndex) => {
                    const rowIndex = rowWindow.startIndex + visibleRowIndex;
                    return (
                      <tr key={rowIndex} data-row>
                        <th class="xlsx-table__gutter" scope="row">
                          {String(rowIndex + 1)}
                        </th>
                        {hasLeftPad && (
                          <td
                            class="xlsx-table__pad"
                            aria-hidden="true"
                            style={{ width: `${columnWindow.startPad}px` }}
                          />
                        )}
                        {visibleColumns.map((columnIndex) => {
                          const value = row[columnIndex] ?? '';
                          return (
                            <td
                              key={columnIndex}
                              title={value}
                              style={{ width: `${COLUMN_WIDTH}px` }}
                            >
                              {value}
                            </td>
                          );
                        })}
                        {hasRightPad && (
                          <td
                            class="xlsx-table__pad"
                            aria-hidden="true"
                            style={{ width: `${columnWindow.endPad}px` }}
                          />
                        )}
                      </tr>
                    );
                  })}
                  {rowWindow.endPad > 0 && (
                    <tr class="xlsx-table__spacer" aria-hidden="true">
                      <td
                        colSpan={renderedColumnCount}
                        style={{ height: `${rowWindow.endPad}px` }}
                      />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div class="xlsx-actions">
            <AppButton
              variant="secondary"
              onClick={() => document.getElementById('xlsx-file-input')?.click()}
            >
              {t.loadAnother}
            </AppButton>
          </div>
        </section>
      )}

      <style>{`
        .xlsx-dropzone {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-6);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text);
          font: inherit;
          cursor: pointer;
        }
        .xlsx-dropzone:hover, .xlsx-dropzone:focus-visible {
          border-color: var(--color-primary);
          background: var(--color-primary-alpha);
        }
        .xlsx-dropzone:focus-visible, .xlsx-close:focus-visible, .xlsx-sheet-tab:focus-visible {
          outline: 3px solid var(--color-primary);
          outline-offset: 2px;
        }
        .xlsx-dropzone__icon { font-size: 3rem; line-height: 1; }
        .xlsx-dropzone__title { font-size: var(--fs-3); font-weight: 600; }
        .xlsx-dropzone__hint { font-size: var(--fs-1); color: var(--color-subtle); }
        .xlsx-status, .xlsx-error {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-top: var(--space-5);
          padding: var(--space-4);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
        }
        .xlsx-error {
          border-color: var(--color-danger);
          color: var(--color-danger);
        }
        .xlsx-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: xlsx-spin 0.8s linear infinite;
        }
        .xlsx-viewer {
          margin-top: var(--space-6);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-surface);
          box-shadow: var(--shadow-1);
        }
        .xlsx-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }
        .xlsx-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2) var(--space-5);
          min-width: 0;
          font-size: var(--fs-2);
        }
        .xlsx-meta span:first-child {
          min-width: 0;
          max-width: 28rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .xlsx-close {
          flex: 0 0 auto;
          width: 2.25rem;
          height: 2.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-text);
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
        }
        .xlsx-sheet-tabs {
          display: flex;
          gap: var(--space-1);
          padding: var(--space-2) var(--space-4) 0;
          overflow-x: auto;
          border-bottom: 1px solid var(--color-border);
        }
        .xlsx-sheet-tab {
          flex: 0 0 auto;
          padding: var(--space-2) var(--space-4);
          border: 1px solid transparent;
          border-bottom: 0;
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          background: transparent;
          color: var(--color-subtle);
          font: inherit;
          cursor: pointer;
        }
        .xlsx-sheet-tab.is-active {
          border-color: var(--color-border);
          background: var(--color-bg);
          color: var(--color-text);
          font-weight: 600;
        }
        .xlsx-readonly-note {
          margin: 0;
          padding: var(--space-3) var(--space-4);
          color: var(--color-subtle);
          font-size: var(--fs-1);
          border-bottom: 1px solid var(--color-border);
        }
        .xlsx-table-scroll {
          height: min(62vh, 42rem);
          min-height: 20rem;
          overflow: auto;
          background: var(--color-bg);
        }
        .xlsx-table {
          table-layout: fixed;
          border-collapse: separate;
          border-spacing: 0;
          background: var(--color-surface);
          font-size: var(--fs-2);
        }
        .xlsx-table tr { height: ${ROW_HEIGHT}px; }
        .xlsx-table th, .xlsx-table td {
          box-sizing: border-box;
          height: ${ROW_HEIGHT}px;
          padding: 0 var(--space-3);
          overflow: hidden;
          border-right: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: var(--color-surface);
        }
        .xlsx-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: var(--color-bg);
          text-align: center;
        }
        .xlsx-table .xlsx-table__gutter {
          position: sticky;
          left: 0;
          z-index: 1;
          width: ${ROW_GUTTER_WIDTH}px;
          min-width: ${ROW_GUTTER_WIDTH}px;
          max-width: ${ROW_GUTTER_WIDTH}px;
          padding: 0 var(--space-2);
          background: var(--color-bg);
          color: var(--color-subtle);
          text-align: right;
          font-weight: 500;
        }
        .xlsx-table thead .xlsx-table__gutter { z-index: 3; }
        .xlsx-table .xlsx-table__pad {
          padding: 0;
          border-right: 0;
        }
        .xlsx-table__spacer { height: auto !important; }
        .xlsx-table__spacer td {
          height: 0;
          padding: 0;
          border: 0;
          background: transparent;
        }
        .xlsx-empty {
          padding: var(--space-6);
          color: var(--color-subtle);
          text-align: center;
        }
        .xlsx-actions {
          display: flex;
          justify-content: flex-end;
          padding: var(--space-4);
          border-top: 1px solid var(--color-border);
        }
        @keyframes xlsx-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .xlsx-toolbar { align-items: center; }
          .xlsx-meta { flex-direction: column; gap: var(--space-1); }
          .xlsx-table-scroll { height: 58vh; min-height: 18rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .xlsx-spinner { animation: none; }
        }
      `}</style>
    </div>
  );
}
