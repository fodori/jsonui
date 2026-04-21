import type { ChangeEvent, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ERROR_STORE_SUFFIX, TOUCH_STORE_SUFFIX, functions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

const RadioGroupField = (props: Record<string, unknown>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = JSON.parse(event.target.value) as unknown
    const oc = props.onChange as ((e: { target: { value: unknown } }) => void) | undefined
    oc?.({ target: { value: parsed } })
  }
  const { fieldErrors, value, childLabel, childHelperText, onChange, children, options, ...ownProps } = props
  void onChange
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
  title: 'JsonUI/ValidationTest',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const ValidationTest: Story = {
  args: {
    model: {
      $comp: 'View',
      id: 'view',
      style: { marginTop: 10 },
      $children: [
        {
          $comp: 'RadioGroupField',
          name: 'showNow',
          $childLabel: 'Show now',
          $childHelperText: '',
          placeholder: '',
          fieldErrors: {
            $modifier: 'get',
            store: `data${ERROR_STORE_SUFFIX}`,
            path: 'showNow',
          },
          fieldTouched: {
            $modifier: 'get',
            store: `data${TOUCH_STORE_SUFFIX}`,
            path: 'showNow',
          },
          value: {
            $modifier: 'get',
            store: 'data',
            path: 'showNow',
          },
          onChange: {
            $action: 'set',
            store: 'data',
            path: 'showNow',
          },
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
          $comp: 'Input',
          value: { $modifier: 'get', store: 'data', path: 'firstname' },
          label: 'First Name',
          helperText: 'more than 2 character and less than 10',
          onChange: {
            $action: 'set',
            store: 'data',
            path: 'firstname',
          },
          fieldErrors: {
            $modifier: 'get',
            store: `data${ERROR_STORE_SUFFIX}`,
            path: 'firstname',
          },
          fieldTouched: {
            $modifier: 'get',
            store: `data${TOUCH_STORE_SUFFIX}`,
            path: 'firstname',
          },
        },
        {
          $comp: 'Input',
          value: { $modifier: 'get', store: 'data', path: 'email' },
          label: 'E-mail address',
          helperText: "we don't accept any another format",
          onChange: { $action: 'set', store: 'data', path: 'email' },
          fieldErrors: {
            $modifier: 'get',
            store: `data${ERROR_STORE_SUFFIX}`,
            path: 'email',
          },
          fieldTouched: {
            $modifier: 'get',
            store: `data${TOUCH_STORE_SUFFIX}`,
            path: 'email',
          },
        },
        {
          $comp: 'Input',
          value: {
            $modifier: 'get',
            store: 'data',
            path: 'anotherText',
          },
          label: 'Single schema test',
          helperText: 'helppertext here',
          onChange: { $action: 'set', store: 'data', path: 'anotherText' },
          fieldErrors: {
            $modifier: 'get',
            store: `data${ERROR_STORE_SUFFIX}`,
            path: 'anotherText',
          },
          fieldTouched: {
            $modifier: 'get',
            store: `data${TOUCH_STORE_SUFFIX}`,
            path: 'anotherText',
          },
        },
        { $comp: 'Text', $children: 'Data', style: { fontSize: 20 } },
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
            store: `data${TOUCH_STORE_SUFFIX}`,
            path: '/',
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
        firstname: 'Jon',
        email: 'a@a.com',
        anotherText: 'somethin',
      },
    },
    components: { ...builtinComponents, RadioGroupField },
    functions,
  },
}
