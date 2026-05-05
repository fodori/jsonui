/**
 * JsonUI list pagination: maps `$page`, `$itemPerPage`, and `$listLength` to a slice of the backing list.
 *
 * Computes which indices belong on the current page. `page`, `itemPerPage`, and `listLength` are
 * coerced to non-negative integers; invalid or missing values use defaults (`page` → 0,
 * `itemPerPage` → effective list length, `listLength` → `realDataLength` when omitted).
 * If `page * itemPerPage` exceeds `listLength`, offset resets to 0 (parity with reference impl).
 *
 * @param args.realDataLength - Actual length of the list data in memory (caps defaults).
 * @param args.page - Zero-based page index from the model (`$page`).
 * @param args.itemPerPage - Page size from the model (`$itemPerPage`).
 * @param args.listLength - Logical list length from the model (`$listLength`); may differ from `realDataLength`.
 * @returns `offset` and `end` for half-open `[offset, end)` slicing, plus `indices` listing each index in range.
 * @see computeRenderNodeSlotChildren in @jsonui/react
 */
export interface ComputeListSliceRangeArgs {
  realDataLength: number
  page?: unknown
  itemPerPage?: unknown
  listLength?: unknown
}

export interface ComputeListSliceRangeResult {
  offset: number
  end: number
  indices: number[]
}

export function computeListSliceRange({
  realDataLength,
  page: pageRaw,
  itemPerPage: itemPerPageRaw,
  listLength: listLengthRaw,
}: ComputeListSliceRangeArgs): ComputeListSliceRangeResult {
  const coerceNonNegInt = (v: unknown, fallback: number): number => {
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0) return v
    return fallback
  }

  let listLength = coerceNonNegInt(listLengthRaw, realDataLength)
  if (listLengthRaw === undefined) {
    listLength = realDataLength
  }
  const itemPerPage = coerceNonNegInt(itemPerPageRaw, listLength)
  const page = coerceNonNegInt(pageRaw, 0)
  const offset = page * itemPerPage <= listLength ? page * itemPerPage : 0
  const end = Math.min(listLength, offset + itemPerPage)
  const indices: number[] = []
  for (let i = offset; i < end; i++) indices.push(i)
  return { offset, end, indices }
}
