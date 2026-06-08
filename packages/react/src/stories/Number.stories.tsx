import type { Meta, StoryObj } from '@storybook/react'
import type { JsonUINode, ActionContext, JSONParams } from '@jsonui/core'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

const model = {
  $children: [
    {
      label: 'Number',
      $comp: 'Edit',
      path: '/numtest',
      store: 'data',
      type: 'number',
    },
    {
      $comp: 'StoreDebugger',
      data: {
        $modifier: 'get',
        store: 'data',
        path: '/',
      },
      error: {
        $modifier: 'get',
        store: 'data',
        path: '/',
        type: 'ERROR',
      },
      touched: {
        $modifier: 'get',
        store: 'data',
        path: '/',
        getBoolean: false,
        type: 'TOUCH',
      },
    },
  ],
  $comp: 'View',
  $validations: [
    {
      path: '/',
      schema: {
        errorMessage: {
          required: {
            numtest: 'Full name is required',
          },
        },
        properties: {
          numtest: {
            type: 'number',
            minimum: 10,
            maximum: 100,
            errorMessage: {
              minimum: 'Must be greater than 10',
              maximum: 'Must be less than 100',
            },
          },
        },
        required: ['numtest'],
        type: 'object',
      },
      store: 'data',
    },
  ],
  style: {
    maxWidth: 700,
    padding: 32,
  },
} as JsonUINode
const defaultValues = {} as JSONParams

const submit = (params: JSONParams, context: ActionContext) => {
  console.log('Submit value:', context?.componentProps?.value)
}

const SLOW_SET_DELAY_MS = 600

/**
 * Emulates a slow component / laggy store: every `set` is delayed before the
 * value round-trips back into the input. This is the realistic condition that
 * stresses the controlled-input cursor restore and numeric coercion logic —
 * type fast and the displayed value (and caret) must not jump or reset.
 */
const slowSet = async (params: JSONParams, context: ActionContext): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, SLOW_SET_DELAY_MS))
  await actions.set?.(params, context)
}

const meta = {
  title: 'JsonUI/Number',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions: { ...actions, submit },
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Number: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
  },
}

export const NumberSlow: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
    actions: { ...actions, submit, set: slowSet },
  },
  render: (args) => (
    <>
      <p>
        Slow store ({SLOW_SET_DELAY_MS}ms per write): the value round-trips back late, so the cursor must stay put and the
        number must persist as a JSON number.
      </p>
      <JsonUI {...args} />
    </>
  ),
}
