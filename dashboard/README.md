# Dashboard

Personal task/goal dashboard with a real day → week → month → year goal hierarchy. Next.js App Router + Tailwind + shadcn/ui, SQLite via Prisma, local-only.

## Setup

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db
npm run dev
```

Open http://localhost:3000 (redirects to `/dashboard`). `npm run dev` hot-reloads on save — no restart needed while developing.

## Running persistently in prod mode

Prod mode (`next build` + `next start`) doesn't watch files, so it needs a process manager to stay up in the background. `scripts/start-prod.sh` builds and (re)starts it under [pm2](https://pm2.keymetrics.io/) on port **3300**:

```bash
npm run start:prod   # build + start (or restart, if already running) on :3300
npm run logs:prod    # tail logs
npm run stop:prod    # stop it
```

Workflow: keep developing with `npm run dev` as usual, then run `npm run start:prod` whenever you want to deploy the latest changes to the persistent instance — it rebuilds and restarts the existing pm2 process in place (no duplicate processes, survives closing the terminal). Requires `pm2` installed globally (`npm install -g pm2`).

## Stack

- Next.js (App Router), TypeScript, Tailwind, shadcn/ui
- Prisma + SQLite (via `@prisma/adapter-better-sqlite3`, required by Prisma 7's driver-adapter model — see `prisma.config.ts` and `src/lib/prisma.ts`)
- SWR for data fetching, zod for API input validation, next-themes for dark/light, sonner for toasts

## How the goal hierarchy works

Every item — daily task, weekly/monthly/yearly goal — is the same `Task` model, distinguished by a `scope` field (`DAY` / `WEEK` / `MONTH` / `YEAR`). For a non-`DAY` item, `date` is a **period anchor**: a week's goal is anchored to that week's Monday, a month's to the 1st, a year's to Jan 1 (`anchorForScope` in `src/lib/date-utils.ts`).

The dashboard has two axes, both driven by URL search params so state is shareable/refresh-safe:

- `view` (`day` / `week` / `month` / `year`) — which granularity you're looking at
- `mode` (`goals` / `breakdown`, only relevant for week/month/year) — **Goals** shows that level's own items (e.g. weekly goals for the viewed week); **Breakdown** shows the level below, aggregated (week → days, month → weeks, year → months)

"New Task" creates an item at the currently active scope, anchored to the period in view. In the create dialog, non-`DAY` scopes hide the date picker (the period is implicit) and show a read-only label instead (e.g. "Week of Jul 13"). Scope is fixed at creation — no scope switcher when editing.

## Structure

```
prisma/
  schema.prisma          # Task (with scope), Tag, TaskTag, Comment
  migrations/
prisma.config.ts          # Prisma 7 datasource config (see Stack note above)

src/
  app/
    page.tsx               # redirects to /dashboard
    dashboard/page.tsx      # the single screen: reads view/mode/date/tagId params,
                             # computes the right scope + date range, renders the
                             # matching view, hosts the create/detail dialogs
    api/
      tasks/route.ts               # GET (filter by from/to/status/scope/tagId), POST
      tasks/[id]/route.ts          # GET/PATCH/DELETE
      tasks/[id]/comments/route.ts # GET/POST
      tags/route.ts                # GET/POST
    globals.css / layout.tsx       # theme (next-themes), toaster, Geist font

  components/
    dashboard/
      period-goals-view.tsx  # vertical goal list — used for Goals mode at any level
                              # (day-view.tsx is a thin wrapper around this)
      week-view.tsx           # Breakdown for week: one column per day
      month-view.tsx          # Breakdown for month: one section per week
      year-view.tsx           # Breakdown for year: one box per month
      view-switcher.tsx       # day/week/month/year tabs
      view-mode-toggle.tsx    # Goals/Breakdown tabs
      date-nav.tsx            # prev/today/next, shifts by the active view's granularity
    tasks/
      task-form-dialog.tsx    # create/edit; scope-aware date field, inline tag creation
      task-detail-dialog.tsx  # status change + comment thread + delete
      task-card.tsx, status-select.tsx, comment-list.tsx
    tags/
      tag-badge.tsx, tag-filter.tsx
    ui/                        # shadcn-generated primitives
    theme-provider.tsx

  lib/
    prisma.ts               # PrismaClient singleton (better-sqlite3 adapter)
    api-response.ts         # ok()/fail() -> { data } / { error } response wrapper
    api-client.ts            # typed fetch wrappers used by the dialogs
    date-utils.ts            # rangeForView, anchorForScope
    serialize.ts              # Prisma Task+relations -> TaskDTO
    validation/task.ts        # zod schemas (create/update task, comment, tag)
    utils.ts                  # shadcn's cn()

  hooks/
    use-tasks.ts, use-tags.ts # SWR hooks

  types/index.ts              # TaskDTO, TagDTO, CommentDTO, TaskStatus, TaskScope
```

## API response shape

Every route returns `{ data }` on success or `{ error: { message, code? } }` on failure (`src/lib/api-response.ts`), with proper status codes (400 validation, 404 not found, 409 conflict).

## Key design decisions (things not obvious from the file names)

- **One `Task` model for everything, no separate `Goal` model.** `scope` (`DAY`/`WEEK`/`MONTH`/`YEAR`) is what makes a row a day-task vs. a year-goal, not a different table. This means status/tags/comments machinery is written once and works identically at every level.
- **`date` is a period anchor for non-`DAY` scopes, not "any date in the period."** Always the canonical start of the period (`anchorForScope` in `date-utils.ts`): Monday for week, 1st for month, Jan 1 for year. Every range query (`rangeForView`) and the create-dialog's period label depend on this being consistent — if a non-`DAY` task's `date` were ever anything but the anchor, it would silently fall outside its own period's query range.
- **Scope is immutable after creation.** `updateTaskSchema` (in `validation/task.ts`) deliberately excludes `scope` from `PATCH`. Changing a task's scope post-creation would require re-anchoring its date and could silently move it between hierarchy levels, so it's blocked at the validation layer rather than trusted to the UI.
- **`prisma.ts` uses a `globalThis`-cached singleton.** Next.js hot-reloads modules on every save in dev; without caching, each reload would spin up a new `PrismaClient` (and a new SQLite connection). Caching on `globalThis` survives the reload.
- **The `{ data } / { error }` envelope (`api-response.ts`) is enforced on every route with no exceptions**, so the frontend (`api-client.ts`) has exactly one unwrapping rule instead of per-endpoint special cases.
- **Prisma 7 dropped `datasource.url` from `schema.prisma`.** The connection URL now lives in `prisma.config.ts`, and because this project uses SQLite, `src/lib/prisma.ts` must construct the client with an explicit driver adapter (`@prisma/adapter-better-sqlite3`) — this is a Prisma-7/SQLite-specific requirement, not how Postgres/MySQL setups work.
- **Next.js 16 route params are async.** `context.params` in `app/api/.../[id]/route.ts` is a `Promise`, typed via the auto-generated `RouteContext<'/api/tasks/[id]'>` helper (regenerated by `next typegen`, or automatically by `next dev`/`next build`).
- **`PATCH` on a task's tags does `deleteMany` + `create`, not a diff.** Simpler than computing an add/remove delta, and cheap enough at this scale (a handful of tags per task).

## Notes

- Single-user, no auth — meant to run locally (`npm run dev`).
- Regenerate the Prisma client after schema changes: `npx prisma generate`.
- Regenerate Next.js route param types after adding new API routes: `npx next typegen` (or just run `next dev`, which does it automatically).
