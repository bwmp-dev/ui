import { Alert, Button, EmptyState, ErrorState, LoadingState, useToast } from '@bwmp-dev/ui'
import { Inbox } from 'lucide-react'
import { Row, Stack } from './shared'

export function StatesSection() {
  const toast = useToast()

  return (
    <Stack>
      <Alert tone="info" title="Scheduled maintenance">
        The build queue is paused between 02:00 and 03:00 UTC on Sunday.
      </Alert>
      <Alert tone="success">Deployment finished in 42 seconds.</Alert>
      <Alert tone="warning" onDismiss={() => {}}>
        Two devices have not checked in for more than an hour.
      </Alert>
      <Alert tone="danger" title="Deployment failed" actions={<Button size="sm">View logs</Button>}>
        The health check timed out after three attempts.
      </Alert>

      <Row label="Toasts">
        <Button onClick={() => toast.add({ title: 'Saved', type: 'success' })}>Success</Button>
        <Button
          onClick={() =>
            toast.add({
              title: 'Heads up',
              description: 'Two devices are degraded.',
              type: 'warning',
            })
          }
        >
          Warning
        </Button>
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
          Danger
        </Button>
      </Row>

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
            error={new Error('fetch failed: ECONNREFUSED')}
            onRetry={() => {}}
          />
        </div>
      </div>
    </Stack>
  )
}
