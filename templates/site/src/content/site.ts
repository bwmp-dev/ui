/**
 * Everything project-specific about this site.
 *
 * Change this file first when starting a new project: the layout, SEO tags,
 * sitemap and footer all read from here rather than hard-coding strings.
 */
export const SITE = {
  name: 'Meridian',
  tagline: 'Read your logs like a database, not a firehose.',
  description:
    'Meridian is a local-first log explorer for distributed systems. Index once, query with SQL, and keep everything on your own machine.',
  url: 'https://meridian.example',
  /** Used for og:image and twitter:image. Must be an absolute URL when rendered. */
  ogImage: '/og.png',
  locale: 'en',
  github: 'https://github.com/example/meridian',
  discord: 'https://discord.gg/example',
  /** Shown in the install section and the download buttons. */
  version: '0.9.4',
} as const

export const NAV = [
  { href: '#features', label: 'Features' },
  { href: '#screenshots', label: 'Screenshots' },
  { href: '#install', label: 'Install' },
  { href: '#faq', label: 'FAQ' },
] as const
