import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { axios } from '../index'

const meta = {
  title: 'mui/Axios Form Data Send',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta
type Story = StoryObj<typeof meta>

export const AxiosFormDataSend: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', gridGap: 10, flexDirection: 'column' }}>
      <JsonUI
        functions={{ axios }}
        model={[
          {
            $comp: 'Edit',
            label: 'How old are you?',
            name: 'age',
            value: { $modifier: 'get', store: 'anotherstore', path: '/age' },
            onChange: { $action: 'set', store: 'anotherstore', path: '/age' },
          },
          {
            $comp: 'Edit',
            label: 'Favourite color?',
            name: 'color',
            value: { $modifier: 'get', store: 'anotherstore', path: '/color' },
            onChange: { $action: 'set', store: 'anotherstore', path: '/color' },
          },
          {
            $comp: 'Button',
            $children: 'Send a post',
            onClick: {
              $action: 'axios',
              method: 'post',
              url: '/user/12345',
              data: {
                age: { $modifier: 'get', store: 'anotherstore', path: '/age' },
                color: { $modifier: 'get', store: 'anotherstore', path: '/color' },
              },
            },
          },
        ]}
      />
    </div>
  ),
}
