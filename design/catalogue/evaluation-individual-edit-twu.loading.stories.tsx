import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-individual-edit-twu · loading — the evaluation has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-individual-edit-twu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Team With Us evaluation" label="Loading the evaluation" />,
};
