import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusCreate } from "./evaluation-pages";

// evaluation-consensus-create-twu · default — the chair records the agreed scores for a proponent, with every evaluator's
// scores and comments beside their names under each question (R-5.28, R-5.29)
const meta: Meta = { title: "evaluation/evaluation-consensus-create-twu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <ConsensusCreate p={TWU} state="default" /> };
