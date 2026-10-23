| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T21:50:46.607Z |
| holder | agent:reviewer |

# Does slice 17 (Panel evaluators score proponents individually) do what its criteria say?

**Recommendation.** The application build-slice-17-3 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-17-3 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-5.24: evaluationIndividualListSwu.evaluationStatus() read "" on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluation, while the page's Evaluation region shows a list labelled 'Your evaluations, by anonymous proponent name' whose li items carry evaluation-proponent-row and read 'Proponent 1 Your evaluation : Submitted' (and Proponents 2 and 3 likewise), each status in a span carrying evaluation-status. rowsText (tests/adapters/new/index.ts:5611) keeps only rows having ARIA cell descendants and skips these li rows, so proponentRows returns nothing. Read rows found by evaluation-proponent-row that have no cell role by their children or their evaluation-status / proposal-proponent-name test IDs.
- to bind-adapter: R-5.27: evaluationIndividualListTwu.evaluationStatus() and evaluationIndividualListSwu.evaluationStatus() read "" on /opportunities/team-with-us/00000000-0000-4000-8000-000000000801/edit?tab=evaluation and /opportunities/sprint-with-us/00000000-0000-4000-a041-000000000001/edit?tab=evaluation, while both pages show the proponent list as li items carrying evaluation-proponent-row ('Proponent 1 Your evaluation : Submitted', and 2 and 3 likewise) with the status in evaluation-status. The same rowsText cell-role filter at tests/adapters/new/index.ts:5611 drops every li row.
- to bind-adapter: R-5.35: evaluationIndividualListSwu.evaluationStatus() read "" both before and after the move on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluation, while the page after the move shows li rows carrying evaluation-proponent-row reading 'Proponent 1 Your evaluation : Draft: complete', 'Proponent 2 Your evaluation : Not started', 'Proponent 3 Your evaluation : Not started'. The empty reads come from rowsText at tests/adapters/new/index.ts:5611 skipping rows with no ARIA cell role, which made the test's not.toBe(before) compare two empty strings.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.302 (Claude Code))

The question is whether slice 17 (panel evaluators score proponents individually) does what its criteria say and nothing more. I approve. The verify result is pass, current for this proposal against application tree b04860d, which matches the branch, with all 15 claimed criteria exercised and met. The three conditions on build-slice-17-3 were all addressed to bind-adapter, because the adapter's rowsText skipped li rows. That is why the application comes back unchanged and is now verified green. The diff only restyles the evaluator's Instructions and Evaluation tabs and the per-proponent scoring forms to the approved design catalogue, as decision record 0083 records: kit pieces EvaluationStatus, ScoringHead, QuestionBox, Response, SaveRow and Refusal; the table becomes a ul/li list with the same test IDs; the status label carries its state in words as well as colour; alerts take focus again after each refused save. No behaviour, route, message wording or test ID changes. Nothing from slice 18 is built, and the consensus form's shared Heading1 and OpportunityLine are left as they were. No secret, credential or personal data appears, no protected path is touched, and new unit tests in app/frontend/tests/individual-evaluation.test.tsx cover the new seams: row structure and status colours, the scoring head and question boxes, the error summary taking focus again, and the read-only panels. The ruling would change if the verify result went stale or failed, or if the restyle had changed behaviour or wording, or reached into another slice's screens.

**Conditions:**
none
