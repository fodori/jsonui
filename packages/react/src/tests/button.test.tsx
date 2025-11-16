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

const JSONStringifyValue = ({ value }: any) => {
  return <h1>value={JSON.stringify(value)}::END</h1>
}

test('redux value store test: null', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: null },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value=null::END')).toBeInTheDocument()
})

test('redux value store test: undefined', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: undefined },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value=::END')).toBeInTheDocument()
})

test('redux value store test: true', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: true },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value=true::END')).toBeInTheDocument()
})

test('redux value store test: false', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: false },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value=false::END')).toBeInTheDocument()
})

test('redux value store test: number', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: 34.342865 },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value=34.342865::END')).toBeInTheDocument()
})

test('redux value store test: string', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: '34.342865' },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value="34.342865"::END')).toBeInTheDocument()
})

test('redux value store test: array', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: [null, true, false, 14, 'asd'] },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value=[null,true,false,14,"asd"]::END')).toBeInTheDocument()
})

test('redux value store test: object', () => {
  render(
    <JsonUI
      components={{ JSONStringifyValue }}
      model={[
        { $comp: 'JSONStringifyValue', value: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: { aa: 'aa', bb: 'cc' } },
        },
      ]}
    />
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()

  expect(screen.getByText('value=::END')).toBeInTheDocument()
  fireEvent.click(button)
  expect(screen.getByText('value={"aa":"aa","bb":"cc"}::END')).toBeInTheDocument()
})
