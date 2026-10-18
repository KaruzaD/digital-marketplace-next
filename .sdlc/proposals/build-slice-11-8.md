---
gate: G3
question: "Does slice 11 (A vendor can register and look after an organization) do what its criteria say?"
recommendation: "I made no changes to the application in this revision."
opened: 2026-10-18T17:41:59.344Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does slice 11 (A vendor can register and look after an organization) do what its criteria say?

**Recommendation.** I made no changes to the application in this revision.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I made no changes to the application in this revision. The one condition in the ruling came from the acceptance adapter, not from the app, so nothing under `app/` or `docs/decisions/` was edited.

**The failure.** The ruling says this build broke one criterion that had passed before, R-3.28 from slice 13. That is the case where only an administrator, not the organization's owner, may set which service areas an organization is approved for. The test failed on the administrator's view of the Team With Us qualification tab. It reported that the organization did not stand approved for exactly Full stack developer and Agile coach.

**What the evidence shows.** The page outline in `.sdlc/evidence/slice-11/R-3.28.txt` contradicts that report. On that tab, signed in as the administrator, the group "Service areas this organization is approved for" shows "Full stack developer" and "Agile coach" ticked and the other three unticked. That is exactly the approval the test expected.

So the app saved and displayed the right areas. The test simply couldn't read the restyled checkboxes. This matches the operator's note: the adapter's checkbox read for this tab came back empty, and the binding approved just before this run fixes that read. The operator said to keep the restyle and make no change for R-3.28, and the evidence supports that, so I followed it.

**Slice 11's criteria.** Everything the previous build delivered is still in place and untouched. That covers the public organization list, registering an organization with its logo, the profile tab, the owner's archive notice, the list of organizations a vendor may act for, and the four image rules.

**Check.** The workspace had no dependencies installed at first, so `tsc` was missing; I installed them with `npm ci` under `app/`. After that, `npm --prefix app run check` passes: typecheck plus every unit test in the backend and frontend, 1,499 tests in all. The error lines it prints are logged on purpose by tests of failure paths, and none of those tests failed.

**What I couldn't do.** There is no browser or Docker here, so I couldn't re-run the R-3.28 acceptance test against the fixed binding. That check happens at verify.

**For the next slice.** Nothing new is missing beyond what the previous build of this slice reported. Archiving (R-3.6), the registering vendor becoming owner (R-3.23) and the organizations a vendor may act for (R-3.15) are built but answered for in slice 12, through the team tab.
