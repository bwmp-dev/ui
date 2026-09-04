import { useState } from 'react'
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useControllableState } from './use-controllable-state'
import { useDebouncedCallback, useDebouncedValue } from './use-debounce'
import { useHotkey } from './use-hotkey'
import { usePrevious } from './use-previous'

describe('useDebouncedValue', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('only settles once the value has been stable for the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    act(() => void vi.advanceTimersByTime(150))
    rerender({ value: 'c' })
    act(() => void vi.advanceTimersByTime(150))
    expect(result.current).toBe('a')

    act(() => void vi.advanceTimersByTime(60))
    expect(result.current).toBe('c')
  })

  it('passes the value straight through when there is no delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 0), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    expect(result.current).toBe('b')
  })
})

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('collapses bursts into a single call with the last arguments', () => {
    const spy = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(spy, 100))

    act(() => {
      result.current('a')
      result.current('b')
      result.current('c')
    })
    expect(spy).not.toHaveBeenCalled()

    act(() => void vi.advanceTimersByTime(120))
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('c')
  })

  it('cancels pending work on unmount', () => {
    const spy = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(spy, 100))
    act(() => result.current('a'))
    unmount()
    act(() => void vi.advanceTimersByTime(200))
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('useControllableState', () => {
  function Toggle({ value, onChange }: { value?: boolean; onChange?: (next: boolean) => void }) {
    const [open, setOpen] = useControllableState({
      value,
      defaultValue: false,
      ...(onChange ? { onChange } : {}),
    })
    return (
      <button type="button" onClick={() => setOpen((previous) => !previous)}>
        {open ? 'open' : 'closed'}
      </button>
    )
  }

  it('manages its own state when uncontrolled', () => {
    render(<Toggle />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('open')
  })

  it('reports changes but does not move on its own when controlled', () => {
    const onChange = vi.fn()
    render(<Toggle value={false} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))

    expect(onChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button')).toHaveTextContent('closed')
  })
})

describe('usePrevious', () => {
  it('reports the value from the previous render', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    })
    expect(result.current).toBeUndefined()

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)
  })
})

describe('useHotkey', () => {
  function Palette({ onOpen }: { onOpen: () => void }) {
    const [text, setText] = useState('')
    useHotkey('mod+k', onOpen)
    return <input aria-label="Search" value={text} onChange={(e) => setText(e.target.value)} />
  }

  it('fires on the platform modifier', () => {
    const onOpen = vi.fn()
    render(<Palette onOpen={onOpen} />)

    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true })
    expect(onOpen).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(document.body, { key: 'k' })
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('ignores keystrokes typed into a form field by default', () => {
    const onOpen = vi.fn()
    render(<Palette onOpen={onOpen} />)

    fireEvent.keyDown(screen.getByLabelText('Search'), { key: 'k', ctrlKey: true })
    expect(onOpen).not.toHaveBeenCalled()
  })
})
