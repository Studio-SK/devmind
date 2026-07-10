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
