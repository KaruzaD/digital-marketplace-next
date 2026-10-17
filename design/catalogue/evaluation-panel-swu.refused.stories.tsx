import type { Meta, StoryObj } from "@storybook/react-vite";
import { SWU, WIDTHS } from "./evaluation-kit";
import { PanelTab } from "./evaluation-pages";

// evaluation-panel-swu · refused — the service refused a member the form could not check: the list offers only public
// sector employees, but this person's account was no longer one when the panel was saved. The member is named at their
// own row, and the same place carries any other member-level refusal from the service (R-5.1, R-5.37)
const meta: Meta = { title: "evaluation/evaluation-panel-swu/refused", parameters: { viewport: { options: WIDTHS } } };
export default meta;

export const Refused: StoryObj = { render: () => <PanelTab p={SWU} state="refused" /> };
