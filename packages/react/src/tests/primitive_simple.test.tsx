/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'

expect.extend(matchers)

test('model undefined', () => {
  const { container } = render(<JsonUI model={undefined} />)
  expect(container.firstChild).toBeNull()
})

test('model null', () => {
  const { container } = render(<JsonUI model={null} />)
  expect(container.firstChild).not.toBeNull()
  expect(container.textContent).toBe('null')
})

test('model false', () => {
  const { container } = render(<JsonUI model={false} />)
  expect(container.firstChild).not.toBeNull()
  expect(container.textContent).toBe('false') // because false is rendered as text
})

test('model false', () => {
  const { container } = render(<JsonUI model={true} />)
  expect(container.firstChild).not.toBeNull()
  expect(container.textContent).toBe('true') // because true is rendered as text
})

test('string test', () => {
  render(<JsonUI model="JsonUI test page v0.1" />)
  expect(screen.getByText('JsonUI test page v0.1')).toBeInTheDocument()
})

test('integer test', () => {
  render(<JsonUI model={999888} />)
  expect(screen.getByText('999888')).toBeInTheDocument()
})

test('integer 0 test', () => {
  render(<JsonUI model={0} />)
  expect(screen.getByText('0')).toBeInTheDocument()
})

test('negative integer test', () => {
  render(<JsonUI model={-999888} />)
  expect(screen.getByText('-999888')).toBeInTheDocument()
})

test('complex number test', () => {
  render(<JsonUI model={2.99792458e8} />)
  expect(screen.getByText('299792458')).toBeInTheDocument()
})

test('boolean test true', () => {
  render(<JsonUI model />)
  expect(screen.getByText('true')).toBeInTheDocument()
})

test('boolean test false', () => {
  render(<JsonUI model={false} />)
  expect(screen.getByText('false')).toBeInTheDocument()
})

test('array test', () => {
  render(<JsonUI model={[1, null, true, false, -3, 'qqqqq']} />)
  expect(screen.getByText('1')).toBeInTheDocument()
  expect(screen.getByText('null')).toBeInTheDocument()
  expect(screen.getByText('true')).toBeInTheDocument()
  expect(screen.getByText('false')).toBeInTheDocument()
  expect(screen.getByText('-3')).toBeInTheDocument()
  expect(screen.getByText('qqqqq')).toBeInTheDocument()
})
