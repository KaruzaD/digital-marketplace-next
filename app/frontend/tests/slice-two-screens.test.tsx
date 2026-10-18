import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Account } from "../src/api/accounts";
import type { IdentityClient } from "../src/auth/identity-client";
import { resetSessionForTests } from "../src/auth/session";
import { routeTree } from "../src/router";

// Slice 2's screens as the design catalogue draws them in the chosen direction (decision record
// 0074): sign-in and sign-up, completing a profile, signing out and the notices. What each screen
// does is covered in signing-in.test.tsx; here, how it is laid out.

const unfinishedVendor: Account = {
  id: "00000000-0000-4000-8000-000000000220",
  type: "VENDOR",
  status: "ACTIVE",
  name: "Tatum Placeholder",
  email: "vendor.completing@example.test",
  jobTitle: null,
  avatarImageFile: null,
  notificationsOn: null,
  acceptedTermsAt: null,
  lastAcceptedTermsAt: null,
  idpUsername: "test-vendor-17",
  capabilities: [],
  deactivatedOn: null,
  deactivatedBy: null,
};

function identity(signedIn: boolean): IdentityClient {
  return {
    start: vi.fn(() => signedIn),
    signIn: vi.fn(async () => {}),
    endSession: vi.fn(async () => true),
    signOut: vi.fn(async () => {}),
    accessToken: vi.fn(async () => (signedIn ? "a-token" : null)),
    forget: vi.fn(),
  };
}

function renderAt(address: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [address] }) });
  return render(<RouterProvider router={router as never} />);
}

const main = () => screen.getByRole("main");

/** The H1 in the direction's denser size: the design system's H3. */
function expectPageTitle(name: string) {
  const heading = within(main()).getByRole("heading", { level: 1, name });
  expect(heading.getAttribute("style")).toContain("--typography-bold-h3");
}

afterEach(() => {
  vi.unstubAllGlobals();
  resetSessionForTests();
});

describe("Sign In and Choose Account Type in the direction", () => {
  for (const [address, title, screenName] of [
    ["/sign-in", "Sign In", "sign-in"],
    ["/sign-up", "Choose Account Type", "sign-up"],
  ] as const) {
    it(`${title}: the two kinds of account as equal panels side by side, and no primary button`, async () => {
      resetSessionForTests({ status: "visitor" }, identity(false));
      renderAt(address);

      await screen.findByRole("heading", { level: 1, name: title });
      expectPageTitle(title);
      const vendor = screen.getByTestId(`${screenName}-vendor-card`);
      const staff = screen.getByTestId(`${screenName}-public-sector-card`);
      expect(vendor.parentElement).toBe(staff.parentElement);
      expect(vendor.parentElement?.className).toBe("us-choices");
      for (const [panel, name] of [
        [vendor, "Vendor"],
        [staff, "Public sector employee"],
      ] as const) {
        expect(panel.className).toBe("op-panel");
        const heading = within(panel).getByRole("heading", { level: 2, name });
        expect(heading.getAttribute("style")).toContain("--typography-bold-h4");
        expect(panel.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(within(panel).getByRole("button").closest(".op-actions")).toBeTruthy();
      }
      expect(main().querySelector(".bcds-react-aria-Button.primary")).toBeNull();
    });
  }

  it("puts the reason in place of the introduction when a page sent the person to sign in", async () => {
    resetSessionForTests({ status: "visitor" }, identity(false));
    renderAt("/sign-in?redirectOnSuccess=%2Fusers%2Fme");

    const alert = await screen.findByTestId("sign-in-required");
    expect(alert.textContent).toContain("Sign in to see your profile");
    expect(screen.queryByText("Choose the kind of account you sign in with.")).toBeNull();
    expect(within(screen.getByTestId("sign-in-vendor-card")).getByText("Sign in with your code-hosting account.")).toBeTruthy();
    expect(screen.getByTestId("sign-in-go-to-sign-up").getAttribute("href")).toBe("/sign-up");
  });
});

describe("Complete Your Profile in the direction", () => {
  it("lays the details out in the field grid, the terms with their links, and one primary action", async () => {
    resetSessionForTests({ status: "signed-in", account: unfinishedVendor }, identity(true));
    renderAt("/sign-up/complete");

    await screen.findByTestId("sign-up-complete-button");
    expectPageTitle("Complete Your Profile");
    const grid = screen.getByTestId("idp-username-field").parentElement;
    expect(grid?.className).toBe("us-fields");
    expect(screen.getByTestId("name-field").parentElement).toBe(grid);
    expect(screen.getByTestId("email-field").parentElement).toBe(grid);
    const terms = screen.getByTestId("sign-up-terms-checkbox").closest(".us-group");
    expect(within(terms as HTMLElement).getByRole("link", { name: "terms and conditions" })).toBeTruthy();
    expect(screen.getByTestId("sign-up-complete-button").closest(".op-actions")).toBeTruthy();
    expect(screen.getByText(/Agree to the terms and conditions and the privacy policy to complete/).className).toBe("op-note");
  });

  it("shows the error summary with its title, focused, in place of the introduction", async () => {
    resetSessionForTests({ status: "signed-in", account: unfinishedVendor }, identity(true));
    renderAt("/sign-up/complete");

    fireEvent.change(await screen.findByRole("textbox", { name: /Name/ }), { target: { value: "" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /I have read and agree/ }));
    await waitFor(() => expect(screen.getByTestId("sign-up-complete-button").hasAttribute("disabled")).toBe(false));
    fireEvent.click(screen.getByTestId("sign-up-complete-button"));

    const error = await screen.findByTestId("field-error");
    const summary = error.closest(".us-focus") as HTMLElement;
    expect(summary.textContent).toContain("Your profile has 1 problem");
    expect(document.activeElement).toBe(summary);
    expect(screen.queryByText("Confirm your details to finish creating your vendor account.")).toBeNull();
  });
});

describe("Signing out and the notices in the direction", () => {
  it("waits with the kit's status row while the service is asked", async () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => undefined)));
    resetSessionForTests({ status: "signed-in", account: { ...unfinishedVendor, acceptedTermsAt: "2026-01-05T17:00:00.000Z" } }, identity(true));
    renderAt("/sign-out");

    await screen.findByRole("heading", { level: 1, name: "Signing Out" });
    expectPageTitle("Signing Out");
    expect(within(main()).getByRole("status").className).toBe("op-wait");
    expect(within(main()).getByRole("status").textContent).toContain("Signing you out");
  });

  it("puts each notice's H1 and sentences in its region, and the actions after it", async () => {
    renderAt("/notice/authFailure");

    const notice = await screen.findByTestId("notice-sign-in-failed");
    expect(notice.className).toBe("op-region");
    expect(within(notice).getByRole("heading", { level: 1, name: "Sign in failed" })).toBeTruthy();
    const back = screen.getByTestId("notice-back-to-home");
    expect(notice.contains(back)).toBe(false);
    expect(back.closest(".op-actions")).toBe(screen.getByRole("link", { name: "Try signing in again" }).closest(".op-actions"));
  });
});
