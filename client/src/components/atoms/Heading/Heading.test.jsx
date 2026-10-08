import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Heading from './Heading.jsx'

describe('Heading', () => {
  it('renders an h1 by default', () => {
    render(<Heading>Hello</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'Hello' })).toBeInTheDocument()
  })

  it('renders the level it is asked for', () => {
    render(<Heading level={2}>Section</Heading>)
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
  })
})

describe('Heading display style', () => {
  it('marks the one-off hero style only when asked', () => {
    render(
      <>
        <Heading display>Hero</Heading>
        <Heading level={2}>Plain</Heading>
      </>
    )
    expect(screen.getByRole('heading', { name: 'Hero' })).toHaveAttribute('data-display', 'true')
    expect(screen.getByRole('heading', { name: 'Plain' })).not.toHaveAttribute('data-display')
  })
})

describe('Heading centered', () => {
  it('centres only when asked', () => {
    render(
      <>
        <Heading centered>Middle</Heading>
        <Heading level={2}>Left</Heading>
      </>
    )
    expect(screen.getByRole('heading', { name: 'Middle' })).toHaveAttribute('data-centered', 'true')
    expect(screen.getByRole('heading', { name: 'Left' })).not.toHaveAttribute('data-centered')
  })
})

describe('Heading accent', () => {
  it('uses the accent colour only when asked', () => {
    render(
      <>
        <Heading accent>Welcome</Heading>
        <Heading level={2}>Plain</Heading>
      </>
    )
    expect(screen.getByRole('heading', { name: 'Welcome' })).toHaveAttribute('data-accent', 'true')
    expect(screen.getByRole('heading', { name: 'Plain' })).not.toHaveAttribute('data-accent')
  })
})
