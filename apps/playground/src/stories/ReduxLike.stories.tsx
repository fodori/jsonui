import type { Meta, StoryObj } from '@storybook/react'

import { JsonUI } from '@jsonui/react'
import { builtinComponents } from '@jsonui/react'
import { functions as baseFunctions } from '@jsonui/core'
import type { FunctionMap } from '@jsonui/core'

const MyFunction = () => 'age'

const functions: FunctionMap = {
  ...baseFunctions,
  MyFunction,
}

const meta = {
  title: 'JsonUI/ReduxLikeTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const ReduxLikeTest: Story = {
  args: {
    model: {
      $comp: 'Fragment',
      $children: [
        {
          $comp: 'Edit',
          value: { $modifier: 'get', store: 'data', path: 'age' },
          label: 'Field level validation',
          helperText: "it's a child age",
          onChange: {
            $action: 'set',
            store: 'data',
            path: 'age',
            jsonataDef: '$',
          },
        },
        {
          $comp: 'Edit',
          value: { $modifier: 'get', store: 'data', path: 'age0' },
          label: 'Field level validation',
          helperText: "it's a child age",
          onChange: {
            $action: 'set',
            store: 'data',
            path: 'age0',
            jsonataDef: '$',
          },
        },
        {
          $comp: 'Text',
          $children: 'age: ',
        },
        {
          $comp: 'Text',
          $children: { $modifier: 'get', store: 'data', path: 'age' },
        },
        {
          $comp: 'Text',
          $children: 'age, but the path is calculated: ',
        },
        {
          $comp: 'Text',
          $children: {
            $modifier: 'get',
            store: 'data',
            path: { $modifier: 'MyFunction' },
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
    defaultValues: {
      data: {
        age: 'Test1',
      },
    },
    functions,
  },
}
