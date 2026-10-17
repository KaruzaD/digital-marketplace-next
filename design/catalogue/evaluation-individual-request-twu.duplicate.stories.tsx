import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualRequest } from "./evaluation-pages";

// evaluation-individual-request-twu · duplicate — an evaluator who already holds a draft of the first proponent starts a
// second evaluation of it by request and is refused with R-5.3's message in its Team With Us wording; their draft still
// holds 3, 3, 3, 3 (R-5.3)
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = { title: "evaluation/evaluation-individual-request-twu/duplicate", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Duplicate: StoryObj = { render: () => <IndividualRequest p={TWU} state="duplicate" /> };
