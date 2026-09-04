import { Tabs } from '@stack/ui'

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
 * comes straight from @stack/ui, with its roving focus and ARIA wiring intact.
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
            <div className="border-line bg-surface-sunken overflow-hidden rounded-lg border shadow-md">
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
            <figcaption className="text-fg-muted text-sm">{shot.caption}</figcaption>
          </figure>
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
