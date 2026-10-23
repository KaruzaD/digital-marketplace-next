import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-instructions-twu · loading — the instructions content has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-instructions-twu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Manage a Team With Us opportunity" label="Loading instructions" />,
};
