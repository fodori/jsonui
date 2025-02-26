import React, { useContext, useMemo } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI, MessageHandler, MessageHandlerContext } from '../../index'
import model from '../../Example.json'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export

const JsonUIStory = {
  title: 'Partial Value Update Test',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

const MessageSender = () => {
  const messageHandler = useContext(MessageHandlerContext)
  return (
    <button
      type="button"
      onClick={() => {
        if (messageHandler) {
          const updateDefaultValueHandler = messageHandler.get()
          if (updateDefaultValueHandler) {
            updateDefaultValueHandler({ store: 'data', path: 'level1/testList/1', value: `${Math.random() * 100}` })
          }
        }
      }}
    >
      Click!!!
    </button>
  )
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof JsonUI> = (args) => {
  const value = useMemo(() => new MessageHandler(), [])

  return (
    <MessageHandlerContext.Provider value={value as any}>
      <MessageSender />
      <JsonUI {...args} />
    </MessageHandlerContext.Provider>
  )
}

export const PartialValueUpdateTest = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PartialValueUpdateTest.args = {
  model,
  id: 'aaaa',
  defaultValues: {
    data: {
      level1: {
        testList: ['oneeee5', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14'],
      },
    },
  },
}

PartialValueUpdateTest.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
  id: { control: { type: 'text' } },
}

PartialValueUpdateTest.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory
