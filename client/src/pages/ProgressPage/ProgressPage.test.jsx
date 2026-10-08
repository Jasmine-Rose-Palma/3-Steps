import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProgressPage from './ProgressPage.jsx'
import { renderPage } from '../../test-utils.jsx'
import { allActivities, completion } from '../../test-fixtures.js'

describe('ProgressPage', () => {
  it('says how many activities were completed and lists them', () => {
    renderPage(
      <ProgressPage
        status="ready"
        completedActivities={[completion(2, 11), completion(1, 1)]}
        activities={allActivities}
      />
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Your little wins' })).toBeInTheDocument()
    expect(screen.getByText('2 activities completed')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Progress' })).toHaveAttribute('aria-current', 'page')
  })

  it('uses the singular for one', () => {
    renderPage(<ProgressPage status="ready" completedActivities={[completion(1, 1)]} activities={allActivities} />)
    expect(screen.getByText('1 activity completed')).toBeInTheDocument()
  })

  it('encourages a first win and links to Home when there is nothing yet', async () => {
    renderPage(<ProgressPage status="ready" completedActivities={[]} activities={allActivities} />)
    expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Find an activity' }))
    expect(screen.getByTestId('where')).toHaveTextContent('/')
  })

  it('shows a loading line while the data loads', () => {
    renderPage(<ProgressPage status="loading" completedActivities={[]} activities={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)
  })

  it('shows an error if the data could not be loaded', () => {
    renderPage(<ProgressPage status="error" completedActivities={[]} activities={[]} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/couldn't load your progress/i)
  })
})
