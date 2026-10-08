import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import HistoryList from './HistoryList.jsx'
import { allActivities, completion } from '../../../test-fixtures.js'

describe('HistoryList', () => {
  it('looks up each completion\'s activity by id and keeps the order it was given', () => {
    render(<HistoryList completions={[completion(2, 11), completion(1, 1)]} activities={allActivities} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByText('Quick walk around the block')).toBeInTheDocument()
    expect(within(items[0]).getByText('A bit of effort')).toBeInTheDocument()
    expect(within(items[1]).getByText('Stretch it out')).toBeInTheDocument()
  })

  it('shows the same activity twice if it was done twice', () => {
    render(<HistoryList completions={[completion(2, 1), completion(1, 1)]} activities={allActivities} />)
    expect(screen.getAllByText('Stretch it out')).toHaveLength(2)
  })

  it('skips a completion whose activity is unknown instead of showing a blank row', () => {
    render(<HistoryList completions={[completion(1, 999)]} activities={allActivities} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
