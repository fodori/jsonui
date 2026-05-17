import type { Meta, StoryObj } from '@storybook/react'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

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
  ],
}

const meta = {
  title: 'JsonUI/Boxes 400',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
    model: boxModel,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

const BOX_COUNT = 400

export const Boxes400: Story = {
  args: {
    ...meta.args,
    model: boxModel,
  },
  render: (args) => (
    <>
      <p>{BOX_COUNT} boxes $listItem and render performance test </p>
      <JsonUI
        model={args.model}
        components={args.components}
        modifiers={args.modifiers}
        actions={args.actions}
        defaultValues={{ data: { list: Array(BOX_COUNT).fill('a', 0) } }}
      />
    </>
  ),
}
