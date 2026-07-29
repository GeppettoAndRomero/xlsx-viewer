/**
 * The viewer is read-only and has no persisted user-adjustable settings.
 *
 * `ConversionSettings` is an open type only to keep the frozen, unmounted
 * SettingsPanel source type-safe. DEFAULT_SETTINGS contains no values and the
 * XLSX viewer does not load that panel.
 */
export interface ConversionSettings {
  // The index signature exists solely for the frozen SettingsPanel contract.
  readonly [legacyPanelField: string]: any;
}

export type ViewerSettings = ConversionSettings;
export type OutputFormat = string;
export type ResizeMode = string;

export const DEFAULT_SETTINGS: ConversionSettings = Object.freeze({});

export function validateSettings(_settings: ConversionSettings): {
  valid: boolean;
  errors: Record<string, string>;
} {
  return { valid: true, errors: {} };
}
