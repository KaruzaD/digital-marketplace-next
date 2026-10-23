import { Link } from "@bcgov/design-system-react-components";
import { NotFound } from "../app/not-found";
import { Actions, PageTitle } from "../app/opportunity-kit";
import { UserPage } from "../app/user-kit";
import { useScreenTitle } from "../app/screen-title";

/** The notices the service defines; any other name is not found (surface.yaml, user-notice). */
export type NoticeId = "deactivatedOwnAccount" | "authFailure";

export function isNoticeId(value: string): value is NoticeId {
  return value === "deactivatedOwnAccount" || value === "authFailure";
}

/**
 * Notice (user-notice). `authFailure` is where every refused sign-in lands, and it names no
 * cause: an unrecognised identity, an account an administrator deactivated and an email address
 * another account holds all read the same (R-4.1, R-4.4, R-4.6). `deactivatedOwnAccount`
 * confirms a person's own deactivation (R-4.9). Each notice's test ID is on the region holding
 * its H1 and sentences; the actions follow it, with one primary.
 */
export function NoticeScreen({ noticeId }: { noticeId: string }) {
  if (!isNoticeId(noticeId)) return <NotFound />;
  return noticeId === "authFailure" ? <SignInFailed /> : <DeactivatedOwnAccount />;
}

function SignInFailed() {
  useScreenTitle("Sign in failed");
  return (
    <UserPage>
      <div className="op-region" data-testid="notice-sign-in-failed">
        <PageTitle>Sign in failed</PageTitle>
        <p className="op-text">We could not sign you in. Please try again.</p>
      </div>
      <Actions>
        <Link href="/sign-in" isButton buttonVariant="primary">
          Try signing in again
        </Link>
        <Link href="/" isButton buttonVariant="secondary" data-testid="notice-back-to-home">
          Back to home
        </Link>
      </Actions>
    </UserPage>
  );
}

function DeactivatedOwnAccount() {
  useScreenTitle("Your account has been deactivated");
  return (
    <UserPage>
      <div className="op-region" data-testid="notice-deactivated-own-account">
        <PageTitle>Your account has been deactivated</PageTitle>
        <p className="op-text">You have deactivated your Digital Marketplace account and have been signed out.</p>
        <p className="op-text">You can reactivate your account at any time by signing in again.</p>
      </div>
      <Actions>
        <Link href="/" isButton buttonVariant="primary" data-testid="notice-back-to-home">
          Back to home
        </Link>
      </Actions>
    </UserPage>
  );
}
