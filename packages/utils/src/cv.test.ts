import { describe, expect, it } from 'vitest'
import { cv } from './cv'

const button = cv({
  base: 'inline-flex rounded-md',
  variants: {
    variant: { primary: 'bg-accent text-accent-fg', ghost: 'bg-transparent text-fg-muted' },
    size: { sm: 'h-7 px-2', md: 'h-8 px-3' },
    fullWidth: { true: 'w-full' },
  },
  compoundVariants: [{ variant: 'ghost', size: ['sm', 'md'], class: 'border-transparent' }],
  defaultVariants: { variant: 'primary', size: 'md' },
})

describe('cv', () => {
  it('applies default variants when nothing is selected', () => {
    expect(button()).toBe('inline-flex rounded-md bg-accent text-accent-fg h-8 px-3')
  })

  it('lets an explicit selection override a default', () => {
    expect(button({ size: 'sm' })).toContain('h-7 px-2')
    expect(button({ size: 'sm' })).not.toContain('h-8')
  })

  it('keeps the default when a variant is passed as undefined', () => {
    // Spreading optional props is common; `undefined` must not erase defaults.
    expect(button({ size: undefined })).toContain('h-8 px-3')
  })

  it('selects boolean variants with real booleans', () => {
    expect(button({ fullWidth: true })).toContain('w-full')
    expect(button({ fullWidth: false })).not.toContain('w-full')
  })

  it('matches compound variants against a list of values', () => {
    expect(button({ variant: 'ghost', size: 'sm' })).toContain('border-transparent')
    expect(button({ variant: 'primary', size: 'sm' })).not.toContain('border-transparent')
  })

  it('resolves Tailwind conflicts so className always wins', () => {
    const result = button({ className: 'h-10 bg-danger' })
    expect(result).toContain('h-10')
    expect(result).not.toContain('h-8')
    expect(result).toContain('bg-danger')
    expect(result).not.toContain('bg-accent')
  })

  it('exposes the variant map so projects can extend rather than fork', () => {
    const extended = cv({
      base: 'inline-flex rounded-md',
      variants: { ...button.variants, variant: { ...button.variants.variant, danger: 'bg-danger' } },
      defaultVariants: { variant: 'danger', size: 'md' },
    })
    expect(extended()).toContain('bg-danger')
    expect(extended({ variant: 'ghost' })).toContain('text-fg-muted')
  })
})
