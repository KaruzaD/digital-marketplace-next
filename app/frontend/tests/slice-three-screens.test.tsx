import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Account } from "../src/api/accounts";
import { ImagePicker } from "../src/app/image-picker";
import { AccountStatus, ProfileTabs, SaveStatus, accountColour } from "../src/app/user-kit";
import type { IdentityClient } from "../src/auth/identity-client";
import { resetSessionForTests } from "../src/auth/session";
import { routeTree } from "../src/router";

// Slice 3's screens as the design catalogue draws them in the chosen direction (decision record
// 0077): the profile and its sections, the unsubscribe landing and the picture picker. What each
// screen does is covered in profile.test.tsx; here, how it is laid out.

function account(overrides: Partial<Account> = {}): Account {
  return {
    id: "00000000-0000-4000-8000-000000000301",
    type: "VENDOR",
    status: "ACTIVE",
    name: "Alex Placeholder",
    email: "vendor.one@example.test",
    jobTitle: null,
    avatarImageFile: null,
    notificationsOn: "2026-01-05T17:00:00.000Z",
    acceptedTermsAt: "2026-01-05T17:00:00.000Z",
    lastAcceptedTermsAt: "2026-01-05T17:00:00.000Z",
    idpUsername: "test-vendor-1",
    capabilities: [],
    deactivatedOn: null,
    deactivatedBy: null,
    ...overrides,
  };
}

const vendor = account();
const staff = account({
  id: "00000000-0000-4000-8000-000000000302",
  type: "GOV",
  name: "Casey Placeholder",
  email: "staff.one@example.test",
  jobTitle: "Procurement officer",
  idpUsername: "test-gov",
});
const administrator = account({ id: "00000000-0000-4000-8000-000000000303", type: "ADMIN", name: "Robin Placeholder" });

function identity(): IdentityClient {
  return {
    start: vi.fn(() => true),
    signIn: vi.fn(async () => {}),
    endSession: vi.fn(async () => true),
    signOut: vi.fn(async () => {}),
    accessToken: vi.fn(async () => "a-token"),
    forget: vi.fn(),
  };
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function renderAt(address: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [address] }) });
  return render(<RouterProvider router={router as never} />);
}

const main = () => screen.getByRole("main");

/** The H1 in the direction's denser size: the design system's H3. */
async function expectPageTitle(name: string) {
  const heading = await screen.findByRole("heading", { level: 1, name });
  expect(main().contains(heading)).toBe(true);
  expect(heading.getAttribute("style")).toContain("--typography-bold-h3");
}

/** A region of the page: a labelled section whose H2 takes the design system's H4 size. */
function region(name: string) {
  const heading = within(main()).getByRole("heading", { level: 2, name });
  expect(heading.getAttribute("style")).toContain("--typography-bold-h4");
  const section = heading.parentElement as HTMLElement;
  expect(section.tagName).toBe("SECTION");
  expect(section.className).toBe("op-region");
  return section;
}

afterEach(() => {
  vi.unstubAllGlobals();
  resetSessionForTests();
});

describe("the user kit's profile pieces", () => {
  it("colours an account's status green while active and grey once deactivated, always in words", () => {
    expect(accountColour("Active")).toBe("green");
    expect(accountColour("Inactive")).toBe("grey");
    render(<AccountStatus testId="badge">Inactive</AccountStatus>);
    const badge = screen.getByTestId("badge");
    expect(badge.textContent).toBe("Inactive");
    expect(badge.className).toContain("dm-label-grey");
  });

  it("draws the profile's sections as tabs, the current one marked", () => {
    render(
      <ProfileTabs
        base="/users/me"
        current="notifications"
        tabs={[
          { key: "profile", label: "Profile" },
          { key: "notifications", label: "Notifications" },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Profile sections" });
    expect(nav.className).toBe("op-tabs");
    expect(screen.getByTestId("profile-tab-profile").getAttribute("href")).toBe("/users/me");
    const current = screen.getByTestId("profile-tab-notifications");
    expect(current.getAttribute("href")).toBe("/users/me?tab=notifications");
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(screen.getByTestId("profile-tab-profile").getAttribute("aria-current")).toBeNull();
  });

  it("keeps an empty save status on the page, ready to announce", () => {
    render(<SaveStatus />);
    const status = screen.getByRole("status");
    expect(status.tagName).toBe("P");
    expect(status.className).toBe("us-saved");
    expect(status.textContent).toBe("");
  });
});

describe("the picture picker in the direction (file-image-picker)", () => {
  it("is a labelled group whose stated rule is the paragraph itself, described to the trigger", () => {
    render(<ImagePicker storedFileId={null} chosen={null} rejection={null} onChoose={() => {}} />);
    const group = screen.getByRole("group", { name: "Profile picture (optional)" });
    expect(group.className).toBe("fl-group");
    const rule = screen.getByTestId("image-file-rule");
    expect(rule.tagName).toBe("P");
    expect(rule.id).toBe("image-file-rule");
    expect(rule.className).toBe("fl-note");
    expect(screen.getByTestId("change-avatar").getAttribute("aria-describedby")).toBe("image-file-rule");
    expect(within(group).getByText("No profile picture has been added.").className).toBe("fl-note");
  });

  it("shows a refusal with its title rendered, and moves focus to it", async () => {
    render(
      <ImagePicker
        storedFileId={null}
        chosen={null}
        rejection={{ name: "portrait.gif", reason: "Choose a JPEG or PNG image." }}
        onChoose={() => {}}
      />,
    );
    const refusal = screen.getByTestId("image-rejected-error");
    expect(within(refusal).getByText("portrait.gif cannot be used as a profile picture")).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(refusal));
    expect(refusal.className).toBe("fl-focus");
  });
});

describe("a person's own profile in the direction (user-profile-self)", () => {
  it("is the H1, the section tabs, the facts as terms and values, the Details region and the deactivation region", async () => {
    resetSessionForTests({ status: "signed-in", account: vendor }, identity());
    renderAt("/users/me");

    await expectPageTitle("User Profile");
    expect(screen.getByRole("navigation", { name: "Profile sections" }).className).toBe("op-tabs");
    expect(screen.getByTestId("profile-tab-profile").getAttribute("aria-current")).toBe("page");

    const type = screen.getByTestId("profile-account-type");
    expect(type.tagName).toBe("DD");
    expect(type.textContent).toBe("Vendor");
    expect(screen.getByTestId("profile-user-identifier").tagName).toBe("DD");
    const badge = screen.getByTestId("profile-status-badge");
    expect(badge.textContent).toBe("Active");
    expect(badge.className).toContain("dm-label-green");

    const details = region("Details");
    expect(within(details).getByText("No profile picture has been added.").className).toBe("op-note");
    expect(within(details).getByTestId("name-field").parentElement?.className).toBe("us-fields");
    expect(within(details).getByTestId("profile-edit-button").parentElement?.className).toBe("op-actions");

    const leaving = region("Deactivate your account");
    expect(within(leaving).getByTestId("profile-deactivate-button").parentElement?.className).toBe("op-actions");
  });

  it("edits in the Edit your details region, with the picker, the field grid and an error summary that takes focus", async () => {
    resetSessionForTests({ status: "signed-in", account: vendor }, identity());
    renderAt("/users/me");
    fireEvent.click(await screen.findByTestId("profile-edit-button"));

    const editing = region("Edit your details");
    expect(within(editing).getByRole("group", { name: "Profile picture (optional)" })).toBeTruthy();
    expect(within(editing).getByTestId("email-field").parentElement?.className).toBe("us-fields");

    fireEvent.change(within(screen.getByTestId("name-field")).getByRole("textbox"), { target: { value: "" } });
    fireEvent.click(screen.getByTestId("profile-save-button"));

    const summary = await screen.findByText("Your changes have 1 problem");
    const box = summary.closest(".us-focus") as HTMLElement;
    await waitFor(() => expect(document.activeElement).toBe(box));
  });

  it("puts a public sector employee's permissions in their own region", async () => {
    resetSessionForTests({ status: "signed-in", account: staff }, identity());
    renderAt("/users/me");
    await expectPageTitle("User Profile");
    const permissions = region("Permissions");
    expect(within(permissions).getByTestId("profile-permissions-label").className).toBe("op-text");
  });
});

describe("the profile's other sections in the direction", () => {
  it("draws capabilities as bordered rows, the box and its toggle on one line", async () => {
    resetSessionForTests({ status: "signed-in", account: vendor }, identity());
    renderAt("/users/me?tab=capabilities");
    await expectPageTitle("Capabilities");

    const row = screen.getAllByTestId("capability-row")[0] as HTMLElement;
    expect(row.className).toBe("us-row");
    expect(row.parentElement?.className).toBe("us-rows");
    const toggle = within(row).getByTestId("capability-description-toggle");
    expect(toggle.parentElement?.className).toBe("us-row-line");
    fireEvent.click(toggle);
    expect(within(row).getByTestId("capability-description").className).toBe("us-description");
    expect(within(main()).getByRole("status").className).toBe("us-saved");
  });

  it("draws the legal section as three regions, the program terms as a list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json(200, vendor)),
    );
    resetSessionForTests({ status: "signed-in", account: vendor }, identity());
    renderAt("/users/me?tab=legal");
    await expectPageTitle("Policies, Terms & Agreements");

    expect(region("Privacy policy").getAttribute("data-testid")).toBe("legal-privacy-policy");
    expect(within(region("Terms and conditions")).getByTestId("legal-accepted-on").className).toBe("op-text");
    const links = within(region("Program terms")).getAllByTestId("legal-program-terms-link");
    expect(links).toHaveLength(3);
    expect(links[0]?.closest("ul")?.className).toBe("op-list");
  });
});

describe("the unsubscribe landing in the direction (notification-unsubscribe-landing)", () => {
  it("waits under the Notifications title while the account is not yet known", async () => {
    resetSessionForTests({ status: "starting" } as never, identity());
    renderAt("/users/me?tab=notifications&unsubscribe=1");
    expect(await screen.findByText(/Loading your notification settings/)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Notifications");
  });

  it("is the settings page under the question, and returns focus to the cleared box once unsubscribed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json(200, { ...vendor, notificationsOn: null })),
    );
    resetSessionForTests({ status: "signed-in", account: vendor }, identity());
    renderAt("/users/me?unsubscribe=1");

    // The question is asked over the page, which is hidden from assistive technology until it closes.
    fireEvent.click(await screen.findByTestId("unsubscribe-confirm-button"));
    await expectPageTitle("Notifications");
    expect(screen.getByTestId("notifications-email-address").className).toBe("op-text");

    const box = within(screen.getByTestId("notifications-new-opportunities-checkbox")).getByRole("checkbox");
    await waitFor(() => expect((box as HTMLInputElement).checked).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(box));
    await waitFor(() =>
      expect(within(main()).getByRole("status").textContent).toContain("You have unsubscribed."),
    );
  });
});

describe("an administrator on somebody else's profile in the direction (user-profile)", () => {
  it("is the facts, the Details region, Permissions with its hint grouped, and Account status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => json(200, staff)),
    );
    resetSessionForTests({ status: "signed-in", account: administrator }, identity());
    renderAt(`/users/${staff.id}`);

    await screen.findByTestId("profile-user-identifier");
    await expectPageTitle("User Profile");
    expect(screen.getByTestId("profile-status-badge").className).toContain("dm-label-green");
    region("Details");
    const permissions = region("Permissions");
    const box = within(permissions).getByTestId("profile-admin-checkbox");
    expect(box.parentElement?.className).toBe("us-group");
    expect(within(permissions).getByText(/takes effect as soon as/).className).toBe("op-note");
    const status = region("Account status");
    expect(within(status).getByTestId("profile-deactivate-button").parentElement?.className).toBe("op-actions");
  });
});
