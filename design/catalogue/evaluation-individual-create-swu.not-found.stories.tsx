import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-individual-create-swu · not-found — anyone who is not an evaluator on the panel, the chair who does not
// evaluate and the owner included, and any evaluator once the opportunity has left individual evaluation (R-5.21). Drawn
// for the opportunity's owner.
const meta: Meta = { title: "evaluation/evaluation-individual-create-swu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={STAFF} /> };
