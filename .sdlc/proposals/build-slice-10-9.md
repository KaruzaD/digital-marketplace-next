---
gate: G3
question: "Does slice 10 (Staff can create Sprint With Us and Team With Us opportunities with an evaluation panel) do what its criteria say?"
recommendation: "The application build-slice-10-8 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-18T09:57:04.612Z
---

# Does slice 10 (Staff can create Sprint With Us and Team With Us opportunities with an evaluation panel) do what its criteria say?

**Recommendation.** The application build-slice-10-8 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-10-8 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to derive-tests: Rewrite tests/acceptance/organizations/R-3.28.spec.ts so nothing another test does can change what it reads. It sets its scenario up on seed.organizations.qualified (00000000-0000-4000-8000-000000000301), which other tests also read and change while verify runs the suite in parallel across copies of the application, so it passes or fails by timing: it passed in the verifies of build-slice-14-8, build-slice-1-11 and build-slice-2-17, and failed in build-slice-10-8's at line 58 ('the organization does not stand approved for exactly FULL_STACK_DEVELOPER and AGILE_COACH') while the page showed exactly Full stack developer and Agile coach approved. Give the test an organization of its own that no other test reads or changes, created in the test through the surface and approved for the service areas it needs, and read and change only that organization.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.
