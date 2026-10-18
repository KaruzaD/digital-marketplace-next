---
gate: G3
question: "Does this adapter bind every surface action and observation on new, and nothing else?"
recommendation: "I fixed the opportunity list's group reader on the new target as the ruling asked."
opened: 2026-10-18T00:33:28.701Z
backend: claude
model: "claude-opus-5-5"
cli: "2.1.300 (Claude Code)"
isolation: "none"
---

# Does this adapter bind every surface action and observation on new, and nothing else?

**Recommendation.** I fixed the opportunity list's group reader on the new target as the ruling asked.

**Worked by:** claude claude-opus-5-5 (2.1.300 (Claude Code))

I fixed the opportunity list's group reader on the new target as the ruling asked. I checked the new logic in the browser, but I could not run the type-checker or the test suite.

**What changed.** The ruling (build-slice-8-12, G3) said the reader for the Unpublished, Open and Closed groups took the lines after a group's heading as its rows, up to the next group heading. When Closed was the last group and collapsed, it read the program descriptions panel that follows as Closed's rows. It also never opened the group, so the seeded closed Sprint With Us opportunity was reported missing for an administrator.

I signed in through the identity provider as the administrator and opened the opportunity list. Each group is its own section under a level-2 heading: "Unpublished", "Open", "Closed". Each holds one line of description and then its list of opportunity cards. None of the groups was collapsed when I looked.

The reader in `tests/adapters/new/index.ts` now works like this:
- **Collapsed groups first.** If the group's header is a button marked collapsed, it clicks it and waits for it to open. A group drawn as a closed disclosure inside its section is opened the same way.
- **Finding the section.** It looks for the section that holds this group's heading or header button and no other group's.
- **Reading rows.** It reads the text inside that section only, drops the heading and any count shown beside it, and returns what is left. Anything after the last group on the page can no longer be read as its rows.
- **Output format.** It is the same as before: the description line, then each card's lines, separated by newlines.
- **Group not shown.** If the list doesn't show this reader the group at all, it still returns an empty answer.
- **New failure case.** If the heading is there but no section of its own holds it, the reader now throws `unbound:` naming the group.

**Checked.** I ran the same logic against the live page as the administrator. Each group matched exactly one section, and its text started with that group's own description line. The Closed group's rows include "Seeded closed Sprint With Us opportunity" and end with the last closed card. I did not see a collapsed group on this build, so the opening step has not been tried on a real collapsed group.

**Not checked.** Running `tsc` and the suite both needed approval, which nobody was here to give. I read the changed code by hand and the types should hold, but the first proper compile will be the next run.

**One limitation.** The pattern for a group's header is unchanged: it must read exactly "Unpublished", "Open" or "Closed", optionally followed by "Opportunities". A collapsed header that puts a count inside its name, such as "Closed Opportunities 12", would not be recognized. I left the pattern alone because other readers use it and the ruling didn't name them.

Nothing else in the adapter was touched. `bindings.yaml` is unchanged, since all three groups were already listed as bound. Every page route I opened during this run resolved.

## Ruling

**Verdict:** approve
**By:** agent:reviewer
**Ruled on:** claude claude-opus-5-5 (2.1.300 (Claude Code))

Does the new adapter bind the opportunity list's group readers as the build-slice-8-12 ruling asked, and nothing else? Approve. The diff touches only tests/adapters/new/index.ts and nothing under tests/acceptance. opportunityGroup now opens a header button marked collapsed before reading. The new groupSection finds the region or group holding this group's heading and no other group's. Rows are read from inside that section only, with the heading and any count beside it dropped, so whatever follows the last group (the program descriptions panel) can no longer be read as Closed's rows. That is the fault the ruling named. The bindings are navigation and locators only: they return text and assert nothing. A heading with no section of its own reports unbound with a specific reason. The runner's tsc on this revision passed with no diagnostics under adapters/new. The author's live check found one section per group, with the seeded closed Sprint With Us opportunity read under Closed. The residual risk is that the opening step has not yet met a real collapsed group. build-slice-8-12#2 will collapse Closed again, and the next verify run will exercise that path. If it fails there, the adapter goes back with that evidence. build-slice-8-12#2 is the build stage's work and is not settled here, so it stays open. What would change this ruling: a verify run against the collapsed Closed group showing the reader still cannot open it or read its cards.

**Conditions:**
none

### Runner-owned typecheck evidence

Proposal revision: `a8b8c25e8cb0384282382e89a3bb6797def24a92`
Typecheck: **passed**; exit code: 0.
Command (in `tests`): `node node_modules/typescript/bin/tsc --noEmit --incremental false --pretty false`
Diagnostics below are those under `adapters/new/`, which this proposal answers for.

    No diagnostics.
