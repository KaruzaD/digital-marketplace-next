import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { ConsensusEdit } from "./evaluation-pages";

// evaluation-consensus-edit-twu · submitted — a submitted consensus stays editable until the scores are finalized;
// changing it means submitting the final consensus scores again (R-5.30)
const meta: Meta = { title: "evaluation/evaluation-consensus-edit-twu/submitted", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Submitted: StoryObj = { render: () => <ConsensusEdit p={TWU} state="submitted" /> };
