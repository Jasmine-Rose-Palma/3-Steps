import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button.jsx'

describe('Button', () => {
  it('renders a real <button> showing its children', () => {
    render(<Button>Find an activity</Button>)
    expect(screen.getByRole('button', { name: 'Find an activity' })).toBeInTheDocument()
  })

  it('has type="button" so it never submits a form by accident', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'button')
  })

  it("defaults to the 'primary' variant and 'filled' style", () => {
    render(<Button>Go</Button>)
    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toHaveAttribute('data-variant', 'primary')
    expect(button).toHaveAttribute('data-style', 'filled')
  })

  it('passes variant and style through as data attributes', () => {
    render(<Button variant="accent" style="outline">Go</Button>)
    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toHaveAttribute('data-variant', 'accent')
    expect(button).toHaveAttribute('data-style', 'outline')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled, and ignores clicks, when disabled is true', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Go</Button>)
    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is enabled by default', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toBeEnabled()
  })
})

describe('Button extras', () => {
  it('can be a submit button', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('stretches to full width on request', () => {
    render(<Button fullWidth>Wide</Button>)
    expect(screen.getByRole('button', { name: 'Wide' })).toHaveAttribute('data-full', 'true')
  })

  it('passes accessibility attributes through to the <button>', () => {
    render(<Button aria-pressed={true}>Toggle</Button>)
    expect(screen.getByRole('button', { name: 'Toggle', pressed: true })).toBeInTheDocument()
  })
})

describe('Button sizes and header variants', () => {
  it('is the small size unless told otherwise', () => {
    render(<Button>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('data-size', 'small')
  })

  it('can be the large (Home) or nav (header) size', () => {
    render(
      <>
        <Button size="large">Big</Button>
        <Button size="nav">Nav</Button>
      </>
    )
    expect(screen.getByRole('button', { name: 'Big' })).toHaveAttribute('data-size', 'large')
    expect(screen.getByRole('button', { name: 'Nav' })).toHaveAttribute('data-size', 'nav')
  })

  it('accepts the dark and maroon variants used by the header', () => {
    render(
      <>
        <Button variant="dark">Progress</Button>
        <Button variant="maroon" style="outline">Logout</Button>
      </>
    )
    expect(screen.getByRole('button', { name: 'Progress' })).toHaveAttribute('data-variant', 'dark')
    expect(screen.getByRole('button', { name: 'Logout' })).toHaveAttribute('data-variant', 'maroon')
  })
})
