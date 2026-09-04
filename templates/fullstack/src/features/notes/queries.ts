import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { addNote, editNote, fetchNotes, removeNote } from './server'
import type { NoteInput } from './schema'

/**
 * TanStack Query over server functions.
 *
 * The server function is the transport, exactly as `api/client.ts` is in the
 * application template. Caching, invalidation and optimistic updates are
 * decided here, and the components stay unaware of both.
 */
export const noteKeys = {
  all: ['notes'] as const,
  list: () => [...noteKeys.all, 'list'] as const,
}

export const notesQuery = () =>
  queryOptions({
    queryKey: noteKeys.list(),
    queryFn: () => fetchNotes(),
  })

export function useAddNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NoteInput) => addNote({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useEditNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (variables: { id: string; input: Partial<NoteInput> }) => editNote({ data: variables }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useRemoveNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeNote({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  })
}
