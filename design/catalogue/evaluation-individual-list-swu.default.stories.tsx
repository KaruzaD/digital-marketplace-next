import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { IndividualListTab } from "./evaluation-pages";

// evaluation-individual-list-swu · default — an evaluator part-way through: one proponent complete, one incomplete, one
// not started. Submission is not offered until every proponent has a complete evaluation (R-5.25, R-5.35)
const meta: Meta = { title: "evaluation/evaluation-individual-list-swu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <IndividualListTab p={SWU} state="default" /> };
