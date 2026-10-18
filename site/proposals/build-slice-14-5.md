| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T03:08:01.996Z |
| holder | agent:reviewer |

# Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?

**Recommendation.** The application build-slice-14-4 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-14-4 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 3 conditions went to another stage:

- to bind-adapter: R-2.12: proposalCwuEdit.status() read "" from a 'Status' term in the details list on /opportunities/code-with-us/:opportunityId/proposals/:proposalId/edit; the page no longer has a Status term and shows the status as the label beside the program in the page head ('Code With Us Draft' in the outline), the element carrying test ID proposal-status, which is what the contract surface binds proposal-cwu-edit status to; read it from there.
- to bind-adapter: R-2.15: in the case 'a draft submitted after the deadline', proposalCwuEdit.status() read "" for the same reason: the manage page shows 'Draft' as the head's status label carrying test ID proposal-status, not as a 'Status' term in the details list; bind status to proposal-status as the contract surface says.
- to bind-adapter: R-8.22, R-8.31, R-1.35, R-1.36, R-2.2, R-2.3, R-2.4, R-2.13, R-2.23: proposal-cwu-create.choose_proponent_individual and choose_proponent_organization were reported unbound because chooseProponent looks for a radio named exactly 'An individual' / 'An organization' under 'Who is submitting this proposal?'; the create page now offers the radios labelled 'Individual' and 'Organization' under 'Will you be submitting a proposal for this opportunity as an Individual or Organization?' (the manage page's edit form keeps 'An individual' / 'An organization'), and both carry the test IDs proposal-proponent-individual and proposal-proponent-organization that the contract surface binds these members to; locate them by those test IDs, or by a label that accepts both wordings.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

_Ruled: return by runner:verify_
