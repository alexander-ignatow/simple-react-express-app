---
name: add-shadcn
description: Add a shadcn/ui component to the client. Use whenever client code needs a UI primitive that does not yet exist under client/src/components/ui/ — card, dialog, input, select, badge, and so on. Only button and textarea are currently installed, so most shadcn imports will fail until this runs.
---

# Add a shadcn/ui component

`client/src/components/ui/` contains **only `button` and `textarea`**. Any other shadcn
import is a build error until the component is added. Check before importing:

```bash
ls client/src/components/ui/
```

## Add it

```bash
cd client && npx shadcn@latest add <component>
```

Config comes from `client/components.json` — style, base color slate, CSS variables,
and the `@/` alias. Don't pass flags that override those; edit `components.json` if the
project's choice really needs to change.

## Then fix it up to match this codebase

The generator emits shadcn's house style, which is not this repo's. Before considering
the component done:

- **Split non-component exports out.** `cva` variant objects, constants, and types must
  not live in a file that also exports a component — the `react-refresh` ESLint rule
  fails on it. Follow the existing split: `button.tsx` holds the component,
  `button-variants.ts` holds the variants.
- **Named imports only.** Generated files often use `import * as React from 'react'`.
  Replace with named imports, and `import type` for types.
- **Explicit return types** — `(): React.JSX.Element` on every component.
- **No `any`.** Strict mode is on.
- Let the format hook handle spacing; it runs Prettier on `client/src/` writes.

## Verify

```bash
npm run lint --prefix client
npm run build --prefix client
```

`simple-import-sort` enforces import order, so a lint pass is not optional — a generated
file will almost always fail it on the first try.
