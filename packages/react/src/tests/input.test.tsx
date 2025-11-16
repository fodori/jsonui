/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'
import components from '../stock/components'

expect.extend(matchers)

const Counter = () => {
  const renderCounter = useRef(0)
  renderCounter.current += 1
  return <h1>Renders: {renderCounter.current}</h1>
}

const NewEdit = (props: any) => {
  const OldEdit = components.Edit
  return (
    <>
      <OldEdit {...props} />
      <Counter />
    </>
  )
}

test('Edit component test', () => {
  render(
    <JsonUI
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: { $modifier: 'get', store: 'data', path: '/age' },
        onChange: { $action: 'set', store: 'data', path: '/age' },
      }}
    />
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(input).toHaveValue('test@example.com')
})

test('check rerender count after action', () => {
  render(
    <JsonUI
      components={{ Counter, NewEdit }}
      model={{
        $comp: 'NewEdit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: { $modifier: 'get', store: 'data', path: '/age' },
        onChange: { $action: 'set', store: 'data', path: '/age' },
      }}
    />
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()

  // Check initial render count
  expect(screen.getByText('Renders: 1')).toBeInTheDocument()

  // Trigger change event
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(input).toHaveValue('test@example.com')

  // Check that render count increased
  expect(screen.getByText('Renders: 2')).toBeInTheDocument()
})
/**
 * TODO:
 * - check actions (with nested ,promise and sync )
 * - check modification (with nested ,promise and sync )
 * - check modification order for example redux vs. simple function
 * - check children and no children component with children prop
 * - check data manipulation with mutability situation
 * - check error boundary how works
 * Low:
 * - check performance or memory leak???

 * */
