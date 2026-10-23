import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-consensus-create-twu · loading — the proponent and the evaluators' scores have not arrived yet
const meta: Meta = { title: "evaluation/evaluation-consensus-create-twu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => (
    <EvaluationLoading viewer={EVALUATOR} title="Agree a Team With Us consensus" label="Loading the evaluators' scores" />
  ),
};
