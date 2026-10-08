export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function createApi({ baseUrl = '/api', getToken = async () => null } = {}) {
  async function request(path, { method = 'GET', body, auth = false } = {}) {
    const headers = {}
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }
    if (auth) {
      const token = await getToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    let response
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
    } catch {
      throw new ApiError('Could not reach the server. Is the API running?', 0)
    }

    if (!response.ok) {
      let message = `Request failed (${response.status})`
      try {
        const data = await response.json()
        if (typeof data?.error === 'string') {
          message = data.error
        }
      } catch {
        // Not JSON: keep the default message.
      }
      throw new ApiError(message, response.status)
    }
    return response.json()
  }

  return {
    getActivities({ time, energy } = {}) {
      const params = new URLSearchParams()
      if (time) params.append('time', time)
      if (energy) params.append('energy', energy)
      const query = params.toString()
      return request(query ? `/activities?${query}` : '/activities')
    },
    getCompletions() {
      return request('/completions', { auth: true })
    },
    addCompletion(activityId) {
      return request('/completions', { method: 'POST', body: { activityId }, auth: true })
    },
  }
}
