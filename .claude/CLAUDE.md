# DevMind — Project Context

## What This Is
DevMind is my personal Claude-powered workspace. It contains:
- `templates/` — starter project generators (Spring Boot, Next.js)
- `scripts/` — daily automation scripts (standup, review, capture)
- `notes/` — knowledge base for learnings, system design, DSA
- `.claude/commands/` — custom slash commands

## Current Focus
- Building reusable project starter templates (Spring Boot, Next.js)
- Custom Claude commands for daily dev workflow
- Knowledge capture system for job prep (system design, DSA)

## Template Standards (Spring Boot)
- Modular architecture — feature/domain first, not technical layer
- No Lombok
- Consistent API response wrapper
- `ddl-auto=update` for dev/learning projects
- Flyway migrations for production projects
- Docker + docker-compose always included

## Template Standards (Next.js)
- App router (not pages/)
- Tailwind for styling
- Consistent data fetching patterns
- Business logic out of components

## Notes Structure
notes/
├── system-design/    # System design concepts and case studies
├── dsa/              # DSA theory, patterns, revision notes
├── learnings/        # Daily captures — things learned while building
└── projects/         # Notes per active project

## How to Work in This Repo
- Templates are in `templates/` — each is a self-contained starter
- Scripts in `scripts/` are standalone and can be run independently
- When adding a new template, always include a README explaining what it sets up
- When modifying a template, check if the corresponding CLAUDE.md inside it needs updating too

## Custom commands are global via symlink

`.claude/commands/` in this repo is symlinked as a whole directory into `~/.claude/commands/devmind`:

```bash
ln -s ~/work/devmind/.claude/commands ~/.claude/commands/devmind
```

Claude Code doesn't namespace commands by subdirectory (a file in a subdirectory still invokes by its
bare filename, not `devmind:name`), and it follows the symlink transparently. So:

- Any `.md` command file added to `.claude/commands/` here is **immediately available as a global
  slash command** (e.g. `/new-spring`) in every Claude Code session on this machine — no per-file
  symlinking needed.
- Don't rename or delete this repo relative to `~/work/devmind` without updating the symlink target.
- Watch for name collisions: if another project's commands (or a future `~/.claude/commands/*.md` file)
  uses the same filename, behavior is undefined — Claude Code's docs don't specify precedence.
