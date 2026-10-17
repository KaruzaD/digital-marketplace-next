import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { IndividualRequest } from "./evaluation-pages";

// evaluation-individual-request-swu · default — an evaluator starts an evaluation of a proponent by request, then saves a
// draft in which question 1's score is above its maximum and question 2's comment is empty. Both are accepted and stored
// as sent: a draft is not checked (R-5.21, R-5.23).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "evaluation/evaluation-individual-request-swu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <IndividualRequest p={SWU} state="default" /> };
