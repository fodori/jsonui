import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders JsonUI heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 3, name: /^JsonUI$/ })).toBeInTheDocument()
  })
})
