/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'
import components from '../stock/components'

expect.extend(matchers)

const Counter = (props: any) => {
  return <h1>props: {JSON.stringify(props)}</h1>
}

const NewEdit = (props: any) => {
  const OldEdit = components.Edit
  return (
    <>
      <OldEdit {...props} />
      <Counter value={props.value} />
    </>
  )
}

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

  // Check initial state
  expect(screen.getByText('props: {}')).toBeInTheDocument()

  // Test string value
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(screen.getByText('props: {"value":"test@example.com"}')).toBeInTheDocument()

  // Note: HTML inputs always convert to strings, so we test with string values
  fireEvent.change(input, { target: { value: true } })
  expect(screen.getByText('props: {"value":"true"}')).toBeInTheDocument()

  fireEvent.change(input, { target: { value: '1' } })
  expect(screen.getByText('props: {"value":"1"}')).toBeInTheDocument()

  fireEvent.change(input, { target: { value: '' } })
  expect(screen.getByText('props: {"value":""}')).toBeInTheDocument()
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
