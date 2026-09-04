import type { ComponentPropsWithRef } from 'react'
import { cn, cv, type VariantProps } from '@stack/utils'

/**
 * A bordered surface.
 *
 * Reach for a Card when content genuinely needs to be separated from what
 * surrounds it. Grouping with headings, spacing and dividers is usually the
 * better answer — a page of nested cards has no hierarchy left to give.
 */
export const cardVariants = cv({
  base: 'rounded-md border',
  variants: {
    variant: {
      surface: 'border-line bg-surface',
      raised: 'border-line bg-surface-raised shadow-xs',
      sunken: 'border-line-muted bg-surface-sunken',
      ghost: 'border-transparent bg-transparent',
    },
    interactive: {
      true: 'cursor-pointer text-left focus-ring transition-control hover:border-line-strong hover:bg-hover',
    },
  },
  defaultVariants: { variant: 'surface' },
})

export type CardProps = ComponentPropsWithRef<'div'> & VariantProps<typeof cardVariants>

function CardRoot({ variant, interactive, className, ...props }: CardProps) {
  return <div {...props} className={cardVariants({ variant, interactive, className })} />
}

function CardHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex items-start justify-between gap-3 px-4 pt-3 pb-2', className)}
    />
  )
}

function CardTitle({ className, children, ...props }: ComponentPropsWithRef<'h3'>) {
  return (
    <h3 {...props} className={cn('text-ui font-semibold text-fg', className)}>
      {children}
    </h3>
  )
}

function CardDescription({ className, ...props }: ComponentPropsWithRef<'p'>) {
  return <p {...props} className={cn('mt-0.5 text-xs text-fg-muted', className)} />
}

function CardContent({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('px-4 py-3', className)} />
}

function CardFooter({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex items-center justify-end gap-2 border-t border-line-muted px-4 py-2.5',
        className,
      )}
    />
  )
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
})
