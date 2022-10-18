import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Button as MUIButton } from '../index'

const ButtonStory = {
  title: 'mui/Button',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
    <JsonUI
      components={{ MUIButton }}
      model={{
        $comp: 'MUIButton',
        $children: 'Hello world',
        variant: 'contained',
      }}
    />
    <JsonUI
      components={{ MUIButton }}
      model={{
        $comp: 'MUIButton',
        $children: 'Hello world',
        variant: 'text',
      }}
    />
    <JsonUI
      components={{ MUIButton }}
      model={{
        $comp: 'MUIButton',
        $children: 'Hello world',
        variant: 'outlined',
      }}
    />
  </div>
)

export const Button = Template.bind({})

export default ButtonStory
