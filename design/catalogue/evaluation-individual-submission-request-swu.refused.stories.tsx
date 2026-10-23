import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIDTHS } from "./evaluation-kit";
import { SubmissionRequest } from "./evaluation-pages";

// evaluation-individual-submission-request-swu · refused — the submission names a proponent the evaluator holds no
// complete draft of. The service refuses it with R-5.25's message and submits none of it; the opportunity stays in
// individual evaluation (R-5.25).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "evaluation/evaluation-individual-submission-request-swu/refused",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Refused: StoryObj = { render: () => <SubmissionRequest state="refused" /> };
