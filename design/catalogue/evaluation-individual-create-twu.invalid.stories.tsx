import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualCreate } from "./evaluation-pages";

// evaluation-individual-create-twu · invalid — a score above the question's maximum, a score with three decimal places and
// an empty comment. The draft is kept as entered; the problems stop the scores being submitted, not saved (R-5.22, R-5.23)
const meta: Meta = { title: "evaluation/evaluation-individual-create-twu/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = { render: () => <IndividualCreate p={TWU} state="invalid" /> };
