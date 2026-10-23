import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR_TWO, EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-consensus-list-twu · not-found — the address opened by an evaluator who is not the chair, or by anyone else
// the Consensus tab is not offered to (R-5.34); answering the address as missing follows R-5.18 (see gap 5). Drawn for an
// evaluator who is not the chair.
const meta: Meta = { title: "evaluation/evaluation-consensus-list-twu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={EVALUATOR_TWO} /> };
