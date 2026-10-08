import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApi, ApiError } from './api.js'

function respond(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

afterEach(() => vi.unstubAllGlobals())

describe('createApi', () => {
  it('asks for activities with no token and no query when no filters are given', async () => {
    const fetchMock = vi.fn(async () => respond(200, [{ id: 1 }]))
    vi.stubGlobal('fetch', fetchMock)
    const api = createApi({ baseUrl: '/api', getToken: async () => 'secret' })

    expect(await api.getActivities()).toEqual([{ id: 1 }])
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/activities')
    expect(init.headers.Authorization).toBeUndefined()
  })

  it('puts the time and energy filters in the query string', async () => {
    const fetchMock = vi.fn(async () => respond(200, []))
    vi.stubGlobal('fetch', fetchMock)
    await createApi().getActivities({ time: 'under5', energy: 'someEffort' })
    expect(fetchMock.mock.calls[0][0]).toBe('/api/activities?time=under5&energy=someEffort')
  })

  it('sends the Bearer token when listing completions', async () => {
    const fetchMock = vi.fn(async () => respond(200, []))
    vi.stubGlobal('fetch', fetchMock)
    await createApi({ getToken: async () => 'abc.def.ghi' }).getCompletions()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/completions')
    expect(init.headers.Authorization).toBe('Bearer abc.def.ghi')
  })

  it('POSTs the activityId as JSON with the token', async () => {
    const fetchMock = vi.fn(async () => respond(201, { id: 5, activityId: 2, completedAt: 'x' }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await createApi({ getToken: async () => 't' }).addCompletion(2)
    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ activityId: 2 })
    expect(init.headers.Authorization).toBe('Bearer t')
    expect(result.id).toBe(5)
  })

  it("throws an ApiError carrying the server's message and status", async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respond(401, { error: 'Sign in required' })))
    const error = await createApi().getCompletions().catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Sign in required')
    expect(error.status).toBe(401)
  })

  it('falls back to a generic message when the error body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 502, json: async () => { throw new Error('html') } }))
    )
    const error = await createApi().getActivities().catch((e) => e)
    expect(error.message).toBe('Request failed (502)')
  })

  it('explains a network failure in plain words', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch') }))
    const error = await createApi().getActivities().catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.message).toMatch(/could not reach the server/i)
  })
})
