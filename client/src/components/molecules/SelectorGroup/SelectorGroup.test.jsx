import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectorGroup from './SelectorGroup.jsx'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

describe('SelectorGroup', () => {
  it('is a labelled group with one button per option', () => {
    render(<SelectorGroup legend="Pick one" options={options} value={null} onChange={() => {}} />)
    const group = screen.getByRole('group', { name: 'Pick one' })
    expect(group).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('marks only the chosen option as pressed and filled', () => {
    render(<SelectorGroup legend="Pick one" options={options} value="b" onChange={() => {}} />)
    const a = screen.getByRole('button', { name: 'Option A' })
    const b = screen.getByRole('button', { name: 'Option B' })
    expect(a).toHaveAttribute('aria-pressed', 'false')
    expect(a).toHaveAttribute('data-style', 'outline')
    expect(b).toHaveAttribute('aria-pressed', 'true')
    expect(b).toHaveAttribute('data-style', 'filled')
  })

  it('reports the value that was tapped', async () => {
    const onChange = vi.fn()
    render(<SelectorGroup legend="Pick one" options={options} value={null} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Option A' }))
    expect(onChange).toHaveBeenCalledWith('a')
  })
})
