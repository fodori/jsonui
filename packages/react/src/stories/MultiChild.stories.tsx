import type { ChangeEventHandler, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import jsonata from 'jsonata'
import { functions } from '@jsonui/core'
import { JsonUI, builtinComponents, useControlledInputValue } from '@jsonui/react'

const EditMultiChild = (props: Record<string, unknown>) => {
  const { fieldErrors, validation, value, childLabel, childHelperText, onChange, children, ...ownProps } = props
  const handleChange = onChange as ChangeEventHandler<HTMLInputElement> | undefined
  const { value: inputValue, onChange: inputOnChange, ref: inputRef } = useControlledInputValue((value ?? '') as string, handleChange)
  let error = !!fieldErrors
  let helperText: ReactNode = childHelperText as ReactNode
  if (error && fieldErrors) {
    helperText = (Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors) as ReactNode
  }
  if (validation && inputValue && (validation as { jsonataDef?: string }).jsonataDef) {
    let isValid = true
    try {
      const expression = jsonata((validation as { jsonataDef: string }).jsonataDef)
      const result = expression.evaluate(inputValue) as unknown
      if (result && typeof result === 'object' && 'then' in result && typeof (result as { then: unknown }).then === 'function') {
        isValid = false
      } else {
        isValid = Boolean(result)
      }
    } catch (err) {
      console.error('jsonata error', (validation as { jsonataDef?: string }).jsonataDef, err)
      isValid = false
    }
    if (!isValid) {
      error = true
      const ve = (validation as { fieldErrors?: unknown }).fieldErrors
      helperText = (ve && Array.isArray(ve) ? ve.join(', ') : ve) as ReactNode
    }
  }
  return (
    <>
      <div style={{ fontSize: 20, color: error ? 'red' : undefined }}>{childLabel as ReactNode}</div>
      <p>{children as ReactNode}</p>
      <input {...ownProps} value={inputValue || ''} onChange={inputOnChange} ref={inputRef} />
      <div style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</div>
    </>
  )
}

const meta = {
  title: 'JsonUI/MultiChildTest',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const MultiChildTest: Story = {
  args: {
    model: {
      $comp: 'Fragment',
      $children: [
        {
          $comp: 'Text',
          $children: 'Fragment child 1 (spacer)',
          style: { marginBottom: 8, color: '#666' },
        },
        {
          $comp: 'EditMultiChild',
          value: { $modifier: 'get', store: 'data', path: 'firstname' },
          onChange: { $action: 'set', store: 'data', path: 'firstname' },
          $children: [1, 2, 3, 4, 5].map((n) => ({
            $comp: 'Text',
            $children: `simple text ${n}`,
            style: {
              textAlign: 'left',
              fontSize: 20,
              margin: 5,
              color: 'green',
            },
          })),
          $childLabel: [1, 2, 3, 4, 5].map((n) => ({
            $comp: 'Text',
            $children: `This is a label ${n}`,
            style: {
              textAlign: 'left',
              fontSize: 20,
              margin: 5,
              color: 'red',
            },
          })),
          $childHelperText: [1, 2, 3, 4, 5].map((n) => ({
            $comp: 'Text',
            $children: `Helper line ${n}`,
            style: { textAlign: 'left', fontSize: 10, margin: 5 },
          })),
        },
        {
          $comp: 'Text',
          $children: 'Fragment child 3 (spacer)',
          style: { marginBottom: 8, color: '#666' },
        },
        {
          $comp: 'Text',
          $children: 'Fragment child 4 (spacer)',
          style: { marginBottom: 8, color: '#666' },
        },
        {
          $comp: 'StoreDebugger',
          data: {
            $modifier: 'get',
            store: 'data',
            path: '/',
          },
          error: {
            $modifier: 'get',
            store: 'data.error',
            path: '/',
          },
          touched: {
            $modifier: 'get',
            store: 'data.touch',
            path: '/',
          },
        },
      ],
    },
    components: { ...builtinComponents, EditMultiChild },
    functions,
    defaultValues: {
      data: {
        firstname: 'John',
      },
    },
  },
}
