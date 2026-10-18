import { useEffect, useState } from "react";
import { OpportunityPage, PageTitle } from "../app/opportunity-kit";
import { useScreenTitle } from "../app/screen-title";

/**
 * `/status` as a browser opens it (scheduled-transition-trigger), drawn as its story draws it: the
 * opportunity kit's page with its H1 and one sentence. The web server hands a browser's page request
 * here and every other request to the service (decision record 0060); the screen then asks the
 * service's own `/status`, which runs the deadline hook in front of it (R-1.1), and says whether the
 * service answered. It shows nothing about what closed, as the story does not.
 */
type Reading = "asking" | "up" | "down";

export function ServiceStatusScreen() {
  useScreenTitle("Service status");
  const [reading, setReading] = useState<Reading>("asking");

  useEffect(() => {
    let current = true;
    void fetch("/status", { headers: { accept: "text/plain" } })
      .then((answer) => (current ? setReading(answer.ok ? "up" : "down") : undefined))
      .catch(() => (current ? setReading("down") : undefined));
    return () => {
      current = false;
    };
  }, []);

  return (
    <OpportunityPage testId="service-status-page">
      <PageTitle>Service status</PageTitle>
      <div role="status">
        {reading === "asking" ? (
          <p className="op-text">Checking the service…</p>
        ) : (
          <p className="op-text" data-testid="service-status-message">
            {reading === "up" ? "The Digital Marketplace is up." : "The Digital Marketplace is not answering."}
          </p>
        )}
      </div>
    </OpportunityPage>
  );
}
