import type { Meta, StoryObj } from '@storybook/react'

import { JsonUI } from '@jsonui/react'
import type { JsonUINode, JSONObject } from '@jsonui/core'
import modelJson from '../models/example-nested-modifiers.json'
import defaultValuesJson from '../models/example-nested-defaultValues.json'
import { builtinComponents } from '@jsonui/react'
import { modifiers, actions } from '@jsonui/core'

const model = modelJson as JsonUINode
const defaultValues = defaultValuesJson as Record<string, JSONObject>

const meta = {
  title: 'JsonUI/MainTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions,
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const MainTest: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
  },
}
