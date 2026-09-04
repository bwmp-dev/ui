import { Tabs } from '@bwmp-dev/ui'

export type Shot = {
  src: string
  alt: string
  label: string
  caption: string
}

/**
 * The one React island on this site.
 *
 * It exists to show that the shared design system works client-side: `Tabs`
 * comes straight from @bwmp-dev/ui, with its roving focus and ARIA wiring intact.
 * It hydrates on `visible`, so a visitor who never scrolls this far downloads
 * none of it — which is the whole reason the header is plain HTML instead.
 */
export function ScreenshotGallery({ shots }: { shots: Shot[] }) {
  const first = shots[0]
  if (!first) return null

  return (
    <Tabs defaultValue={first.label}>
      <Tabs.List variant="segmented" className="w-fit">
        {shots.map((shot) => (
          <Tabs.Tab key={shot.label} value={shot.label}>
            {shot.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {shots.map((shot, index) => (
        <Tabs.Panel key={shot.label} value={shot.label} className="mt-4">
          <figure className="m-0 flex flex-col gap-3">
            <div className="overflow-hidden rounded-lg border border-line bg-surface-sunken shadow-md">
              <img
                src={shot.src}
                alt={shot.alt}
                width={1280}
                height={800}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="block w-full"
              />
            </div>
            <figcaption className="text-sm text-fg-muted">{shot.caption}</figcaption>
          </figure>
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
