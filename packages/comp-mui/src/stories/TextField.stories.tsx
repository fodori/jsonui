import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { TextField as MUITextField } from '../index'

const TextFieldStory = {
  title: 'mui/Text Field',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
    <JsonUI
      components={{ MUITextField }}
      model={[
        {
          $comp: 'MUITextField',
          label: 'How old are you?',
          helperText: 'please enter integer',
          name: 'age',
          variant: 'filled',
          value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
          onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
        },
        {
          $comp: 'MUITextField',
          label: 'How old are you?',
          helperText: 'please enter integer',
          name: 'age',
          variant: 'standard',
          value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
          onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
        },
        {
          $comp: 'MUITextField',
          label: 'How old are you?',
          helperText: 'please enter integer',
          name: 'age',
          value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
          onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
        },
        {
          $comp: 'MUITextField',
          label: 'How old are you?',
          helperText: 'looks like you are too old for human',
          name: 'age',
          error: true,
          value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
          onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
        },
        {
          $comp: 'MUITextField',
          label: 'How old are you?',
          helperText: 'please enter integer',
          name: 'age',
          disabled: true,
          value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
          onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
        },
      ]}
    />
  </div>
)

export const TextField = Template.bind({})

export default TextFieldStory
