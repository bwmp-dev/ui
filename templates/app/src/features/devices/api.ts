import { z } from 'zod'
import { api } from '~/api/client'
import type { ListParams, Paginated } from '~/api/types'
import { deviceSchema, type Device, type DeviceInput } from './schema'

/**
 * Feature-local API functions.
 *
 * They live beside the feature rather than in a global `services` folder so
 * that deleting the feature deletes its endpoints too. They return parsed
 * domain objects and know nothing about React or TanStack Query.
 */

export type DeviceListParams = ListParams & {
  status?: string[]
  region?: string[]
}

const pageSchema = z.object({
  items: z.array(deviceSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

export async function listDevices(
  params: DeviceListParams,
  signal?: AbortSignal,
): Promise<Paginated<Device>> {
  const response = await api.get('/devices', {
    query: { ...params },
    ...(signal ? { signal } : {}),
  })
  return pageSchema.parse(response)
}

export async function getDevice(id: string, signal?: AbortSignal): Promise<Device> {
  return deviceSchema.parse(await api.get(`/devices/${id}`, signal ? { signal } : {}))
}

export async function createDevice(input: DeviceInput): Promise<Device> {
  return deviceSchema.parse(await api.post('/devices', input))
}

export async function updateDevice(id: string, input: Partial<DeviceInput>): Promise<Device> {
  return deviceSchema.parse(await api.patch(`/devices/${id}`, input))
}

export async function deleteDevice(id: string): Promise<void> {
  await api.delete(`/devices/${id}`)
}
