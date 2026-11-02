#!/usr/bin/env bash
# Hits GET /api/content/<unknown address>, which is answered 404 (not a 5xx) but writes an
# error-level "page lookup failed" log line. Usage: scripts/smoke-missing-page.sh <url> [count]
# Exits 0 when every request answered 404 (the error fired), 1 otherwise.
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: $0 <url> [count]" >&2
  exit 2
fi
base="${1%/}"
count="${2:-1}"
case "$count" in '' | *[!0-9]*) echo "count must be a positive integer" >&2; exit 2 ;; esac

fired=0
for i in $(seq 1 "$count"); do
  status=$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 30 "$base/api/content/no-such-page-$i" || echo 000)
  if [ "$status" -eq 404 ]; then
    fired=$((fired + 1))
  fi
done

echo "/api/content/<unknown>: $fired of $count responses were 404 (error logged)"
[ "$fired" -eq "$count" ]
