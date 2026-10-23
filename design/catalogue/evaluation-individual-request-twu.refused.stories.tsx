import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { IndividualRequest } from "./evaluation-pages";

// evaluation-individual-request-twu · refused — an evaluator asks for one complete draft to be submitted by itself and is
// refused as unrecognised; the evaluation stays a draft (R-5.26). A draft saved with an out-of-range score is refused
// when the evaluator's set is submitted, with R-5.25's message, and nothing is submitted (R-5.23, R-5.25, R-5.36).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "evaluation/evaluation-individual-request-twu/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = { render: () => <IndividualRequest p={TWU} state="refused" /> };
