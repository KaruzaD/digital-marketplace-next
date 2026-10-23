import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { EvaluationLoading, WIDTHS } from "./evaluation-kit";

// evaluation-panel-twu · loading — the panel has not arrived yet
const meta: Meta = { title: "evaluation/evaluation-panel-twu/loading", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Loading: StoryObj = {
  render: () => <EvaluationLoading viewer={STAFF} title="Manage a Team With Us opportunity" label="Loading evaluation panel" />,
};
