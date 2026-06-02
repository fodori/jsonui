import { describe, it, expect } from 'vitest'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { JsonUINode } from '@jsonui/core'
import { JsonUI } from '../JsonUI.js'

describe('computeRenderNodeSlotChildren – $child* prop naming', () => {
  it('passes $childLabel with the $ prefix to the component', async () => {
    const receivedProps: Record<string, unknown> = {}
    const Capture = (props: JsonUINode) => {
      Object.assign(receivedProps, props)
      return null
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'Capture',
      $childLabel: 'My Label',
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          components: { Capture },
        })
      )
    })

    expect(receivedProps['$childLabel']).toBe('My Label')
    expect(receivedProps['childLabel']).toBeUndefined()

    await act(async () => { root.unmount() })
    document.body.removeChild(container)
  })

  it('passes $childHelperText with the $ prefix to the component', async () => {
    const receivedProps: Record<string, unknown> = {}
    const Capture = (props: JsonUINode) => {
      Object.assign(receivedProps, props)
      return null
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'Capture',
      $childHelperText: 'Help text',
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          components: { Capture },
        })
      )
    })

    expect(receivedProps['$childHelperText']).toBe('Help text')
    expect(receivedProps['childHelperText']).toBeUndefined()

    await act(async () => { root.unmount() })
    document.body.removeChild(container)
  })

  it('passes multiple $child* slots, each with the $ prefix', async () => {
    const receivedProps: Record<string, unknown> = {}
    const Capture = (props: JsonUINode) => {
      Object.assign(receivedProps, props)
      return null
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'Capture',
      $childLabel: 'Label',
      $childHelperText: 'Helper',
      $childFooter: 'Footer',
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          components: { Capture },
        })
      )
    })

    expect(receivedProps['$childLabel']).toBe('Label')
    expect(receivedProps['$childHelperText']).toBe('Helper')
    expect(receivedProps['$childFooter']).toBe('Footer')
    // None of the $ signs should have been stripped
    expect(receivedProps['childLabel']).toBeUndefined()
    expect(receivedProps['childHelperText']).toBeUndefined()
    expect(receivedProps['childFooter']).toBeUndefined()

    await act(async () => { root.unmount() })
    document.body.removeChild(container)
  })

  it('$children (main slot) is passed as children, not as a prop', async () => {
    let receivedChildren: unknown
    const Capture = (props: JsonUINode & { children?: unknown }) => {
      receivedChildren = props.children
      return null
    }

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'Capture',
      $children: 'Hello world',
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          components: { Capture },
        })
      )
    })

    expect(receivedChildren).toBe('Hello world')

    await act(async () => { root.unmount() })
    document.body.removeChild(container)
  })
})
