import type { ChangeEvent, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { modifiers, actions, type ComponentContext, JsonUINode } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

const RadioGroupField = (props: JsonUINode) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = JSON.parse(event.target.value) as unknown
    const oc = props.onChange as ((e: { target: { value: unknown } }) => void) | undefined
    oc?.({ target: { value: parsed } })
  }
  const { value, childLabel, childHelperText, onChange, children, options, $ctx, ...ownProps } = props
  void onChange
  const { fieldErrors } = ($ctx as ComponentContext | undefined) ?? {}
  const error = !!fieldErrors
  let helperText: ReactNode = childHelperText as ReactNode
  if (error && fieldErrors) {
    helperText = (Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors) as ReactNode
  }
  return (
    <>
      <div style={{ fontSize: 20, color: error ? 'red' : undefined }}>{childLabel as ReactNode}</div>
      <p>{children as ReactNode}</p>
      {(options as unknown[]).map((i: unknown) => {
        const row = i as { value: unknown; label: string }
        const itemValue = typeof i === 'string' ? i : row.value
        const checked = value === itemValue
        return (
          <div key={String(itemValue)}>
            <input
              {...ownProps}
              value={JSON.stringify((i as { value: unknown }).value)}
              onChange={handleChange}
              type="radio"
              checked={checked}
              id={`radio-${String(itemValue)}`}
            />
            <label htmlFor={`radio-${String(itemValue)}`}>{(i as { label: string }).label}</label>
          </div>
        )
      })}
      <div style={{ fontSize: 10, color: error ? 'red' : undefined }}>{helperText}</div>
    </>
  )
}

const meta = {
  title: 'JsonUI/Form Store',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const FormStore: Story = {
  args: {
    model: {
      $comp: 'View',
      id: 'view',
      style: { marginTop: 10 },
      $children: [
        {
          $comp: 'RadioGroupField',
          name: 'radioValue',
          $childLabel: 'All JSON values are supported',
          store: 'data',
          path: 'radioValue',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
            { label: 'null', value: null },
            { label: 'number 0', value: 0 },
            { label: 'number 1', value: 1 },
            { label: 'aa', value: 'aa' },
          ],
          required: false,
          fullWidth: false,
          style: {
            minWidth: 100,
          },
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
      $validations: [
        {
          schema: {
            type: 'object',
            properties: {
              firstname: {
                type: 'string',
                minLength: 3,
                maxLength: 9,
                errorMessage: {
                  minLength: 'too small',
                  maxLength: 'too big',
                },
              },
              email: {
                type: 'string',
                format: 'email',
                errorMessage: {
                  format: 'should be email',
                },
              },
            },
            required: ['firstname', 'email'],
            errorMessage: {
              required: {
                firstname: 'firstname is required',
                email: 'email is required',
              },
            },
          },
          path: '/',
          store: 'data',
        },
        {
          schema: {
            type: 'string',
            minLength: 2,
            maxLength: 4,
          },
          path: '/anotherText',
          store: 'data',
        },
      ],
    },
    defaultValues: {
      data: {
        radioValue: null,
      },
    },
    components: { ...builtinComponents, RadioGroupField },
    modifiers,
    actions,
  },
}
