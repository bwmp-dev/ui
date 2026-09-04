import { z } from 'zod'

/**
 * The contract with the API, in one place per feature.
 *
 * Parsing responses catches drift between frontend and backend at the boundary
 * rather than three components deep, and the inferred types keep the two in
 * step without a hand-written interface to forget to update.
 */

export const deviceStatusSchema = z.enum(['online', 'degraded', 'offline'])
export const deviceKindSchema = z.enum(['gateway', 'sensor', 'controller'])

export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: deviceKindSchema,
  status: deviceStatusSchema,
  region: z.string(),
  firmware: z.string(),
  lastSeen: z.iso.datetime(),
  throughputKbps: z.number(),
  notes: z.string(),
})

/** What the create/edit form produces. Mirrors the server's validation rules. */
export const deviceInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters.')
    .regex(/^[a-z0-9-]+$/, 'Use lower-case letters, numbers and hyphens only.'),
  kind: deviceKindSchema,
  region: z.string().min(1, 'Choose a region.'),
  notes: z.string().max(280, 'Keep notes under 280 characters.'),
})

export type Device = z.infer<typeof deviceSchema>
export type DeviceInput = z.infer<typeof deviceInputSchema>
export type DeviceStatus = z.infer<typeof deviceStatusSchema>
export type DeviceKind = z.infer<typeof deviceKindSchema>

export const DEVICE_REGIONS = [
  'eu-west-1',
  'eu-central-1',
  'us-east-1',
  'us-west-2',
  'ap-south-1',
] as const

export const statusTone = {
  online: 'success',
  degraded: 'warning',
  offline: 'danger',
} as const satisfies Record<DeviceStatus, 'success' | 'warning' | 'danger'>
