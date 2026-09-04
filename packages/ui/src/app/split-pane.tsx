import { useCallback, useId, useRef, type ReactNode } from 'react'
import { useControllableState } from '@stack/hooks'
import { cn } from '@stack/utils'

export type SplitPaneProps = {
  /** Panel rendered before the handle. */
  start: ReactNode
  /** Panel rendered after the handle. */
  end: ReactNode
  orientation?: 'horizontal' | 'vertical'
  /** Size of the start panel as a percentage of the container. */
  size?: number
  defaultSize?: number
  onSizeChange?: (size: number) => void
  minSize?: number
  maxSize?: number
  /** Percentage points moved per arrow key press. */
  step?: number
  /** Accessible name for the divider, e.g. "Resize details panel". */
  label?: string
  className?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Two resizable panels with a draggable divider.
 *
 * The divider is a real `role="separator"` with `aria-valuenow`, and arrow keys
 * resize it — a drag-only splitter is unusable without a mouse. Sizes are
 * percentages so the layout survives a window resize without any measurement.
 *
 * ```tsx
 * <SplitPane
 *   start={<DeviceTable />}
 *   end={<DeviceDetails />}
 *   defaultSize={62}
 *   label="Resize details panel"
 * />
 * ```
 */
export function SplitPane({
  start,
  end,
  orientation = 'horizontal',
  size,
  defaultSize = 50,
  onSizeChange,
  minSize = 15,
  maxSize = 85,
  step = 2,
  label = 'Resize panels',
  className,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startPanelId = useId()
  const [value, setValue] = useControllableState({
    value: size,
    defaultValue: defaultSize,
    onChange: onSizeChange,
  })

  const isHorizontal = orientation === 'horizontal'

  const applyFromPointer = useCallback(
    (event: { clientX: number; clientY: number }) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const ratio = isHorizontal
        ? (event.clientX - rect.left) / rect.width
        : (event.clientY - rect.top) / rect.height
      setValue(clamp(ratio * 100, minSize, maxSize))
    },
    [isHorizontal, minSize, maxSize, setValue],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    // Pointer capture keeps the drag alive over iframes and other panels.
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    applyFromPointer(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const decrease = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
    const increase = isHorizontal ? 'ArrowRight' : 'ArrowDown'

    if (event.key === decrease) setValue((current) => clamp(current - step, minSize, maxSize))
    else if (event.key === increase) setValue((current) => clamp(current + step, minSize, maxSize))
    else if (event.key === 'Home') setValue(minSize)
    else if (event.key === 'End') setValue(maxSize)
    else return

    event.preventDefault()
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex min-h-0 min-w-0', isHorizontal ? 'flex-row' : 'flex-col', className)}
    >
      <div
        id={startPanelId}
        className="min-h-0 min-w-0 overflow-hidden"
        style={{ flexBasis: `${value}%` }}
      >
        {start}
      </div>

      {/*
        The WAI-ARIA window splitter pattern requires a focusable
        role="separator" with aria-valuenow, which is exactly what these two
        rules assume cannot be correct.
        https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
      */}
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-controls={startPanelId}
        aria-valuenow={Math.round(value)}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative shrink-0 touch-none bg-line hover:bg-accent focus-visible:bg-accent',
          'transition-colors duration-[var(--duration-fast)] outline-none',
          isHorizontal
            ? 'w-px cursor-col-resize before:absolute before:-inset-x-1 before:inset-y-0'
            : 'h-px cursor-row-resize before:absolute before:inset-x-0 before:-inset-y-1',
        )}
      />
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{end}</div>
    </div>
  )
}
