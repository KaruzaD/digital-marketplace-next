import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-individual-list-twu · not-found — the address opened by anyone who is not an evaluator on the panel, here
// the opportunity's owner. The Evaluation tab is never offered to them (R-5.21, R-5.34); answering the address as missing
// follows R-5.18 (see gap 5)
const meta: Meta = { title: "evaluation/evaluation-individual-list-twu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={STAFF} /> };
