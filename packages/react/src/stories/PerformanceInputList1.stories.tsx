import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

type JsonUIStoryArgs = ComponentProps<typeof JsonUI> & { iteration?: number }

const listModel = {
  $comp: 'Fragment',
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
            $comp: 'Edit',
            value: { $modifier: 'get', store: 'data', path: '/name' },
            onChange: { $action: 'set', store: 'data', path: '/name' },
            style: { width: 50, height: 20 },
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

const meta: Meta<JsonUIStoryArgs> = {
  title: 'JsonUI/PerformanceInputListTest1',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
  },
}

export default meta

type Story = StoryObj<JsonUIStoryArgs>

export const PerformanceInputListTest1: Story = {
  args: {
    model: listModel,
    iteration: 400,
  },
  argTypes: {
    iteration: { control: { type: 'number' } },
  },
  render: ({ iteration, ...args }) => (
    <>
      <p>{iteration}</p>
      <JsonUI {...args} defaultValues={{ data: { list: Array(iteration).fill('a', 0) } }} />
    </>
  ),
}
