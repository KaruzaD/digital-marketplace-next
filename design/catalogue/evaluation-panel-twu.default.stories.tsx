import type { Meta, StoryObj } from "@storybook/react-vite";
import { TWU, WIDTHS } from "./evaluation-kit";
import { PanelTab } from "./evaluation-pages";

// evaluation-panel-twu · default — the opportunity's owner opens the panel of a published opportunity. The tab opens
// read-only: two evaluators, the first also the chair, and Edit evaluation panel, offered while the panel may still be
// changed (R-5.1, R-5.16, R-5.18; the surface's note on start_editing)
const meta: Meta = { title: "evaluation/evaluation-panel-twu/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <PanelTab p={TWU} state="default" /> };
