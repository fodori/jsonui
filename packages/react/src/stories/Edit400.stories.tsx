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
            value: { $modifier: 'get', store: 'data', path: '.' },
            onChange: { $action: 'set', store: 'data', path: '.' },
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
}

const meta: Meta<JsonUIStoryArgs> = {
  title: 'JsonUI/Edit 400',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
  },
}

export default meta

type Story = StoryObj<JsonUIStoryArgs>

export const Edit400: Story = {
  args: {
    model: listModel,
    iteration: 400,
  },
  argTypes: {
    iteration: { control: { type: 'number' } },
  },
  render: ({ iteration, ...args }) => (
    <>
      <p>{iteration} input field and $listItem and render performance test with separate editing test</p>
      <JsonUI {...args} defaultValues={{ data: { list: Array(iteration).fill('a', 0) } }} />
    </>
  ),
}
