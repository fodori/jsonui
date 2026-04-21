import type { Meta, StoryObj } from '@storybook/react'
import { functions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

const boxModel = {
  $comp: 'View',
  id: 'view',
  style: { marginTop: 10 },
  $children: [
    {
      $comp: 'View',
      $pathModifiers: {
        data: { path: 'list' },
      },
      $isList: true,
      style: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      $listItem: {
        $comp: 'View',
        $children: [
          {
            $comp: 'View',
            style: { width: 10, height: 10, background: 'green', margin: 2 },
          },
        ],
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
}

const meta = {
  title: 'JsonUI/PerformanceBoxesTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
    functions,
    model: boxModel,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

const BOX_COUNT = 400

export const PerformanceBoxesTest: Story = {
  args: {
    ...meta.args,
    model: boxModel,
  },
  render: (args) => (
    <>
      <p>{BOX_COUNT} boxes</p>
      <JsonUI
        model={args.model}
        components={args.components}
        functions={args.functions}
        defaultValues={{ data: { list: Array(BOX_COUNT).fill('a', 0) } }}
      />
    </>
  ),
}
