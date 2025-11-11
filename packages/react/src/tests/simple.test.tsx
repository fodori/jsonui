/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { JsonUI } from '../index'

test('model undefined', () => {
  const { container } = render(<JsonUI model={undefined} />)
  expect(container.firstChild).toBeNull()
})

test('model null', () => {
  const { container } = render(<JsonUI model={null} />)
  // JsonUI with null model renders a span with "null" text, not null
  expect(container.firstChild).not.toBeNull()
  expect(container.textContent).toBe('null')
})

test('Text component test', () => {
  const { container } = render(
    <JsonUI model={{ $comp: 'Text', $children: 'JsonUI test page v0.1', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } }} />
  )

  const textElement = screen.getByText('JsonUI test page v0.1')
  expect(textElement).toBeInTheDocument()

  // The id and styles are on the parent <p> element, not the text <span>
  const paragraphElement = container.querySelector('p')
  expect(paragraphElement).toHaveAttribute('id', 'id1')
  expect(paragraphElement).toHaveStyle({
    textAlign: 'center',
    fontSize: '30px',
    margin: '5px',
  })
})

test('model view and 2 text with style', () => {
  const { container } = render(
    <JsonUI
      model={{
        $comp: 'View',
        $children: [
          { $comp: 'Text', $children: 'test111', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } },
          { $comp: 'Text', $children: 'test2222', id: 'id2', style: { textAlign: 'left', fontSize: 37, margin: 5 } },
        ],
      }}
    />
  )

  const text1 = screen.getByText('test111')
  const text2 = screen.getByText('test2222')

  expect(text1).toBeInTheDocument()
  expect(text2).toBeInTheDocument()

  // Find the parent <p> elements that contain the id and styles
  const paragraph1 = container.querySelector('p[id="id1"]')
  const paragraph2 = container.querySelector('p[id="id2"]')

  expect(paragraph1).toHaveAttribute('id', 'id1')
  expect(paragraph1).toHaveStyle({
    textAlign: 'center',
    fontSize: '30px',
    margin: '5px',
  })
  expect(paragraph2).toHaveAttribute('id', 'id2')
  expect(paragraph2).toHaveStyle({
    textAlign: 'left',
    fontSize: '37px',
    margin: '5px',
  })
})

test('simple array test with htext', () => {
  const { container } = render(
    <JsonUI
      model={[
        { $comp: 'Text', $children: 'test111', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } },
        { $comp: 'Text', $children: 'test2222', id: 'id2', style: { textAlign: 'left', fontSize: 37, margin: 5 } },
      ]}
    />
  )

  const text1 = screen.getByText('test111')
  const text2 = screen.getByText('test2222')

  expect(text1).toBeInTheDocument()
  expect(text2).toBeInTheDocument()

  // Find the parent <p> elements that contain the id and styles
  const paragraph1 = container.querySelector('p[id="id1"]')
  const paragraph2 = container.querySelector('p[id="id2"]')

  expect(paragraph1).toHaveAttribute('id', 'id1')
  expect(paragraph1).toHaveStyle({
    textAlign: 'center',
    fontSize: '30px',
    margin: '5px',
  })
  expect(paragraph2).toHaveAttribute('id', 'id2')
  expect(paragraph2).toHaveStyle({
    textAlign: 'left',
    fontSize: '37px',
    margin: '5px',
  })
})
