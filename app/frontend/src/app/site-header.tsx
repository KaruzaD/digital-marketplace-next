import { useEffect, useId, useState } from "react";
import {
  Button,
  Header,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Subheader,
  SvgChevronDownIcon,
  SvgCloseIcon,
  Text,
} from "@bcgov/design-system-react-components";
import { mayManagePages } from "@rules/content";
import type { Account } from "../api/accounts";
import { useSession } from "../auth/session";

/**
 * The banner every screen carries, as `design/catalogue/site.tsx` draws it.
 *
 * It names the service, leads back to its home page, and offers the service's sections and the
 * way in or out: signing in and signing up to a visitor, and the dashboard, the person's own
 * profile and signing out to somebody signed in (R-4.17). An administrator alone is offered the
 * list of users (R-4.14) and the content area (R-7.6). Wide screens show the sections in a row
 * under the banner and the account actions in a menu; narrow ones put both behind a Menu button.
 */

// Below this width the navigation and the account actions move behind the Menu button
// (design/catalogue/site.tsx). No token carries it.
const NARROW = "(max-width: 767.98px)";

function narrowNow(): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(NARROW).matches;
}

/**
 * Whether the window is narrower than the header's switch point. Read in script rather than in a
 * style sheet so only one header is ever in the document: two copies, one hidden, would give each
 * account action two test IDs.
 */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(narrowNow);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(NARROW);
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return narrow;
}

export type Section = "home" | "dashboard" | "opportunities" | "organizations" | "users" | "content";

export const SECTIONS: Readonly<Record<Section, { label: string; href: string }>> = {
  home: { label: "Home", href: "/" },
  dashboard: { label: "Dashboard", href: "/dashboard" },
  opportunities: { label: "Opportunities", href: "/opportunities" },
  organizations: { label: "Organizations", href: "/organizations" },
  users: { label: "Users", href: "/users" },
  content: { label: "Content", href: "/content" },
};

type Viewer = Pick<Account, "type"> | null;

/**
 * Everyone is offered Home, Opportunities and Organizations; a signed-in person's first item is
 * their Dashboard, and an administrator also manages Users and Content.
 */
export function sectionsFor(viewer: Viewer): Section[] {
  if (!viewer) return ["home", "opportunities", "organizations"];
  const sections: Section[] = ["dashboard", "opportunities", "organizations"];
  if (viewer.type === "ADMIN") sections.push("users");
  if (mayManagePages(viewer)) sections.push("content");
  return sections;
}

/** A signed-in person's own pages. My Organizations is offered to vendors only. */
export function accountLinksFor(viewer: Pick<Account, "type">): { label: string; href: string }[] {
  return [
    { label: "My Profile", href: "/users/me" },
    ...(viewer.type === "VENDOR" ? [{ label: "My Organizations", href: "/users/me?tab=organizations" }] : []),
    { label: "Sign Out", href: "/sign-out" },
  ];
}

/**
 * The section a screen belongs to, so the navigation can mark it. A content page read at its own
 * address belongs to no section: it is the service's prose, not the managing of it.
 */
export function sectionOf(pathname: string): Section | undefined {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  const [, first, second, third] = path.split("/");
  if (first === "dashboard") return "dashboard";
  if (first === "opportunities") return "opportunities";
  if (first === "organizations") return "organizations";
  if (first === "users") return second === "me" ? undefined : "users";
  if (first === "content" && (second === undefined || second === "create" || third === "edit")) return "content";
  return undefined;
}

// The design system ships no menu icon, so the three bars are drawn here in the text colour of
// the button they sit in.
function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M1 3h14v1.5H1zM1 7.25h14v1.5H1zM1 11.5h14V13H1z" fill="currentColor" />
    </svg>
  );
}

type HeaderProps = {
  current?: Section;
  /** Where the screen is, so the phone menu closes when the screen changes. */
  pathname?: string;
  // A page whose contract names its own sign-in and sign-up actions (the home page) passes their
  // test IDs here: on every screen those actions are the header's.
  signInTestId?: string;
  signUpTestId?: string;
};

type ShownViewer =
  | { readonly kind: "starting" }
  | { readonly kind: "visitor" }
  | { readonly kind: "signed-in"; readonly account: Account };

function useViewer(): ShownViewer {
  const session = useSession();
  if (session.status === "signed-in") return { kind: "signed-in", account: session.account };
  // Until the service has said who this is, no account action is offered, so a signed-in
  // person is not shown Sign In for a moment.
  if (session.status === "starting") return { kind: "starting" };
  return { kind: "visitor" };
}

/** What the account menu's button says: the person's email, or their name if they have none. */
function accountLabel(account: Account): string {
  return account.email || account.name || "Your account";
}

export function SiteHeader(props: HeaderProps) {
  const viewer = useViewer();
  return useNarrow() ? <PhoneHeader viewer={viewer} {...props} /> : <DesktopHeader viewer={viewer} {...props} />;
}

type ShellProps = HeaderProps & { viewer: ShownViewer };

function sectionsShown(viewer: ShownViewer): Section[] {
  return sectionsFor(viewer.kind === "signed-in" ? viewer.account : null);
}

function VisitorActions({ signInTestId, signUpTestId }: Pick<HeaderProps, "signInTestId" | "signUpTestId">) {
  return (
    <>
      <Link href="/sign-in" isButton buttonVariant="tertiary" size="medium" data-testid={signInTestId}>
        Sign In
      </Link>
      <Link href="/sign-up" isButton buttonVariant="secondary" size="medium" data-testid={signUpTestId}>
        Sign Up
      </Link>
    </>
  );
}

// Wide screens: the logo, the service's name and the account area on the first row; the
// navigation, separated by the Subheader's dividers, on the second. Sign In is tertiary and Sign
// Up secondary, so each page's own main action stays its only primary button.
function DesktopHeader({ viewer, current, signInTestId, signUpTestId }: ShellProps) {
  return (
    <div className="site-header" data-testid="site-header">
      <Header title="Digital Marketplace">
        {viewer.kind === "visitor" ? (
          <div className="site-account">
            <VisitorActions signInTestId={signInTestId} signUpTestId={signUpTestId} />
          </div>
        ) : viewer.kind === "signed-in" ? (
          // The design system's Menu: Enter, Space or a click opens it, the arrow keys move
          // through it, and Escape closes it and returns focus to the button.
          <MenuTrigger>
            <Button variant="tertiary" size="medium">
              {accountLabel(viewer.account)}
              <SvgChevronDownIcon />
            </Button>
            <Menu placement="bottom end">
              {accountLinksFor(viewer.account).map((link) => (
                <MenuItem key={link.href} id={link.href} href={link.href}>
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
          </MenuTrigger>
        ) : null}
      </Header>
      <Subheader ariaLabel="Main">
        {sectionsShown(viewer).map((section) => (
          <Link
            key={section}
            href={SECTIONS[section].href}
            isButton
            buttonVariant="tertiary"
            size="small"
            aria-current={section === current ? "page" : undefined}
          >
            {SECTIONS[section].label}
          </Link>
        ))}
      </Subheader>
    </div>
  );
}

// Narrow screens: the design system's phone header, the logo and a Menu button that says what it
// does. The open menu repeats the service's name, lists the navigation, then the account actions.
// Escape closes it and returns focus to the button.
function PhoneHeader({ viewer, current, pathname, signInTestId, signUpTestId }: ShellProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      document.getElementById(toggleId)?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, toggleId]);

  return (
    <div className="site-header" data-testid="site-header">
      <Header>
        <div className="site-menu-toggle">
          <Button
            id={toggleId}
            variant="secondary"
            size="medium"
            aria-expanded={open}
            aria-controls={menuId}
            onPress={() => setOpen((wasOpen) => !wasOpen)}
          >
            {open ? <SvgCloseIcon /> : <MenuIcon />}
            {open ? "Close" : "Menu"}
          </Button>
        </div>
      </Header>
      <div id={menuId} className="site-menu" hidden={!open}>
        <p className="site-menu-name">Digital Marketplace</p>
        <nav aria-label="Main">
          <ul>
            {sectionsShown(viewer).map((section) => (
              <li key={section}>
                <Link
                  href={SECTIONS[section].href}
                  isButton
                  buttonVariant="tertiary"
                  size="small"
                  aria-current={section === current ? "page" : undefined}
                >
                  {SECTIONS[section].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {viewer.kind === "starting" ? null : (
          <div className="site-menu-account">
            {viewer.kind === "visitor" ? (
              <VisitorActions signInTestId={signInTestId} signUpTestId={signUpTestId} />
            ) : (
              <>
                <Text elementType="p" size="small" color="secondary">
                  Signed in as {accountLabel(viewer.account)}
                </Text>
                <nav aria-label="Account">
                  <ul>
                    {accountLinksFor(viewer.account).map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} isButton buttonVariant="tertiary" size="small">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
