import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { Select as MUISelect } from '../index'

const SelectStory = {
  title: 'mui/Select',
  component: React.Component,
} as ComponentMeta<typeof React.Component>

const options = [
  { key: '1', label: 'Label 1' },
  { key: '2', label: 'LAbel 2' },
]
const Template: ComponentStory<typeof React.Component> = () => (
  <div style={{ display: 'flex', gridGap: 10, flexDirection: 'row' }}>
    <JsonUI
      components={{ MUISelect }}
      model={{
        $comp: 'MUISelect',
        defaultValue: '1',
        options,
      }}
    />
    <JsonUI
      components={{ MUISelect }}
      model={{
        $comp: 'MUISelect',
        color: 'secondary',
        defaultValue: '2',
        options,
      }}
    />
    <JsonUI
      components={{ MUISelect }}
      model={{
        $comp: 'MUISelect',
        disabled: true,
        options,
      }}
    />
  </div>
)

export const Select = Template.bind({})

export default SelectStory
