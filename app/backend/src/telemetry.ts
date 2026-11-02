import type { IncomingMessage } from "node:http";
import { type AzureMonitorOpenTelemetryOptions, useAzureMonitor } from "@azure/monitor-opentelemetry";
import type { HttpInstrumentationConfig } from "@opentelemetry/instrumentation-http";

// The path the container's liveness and readiness probes and the availability web test call.
export const HEALTH_CHECK_PATH = "/status";

/**
 * Whether an incoming request is a health check, which should not be recorded as request telemetry.
 * The probes call /status every few seconds, so without this they make up nearly every request
 * row in Application Insights. Availability is still reported by the web test's own results.
 */
export function isHealthCheck(request: Pick<IncomingMessage, "url">): boolean {
  const path = (request.url ?? "").split("?", 1)[0];
  return path === HEALTH_CHECK_PATH;
}

/**
 * The options the service starts Azure Monitor with. The distro replaces its default HTTP
 * settings with these rather than merging them, so the instrumentation is enabled explicitly.
 */
export function telemetryOptions(): AzureMonitorOpenTelemetryOptions {
  const http: HttpInstrumentationConfig = {
    enabled: true,
    ignoreIncomingRequestHook: isHealthCheck,
  };
  return { instrumentationOptions: { http } };
}

// Imported first in main.ts so the HTTP instrumentation is in place before express loads.
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  useAzureMonitor(telemetryOptions());
}
