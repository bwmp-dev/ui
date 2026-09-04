import { useCallback, useEffect, useRef, useState } from 'react'

export type UseClipboardResult = {
  copy: (text: string) => Promise<boolean>
  /** True for `resetAfter` ms following a successful copy. */
  copied: boolean
  error: Error | null
  reset: () => void
}

/**
 * Copy text to the clipboard and expose a short-lived "copied" flag for
 * button feedback.
 *
 * ```tsx
 * const { copy, copied } = useClipboard()
 * <IconButton label={copied ? 'Copied' : 'Copy'} onClick={() => copy(token)} />
 * ```
 */
export function useClipboard(resetAfter = 1600): UseClipboardResult {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setCopied(false)
    setError(null)
  }, [])

  const copy = useCallback(
    async (text: string) => {
      clearTimeout(timer.current)
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setError(null)
        timer.current = setTimeout(() => setCopied(false), resetAfter)
        return true
      } catch (cause) {
        // Typically a permissions failure or a non-secure context.
        setError(cause instanceof Error ? cause : new Error(String(cause)))
        setCopied(false)
        return false
      }
    },
    [resetAfter],
  )

  return { copy, copied, error, reset }
}
