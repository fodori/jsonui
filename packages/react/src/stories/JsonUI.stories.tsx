import type { Meta, StoryObj } from '@storybook/react'

import type { JsonUINode } from '@jsonui/core'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'

const model: JsonUINode = {
  $comp: 'View',
  $children: [{ $comp: 'Text', children: 'Hello from @jsonui/react Storybook' }],
}

const meta = {
  title: 'JsonUI/Hello',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
    model,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Hello: Story = {}
