import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusEdit } from "./evaluation-pages";

// evaluation-consensus-edit-twu · default — the chair's draft consensus for a proponent, with the evaluators' scores and
// comments beside each question (R-5.28, R-5.29)
const meta: Meta = { title: "evaluation/evaluation-consensus-edit-twu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <ConsensusEdit p={TWU} state="default" /> };
