---
gate: G3
question: "Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?"
recommendation: "The application build-slice-14-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T04:31:16.385Z
---

# Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?

**Recommendation.** The application build-slice-14-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-14-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to derive-tests: Rewrite tests/acceptance/organizations/R-3.28.spec.ts so its two cases cannot change each other's state. Both cases change the approved service areas of the same seeded organization (seed.organizations.qualified, 00000000-0000-4000-8000-000000000301), and verify runs seven instances in parallel. In slice 14's run, case 1 failed at line 74 while the page showed exactly Data professional + Full stack developer, which is what it was waiting for. Case 2 failed at line 51 while the page showed exactly Agile coach + Full stack developer, which is what it was waiting for. Each poll saw the other case's write. Run the two cases serially, or give each case an organization the other does not change. Do not let either rely on another case leaving the seed's approvals in place.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.
