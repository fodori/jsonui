import { describe, it, expect } from 'vitest'
import { act, createElement, useRef, type ComponentType } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { FormStore, type JsonUINode } from '@jsonui/core'
import { JsonUI } from './JsonUI/JsonUI.js'
import { builtinComponents, Edit } from './components/index.js'

/** Mirrors 2jsonui `input.test.tsx`: bound `Edit`
 * (`$modifier` get + `$action` set on `data/age`)
 * and a wrapped Edit + render counter. Waits for async node
 * resolution before touching the DOM. */

const setNativeInputValue = (el: HTMLInputElement, value: string): void => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(el, value)
}

const fireInputChange = (el: HTMLInputElement, value: string): void => {
  setNativeInputValue(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

async function flushResolutions(): Promise<void> {
  await act(async () => {
    await new Promise<void>((r) => {
      queueMicrotask(r)
    })
  })
}

async function findTextbox(container: HTMLElement, timeoutMs = 5000): Promise<HTMLInputElement> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await flushResolutions()
    const el = container.querySelector('input[type="text"], input:not([type])')
    if (el instanceof HTMLInputElement) return el
  }
  throw new Error('timed out waiting for text input')
}

describe('JsonUI Edit input binding', () => {
  it('Edit reads and writes bound store path like 2jsonui input test', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'Edit',
      id: 'id1',
      name: 'id1',
      style: { textAlign: 'center', fontSize: 30, margin: 5 },
      value: { $modifier: 'get', store: 'data', path: '/age' },
      onChange: { $action: 'set', store: 'data', path: '/age' },
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          defaultValues: { data: { age: '' } },
        })
      )
    })

    const input = await findTextbox(container)
    expect(input.value).toBe('')

    await act(async () => {
      fireInputChange(input, 'test@example.com')
    })

    await flushResolutions()
    expect(input.value).toBe('test@example.com')

    await act(async () => {
      root.unmount()
    })
    document.body.removeChild(container)
  })

  it('increments render counter after bound change (2jsonui-style)', async () => {
    const Counter = () => {
      const renderCounter = useRef(0)
      renderCounter.current += 1
      return createElement('h1', null, `Renders: ${renderCounter.current}`)
    }

    const NewEdit: ComponentType = (props) => createElement('div', null, createElement(Edit, props), createElement(Counter))

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root: Root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'NewEdit',
      id: 'id1',
      name: 'id1',
      style: { textAlign: 'center', fontSize: 30, margin: 5 },
      value: { $modifier: 'get', store: 'data', path: '/age' },
      onChange: { $action: 'set', store: 'data', path: '/age' },
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          components: { ...builtinComponents, NewEdit },
          defaultValues: { data: { age: '' } },
        })
      )
    })

    const heading = () => container.querySelector('h1')
    const input = await findTextbox(container)

    const initial = heading()?.textContent ?? ''
    expect(initial).toMatch(/^Renders: \d+$/)

    await act(async () => {
      fireInputChange(input, 'test@example.com')
    })

    await flushResolutions()

    const after = heading()?.textContent ?? ''
    expect(after).toMatch(/^Renders: \d+$/)
    const n0 = Number(initial.replace(/\D/g, ''))
    const n1 = Number(after.replace(/\D/g, ''))
    expect(n1).toBeGreaterThan(n0)

    await act(async () => {
      root.unmount()
    })
    document.body.removeChild(container)
  })

  it('Edit type="number" stores JSON numbers, keeps string display, no selection crash', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const formStore = new FormStore()
    const model: JsonUINode = {
      $comp: 'Edit',
      id: 'age',
      name: 'age',
      type: 'number',
      value: { $modifier: 'get', store: 'data', path: '/age' },
      onChange: { $action: 'set', store: 'data', path: '/age' },
    }

    await act(async () => {
      root.render(
        createElement(JsonUI, {
          model,
          initialFormStore: formStore,
          defaultValues: { data: { age: '' } },
        })
      )
    })

    await flushResolutions()
    const input = container.querySelector('input[type="number"]') as HTMLInputElement
    expect(input).toBeTruthy()

    await act(async () => {
      fireInputChange(input, '42')
    })
    await flushResolutions()
    expect(formStore.get('data', '/age')).toBe(42)
    expect(typeof formStore.get('data', '/age')).toBe('number')

    // Decimals stored as JSON numbers; raw string preserved for display.
    await act(async () => {
      fireInputChange(input, '42.5')
    })
    await flushResolutions()
    expect(formStore.get('data', '/age')).toBe(42.5)
    expect(input.value).toBe('42.5')

    // Clearing stores null, not an empty string.
    await act(async () => {
      fireInputChange(input, '')
    })
    await flushResolutions()
    expect(formStore.get('data', '/age')).toBeNull()

    await act(async () => {
      root.unmount()
    })
    document.body.removeChild(container)
  })

  it('does not crash when defaultValues is malformed at runtime', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)

    const model: JsonUINode = {
      $comp: 'View',
      $children: 'ok',
    }

    let thrown: unknown
    try {
      await act(async () => {
        root.render(
          createElement(JsonUI, {
            model,
            defaultValues: [] as unknown as Record<string, never>,
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
})
