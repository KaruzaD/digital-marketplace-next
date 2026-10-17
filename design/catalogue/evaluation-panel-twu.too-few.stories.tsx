import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { PanelTab } from "./evaluation-pages";

// evaluation-panel-twu · too-few — Save was pressed with one person on the panel. The rule belongs to the panel as a
// whole, so it is shown after the list of evaluators rather than on a field (R-5.1)
const meta: Meta = { title: "evaluation/evaluation-panel-twu/too-few", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const TooFew: StoryObj = { render: () => <PanelTab p={TWU} state="too-few" /> };
