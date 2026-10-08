import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>
}

export function renderPage(page, { path = '/page' } = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={page} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  )
}

export function renderApp(app, { path = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[path]}>{app}</MemoryRouter>)
}
