---
gate: G3
question: "Does slice 1 (A visitor can read the service's own pages) do what its criteria say?"
recommendation: "The application build-slice-1-8 carried is proposed again unchanged, because the ruling on it asked nothing of the build."
opened: 2026-10-17T20:05:30.274Z
---

# Does slice 1 (A visitor can read the service's own pages) do what its criteria say?

**Recommendation.** The application build-slice-1-8 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

The application build-slice-1-8 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Its one condition went to another stage:

- to bind-adapter: R-7.19: contentFooter scopes every read to siteFooter(), which is `getByRole("contentinfo").or(getByText("Owned and operated by the B.C. Government.", {exact:true}).locator("xpath=..")).last()`. On / the page now draws that line in its own small block inside the footer, so `.last()` picks the line's parent rather than the whole footer. presentWhenSignedOut read only "Owned and operated by the B.C. Government." and aboutLink read "". The page does show the five links, labelled About, Disclaimer, Privacy, Accessibility and Copyright, in the footer's link list beside that block (evidence .sdlc/evidence/slice-1/R-7.19.png). Scope the footer to the whole footer region (the outermost match, or the contentinfo landmark on its own), not to the parent of the ownership line.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.
