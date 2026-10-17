import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-consensus-edit-swu · loading — the consensus has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-consensus-edit-swu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Sprint With Us consensus" label="Loading the consensus" />,
};
