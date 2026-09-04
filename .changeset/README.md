# Changesets

Run `pnpm changeset` alongside the work, not at release time, and describe the
change for whoever has to decide whether to upgrade.

```bash
pnpm changeset          # describe the change
pnpm version-packages   # apply it: bump versions, write changelogs
pnpm release            # build and publish
```

The apps and templates are ignored: they are not published, and `@bwmp-dev/create-stack`
bundles the templates at pack time. See the [publishing guide](../apps/docs/src/pages/guides/publishing.mdx).
