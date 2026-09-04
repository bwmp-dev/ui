import type { ComponentPropsWithRef, ReactNode } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { cn, cv, type VariantProps } from '@stack/utils'
import type { IconComponent } from '@stack/icons'
import { Spinner } from './spinner'

/**
 * Buttons default to the neutral `secondary` variant.
 *
 * Promoting an action to `primary` should be a decision, not the path of least
 * resistance — a screen with five primary buttons has no primary action.
 */
export const buttonVariants = cv({
  base: [
    'relative inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap',
    'rounded-md border font-medium select-none',
    'focus-ring transition-control',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary:
        'border-transparent bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent-active',
      secondary: 'border-line bg-surface text-fg hover:bg-hover active:bg-active',
      ghost: 'border-transparent text-fg-muted hover:bg-hover hover:text-fg active:bg-active',
      subtle:
        'border-transparent bg-accent-subtle text-accent-text hover:bg-accent hover:text-accent-fg',
      danger:
        'border-transparent bg-danger text-danger-fg hover:bg-danger-hover active:bg-danger-active',
      link: 'h-auto border-transparent px-0 text-accent-text underline-offset-4 hover:underline',
    },
    size: {
      xs: 'h-control-xs gap-1 px-gutter-xs text-2xs',
      sm: 'h-control-sm px-gutter-sm text-xs',
      md: 'h-control-md px-gutter-md text-ui',
      lg: 'h-control-lg px-gutter-lg text-ui',
    },
    fullWidth: { true: 'w-full' },
  },
  defaultVariants: { variant: 'secondary', size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>

type ButtonOwnProps = ButtonVariants & {
  /** Leading icon. Pass the component, not an element: `icon={Plus}`. */
  icon?: IconComponent
  /** Trailing icon, e.g. a chevron on a menu trigger. */
  iconEnd?: IconComponent
  /**
   * Swaps the content for a spinner while keeping the button's width, and marks
   * it busy for assistive technology.
   */
  loading?: boolean
  children?: ReactNode
}

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'color'> &
  ButtonOwnProps & {
    /** Render as a different element or component, e.g. a router link. */
    render?: useRender.RenderProp
  }

const iconSize = { xs: 12, sm: 13, md: 14, lg: 16 } as const

/**
 * Shared body for Button and LinkButton. The only difference between them is
 * the element rendered when no `render` prop is supplied.
 */
function useButtonElement(
  {
    variant,
    size = 'md',
    fullWidth,
    icon: Icon,
    iconEnd: IconEnd,
    loading = false,
    className,
    children,
    render,
    disabled,
    type,
    ...props
  }: ButtonProps,
  defaultTagName: 'button' | 'a',
) {
  const dimension = iconSize[size]
  const isNativeButton = defaultTagName === 'button' && render === undefined
  const inactive = Boolean(disabled) || loading

  const content = (
    <>
      {Icon ? <Icon width={dimension} height={dimension} aria-hidden /> : null}
      {children}
      {IconEnd ? <IconEnd width={dimension} height={dimension} aria-hidden /> : null}
    </>
  )

  return useRender({
    render,
    defaultTagName,
    props: {
      // `disabled` is only meaningful on a real button; anything else needs the
      // ARIA equivalent so the state is still announced.
      ...(isNativeButton
        ? { type: type ?? 'button', disabled: inactive }
        : inactive
          ? { 'aria-disabled': true }
          : {}),
      'aria-busy': loading || undefined,
      className: buttonVariants({ variant, size, fullWidth, className }),
      ...props,
      children: loading ? (
        <>
          <span className="absolute inset-0 grid place-items-center">
            <Spinner size={size} />
          </span>
          <span className="invisible inline-flex items-center gap-1.5">{content}</span>
        </>
      ) : (
        content
      ),
    },
  })
}

export function Button(props: ButtonProps) {
  return useButtonElement(props, 'button')
}

export type IconButtonProps = Omit<ButtonProps, 'icon' | 'iconEnd' | 'fullWidth' | 'children'> & {
  icon: IconComponent
  /**
   * The accessible name. Required, because an icon on its own tells a screen
   * reader nothing — and it is what a wrapping Tooltip should display.
   */
  label: string
}

const iconButtonSizes = {
  xs: 'size-control-xs px-0',
  sm: 'size-control-sm px-0',
  md: 'size-control-md px-0',
  lg: 'size-control-lg px-0',
} as const

export function IconButton({
  icon: Icon,
  label,
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const dimension = iconSize[size]
  return (
    <Button
      {...props}
      size={size}
      aria-label={label}
      className={cn(iconButtonSizes[size], className)}
    >
      <Icon width={dimension} height={dimension} aria-hidden />
    </Button>
  )
}

export type LinkButtonProps = Omit<ComponentPropsWithRef<'a'>, 'color'> &
  ButtonOwnProps & { render?: useRender.RenderProp }

/**
 * A link styled as a button.
 *
 * Use it when the action navigates. For a router link, compose:
 * `<LinkButton render={<Link to="/settings" />}>Settings</LinkButton>`.
 */
export function LinkButton(props: LinkButtonProps) {
  return useButtonElement(props as ButtonProps, 'a')
}
