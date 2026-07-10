#!/usr/bin/env bash
#
# Generates a new Spring Boot project from this template.
#
# Usage:
#   ./generate.sh <project-name> <base-package> [target-dir]
#
# Example:
#   ./generate.sh inventory-tracker com.sarthak.inventorytracker
#   ./generate.sh inventory-tracker com.sarthak.inventorytracker ~/work/projects/inventory-tracker

set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <project-name> <base-package> [target-dir]" >&2
    echo "Example: $0 inventory-tracker com.sarthak.inventorytracker" >&2
    exit 1
fi

RAW_PROJECT_NAME="$1"
BASE_PACKAGE="$2"

if [[ ! "$BASE_PACKAGE" =~ ^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$ ]]; then
    echo "Error: base-package must be lowercase, dot-separated (e.g. com.sarthak.inventorytracker)" >&2
    exit 1
fi

# --- derive naming tokens -------------------------------------------------

KEBAB=$(echo "$RAW_PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' _' '-' | tr -s '-')
if [[ -z "$KEBAB" ]]; then
    echo "Error: project-name resolved to an empty string" >&2
    exit 1
fi

SNAKE=$(echo "$KEBAB" | tr '-' '_')

PASCAL=""
IFS='-' read -ra PARTS <<< "$KEBAB"
for part in "${PARTS[@]}"; do
    first_char=$(echo "${part:0:1}" | tr '[:lower:]' '[:upper:]')
    rest="${part:1}"
    PASCAL+="${first_char}${rest}"
done

TARGET_DIR="${3:-./$KEBAB}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OLD_PACKAGE="com.devmind.template"
OLD_PACKAGE_PATH="com/devmind/template"
NEW_PACKAGE_PATH="$(echo "$BASE_PACKAGE" | tr '.' '/')"

# resolve target to an absolute path before it exists, so we can safely
# detect (and refuse) copying the template into itself
TARGET_PARENT="$(cd "$(dirname "$TARGET_DIR")" 2>/dev/null && pwd)" || {
    echo "Error: parent directory of '$TARGET_DIR' does not exist" >&2
    exit 1
}
TARGET_DIR="$TARGET_PARENT/$(basename "$TARGET_DIR")"

echo "Project name : $RAW_PROJECT_NAME -> $KEBAB (class prefix: $PASCAL)"
echo "Base package : $BASE_PACKAGE"
echo "Target dir   : $TARGET_DIR"
echo

if [[ "$TARGET_DIR" == "$SCRIPT_DIR" || "$TARGET_DIR" == "$SCRIPT_DIR"/* ]]; then
    echo "Error: target directory is inside the template directory ($SCRIPT_DIR)." >&2
    echo "Pass an explicit target-dir outside the template, e.g.:" >&2
    echo "  $0 $RAW_PROJECT_NAME $BASE_PACKAGE ~/work/projects/$KEBAB" >&2
    exit 1
fi

if [[ -e "$TARGET_DIR" ]]; then
    echo "Error: target directory '$TARGET_DIR' already exists" >&2
    exit 1
fi

# --- copy template ---------------------------------------------------------

mkdir -p "$TARGET_DIR"
cp -R "$SCRIPT_DIR"/. "$TARGET_DIR"/
rm -f "$TARGET_DIR/generate.sh" "$TARGET_DIR/README.md"

# --- text substitution (content only, before moving directories) -----------

# order matters: most specific patterns first so generic ones don't clobber them
find "$TARGET_DIR" -type f \( \
        -name '*.java' -o -name '*.xml' -o -name '*.yml' -o -name '*.yaml' \
        -o -name '*.properties' -o -name '*.md' -o -name 'Dockerfile' -o -name '.env.example' \
    \) -print0 | while IFS= read -r -d '' file; do
    perl -pi -e "s/\Q${OLD_PACKAGE}\E/${BASE_PACKAGE}/g" "$file"
    perl -pi -e "s/\Qtemplate_dev\E/${SNAKE}_dev/g" "$file"
    perl -pi -e "s/\Qtemplate_test\E/${SNAKE}_test/g" "$file"
    perl -pi -e "s/\QDB_USER=template\E/DB_USER=${SNAKE}/g" "$file"
    perl -pi -e "s/\QDB_USER:template\E/DB_USER:${SNAKE}/g" "$file"
    perl -pi -e "s/\QTemplate\E/${PASCAL}/g" "$file"
    perl -pi -e "s/\Qtemplate\E/${KEBAB}/g" "$file"
done

# --- move java package directories to match base-package -------------------

for SRC_ROOT in "$TARGET_DIR/src/main/java" "$TARGET_DIR/src/test/java"; do
    [[ -d "$SRC_ROOT/$OLD_PACKAGE_PATH" ]] || continue
    mkdir -p "$(dirname "$SRC_ROOT/$NEW_PACKAGE_PATH")"
    mv "$SRC_ROOT/$OLD_PACKAGE_PATH" "$SRC_ROOT/$NEW_PACKAGE_PATH"
    # clean up now-empty parent dirs left behind by the old package path
    OLD_TOP="$SRC_ROOT/$(echo "$OLD_PACKAGE_PATH" | cut -d/ -f1)"
    find "$OLD_TOP" -type d -empty -delete 2>/dev/null || true
done

# --- rename the Application class ------------------------------------------

OLD_APP_FILE="$TARGET_DIR/src/main/java/$NEW_PACKAGE_PATH/TemplateApplication.java"
NEW_APP_FILE="$TARGET_DIR/src/main/java/$NEW_PACKAGE_PATH/${PASCAL}Application.java"
if [[ -f "$OLD_APP_FILE" ]]; then
    mv "$OLD_APP_FILE" "$NEW_APP_FILE"
fi

# --- add the maven wrapper ---------------------------------------------------

if command -v mvn >/dev/null 2>&1; then
    echo
    echo "Adding Maven wrapper (mvn -N wrapper:wrapper)..."
    ( cd "$TARGET_DIR" && mvn -q -N wrapper:wrapper )
else
    echo
    echo "Warning: 'mvn' not found on PATH — skipped generating the Maven wrapper." >&2
    echo "Run this manually once Maven is available:" >&2
    echo "  cd $TARGET_DIR && mvn -N wrapper:wrapper" >&2
fi

echo
echo "Done. Next steps:"
echo "  cd $TARGET_DIR"
echo "  cp .env.example .env   # then fill in real values"
echo "  docker compose up -d db"
echo "  ./mvnw spring-boot:run"
