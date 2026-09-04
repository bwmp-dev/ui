import { Button, LinkButton } from '@stack/ui'

/**
 * `render` swaps the underlying element while keeping the styling and the
 * variant API. This is how a router link becomes a button.
 */
export default function ButtonRender() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button render={<a href="#button" />}>Anchor via render</Button>
      <LinkButton href="#button" variant="primary">
        LinkButton
      </LinkButton>
    </div>
  )
}
