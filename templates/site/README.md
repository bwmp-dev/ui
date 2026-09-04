# Website template

Astro with React islands, sharing `@bwmp-dev/ui` and `@bwmp-dev/tokens` with the
application template.

## Why Astro

A project site is mostly static text and images. Astro renders every section on
the server and ships JavaScript only for the components you explicitly mark as
islands, which is the opposite default to a React SPA — and the right one when
most of the page never changes.

The shared design system still works: `@bwmp-dev/ui` components render to HTML
during the build (see `ProjectHero.astro`, which uses `LinkButton`), and they
hydrate normally inside an island when interaction is required (see
`ScreenshotGallery.tsx`, which uses `Tabs`).

## What ships to the browser

The header, hero, features, install block, FAQ and footer are plain HTML.
The colour-scheme toggle and the mobile menu are Astro components with a few
lines of inline script — the menu uses the native `<dialog>` element, which
supplies focus trapping and Escape for free.

The only React island is the screenshot gallery, and it uses `client:visible`,
so a visitor who never scrolls that far downloads none of it. Reaching for an
island is a decision: check `dist/_astro/*.js` after a build before adding one.

## Making it yours

1. `src/content/site.ts` — name, URL, description, social links, version.
2. `src/content/features.ts` and `faq.ts` — the actual copy.
3. `src/styles.css` — the `:root` block is the entire brand.
4. `public/` — favicon, `og.png` (1200×630), `apple-touch-icon.png`, screenshots.

The placeholder product is a fictional log explorer. Everything in `content/`
and `public/screenshots/` is sample material meant to be deleted.

## SEO

`Seo.astro` renders the title, description, canonical URL, OpenGraph and
Twitter tags from `site.ts`. Social image URLs are made absolute against
`Astro.site`, because relative ones are ignored by most crawlers. The sitemap
comes from `@astrojs/sitemap`; `robots.txt` is in `public/` and references it.

## Commands

```bash
pnpm dev        # dev server
pnpm build      # static output in dist/
pnpm preview    # serve the build
pnpm typecheck  # astro check
```
