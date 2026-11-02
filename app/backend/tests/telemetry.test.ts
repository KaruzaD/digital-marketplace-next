import type { IncomingMessage } from "node:http";
import type { AzureMonitorOpenTelemetryOptions } from "@azure/monitor-opentelemetry";
import type { HttpInstrumentationConfig } from "@opentelemetry/instrumentation-http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const useAzureMonitor = vi.fn<(options?: AzureMonitorOpenTelemetryOptions) => void>();
vi.mock("@azure/monitor-opentelemetry", () => ({ useAzureMonitor }));

function incoming(url: string): IncomingMessage {
  return { url } as IncomingMessage;
}

/** Starts telemetry the way main.ts does and returns the request filter Azure Monitor was given. */
async function startedRequestFilter(): Promise<(request: IncomingMessage) => boolean> {
  vi.stubEnv("APPLICATIONINSIGHTS_CONNECTION_STRING", "InstrumentationKey=00000000-0000-0000-0000-000000000000");
  await import("../src/telemetry");

  expect(useAzureMonitor).toHaveBeenCalledTimes(1);
  const http = useAzureMonitor.mock.calls[0]?.[0]?.instrumentationOptions?.http as
    | HttpInstrumentationConfig
    | undefined;
  expect(http?.enabled).toBe(true);
  const filter = http?.ignoreIncomingRequestHook;
  if (filter === undefined) throw new Error("no incoming request filter was configured");
  return filter;
}

describe("request telemetry", () => {
  beforeEach(() => {
    vi.resetModules();
    useAzureMonitor.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not record the health checks the probes and the web test make", async () => {
    const ignored = await startedRequestFilter();

    expect(ignored(incoming("/status"))).toBe(true);
    expect(ignored(incoming("/status?probe=readiness"))).toBe(true);
  });

  it("still records every other request", async () => {
    const ignored = await startedRequestFilter();

    expect(ignored(incoming("/api/metrics"))).toBe(false);
    expect(ignored(incoming("/api/status"))).toBe(false);
    expect(ignored(incoming("/statuses"))).toBe(false);
    expect(ignored(incoming("/"))).toBe(false);
  });

  it("is not started without a connection string", async () => {
    vi.stubEnv("APPLICATIONINSIGHTS_CONNECTION_STRING", "");
    await import("../src/telemetry");

    expect(useAzureMonitor).not.toHaveBeenCalled();
  });
});
