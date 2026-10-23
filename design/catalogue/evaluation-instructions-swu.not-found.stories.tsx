import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-instructions-swu · not-found — the address opened by anyone who is not an evaluator on the panel, here the
// opportunity's owner. The Instructions tab is never offered to them (R-5.34); answering the address as missing follows
// R-5.18 (see gap 5)
const meta: Meta = { title: "evaluation/evaluation-instructions-swu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={STAFF} /> };
