#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/release.sh [version]
# Examples:
#   ./scripts/release.sh           # auto: next patch (0.10.2 → 0.10.3)
#   ./scripts/release.sh 0.11.0    # explicit version
#
# Updates the version in all publishable packages, commits, and creates a git tag.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CORE_JSON="$ROOT/packages/core/package.json"

read_current_version() {
  # Prefer node for reliable JSON parsing; fall back to sed.
  if command -v node >/dev/null 2>&1; then
    node -e 'console.log(require(process.argv[1]).version)' "$CORE_JSON"
  else
    sed -n 's/.*"version": "\([^"]*\)".*/\1/p' "$CORE_JSON" | head -n 1
  fi
}

next_patch_version() {
  local current="$1"
  if ! [[ "$current" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)([-.+][A-Za-z0-9.+\-]*)?$ ]]; then
    echo "Error: current version '$current' is not a valid semver" >&2
    exit 1
  fi
  local major="${BASH_REMATCH[1]}"
  local minor="${BASH_REMATCH[2]}"
  local patch="${BASH_REMATCH[3]}"
  echo "${major}.${minor}.$((patch + 1))"
}

VERSION="${1:-}"

if [[ -z "$VERSION" ]]; then
  CURRENT="$(read_current_version)"
  if [[ -z "$CURRENT" ]]; then
    echo "Error: could not read version from $CORE_JSON" >&2
    exit 1
  fi
  VERSION="$(next_patch_version "$CURRENT")"
  echo "No version given — bumping patch: $CURRENT → $VERSION"
fi

# Strip leading 'v' so package.json always gets a bare semver
BARE="${VERSION#v}"
TAG="v${BARE}"

# Validate semver format (major.minor.patch[-prerelease][+build])
if ! [[ "$BARE" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.+][A-Za-z0-9.+\-]*)?$ ]]; then
  echo "Error: '$BARE' is not a valid semver version" >&2
  exit 1
fi

# Ensure working tree is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: working tree has uncommitted changes. Commit or stash them first." >&2
  exit 1
fi

# Packages whose version and cross-references are kept in sync
PACKAGES=(
  "packages/core"
  "packages/react"
  "packages/components-web-example"
  "packages/functions-axios-example"
)

echo "Bumping version to $BARE in publishable packages..."

for PKG in "${PACKAGES[@]}"; do
  JSON="$ROOT/$PKG/package.json"
  # Update "version": "<old>"
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$BARE\"/" "$JSON"
  # Update cross-references "@jsonui/core": "<old>" and "@jsonui/react": "<old>"
  sed -i.bak "s/\"@jsonui\/core\": \"[^\"]*\"/\"@jsonui\/core\": \"$BARE\"/" "$JSON"
  sed -i.bak "s/\"@jsonui\/react\": \"[^\"]*\"/\"@jsonui\/react\": \"$BARE\"/" "$JSON"
  rm -f "$JSON.bak"
  echo "  updated $PKG/package.json"
done

# Also update cross-references in consumer packages that depend on @jsonui/*
CONSUMERS=(
  "packages/docs-site"
  "packages/testReact"
)

echo "Updating @jsonui/* references in consumer packages..."

for PKG in "${CONSUMERS[@]}"; do
  JSON="$ROOT/$PKG/package.json"
  sed -i.bak "s/\"@jsonui\/core\": \"[^\"]*\"/\"@jsonui\/core\": \"$BARE\"/" "$JSON"
  sed -i.bak "s/\"@jsonui\/react\": \"[^\"]*\"/\"@jsonui\/react\": \"$BARE\"/" "$JSON"
  sed -i.bak "s/\"@jsonui\/components-web-example\": \"[^\"]*\"/\"@jsonui\/components-web-example\": \"$BARE\"/" "$JSON"
  sed -i.bak "s/\"@jsonui\/functions-example\": \"[^\"]*\"/\"@jsonui\/functions-example\": \"$BARE\"/" "$JSON"
  rm -f "$JSON.bak"
  echo "  updated $PKG/package.json"
done

git add \
  "$ROOT/packages/core/package.json" \
  "$ROOT/packages/react/package.json" \
  "$ROOT/packages/components-web-example/package.json" \
  "$ROOT/packages/functions-axios-example/package.json" \
  "$ROOT/packages/docs-site/package.json" \
  "$ROOT/packages/testReact/package.json"

git commit -m "release $TAG"
git tag "$TAG"

echo ""
echo "Done. Created commit and tag '$TAG'."
echo "Push with:"
echo "  git push && git push origin $TAG"
