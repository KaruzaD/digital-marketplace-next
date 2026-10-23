import { fireEvent, render, screen, within } from "@testing-library/react";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Account } from "../src/api/accounts";
import type { IdentityClient } from "../src/auth/identity-client";
import { accountLinksFor, sectionOf, sectionsFor } from "../src/app/site-header";
import { FOOTER_LINKS, SiteFooter } from "../src/app/site-footer";
import { resetSessionForTests } from "../src/auth/session";
import { routeTree } from "../src/router";

/**
 * The site's shell as design/catalogue/site.tsx draws it: the skip link, the banner with its
 * navigation and account area at both widths, and the footer.
 */

function account(overrides: Partial<Account>): Account {
  return {
    id: "00000000-0000-4000-8000-000000000201",
    type: "VENDOR",
    status: "ACTIVE",
    name: "Alex Placeholder",
    email: "vendor.one@example.test",
    jobTitle: null,
    avatarImageFile: null,
    notificationsOn: null,
    acceptedTermsAt: "2026-01-05T17:00:00.000Z",
    lastAcceptedTermsAt: "2026-01-05T17:00:00.000Z",
    idpUsername: "test-vendor-1",
    capabilities: [],
    deactivatedOn: null,
    deactivatedBy: null,
    ...overrides,
  };
}

const vendor = account({});
const administrator = account({ id: "00000000-0000-4000-8000-000000000103", type: "ADMIN", email: "admin@example.test" });

function fakeIdentity() {
  return {
    start: vi.fn(() => true),
    signIn: vi.fn(async () => {}),
    endSession: vi.fn(async () => true),
    signOut: vi.fn(async () => {}),
    accessToken: vi.fn(async () => "a-token"),
    forget: vi.fn(),
  } satisfies IdentityClient;
}

function renderAt(address: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [address] }) });
  return render(<RouterProvider router={router as never} />);
}

/** Makes the window as narrow, or as wide, as the header's switch point reads it. */
function windowNarrow(narrow: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: narrow,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const original = window.matchMedia;

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })));
});

afterEach(() => {
  window.matchMedia = original;
  vi.unstubAllGlobals();
});

describe("which section a screen belongs to", () => {
  it("marks each section's own screens, and no section for a person's own profile or a page read at its address", () => {
    expect(sectionOf("/")).toBe("home");
    expect(sectionOf("/dashboard")).toBe("dashboard");
    expect(sectionOf("/opportunities")).toBe("opportunities");
    expect(sectionOf("/opportunities/code-with-us/abc")).toBe("opportunities");
    expect(sectionOf("/organizations/abc/edit")).toBe("organizations");
    expect(sectionOf("/users")).toBe("users");
    expect(sectionOf("/users/abc")).toBe("users");
    expect(sectionOf("/users/me")).toBeUndefined();
    expect(sectionOf("/content")).toBe("content");
    expect(sectionOf("/content/create")).toBe("content");
    expect(sectionOf("/content/about/edit")).toBe("content");
    expect(sectionOf("/content/about")).toBeUndefined();
    expect(sectionOf("/learn-more/code-with-us")).toBeUndefined();
  });
});

describe("what the navigation offers", () => {
  it("offers a visitor Home, a signed-in person their Dashboard, and an administrator Users and Content", () => {
    expect(sectionsFor(null)).toEqual(["home", "opportunities", "organizations"]);
    expect(sectionsFor({ type: "VENDOR" })).toEqual(["dashboard", "opportunities", "organizations"]);
    expect(sectionsFor({ type: "GOV" })).toEqual(["dashboard", "opportunities", "organizations"]);
    expect(sectionsFor({ type: "ADMIN" })).toEqual(["dashboard", "opportunities", "organizations", "users", "content"]);
  });

  it("offers My Organizations to a vendor alone", () => {
    expect(accountLinksFor({ type: "VENDOR" }).map((link) => link.label)).toEqual(["My Profile", "My Organizations", "Sign Out"]);
    expect(accountLinksFor({ type: "GOV" }).map((link) => link.label)).toEqual(["My Profile", "Sign Out"]);
  });
});

describe("the banner on a wide screen", () => {
  it("puts the skip link first and marks the current section", async () => {
    windowNarrow(false);
    resetSessionForTests({ status: "visitor" }, fakeIdentity());
    const { container } = renderAt("/");
    const banner = await screen.findByTestId("site-header");
    expect(container.querySelector("a")?.textContent).toBe("Skip to main content");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("#main");
    expect(screen.getByRole("main").id).toBe("main");
    const nav = within(banner).getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual(["Home", "Opportunities", "Organizations"]);
    expect(within(nav).getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    expect(within(nav).getByRole("link", { name: "Opportunities" }).getAttribute("aria-current")).toBeNull();
  });

  it("gives an administrator's account menu their own pages and no sign-in", async () => {
    windowNarrow(false);
    resetSessionForTests({ status: "signed-in", account: administrator }, fakeIdentity());
    renderAt("/content");
    const banner = await screen.findByTestId("site-header");
    const nav = within(banner).getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Content" }).getAttribute("aria-current")).toBe("page");
    expect(within(banner).queryByRole("link", { name: "Sign In" })).toBeNull();
    fireEvent.click(within(banner).getByRole("button", { name: "admin@example.test" }));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual(["My Profile", "Sign Out"]);
  });
});

describe("the banner on a narrow screen", () => {
  it("keeps the navigation behind a Menu button that Escape closes", async () => {
    windowNarrow(true);
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt("/dashboard");
    const banner = await screen.findByTestId("site-header");
    const toggle = within(banner).getByRole("button", { name: "Menu" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(menu.hidden).toBe(true);

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.textContent).toBe("Close");
    expect(menu.hidden).toBe(false);
    expect(within(menu).getByRole("link", { name: "Dashboard" }).getAttribute("aria-current")).toBe("page");
    expect(within(menu).getByText("Signed in as vendor.one@example.test")).toBeTruthy();
    const account = within(menu).getByRole("navigation", { name: "Account" });
    expect(within(account).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "/users/me",
      "/users/me?tab=organizations",
      "/sign-out",
    ]);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menu.hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it("offers a visitor Sign In and Sign Up inside the menu, carrying the home page's test IDs there", async () => {
    windowNarrow(true);
    resetSessionForTests({ status: "visitor" }, fakeIdentity());
    renderAt("/");
    const banner = await screen.findByTestId("site-header");
    fireEvent.click(within(banner).getByRole("button", { name: "Menu" }));
    expect(within(banner).getByTestId("home-sign-in").getAttribute("href")).toBe("/sign-in");
    expect(within(banner).getByTestId("home-sign-up").getAttribute("href")).toBe("/sign-up");
    expect(screen.getAllByTestId("home-sign-in")).toHaveLength(1);
  });
});

describe("the footer", () => {
  it("carries the original site's eight links and no copyright line", () => {
    render(<SiteFooter />);
    const footer = screen.getByTestId("site-footer");
    expect(within(footer).getAllByRole("link").filter((link) => FOOTER_LINKS.some((entry) => entry.label === link.textContent)).map((link) => link.textContent)).toEqual([
      "Home",
      "About",
      "Disclaimer",
      "Privacy",
      "Accessibility",
      "Copyright",
      "Contact Us",
      "Source Code",
    ]);
    expect(within(footer).getByText("Owned and operated by the B.C. Government.")).toBeTruthy();
    expect(footer.textContent).not.toMatch(/©/);
  });
});
