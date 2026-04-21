import { describe, it, expect, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { computeListSliceRange } from '@jsonui/core'
import { JsonUI } from '../JsonUI/JsonUI.js'
import type { JsonUINode, OnStateExportProps } from '@jsonui/core'

describe('portability parity (main JsonUI)', () => {
  it('list pagination matches main defaults (full range when unset)', () => {
    const { indices } = computeListSliceRange({
      listDataLength: 5,
    })
    expect(indices).toEqual([0, 1, 2, 3, 4])
  })

  it('list pagination respects $page and $itemPerPage', () => {
    const { indices } = computeListSliceRange({
      listDataLength: 100,
      page: 1,
      itemPerPage: 3,
      listLength: 10,
    })
    expect(indices).toEqual([3, 4, 5])
  })

  it('onStateExport runs on unmount with store snapshot', async () => {
    const onStateExport = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    const model: JsonUINode = { $comp: 'View', $children: [] }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          defaultValues: { data: { x: 1 } },
          id: 'form-1',
          onStateExport,
        })
      )
    })

    await act(async () => {
      root.unmount()
    })

    expect(onStateExport).toHaveBeenCalledTimes(1)
    const arg = onStateExport.mock.calls[0][0] as OnStateExportProps
    expect(arg.id).toBe('form-1')
    expect(arg.formState).toBeDefined()
    expect((arg.formState as Record<string, unknown>).data).toEqual({ x: 1 })

    document.body.removeChild(container)
  })
})
