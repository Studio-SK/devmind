---
description: Generate a new Spring Boot project from the devmind starter template
argument-hint: <project-name> <base-package>
allowed-tools: Bash(mkdir:*), Bash(~/work/devmind/templates/spring-boot/generate.sh:*)
---

Generate a new Spring Boot project from the devmind template.

Arguments received: $ARGUMENTS

Steps:

1. Split `$ARGUMENTS` on whitespace into two values: the first word is `<project-name>`, the second word is `<base-package>`.
   If either is missing or empty, stop and show:
   ```
   Usage: /new-spring <project-name> <base-package>
   Example: /new-spring inventory-tracker com.sarthak.inventorytracker
   ```
   Do not proceed further if arguments are invalid.

2. Ensure `~/work/projects/` exists — create it if it doesn't (`mkdir -p ~/work/projects`).

3. Run the generator with an explicit target directory so it never defaults to a path inside the template itself:
   ```
   ~/work/devmind/templates/spring-boot/generate.sh <project-name> <base-package> ~/work/projects/<project-name>
   ```

4. If the script fails (e.g. target directory already exists), show its error output and stop — do not report success.

5. On success, tell the user:
   - The project was created at `~/work/projects/<project-name>`
   - Next steps:
     ```
     cd ~/work/projects/<project-name>
     cp .env.example .env   # then fill in real DB creds, JWT secret, etc.
     docker compose up -d db
     ./mvnw spring-boot:run
     ```
