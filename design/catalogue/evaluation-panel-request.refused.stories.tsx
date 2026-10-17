import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIDTHS } from "./evaluation-kit";
import { PanelRequest } from "./evaluation-pages";

// evaluation-panel-request · refused — the owner sends, without the form, a panel naming a member who is neither an
// evaluator nor the chair, and separately a panel of two evaluators with no chair. The service refuses both, naming the
// member in the first, and the opportunity keeps the panel it had (R-5.1, R-5.9, R-5.37). The messages are the panel
// form's (DESIGN.md, evaluation gap 6).
// Not a screen: the address answers with data. This response reference names the parts of the requests and the answer.
const meta: Meta = { title: "evaluation/evaluation-panel-request/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = { render: () => <PanelRequest state="refused" /> };
