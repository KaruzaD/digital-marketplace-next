---
gate: G3
question: "Does slice 8 (Anyone can find opportunities and follow the ones they care about) do what its criteria say?"
recommendation: "The application build-slice-8-13 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T00:47:26.857Z
---

# Does slice 8 (Anyone can find opportunities and follow the ones they care about) do what its criteria say?

**Recommendation.** The application build-slice-8-13 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-8-13 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 2 conditions went to another stage:

- to bind-adapter: R-1.3: in both cases (public sector staff; administrator) opportunityList.openGroup() read '' at /opportunities, but the page shows 'Seeded published Code With Us opportunity' as a level-3 heading inside the region whose heading is 'Open Opportunities 3' (evidence R-1.3.txt and R-1.3-2.txt). The open group's heading name includes its count, and OPPORTUNITY_GROUPS in tests/adapters/new/index.ts (/^open(?: opportunities)?$/i and its siblings) is anchored so that it does not match 'Open Opportunities 3', so groupSection and the heading fallback both find nothing and opportunityGroup returns ''. Match a group heading or region whose name is followed by a count, e.g. /^open(?: opportunities)?(?:\s+\d+)?$/i, for all three groups.
- to bind-adapter: R-1.38: opportunityList.openGroup() read '' at /opportunities after publishing, but the page shows 'R-1.38 open opportunity whose deadline is sooner' (closes December 17, 2026) and then 'R-1.38 open opportunity whose deadline is later' (closes February 15, 2027) inside the region headed 'Open Opportunities 5' (evidence R-1.38.txt). This is the same cause as R-1.3: the OPPORTUNITY_GROUPS pattern for the open group does not allow the count that follows the heading's words, so the adapter never finds the open group's section.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 8 do what its criteria say? Ruling: approve. The verify result is a pass, current for this proposal against application tree 0b89688: all nine claimed criteria (R-6.20, R-6.21, R-6.27, R-1.2, R-1.3, R-1.5, R-1.6, R-1.38, R-4.22) were exercised and met, so the two group-heading conditions sent to bind-adapter last round are settled. The code matches the criteria. Closed and Unpublished groups start collapsed but keep their rows in the document, so each opportunity still sits in exactly one group in the order R-1.38 sets. Who sees what is unchanged (R-1.2, R-1.3). Watch is still offered only to a signed-in person who did not create the opportunity (R-1.5, mayWatch). The new-opportunity control saves at once and reports into an always-present status region at every width (R-6.21, R-6.27). The one change outside the slice's own criteria is that the status filter is now offered to staff only and the search matches its words in order. Both are consistent with R-1.39 and the original list.tsx it cites, are recorded in decision record 0070, and are covered by unit tests (matchesSearch, isNarrowed, listStatusWords, emptyGroupWords). R-1.39's acceptance test filters by state as an administrator, so it is not contradicted. No protected path, secret or personal data is touched. opportunity-kit.tsx adds catalogue pieces this slice does not yet use (OpportunityHead, ManageTabs, ActionBar, Fieldset); they are unit-tested and come from the approved design kit, so this is noted rather than returned. The ruling would change to a return if a later run showed R-1.39 failing for a visitor or vendor persona, or if the hidden closed-group rows were found missing from the accessibility tree where a criterion needs them.

**Conditions:**
none
