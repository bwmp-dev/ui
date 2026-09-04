import { createColumnHelper } from '@tanstack/react-table'
import { selectionColumn, type DefaultTableFeatures } from '@stack/ui/table'
import { Badge, Code } from '@stack/ui'
import { formatNumber, formatRelativeTime } from '@stack/utils'
import { statusTone, type Device } from '../schema'

/**
 * Column definitions live beside the feature, not inside @stack/ui.
 *
 * `DataTable` only knows how to render a table instance; what the columns mean
 * is application knowledge.
 */
const helper = createColumnHelper<DefaultTableFeatures, Device>()

export const deviceColumns = helper.columns([
  helper.display(selectionColumn()),

  helper.accessor('name', {
    header: 'Name',
    cell: (info) => <span className="font-medium text-fg">{info.getValue()}</span>,
  }),

  helper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue()
      return (
        <Badge tone={statusTone[status]} dot>
          {status}
        </Badge>
      )
    },
  }),

  helper.accessor('kind', {
    header: 'Kind',
    meta: { hideBelowMd: true },
    cell: (info) => <span className="text-fg-muted">{info.getValue()}</span>,
  }),

  helper.accessor('region', {
    header: 'Region',
    cell: (info) => <Code>{info.getValue()}</Code>,
  }),

  helper.accessor('throughputKbps', {
    header: 'Throughput',
    meta: { align: 'right', hideBelowMd: true },
    cell: (info) => (
      <span className="tabular-nums">
        {formatNumber(info.getValue())}
        <span className="text-fg-subtle"> kbps</span>
      </span>
    ),
  }),

  helper.accessor('lastSeen', {
    header: 'Last seen',
    meta: { align: 'right' },
    // The absolute time goes in the title so hovering gives the exact value.
    cell: (info) => (
      <span className="whitespace-nowrap text-fg-muted" title={info.getValue()}>
        {formatRelativeTime(info.getValue())}
      </span>
    ),
  }),
])
