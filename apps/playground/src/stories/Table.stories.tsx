import type { Meta, StoryObj } from '@storybook/react'

import { JsonUI } from '@jsonui/react'
import { builtinComponents } from '@jsonui/react'
import { functions } from '@jsonui/core'

const meta = {
  title: 'JsonUI/TableTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
    functions,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const TableTest: Story = {
  args: {
    model: {
      $comp: 'View',
      style: { marginTop: 10, backgroundColor: 'orange' },
      $children: [
        'test1',
        {
          $comp: 'Fragment',
          $pathModifiers: {
            data: { path: 'level1' },
          },
          $children: [
            'test2',
            {
              $comp: 'View',
              $isList: true,
              $pathModifiers: {
                data: { path: 'testList' },
              },
              style: {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              },
              $listItem: {
                $comp: 'View',
                style: { padding: 4, backgroundColor: 'orange' },
                $children: [
                  'test3',
                  {
                    $comp: 'Edit',
                    value: { $modifier: 'get', store: 'data', path: '.' },
                    onChange: { $action: 'set', store: 'data', path: '.' },
                  },
                ],
              },
            },
          ],
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
        level1: {
          testList: ['oneeee5', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14'],
        },
      },
    },
  },
}
