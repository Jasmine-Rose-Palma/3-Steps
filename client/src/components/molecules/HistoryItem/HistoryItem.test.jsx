import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HistoryItem from './HistoryItem.jsx'

describe('HistoryItem', () => {
  it('shows the name, tag and badges, and the completed date', () => {
    render(
      <ul>
        <HistoryItem
          name="Stretch it out"
          category="Physical"
          duration="3 min"
          difficulty="low"
          completedAt="2026-10-03T12:00:00.000Z"
        />
      </ul>
    )
    expect(screen.getByRole('listitem')).toBeInTheDocument()
    expect(screen.getByText('Stretch it out')).toBeInTheDocument()
    expect(screen.getByText('Physical')).toBeInTheDocument()
    expect(screen.getByText('Low-effort')).toBeInTheDocument()
    const time = screen.getByText(/Oct 3, 2026/)
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('datetime', '2026-10-03T12:00:00.000Z')
  })
})
