import type { Note, NoteInput } from '~/features/notes/schema'

/**
 * An in-memory store standing in for a database.
 *
 * Replace the four functions below with real queries. Everything above them —
 * the server functions, the query layer, the components — is unaffected,
 * because none of it knows where the data comes from.
 */
const notes = new Map<string, Note>()

function seed() {
  if (notes.size > 0) return
  const now = Date.now()
  const initial: Array<Omit<Note, 'id'>> = [
    {
      title: 'Rotate the staging credentials',
      body: 'The staging database password is in the shared vault and expires monthly.',
      pinned: true,
      updatedAt: new Date(now - 3_600_000).toISOString(),
    },
    {
      title: 'Migration checklist',
      body: 'Take a snapshot, run the migration in a transaction, verify row counts, then swap traffic.',
      pinned: false,
      updatedAt: new Date(now - 86_400_000).toISOString(),
    },
    {
      title: 'On-call handover',
      body: 'Two alerts are muted until Friday: disk usage on build-02 and the flaky payments probe.',
      pinned: false,
      updatedAt: new Date(now - 172_800_000).toISOString(),
    },
  ]

  for (const [index, note] of initial.entries()) {
    const id = `note_${index + 1}`
    notes.set(id, { ...note, id })
  }
}

export function listNotes(ownerId: string): Note[] {
  seed()
  // A real query would filter by owner in SQL; the argument is here so the
  // shape of the call is right from the start.
  void ownerId
  return [...notes.values()].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}

export function createNote(input: NoteInput): Note {
  seed()
  const note: Note = {
    id: `note_${crypto.randomUUID().slice(0, 8)}`,
    ...input,
    updatedAt: new Date().toISOString(),
  }
  notes.set(note.id, note)
  return note
}

export function updateNote(id: string, input: Partial<NoteInput>): Note | null {
  seed()
  const existing = notes.get(id)
  if (!existing) return null
  const updated: Note = { ...existing, ...input, updatedAt: new Date().toISOString() }
  notes.set(id, updated)
  return updated
}

export function deleteNote(id: string): boolean {
  seed()
  return notes.delete(id)
}
