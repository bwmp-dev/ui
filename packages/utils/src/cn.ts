import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { themeNamespaces } from '@bwmp-dev/tokens'

export type { ClassValue }

/**
 * tailwind-merge configured for this design system's theme namespaces.
 *
 * Without the extension it has no way to know that `text-ui` is a font size
 * rather than a colour, so `cn('text-sm', 'text-ui')` would keep both.
 */
export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [...themeNamespaces.color],
      text: [...themeNamespaces.text],
      spacing: [...themeNamespaces.spacing],
      ease: [...themeNamespaces.ease],
      container: [...themeNamespaces.container],
      animate: [...themeNamespaces.animate],
    },
  },
})

/** Conditionally join class names and resolve Tailwind conflicts, last one wins. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
