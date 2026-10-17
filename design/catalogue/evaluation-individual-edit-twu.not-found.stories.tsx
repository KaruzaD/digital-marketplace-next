import type { Meta, StoryObj } from "@storybook/react-vite";
import { EvaluationMissing, UNRELATED_STAFF, WIDTHS } from "./evaluation-kit";

// evaluation-individual-edit-twu · not-found — anyone not allowed to read this evaluation, which always includes a public
// sector employee with no connection to the opportunity (R-5.11), who this story is drawn for. Who else is shut out
// before consensus is disputed between R-5.11 and R-5.28 (gap 3)
const meta: Meta = { title: "evaluation/evaluation-individual-edit-twu/not-found", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const NotFound: StoryObj = { render: () => <EvaluationMissing viewer={UNRELATED_STAFF} /> };
