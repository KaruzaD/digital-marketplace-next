import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusCreate } from "./evaluation-pages";

// evaluation-consensus-create-twu · duplicate — the chair already recorded a consensus for this proponent and the service
// refuses a second (R-5.29). The criteria give no wording; the sentence follows R-5.3's (gap 9)
const meta: Meta = { title: "evaluation/evaluation-consensus-create-twu/duplicate", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Duplicate: StoryObj = { render: () => <ConsensusCreate p={TWU} state="duplicate" /> };
