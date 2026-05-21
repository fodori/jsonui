import type { Meta, StoryObj } from '@storybook/react'
import type { JsonUINode, ActionContext, JSONParams } from '@jsonui/core'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'
import modelJson from './models/example-nested-modifiers.json' with { type: 'json' }
import defaultValuesJson from './models/example-nested-defaultValues.json' with { type: 'json' }

const model = modelJson as JsonUINode
const defaultValues = defaultValuesJson as JSONParams

const submit = (params: JSONParams, context: ActionContext) => {
  console.log('Submit value:', context?.componentProps?.value)
}

const meta = {
  title: 'JsonUI/Validation',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions: { ...actions, submit },
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Validation: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
  },
}
