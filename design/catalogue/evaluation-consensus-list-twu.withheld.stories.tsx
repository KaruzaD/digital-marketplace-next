import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-twu · withheld — the opportunity's owner is not on the panel, so the agreed scores are withheld
// until the next stage and the page says why instead of opening empty (R-5.12). Finalizing is still offered (R-5.14; gap 7)
const meta: Meta = { title: "evaluation/evaluation-consensus-list-twu/withheld", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Withheld: StoryObj = { render: () => <ConsensusListTab p={TWU} state="withheld" /> };
