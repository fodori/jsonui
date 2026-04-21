import type { Meta, StoryObj } from '@storybook/react'

import type { JsonUINode } from '@jsonui/core'
import { functions } from '@jsonui/core'
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
    functions,
    model,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Hello: Story = {}
