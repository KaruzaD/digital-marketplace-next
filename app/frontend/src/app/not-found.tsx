import { Link } from "@bcgov/design-system-react-components";
import { Actions, OpportunityPage, PageTitle } from "./opportunity-kit";
import { useScreenTitle } from "./screen-title";

/**
 * The shared missing page, as the catalogue's `MissingPage` draws it. It never says "not
 * allowed".
 *
 * It is shown for an address no page holds and for an address that is not well formed, which
 * look the same to a person (R-7.2, R-7.3), and for every other address the app does not
 * answer for.
 */
export function NotFound() {
  useScreenTitle("Page not found");
  return (
    <OpportunityPage testId="not-found-page">
      <PageTitle>Page not found</PageTitle>
      <p className="op-text">The page you are looking for does not exist.</p>
      <Actions>
        <Link href="/" isButton buttonVariant="primary">
          Back to home
        </Link>
      </Actions>
    </OpportunityPage>
  );
}
