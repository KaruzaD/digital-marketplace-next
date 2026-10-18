---
gate: G3
question: "Does slice 12 (An organization can build its team) do what its criteria say?"
recommendation: "The application build-slice-12-6 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T19:27:50.278Z
---

# Does slice 12 (An organization can build its team) do what its criteria say?

**Recommendation.** The application build-slice-12-6 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-12-6 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 2 conditions went to another stage:

- to bind-adapter: R-3.28: organizationEdit.serviceAreaCheckbox, read as the administrator on /organizations/<id>/edit with the Team With Us qualification section closed, did not report the approvals the page shows. .sdlc/evidence/slice-12/R-3.28.png shows the region 'Approved service areas' listing exactly 'Agile coach' and 'Full stack developer', with an 'Edit service areas' button beneath it. Because that button is present, the member skips the listed approvals and opens the edit form to read ticked checkboxes, and that read did not yield both areas. Read the approvals from the 'Approved service areas' list whenever the form is not already open, whether or not an 'Edit service areas' button is offered.
- to bind-adapter: R-8.31: opportunityCwuEdit.deleteOpportunity returned before the deletion had finished. The outline captured at failure (.sdlc/evidence/slice-12/R-8.31.txt) is still /opportunities/code-with-us/<id>/edit, with the Edit, Submit for review and Delete actions all disabled, meaning the delete was still in flight. The screenshot taken afterwards (.sdlc/evidence/slice-12/R-8.31.png) is the Dashboard, so the deletion did complete. The fileDownload read that followed ran before the delete finished and was let through. After confirming the delete, wait until the management page has been left (the URL is no longer the opportunity's edit page) before returning.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Does slice 12 (An organization can build its team) do what its criteria say? Approve. Verify recorded pass for this proposal against application tree febd809: all 19 criteria the slice claims were exercised and met, none failed or went unasserted. The two conditions from build-slice-12-6 were addressed to bind-adapter and asked nothing of build, so proposing the same application again was correct; this run passing is consistent with those fixes. The diff restyles slice 12's own screens (team and changelog tabs, a vendor's own organizations) using organization-kit pieces and a new organization-memberships module: a table on a wide screen, cards on a phone. Decision record 0080 gives the reason for each place it departs from the design stories (separate missing-capabilities region for R-3.34, Remove on the owner's row for R-3.11, two-step change owner, one combined field-error). No test ID, wording or behaviour changes beyond the added status announcements. Nothing belongs to another slice, no secret, credential or personal data appears (names in tests are placeholders), and the new seams have unit tests: membership words and colours, the status region, and phone-card rendering for the team, the changelog and both membership lists. The DialogText import resolves to an existing export in organization-kit.tsx. This would change on a verify result that fails against this tree or evidence that a test ID or wording the acceptance tests rely on changed.

**Conditions:**
none
