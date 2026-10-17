import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusRequest } from "./evaluation-pages";

// evaluation-consensus-request-twu · default — the chair changes a consensus by request while the opportunity is in
// consensus; the change is accepted, and an administrator reads back what it holds (R-5.28, R-5.29, R-5.30, R-5.36)
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "evaluation/evaluation-consensus-request-twu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <ConsensusRequest p={TWU} state="default" /> };
