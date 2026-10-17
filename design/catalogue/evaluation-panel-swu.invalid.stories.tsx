import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { PanelTab } from "./evaluation-pages";

// evaluation-panel-swu · invalid — Save was pressed with the same person named twice and nobody chosen as chair. Nothing
// is saved, and the opportunity keeps the panel it had (R-5.1, R-5.9)
const meta: Meta = { title: "evaluation/evaluation-panel-swu/invalid", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Invalid: StoryObj = { render: () => <PanelTab p={SWU} state="invalid" /> };
