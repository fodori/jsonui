import type { Meta, StoryObj } from '@storybook/react'
import type { JsonUINode, ActionContext, JSONParams } from '@jsonui/core'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

const model = {
  $children: [
    {
      label: 'Full Name',
      $comp: 'Edit',
      path: '/fullName',
      store: 'data',
    },
    {
      label: 'Email Address',
      $comp: 'Edit',
      path: '/email',
      store: 'data',
      type: 'email',
    },
    {
      helperText: 'Include country code (e.g. +1 555 000 0000)',
      label: 'Phone Number',
      $comp: 'Edit',
      path: '/phone',
      store: 'data',
    },
    {
      label: 'Current Title / Role',
      $comp: 'Edit',
      path: '/currentTitle',
      store: 'data',
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
  $comp: 'View',
  $validations: [
    {
      path: '/',
      schema: {
        errorMessage: {
          required: {
            currentTitle: 'Current title is required',
            email: 'Email is required',
            fullName: 'Full name is required',
            phone: 'Phone is required',
          },
        },
        properties: {
          currentTitle: {
            errorMessage: {
              minLength: 'Current title is required',
            },
            minLength: 2,
            type: 'string',
          },
          email: {
            errorMessage: {
              format: 'Please enter a valid email address',
            },
            format: 'email',
            type: 'string',
          },
          fullName: {
            errorMessage: {
              minLength: 'Full name must be at least 2 characters',
            },
            minLength: 2,
            type: 'string',
          },
          phone: {
            errorMessage: {
              minLength: 'Please enter a valid phone number',
            },
            minLength: 7,
            type: 'string',
          },
        },
        required: ['fullName', 'email', 'phone', 'currentTitle'],
        type: 'object',
      },
      store: 'data',
    },
  ],
  style: {
    maxWidth: 700,
    padding: 32,
  },
} as JsonUINode
const defaultValues = {} as JSONParams

const submit = (params: JSONParams, context: ActionContext) => {
  console.log('Submit value:', context?.componentProps?.value)
}

const meta = {
  title: 'JsonUI/Try',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions: { ...actions, submit },
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Try: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
  },
}
