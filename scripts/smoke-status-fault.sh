#!/usr/bin/env bash
# Hits GET /status with X-Status-Detail, which raises an unhandled fault and writes an error-level
# "service-fault" log line. Usage: scripts/smoke-status-fault.sh <frontend_or_backend_url> [count]
# Exits 0 when every request answered 500 (the error fired), 1 otherwise.
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: $0 <url> [count]" >&2
  exit 2
fi
base="${1%/}"
count="${2:-1}"
case "$count" in '' | *[!0-9]*) echo "count must be a positive integer" >&2; exit 2 ;; esac

fired=0
for _ in $(seq 1 "$count"); do
  status=$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 30 --header "X-Status-Detail: 1" "$base/status" || echo 000)
  if [ "$status" -eq 500 ]; then
    fired=$((fired + 1))
  fi
done

echo "/status with X-Status-Detail: $fired of $count responses were 500 (error logged)"
[ "$fired" -eq "$count" ]
