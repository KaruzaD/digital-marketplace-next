import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualEdit } from "./evaluation-pages";

// evaluation-individual-edit-twu · submitted — once submitted the evaluation is shown, not offered for editing, and has
// no save controls at all (R-5.24)
const meta: Meta = { title: "evaluation/evaluation-individual-edit-twu/submitted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Submitted: StoryObj = { render: () => <IndividualEdit p={TWU} state="submitted" /> };
