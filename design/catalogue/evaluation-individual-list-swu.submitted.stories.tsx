import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { IndividualListTab } from "./evaluation-pages";

// evaluation-individual-list-swu · submitted — the evaluator has submitted; each evaluation can be read but not changed,
// and consensus begins by itself once every evaluator has submitted (R-5.24, R-5.27)
const meta: Meta = { title: "evaluation/evaluation-individual-list-swu/submitted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Submitted: StoryObj = { render: () => <IndividualListTab p={SWU} state="submitted" /> };
