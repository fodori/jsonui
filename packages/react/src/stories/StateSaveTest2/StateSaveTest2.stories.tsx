import React, { useRef, useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { JsonUI } from '../../index'
import Main from './Main'

const JsonUIStory = {
  title: 'Store State Test2',
  component: JsonUI,
} as ComponentMeta<typeof JsonUI>

type Keys = 'form1' | 'form2' | 'form3'

const Template: ComponentStory<typeof JsonUI> = (args: any) => {
  return <Main {...args} />
}

export const StoreStateTest2 = Template.bind({})

StoreStateTest2.args = {}

StoreStateTest2.argTypes = {
  model: {
    control: {
      type: 'object',
    },
  },
}

StoreStateTest2.parameters = { controls: { include: ['model', 'id'] } }

export default JsonUIStory
