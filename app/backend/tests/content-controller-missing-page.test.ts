import { describe, expect, it } from "vitest";
import { ContentController } from "../src/content/content.controller";
import { ContentService } from "../src/content/content.service";

/**
 * Regression: GET /api/content/<address no page holds> must be answered 404 (R-7.2), not a
 * 500 from dereferencing the missing page before checking that it exists.
 */
function controllerOverNoPages(): ContentController {
  const noPages = { readFor: async () => null } as unknown as ContentService;
  return new ContentController(noPages, { readingAccount: async () => null });
}

describe("reading an address that holds no page", () => {
  it("is answered as not found rather than failing", async () => {
    await expect(controllerOverNoPages().read("no-such-page-1")).rejects.toMatchObject({
      status: 404,
    });
  });

  it("is answered as not found for an identifier no page carries", async () => {
    await expect(
      controllerOverNoPages().read("00000000-0000-4000-8000-000000000999"),
    ).rejects.toMatchObject({ status: 404 });
  });
});
