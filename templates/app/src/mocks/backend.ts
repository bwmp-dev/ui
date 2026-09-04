/**
 * An in-memory stand-in for the real API.
 *
 * It exists so `pnpm dev` works the moment the project is generated, and so the
 * e2e suite has deterministic data. It implements the same HTTP contract as the
 * real backend, which means `src/api/client.ts` is exercised for real — the
 * only thing swapped out is the network call itself.
 *
 * Delete this directory and set `VITE_API_MOCK=false` once a backend exists.
 */

import type { Paginated } from '~/api/types'
import type { Device, DeviceInput } from '~/features/devices/schema'
import type { Session } from '~/features/auth/schema'

const REGIONS = ['eu-west-1', 'eu-central-1', 'us-east-1', 'us-west-2', 'ap-south-1']
const STATUSES = ['online', 'degraded', 'offline'] as const
const KINDS = ['gateway', 'sensor', 'controller'] as const

function seedDevices(count: number): Device[] {
  // A fixed seed keeps the table, the tests and the screenshots stable.
  let seed = 20260101
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }

  return Array.from({ length: count }, (_, index) => {
    const kind = KINDS[Math.floor(random() * KINDS.length)] ?? 'sensor'
    const status = STATUSES[Math.floor(random() * STATUSES.length)] ?? 'online'
    return {
      id: `dev_${String(index + 1).padStart(4, '0')}`,
      name: `${kind}-${String(index + 1).padStart(3, '0')}`,
      kind,
      status,
      region: REGIONS[Math.floor(random() * REGIONS.length)] ?? 'eu-west-1',
      firmware: `2.${Math.floor(random() * 6)}.${Math.floor(random() * 12)}`,
      lastSeen: new Date(Date.UTC(2026, 8, 3, 9, 0) - Math.floor(random() * 86_400_000 * 6)).toISOString(),
      throughputKbps: Math.round(random() * 4800) + 120,
      notes: '',
    }
  })
}

type MockState = { devices: Device[]; session: Session | null }

/**
 * State is mirrored into sessionStorage so a reload behaves the way it would
 * against a real backend: the session survives, and so do writes made during
 * the session. Without this, refreshing the page signs you out, which makes
 * both development and end-to-end testing misleading.
 *
 * The version suffix invalidates the store when the seed data changes.
 */
const STORAGE_KEY = 'stack:mock-api:v1'

function loadState(): MockState {
  if (typeof sessionStorage !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as MockState
    } catch {
      // Fall through to a fresh seed.
    }
  }
  return { devices: seedDevices(84), session: null }
}

const state = loadState()

function persist() {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded; the mock simply stops surviving reloads.
  }
}

/** Simulated latency, so loading states are visible during development. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

function json(body: unknown, status = 200): Response {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function compare(a: Device, b: Device, key: string): number {
  const left = a[key as keyof Device]
  const right = b[key as keyof Device]
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right))
}

function listDevices(params: URLSearchParams): Paginated<Device> {
  const search = params.get('search')?.toLowerCase().trim() ?? ''
  const status = params.getAll('status')
  const region = params.getAll('region')
  const sort = params.get('sort') ?? 'name'
  const order = params.get('order') === 'desc' ? -1 : 1
  const page = Number(params.get('page') ?? 0)
  const pageSize = Number(params.get('pageSize') ?? 20)

  const filtered = state.devices.filter((device) => {
    if (status.length > 0 && !status.includes(device.status)) return false
    if (region.length > 0 && !region.includes(device.region)) return false
    if (!search) return true
    return (
      device.name.toLowerCase().includes(search) ||
      device.id.toLowerCase().includes(search) ||
      device.region.toLowerCase().includes(search)
    )
  })

  const sorted = [...filtered].sort((a, b) => compare(a, b, sort) * order)

  return {
    items: sorted.slice(page * pageSize, page * pageSize + pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

function validateDevice(input: Partial<DeviceInput>): Record<string, string> | null {
  const errors: Record<string, string> = {}
  const name = input.name?.trim() ?? ''

  if (name.length < 3) errors.name = 'Name must be at least 3 characters.'
  else if (!/^[a-z0-9-]+$/.test(name)) {
    errors.name = 'Use lower-case letters, numbers and hyphens only.'
  }
  if (!input.region) errors.region = 'Choose a region.'

  return Object.keys(errors).length > 0 ? errors : null
}

/**
 * A drop-in replacement for `fetch`, matched on method and path.
 */
export async function mockFetch(input: string, init: RequestInit = {}): Promise<Response> {
  await delay()

  const url = new URL(input, 'http://mock.local')
  const path = url.pathname.replace(/^.*\/api/, '')
  const method = init.method ?? 'GET'
  const body = typeof init.body === 'string' ? JSON.parse(init.body) : undefined

  if (path === '/auth/session' && method === 'GET') {
    return state.session ? json(state.session) : json({ message: 'Not signed in.' }, 401)
  }

  if (path === '/auth/login' && method === 'POST') {
    const email = String(body?.email ?? '')
    if (!email.includes('@')) return json({ errors: { email: 'Enter a valid email address.' } }, 422)
    if (body?.password !== 'password') {
      return json({ message: 'Those credentials did not match.' }, 401)
    }
    state.session = {
      token: 'mock-token',
      user: { id: 'usr_1', name: 'Ada Byron', email, role: 'admin' },
    }
    persist()
    return json(state.session)
  }

  if (path === '/auth/logout' && method === 'POST') {
    state.session = null
    persist()
    return json(null, 204)
  }

  if (path === '/devices' && method === 'GET') return json(listDevices(url.searchParams))

  if (path === '/devices' && method === 'POST') {
    const errors = validateDevice(body ?? {})
    if (errors) return json({ errors }, 422)

    const device: Device = {
      id: `dev_${String(state.devices.length + 1).padStart(4, '0')}`,
      name: body.name.trim(),
      kind: body.kind,
      region: body.region,
      status: 'online',
      firmware: '2.5.0',
      lastSeen: new Date().toISOString(),
      throughputKbps: 0,
      notes: body.notes ?? '',
    }
    state.devices = [device, ...state.devices]
    persist()
    return json(device, 201)
  }

  const detail = /^\/devices\/([^/]+)$/.exec(path)
  if (detail) {
    const id = detail[1]
    const index = state.devices.findIndex((device) => device.id === id)
    if (index === -1) return json({ message: 'Device not found.' }, 404)

    if (method === 'GET') return json(state.devices[index])

    if (method === 'PATCH') {
      const errors = validateDevice({ ...state.devices[index], ...body })
      if (errors) return json({ errors }, 422)
      const updated = { ...state.devices[index]!, ...body, name: body.name?.trim() ?? state.devices[index]!.name }
      state.devices = state.devices.map((device, at) => (at === index ? updated : device))
      persist()
      return json(updated)
    }

    if (method === 'DELETE') {
      state.devices = state.devices.filter((device) => device.id !== id)
      persist()
      return json(null, 204)
    }
  }

  return json({ message: `No mock route for ${method} ${path}` }, 404)
}
