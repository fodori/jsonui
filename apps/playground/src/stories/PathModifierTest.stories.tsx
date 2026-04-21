import type { Meta, StoryObj } from '@storybook/react'

import { JsonUI } from '@jsonui/react'
import { builtinComponents } from '@jsonui/react'
import { functions as baseFunctions } from '@jsonui/core'
import type { FunctionMap } from '@jsonui/core'

const functions: FunctionMap = {
  ...baseFunctions,
}

const meta = {
  title: 'JsonUI/PathModifierTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const PathModifierTest: Story = {
  args: {
    model: {
      $comp: 'Fragment',
      $pathModifiers: {
        data: { path: '/this/is/a/root/for/form' },
      },
      $children: [
        {
          $comp: 'Fragment',
          $pathModifiers: {
            data: { path: '../' },
          },
          $children: [
            {
              $comp: 'Edit',
              value: { $modifier: 'get', store: 'data', path: 'test1' },
              label: 'Edit test 1',
              onChange: {
                $action: 'set',
                store: 'data',
                path: 'test1',
                jsonataDef: '$',
              },
              $pathModifiers: {
                data: { path: 'hhh' },
              },
            },
            {
              $comp: 'Text',
              $children: {
                $modifier: 'get',
                store: 'data',
                path: '/this/is/a/root/for/hhh/test1',
              },
            },
          ],
        },
        {
          $comp: 'Edit',
          value: { $modifier: 'get', store: 'data', path: 'test2' },
          label: 'Edit test 2',
          onChange: {
            $action: 'set',
            store: 'data',
            path: 'test2',
            jsonataDef: '$',
          },
          $pathModifiers: {
            data: { path: 'bbb' },
          },
        },
        {
          $comp: 'Edit',
          value: { $modifier: 'get', store: 'data', path: '/test4' },
          label: 'Edit test root',
          onChange: { $action: 'set', store: 'data', path: '/test4' },
        },
        {
          $comp: 'Edit',
          value: { $modifier: 'get', store: 'data', path: 'test3' },
          label: 'Edit test 3',
          onChange: {
            $action: 'set',
            store: 'data',
            path: 'test3',
            jsonataDef: '$',
          },
        },
        {
          $comp: 'Text',
          $children: {
            $modifier: 'get',
            store: 'data',
            path: '/this/is/a/root/for/hhh/test1',
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
        age: 'Test12',
        this: { is: { a: { root: { for: { hhh: {} } } } } },
        test1: 'Test13',
        test2: 'Test2',
        test3: 'Test3',
        test4: 'Test4',
      },
    },
    functions,
  },
}
