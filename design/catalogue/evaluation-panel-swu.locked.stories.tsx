import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { PanelTab } from "./evaluation-pages";

// evaluation-panel-swu · locked — from the consensus stage onward the panel is fixed, so it is listed with no Edit
// (R-5.16). The action bar is the opportunities domain's, as the owner sees it at consensus (R-5.14).
const meta: Meta = { title: "evaluation/evaluation-panel-swu/locked", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Locked: StoryObj = { render: () => <PanelTab p={SWU} state="locked" /> };
