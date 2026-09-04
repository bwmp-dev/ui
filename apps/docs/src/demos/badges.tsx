import { Badge } from '@stack/ui'

export default function Badges() {
  const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} dot>
            {tone}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} variant="solid">
            {tone}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {tones.map((tone) => (
          <Badge key={tone} tone={tone} variant="outline" shape="pill">
            {tone}
          </Badge>
        ))}
      </div>
    </div>
  )
}
