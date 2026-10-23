import type { Meta, StoryObj } from "@storybook/react-vite";
import { EVALUATOR, EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-panel-swu · not-found — anyone but an administrator or the opportunity's owner, a panel member included, is
// answered Not Found (R-5.18). Drawn for a panel member.
const meta: Meta = { title: "evaluation/evaluation-panel-swu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={EVALUATOR} /> };
