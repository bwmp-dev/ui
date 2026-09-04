import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import {
  AlertDialog,
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  IconButton,
  Input,
  Page,
  PageHeader,
  Switch,
  Textarea,
  useToast,
} from '@stack/ui'
import { FormField, SubmitButton } from '@stack/ui/form'
import { formatRelativeTime } from '@stack/utils'
import { NotebookPen, Pin, Plus, Trash2 } from 'lucide-react'
import { noteInputSchema, type Note, type NoteInput } from '~/features/notes/schema'
import { notesQuery, useAddNote, useEditNote, useRemoveNote } from '~/features/notes/queries'

/**
 * The loader runs on the server for the first request, so the notes are in the
 * HTML rather than fetched after hydration. `useSuspenseQuery` then reads the
 * cache the loader already filled — no second request, no loading flash.
 */
export const Route = createFileRoute('/_app/notes')({
  loader: ({ context }) => context.queryClient.ensureQueryData(notesQuery()),
  component: NotesPage,
})

function NotesPage() {
  const { data: notes } = useSuspenseQuery(notesQuery())
  const [editing, setEditing] = useState<Note | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <Page width="content">
      <PageHeader
        title="Notes"
        description="Rendered on the server, mutated through server functions."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
            New note
          </Button>
        }
      />

      {notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes yet"
          description="Write down the thing you will otherwise re-derive next month."
          action={
            <Button size="sm" variant="primary" icon={Plus} onClick={() => setCreating(true)}>
              New note
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={() => setEditing(note)} />
          ))}
        </ul>
      )}

      <NoteDialog open={creating} onOpenChange={setCreating} />
      <NoteDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        note={editing ?? undefined}
      />
    </Page>
  )
}

function NoteCard({ note, onEdit }: { note: Note; onEdit: () => void }) {
  const toast = useToast()
  const remove = useRemoveNote()
  const edit = useEditNote()
  const [confirming, setConfirming] = useState(false)

  return (
    <li>
      <Card>
        <Card.Header>
          <div className="min-w-0">
            <Card.Title className="flex items-center gap-2">
              {note.title}
              {note.pinned ? (
                <Badge tone="accent" variant="subtle" size="sm">
                  Pinned
                </Badge>
              ) : null}
            </Card.Title>
            <Card.Description>Updated {formatRelativeTime(note.updatedAt)}</Card.Description>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <IconButton
              size="sm"
              variant="ghost"
              icon={Pin}
              label={note.pinned ? 'Unpin note' : 'Pin note'}
              onClick={() => edit.mutate({ id: note.id, input: { pinned: !note.pinned } })}
              className={note.pinned ? 'text-accent-text' : undefined}
            />
            <Button size="sm" onClick={onEdit}>
              Edit
            </Button>
            <IconButton
              size="sm"
              variant="ghost"
              icon={Trash2}
              label={`Delete ${note.title}`}
              onClick={() => setConfirming(true)}
            />
          </div>
        </Card.Header>

        {note.body ? (
          <Card.Content className="text-fg-muted pt-0 text-xs whitespace-pre-wrap">
            {note.body}
          </Card.Content>
        ) : null}
      </Card>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete “{note.title}”?</AlertDialog.Title>
            <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button>Cancel</Button>} />
            <Button
              variant="danger"
              loading={remove.isPending}
              onClick={async () => {
                await remove.mutateAsync(note.id)
                toast.add({ title: 'Note deleted', description: note.title })
                setConfirming(false)
              }}
            >
              Delete note
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </li>
  )
}

function NoteDialog({
  open,
  onOpenChange,
  note,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  note?: Note
}) {
  const toast = useToast()
  const add = useAddNote()
  const edit = useEditNote()
  const isEdit = note !== undefined

  const form = useForm({
    defaultValues: isEdit
      ? { title: note.title, body: note.body, pinned: note.pinned }
      : ({ title: '', body: '', pinned: false } satisfies NoteInput),
    // The same schema the server function validates with, so the client can
    // fail fast without the rules living in two places.
    validators: { onSubmit: noteInputSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        if (isEdit) await edit.mutateAsync({ id: note.id, input: value })
        else await add.mutateAsync(value)
        toast.add({ title: isEdit ? 'Note updated' : 'Note created', type: 'success' })
        onOpenChange(false)
        formApi.reset()
      } catch (error) {
        toast.add({
          title: error instanceof Error ? error.message : 'Could not save the note.',
          type: 'danger',
        })
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="md">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <Dialog.Header>
            <Dialog.Title>{isEdit ? 'Edit note' : 'New note'}</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body className="flex flex-col gap-4">
            <form.Field name="title">
              {(field) => (
                <FormField field={field} label="Title" required>
                  {(f) => (
                    <Input
                      value={f.state.value}
                      required
                      onBlur={f.handleBlur}
                      onChange={(event) => f.handleChange(event.target.value)}
                    />
                  )}
                </FormField>
              )}
            </form.Field>

            <form.Field name="body">
              {(field) => (
                <FormField field={field} label="Body">
                  {(f) => (
                    <Textarea
                      value={f.state.value}
                      rows={5}
                      onBlur={f.handleBlur}
                      onChange={(event) => f.handleChange(event.target.value)}
                    />
                  )}
                </FormField>
              )}
            </form.Field>

            <form.Field name="pinned">
              {(field) => (
                <Switch
                  label="Pin to the top"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked === true)}
                />
              )}
            </form.Field>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close render={<Button type="button">Cancel</Button>} />
            <SubmitButton form={form}>{isEdit ? 'Save changes' : 'Create note'}</SubmitButton>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  )
}
