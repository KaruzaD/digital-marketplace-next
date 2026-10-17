import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { PanelTab } from "./evaluation-pages";

// evaluation-panel-swu · editing — the owner pressed Edit evaluation panel: two evaluators, the first also the chair. A
// person is added by choosing them by name and email address and pressing Add an evaluator; they join as an evaluator,
// not the chair. Nothing is sent until Save evaluation panel (R-5.1, R-5.9, R-5.16, R-5.17)
const meta: Meta = { title: "evaluation/evaluation-panel-swu/editing", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Editing: StoryObj = { render: () => <PanelTab p={SWU} state="editing" /> };
