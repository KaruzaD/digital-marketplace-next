import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusRequest } from "./evaluation-pages";

// evaluation-consensus-request-swu · refused — an evaluator who is not the chair changes the chair's consensus by request,
// or anyone changes one after the opportunity has moved past consensus. The change is refused as not permitted and the
// consensus keeps what it held (R-5.29, R-5.30)
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "evaluation/evaluation-consensus-request-swu/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = { render: () => <ConsensusRequest p={SWU} state="refused" /> };
