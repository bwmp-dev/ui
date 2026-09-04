import type { ReactNode } from 'react'

/** A labelled row, so a section reads as a list rather than a pile. */
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xs font-medium tracking-wide text-fg-subtle uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

export function Stack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>
}
