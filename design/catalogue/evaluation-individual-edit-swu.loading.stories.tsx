import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-individual-edit-swu · loading — the evaluation has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-individual-edit-swu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Sprint With Us evaluation" label="Loading the evaluation" />,
};
