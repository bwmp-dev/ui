import {
  Avatar,
  Badge,
  Button,
  Card,
  Code,
  Kbd,
  Progress,
  Separator,
  Skeleton,
  Spinner,
} from '@bwmp-dev/ui'

import { Row, Stack } from './shared'

export function DisplaySection() {
  return (
    <Stack>
      <Row label="Badge tones">
        {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((tone) => (
          <Badge key={tone} tone={tone} dot>
            {tone}
          </Badge>
        ))}
      </Row>
      <Row label="Badge variants">
        <Badge variant="subtle">subtle</Badge>
        <Badge variant="solid" tone="accent">
          solid
        </Badge>
        <Badge variant="outline" tone="success">
          outline
        </Badge>
        <Badge shape="pill" tone="info">
          pill
        </Badge>
      </Row>
      <Row label="Avatar">
        <Avatar name="Ada Byron" size="xs" />
        <Avatar name="Ada Byron" size="sm" />
        <Avatar name="Ada Byron" size="md" />
        <Avatar name="Grace Hopper" size="lg" shape="circle" />
        <Avatar name="Grace Hopper" size="xl" shape="circle" />
      </Row>
      <Row label="Feedback bits">
        <Spinner size="sm" />
        <Spinner />
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <Code>pnpm dev</Code>
        <Separator orientation="vertical" className="h-5" />
        <Skeleton className="h-3 w-32" />
      </Row>
      <div className="max-w-sm">
        <Progress value={62} label="Indexing" showValue />
      </div>
      <Card className="max-w-sm">
        <Card.Header>
          <div>
            <Card.Title>Card</Card.Title>
            <Card.Description>Header, content and footer.</Card.Description>
          </div>
          <Badge tone="success" dot>
            healthy
          </Badge>
        </Card.Header>
        <Card.Content className="text-xs text-fg-muted">
          Reach for a card when content needs separating. Grouping with headings and spacing is
          usually better.
        </Card.Content>
        <Card.Footer>
          <Button size="sm">Dismiss</Button>
          <Button size="sm" variant="primary">
            Open
          </Button>
        </Card.Footer>
      </Card>
    </Stack>
  )
}
