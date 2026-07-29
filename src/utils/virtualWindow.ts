/** Fixed-size windowing math shared by the row and column axes. */

export interface VirtualWindowInput {
  offset: number;
  viewportSize: number;
  itemSize: number;
  itemCount: number;
  overscan?: number;
}

export interface VirtualWindowResult {
  startIndex: number;
  endIndex: number;
  startPad: number;
  endPad: number;
  totalSize: number;
}

export function computeVirtualWindow({
  offset,
  viewportSize,
  itemSize,
  itemCount,
  overscan = 6,
}: VirtualWindowInput): VirtualWindowResult {
  const safeItemSize = itemSize > 0 ? itemSize : 1;
  const safeItemCount = Math.max(0, itemCount);
  const totalSize = safeItemCount * safeItemSize;

  if (safeItemCount === 0) {
    return { startIndex: 0, endIndex: 0, startPad: 0, endPad: 0, totalSize: 0 };
  }

  const clampedOffset = Math.max(0, Math.min(offset, totalSize));
  const firstVisible = Math.floor(clampedOffset / safeItemSize);
  const visibleCount = Math.max(1, Math.ceil(Math.max(0, viewportSize) / safeItemSize));
  const startIndex = Math.max(0, firstVisible - overscan);
  const endIndex = Math.min(
    safeItemCount,
    firstVisible + visibleCount + Math.max(0, overscan),
  );

  return {
    startIndex,
    endIndex,
    startPad: startIndex * safeItemSize,
    endPad: (safeItemCount - endIndex) * safeItemSize,
    totalSize,
  };
}
