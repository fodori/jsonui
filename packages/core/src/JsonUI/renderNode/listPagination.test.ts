import { describe, it, expect } from 'vitest'
import { computeListSliceRange } from './listPagination.js'

describe('computeListSliceRange', () => {
  it('page 0 with itemPerPage slices from the start', () => {
    expect(
      computeListSliceRange({
        listDataLength: 100,
        page: 0,
        itemPerPage: 3,
        listLength: 10,
      })
    ).toEqual({ offset: 0, end: 3, indices: [0, 1, 2] })
  })

  it('page 0 is the default when page is omitted', () => {
    expect(
      computeListSliceRange({
        listDataLength: 5,
        itemPerPage: 2,
        listLength: 5,
      })
    ).toEqual({ offset: 0, end: 2, indices: [0, 1] })
  })

  it('last page can be a short remainder', () => {
    expect(
      computeListSliceRange({
        listDataLength: 20,
        page: 3,
        itemPerPage: 3,
        listLength: 10,
      })
    ).toEqual({ offset: 9, end: 10, indices: [9] })
  })

  it('when page * itemPerPage exceeds listLength, offset resets to 0', () => {
    expect(
      computeListSliceRange({
        listDataLength: 100,
        page: 5,
        itemPerPage: 3,
        listLength: 10,
      })
    ).toEqual({ offset: 0, end: 3, indices: [0, 1, 2] })
  })

  it('non-integer or negative page coerces to 0', () => {
    expect(
      computeListSliceRange({
        listDataLength: 10,
        page: -1,
        itemPerPage: 2,
        listLength: 10,
      }).indices
    ).toEqual([0, 1])
    expect(
      computeListSliceRange({
        listDataLength: 10,
        page: 1.5,
        itemPerPage: 2,
        listLength: 10,
      }).indices
    ).toEqual([0, 1])
    expect(
      computeListSliceRange({
        listDataLength: 10,
        page: 'nope',
        itemPerPage: 2,
        listLength: 10,
      }).indices
    ).toEqual([0, 1])
  })

  it('non-integer or negative itemPerPage falls back to listLength', () => {
    const full = [0, 1, 2, 3, 4]
    expect(
      computeListSliceRange({
        listDataLength: 5,
        page: 0,
        itemPerPage: -2,
        listLength: 5,
      }).indices
    ).toEqual(full)
    expect(
      computeListSliceRange({
        listDataLength: 5,
        page: 0,
        itemPerPage: 2.5,
        listLength: 5,
      }).indices
    ).toEqual(full)
  })

  it('listLength caps the slice even when listDataLength is larger', () => {
    expect(
      computeListSliceRange({
        listDataLength: 100,
        page: 0,
        itemPerPage: 20,
        listLength: 4,
      })
    ).toEqual({ offset: 0, end: 4, indices: [0, 1, 2, 3] })
  })

  it('omitted listLength uses listDataLength', () => {
    expect(
      computeListSliceRange({
        listDataLength: 4,
        page: 0,
        itemPerPage: 10,
      })
    ).toEqual({ offset: 0, end: 4, indices: [0, 1, 2, 3] })
  })

  it('empty logical list yields empty indices', () => {
    expect(
      computeListSliceRange({
        listDataLength: 0,
        page: 0,
        itemPerPage: 5,
        listLength: 0,
      })
    ).toEqual({ offset: 0, end: 0, indices: [] })
  })
})
