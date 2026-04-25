import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { JsonUI } from '@jsonui/react'
import { axios } from '../index'
import { actions, modifiers } from '@jsonui/core'

const meta = {
  title: 'mui/Axios',
  component: JsonUI,
} satisfies Meta<typeof JsonUI>

export default meta
type Story = StoryObj<typeof meta>

export const Axios: Story = {
  args: {},
  render: () => (
    <JsonUI
      modifiers={modifiers}
      actions={{ ...actions, axios }}
      model={{
        $comp: 'View',
        $children: [
          {
            $comp: 'Button',
            $children: 'Send a post',
            onClick: {
              $action: 'axios',
              method: 'post',
              url: '/user/12345',
              data: {
                firstName: 'Fred',
                lastName: 'Flintstone',
              },
            },
          },
        ],
      }}
    />
  ),
}
