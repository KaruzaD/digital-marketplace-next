import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-instructions-swu · loading — the instructions content has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-instructions-swu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Manage a Sprint With Us opportunity" label="Loading instructions" />,
};
