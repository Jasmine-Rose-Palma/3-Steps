import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tag from './Tag.jsx'

describe('Tag', () => {
  it('shows its label', () => {
    render(<Tag label="Physical" />)
    expect(screen.getByText('Physical')).toBeInTheDocument()
  })

  it('shows a different label when given a different one', () => {
    render(<Tag label="Tidying" />)
    expect(screen.getByText('Tidying')).toBeInTheDocument()
    expect(screen.queryByText('Physical')).not.toBeInTheDocument()
  })

  it('renders a <span> carrying a class from Tag.module.css', () => {
    render(<Tag label="Social" />)
    const tag = screen.getByText('Social')
    expect(tag.tagName).toBe('SPAN')
    expect(tag.className).not.toBe('')
  })
})

describe('Tag size', () => {
  it('is small unless asked for large', () => {
    render(
      <>
        <Tag label="Small one" />
        <Tag label="Big one" size="large" />
      </>
    )
    expect(screen.getByText('Small one')).toHaveAttribute('data-size', 'small')
    expect(screen.getByText('Big one')).toHaveAttribute('data-size', 'large')
  })
})
