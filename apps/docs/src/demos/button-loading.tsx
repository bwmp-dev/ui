import { useState } from 'react'
import { Button } from '@stack/ui'

export default function ButtonLoading() {
  const [saving, setSaving] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="primary"
        loading={saving}
        onClick={() => {
          setSaving(true)
          setTimeout(() => setSaving(false), 1600)
        }}
      >
        Save changes
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
