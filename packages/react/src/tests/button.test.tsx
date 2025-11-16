/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'

expect.extend(matchers)

test('Text component test', () => {
  render(
    <JsonUI
      model={[
        { $comp: 'Text', $children: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: 'button test' },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  // Initially, the text should be empty (no value at /age)
  expect(screen.queryByText('button test')).not.toBeInTheDocument()

  // Click the button
  fireEvent.click(button)

  // After clicking, the text should appear
  expect(screen.getByText('button test')).toBeInTheDocument()
})
