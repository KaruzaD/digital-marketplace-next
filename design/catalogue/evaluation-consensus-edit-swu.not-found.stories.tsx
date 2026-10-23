import type { Meta, StoryObj } from "@storybook/react-vite";
import { STAFF } from "./opportunity-kit";
import { EvaluationMissing, WIDTHS } from "./evaluation-kit";

// evaluation-consensus-edit-swu · not-found — anyone but the chair who recorded it, and anyone at all once the opportunity
// has left consensus. An administrator reads the agreed scores on the Consensus tab (R-5.28, R-5.29, R-5.30; gap 11).
// Drawn for the opportunity's owner.
const meta: Meta = { title: "evaluation/evaluation-consensus-edit-swu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={STAFF} /> };
