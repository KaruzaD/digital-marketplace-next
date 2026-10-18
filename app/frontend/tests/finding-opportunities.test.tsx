import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Account } from "../src/api/accounts";
import type { IdentityClient } from "../src/auth/identity-client";
import { LOADING_SHOWN_AFTER_MS } from "../src/app/loading";
import { resetSessionForTests, startSession } from "../src/auth/session";
import { routeTree } from "../src/router";

/**
 * Finding opportunities and following them, as the screens do it (opportunity-list,
 * notification-optin-opportunity-list, opportunity-cwu-view, home). The service is stood in for;
 * what is checked is what the screens show and what they ask of the service.
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
const staff = account({ id: "00000000-0000-4000-8000-000000000102", type: "GOV", name: "Casey Placeholder" });

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

const cwu = (overrides: Record<string, unknown> & { id: string }) => ({
  program: "code-with-us",
  createdAt: "2026-09-01T17:00:00.000Z",
  updatedAt: "2026-09-01T17:00:00.000Z",
  status: "PUBLISHED",
  publishedAt: "2026-09-02T17:00:00.000Z",
  title: "Untitled",
  teaser: "",
  remoteOk: false,
  remoteDesc: "",
  location: "Victoria",
  reward: 45000,
  skills: [],
  description: "",
  proposalDeadline: "2030-10-02",
  assignmentDate: "2030-10-16",
  startDate: "2030-11-01",
  completionDate: null,
  attachments: [],
  addenda: [],
  subscribed: false,
  ...overrides,
});

const OPEN_SOON = cwu({ id: "00000000-0000-4000-8000-000000000101", title: "Build an accessible permit tracker", remoteOk: true, proposalDeadline: "2030-10-02" });
const OPEN_LATER = cwu({ id: "00000000-0000-4000-8000-000000000102", title: "Fix the fisheries export", location: "Nanaimo", proposalDeadline: "2031-01-15" });
const AWARDED = cwu({ id: "00000000-0000-4000-8000-000000000104", title: "An awarded one", status: "AWARDED", proposalDeadline: "2026-08-28" });
const SPRINT_CLOSED = {
  id: "00000000-0000-4000-8000-000000000201",
  program: "sprint-with-us",
  createdAt: "2026-08-01T17:00:00.000Z",
  updatedAt: "2026-08-01T17:00:00.000Z",
  status: "EVAL_QUESTIONS_INDIVIDUAL",
  publishedAt: "2026-08-02T17:00:00.000Z",
  title: "Modernize the licence renewal service",
  teaser: "",
  location: "Kamloops",
  remoteOk: true,
  remoteDesc: "",
  proposalDeadline: "2026-09-11",
  totalMaxBudget: 1200000,
  subscribed: true,
};
const MY_DRAFT = cwu({
  id: "00000000-0000-4000-8000-000000000301",
  title: "My own draft",
  status: "DRAFT",
  createdBy: { id: staff.id, name: staff.name },
  updatedAt: "2026-09-29T17:00:00.000Z",
});

const requests: { method: string; address: string; body: unknown }[] = [];

function serve(handler: (method: string, path: string, body: unknown) => Response | Promise<Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: Request) => {
      const type = input.headers.get("content-type") ?? "";
      const body = type.includes("application/json") ? JSON.parse(await input.clone().text()) : undefined;
      const url = new URL(input.url);
      requests.push({ method: input.method, address: `${url.pathname}${url.search}`, body });
      return handler(input.method, url.pathname, body);
    }),
  );
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function serveLists(lists: { cwu?: unknown[]; swu?: unknown[]; twu?: unknown[] }, other?: (method: string, path: string, body: unknown) => Response) {
  serve((method, path, body) => {
    if (method === "GET" && path === "/api/opportunities/code-with-us") return json(200, lists.cwu ?? []);
    if (method === "GET" && path === "/api/opportunities/sprint-with-us") return json(200, lists.swu ?? []);
    if (method === "GET" && path === "/api/opportunities/team-with-us") return json(200, lists.twu ?? []);
    return other ? other(method, path, body) : json(404, { errors: ["Not here."] });
  });
}

function renderAt(address: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [address] }) });
  return render(<RouterProvider router={router as never} />);
}

// The rows' titles in a group, whether the group is open or closed.
const titlesIn = (testId: string) =>
  within(screen.getByTestId(testId))
    .queryAllByRole("heading", { level: 3, hidden: true })
    .map((heading) => heading.textContent);

// Closed and Unpublished start closed; the button in the group's heading opens them.
function openGroup(testId: string) {
  const toggle = within(screen.getByTestId(testId)).getByRole("button");
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(toggle);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
}

beforeEach(() => {
  requests.length = 0;
});

afterEach(() => {
  vi.unstubAllGlobals();
  resetSessionForTests();
});

describe("the opportunity list (R-1.2, R-1.38, R-1.39)", () => {
  it("shows a visitor open and closed groups in their order, with no Watch and no email control", async () => {
    serveLists({ cwu: [OPEN_LATER, AWARDED, OPEN_SOON], swu: [SPRINT_CLOSED] });
    resetSessionForTests({ status: "visitor" });
    renderAt("/opportunities");
    await screen.findByTestId("opportunity-group-open");
    expect(titlesIn("opportunity-group-open")).toEqual(["Build an accessible permit tracker", "Fix the fisheries export"]);
    expect(titlesIn("opportunity-group-closed")).toEqual(["Modernize the licence renewal service", "An awarded one"]);
    expect(screen.queryByTestId("opportunity-group-unpublished")).toBeNull();
    expect(screen.queryByTestId("opportunity-watch-toggle")).toBeNull();
    expect(screen.queryByTestId("notification-optin-control")).toBeNull();
    // A visitor is offered no status filter: that is the original site's, for staff.
    expect(screen.queryByTestId("opportunity-filter-status")).toBeNull();
    const deadlines = within(screen.getByTestId("opportunity-group-open")).getAllByTestId("opportunity-proposal-deadline");
    expect(deadlines[0]!.textContent).toBe("October 2, 2030 at 4:00 p.m. Pacific time");
    expect(screen.getByRole("heading", { level: 2, name: /Open Opportunities/ }).textContent).toBe("Open Opportunities2");

    // The closed group starts closed, its rows hidden; its button shows them and hides them again.
    const closed = screen.getByTestId("opportunity-group-closed");
    const closedToggle = within(closed).getByRole("button", { name: "Closed Opportunities" });
    expect(screen.queryByRole("link", { name: "Modernize the licence renewal service" })).toBeNull();
    openGroup("opportunity-group-closed");
    expect(within(closed).getByRole("link", { name: "An awarded one" })).toBeTruthy();
    fireEvent.click(closedToggle);
    expect(closedToggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("link", { name: "Modernize the licence renewal service" })).toBeNull();
    fireEvent.click(closedToggle);
    expect(screen.getByText("$1,200,000")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Modernize the licence renewal service" }).getAttribute("href")).toBe(
      "/opportunities/sprint-with-us/00000000-0000-4000-8000-000000000201",
    );
  });

  it("names each status as the original site does: whether it is open to everyone else, its stage to staff", async () => {
    const CANCELLED = cwu({ id: "00000000-0000-4000-8000-000000000105", title: "A cancelled one", status: "CANCELED", proposalDeadline: "2026-08-01" });
    serveLists({ cwu: [OPEN_SOON, AWARDED, CANCELLED], swu: [SPRINT_CLOSED] });
    resetSessionForTests({ status: "visitor" });
    const first = renderAt("/opportunities");
    await screen.findByTestId("opportunity-group-open");
    const statuses = (testId: string) =>
      within(screen.getByTestId(testId)).getAllByTestId("opportunity-status").map((status) => status.textContent);
    expect(statuses("opportunity-group-open")).toEqual(["Open"]);
    expect(statuses("opportunity-group-closed")).toEqual(["Evaluation", "Completed", "Canceled"]);
    first.unmount();

    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    renderAt("/opportunities");
    await screen.findByTestId("opportunity-group-unpublished");
    expect(statuses("opportunity-group-open")).toEqual(["Published"]);
    expect(statuses("opportunity-group-closed")).toEqual(["Team questions: individual evaluation", "Awarded", "Cancelled"]);
  });

  it("narrows the list by the words typed and by remote work, every condition at once", async () => {
    serveLists({ cwu: [OPEN_LATER, AWARDED, OPEN_SOON], swu: [SPRINT_CLOSED] });
    resetSessionForTests({ status: "visitor" });
    renderAt("/opportunities");
    await screen.findByTestId("opportunity-group-open");

    fireEvent.change(screen.getByTestId("opportunity-search").querySelector("input")!, { target: { value: "NANAIMO" } });
    expect(titlesIn("opportunity-group-open")).toEqual(["Fix the fisheries export"]);
    expect(titlesIn("opportunity-group-closed")).toHaveLength(0);
    expect(within(screen.getByTestId("opportunity-group-closed")).getByText("There are no closed opportunities that match your search criteria.")).toBeTruthy();

    // The words are found in the order typed, ignoring case.
    fireEvent.change(screen.getByTestId("opportunity-search").querySelector("input")!, { target: { value: "fix export" } });
    expect(titlesIn("opportunity-group-open")).toEqual(["Fix the fisheries export"]);
    fireEvent.change(screen.getByTestId("opportunity-search").querySelector("input")!, { target: { value: "export fix" } });
    expect(titlesIn("opportunity-group-open")).toHaveLength(0);

    fireEvent.change(screen.getByTestId("opportunity-search").querySelector("input")!, { target: { value: "" } });
    fireEvent.click(screen.getByTestId("opportunity-filter-remote").querySelector("input")!);
    expect(titlesIn("opportunity-group-open")).toEqual(["Build an accessible permit tracker"]);
    expect(titlesIn("opportunity-group-closed")).toEqual(["Modernize the licence renewal service"]);
  });

  it("says when a search matched nothing open, and Clear search empties the field and returns focus to it", async () => {
    serveLists({ cwu: [OPEN_SOON] });
    resetSessionForTests({ status: "visitor" });
    renderAt("/opportunities");
    const open = await screen.findByTestId("opportunity-group-open");
    const field = screen.getByTestId("opportunity-search").querySelector("input")!;
    fireEvent.change(field, { target: { value: "Kamloops" } });
    // The message is in the polite status region the open group always holds.
    expect(within(open).getByRole("status").textContent).toBe("There are no open opportunities that match your search criteria.");

    fireEvent.click(within(open).getByRole("button", { name: "Clear search" }));
    expect(field.value).toBe("");
    expect(document.activeElement).toBe(field);
    expect(titlesIn("opportunity-group-open")).toEqual(["Build an accessible permit tracker"]);
    expect(within(open).queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("says a group is empty in other words when nothing is chosen, and Reset clears the search and every filter", async () => {
    serveLists({ cwu: [AWARDED] });
    resetSessionForTests({ status: "visitor" });
    renderAt("/opportunities");
    const open = await screen.findByTestId("opportunity-group-open");
    expect(within(open).getByRole("status").textContent).toBe("There are currently no open opportunities. Check back soon!");

    const remote = screen.getByTestId("opportunity-filter-remote").querySelector("input")!;
    fireEvent.click(remote);
    fireEvent.change(screen.getByTestId("opportunity-search").querySelector("input")!, { target: { value: "awarded" } });
    expect(titlesIn("opportunity-group-closed")).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(remote.checked).toBe(false);
    expect(screen.getByTestId("opportunity-search").querySelector("input")!.value).toBe("");
    expect(titlesIn("opportunity-group-closed")).toEqual(["An awarded one"]);
  });

  it("shows a member of staff their unpublished work first, with no Watch on what they created (R-1.3, R-1.5)", async () => {
    serveLists({ cwu: [OPEN_SOON, MY_DRAFT, cwu({ ...OPEN_LATER, createdBy: { id: staff.id, name: staff.name } })] });
    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    renderAt("/opportunities");
    const unpublished = await screen.findByTestId("opportunity-group-unpublished");
    expect(unpublished.compareDocumentPosition(screen.getByTestId("opportunity-group-open")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByTestId("opportunity-filter-status")).toBeTruthy();
    openGroup("opportunity-group-unpublished");
    expect(within(unpublished).getByRole("link", { name: "My own draft" })).toBeTruthy();
    expect(within(unpublished).getByTestId("opportunity-status").textContent).toBe("Draft");
    expect(within(unpublished).queryByTestId("opportunity-watch-toggle")).toBeNull();
    const open = screen.getByTestId("opportunity-group-open");
    expect(within(open).getAllByTestId("opportunity-watch-toggle")).toHaveLength(1);
  });

  it("keeps the Unpublished group for a member of staff who has nothing in it, saying so (decision record 0036)", async () => {
    serveLists({ cwu: [OPEN_SOON] });
    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    renderAt("/opportunities");
    const unpublished = await screen.findByTestId("opportunity-group-unpublished");
    expect(within(unpublished).getByText("There are currently no unpublished opportunities.")).toBeTruthy();
    expect(titlesIn("opportunity-group-unpublished")).toHaveLength(0);
  });

  it("says so while the list is on its way, once it has taken long enough to notice (decision record 0039)", async () => {
    serve(() => new Promise<Response>(() => {}));
    resetSessionForTests({ status: "visitor" });
    renderAt("/opportunities");
    // Nothing of the screen is drawn at first, so its heading never stands over a list still to come.
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(await screen.findByText("Loading opportunities…", undefined, { timeout: LOADING_SHOWN_AFTER_MS + 1000 })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Welcome to the Digital Marketplace" })).toBeTruthy();
    // The filters are there while the opportunities are on their way.
    expect(screen.getByTestId("opportunity-filter-program")).toBeTruthy();
  });

  it("asks for the list while it is still finding out who is asking, and keeps that answer for them (decision record 0039)", async () => {
    let answerSession: (response: Response) => void = () => {};
    serveLists({ cwu: [OPEN_SOON, MY_DRAFT] }, (method, path) =>
      method === "GET" && path === "/api/sessions/current"
        ? (new Promise<Response>((resolve) => (answerSession = resolve)) as never)
        : json(404, {}),
    );
    resetSessionForTests();
    const identity = fakeIdentity();
    void startSession(identity);
    renderAt("/opportunities");
    await waitFor(() => expect(requests.filter((request) => request.address.startsWith("/api/opportunities/"))).toHaveLength(3));
    expect(screen.queryByTestId("opportunity-group-unpublished")).toBeNull();

    answerSession(json(200, { id: "s", user: staff }));
    const unpublished = await screen.findByTestId("opportunity-group-unpublished");
    expect(within(unpublished).getByText("My own draft")).toBeTruthy();
    // The list asked for before the session was known is the one shown: it is not asked for twice.
    expect(requests.filter((request) => request.address === "/api/opportunities/code-with-us")).toHaveLength(1);
  });

  it("asks again for a program the service could not answer for, rather than leaving it out", async () => {
    // Every first answer for the program is a fault, however many times the screen is mounted.
    let failures = 2;
    serve((method, path) => {
      if (method === "GET" && path === "/api/opportunities/code-with-us") {
        if (failures > 0) {
          failures -= 1;
          return json(503, { errors: ["The service is unavailable."] });
        }
        return json(200, [MY_DRAFT]);
      }
      if (method === "GET" && path.startsWith("/api/opportunities/")) return json(200, []);
      return json(404, {});
    });
    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    renderAt("/opportunities");
    const unpublished = await screen.findByTestId("opportunity-group-unpublished", undefined, { timeout: 3000 });
    expect(within(unpublished).getByText("My own draft")).toBeTruthy();
    expect(failures).toBe(0);
  });

  it("has no accessibility violations", async () => {
    serveLists({ cwu: [OPEN_SOON, AWARDED] });
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    const { container } = renderAt("/opportunities");
    await screen.findByTestId("notification-optin-control");
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });

  it("has no accessibility violations for staff, with every group open", async () => {
    serveLists({ cwu: [OPEN_SOON, AWARDED, MY_DRAFT] });
    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    const { container } = renderAt("/opportunities");
    await screen.findByTestId("opportunity-group-unpublished");
    openGroup("opportunity-group-unpublished");
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations.map((violation) => violation.id)).toEqual([]);
  });
});

describe("a screen for staff alone, while it is finding out who is asking (decision record 0039)", () => {
  it("draws nothing at first, and its heading over a loading state only once that has taken a while", async () => {
    resetSessionForTests();
    renderAt("/opportunities/create");
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.queryByTestId("service-level-agreement-link")).toBeNull();
    expect(await screen.findByText("Loading…", undefined, { timeout: LOADING_SHOWN_AFTER_MS + 1000 })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Create an opportunity" })).toBeTruthy();
  });

  it("still takes focus to the list's heading on arriving from another screen, though the heading comes later", async () => {
    serve(async (_method, path) => {
      if (path.startsWith("/api/opportunities/")) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return json(200, []);
      }
      return json(200, [{ totalCount: 0, totalAwarded: 0 }]);
    });
    resetSessionForTests({ status: "visitor" });
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/"] }) });
    render(<RouterProvider router={router as never} />);
    await screen.findByTestId("home-page");

    await router.navigate({ to: "/opportunities" });
    const heading = await screen.findByRole("heading", { level: 1, name: "Welcome to the Digital Marketplace" });
    await waitFor(() => expect(document.activeElement).toBe(heading));
  });

  it("is drawn whole, cards and links, once the person is known to be staff", async () => {
    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    renderAt("/opportunities/create");
    expect(await screen.findAllByTestId("service-level-agreement-link")).toHaveLength(3);
    expect(screen.getByRole("heading", { level: 1, name: "Create an opportunity" })).toBeTruthy();
  });
});

describe("watching from the list (R-1.5)", () => {
  it("watches and stops watching an opportunity by its card, saying which program it is in", async () => {
    serveLists({ cwu: [OPEN_SOON], swu: [SPRINT_CLOSED] }, (method) =>
      method === "POST" ? json(201, {}) : json(200, {}),
    );
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt("/opportunities");
    await screen.findByTestId("opportunity-group-open");
    const [cwuBox, swuBox] = screen.getAllByTestId("opportunity-watch-toggle").map((box) => box.querySelector("input")!);
    expect(cwuBox!.checked).toBe(false);
    expect(swuBox!.checked).toBe(true);

    fireEvent.click(cwuBox!);
    await waitFor(() => expect(requests.some((request) => request.method === "POST")).toBe(true));
    expect(requests.find((request) => request.method === "POST")).toEqual({
      method: "POST",
      address: "/api/subscribers/code-with-us",
      body: { opportunity: OPEN_SOON.id },
    });
    expect(cwuBox!.checked).toBe(true);

    fireEvent.click(swuBox!);
    await waitFor(() => expect(requests.some((request) => request.method === "DELETE")).toBe(true));
    expect(requests.find((request) => request.method === "DELETE")!.address).toBe(`/api/subscribers/sprint-with-us/${SPRINT_CLOSED.id}`);
  });

  it("puts the box back and says so when the service refuses", async () => {
    serveLists({ cwu: [OPEN_SOON] }, () => json(400, { errors: ["opportunity: You are already watching this opportunity."] }));
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt("/opportunities");
    const box = (await screen.findByTestId("opportunity-watch-toggle")).querySelector("input")!;
    fireEvent.click(box);
    expect(await screen.findByText("Your choice could not be saved")).toBeTruthy();
    expect(box.checked).toBe(false);
  });
});

describe("new-opportunity emails from the list (R-6.20, R-6.21, R-6.27)", () => {
  it("offers a new account the emails, and saves the choice at once, with no question asked", async () => {
    serveLists({ cwu: [OPEN_SOON] }, (method, path, body) =>
      method === "PUT" && path === `/api/users/${vendor.id}`
        ? json(200, { ...vendor, notificationsOn: (body as { value: boolean }).value ? "2026-10-01T17:00:00.000Z" : null })
        : json(404, {}),
    );
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt("/opportunities");
    const control = await screen.findByTestId("notification-optin-control");
    expect(control.getAttribute("style") ?? "").not.toMatch(/display:\s*none/);
    // It comes before the first group, once.
    expect(control.compareDocumentPosition(screen.getByTestId("opportunity-group-open")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getAllByTestId("notification-optin-control")).toHaveLength(1);
    expect(screen.getByTestId("notification-optin-state").textContent).toBe("You are not emailed when new opportunities are posted.");

    fireEvent.click(screen.getByTestId("notification-optin-toggle"));
    await waitFor(() =>
      expect(screen.getByTestId("notification-optin-toggle").textContent).toBe("Stop emailing me about new opportunities"),
    );
    expect(requests.find((request) => request.method === "PUT")!.body).toEqual({ tag: "updateNotifications", value: true });
    expect(screen.getByTestId("notification-optin-state").textContent).toBe(
      "You are emailed at vendor.one@example.test when new opportunities are posted.",
    );
    expect(screen.getByText("Saved. You will be emailed when the next opportunity is posted.")).toBeTruthy();
    expect(screen.queryByRole("alertdialog")).toBeNull();

    fireEvent.click(screen.getByTestId("notification-optin-toggle"));
    await waitFor(() =>
      expect(screen.getByTestId("notification-optin-toggle").textContent).toBe("Email me about new opportunities"),
    );
    expect(requests.filter((request) => request.method === "PUT").map((request) => request.body)).toEqual([
      { tag: "updateNotifications", value: true },
      { tag: "updateNotifications", value: false },
    ]);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("says so, in the control's own status region, when the choice could not be saved", async () => {
    serveLists({ cwu: [OPEN_SOON] }, () => json(503, { errors: ["The service is unavailable."] }));
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt("/opportunities");
    const control = await screen.findByTestId("notification-optin-control");
    const status = within(control).getByRole("status");
    expect(status.textContent).toBe("");
    fireEvent.click(screen.getByTestId("notification-optin-toggle"));
    await waitFor(() => expect(status.textContent).toBe("Your choice could not be saved. Nothing has changed. Please try again."));
    expect(screen.getByTestId("notification-optin-toggle").textContent).toBe("Email me about new opportunities");
  });
});

describe("a Code With Us opportunity's own page (R-1.5, R-1.6)", () => {
  const ID = OPEN_SOON.id;

  it("counts one view on opening, and offers Watch to a signed-in person who did not create it", async () => {
    serve((method, path) => {
      if (method === "GET" && path === `/api/opportunities/code-with-us/${ID}`) return json(200, OPEN_SOON);
      if (method === "POST" && path === "/api/subscribers/code-with-us") return json(201, {});
      return json(200, {});
    });
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt(`/opportunities/code-with-us/${ID}`);
    const toggle = await screen.findByTestId("opportunity-watch-toggle");
    await waitFor(() =>
      expect(requests.filter((request) => request.method === "PUT").map((request) => request.address)).toEqual([
        `/api/counters/opportunity.code-with-us.${ID}.views`,
      ]),
    );
    fireEvent.click(toggle.querySelector("input")!);
    expect(await screen.findByText("You are watching this opportunity. You will be emailed whenever it changes.")).toBeTruthy();
    expect(requests.filter((request) => request.method === "PUT")).toHaveLength(1);
  });

  it("counts a visitor's view too, and offers them no Watch, nor the opportunity's author", async () => {
    serve((method, path) =>
      method === "GET" && path === `/api/opportunities/code-with-us/${ID}` ? json(200, OPEN_SOON) : json(200, {}),
    );
    resetSessionForTests({ status: "visitor" });
    const first = renderAt(`/opportunities/code-with-us/${ID}`);
    await screen.findByTestId("opportunity-identifier");
    await waitFor(() => expect(requests.some((request) => request.method === "PUT")).toBe(true));
    expect(screen.queryByTestId("opportunity-watch-toggle")).toBeNull();
    first.unmount();

    serve((method, path) =>
      method === "GET" && path === `/api/opportunities/code-with-us/${ID}`
        ? json(200, { ...OPEN_SOON, createdBy: { id: staff.id, name: staff.name } })
        : json(200, {}),
    );
    resetSessionForTests({ status: "signed-in", account: staff }, fakeIdentity());
    renderAt(`/opportunities/code-with-us/${ID}`);
    await screen.findByTestId("opportunity-identifier");
    expect(screen.queryByTestId("opportunity-watch-toggle")).toBeNull();
  });
});

describe("the home page", () => {
  it("leads to the opportunity list and shows what has been awarded", async () => {
    serve((_method, path) => (path === "/api/metrics" ? json(200, [{ totalCount: 128, totalAwarded: 6420000 }]) : json(404, {})));
    resetSessionForTests({ status: "visitor" });
    renderAt("/");
    expect((await screen.findByTestId("home-browse-opportunities")).getAttribute("href")).toBe("/opportunities");
    expect((await screen.findByTestId("home-awarded-count")).textContent).toBe("128");
    expect(screen.getByTestId("home-awarded-value").textContent).toBe("$6,420,000");
  });

  it("lists the open opportunities alone, nearest deadline first, with their count", async () => {
    serveLists(
      { cwu: [OPEN_LATER, AWARDED, OPEN_SOON, MY_DRAFT], swu: [SPRINT_CLOSED] },
      (_method, path) => (path === "/api/metrics" ? json(200, [{ totalCount: 1, totalAwarded: 5000 }]) : json(404, {})),
    );
    resetSessionForTests({ status: "visitor" });
    renderAt("/");
    const page = await screen.findByTestId("home-page");
    await within(page).findByRole("link", { name: "Build an accessible permit tracker" });
    const titles = within(page)
      .getAllByRole("article")
      .map((row) => within(row).getByRole("heading", { level: 3 }).textContent);
    expect(titles).toEqual(["Build an accessible permit tracker", "Fix the fisheries export"]);
    expect(within(page).getByRole("heading", { level: 2, name: /Open Opportunities/ }).textContent).toBe("Open Opportunities2");
    expect(within(page).getByRole("link", { name: "Build an accessible permit tracker" }).getAttribute("href")).toBe(
      `/opportunities/code-with-us/${OPEN_SOON.id}`,
    );
  });

  it("says each part is loading while it is on its way, with the page's own words already there", async () => {
    serve(() => new Promise<Response>(() => {}));
    resetSessionForTests({ status: "visitor" });
    renderAt("/");
    const page = await screen.findByTestId("home-page");
    expect(within(page).getByRole("heading", { level: 1 }).textContent).toBe(
      "Discover Unique Opportunities to Collaborate with the B.C. Public Sector.",
    );
    const waits = within(page).getAllByRole("status").map((status) => status.textContent);
    expect(waits).toEqual(["Loading opportunities…", "Loading figures…"]);
    expect(within(page).getAllByRole("link", { name: /Learn More/ }).map((link) => link.getAttribute("href"))).toEqual([
      "/learn-more/code-with-us",
      "/learn-more/team-with-us",
      "/learn-more/sprint-with-us",
    ]);
  });

  it("searches the opportunity list, which starts narrowed to the words searched for", async () => {
    serveLists({ cwu: [OPEN_SOON, OPEN_LATER] });
    resetSessionForTests({ status: "visitor" });
    const home = renderAt("/");
    const search = within(await screen.findByTestId("home-page")).getByRole("search");
    expect(search.getAttribute("action")).toBe("/opportunities");
    expect(within(search).getByRole("searchbox").getAttribute("name")).toBe("q");
    home.unmount();

    renderAt("/opportunities?q=fisheries");
    await screen.findByText("Fix the fisheries export");
    expect(screen.queryByText("Build an accessible permit tracker")).toBeNull();
  });
});
