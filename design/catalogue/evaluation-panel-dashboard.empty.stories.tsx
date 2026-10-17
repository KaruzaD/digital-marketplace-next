import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIDTHS } from "./evaluation-kit";
import { Dashboard } from "./evaluation-pages";

// evaluation-panel-dashboard · empty — a public sector employee on no evaluation panel. The Evaluations heading stays,
// with a message in place of the list (R-5.19). The wording is the design's own. My opportunities is trimmed.
const meta: Meta = { title: "evaluation/evaluation-panel-dashboard/empty", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Empty: StoryObj = { render: () => <Dashboard state="empty" /> };
