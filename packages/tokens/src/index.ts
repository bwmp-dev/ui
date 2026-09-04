/**
 * A machine-readable index of the token surface.
 *
 * The CSS in this package is the source of truth; this file exists so the docs
 * site can render swatches and tables without parsing stylesheets, and so a
 * project can enumerate what it is allowed to override. It contains no values —
 * duplicating them here would guarantee they drift.
 */

export type TokenGroup = {
  id: string
  title: string
  description: string
  /** CSS custom property names, without the leading `--`. */
  tokens: readonly string[]
}

export const colorTokens = [
  {
    id: 'surfaces',
    title: 'Surfaces',
    description: 'Background layers, from the app canvas up to overlays.',
    tokens: ['canvas', 'surface', 'surface-raised', 'surface-sunken', 'overlay'],
  },
  {
    id: 'foreground',
    title: 'Foreground',
    description: 'Text and icon colours ordered by decreasing emphasis.',
    tokens: ['fg', 'fg-muted', 'fg-subtle', 'fg-disabled'],
  },
  {
    id: 'lines',
    title: 'Lines',
    description: 'Borders, dividers and outlines.',
    tokens: ['line', 'line-muted', 'line-strong'],
  },
  {
    id: 'interactive',
    title: 'Interactive',
    description: 'Translucent states that layer over any surface, plus the focus ring.',
    tokens: ['hover', 'active', 'selected', 'ring'],
  },
  {
    id: 'accent',
    title: 'Accent',
    description: 'The brand colour. Overriding this family rebrands the whole system.',
    tokens: [
      'accent',
      'accent-hover',
      'accent-active',
      'accent-fg',
      'accent-text',
      'accent-subtle',
      'accent-line',
    ],
  },
  {
    id: 'success',
    title: 'Success',
    description: 'Positive outcomes and healthy status.',
    tokens: ['success', 'success-fg', 'success-text', 'success-subtle', 'success-line'],
  },
  {
    id: 'warning',
    title: 'Warning',
    description: 'Degraded state or an action that needs attention.',
    tokens: ['warning', 'warning-fg', 'warning-text', 'warning-subtle', 'warning-line'],
  },
  {
    id: 'danger',
    title: 'Danger',
    description: 'Destructive actions and failures.',
    tokens: [
      'danger',
      'danger-hover',
      'danger-active',
      'danger-fg',
      'danger-text',
      'danger-subtle',
      'danger-line',
    ],
  },
  {
    id: 'info',
    title: 'Info',
    description: 'Neutral informational emphasis.',
    tokens: ['info', 'info-fg', 'info-text', 'info-subtle', 'info-line'],
  },
] as const satisfies readonly TokenGroup[]

export const scaleTokens = [
  {
    id: 'typography',
    title: 'Typography',
    description: 'Font stacks and the density-aware UI text size.',
    tokens: ['font-ui', 'font-code', 'ui-text-size', 'ui-line-height'],
  },
  {
    id: 'shape',
    title: 'Shape',
    description: 'One knob drives the whole radius scale.',
    tokens: ['radius-base'],
  },
  {
    id: 'elevation',
    title: 'Elevation',
    description: 'Shadow steps, tuned separately for light and dark.',
    tokens: ['elevation-1', 'elevation-2', 'elevation-3', 'elevation-4'],
  },
  {
    id: 'motion',
    title: 'Motion',
    description: 'Durations and easing curves. All durations collapse under reduced motion.',
    tokens: [
      'duration-instant',
      'duration-fast',
      'duration-normal',
      'duration-slow',
      'easing-standard',
      'easing-entrance',
      'easing-exit',
    ],
  },
  {
    id: 'layering',
    title: 'Layering',
    description: 'Stacking order for anything that escapes normal flow.',
    tokens: [
      'z-base',
      'z-sticky',
      'z-navbar',
      'z-drawer',
      'z-overlay',
      'z-dialog',
      'z-popover',
      'z-toast',
      'z-tooltip',
    ],
  },
  {
    id: 'density',
    title: 'Density',
    description: 'Geometry that responds to data-density.',
    tokens: [
      'control-h-xs',
      'control-h-sm',
      'control-h-md',
      'control-h-lg',
      'control-px-xs',
      'control-px-sm',
      'control-px-md',
      'control-px-lg',
      'row-h',
      'stack-gap',
      'section-gap',
      'sidebar-w',
      'navbar-h',
    ],
  },
  {
    id: 'layout',
    title: 'Layout',
    description: 'Container widths.',
    tokens: ['width-page', 'width-content', 'width-narrow', 'width-prose'],
  },
] as const satisfies readonly TokenGroup[]

export const tokenGroups = [...colorTokens, ...scaleTokens] as const

export type Appearance = 'light' | 'dark'
export type Density = 'comfortable' | 'compact'

/** Attribute names the token CSS reacts to. Kept here so JS never hardcodes them. */
export const themeAttributes = {
  appearance: 'data-appearance',
  theme: 'data-theme',
  density: 'data-density',
} as const

/**
 * Custom entries this package adds to each Tailwind theme namespace.
 *
 * tailwind-merge needs to know about them, otherwise it misclassifies names it
 * has never seen — `text-ui` would be read as a colour and stop conflicting
 * with `text-sm`. Deriving the list here keeps that config from drifting.
 */
export const themeNamespaces = {
  color: colorTokens.flatMap((group) => group.tokens),
  text: ['ui', '2xs'],
  spacing: [
    'control-xs',
    'control-sm',
    'control-md',
    'control-lg',
    'gutter-xs',
    'gutter-sm',
    'gutter-md',
    'gutter-lg',
    'row',
    'stack',
    'section',
    'sidebar',
    'navbar',
  ],
  ease: ['standard', 'entrance', 'exit'],
  container: ['page', 'content', 'narrow'],
  animate: ['spin-slow', 'pulse-subtle'],
} as const satisfies Record<string, readonly string[]>
