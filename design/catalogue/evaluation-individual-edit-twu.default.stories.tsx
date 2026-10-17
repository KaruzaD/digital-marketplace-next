import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualEdit } from "./evaluation-pages";

// evaluation-individual-edit-twu · default — the evaluator's own draft, which they may change while it is a draft and the
// opportunity is still in individual evaluation (R-5.24, R-5.35)
const meta: Meta = { title: "evaluation/evaluation-individual-edit-twu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <IndividualEdit p={TWU} state="default" /> };
