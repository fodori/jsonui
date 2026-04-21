import type { Meta, StoryObj } from '@storybook/react'
import { functions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

const meta = {
  title: 'JsonUI/PrimitivesTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
    functions,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const PrimitivesTest: Story = {
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
