import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SuggestionPage from './SuggestionPage.jsx'
import { renderPage } from '../../test-utils.jsx'
import { stretch } from '../../test-fixtures.js'

describe('SuggestionPage', () => {
  it('shows a heading and the full activity card with both actions', () => {
    renderPage(<SuggestionPage activity={stretch} onShowAnother={() => {}} />)
    expect(screen.getByRole('heading', { level: 1, name: "Here's something for you..." })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Stretch it out' })).toBeInTheDocument()
    expect(screen.getByText(stretch.description)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Do this' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show another' })).toBeInTheDocument()
  })

  it('"Do this" goes to the proof screen', async () => {
    renderPage(<SuggestionPage activity={stretch} onShowAnother={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Do this' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/proof')
  })

  it('"Show another" asks for a different activity', async () => {
    const onShowAnother = vi.fn()
    renderPage(<SuggestionPage activity={stretch} onShowAnother={onShowAnother} />)
    await userEvent.click(screen.getByRole('button', { name: 'Show another' }))
    expect(onShowAnother).toHaveBeenCalledTimes(1)
  })

  it('puts "Do this" first in the tab order', () => {
    renderPage(<SuggestionPage activity={stretch} onShowAnother={() => {}} />)
    const names = screen.getAllByRole('button').map((b) => b.textContent)
    expect(names.indexOf('Do this')).toBeLessThan(names.indexOf('Show another'))
  })
})

describe('SuggestionPage layout', () => {
  it('centres the heading and uses the activity column', () => {
    renderPage(<SuggestionPage activity={stretch} onShowAnother={() => {}} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('data-centered', 'true')
    expect(screen.getByRole('main')).toHaveAttribute('data-activity', 'true')
  })

  it('uses the large button size for both actions', () => {
    renderPage(<SuggestionPage activity={stretch} onShowAnother={() => {}} />)
    expect(screen.getByRole('button', { name: 'Do this' })).toHaveAttribute('data-size', 'large')
    expect(screen.getByRole('button', { name: 'Show another' })).toHaveAttribute('data-size', 'large')
  })
})
