import {
  queryOptions,
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import * as devicesApi from './api'
import type { DeviceListParams } from './api'
import type { Device, DeviceInput } from './schema'

/**
 * TanStack Query sits directly above the transport: `api.ts` fetches and
 * parses, this file decides caching, invalidation and optimistic updates.
 *
 * Keys are built from one factory so an invalidation can never miss a query
 * because two files spelled the key differently.
 */
export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (params: DeviceListParams) => [...deviceKeys.lists(), params] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
}

/**
 * `queryOptions` rather than a hook, so the same definition can be used by a
 * component, by a route loader for prefetching, and by `ensureQueryData`.
 */
export const deviceListQuery = (params: DeviceListParams) =>
  queryOptions({
    queryKey: deviceKeys.list(params),
    queryFn: ({ signal }) => devicesApi.listDevices(params, signal),
    // Paging and filtering should not blank the table on every keystroke.
    placeholderData: (previous) => previous,
  })

export const deviceQuery = (id: string) =>
  queryOptions({
    queryKey: deviceKeys.detail(id),
    queryFn: ({ signal }) => devicesApi.getDevice(id, signal),
  })

export function useCreateDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DeviceInput) => devicesApi.createDevice(input),
    onSuccess: (device) => {
      queryClient.setQueryData(deviceKeys.detail(device.id), device)
      void queryClient.invalidateQueries({ queryKey: deviceKeys.lists() })
    },
  })
}

export function useUpdateDevice(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Partial<DeviceInput>) => devicesApi.updateDevice(id, input),
    // Rename feels instant, and rolls back cleanly if the server disagrees.
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: deviceKeys.detail(id) })
      const previous = queryClient.getQueryData<Device>(deviceKeys.detail(id))
      if (previous) {
        queryClient.setQueryData<Device>(deviceKeys.detail(id), { ...previous, ...input })
      }
      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(deviceKeys.detail(id), context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: deviceKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: deviceKeys.lists() })
    },
  })
}

export function useDeleteDevice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => devicesApi.deleteDevice(id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: deviceKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: deviceKeys.lists() })
    },
  })
}

/** Warm the cache from a route loader so the page has data on first paint. */
export function prefetchDeviceList(queryClient: QueryClient, params: DeviceListParams) {
  return queryClient.ensureQueryData(deviceListQuery(params))
}
