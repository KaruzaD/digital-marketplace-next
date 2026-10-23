import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { IndividualCreate } from "./evaluation-pages";

// evaluation-individual-create-swu · duplicate — the evaluator already holds an evaluation of this proponent, and the
// service refuses a second in its own words; nothing new is created (R-5.3)
const meta: Meta = { title: "evaluation/evaluation-individual-create-swu/duplicate", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Duplicate: StoryObj = { render: () => <IndividualCreate p={SWU} state="duplicate" /> };
