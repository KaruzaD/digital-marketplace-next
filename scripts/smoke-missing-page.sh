#!/usr/bin/env bash
# Hits GET /api/content/<unknown address>, which raises an unhandled exception (TypeError,
# answered 500) and writes an error-level "service-fault" log line. Usage: scripts/smoke-missing-page.sh <url> [count]
# Exits 0 when every request answered 500 (the exception fired), 1 otherwise.
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
  if [ "$status" -eq 500 ]; then
    fired=$((fired + 1))
  fi
done

echo "/api/content/<unknown>: $fired of $count responses were 500 (exception logged)"
[ "$fired" -eq "$count" ]
