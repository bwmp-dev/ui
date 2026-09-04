import { describe, expect, it } from 'vitest'
import { ApiError, isApiError, userMessage } from './errors'

describe('ApiError', () => {
  it('marks network and 5xx failures as worth retrying', () => {
    expect(new ApiError('offline', { kind: 'network' }).isTransient).toBe(true)
    expect(new ApiError('boom', { kind: 'http', status: 503 }).isTransient).toBe(true)
  })

  it('does not retry failures the server will keep rejecting', () => {
    expect(new ApiError('gone', { kind: 'http', status: 404 }).isTransient).toBe(false)
    expect(new ApiError('bad', { kind: 'validation', status: 422 }).isTransient).toBe(false)
    expect(new ApiError('nope', { kind: 'auth', status: 401 }).isTransient).toBe(false)
  })

  it('carries field errors through for the form layer', () => {
    const error = new ApiError('Invalid', {
      kind: 'validation',
      status: 422,
      fields: { name: 'Too short.' },
    })
    expect(isApiError(error)).toBe(true)
    expect(error.fields).toEqual({ name: 'Too short.' })
  })
})

describe('userMessage', () => {
  it('explains what the user can do about it', () => {
    expect(userMessage(new ApiError('x', { kind: 'network' }))).toMatch(/connection/i)
    expect(userMessage(new ApiError('x', { kind: 'auth', status: 401 }))).toMatch(/sign in/i)
    expect(userMessage(new ApiError('x', { kind: 'http', status: 404 }))).toMatch(
      /no longer exists/i,
    )
    expect(userMessage(new ApiError('x', { kind: 'http', status: 409 }))).toMatch(
      /changed this first/i,
    )
  })

  it('keeps validation copy from the server, which is specific', () => {
    const error = new ApiError('Name is already taken.', { kind: 'validation', status: 422 })
    expect(userMessage(error)).toBe('Name is already taken.')
  })

  it('never leaks a server fault to the user', () => {
    const error = new ApiError('NullReferenceException at Foo.Bar', {
      kind: 'http',
      status: 500,
    })
    expect(userMessage(error)).toBe('The server had a problem.')
    // The detail is still on the error, for logging and for <ErrorState/> in dev.
    expect(error.message).toContain('NullReferenceException')
  })

  it('falls back to a generic message for anything that is not an ApiError', () => {
    expect(userMessage(new TypeError('undefined is not a function'))).toBe('Something went wrong.')
  })
})
