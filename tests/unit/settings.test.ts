import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, validateSettings } from '@/utils/settings';

describe('viewer settings', () => {
  it('has no user-adjustable settings', () => {
    expect(DEFAULT_SETTINGS).toEqual({});
    expect(Object.isFrozen(DEFAULT_SETTINGS)).toBe(true);
  });

  it('accepts the empty settings object', () => {
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({ valid: true, errors: {} });
  });
});
