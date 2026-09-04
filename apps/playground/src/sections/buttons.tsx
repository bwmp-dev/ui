import { useState } from 'react'
import { Button, IconButton } from '@bwmp-dev/ui'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Row, Stack } from './shared'

export function ButtonsSection() {
  const [loading, setLoading] = useState(false)

  return (
    <Stack>
      <Row label="Variants">
        <Button variant="primary">Primary</Button>
        <Button>Secondary</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </Row>
      <Row label="Sizes">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Row>
      <Row label="Icons">
        <Button icon={Plus} variant="primary">
          New device
        </Button>
        <IconButton icon={Pencil} label="Edit" size="xs" />
        <IconButton icon={Pencil} label="Edit" size="sm" />
        <IconButton icon={Pencil} label="Edit" />
        <IconButton icon={Trash2} label="Delete" variant="danger" />
      </Row>
      <Row label="States">
        <Button
          variant="primary"
          loading={loading}
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 1600)
          }}
        >
          Save changes
        </Button>
        <Button disabled>Disabled</Button>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- a render template; children come from Button */}
        <Button render={<a href="#buttons" />}>Anchor via render</Button>
        <Button fullWidth className="max-w-xs">
          Full width
        </Button>
      </Row>
    </Stack>
  )
}
