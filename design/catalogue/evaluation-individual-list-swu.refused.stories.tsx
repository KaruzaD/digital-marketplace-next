import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { IndividualListTab } from "./evaluation-pages";

// evaluation-individual-list-swu · refused — the service found an incomplete evaluation in the set and submitted none of
// it, and says so in its own words. Here the panel's questions changed after the list was loaded (R-5.25, R-5.27 note)
const meta: Meta = { title: "evaluation/evaluation-individual-list-swu/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = { render: () => <IndividualListTab p={SWU} state="refused" /> };
