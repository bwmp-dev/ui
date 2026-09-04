import { cn, type ClassValue } from './cn'

/**
 * A tiny class-variance helper.
 *
 * We use this instead of `class-variance-authority` for two concrete reasons:
 * it resolves Tailwind conflicts itself (cva leaves you to wrap every call site
 * in `cn`, which is where override bugs come from), and it exposes the variant
 * map on the returned function so a project can extend a component's variants
 * without forking it. It is small enough that owning it costs nothing.
 */

type VariantConfig = Record<string, Record<string, ClassValue>>

/** Variants keyed by `'true'`/`'false'` are selected with real booleans. */
type OptionOf<T extends PropertyKey> = T extends 'true' | 'false' ? boolean : T

type Selection<V extends VariantConfig> = {
  [K in keyof V]?: OptionOf<keyof V[K]>
}

type CompoundRule<V extends VariantConfig> = {
  [K in keyof V]?: OptionOf<keyof V[K]> | ReadonlyArray<OptionOf<keyof V[K]>>
} & { class: ClassValue }

export type VariantFnProps<V extends VariantConfig> = Selection<V> & {
  class?: ClassValue
  className?: ClassValue
}

export type VariantFn<V extends VariantConfig> = ((props?: VariantFnProps<V>) => string) & {
  /** The raw variant map, so callers can build on it. */
  variants: V
}

/** Derive a component's variant props from its `cv` function. */
export type VariantProps<T> = T extends VariantFn<infer V> ? Selection<V> : never

export type CvConfig<V extends VariantConfig> = {
  base?: ClassValue
  variants?: V
  defaultVariants?: Selection<V>
  compoundVariants?: ReadonlyArray<CompoundRule<V>>
}

export function cv<V extends VariantConfig>(config: CvConfig<V>): VariantFn<V> {
  const { base, variants, defaultVariants, compoundVariants } = config

  const fn = (props?: VariantFnProps<V>): string => {
    const { class: extraClass, className, ...selected } = props ?? {}

    const resolved: Record<string, unknown> = { ...defaultVariants }
    for (const [key, value] of Object.entries(selected)) {
      // An explicit `undefined` must not erase the default.
      if (value !== undefined) resolved[key] = value
    }

    const classes: ClassValue[] = [base]

    if (variants) {
      for (const name of Object.keys(variants)) {
        const value = resolved[name]
        if (value == null) continue
        classes.push(variants[name]?.[String(value)])
      }
    }

    for (const rule of compoundVariants ?? []) {
      const { class: ruleClass, ...match } = rule
      const matches = Object.entries(match).every(([name, expected]) =>
        Array.isArray(expected)
          ? expected.includes(resolved[name] as never)
          : resolved[name] === expected,
      )
      if (matches) classes.push(ruleClass)
    }

    classes.push(extraClass, className)
    return cn(classes)
  }

  fn.variants = (variants ?? {}) as V
  return fn
}
