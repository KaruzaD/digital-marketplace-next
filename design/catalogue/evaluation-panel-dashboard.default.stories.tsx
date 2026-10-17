import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIDTHS } from "./evaluation-kit";
import { Dashboard } from "./evaluation-pages";

// evaluation-panel-dashboard · default — a public sector employee who sits on three panels sees them under their own
// "Evaluations" heading, a draft included (R-5.19). The My opportunities section is the opportunities domain's, unchanged.
const meta: Meta = { title: "evaluation/evaluation-panel-dashboard/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <Dashboard state="default" /> };
