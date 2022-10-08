import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { TextField as MUITextField } from '../index'

const TextFieldStory = {
  title: 'mui/TextField',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
    <JsonUI
      components={{ MUITextField }}
      model={{
        $comp: 'MUITextField',
        label: 'How old are you?',
        helperText: 'please enter integer',
        name: 'age',
        variant: 'filled',
      }}
    />
    <JsonUI
      components={{ MUITextField }}
      model={{
        $comp: 'MUITextField',
        label: 'How old are you?',
        helperText: 'please enter integer',
        name: 'age',
        variant: 'standard',
      }}
    />
    <JsonUI
      components={{ MUITextField }}
      model={{
        $comp: 'MUITextField',
        label: 'How old are you?',
        helperText: 'please enter integer',
        name: 'age',
      }}
    />
    <JsonUI
      components={{ MUITextField }}
      model={{
        $comp: 'MUITextField',
        label: 'How old are you?',
        helperText: 'please enter integer',
        name: 'age',
      }}
    />
    <JsonUI
      components={{ MUITextField }}
      model={{
        $comp: 'MUITextField',
        label: 'How old are you?',
        helperText: 'looks like you are too old for human',
        name: 'age',
        defaultValue: '330',
        error: true,
      }}
    />
    <JsonUI
      components={{ MUITextField }}
      model={{
        $comp: 'MUITextField',
        label: 'How old are you?',
        helperText: 'please enter integer',
        name: 'age',
        defaultValue: '33',
        disabled: true,
      }}
    />
  </div>
)

export const TextField = Template.bind({})

export default TextFieldStory
