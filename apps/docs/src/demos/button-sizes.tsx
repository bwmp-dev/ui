import { Button, IconButton } from '@bwmp-dev/ui'
import { RefreshCw } from 'lucide-react'

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <IconButton icon={RefreshCw} label="Refresh" />
    </div>
  )
}
