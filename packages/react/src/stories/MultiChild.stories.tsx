import type { ChangeEventHandler, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import jsonata from 'jsonata'
import { modifiers, actions, type ComponentContext, JsonUINode } from '@jsonui/core'
import { JsonUI, builtinComponents, uncontrolledInputProps, toDisplayString } from '../index.js'

const EditMultiChild = (props: JsonUINode) => {
  const { validation, value, $childLabel, $childHelperText, onChange, children, $ctx, ...ownProps } = props
  const handleChange = onChange as ChangeEventHandler<HTMLInputElement> | undefined
  const inputValue = toDisplayString(value as string | number | null | undefined)
  const { defaultValue, onChange: inputOnChange, ref: inputRef } = uncontrolledInputProps(value as string | number, handleChange)
  const { fieldErrors } = ($ctx as ComponentContext | undefined) ?? {}
  let error = !!fieldErrors
  let helperText: ReactNode = $childHelperText as ReactNode
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
      <div style={{ fontSize: 20, color: error ? 'red' : undefined }}>{$childLabel as ReactNode}</div>
      <p>{children as ReactNode}</p>
      <input {...ownProps} defaultValue={defaultValue} onChange={inputOnChange} ref={inputRef} />
      <div style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</div>
    </>
  )
}

const meta = {
  title: 'JsonUI/Multi Child',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const MultiChild: Story = {
  args: {
    model: {
      $comp: 'Fragment',
      $children: [
        {
          $comp: 'Text',
          $children: 'EditMultiChild',
          style: { marginBottom: 8, fontSize: 20 },
        },
        {
          $comp: 'EditMultiChild',
          value: { $modifier: 'get', store: 'data', path: 'firstname' },
          onChange: { $action: 'set', store: 'data', path: 'firstname' },
          $childLabel: [1, 2, 3, 4, 5].map((n) => ({
            $comp: 'Text',
            $children: `This is a $childLabel ${n}`,
            style: {
              textAlign: 'left',
              fontSize: 16,
              margin: 5,
              color: 'red',
            },
          })),
          $children: [1, 2, 3, 4, 5].map((n) => ({
            $comp: 'Text',
            $children: `This is a $children ${n}`,
            style: {
              textAlign: 'left',
              fontSize: 14,
              margin: 5,
              color: 'green',
            },
          })),
          $childHelperText: [1, 2, 3, 4, 5].map((n) => ({
            $comp: 'Text',
            $children: `This is a $childHelperText ${n}`,
            style: { textAlign: 'left', fontSize: 10, margin: 5 },
          })),
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
            store: 'data',
            path: '/',
            type: 'ERROR',
          },
          touched: {
            $modifier: 'get',
            store: 'data',
            path: '/',
            type: 'TOUCH',
          },
        },
      ],
    },
    components: { ...builtinComponents, EditMultiChild },
    modifiers,
    actions,
    defaultValues: {
      data: {
        firstname: 'John',
      },
    },
  },
}
