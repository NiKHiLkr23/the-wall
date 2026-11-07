<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Keep the site simple

- `quotes.json` is the only quote collection. Add, edit, remove, or reorder entries manually there; the homepage imports it directly.
- `src/app/page.tsx` composes the page and imports the quote collection. Keep UI and interactions in focused components under `src/components/`, analytics in `src/lib/analytics.ts`, and shared quote types in `src/types/quote.ts`. Preserve the current design unless a redesign is requested.
- Keep the framework layout, styles, and metadata routes in `src/app/`. Social images and icons are static files in `public/`.
- Do not add GitHub workflows, contribution/submission flows, schemas, validators, or tests unless explicitly requested.
- Preserve quote wording, source evidence, and attribution uncertainty. Existing optional metadata stays in the JSON; never invent it.
- Use npm and `package-lock.json`. Run lint, type checking, and build after code changes.
- Do not stage, commit, or push unless Nikhil asks. Keep environment files and generated output out of Git.
