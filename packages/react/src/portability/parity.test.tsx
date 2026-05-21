/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi } from 'vitest'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { computeListSliceRange } from '@jsonui/core'
import { JsonUI } from '../JsonUI/JsonUI.js'
import type { JSONParams, JsonUINode, OnStateExportProps } from '@jsonui/core'

const renderJsonUINoThrow = async (model: JsonUINode): Promise<unknown> => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  let thrown: unknown
  try {
    await act(async () => {
      root.render(createElement(JsonUI, { model }))
    })
  } catch (error) {
    thrown = error
  }

  await act(async () => {
    root.unmount()
  })
  document.body.removeChild(container)
  return thrown
}

const malformedModels: Array<{ name: string; model: JsonUINode }> = [
  { name: 'null model', model: null as any },
  { name: 'string model', model: 'not-an-object' as any },
  { name: 'number model', model: 123 as any },
  { name: 'array root model', model: [] as any },
  { name: 'empty object without $comp', model: {} },
  { name: '$comp missing but has props', model: { value: 'x', onClick: { $action: 'set' } } },
  { name: '$comp null', model: { $comp: null } },
  { name: '$comp number', model: { $comp: 99 } },
  { name: '$comp object', model: { $comp: { name: 'View' } } },
  { name: '$comp array', model: { $comp: ['View'] } },
  { name: 'unknown component name', model: { $comp: 'NoSuchComponent' } },
  { name: '$children object without $comp', model: { $comp: 'View', $children: { foo: 'bar' } } },
  { name: '$children deeply mixed array', model: { $comp: 'View', $children: [1, true, null, { x: 1 }, [{ y: 2 }]] } },
  { name: 'style is string', model: { $comp: 'View', style: 'bad' } },
  { name: 'style is array', model: { $comp: 'View', style: [] } },
  { name: 'style is number', model: { $comp: 'View', style: 42 } },
  { name: 'onClick is primitive', model: { $comp: 'Button', onClick: 'noop' } },
  {
    name: 'onChange mixed action array',
    model: { $comp: 'Edit', onChange: ['x', 1, null, { $action: 'set', store: 'data', path: '/name' }] },
  },
  { name: 'value malformed modifier payload', model: { $comp: 'Edit', value: { $modifier: 1, store: 12, path: null } } },
  { name: 'onChange malformed action payload', model: { $comp: 'Edit', onChange: { $action: { name: 'set' }, store: [], path: {} } } },
  {
    name: 'pathModifiers null store spec',
    model: { $comp: 'View', $pathModifiers: { data: null }, $children: { $comp: 'Text', $children: 'x' } },
  },
  {
    name: 'pathModifiers non-object root',
    model: { $comp: 'View', $pathModifiers: 22, $children: { $comp: 'Text', $children: 'x' } },
  },
  {
    name: 'malformed $translate as array',
    model: { $comp: 'View', $translate: [] },
  },
  {
    name: 'malformed $translate table values',
    model: { $comp: 'View', $translate: { en: 'bad-shape', hu: 12 } },
  },
  {
    name: 'invalid $validations non-array',
    model: { $comp: 'View', $validations: { store: 'data' } },
  },
  {
    name: 'invalid $validations rule entries',
    model: { $comp: 'View', $validations: [null, 12, 'x', { path: 1 }] },
  },
  {
    name: 'list model missing usable path modifiers',
    model: {
      $comp: 'View',
      $isList: true,
      $listItem: { $comp: 'Text', $children: 'item' },
      $pathModifiers: {},
    },
  },
  {
    name: 'list model with non-object path modifier entry',
    model: {
      $comp: 'View',
      $isList: true,
      $listItem: { $comp: 'Text', $children: 'item' },
      $pathModifiers: { data: 1 },
    },
  },
  {
    name: 'list model with null list item',
    model: {
      $comp: 'View',
      $isList: true,
      $listItem: null,
      $pathModifiers: { data: { path: '/rows' } },
    },
  },
  {
    name: 'slot list with malformed modifier shape',
    model: {
      $comp: 'View',
      $childLabel: {
        $isList: true,
        $listItem: { $comp: 'Text', $children: 'label' },
        $pathModifiers: { data: { wrong: true } },
      },
    },
  },
]

describe('portability parity (main JsonUI)', () => {
  it('list pagination matches main defaults (full range when unset)', () => {
    const { indices } = computeListSliceRange({
      realDataLength: 5,
    })
    expect(indices).toEqual([0, 1, 2, 3, 4])
  })

  it('list pagination respects $page and $itemPerPage', () => {
    const { indices } = computeListSliceRange({
      realDataLength: 100,
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
    expect((arg.formState as JSONParams).data).toEqual({ x: 1 })

    document.body.removeChild(container)
  })

  it('does not crash when components is malformed at runtime', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = { $comp: 'View', $children: 'safe' }

    let thrown: unknown
    try {
      await act(async () => {
        root.render(
          createElement(JsonUI, {
            model,
            components: {},
          })
        )
      })
    } catch (error) {
      thrown = error
    }

    expect(thrown).toBeUndefined()

    await act(async () => {
      root.unmount()
    })
    document.body.removeChild(container)
  })

  it('does not crash for malformed list path modifiers', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model = {
      $comp: 'View',
      $isList: true,
      $listItem: { $comp: 'Text', $children: 'item' },
      $pathModifiers: {},
    }

    let thrown: unknown
    try {
      await act(async () => {
        root.render(createElement(JsonUI, { model }))
      })
    } catch (error) {
      thrown = error
    }

    expect(thrown).toBeUndefined()

    await act(async () => {
      root.unmount()
    })
    document.body.removeChild(container)
  })

  it.each(malformedModels)('does not crash for malformed model: $name', async ({ model }) => {
    const thrown = await renderJsonUINoThrow(model)
    expect(thrown).toBeUndefined()
  })
})
