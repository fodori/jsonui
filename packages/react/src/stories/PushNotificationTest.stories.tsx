import type { Meta, StoryObj } from '@storybook/react'
import { useContext, useMemo } from 'react'
import { JsonUI, builtinComponents, MessageHandler, MessageHandlerContext } from '@jsonui/react'
import { modifiers, actions } from '@jsonui/core'
import type { JsonUINode } from '@jsonui/core'
import modelJson from './models/example-table.json' with { type: 'json' }

const model = modelJson as JsonUINode

const MessageSender = () => {
  const messageHandler = useContext(MessageHandlerContext)
  return (
    <button
      type="button"
      onClick={() => {
        const updateDefaultValueHandler = messageHandler?.get()
        if (updateDefaultValueHandler) {
          updateDefaultValueHandler({ store: 'data', path: 'level1/testList/1', value: `${Math.random() * 100}` })
        }
      }}
    >
      Randomize list item 1
    </button>
  )
}

const meta = {
  title: 'JsonUI/PartialValueUpdateTest',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const PartialValueUpdateTest: Story = {
  render: (args) => {
    const value = useMemo(() => new MessageHandler(), [])
    return (
      <MessageHandlerContext.Provider value={value}>
        <MessageSender />
        <JsonUI {...args} />
      </MessageHandlerContext.Provider>
    )
  },
  args: {
    model,
    components: builtinComponents,
    modifiers,
    actions,
    defaultValues: {
      data: {
        level1: {
          testList: ['oneeee5', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14'],
        },
      },
    },
  },
}
