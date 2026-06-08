import type { Meta, StoryObj } from '@storybook/react'
import type { JsonUINode, ActionContext, JSONParams } from '@jsonui/core'
import { modifiers, actions } from '@jsonui/core'
import { JsonUI, builtinComponents } from '../index.js'

const model = {
  $children: [
    {
      helperText: 'Enter the name of the German archaeologist who rediscovered Troy.',
      label: 'Who discovered the ruins of Troy in 1870?',
      $comp: 'Edit',
      $validations: [
        {
          jsonataDef: "$lowercase($) = 'heinrich schliemann' or $lowercase($) = 'schliemann' ? null : 'The correct answer is Heinrich Schliemann'",
        },
      ],
      path: '/archaeologist',
      store: 'data',
      style: {
        marginTop: 12,
      },
    },
    {
      helperText: 'Approximate year (BCE). Historians estimate around 1200 BCE.',
      label: 'According to historians, when did the Trojan War occur?',
      $comp: 'Edit',
      $validations: [
        {
          schema: {
            type: 'number',
          },
        },
        {
          jsonataDef: "$ >= 1150 and $ <= 1250 ? null : 'Most historians date it around 1200 BCE (1150-1250 BCE)'",
        },
      ],
      path: '/trojanWarYear',
      store: 'data',
      style: {
        marginTop: 12,
      },
      type: 'number',
    },
    {
      helperText: "Choose Homer's epic that tells the story of the Trojan War.",
      label: 'Which epic poem narrates the Trojan War?',
      $comp: 'Edit',
      $validations: [
        {
          schema: {
            errorMessage: {
              minLength: 'Please select an answer',
            },
            minLength: 1,
            type: 'string',
          },
        },
        {
          jsonataDef: "$ >= 1150 and $ <= 1250 ? null : 'Most historians date it around 1200 BCE (1150-1250 BCE)'",
        },
        {
          jsonataDef: "$ >= 1150 and $ <= 1250 ? null : 'Most historians date it around 1200 BCE (1150-1250 BCE)'",
        },
        {
          jsonataDef: "$ >= 1150 and $ <= 1250 ? null : 'Most historians date it around 1200 BCE (1150-1250 BCE)'",
        },
      ],
      options: [
        {
          label: 'The Iliad',
          value: 'iliad',
        },
        {
          label: 'The Odyssey',
          value: 'odyssey',
        },
        {
          label: 'The Aeneid',
          value: 'aeneid',
        },
        {
          label: 'The Epic of Gilgamesh',
          value: 'gilgamesh',
        },
      ],
      path: '/homerEpic',
      select: true,
      store: 'data',
      style: {
        marginTop: 12,
      },
    },
    {
      $children: 'Submit Your Answers',
      $comp: 'SubmitButton',
      path: '/',
      store: 'data',
      style: {
        marginTop: 16,
      },
    },
    {
      $comp: 'StoreDebugger',
      data: {
        $modifier: 'get',
        store: 'data',
        path: '/',
      },
      error: {
        $modifier: 'get',
        store: 'data',
        path: '/',
        type: 'ERROR',
      },
      touched: {
        $modifier: 'get',
        store: 'data',
        path: '/',
        getBoolean: false,
        type: 'TOUCH',
      },
    },
  ],
  $comp: 'View',
  style: {
    margin: 16,
    maxWidth: 600,
    padding: 16,
  },
} as JsonUINode
const defaultValues = {} as JSONParams

const submit = (params: JSONParams, context: ActionContext) => {
  console.log('Submit value:', context?.componentProps?.value)
}

const meta = {
  title: 'JsonUI/Try',
  component: JsonUI,
  args: {
    components: builtinComponents,
    modifiers,
    actions: { ...actions, submit },
  },
} satisfies Meta<typeof JsonUI>

export default meta

type Story = StoryObj<typeof meta>

export const Try: Story = {
  args: {
    model,
    defaultValues,
    defaultLanguage: 'en',
    activeLanguage: 'hu',
  },
}
