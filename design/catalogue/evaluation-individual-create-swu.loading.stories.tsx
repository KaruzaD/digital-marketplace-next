import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-individual-create-swu · loading — the proponent's responses have not arrived yet
const meta: Meta = { title: "evaluation/evaluation-individual-create-swu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <EvaluationLoading viewer={EVALUATOR} title="Evaluate a Sprint With Us proponent" label="Loading the proponent's responses" />
  ),
};
