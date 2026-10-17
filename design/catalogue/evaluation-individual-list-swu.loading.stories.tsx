import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-individual-list-swu · loading — the evaluator's list has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-individual-list-swu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Manage a Sprint With Us opportunity" label="Loading your evaluations" />,
};
