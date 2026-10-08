import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ActivityMeta from './ActivityMeta.jsx'

describe('ActivityMeta', () => {
  it('shows the category, the duration and a readable difficulty', () => {
    render(<ActivityMeta category="Tidying" duration="5 min" difficulty="someEffort" />)
    expect(screen.getByText('Tidying')).toBeInTheDocument()
    expect(screen.getByText('5 min')).toBeInTheDocument()
    expect(screen.getByText('A bit of effort')).toBeInTheDocument()
  })

  it('words the low difficulty as Low-effort', () => {
    render(<ActivityMeta category="Physical" duration="3 min" difficulty="low" />)
    expect(screen.getByText('Low-effort')).toBeInTheDocument()
  })
})

describe('ActivityMeta size', () => {
  it('passes the size on to the tag and both badges', () => {
    render(<ActivityMeta category="Learning" duration="3 min" difficulty="low" size="large" />)
    for (const text of ['Learning', '3 min', 'Low-effort']) {
      expect(screen.getByText(text)).toHaveAttribute('data-size', 'large')
    }
  })

  it('stays small by default', () => {
    render(<ActivityMeta category="Learning" duration="3 min" difficulty="low" />)
    expect(screen.getByText('Learning')).toHaveAttribute('data-size', 'small')
  })
})
