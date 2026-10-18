import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Account } from "../src/api/accounts";
import type { IdentityClient } from "../src/auth/identity-client";
import { resetSessionForTests } from "../src/auth/session";
import { routeTree } from "../src/router";

// A multipart upload cannot be made through this test document's fetch, so storing an attachment
// is stood in for here.
const uploads = vi.hoisted(() => ({ store: vi.fn() }));
vi.mock("../src/api/opportunities", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/api/opportunities")>()),
  uploadAttachment: (file: File, name: string) => uploads.store(file, name),
}));

/**
 * A file attached to a Code With Us proposal on its create page, put forward for an organization,
 * then taken off it on its manage page (R-8.31's proposal case, as the screens do it).
 */

const vendor: Account = {
  id: "00000000-0000-4000-8000-000000000201",
  type: "VENDOR",
  status: "ACTIVE",
  name: "Alex Placeholder",
  email: "org.admin@example.test",
  jobTitle: null,
  avatarImageFile: null,
  notificationsOn: null,
  acceptedTermsAt: "2026-01-05T17:00:00.000Z",
  lastAcceptedTermsAt: "2026-01-05T17:00:00.000Z",
  idpUsername: "test-vendor-1",
  capabilities: [],
  deactivatedOn: null,
  deactivatedBy: null,
};

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

const OPPORTUNITY = "00000000-0000-4000-8000-000000000601";
const PROPOSAL = "00000000-0000-4000-8000-000000000a01";
const ORGANIZATION = "00000000-0000-4000-8000-000000000302";
const FILE_NAME = "R-8.31 removed from a proposal.pdf";
const stored = { id: "00000000-0000-4000-8000-000000000990", name: FILE_NAME };

const opportunity = {
  id: OPPORTUNITY,
  program: "code-with-us",
  createdAt: "2026-09-30T17:00:00.000Z",
  updatedAt: "2026-09-30T17:00:00.000Z",
  status: "PUBLISHED",
  publishedAt: "2026-09-30T17:00:00.000Z",
  title: "R-8.31 opportunity whose proposal loses an attachment",
  teaser: "",
  remoteOk: true,
  remoteDesc: "Anywhere.",
  location: "Victoria",
  reward: 5000,
  skills: [],
  description: "What the work is.",
  proposalDeadline: "2030-06-01",
  assignmentDate: "2030-06-15",
  startDate: "2030-07-01",
  completionDate: null,
  attachments: [],
  addenda: [],
  subscribed: false,
};

const proposal = (attachments: readonly unknown[]) => ({
  id: PROPOSAL,
  program: "code-with-us",
  createdAt: "2026-09-12T17:30:00.000Z",
  updatedAt: "2026-09-15T21:12:00.000Z",
  createdBy: { id: vendor.id, name: vendor.name },
  updatedBy: { id: vendor.id, name: vendor.name },
  status: "DRAFT",
  submittedAt: null,
  opportunity: { id: OPPORTUNITY, title: opportunity.title, status: "PUBLISHED", proposalDeadline: "2030-06-01", reward: 5000 },
  proposalText: "",
  additionalComments: "",
  proponent: { tag: "organization", value: { id: ORGANIZATION, legalName: "Northern Pines Digital Ltd." } },
  attachments,
  anonymousProponentName: "",
  history: [{ createdAt: "2026-09-12T17:30:00.000Z", createdBy: { id: vendor.id, name: vendor.name }, status: "DRAFT", event: null, note: null }],
});

const requests: { method: string; address: string; body: unknown }[] = [];

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function serve() {
  let held: readonly unknown[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: Request) => {
      const type = input.headers.get("content-type") ?? "";
      const body = type.includes("application/json") ? JSON.parse(await input.clone().text()) : undefined;
      const url = new URL(input.url);
      requests.push({ method: input.method, address: url.pathname, body });
      if (input.method === "POST" && url.pathname === "/api/proposals/code-with-us") {
        held = (body as { attachments: string[] }).attachments.includes(stored.id) ? [stored] : [];
        return json(201, proposal(held));
      }
      if (input.method === "PUT") {
        const value = (body as { value: { attachments?: string[] } }).value;
        if (value.attachments) held = value.attachments.includes(stored.id) ? [stored] : [];
        return json(200, proposal(held));
      }
      if (url.pathname === `/api/opportunities/code-with-us/${OPPORTUNITY}`) return json(200, opportunity);
      if (url.pathname === "/api/proposals/code-with-us") return json(200, []);
      if (url.pathname === "/api/ownedOrganizations") return json(200, [{ id: ORGANIZATION, legalName: "Northern Pines Digital Ltd." }]);
      if (url.pathname === `/api/proposals/code-with-us/${PROPOSAL}`) return json(200, proposal(held));
      return json(200, []);
    }),
  );
}

function renderAt(address: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [address] }) });
  render(<RouterProvider router={router as never} />);
  return router;
}

function choose(file: File) {
  const chooser = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(chooser, { target: { files: [file] } });
}

beforeEach(() => {
  requests.length = 0;
  uploads.store.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  resetSessionForTests();
});

describe("a file attached to a Code With Us proposal for an organization (R-8.31)", () => {
  it("is offered at its address in its own row once chosen, is attached when saved, and is taken off when removed", async () => {
    serve();
    uploads.store.mockResolvedValue({ kind: "stored", attachment: stored });
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    const router = renderAt(`/opportunities/code-with-us/${OPPORTUNITY}/proposals/create`);

    fireEvent.click(within(await screen.findByTestId("proposal-proponent-organization")).getByRole("radio"));
    const select = (await screen.findByTestId("proposal-organization-field")).querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: ORGANIZATION } });
    await waitFor(() => expect(screen.getByTestId("proposal-organization-field").textContent).toContain("Northern Pines Digital Ltd."));

    choose(new File(["%PDF-1.4"], FILE_NAME));
    // Once stored, its new row offers it at its own address and can still be renamed until saved,
    // inside the form's numbered attachments part.
    const row = await screen.findByTestId("attachment-new-row");
    expect(row.closest("li")).toBe(row);
    const link = await within(row).findByRole("link", { name: `Download ${FILE_NAME}` });
    expect(link.getAttribute("href")).toBe(`/api/files/${stored.id}?type=blob`);
    expect(within(row).getByTestId("attachment-name-field")).toBeTruthy();
    expect(within(row).getByRole("status").textContent).toContain("It is attached to the proposal when you save it.");
    expect(screen.getByRole("region", { name: "3. Attachments" }).contains(row)).toBe(true);

    fireEvent.click(screen.getByTestId("proposal-save-draft"));
    await waitFor(() => expect(router.state.location.pathname).toContain(`/proposals/${PROPOSAL}/edit`));
    expect(requests.find((request) => request.method === "POST" && request.address === "/api/proposals/code-with-us")?.body).toMatchObject({
      proponent: { tag: "organization", value: ORGANIZATION },
      attachments: [stored.id],
    });

    fireEvent.click(await screen.findByTestId("proposal-edit-button"));
    const kept = await screen.findByTestId("attachment-existing-row");
    fireEvent.click(within(kept).getByRole("button", { name: `Remove ${FILE_NAME}` }));
    expect(screen.queryByTestId("attachment-existing-row")).toBeNull();
    fireEvent.click(screen.getByTestId("proposal-save-changes"));
    await waitFor(() => expect(requests.some((request) => request.method === "PUT")).toBe(true));
    expect(requests.find((request) => request.method === "PUT")?.body).toMatchObject({ tag: "edit", value: { attachments: [] } });
  });

  it("stays a new row, with the reason, when it cannot be stored, and is never sent with the proposal", async () => {
    serve();
    uploads.store.mockResolvedValue({ kind: "refused", reasons: ["You may not attach that file."] });
    resetSessionForTests({ status: "signed-in", account: vendor }, fakeIdentity());
    renderAt(`/opportunities/code-with-us/${OPPORTUNITY}/proposals/create`);
    await screen.findByTestId("attachment-add-button");

    choose(new File(["%PDF-1.4"], FILE_NAME));
    const row = await screen.findByTestId("attachment-new-row");
    expect((await within(row).findByRole("alert")).textContent).toContain(`${FILE_NAME} could not be attached`);
    expect(screen.queryByTestId("attachment-existing-row")).toBeNull();
    expect(within(row).queryByRole("link")).toBeNull();
  });
});
