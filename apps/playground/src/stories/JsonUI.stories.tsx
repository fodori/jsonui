import type { Meta, StoryObj } from '@storybook/react'

import { actions, JSONObject, JsonUI, JsonUINode, modifiers } from '@jsonui/react'
import modelJson from '../models/example-nested-modifiers.json'
import defaultValuesJson from '../models/example-nested-defaultValues.json'
import { builtinComponents } from '@jsonui/react'

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
