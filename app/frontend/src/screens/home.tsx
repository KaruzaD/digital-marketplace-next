import { useEffect, useState } from "react";
import { Heading, Link, ProgressCircle, Text, TextField } from "@bcgov/design-system-react-components";
import { groupedForList } from "@rules/opportunity-list";
import { LIST_RETRY_DELAYS_MS, ListedOpportunity, listAllOpportunities } from "../api/opportunity-list";
import { AwardedFigures, fetchAwardedFigures } from "../api/watching";
import { Label, MarketplaceStyles, OpportunityRows, ProgramPanels, RowOpportunity, look } from "../app/marketplace";
import { useScreenTitle } from "../app/screen-title";
import { deadlineLabel, rewardLabel } from "./opportunity-parts";

/**
 * The home page, as `design/catalogue/home-page.tsx` draws it (home.default, home.loading).
 *
 * The search and the open opportunities first, then the three program panels, what has been
 * awarded through the service, the two paths, the testimonials and a closing line. The page's own
 * words are drawn at once; the open opportunities (the three programs' lists) and the awarded
 * figures (`/api/metrics`) are each shown loading until they arrive. Sign In and Sign Up are the
 * header's, which carries the home page's test IDs for them here (`../app/root-layout`).
 */

// The page's regions are `huge` apart, its items `large` apart (`medium` on a narrow screen), and
// the lines of a path or a quotation `small` apart. Every item's own margins are removed, so the
// gap is the only spacing.
const css = `
.home-regions, .home-opening, .home-paths, .home-path, .home-path-items, .home-quote {
  display: flex;
  flex-direction: column;
}
.home-regions > *, .home-opening > *, .home-paths > *, .home-path > *, .home-path-items > *, .home-quote > *,
.home-quote blockquote > p, .home-closing > * {
  margin: var(--layout-margin-none);
}
.home-regions { gap: var(--layout-margin-huge); }
.home-opening { gap: var(--layout-margin-large); }
.home-intro { font: var(--typography-regular-body); color: var(--typography-color-secondary); }
.home-count { display: flex; align-items: center; gap: var(--layout-margin-small); }
.home-search > * { width: 100%; }
.home-browse { display: flex; }
.home-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: var(--layout-margin-xlarge);
  row-gap: var(--layout-margin-small);
  padding: var(--layout-padding-medium);
  background-color: var(--surface-color-background-light-gray);
}
.home-stat { display: flex; align-items: center; gap: var(--layout-margin-small); margin: var(--layout-margin-none); }
.home-stat-figure { font: var(--typography-bold-h4); color: var(--typography-color-primary); }
.home-stat-label { font: var(--typography-regular-label); color: var(--typography-color-secondary); text-transform: uppercase; }
.home-paths { gap: var(--layout-margin-large); }
.home-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--layout-margin-xlarge);
}
.home-path, .home-path-items, .home-quote { gap: var(--layout-margin-small); }
.home-path-intro { font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.home-path-items dt { font: var(--typography-bold-small-body); color: var(--typography-color-primary); }
.home-path-items dd { font: var(--typography-regular-small-body); color: var(--typography-color-primary); }
.home-quote { margin: var(--layout-margin-none); }
.home-quote blockquote { font: var(--typography-regular-small-body); color: var(--typography-color-primary); }
.home-quote figcaption { font: var(--typography-bold-small-body); color: var(--typography-color-secondary); }
.home-closing { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-large); }
.home-closing > h2 { flex: 1 1 320px; }
@media (max-width: 767.98px) {
  .home-opening { gap: var(--layout-margin-medium); }
  .home-intro { font: var(--typography-regular-small-body); }
  .home-browse > a, .home-closing > a { flex: 1 1 100%; justify-content: center; }
}
`;

const VENDORS = [
  ["Submit proposals to open opportunities", "Save a draft version of your proposal until you are ready to submit it."],
  [
    "View and export your submitted proposals",
    "View all outstanding and past submissions, where you can see your scores and rankings once submitted.",
  ],
  ["Build your team", "Add team members to your organization."],
];

const EMPLOYEES = [
  [
    "Post a new opportunity",
    "Select the program that suits your unique needs, post your opportunity and wait for the proposals to come in.",
  ],
  [
    "View and manage your posted opportunities",
    "View a complete history of your posted opportunities, where you can review and evaluate all received proposals, award the opportunity to the successful proponent, and more.",
  ],
];

const QUOTES = [
  {
    text: "“We quickly found a qualified developer, worked collaboratively in the open, and got a great final product.”",
    by: "Andy, Environmental Analyst · Province of B.C.",
  },
  {
    text: "“I think this platform could be a game changer for matching government agencies with the best talent in this province.”",
    by: "Wayne, Developer · Vancouver",
  },
];

/** An open opportunity as the home page's rows show it: open to everyone, so its status is Open. */
export function asOpenRow(opportunity: ListedOpportunity): RowOpportunity {
  return {
    id: opportunity.id,
    program: opportunity.program,
    title: opportunity.title,
    summary: opportunity.teaser,
    status: { label: "Open", colour: "green" },
    closed: false,
    deadline: deadlineLabel(opportunity.proposalDeadline),
    value: rewardLabel(opportunity.value.amount),
    location: opportunity.location,
    remoteOk: opportunity.remoteOk,
  };
}

/** The opportunities accepting proposals now, nearest proposal deadline first (R-1.38). */
export function openOpportunities(opportunities: readonly ListedOpportunity[], now: Date): ListedOpportunity[] {
  return groupedForList(opportunities, now).open;
}

function Path({ id, name, intro, items }: { id: string; name: string; intro: string; items: string[][] }) {
  return (
    <section className="home-path" aria-labelledby={id}>
      <Heading level={3} id={id} style={look.section}>
        {name}
      </Heading>
      <p className="home-path-intro">{intro}</p>
      <dl className="home-path-items">
        {items.flatMap(([term, description]) => [<dt key={`${term}-t`}>{term}</dt>, <dd key={`${term}-d`}>{description}</dd>])}
      </dl>
    </section>
  );
}

function Waiting({ label }: { label: string }) {
  return (
    <div className="home-count" role="status">
      <ProgressCircle isIndeterminate aria-label={label} />
      <Text>{label}…</Text>
    </div>
  );
}

type Opportunities =
  | { readonly kind: "loading" }
  | { readonly kind: "read"; readonly open: readonly ListedOpportunity[] | null };

type Figures = { readonly kind: "loading" } | { readonly kind: "read"; readonly figures: AwardedFigures | null };

export function HomeScreen() {
  useScreenTitle("Digital Marketplace");
  const [opportunities, setOpportunities] = useState<Opportunities>({ kind: "loading" });
  const [figures, setFigures] = useState<Figures>({ kind: "loading" });

  useEffect(() => {
    let current = true;
    void fetchAwardedFigures().then((read) => {
      if (current) setFigures({ kind: "read", figures: read });
    });
    // Open opportunities are published ones, which everyone reads, so who is asking does not
    // change what is shown here.
    void listAllOpportunities(LIST_RETRY_DELAYS_MS).then((answer) => {
      if (current)
        setOpportunities({
          kind: "read",
          open: answer.kind === "listed" ? openOpportunities(answer.opportunities, new Date()) : null,
        });
    });
    return () => {
      current = false;
    };
  }, []);

  return (
    <>
      <MarketplaceStyles />
      <style>{css}</style>
      <div className="home-regions" data-testid="home-page">
        <section className="home-opening" aria-labelledby="home-heading">
          <Heading level={1} id="home-heading" style={look.page}>
            Discover Unique Opportunities to Collaborate with the B.C. Public Sector.
          </Heading>
          <p className="home-intro">
            The Digital Marketplace is a new platform that will help build an ecosystem of innovation and collaboration
            between tech entrepreneurs and B.C.'s public sector.
          </p>
          <form className="home-search" role="search" action="/opportunities">
            <TextField type="search" name="q" label="Search by Title or Location" />
          </form>
          <Heading level={2} className="home-count" style={look.section}>
            Open Opportunities
            {opportunities.kind === "read" && opportunities.open ? <Label>{opportunities.open.length}</Label> : null}
          </Heading>
          {opportunities.kind === "loading" ? (
            <Waiting label="Loading opportunities" />
          ) : opportunities.open === null ? (
            <Text elementType="p">The open opportunities could not be loaded. Reload the page to try again.</Text>
          ) : opportunities.open.length === 0 ? (
            <Text elementType="p">No opportunities are accepting proposals.</Text>
          ) : (
            <OpportunityRows opportunities={opportunities.open.map(asOpenRow)} titleLevel={3} />
          )}
          <div className="home-browse">
            <Link href="/opportunities" isButton buttonVariant="primary" data-testid="home-browse-opportunities">
              Browse Opportunities
            </Link>
          </div>
        </section>

        <ProgramPanels headingLevel={2} />

        <div className="home-stats">
          {figures.kind === "loading" ? (
            <Waiting label="Loading figures" />
          ) : figures.figures === null ? (
            <Text elementType="p">The figures could not be loaded. Reload the page to try again.</Text>
          ) : (
            <>
              <p className="home-stat">
                <span className="home-stat-figure" data-testid="home-awarded-count">
                  {figures.figures.count.toLocaleString("en-CA")}
                </span>
                <span className="home-stat-label">Total Opportunities Awarded</span>
              </p>
              <p className="home-stat">
                <span className="home-stat-figure" data-testid="home-awarded-value">
                  {`$${figures.figures.value.toLocaleString("en-CA")}`}
                </span>
                <span className="home-stat-label">Total Value of All Opportunities</span>
              </p>
            </>
          )}
        </div>

        <section className="home-paths" aria-labelledby="home-paths-heading">
          <Heading level={2} id="home-paths-heading" style={look.section}>
            Join a community of developers, entrepreneurs and public service innovators who are making public services
            better.
          </Heading>
          <div className="home-columns">
            <Path
              id="home-vendors"
              name="Vendors"
              intro="Collaborate with the B.C. Public Sector to build innovative digital products."
              items={VENDORS}
            />
            <Path
              id="home-employees"
              name="Public Service Employees"
              intro="Connect with talented developers to build your digital products."
              items={EMPLOYEES}
            />
          </div>
        </section>

        <div className="home-columns">
          {QUOTES.map((quote) => (
            <figure key={quote.by} className="home-quote">
              <blockquote>
                <p>{quote.text}</p>
              </blockquote>
              <figcaption>{quote.by}</figcaption>
            </figure>
          ))}
        </div>

        <section className="home-closing" aria-labelledby="home-closing-heading">
          <Heading level={2} id="home-closing-heading" style={look.section}>
            Check out the latest opportunities on the Digital Marketplace
          </Heading>
          <Link href="/opportunities" isButton buttonVariant="secondary">
            Browse Opportunities
          </Link>
        </section>
      </div>
    </>
  );
}
