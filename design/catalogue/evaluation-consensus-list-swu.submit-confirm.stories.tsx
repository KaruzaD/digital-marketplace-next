import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { ConsensusListTab } from "./evaluation-pages";

// evaluation-consensus-list-swu · submit-confirm — the chair pressed Submit final consensus scores and is asked to
// confirm; the owner and every administrator are told when it goes through (R-5.30, R-5.31). The ready page is behind it.
const meta: Meta = { title: "evaluation/evaluation-consensus-list-swu/submit-confirm", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const SubmitConfirm: StoryObj = { render: () => <ConsensusListTab p={SWU} state="submit-confirm" /> };
