import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusCreate } from "./evaluation-pages";

// evaluation-consensus-create-twu · chair-only — a panel member who is not the chair opens the page during consensus. They
// may read every evaluator's scores from the consensus stage on (R-5.28) but not record the agreed score (R-5.29)
const meta: Meta = { title: "evaluation/evaluation-consensus-create-twu/chair-only", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const ChairOnly: StoryObj = { render: () => <ConsensusCreate p={TWU} state="chair-only" /> };
