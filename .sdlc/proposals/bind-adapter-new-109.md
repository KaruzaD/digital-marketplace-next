---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I made both changes the rulings asked for in `tests/adapters/new/index.ts` and changed nothing else."
opened: 2026-10-18T19:25:31.226Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I made both changes the rulings asked for in `tests/adapters/new/index.ts` and changed nothing else.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I made both changes the rulings asked for in `tests/adapters/new/index.ts` and changed nothing else. `bindings.yaml` is unchanged because both members were already `bound`. I could not run the type check: the tool refused to run `tsc` without approval. I checked the new code by hand against the helpers it calls (`actionControl`, `isDisabled`, `settle`, `ready`, `carried`, `regionNamed`), and their signatures match. I did not open the target in the browser again for this revision.

**Condition 1 (R-3.28, `organizationEdit.serviceAreaCheckbox`).** Before, the member skipped the "Approved service areas" list whenever an "Edit service areas" button was offered. It opened the editor instead and read the ticked boxes, and that read did not give back both areas. Now the order is:
- If the service-area form is already open, the member reads the ticked boxes, as before.
- If the form is closed, it reads the approved areas first: the elements with the `organization-service-area` test ID where the page has them, otherwise the items of the "Approved service areas" region. It does this whether or not "Edit service areas" is offered.
- Only when the section draws no such list at all does it open the editor to read the ticked boxes (and cancel it afterwards). If there is no editor either, it returns empty.

What it returns has the same form as before: one area per line, approved areas only.

**Condition 2 (R-8.31, `opportunityCwuEdit.deleteOpportunity`).** This used to return as soon as the existing confirm step finished, while the delete was still running. It now goes on waiting, for up to 30 seconds, until the page is no longer `/opportunities/code-with-us/<id>/edit`. It then lets the next page settle before returning.

One case would otherwise have waited out the full time: the service refusing the delete and leaving the page where it was. So if the Delete control stays enabled on that same page for three seconds in a row, the member takes that as a refusal and returns, and the test's own next reading decides the outcome. The three seconds stop it from mistaking the brief moment before the button disables for a refusal. If the page is still the edit page with its actions disabled after 30 seconds, the member throws an error naming that state, instead of letting the next read run against a delete that has not finished.

The ruling named the Code With Us page, so I changed only that one. The Sprint With Us and Team With Us delete members use a separate helper (`programManage.act`), which I left as I found it.

No condition was deferred, and nothing outside `tests/adapters/new/` was touched or needed changing.
