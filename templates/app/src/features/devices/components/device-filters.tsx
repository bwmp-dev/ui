import { FilterBar, SearchInput, Select } from '@stack/ui'
import { DEVICE_REGIONS, deviceStatusSchema, type DeviceStatus } from '../schema'
import { countActiveFilters, emptyDeviceFilters, type DeviceFilterValues } from '../filters'

export type DeviceFiltersProps = {
  value: DeviceFilterValues
  onChange: (next: DeviceFilterValues) => void
  /** Rendered on the right, e.g. the result count. */
  trailing?: React.ReactNode
}

/**
 * Filter state is owned by the route and mirrored into the URL, so a filtered
 * view can be linked, bookmarked and restored on reload. This component is
 * purely presentational.
 */
export function DeviceFilters({ value, onChange, trailing }: DeviceFiltersProps) {
  return (
    <FilterBar
      activeCount={countActiveFilters(value)}
      onClear={() => onChange(emptyDeviceFilters)}
      trailing={trailing}
    >
      <SearchInput
        value={value.search}
        onValueChange={(search) => onChange({ ...value, search })}
        placeholder="Search devices…"
        label="Search devices"
        className="w-56"
      />

      <Select
        multiple
        items={{ online: 'Online', degraded: 'Degraded', offline: 'Offline' }}
        value={value.status}
        onValueChange={(status) => onChange({ ...value, status: status as DeviceStatus[] })}
      >
        <Select.Trigger
          size="sm"
          aria-label="Filter by status"
          placeholder="Status"
          className="w-36"
        />
        <Select.Content>
          {deviceStatusSchema.options.map((status) => (
            <Select.Item key={status} value={status}>
              {status}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <Select
        multiple
        value={value.region}
        onValueChange={(region) => onChange({ ...value, region: region as string[] })}
      >
        <Select.Trigger
          size="sm"
          aria-label="Filter by region"
          placeholder="Region"
          className="w-40"
        />
        <Select.Content>
          {DEVICE_REGIONS.map((region) => (
            <Select.Item key={region} value={region}>
              {region}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </FilterBar>
  )
}
