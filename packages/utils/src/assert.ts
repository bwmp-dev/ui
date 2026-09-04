export class InvariantError extends Error {
  override readonly name = 'InvariantError'
}

/**
 * Throw when a condition that should be impossible is violated.
 *
 * The message may be a thunk so that expensive interpolation is skipped on the
 * happy path.
 */
export function invariant(
  condition: unknown,
  message: string | (() => string) = 'Invariant failed',
): asserts condition {
  if (condition) return
  throw new InvariantError(typeof message === 'function' ? message() : message)
}

/**
 * Exhaustiveness guard. If this stops type-checking, a union gained a member
 * that the surrounding switch does not handle.
 */
export function assertNever(value: never, message = 'Unexpected value'): never {
  throw new InvariantError(`${message}: ${JSON.stringify(value)}`)
}
