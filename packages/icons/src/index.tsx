import type { ComponentType, SVGProps } from 'react'

/**
 * @stack/icons
 *
 * This package deliberately does **not** re-export Lucide. A barrel over 1500
 * icons defeats tree shaking in some bundlers and adds an indirection that buys
 * nothing — import from `lucide-react` directly.
 *
 * What lives here is the small set of marks Lucide does not ship (brands are
 * out of scope for it) plus the shared icon contract that @stack/ui components
 * accept for their `icon` props.
 */

/**
 * Any icon component the design system will accept.
 *
 * Every Lucide icon satisfies this, as does any SVG component that forwards
 * props and uses `currentColor`.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export type BrandIconProps = SVGProps<SVGSVGElement> & {
  /** Rendered size in pixels. Matches Lucide's `size` prop. */
  size?: number | string
  /** Accessible name. Omit for decorative marks sitting next to a text label. */
  title?: string
}

function brandProps({ size = 16, title, ...props }: BrandIconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
    ...props,
  }
}

export function GitHubIcon({ title, ...props }: BrandIconProps) {
  return (
    <svg {...brandProps({ title, ...props })} xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11 11 0 0 1 5.79 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.12 3.05.74.81 1.18 1.85 1.18 3.11 0 4.44-2.69 5.41-5.25 5.7.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}

export function DiscordIcon({ title, ...props }: BrandIconProps) {
  return (
    <svg {...brandProps({ title, ...props })} xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}
      <path d="M20.32 4.94A19.5 19.5 0 0 0 15.5 3.4a.07.07 0 0 0-.08.04c-.2.37-.44.86-.6 1.24a18 18 0 0 0-5.44 0 12 12 0 0 0-.61-1.24.08.08 0 0 0-.08-.04c-1.68.3-3.3.8-4.82 1.54a.07.07 0 0 0-.03.03C.44 9.6-.26 14.13.08 18.6a.08.08 0 0 0 .03.06 19.7 19.7 0 0 0 5.921 3 .08.08 0 0 0 .09-.03c.46-.62.86-1.28 1.2-1.97a.08.08 0 0 0-.04-.11c-.64-.24-1.25-.53-1.84-.87a.08.08 0 0 1 0-.13l.36-.29a.07.07 0 0 1 .08 0 14.1 14.1 0 0 0 12.02 0 .07.07 0 0 1 .08 0l.37.3a.08.08 0 0 1 0 .12c-.59.34-1.2.63-1.85.87a.08.08 0 0 0-.04.11c.35.69.75 1.35 1.2 1.97a.08.08 0 0 0 .09.03 19.6 19.6 0 0 0 5.94-3 .08.08 0 0 0 .03-.06c.4-5.17-.67-9.66-2.85-13.63a.06.06 0 0 0-.03-.03ZM8.02 15.88c-1.17 0-2.13-1.07-2.13-2.39s.94-2.39 2.13-2.39c1.2 0 2.15 1.08 2.13 2.4 0 1.31-.94 2.38-2.13 2.38Zm7.87 0c-1.17 0-2.13-1.07-2.13-2.39s.94-2.39 2.13-2.39c1.2 0 2.15 1.08 2.13 2.4 0 1.31-.93 2.38-2.13 2.38Z" />
    </svg>
  )
}

export function XIcon({ title, ...props }: BrandIconProps) {
  return (
    <svg {...brandProps({ title, ...props })} xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}
      <path d="M18.9 1.9h3.4l-7.4 8.5 8.7 11.7h-6.8l-5.3-7-6.1 7H1.9l7.9-9.1L1.5 1.9h7l4.8 6.4 5.6-6.4Zm-1.2 18.1h1.9L6.4 3.8H4.4l13.3 16.2Z" />
    </svg>
  )
}

export function NpmIcon({ title, ...props }: BrandIconProps) {
  return (
    <svg {...brandProps({ title, ...props })} xmlns="http://www.w3.org/2000/svg">
      {title ? <title>{title}</title> : null}
      <path d="M1.5 6.5h21v11H12v2H6.5v-2h-5v-11Zm2 9h3v-7h2v7h1.5v-7h1.5v7H12v-9H3.5v9Zm10-9v9h3v-7h2v7h1.5v-9h-6.5Z" />
    </svg>
  )
}
