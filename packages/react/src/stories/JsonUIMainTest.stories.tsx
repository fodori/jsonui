import type { Meta, StoryObj } from '@storybook/react'
import type { JsonUINode, JSONObject } from '@jsonui/core'
import { functions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '@jsonui/react'
import modelJson from './models/example-nested-modifiers.json' with { type: 'json' }
import defaultValuesJson from './models/example-nested-defaultValues.json' with { type: 'json' }

const model = modelJson as JsonUINode
const defaultValues = defaultValuesJson as Record<string, JSONObject>

const meta = {
  title: 'JsonUI/MainTest',
  component: JsonUI,
  args: {
    components: builtinComponents,
    functions,
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
