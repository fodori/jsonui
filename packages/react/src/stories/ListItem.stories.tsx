import type { Meta, StoryObj } from '@storybook/react'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

const meta = {
  title: 'JsonUI/List Item',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

const ROW_COUNT = 5

/** Baseline: `$listItem` as a single node (object). */
export const ObjectListItem: Story = {
  args: {
    ...meta.args,
    model: {
      $comp: 'View',
      style: { marginTop: 10 },
      $children: [
        {
          $comp: 'View',
          $pathModifiers: { data: { path: 'list' } },
          $isList: true,
          style: { display: 'flex', flexDirection: 'column', gap: 4 },
          $listItem: {
            $comp: 'View',
            style: { display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' },
            $children: [
              {
                $comp: 'View',
                style: { width: 12, height: 12, background: 'green' },
              },
              {
                $comp: 'Text',
                $children: { $modifier: 'get', store: 'data', path: '.' },
              },
            ],
          },
        },
      ],
    },
    defaultValues: {
      data: { list: Array.from({ length: ROW_COUNT }, (_, i) => `row-${i}`) },
    },
  },
  render: (args) => (
    <>
      <p>$listItem as object — one template node per list entry</p>
      <JsonUI
        model={args.model}
        components={args.components}
        modifiers={args.modifiers}
        actions={args.actions}
        defaultValues={args.defaultValues}
      />
    </>
  ),
}

/** `$listItem` as an array — same shapes as `$children`. */
export const ArrayListItem: Story = {
  args: {
    ...meta.args,
    model: {
      $comp: 'View',
      style: { marginTop: 10 },
      $children: [
        {
          $comp: 'View',
          $pathModifiers: { data: { path: 'list' } },
          $isList: true,
          style: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 4,
          },
          // Array form: each entry contributes every template node (green + blue pair).
          $listItem: [
            {
              $comp: 'View',
              style: { width: 14, height: 14, background: 'green', margin: 2 },
            },
            {
              $comp: 'View',
              style: { width: 14, height: 14, background: 'blue', margin: 2 },
            },
            {
              $comp: 'Text',
              style: { marginRight: 12, fontSize: 12 },
              $children: { $modifier: 'get', store: 'data', path: '.' },
            },
          ],
        },
      ],
    },
    defaultValues: {
      data: { list: Array.from({ length: ROW_COUNT }, (_, i) => `row-${i}`) },
    },
  },
  render: (args) => (
    <>
      <p>$listItem as array — multiple template nodes per list entry (parity with $children)</p>
      <JsonUI
        model={args.model}
        components={args.components}
        modifiers={args.modifiers}
        actions={args.actions}
        defaultValues={args.defaultValues}
      />
    </>
  ),
}
