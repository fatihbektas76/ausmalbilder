#!/usr/bin/env bash
# Interactive Scaleway Object Storage setup.
# - Writes S3_* env vars to .env.local (gitignored)
# - Optionally syncs them to Vercel (prod + preview)
# - Never echoes secrets, never writes them to argv/history
#
# Run from project root:  bash scripts/setup-scaleway.sh

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
KEYS=(S3_ENDPOINT S3_REGION S3_BUCKET S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY NEXT_PUBLIC_ASSETS_URL)

# Defined later, used by the skip-sync branch and the normal end.
# Writes .env.local last so Vercel CLI commands (which can clobber it) run first.
write_env_local() {
  if [ -f "$ENV_FILE" ] && grep -qE "^(S3_(ENDPOINT|REGION|BUCKET|ACCESS_KEY_ID|SECRET_ACCESS_KEY)|NEXT_PUBLIC_ASSETS_URL)=" "$ENV_FILE"; then
    TMP="$(mktemp)"
    grep -vE "^(S3_(ENDPOINT|REGION|BUCKET|ACCESS_KEY_ID|SECRET_ACCESS_KEY)|NEXT_PUBLIC_ASSETS_URL)=" "$ENV_FILE" > "$TMP" || true
    mv "$TMP" "$ENV_FILE"
  fi
  {
    echo "S3_ENDPOINT=${ENDPOINT}"
    echo "S3_REGION=${REGION}"
    echo "S3_BUCKET=${BUCKET}"
    echo "S3_ACCESS_KEY_ID=${ACCESS_KEY_ID}"
    echo "S3_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY}"
    echo "NEXT_PUBLIC_ASSETS_URL=${PUBLIC_URL}"
  } >> "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "  ✓ Wrote ${ENV_FILE} (chmod 600)"
}

echo
echo "  Scaleway Object Storage setup"
echo "  ────────────────────────────────"
echo

# ---- Public values (visible input) -----------------------------------------

read -rp "Bucket name (default: ausmalbilder-gratis-assets): " BUCKET
BUCKET="${BUCKET:-ausmalbilder-gratis-assets}"

read -rp "Region (default: fr-par): " REGION
REGION="${REGION:-fr-par}"

ENDPOINT="https://s3.${REGION}.scw.cloud"
PUBLIC_URL="https://${BUCKET}.s3.${REGION}.scw.cloud"

echo
echo "  Public values:"
echo "    Endpoint:    ${ENDPOINT}"
echo "    Bucket:      ${BUCKET}"
echo "    Public URL:  ${PUBLIC_URL}"
echo

# ---- Secret values (hidden input) ------------------------------------------

read -rsp "Access Key ID:     " ACCESS_KEY_ID
echo
read -rsp "Secret Access Key: " SECRET_ACCESS_KEY
echo

if [ -z "$ACCESS_KEY_ID" ] || [ -z "$SECRET_ACCESS_KEY" ]; then
  echo "  ERROR: keys are empty. Aborting." >&2
  exit 1
fi

# ---- Bucket reachability check --------------------------------------------

echo
echo "  Probing bucket..."
HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" "${PUBLIC_URL}/" || echo "000")"
case "$HTTP_CODE" in
  200|403) echo "  ✓ Bucket reachable (HTTP $HTTP_CODE — 403 is normal for public-list disabled)" ;;
  404) echo "  ✗ HTTP 404 — bucket name or region likely wrong" ;;
  000) echo "  ✗ Network error — check your connection" ;;
  *)   echo "  ! HTTP $HTTP_CODE — unexpected, but env file is written" ;;
esac

# ---- Vercel sync (runs BEFORE local write to avoid clobber) ---------------

echo
read -rp "Sync these to Vercel (production + preview)? [y/N] " SYNC
if [ "${SYNC:-N}" != "y" ] && [ "${SYNC:-N}" != "Y" ]; then
  echo "  Skipping Vercel sync."
  write_env_local
  exit 0
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "  npx not found — install Node.js first." >&2
  exit 1
fi

# Check vercel login state (probe without spawning UI)
if ! npx --no-install vercel whoami >/dev/null 2>&1 && ! npx vercel whoami >/dev/null 2>&1; then
  echo "  Not logged into Vercel. Run:  npx vercel login"
  exit 1
fi

# Project link check
if [ ! -f ".vercel/project.json" ]; then
  echo "  Project not linked to Vercel. Linking now..."
  npx vercel link
fi

push_env() {
  local KEY="$1"
  local VAL="$2"
  local ENVIRONMENT="$3"

  # Remove existing (ignore errors), then add fresh.
  # printf avoids trailing newline issues; piped via stdin, not argv.
  npx vercel env rm "$KEY" "$ENVIRONMENT" --yes >/dev/null 2>&1 || true
  printf '%s' "$VAL" | npx vercel env add "$KEY" "$ENVIRONMENT" >/dev/null
}

echo "  Pushing to Vercel (production)..."
push_env S3_ENDPOINT             "$ENDPOINT"           production
push_env S3_REGION               "$REGION"             production
push_env S3_BUCKET               "$BUCKET"             production
push_env S3_ACCESS_KEY_ID        "$ACCESS_KEY_ID"      production
push_env S3_SECRET_ACCESS_KEY    "$SECRET_ACCESS_KEY"  production
push_env NEXT_PUBLIC_ASSETS_URL  "$PUBLIC_URL"         production

echo "  Pushing to Vercel (preview)..."
push_env S3_ENDPOINT             "$ENDPOINT"           preview
push_env S3_REGION               "$REGION"             preview
push_env S3_BUCKET               "$BUCKET"             preview
push_env S3_ACCESS_KEY_ID        "$ACCESS_KEY_ID"      preview
push_env S3_SECRET_ACCESS_KEY    "$SECRET_ACCESS_KEY"  preview
push_env NEXT_PUBLIC_ASSETS_URL  "$PUBLIC_URL"         preview

echo
echo "  ✓ Vercel env vars synced."
echo

# Write .env.local LAST so Vercel CLI can't clobber it.
write_env_local

echo
echo "    Trigger a redeploy:  npx vercel --prod"
echo
echo "  Done."
