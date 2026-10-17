import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-consensus-list-twu · loading — the consensus list has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-consensus-list-twu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Manage a Team With Us opportunity" label="Loading consensus" />,
};
