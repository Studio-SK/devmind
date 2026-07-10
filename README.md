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
