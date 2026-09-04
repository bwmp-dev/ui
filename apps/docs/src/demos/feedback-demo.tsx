import {
  Alert,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Toaster,
  ToastProvider,
  useToast,
} from '@stack/ui'
import { Inbox } from 'lucide-react'

function ToastButtons() {
  const toast = useToast()

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast.add({ title: 'Saved', type: 'success' })}>Success toast</Button>
      <Button
        variant="danger"
        onClick={() =>
          toast.add({
            title: 'Could not save',
            description: 'The server rejected the change.',
            type: 'danger',
          })
        }
      >
        Danger toast
      </Button>
    </div>
  )
}

export default function FeedbackDemo() {
  return (
    <ToastProvider>
      <div className="flex flex-col gap-5">
        <Alert tone="info" title="Scheduled maintenance">
          The build queue is paused between 02:00 and 03:00 UTC on Sunday.
        </Alert>
        <Alert tone="warning">Two devices have not checked in for more than an hour.</Alert>
        <Alert
          tone="danger"
          title="Deployment failed"
          actions={<Button size="sm">View logs</Button>}
        >
          The health check timed out after three attempts.
        </Alert>

        <ToastButtons />

        <div className="grid gap-px overflow-hidden rounded-md border border-line md:grid-cols-3">
          <div className="bg-surface">
            <EmptyState icon={Inbox} title="No results" description="Try a broader search." />
          </div>
          <div className="bg-surface">
            <LoadingState label="Loading devices" />
          </div>
          <div className="bg-surface">
            <ErrorState
              title="Could not load"
              description="The request did not complete."
              showDetails={false}
            />
          </div>
        </div>

        <Toaster />
      </div>
    </ToastProvider>
  )
}
