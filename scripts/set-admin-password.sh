#!/usr/bin/env bash
# Set ADMIN_PASSWORD interactively on Vercel + .env.local.
# - Never echoes the password
# - Never writes it to argv (pipes via stdin)
# - chmod 600 on .env.local
#
# Run from project root:  bash scripts/set-admin-password.sh

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.local"

echo
echo "  Set ADMIN_PASSWORD for the Ausmalbilder admin"
echo "  ────────────────────────────────────────────"
echo

read -rsp "New admin password (min 12 chars): " PW1
echo
read -rsp "Confirm:                           " PW2
echo

if [ "$PW1" != "$PW2" ]; then
  echo "  ✗ Passwords don't match. Aborting." >&2
  exit 1
fi

if [ "${#PW1}" -lt 12 ]; then
  echo "  ✗ Password too short (${#PW1} chars, need ≥12). Aborting." >&2
  exit 1
fi

# --- Vercel sync first (so it can't clobber .env.local later) ---------------

if ! command -v npx >/dev/null 2>&1; then
  echo "  ✗ npx not found." >&2
  exit 1
fi

if ! npx vercel whoami >/dev/null 2>&1; then
  echo "  ✗ Not logged into Vercel. Run:  npx vercel login" >&2
  exit 1
fi

push_env() {
  local ENVIRONMENT="$1"
  npx vercel env rm ADMIN_PASSWORD "$ENVIRONMENT" --yes >/dev/null 2>&1 || true
  printf '%s' "$PW1" | npx vercel env add ADMIN_PASSWORD "$ENVIRONMENT" >/dev/null
}

echo "  Pushing to Vercel (production + preview)..."
push_env production
push_env preview
echo "  ✓ Vercel env vars set."

# --- Now write .env.local LAST ----------------------------------------------

if [ -f "$ENV_FILE" ] && grep -qE "^ADMIN_PASSWORD=" "$ENV_FILE"; then
  TMP="$(mktemp)"
  grep -vE "^ADMIN_PASSWORD=" "$ENV_FILE" > "$TMP" || true
  mv "$TMP" "$ENV_FILE"
fi
echo "ADMIN_PASSWORD=${PW1}" >> "$ENV_FILE"
chmod 600 "$ENV_FILE"

echo "  ✓ Wrote $ENV_FILE (chmod 600)"
echo
echo "  Trigger a redeploy:  npx vercel --prod"
echo "  Done."
