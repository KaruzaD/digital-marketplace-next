import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIDTHS } from "./evaluation-kit";
import { SubmissionRequest } from "./evaluation-pages";

// evaluation-individual-submission-request-swu · default — an evaluator submits their scores for consensus by request,
// naming two of the three proponents. The service submits their evaluation of each one named and of no other, and counts
// submitted scores toward the move to consensus over the named proponents only (R-5.25, R-5.27).
// Not a screen: the address answers with data. This response reference names the parts of the request and the answer.
const meta: Meta = {
  title: "evaluation/evaluation-individual-submission-request-swu/default",
  parameters: { viewport: { options: WIDTHS } },
};
export default meta;

export const Default: StoryObj = { render: () => <SubmissionRequest state="default" /> };
