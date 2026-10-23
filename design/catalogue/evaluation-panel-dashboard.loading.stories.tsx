import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-panel-dashboard · loading — the lists have not arrived yet
const meta: Meta = { title: "evaluation/evaluation-panel-dashboard/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={EVALUATOR} title="Dashboard" label="Loading your opportunities" />,
};
