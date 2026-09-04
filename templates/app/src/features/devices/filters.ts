import type { DeviceStatus } from './schema'

/**
 * The shape of the devices page's filter state.
 *
 * Kept apart from the component that renders it so the route can own the state
 * (and mirror it into the URL) without importing a component module.
 */
export type DeviceFilterValues = {
  search: string
  status: DeviceStatus[]
  region: string[]
}

export const emptyDeviceFilters: DeviceFilterValues = { search: '', status: [], region: [] }

export function countActiveFilters(filters: DeviceFilterValues): number {
  return (
    (filters.search ? 1 : 0) +
    (filters.status.length > 0 ? 1 : 0) +
    (filters.region.length > 0 ? 1 : 0)
  )
}
