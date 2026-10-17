import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-consensus-create-swu · not-found — anyone not on the panel, and anyone at all while the opportunity is not
// in consensus (R-5.28, R-5.29). A panel member who is not the chair sees the chair-only story instead. Drawn for the
// opportunity's owner, who is not on the panel.
const meta: Meta = { title: "evaluation/evaluation-consensus-create-swu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={STAFF} /> };
