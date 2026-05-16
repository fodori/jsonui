import type { Meta, StoryObj } from '@storybook/react'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

const meta = {
  title: 'JsonUI/Primitives',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Primitives: Story = {
  args: {
    model: {
      $comp: 'Fragment',
      $children: [
        [1, ', ', 'simple textűáéúőóüóüöŰÁÉÚŐÓÜÖ1Íí'],
        ', ',
        2,
        ', ',
        3,
        ', ',
        4,
        ', ',
        true,
        ', ',
        false,
        ', ',
        null,
        ', ',
        9999,
        ', ',
        0.00000000003,
        ', ',
        2 / 6,
      ],
    },
  },
}
