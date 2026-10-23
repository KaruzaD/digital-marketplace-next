import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { IndividualCreate } from "./evaluation-pages";

// evaluation-individual-create-swu · default — an evaluator starts scoring the second of three proponents, who is named
// only anonymously. One score and one comment per team question (R-5.22, R-5.35)
const meta: Meta = { title: "evaluation/evaluation-individual-create-swu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <IndividualCreate p={SWU} state="default" /> };
