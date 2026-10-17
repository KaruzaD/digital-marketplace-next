import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualListTab } from "./evaluation-pages";

// evaluation-individual-list-twu · ready — every proponent has a complete draft, so the evaluator may submit the whole
// set; there is no way to submit one evaluation on its own (R-5.25, R-5.26)
const meta: Meta = { title: "evaluation/evaluation-individual-list-twu/ready", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Ready: StoryObj = { render: () => <IndividualListTab p={TWU} state="ready" /> };
