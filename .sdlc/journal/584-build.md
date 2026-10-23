---
stage: "build"
title: "build slice 14"
at: "2026-10-19T05:10:05.526Z"
cost: 1.4966654
turns: 35
session: "7b8442c6-5b55-474a-a49f-f4738c28035f"
backend: claude
model: "claude-opus-5-5"
cli: "2.1.302 (Claude Code)"
isolation: "none"
---

I brought the slice 14 screens back in line with the design catalogue. Only two wording differences were left, both on the proposal forms. `npm --prefix app run check` passes: typechecks, then 16 + 862 + 659 unit tests across migrations, backend and frontend.

**What I found.** These screens had already been restyled once, the previous time this stage ran (decision record 0072). Since then the design notes have gained a section called "Corrections after the build", which changes two things on these screens. I checked every story for the Code With Us create page, its manage page and the vendor dashboard against the app: the words, the order of things and the test IDs. Only those two corrections were missing. Everything else the stories draw is already in the screens, or is left out on purpose for reasons decision record 0072 already gives.

**What I changed:**
- **Manage page form.** When a vendor presses Edit, the form now asks the create page's question: "Will you be submitting a proposal for this opportunity as an Individual or Organization?", with the choices "Individual" and "Organization". It used to ask "Who is submitting this proposal?" with "An individual" and "An organization". The test IDs on the two choices are unchanged.
- **Create page.** The second street field is now labelled "Street Address line 2", so the two street fields no longer share a name, which the accessibility guideline WCAG 2.2 requires. Its test ID `proposal-street-2-field` is unchanged.
- **Shared proposal kit.** I added one style rule so the kit's styles match the catalogue's copy exactly. It only matters to the scoring screens a later slice builds.
- **Decision record.** `docs/decisions/0091-the-code-with-us-proposal-forms-take-the-catalogues-corrections.md` records these changes and replaces 0072's line about the question.

**Kept on purpose.** At the end of the manage form the story says "Save changes keeps this proposal as a draft"; I kept the app's "keeps this proposal as it is". Edit is also offered on proposals that have been submitted or withdrawn, and saving one of those does not turn it back into a draft, so the story's sentence would be wrong there. The earlier omissions also stand: no evaluation-criteria section, because the contract gives Code With Us opportunities no evaluation criteria, and no "format with Markdown" sentence, because proposals are shown as plain text.

**Tests.** I added checks to the existing unit tests in `app/frontend/tests/proposals.test.tsx` rather than writing new tests. The manage-page editing test now checks the corrected question, both choice labels and the "Street address line 2" label. The create-page test now checks that "Street Address line 2" labels the second street field.

**Effect on the acceptance tests.** No test ID changed. An acceptance test that finds the manage form's choices by "Who is submitting this proposal?", or the create page's second street field by "Street Address", will need the new words.

**Not done here.** I changed no behaviour and nothing in the slice's criteria. As before, the rules that also cover the Sprint With Us and Team With Us screens are answered for in Slice 15, and scoring and awarding in Slice 16. Nothing outside `app/` and `docs/decisions/` was touched. I could not view the pages in a browser here, so the checks rely on the unit tests and the comparison against the stories.