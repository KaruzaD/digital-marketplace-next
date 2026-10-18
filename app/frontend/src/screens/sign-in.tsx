import { useEffect } from "react";
import { Button, InlineAlert, Link } from "@bcgov/design-system-react-components";
import { useSearch } from "@tanstack/react-router";
import { DASHBOARD, returnPathFrom } from "@rules/sign-in";
import { Actions, PageTitle, Panel } from "../app/opportunity-kit";
import { Choices, UserPage } from "../app/user-kit";
import { useScreenTitle } from "../app/screen-title";
import { beginSignIn, useSession } from "../auth/session";
import { useGoTo } from "../app/go-to";

type Provider = "vendor" | "public-sector";

/** The page sign-in began from, carried on the sign-in address (R-4.22). */
function useReturnPath(): string | null {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  return returnPathFrom(search.redirectOnSuccess);
}

/** A person who is already signed in has nothing to do here, and goes on to their dashboard. */
function useOnwardIfSignedIn(returnTo: string | null): void {
  const session = useSession();
  const goTo = useGoTo();
  useEffect(() => {
    if (session.status === "signed-in") {
      goTo(returnTo ?? DASHBOARD);
    }
  }, [session.status, returnTo, goTo]);
}

/**
 * Said when a page that needs signing in sent the person here (user-profile-self ·
 * sign-in-required): they will be brought back to it afterwards (R-4.17, R-4.22).
 */
function SignInRequired({ returnTo }: { returnTo: string }) {
  const [path, query = ""] = returnTo.split("#")[0]?.split("?") ?? [];
  const toProfile = path?.startsWith("/users/") ?? false;
  // Arriving from the unsubscribe offer in a message (notification-unsubscribe-landing ·
  // sign-in-required): the change applies to whoever signs in (R-6.7).
  const toUnsubscribe = toProfile && new URLSearchParams(query).has("unsubscribe");
  const [title, description] = toUnsubscribe
    ? [
        "Sign in to unsubscribe",
        "Once you have signed in you will be taken to your notification settings and asked to confirm. The change applies to the account you sign in with.",
      ]
    : toProfile
      ? ["Sign in to see your profile", "Once you have signed in you will be taken back to your profile."]
      : ["Sign in to see that page", "Once you have signed in you will be taken back to the page you were on."];
  return (
    <div data-testid="sign-in-required">
      <InlineAlert variant="info" role="status" title={title} description={description} />
    </div>
  );
}

/** One kind of account: a bordered panel with its H2, a sentence and its one secondary button. */
function Choice({
  screen,
  provider,
  title,
  text,
  action,
  onChoose,
}: {
  screen: "sign-in" | "sign-up";
  provider: Provider;
  title: string;
  text: string;
  action: string;
  onChoose: (provider: Provider) => void;
}) {
  return (
    <Panel id={`${screen}-${provider}-heading`} title={title} testId={`${screen}-${provider}-card`}>
      <p className="op-text">{text}</p>
      <Actions>
        <Button variant="secondary" data-testid={`${screen}-${provider}-button`} onPress={() => onChoose(provider)}>
          {action}
        </Button>
      </Actions>
    </Panel>
  );
}

/**
 * Sign In (user-sign-in · default, and user-profile-self · sign-in-required when a page sent the
 * person here). One panel for each way in; which one a person uses decides the kind of account a
 * first sign-in makes (R-4.1). Two equal secondary choices and no primary button.
 */
export function SignInScreen() {
  useScreenTitle("Sign In");
  const returnTo = useReturnPath();
  useOnwardIfSignedIn(returnTo);
  const signInAs = (provider: Provider) => {
    void beginSignIn({ provider, returnTo });
  };

  // Sent here by a page: the alert says why in place of the introduction, and the panels say
  // only how each way in signs in, as the sign-in-required story draws them.
  return (
    <UserPage>
      <PageTitle>Sign In</PageTitle>
      {returnTo ? (
        <SignInRequired returnTo={returnTo} />
      ) : (
        <p className="op-text">Choose the kind of account you sign in with.</p>
      )}
      <Choices>
        <Choice
          screen="sign-in"
          provider="vendor"
          title="Vendor"
          text={
            returnTo
              ? "Sign in with your code-hosting account."
              : "Sign in with your code-hosting account to register organizations and submit proposals."
          }
          action="Sign in as a vendor"
          onChoose={signInAs}
        />
        <Choice
          screen="sign-in"
          provider="public-sector"
          title="Public sector employee"
          text={
            returnTo
              ? "Sign in with your government account."
              : "Sign in with your government account to create and manage opportunities."
          }
          action="Sign in as a public sector employee"
          onChoose={signInAs}
        />
      </Choices>
      <p className="op-text">
        Don’t have an account?{" "}
        <Link href="/sign-up" data-testid="sign-in-go-to-sign-up">
          Sign up
        </Link>
      </p>
    </UserPage>
  );
}

/**
 * Choose Account Type (user-sign-up-choose-account · default). Signing up is signing in for
 * the first time: the account is made then, and its kind follows the identity used (R-4.1).
 */
export function SignUpScreen() {
  useScreenTitle("Choose Account Type");
  const returnTo = useReturnPath();
  useOnwardIfSignedIn(returnTo);
  const signUpAs = (provider: Provider) => {
    void beginSignIn({ provider, returnTo });
  };

  return (
    <UserPage>
      <PageTitle>Choose Account Type</PageTitle>
      <p className="op-text">
        Your account is created the first time you sign in. The kind of account you get depends on how you sign in.
      </p>
      <Choices>
        <Choice
          screen="sign-up"
          provider="vendor"
          title="Vendor"
          text="For people who want to register organizations and submit proposals. You sign up with your code-hosting account."
          action="Sign up as a vendor"
          onChoose={signUpAs}
        />
        <Choice
          screen="sign-up"
          provider="public-sector"
          title="Public sector employee"
          text="For public sector staff who create and manage opportunities. You sign up with your government account."
          action="Sign up as a public sector employee"
          onChoose={signUpAs}
        />
      </Choices>
      <p className="op-text">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </UserPage>
  );
}
