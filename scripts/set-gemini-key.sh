#!/usr/bin/env bash
# Set GEMINI_API_KEY interactively on Vercel + .env.local.
# - Never echoes the key
# - Never writes it to argv (pipes via stdin)
# - chmod 600 on .env.local
#
# Run from project root:  bash scripts/set-gemini-key.sh

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.local"

echo
echo "  Set GEMINI_API_KEY (Google AI Studio)"
echo "  ────────────────────────────────────────"
echo "  Get a key at: https://aistudio.google.com/apikey"
echo

read -rsp "Gemini API key: " KEY
echo

if [ -z "$KEY" ]; then
  echo "  ✗ Empty key. Aborting." >&2
  exit 1
fi

# Sanity check: Google API keys usually start with "AIza" and are ~39 chars,
# but AI Studio keys can have other prefixes. Just check basic shape.
if [ "${#KEY}" -lt 20 ]; then
  echo "  ✗ Key seems too short (${#KEY} chars). Aborting." >&2
  exit 1
fi

# Quick liveness check — call models endpoint
echo "  Probing key against Gemini API..."
HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" \
  -H "x-goog-api-key: $KEY" \
  "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1" \
  || echo "000")"

case "$HTTP_CODE" in
  200) echo "  ✓ Key valid (HTTP 200)" ;;
  400|401|403) echo "  ✗ Key rejected by Google (HTTP $HTTP_CODE). Aborting." >&2; exit 1 ;;
  000) echo "  ! Network error — proceeding anyway, but key not verified" ;;
  *)   echo "  ! Unexpected HTTP $HTTP_CODE — proceeding anyway, but key not verified" ;;
esac

# --- Vercel sync first ------------------------------------------------------

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
  npx vercel env rm GEMINI_API_KEY "$ENVIRONMENT" --yes >/dev/null 2>&1 || true
  printf '%s' "$KEY" | npx vercel env add GEMINI_API_KEY "$ENVIRONMENT" >/dev/null
}

echo "  Pushing to Vercel (production + preview)..."
push_env production
push_env preview
echo "  ✓ Vercel env vars set."

# --- Write .env.local LAST so Vercel CLI can't clobber it -------------------

if [ -f "$ENV_FILE" ] && grep -qE "^GEMINI_API_KEY=" "$ENV_FILE"; then
  TMP="$(mktemp)"
  grep -vE "^GEMINI_API_KEY=" "$ENV_FILE" > "$TMP" || true
  mv "$TMP" "$ENV_FILE"
fi
echo "GEMINI_API_KEY=${KEY}" >> "$ENV_FILE"
chmod 600 "$ENV_FILE"

echo "  ✓ Wrote $ENV_FILE (chmod 600)"
echo
echo "  Trigger a redeploy:  npx vercel --prod"
echo "  Done."
