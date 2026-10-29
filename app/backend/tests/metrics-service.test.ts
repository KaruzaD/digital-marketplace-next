import { describe, expect, it } from "vitest";
import { MetricsService } from "../src/opportunities/metrics.service";

describe("MetricsService.read", () => {
  it("answers the awarded count and total without throwing", async () => {
    const codeWithUs = { list: async () => [{ status: "AWARDED", content: { reward: 100 } }, { status: "OPEN", content: { reward: 5 } }] };
    const others = {
      list: async (program: string) => (program === "sprint-with-us" ? [{ status: "AWARDED", budget: 50 }] : [{ status: "OPEN", budget: 9 }]),
    };
    const service = new MetricsService(codeWithUs as never, others as never);
    expect(await service.read()).toEqual([{ totalCount: 2, totalAwarded: 150 }]);
  });
});
