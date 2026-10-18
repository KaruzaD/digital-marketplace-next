import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddendaTab, CancelDialog, HistoryTable, ReportingSection } from "../src/screens/opportunity-running";

/**
 * Running an opportunity after publication (slice 9), drawn as the catalogue's addenda-tab,
 * history-tab and cancel-confirm states draw it on every program's manage page.
 */
const addendum = {
  id: "a1",
  createdAt: "2026-09-20T17:00:00.000Z",
  createdBy: { id: "u1", name: "Test Public Servant" },
  description: "The kick-off meeting will be held by video, not in person.",
};

describe("running an opportunity after publication", () => {
  it("lists each addendum under its day with who added it, then the form in the kit's region", () => {
    render(<AddendaTab addenda={[addendum]} mayAdd announced onAdd={async () => null} />);
    expect(screen.getByRole("heading", { name: "Addendum of September 20, 2026" })).toBeTruthy();
    expect(screen.getByText("Added by Test Public Servant").className).toBe("op-note");
    const form = screen.getByTestId("addendum-add-button").closest("form");
    expect(form?.className).toContain("op-region");
    expect(screen.getByTestId("addendum-add-button").parentElement?.className).toBe("op-actions");
    expect(within(form as HTMLElement).getByText(/Everyone watching this opportunity/).className).toBe("op-text");
  });

  it("offers no form to someone who may not add one, and says nobody is emailed once cancelled", () => {
    const { unmount } = render(<AddendaTab addenda={[]} mayAdd={false} announced onAdd={async () => null} />);
    expect(screen.queryByTestId("addendum-add-button")).toBeNull();
    expect(screen.getByText("No addenda have been added.")).toBeTruthy();
    unmount();
    render(<AddendaTab addenda={[]} mayAdd announced={false} onAdd={async () => null} />);
    expect(screen.getByText(/Nobody is emailed, because this opportunity has been cancelled/)).toBeTruthy();
  });

  it("sends the addendum and clears the field once it is accepted (R-1.32)", async () => {
    const onAdd = vi.fn(async () => null);
    render(<AddendaTab addenda={[]} mayAdd announced onAdd={onAdd} />);
    const field = screen.getByTestId("addendum-text-field").querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(field, { target: { value: "Questions close a week early." } });
    fireEvent.click(screen.getByTestId("addendum-add-button"));
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith("Questions close a week early."));
    await waitFor(() => expect(field.value).toBe(""));
  });

  it("shows a note's files against it in the history (R-1.33)", () => {
    render(
      <HistoryTable
        history={[
          {
            createdAt: "2026-09-21T17:00:00.000Z",
            createdBy: { id: "u1", name: "Test Public Servant" },
            status: null,
            event: "NOTE_ADDED",
            note: "Confirmed the budget with the finance office.",
            attachments: [{ id: "f1", name: "budget-approval.pdf" }],
          },
        ]}
      />,
    );
    const row = screen.getAllByRole("row")[1] as HTMLElement;
    const cells = within(row).getAllByRole("cell");
    expect(cells[1]?.textContent).toBe("Note");
    expect(cells[2]?.textContent).toBe("Test Public Servant");
    expect(row.textContent).toContain("Confirmed the budget with the finance office. Attachment: budget-approval.pdf");
    expect(within(row).getByRole("link", { name: "budget-approval.pdf" })).toBeTruthy();
  });

  it("puts the cancellation's words and note in the kit's dialog body (R-1.28, R-1.36)", () => {
    render(<CancelDialog isOpen isSending={false} onKeep={() => {}} onConfirm={() => {}} />);
    const dialog = screen.getByTestId("opportunity-cancel-dialog");
    const words = within(dialog).getByText(/It will stop accepting proposals/);
    expect(words.className).toBe("op-text");
    expect(words.parentElement?.className).toBe("op-dialog");
    expect(within(dialog).getByTestId("opportunity-cancel-note-field").parentElement?.className).toBe("op-dialog");
  });

  it("shows the three reporting figures once published, and says they wait for publication before then (R-1.30)", () => {
    const { unmount } = render(<ReportingSection reporting={{ numViews: 342, numWatchers: 12, numProposals: 5 }} unpublished={false} />);
    expect(screen.getByTestId("reporting-views").textContent).toBe("342");
    expect(screen.getByTestId("reporting-watchers").textContent).toBe("12");
    expect(screen.getByTestId("reporting-proposals").textContent).toBe("5");
    unmount();
    render(<ReportingSection reporting={undefined} unpublished />);
    expect(screen.queryByTestId("reporting-views")).toBeNull();
    expect(screen.getByText(/counted once the opportunity is published/)).toBeTruthy();
  });
});
