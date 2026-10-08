import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge.jsx'

describe('Badge', () => {
  it('shows its label', () => {
    render(<Badge label="5 min" />)
    expect(screen.getByText('5 min')).toBeInTheDocument()
  })
})

describe('Badge size', () => {
  it('is small unless asked for large', () => {
    render(
      <>
        <Badge label="3 min" />
        <Badge label="Low-effort" size="large" />
      </>
    )
    expect(screen.getByText('3 min')).toHaveAttribute('data-size', 'small')
    expect(screen.getByText('Low-effort')).toHaveAttribute('data-size', 'large')
  })
})
