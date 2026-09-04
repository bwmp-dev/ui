import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Slider as BaseSlider } from '@base-ui/react/slider'
import { cn } from '@bwmp-dev/utils'

export type SliderProps = ComponentPropsWithRef<typeof BaseSlider.Root> & {
  label?: ReactNode
  /** Show the current value beside the label. */
  showValue?: boolean
}

/**
 * A single value or a range, depending on whether `value` is a number or an
 * array. Base UI renders one thumb per value and handles the keyboard and
 * touch interaction for both cases.
 */
export function Slider({ label, showValue = true, className, ...props }: SliderProps) {
  return (
    <BaseSlider.Root {...props} className={cn('flex w-full flex-col gap-1.5', className)}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-2">
          {label ? (
            <BaseSlider.Label className="text-xs font-medium text-fg">{label}</BaseSlider.Label>
          ) : (
            <span />
          )}
          {showValue ? <BaseSlider.Value className="font-mono text-2xs text-fg-muted" /> : null}
        </div>
      ) : null}

      <BaseSlider.Control className="flex h-4 w-full touch-none items-center select-none">
        <BaseSlider.Track className="h-1 w-full rounded-full bg-surface-sunken">
          <BaseSlider.Indicator className="h-full rounded-full bg-accent" />
          <BaseSlider.Thumb
            className={cn(
              'size-3.5 rounded-full border-2 border-accent bg-surface shadow-xs',
              'focus-ring transition-control',
              'data-[dragging]:scale-110',
              'data-[disabled]:cursor-not-allowed data-[disabled]:border-line-strong',
            )}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}
