# DevMind

My personal Claude-powered workspace for streamlining dev workflow, learning, and building.

## Structure

```
devmind/
├── .claude/
│   ├── CLAUDE.md         # Project context for Claude Code
│   ├── settings.json     # Claude Code permissions + behaviour
│   └── commands/         # Custom slash commands
├── templates/            # Project starter generators
│   ├── spring-boot/      # Spring Boot starter with my standards
│   └── nextjs/           # Next.js starter with my standards
├── scripts/              # Daily automation scripts
│   ├── standup.md        # Generate standup from git activity
│   ├── review.md         # Code review any file
│   └── capture.md        # Capture and structure a learning
└── notes/                # Knowledge base
    ├── system-design/
    ├── dsa/
    ├── learnings/
    └── projects/
```

## Notes Browser

`docs/` is a small static site for reading `notes/` as rendered markdown with
a folder-tree sidebar — no server needed locally (just open `docs/index.html`),
and deployable via GitHub Pages (`Settings → Pages → Deploy from a branch →
main → /docs`). After editing `notes/`, regenerate the site's data file:

```bash
node scripts/generate-notes-data.js
```

## Usage

```bash
# Start a Claude Code session in this workspace
cd ~/work/devmind
claude

# Use custom commands
/new-spring my-project-name
/new-next my-project-name
/review path/to/file
/standup
/capture
```
