import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIDTHS } from "./evaluation-kit";
import { PanelRequest } from "./evaluation-pages";

// evaluation-panel-request · default — the panel an opportunity holds, as the service answers it to its owner or an
// administrator: who is on it, and whether each is an evaluator, the chair, or both (R-5.1, R-5.18)
// Not a screen: the address answers with data. This response reference names the parts of the answer.
const meta: Meta = { title: "evaluation/evaluation-panel-request/default", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Default: StoryObj = { render: () => <PanelRequest state="default" /> };
