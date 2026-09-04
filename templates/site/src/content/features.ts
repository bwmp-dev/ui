import { Database, FileSearch, GitBranch, HardDrive, Share2, Terminal } from 'lucide-react'
import type { IconComponent } from '@stack/icons'

export type Feature = {
  title: string
  description: string
  icon: IconComponent
}

/**
 * Placeholder product content. Replace it with real capabilities — a feature
 * list is the part of a project site people actually read.
 */
export const FEATURES: Feature[] = [
  {
    title: 'Query with SQL',
    description:
      'Logs are parsed into typed columns on ingest, so filtering is a WHERE clause instead of a regular expression you rewrite every time.',
    icon: Database,
  },
  {
    title: 'Local-first',
    description:
      'The index lives on your machine. Nothing is uploaded, and everything keeps working on a plane or behind a customer VPN.',
    icon: HardDrive,
  },
  {
    title: 'Follows a request',
    description:
      'Trace and span ids are indexed alongside the message, so one click reconstructs a request across every service that touched it.',
    icon: GitBranch,
  },
  {
    title: 'Reads what you already have',
    description:
      'JSON lines, logfmt, syslog and plain text, from a file, a pipe, or a container. No agent to deploy and no format to migrate to.',
    icon: FileSearch,
  },
  {
    title: 'Built for the terminal',
    description:
      'The CLI and the desktop app share one engine. Pipe into it, script it, or open the same session in a window.',
    icon: Terminal,
  },
  {
    title: 'Shareable sessions',
    description:
      'Export a query and its results as a single file a colleague can open — including the log lines, so the link never rots.',
    icon: Share2,
  },
]
