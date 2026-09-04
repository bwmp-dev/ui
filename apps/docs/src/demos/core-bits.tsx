import { Avatar, Card, Code, Kbd, Progress, Separator, Skeleton, Spinner } from '@stack/ui'

export default function CoreBits() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name="Ada Byron" />
        <Avatar name="Grace Hopper" shape="circle" size="lg" />
        <Spinner />
        <span className="flex items-center gap-1 text-ui">
          Press <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
        <Code>pnpm stack create</Code>
      </div>

      <Separator />

      <Progress value={62} label="Indexing" showValue className="max-w-sm" />

      <Card className="max-w-sm">
        <Card.Header>
          <div>
            <Card.Title>Build 4821</Card.Title>
            <Card.Description>Finished 4 minutes ago</Card.Description>
          </div>
        </Card.Header>
        <Card.Content className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-2/3" />
        </Card.Content>
      </Card>
    </div>
  )
}
