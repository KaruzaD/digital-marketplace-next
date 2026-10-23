import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-twu · finalize-confirm — an administrator pressed Finalize consensus scores in the shared action
// bar and is asked to confirm. The opportunity's owner is offered the same button (R-5.14, R-5.32, R-5.33)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-twu/finalize-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const FinalizeConfirm: StoryObj = { render: () => <ConsensusListTab p={TWU} state="finalize-confirm" /> };
