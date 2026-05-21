import type { Meta, StoryObj } from '@storybook/react'
import { useContext, useMemo } from 'react'
import { JsonUI, builtinComponents, MessageHandler, MessageHandlerContext } from '../index.js'
import { modifiers, actions } from '@jsonui/core'
import type { JsonUINode } from '@jsonui/core'
import modelJson from './models/example-push-notification.json' with { type: 'json' }

const model = modelJson as JsonUINode

const MessageSender = () => {
  const messageHandler = useContext(MessageHandlerContext)
  return (
    <button
      type="button"
      onClick={() => {
        const updateDefaultValueHandler = messageHandler?.get()
        if (updateDefaultValueHandler) {
          updateDefaultValueHandler({ store: 'data', path: 'level1/testList/2', value: `${Math.random() * 100}` as any })
        }
      }}
    >
      Change level1/testList/2 value to random number
    </button>
  )
}

const meta = {
  title: 'JsonUI/Push Notification',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const PushNotification: Story = {
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
          testList: ['item 0.', 'item 1.', 'item 2.', 'item 3.'],
        },
      },
    },
  },
}
