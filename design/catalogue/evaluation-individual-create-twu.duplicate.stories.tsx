import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualCreate } from "./evaluation-pages";

// evaluation-individual-create-twu · duplicate — the evaluator already holds an evaluation of this proponent, and the
// service refuses a second in its own words, with "resource question" in place of "team question" (R-5.3)
const meta: Meta = { title: "evaluation/evaluation-individual-create-twu/duplicate", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Duplicate: StoryObj = { render: () => <IndividualCreate p={TWU} state="duplicate" /> };
