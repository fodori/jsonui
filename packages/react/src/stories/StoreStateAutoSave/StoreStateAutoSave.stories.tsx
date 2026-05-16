import type { Meta, StoryObj } from '@storybook/react'
import Main from './Main.js'

const meta = {
  title: 'JsonUI/Store State Auto Save',
  component: Main,
} satisfies Meta<typeof Main>

export default meta

type Story = StoryObj<typeof meta>

export const StoreStateAutoSave: Story = {}
