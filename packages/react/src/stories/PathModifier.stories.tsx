import type { Meta, StoryObj } from '@storybook/react'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

const meta = {
  title: 'JsonUI/Path Modifier',
  component: JsonUI,
  args: {
    components: builtinComponents,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const PathModifier: Story = {
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
              label: 'Edit relative test1 in /this/is/a/root/for/form/../relative1',
              onChange: {
                $action: 'set',
                store: 'data',
                path: 'test1',
                jsonataDef: '$',
              },
              $pathModifiers: {
                data: { path: 'relative1' },
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
          label: 'Edit relative test2 in /this/is/a/root/for/form/bbb',
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
          label: 'Edit absolute /test4',
          onChange: { $action: 'set', store: 'data', path: '/test4' },
        },
        {
          $comp: 'Edit',
          value: { $modifier: 'get', store: 'data', path: 'test3' },
          label: 'Edit relative test3 in root',
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
            path: '/this/is/a/root/for/relative1/test1',
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
    },
    defaultValues: {
      data: {
        age: 'Test12',
        this: { is: { a: { root: { for: { relative1: {} } } } } },
        test1: 'Test13',
        test2: 'Test2',
        test3: 'Test3',
        test4: 'Test4',
      },
    },
    modifiers,
    actions,
  },
}
