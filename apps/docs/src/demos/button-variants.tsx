import { Button } from '@stack/ui'
import { Plus } from 'lucide-react'

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
      <Button variant="primary" icon={Plus}>
        With icon
      </Button>
    </div>
  )
}
