---
stage: "build"
title: "build slice 8"
at: "2026-10-18T00:47:26.804Z"
cost: 0
turns: 0
session: ""
---

The application build-slice-8-13 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 2 conditions went to another stage:

- to bind-adapter: R-1.3: in both cases (public sector staff; administrator) opportunityList.openGroup() read '' at /opportunities, but the page shows 'Seeded published Code With Us opportunity' as a level-3 heading inside the region whose heading is 'Open Opportunities 3' (evidence R-1.3.txt and R-1.3-2.txt). The open group's heading name includes its count, and OPPORTUNITY_GROUPS in tests/adapters/new/index.ts (/^open(?: opportunities)?$/i and its siblings) is anchored so that it does not match 'Open Opportunities 3', so groupSection and the heading fallback both find nothing and opportunityGroup returns ''. Match a group heading or region whose name is followed by a count, e.g. /^open(?: opportunities)?(?:\s+\d+)?$/i, for all three groups.
- to bind-adapter: R-1.38: opportunityList.openGroup() read '' at /opportunities after publishing, but the page shows 'R-1.38 open opportunity whose deadline is sooner' (closes December 17, 2026) and then 'R-1.38 open opportunity whose deadline is later' (closes February 15, 2027) inside the region headed 'Open Opportunities 5' (evidence R-1.38.txt). This is the same cause as R-1.3: the OPPORTUNITY_GROUPS pattern for the open group does not allow the count that follows the heading's words, so the adapter never finds the open group's section.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.