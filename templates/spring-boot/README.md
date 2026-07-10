# Spring Boot Starter Template

My standard Spring Boot starter: modular feature folders, no Lombok, JWT auth, MySQL, Docker.

## Structure

- Each feature is a flat folder: `XEntity`, `XRepo`, `XMapper`, `XService`, `XController`, plus a `dto/` subfolder for `XRequest`/`XResponse`/`XCommand`.
- `common/` — `entity/BaseEntity`, `exceptions/` (+ `GlobalExceptionHandler`), `rest/` (`ApiResponse`, `ApiErrorResponse`, `ErrorCode`, `SuccessCode`, `Res`), `types/` for enums.
- `config/` — bean wiring (password encoder, JPA auditing, public endpoint matcher).
- `security/` — JWT auth: filter, service, `UserDetailsServiceImpl`, entry point / access denied handlers.
- `user/` — minimal entity + repo backing `security/`. Flesh out per project (controller, service, registration flow, etc).
- `health/` — sample module: `GET /health`.

## Generating a new project

```bash
./generate.sh <project-name> <base-package> [target-dir]

# example
./generate.sh inventory-tracker com.sarthak.inventorytracker
./generate.sh inventory-tracker com.sarthak.inventorytracker ~/work/projects/inventory-tracker
```

This copies the template, rewrites the package (`com.devmind.template` → `<base-package>`), renames the
`Application` class, substitutes the project name into `pom.xml` / `docker-compose.yml` / properties files,
and adds the Maven wrapper (`mvn -N wrapper:wrapper`) if Maven is on your `PATH`.

## After generating

```bash
cd <target-dir>
cp .env.example .env      # fill in real DB creds, JWT secret, etc.
docker compose up -d db   # start MySQL
./mvnw spring-boot:run    # dev profile, ddl-auto=update
```

## Profiles

- `dev` — `ddl-auto=update`, SQL logging on. Default via `SPRING_PROFILES_ACTIVE`.
- `prod` — `ddl-auto=validate`, SQL logging off. Use Flyway migrations for schema changes.
- `test` — `ddl-auto=create-drop` against a separate test database.

## Notes

- No Lombok — everything is explicit (constructors, getters/setters).
- `Role` enum starts with `USER`/`ADMIN` — extend as needed.
- `PublicEndpointConfig` is the single place to register routes the JWT filter should skip.
