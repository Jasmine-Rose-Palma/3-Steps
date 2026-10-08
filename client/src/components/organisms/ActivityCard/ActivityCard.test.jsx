import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ActivityCard from './ActivityCard.jsx'
import { stretch } from '../../../test-fixtures.js'

describe('ActivityCard', () => {
  it('shows the name, meta and description', () => {
    render(<ActivityCard activity={stretch} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Stretch it out' })).toBeInTheDocument()
    expect(screen.getByText('Physical')).toBeInTheDocument()
    expect(screen.getByText('3 min')).toBeInTheDocument()
    expect(screen.getByText(stretch.description)).toBeInTheDocument()
  })

  it('renders its children (the action buttons) inside the card', () => {
    render(
      <ActivityCard activity={stretch}>
        <button>Do this</button>
      </ActivityCard>
    )
    expect(screen.getByRole('article')).toContainElement(screen.getByRole('button', { name: 'Do this' }))
  })

  it('compact hides the description and the children', () => {
    render(
      <ActivityCard activity={stretch} compact>
        <button>Do this</button>
      </ActivityCard>
    )
    expect(screen.getByText('Stretch it out')).toBeInTheDocument()
    expect(screen.queryByText(stretch.description)).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('ActivityCard look', () => {
  it('uses the large tag and badges in both the full and compact card', () => {
    const { rerender } = render(<ActivityCard activity={stretch} />)
    expect(screen.getByText('Physical')).toHaveAttribute('data-size', 'large')
    rerender(<ActivityCard activity={stretch} compact />)
    expect(screen.getByText('Physical')).toHaveAttribute('data-size', 'large')
    expect(screen.getByText('3 min')).toHaveAttribute('data-size', 'large')
  })
})
