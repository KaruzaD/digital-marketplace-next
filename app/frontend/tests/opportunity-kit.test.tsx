import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable, Details, OpportunityHead, StatusLabel, statusColour } from "../src/app/opportunity-kit";

/** The opportunity screens' shared pieces, as design/catalogue/opportunity-kit.tsx draws them. */
describe("the opportunity kit", () => {
  it("colours only a status, by its words", () => {
    expect(statusColour("Draft")).toBe("grey");
    expect(statusColour("Completed")).toBe("grey");
    expect(statusColour("Open")).toBe("green");
    expect(statusColour("Published")).toBe("green");
    expect(statusColour("Awarded")).toBe("green");
    expect(statusColour("Cancelled")).toBe("red");
    expect(statusColour("Canceled")).toBe("red");
    expect(statusColour("Under review")).toBe("yellow");
    expect(statusColour("Team questions: individual evaluation")).toBe("yellow");
    expect(statusColour("Processing")).toBe("yellow");
  });

  it("says the status in words on the label that carries opportunity-status", () => {
    render(<StatusLabel>Published</StatusLabel>);
    const label = screen.getByTestId("opportunity-status");
    expect(label.textContent).toBe("Published");
    expect(label.className).toBe("dm-label dm-label-green");
  });

  it("shows an opportunity's facts in the fixed order, only those it is given", () => {
    render(
      <OpportunityHead
        program="team-with-us"
        status="Open"
        title="Data platform team"
        closes={{ text: "October 2, 2030", testId: "deadline" }}
        value={{ label: "Maximum budget", text: "$400,000" }}
        remoteOk
      />,
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Data platform team");
    const facts = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(facts).toEqual(["Closes October 2, 2030", "Maximum budget $400,000", "Remote OK"]);
    expect(screen.getByTestId("deadline").textContent).toBe("October 2, 2030");
    expect(screen.getByText("Team With Us")).toBeTruthy();
  });

  it("lists details as terms and values, and a table in a region named by its caption", () => {
    render(
      <>
        <Details items={[{ term: "Opportunity ID", value: "abc", testId: "id" }]} />
        <DataTable captionId="c" caption="Opportunities you created" columns={["Title"]} testId="table">
          <tr>
            <td>One</td>
          </tr>
        </DataTable>
      </>,
    );
    expect(screen.getByTestId("id").textContent).toBe("abc");
    const region = screen.getByRole("region", { name: "Opportunities you created" });
    expect(within(region).getByTestId("table").tagName).toBe("TABLE");
    expect(within(region).getByRole("columnheader").textContent).toBe("Title");
  });
});
