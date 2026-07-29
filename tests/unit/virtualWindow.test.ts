import { describe, expect, it } from 'vitest';
import { computeVirtualWindow } from '@/utils/virtualWindow';

describe('computeVirtualWindow', () => {
  it('returns a bounded window and matching spacer sizes', () => {
    expect(
      computeVirtualWindow({
        offset: 500,
        viewportSize: 100,
        itemSize: 20,
        itemCount: 100,
        overscan: 2,
      }),
    ).toEqual({
      startIndex: 23,
      endIndex: 32,
      startPad: 460,
      endPad: 1360,
      totalSize: 2000,
    });
  });

  it('handles an empty axis', () => {
    expect(
      computeVirtualWindow({
        offset: 0,
        viewportSize: 100,
        itemSize: 20,
        itemCount: 0,
      }),
    ).toEqual({
      startIndex: 0,
      endIndex: 0,
      startPad: 0,
      endPad: 0,
      totalSize: 0,
    });
  });

  it('clamps negative and out-of-range offsets', () => {
    const atStart = computeVirtualWindow({
      offset: -20,
      viewportSize: 40,
      itemSize: 10,
      itemCount: 10,
      overscan: 0,
    });
    const atEnd = computeVirtualWindow({
      offset: 1000,
      viewportSize: 40,
      itemSize: 10,
      itemCount: 10,
      overscan: 0,
    });
    expect(atStart.startIndex).toBe(0);
    expect(atEnd.startIndex).toBe(10);
    expect(atEnd.endIndex).toBe(10);
  });
});
