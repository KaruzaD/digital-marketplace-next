| Field | Value |
| --- | --- |
| gate | G3 |
| opened | 2026-10-18T04:31:16.385Z |
| holder | agent:reviewer |

# Does slice 14 (A vendor can propose on a Code With Us opportunity) do what its criteria say?

**Recommendation.** The application build-slice-14-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-14-7 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to derive-tests: Rewrite tests/acceptance/organizations/R-3.28.spec.ts so its two cases cannot change each other's state. Both cases change the approved service areas of the same seeded organization (seed.organizations.qualified, 00000000-0000-4000-8000-000000000301), and verify runs seven instances in parallel. In slice 14's run, case 1 failed at line 74 while the page showed exactly Data professional + Full stack developer, which is what it was waiting for. Case 2 failed at line 51 while the page showed exactly Agile coach + Full stack developer, which is what it was waiting for. Each poll saw the other case's write. Run the two cases serially, or give each case an organization the other does not change. Do not let either rely on another case leaving the seed's approvals in place.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Question: does slice 14 (a vendor can propose on a Code With Us opportunity) do what its criteria say? Ruling: approve. The verify result is pass and current for this proposal (tree 30edc73, 18/18 claimed criteria met). The application is unchanged from build-slice-14-7, whose only condition was addressed to derive-tests (R-3.28 case isolation) and asked nothing of build. The diff is a design-direction restyle: a new proposal-kit, and the CWU create/manage form, manage page and vendor dashboard rebuilt on it, with every test ID, field, rule and state gate preserved. These behaviours still hold: draft saving with any field blank (R-2.12); terms gating on submit and acceptance recorded (R-2.3); client-side checks plus the deliberately unchecked closed-opportunity path (R-2.13, R-2.14, R-2.15); the existing-proposal redirect (R-2.2); delete and withdraw offered by state (R-2.4, R-2.23); the dashboard's own-versus-organization split (R-2.24). Dropping the create page's maxLength routes over-long text to the field-named refusal R-2.13 describes, and decision record 0072 records that. Unit tests cover the new seams: status colours, the focused error summary, the terms dialog's words and order, the draft-saved arrival notice, and the attachment add/remove round trip for R-8.31. No secrets or personal data: fixtures use placeholder UUIDs and example.test addresses. The ruling would change if a criterion-relevant test ID, field or check had been dropped, or if a criterion failed or went stale against this tree.

**Conditions:**
none
