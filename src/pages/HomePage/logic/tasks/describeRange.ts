type RangeInput = {
  firstIndex: number
  pageItemCount: number
  total: number
}

/** "Showing 4–6 of 10". */
export function describeRange({
  firstIndex,
  pageItemCount,
  total,
}: RangeInput): string {
  return `Showing ${firstIndex + 1}–${firstIndex + pageItemCount} of ${total}`
}
