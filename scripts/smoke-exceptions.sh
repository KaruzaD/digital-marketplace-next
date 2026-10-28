#!/usr/bin/env bash
# Hits the anonymous GET endpoints that the exceptions alert watches and reports 5xx responses.
# Run by hand after a deploy: scripts/smoke-exceptions.sh <frontend_url> [count]
# Exits 1 if any response was a 5xx, so a clean run on a fixed deploy exits 0.
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: $0 <frontend_url> [count]" >&2
  exit 2
fi
base="${1%/}"
count="${2:-10}"
case "$count" in '' | *[!0-9]*) echo "count must be a positive integer" >&2; exit 2 ;; esac

endpoints=(/api/metrics /api/opportunities/code-with-us)
total=0
failures=0

for path in "${endpoints[@]}"; do
  bad=0
  for _ in $(seq 1 "$count"); do
    status=$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 30 "$base$path" || echo 000)
    total=$((total + 1))
    if [ "$status" -ge 500 ]; then
      bad=$((bad + 1))
    fi
  done
  failures=$((failures + bad))
  echo "$path: $bad of $count responses were 5xx"
done

echo "total: $failures of $total responses were 5xx"
[ "$failures" -eq 0 ]
