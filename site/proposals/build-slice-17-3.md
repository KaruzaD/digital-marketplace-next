| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T21:37:19.535Z |
| holder | agent:reviewer |
| worked by | claude claude-opus-5-5 (2.1.302 (Claude Code)) |

# Does slice 17 (Panel evaluators score proponents individually) do what its criteria say?

**Recommendation.** Slice 17's screens now follow the design catalogue approved at G-DESIGN.

**Worked by:** claude claude-opus-5-5 (2.1.302 (Claude Code))

Slice 17's screens now follow the design catalogue approved at G-DESIGN. No test ID, route, message wording or behaviour changed. `npm --prefix app run check` passes: the typecheck plus every package's unit tests (16 + 862 + 637). The acceptance suite was not run, and I couldn't view any page because there's no browser here.

**Where things stood.** All fifteen criteria (R-1.24, R-2.5, R-5.3, R-5.11, R-5.16, R-5.19, R-5.21–R-5.27, R-5.34, R-5.35) were already built, as decision record 0062 describes. The dashboard's Evaluations section and the manage page's frame around the tabs had been restyled by earlier passes (0070, 0075). R-5.16 and the panel tab, and R-1.24 and R-2.5 at closing, needed nothing here. What still had the old look was the evaluator's two tabs and the per-proponent scoring screens.

**What I changed:**
- **Shared kit.** I added the catalogue's pieces once to `app/frontend/src/app/evaluation-kit.tsx`: the evaluation status label (grey for Not started, blue for a draft, green for Submitted, always in words too), the scoring head, the question box, the proponent's response block, the save row and the refusal alert. The consensus screens (slice 18) can take them from there.
- **Instructions tab.** The administrator-maintained page now sits in the kit's body wrapper, which carries `evaluation-instructions-body`.
- **Evaluation tab.** The proponents are now the kit's rows, which turn into stacked cards on a phone. Each status is a coloured label, the submit button sits in the shared actions row, and a refusal takes focus again after each refused attempt. While the list loads, the tab shows a wait message inside the manage page.
- **Scoring forms.** They follow the stories' order: the head (with the status label on the edit page), the back link, the scoring sentence, the alerts, one box per question with the proponent's response, then the save buttons. The error summary now shows its title and takes focus again after each save. A submitted evaluation, or another evaluator's that the reader may see, shows each question as a panel with its score and comment.

**Changes a test could notice:**
- The Evaluation tab's table is now a list. The rows are `li` elements carrying the same test IDs.
- A row's text now includes a visually hidden column name, for example "Your evaluation: Draft: complete".
- On the edit page, the status moved from a "Status:" line into the head and keeps `evaluation-status`.

**One difference from the story.** The story draws the Evaluation tab's loading state as a whole page waiting. The app keeps the manage page around the wait, because the page itself has already loaded by then.

**Tests.** I added unit tests to `app/frontend/tests/individual-evaluation.test.tsx`. They cover:
- the list being rows rather than a table, each status label's colour, and the hidden column names;
- the scoring head's eyebrow, labels and facts, the question boxes and their ids, and the response block;
- the error summary's title, and the alert taking focus;
- the submitted view's labels, panels and notice.

The reasoning is in `docs/decisions/0083-the-evaluators-tabs-and-scoring-forms-follow-the-chosen-direction.md`.

**For slice 18.** The consensus form and Consensus tab keep their old look. `Heading1` and `OpportunityLine` in `evaluation-individual-form.tsx` stay exported unchanged because the consensus form still uses them; slice 18's restyle can switch it to the kit's scoring head and remove them. Nothing this stage needed lay outside `app/` and `docs/decisions/`.

## Ruling

**Verdict:** return
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

The question is whether slice 17's restyle of the evaluator's tabs and scoring forms does what its criteria say. Verify recorded a fail on R-5.24, R-5.27 (two cases) and R-5.35, but every one stopped on evaluationIndividualList{Swu,Twu}.evaluationStatus() reading an empty string, and the evidence puts that on the adapter, not the application. This build changed the Evaluation tab's proponent table into a ul whose li rows carry the same evaluation-proponent-row and evaluation-status test IDs, as the proposal says. The adapter's proponentRows finds those rows by test ID, but rowsText (tests/adapters/new/index.ts:5611) builds each line only from descendants with the ARIA cell role and drops any row without one, so every li row is discarded and the read is empty. The saved snapshots show the statuses on the page: 'Proponent 1/2/3 Your evaluation : Submitted' for R-5.24 and both R-5.27 cases, and 'Proponent 1 Your evaluation : Draft: complete' for R-5.35, which is what that test expects after saving and moving on (its not.toBe(before) fails only because both reads were empty). The rest of the diff is a restyle into the evaluation kit with no change to test IDs, routes, messages or behaviour, plus matching unit tests, and gives no reason to return the build. It is returned so the binding can be fixed, and nothing is owed by build. It would be approved once bind-adapter reads row cells from li rows and a current verify passes all fifteen criteria on this tree.

**Conditions:**
- addressed-to bind-adapter: R-5.24: evaluationIndividualListSwu.evaluationStatus() read "" on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluation, while the page's Evaluation region shows a list labelled 'Your evaluations, by anonymous proponent name' whose li items carry evaluation-proponent-row and read 'Proponent 1 Your evaluation : Submitted' (and Proponents 2 and 3 likewise), each status in a span carrying evaluation-status. rowsText (tests/adapters/new/index.ts:5611) keeps only rows having ARIA cell descendants and skips these li rows, so proponentRows returns nothing. Read rows found by evaluation-proponent-row that have no cell role by their children or their evaluation-status / proposal-proponent-name test IDs.
- addressed-to bind-adapter: R-5.27: evaluationIndividualListTwu.evaluationStatus() and evaluationIndividualListSwu.evaluationStatus() read "" on /opportunities/team-with-us/00000000-0000-4000-8000-000000000801/edit?tab=evaluation and /opportunities/sprint-with-us/00000000-0000-4000-a041-000000000001/edit?tab=evaluation, while both pages show the proponent list as li items carrying evaluation-proponent-row ('Proponent 1 Your evaluation : Submitted', and 2 and 3 likewise) with the status in evaluation-status. The same rowsText cell-role filter at tests/adapters/new/index.ts:5611 drops every li row.
- addressed-to bind-adapter: R-5.35: evaluationIndividualListSwu.evaluationStatus() read "" both before and after the move on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluation, while the page after the move shows li rows carrying evaluation-proponent-row reading 'Proponent 1 Your evaluation : Draft: complete', 'Proponent 2 Your evaluation : Not started', 'Proponent 3 Your evaluation : Not started'. The empty reads come from rowsText at tests/adapters/new/index.ts:5611 skipping rows with no ARIA cell role, which made the test's not.toBe(before) compare two empty strings.
