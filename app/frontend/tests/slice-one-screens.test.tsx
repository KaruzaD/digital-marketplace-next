import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentViewScreen, PublishedPage } from "../src/screens/content-view";
import { LearnMoreScreen } from "../src/screens/learn-more";
import { NotFound } from "../src/app/not-found";
import { FormattedText } from "../src/lib/formatted-text/formatted-text";

// Slice 1's screens as the design catalogue draws them in the chosen direction (decision record
// 0073): the public page, the learn-more screens and the shared missing page.

afterEach(() => {
  vi.unstubAllGlobals();
});

const privacy = {
  id: "00000000-0000-4000-8000-000000000501",
  createdAt: "2020-12-02T17:00:00.000Z",
  updatedAt: "2026-09-14T17:00:00.000Z",
  slug: "privacy",
  title: "Privacy",
  body: "## How we handle your information\n\nWe keep very little.",
  fixed: true,
};

describe("the public page (content-view)", () => {
  it("is one article labelled by its H1, the page's own title", () => {
    render(<PublishedPage page={privacy} />);

    const article = screen.getByRole("article", { name: "Privacy" });
    expect(article.getAttribute("data-testid")).toBe("content-page");
    const heading = within(article).getByRole("heading", { level: 1 });
    expect(heading.id).toBe("content-page-heading");
    expect(within(heading).getByTestId("content-page-title").textContent).toBe("Privacy");
  });

  it("gives its dates as terms and values, in the order Published then Last updated", () => {
    const { container } = render(<PublishedPage page={privacy} />);

    const terms = Array.from(container.querySelectorAll("dl dt")).map((term) => term.textContent);
    expect(terms).toEqual(["Published", "Last updated"]);
    expect(container.querySelector("dd [data-testid='content-published-date']")?.tagName).toBe("TIME");
  });

  it("draws a body's own headings from H2, under the page's H1", () => {
    render(<PublishedPage page={privacy} />);

    const body = screen.getByTestId("content-page-body");
    expect(within(body).getByRole("heading", { level: 2 }).textContent).toBe("How we handle your information");
  });

  it("ends with the address line", () => {
    render(<PublishedPage page={privacy} />);

    const article = screen.getByTestId("content-page");
    expect(article.lastElementChild?.textContent).toBe("Address of this page: /content/privacy");
  });

  it("shows only a status row while the page is on its way", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => undefined)));
    render(<ContentViewScreen address="privacy" />);

    expect(screen.getByRole("status").textContent).toContain("Loading page");
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.queryByTestId("content-page")).toBeNull();
  });
});

describe("the formatted-text renderer in the direction", () => {
  it("draws an H2 in the section size and a deeper heading in bold body text", () => {
    render(<FormattedText markup={"## Section\n\n### Part\n\nText."} />);

    expect(screen.getByRole("heading", { level: 2 }).getAttribute("style")).toContain("--typography-bold-h4");
    expect(screen.getByRole("heading", { level: 3 }).getAttribute("style")).toContain("--typography-bold-body");
  });

  it("still shows raw markup as text (R-7.17)", () => {
    const { container } = render(<FormattedText markup={"<script>alert(1)</script>"} />);

    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
  });
});

describe("a learn-more screen (R-7.18)", () => {
  it("has the program as its H1, its account in a panel, and the cost as a region", () => {
    render(<LearnMoreScreen program="code-with-us" />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Code With Us");
    const how = screen.getByRole("region", { name: "How Code With Us works" });
    expect(how.className).toContain("op-panel");
    const cost = screen.getByRole("region", { name: "What it costs" });
    expect(cost.className).toContain("op-region");
  });

  it("puts the service level agreement link in the cost region, at the page the service keeps", () => {
    render(<LearnMoreScreen program="team-with-us" />);

    const cost = screen.getByRole("region", { name: "What it costs" });
    const link = within(cost).getByTestId("service-level-agreement-link");
    expect(link.textContent).toBe("service level agreement");
    expect(link.getAttribute("href")).toBe("/content/service-level-agreement");
  });
});

describe("the shared missing page (R-7.2, R-7.3)", () => {
  it("says the page was not found and offers the way home as the one primary action", () => {
    render(<NotFound />);

    const page = screen.getByTestId("not-found-page");
    expect(within(page).getByRole("heading", { level: 1 }).textContent).toBe("Page not found");
    expect(within(page).getByText("The page you are looking for does not exist.")).toBeTruthy();
    expect(within(page).getByRole("link", { name: "Back to home" }).getAttribute("href")).toBe("/");
  });

  it("never says the visitor is not allowed", () => {
    render(<NotFound />);

    expect(screen.getByTestId("not-found-page").textContent).not.toMatch(/allowed|permission/i);
  });
});
