import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualEdit } from "./evaluation-pages";

// evaluation-individual-edit-twu · invalid — changes saved with a score above the maximum, a score with three decimal
// places and an empty comment. They are kept as entered and stop the scores being submitted (R-5.22, R-5.23)
const meta: Meta = { title: "evaluation/evaluation-individual-edit-twu/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = { render: () => <IndividualEdit p={TWU} state="invalid" /> };
