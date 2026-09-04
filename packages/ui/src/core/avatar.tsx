import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { cv, type VariantProps } from '@bwmp-dev/utils'

export const avatarVariants = cv({
  base: 'relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-surface-sunken font-medium text-fg-muted select-none',
  variants: {
    size: {
      xs: 'size-4 text-[0.5rem]',
      sm: 'size-5 text-2xs',
      md: 'size-6 text-2xs',
      lg: 'size-8 text-xs',
      xl: 'size-12 text-ui',
    },
    shape: { rounded: 'rounded-sm', circle: 'rounded-full' },
  },
  defaultVariants: { size: 'md', shape: 'rounded' },
})

/**
 * Derive up to two initials from a display name.
 *
 * Uses code points rather than `charAt` so names starting with an emoji or an
 * astral-plane character do not produce a broken surrogate half.
 */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = [...(words[0] ?? '')][0] ?? ''
  const last = words.length > 1 ? ([...(words[words.length - 1] ?? '')][0] ?? '') : ''
  return (first + last).toUpperCase()
}

export type AvatarProps = ComponentPropsWithRef<'span'> &
  VariantProps<typeof avatarVariants> & {
    src?: string
    /**
     * The person or entity the avatar represents. Used for the image's alt text
     * and to derive the initials fallback.
     */
    name?: string
    /** Overrides the derived initials, e.g. with an icon. */
    fallback?: ReactNode
  }

/**
 * Base UI handles the part that is actually fiddly here: the fallback is shown
 * until the image has decoded, so there is no flash of initials on a cached
 * image and no empty box on a broken URL.
 */
export function Avatar({ src, name, fallback, size, shape, className, ...props }: AvatarProps) {
  return (
    <BaseAvatar.Root {...props} className={avatarVariants({ size, shape, className })}>
      {src ? (
        <BaseAvatar.Image src={src} alt={name ?? ''} className="size-full object-cover" />
      ) : null}
      <BaseAvatar.Fallback className="flex size-full items-center justify-center">
        {fallback ?? (name ? initialsOf(name) : null)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  )
}
