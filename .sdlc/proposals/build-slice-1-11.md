---
gate: G3
question: "Does slice 1 (A visitor can read the service's own pages) do what its criteria say?"
recommendation: "The application build-slice-1-10 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T07:02:45.682Z
---

# Does slice 1 (A visitor can read the service's own pages) do what its criteria say?

**Recommendation.** The application build-slice-1-10 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-1-10 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-1.43: on /opportunities/sprint-with-us/00000000-0000-4000-a011-000000000001/edit?tab=evaluationPanel at the consensus stage, the page shows a region "Evaluation panel" holding the note "The evaluation panel can no longer be changed — The consensus stage has begun, so the panel is fixed." (inside `evaluation-panel-locked-message`), with a read-only table region "Members of the evaluation panel" nested inside it. evaluationPanelPage's section() ends in `.last()`, so it resolves to the nested members-table region (it holds the member rows), which does not contain the note. lockNote() therefore counts 0, editable() returns true, and addPanelMember waits on a member chooser the locked page never draws until the 15s timeout. section() has to resolve to the outermost "Evaluation panel" region, or lockNote() has to look across the whole panel, so the lock is read as a refusal.
- to bind-adapter: R-5.16: the same fault in evaluationPanelSwu.addPanelMember on /opportunities/sprint-with-us/00000000-0000-4000-8000-000000000701/edit?tab=evaluationPanel. The page shows status "Team questions: consensus" and the note "The evaluation panel can no longer be changed" in the outer "Evaluation panel" region. section()'s `.last()` picks the nested "Members of the evaluation panel" table region, the lock note is missed, and the adapter tries to click a member chooser that is not on the page (locator.click timeout) instead of noting the refusal.
- to bind-adapter: R-1.40: opportunityCwuComplete.fullReport on /opportunities/code-with-us/00000000-0000-4000-a008-000000000001/complete (as an administrator) returned text starting "Opportunity Status Awarded Reward $5,000 …". It read only the element carrying `opportunity-full-report`, which starts at the "Opportunity" section. The page shows the opportunity's title "Seeded awarded Code With Us opportunity" as the report's H1, just above that element, and the report article is named by that title. fullReport has to include the report's heading (the H1 that labels the document), not only the body below it.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 1 (a visitor can read the service's own pages) do what its criteria say? Ruling: approve. The verify result is pass, current for this proposal against application tree 79e8154: all six claimed criteria (R-7.1, R-7.2, R-7.3, R-7.4, R-7.18, R-7.19) were exercised and met. The diff restyles only slice 1's own screens (the public page, the learn-more screens, the shared missing page) without changing behaviour: the article is still labelled by the page's H1, the service level agreement link still resolves to /content/service-level-agreement, and malformed and unknown addresses still share one not-found screen that never says 'not allowed'. The new content kit holds only what these screens use, and the managing-screen parts are left to slice 5 (decision record 0073). The formatted-text change is a style setting in the single shared renderer, so an embedded body still renders identically to the page's own address (R-7.17), and a new unit test confirms raw markup is still shown as text. The new slice-one-screens tests cover the parts this change creates. No secrets, personal data, logging or protected paths are touched. R-1.43, R-5.16 and R-1.40 are not slice 1's; the previous ruling already addressed them to bind-adapter. Would change: a claimed criterion failing or going unbound on a later verify, or the renderer change making an embedded body differ from the page's own rendering.

**Conditions:**
none
