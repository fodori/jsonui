import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'

const ButtonStory = {
  title: 'mui/Button',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
    <JsonUI
      model={{
        $comp: 'button',
        $children: 'Hello world',
        variant: 'contained',
      }}
    />
  </div>
)

export const Button = Template.bind({})

export default ButtonStory
