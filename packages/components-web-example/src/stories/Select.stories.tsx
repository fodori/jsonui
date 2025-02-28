import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Select as MUISelect } from '../index'

const SelectStory = {
  title: 'mui/Select',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const options = [
  { value: '1', label: 'Label 1' },
  { value: '2', label: 'Label 2' },
]

export const Template: ComponentStory<typeof React.Component> = () => {
  return (
    <div style={{ display: 'flex', gridGap: 10, flexDirection: 'row' }}>
      <JsonUI
        components={{ MUISelect }}
        defaultValues={{
          anotherstore: {},
        }}
        model={[
          {
            label: 'Label 1',
            $comp: 'MUISelect',
            options: [{ label: 'Please select an option', disabled: true }, ...options],
            helperText: 'Please select your currency',
            value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
            onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
          },
          {
            label: 'Label 1',
            $comp: 'MUISelect',
            helperText: 'Please select your currency',
            value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
            onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
            variant: 'filled',
            options,
            error: true,
          },
          {
            $comp: 'MUISelect',
            disabled: true,
            helperText: 'Please select your currency',
            value: { $modifier: 'get', store: 'anotherstore', path: '/firstName' },
            onChange: { $action: 'set', store: 'anotherstore', path: '/firstName' },
            options,
          },
        ]}
      />
    </div>
  )
}

export default SelectStory
