---
stage: "build"
title: "build slice 12"
at: "2026-10-18T19:27:50.070Z"
cost: 0
turns: 0
session: ""
---

The application build-slice-12-6 carried is proposed again unchanged, because the ruling on it asked nothing of the build.

Each of its 2 conditions went to another stage:

- to bind-adapter: R-3.28: organizationEdit.serviceAreaCheckbox, read as the administrator on /organizations/<id>/edit with the Team With Us qualification section closed, did not report the approvals the page shows. .sdlc/evidence/slice-12/R-3.28.png shows the region 'Approved service areas' listing exactly 'Agile coach' and 'Full stack developer', with an 'Edit service areas' button beneath it. Because that button is present, the member skips the listed approvals and opens the edit form to read ticked checkboxes, and that read did not yield both areas. Read the approvals from the 'Approved service areas' list whenever the form is not already open, whether or not an 'Edit service areas' button is offered.
- to bind-adapter: R-8.31: opportunityCwuEdit.deleteOpportunity returned before the deletion had finished. The outline captured at failure (.sdlc/evidence/slice-12/R-8.31.txt) is still /opportunities/code-with-us/<id>/edit, with the Edit, Submit for review and Delete actions all disabled, meaning the delete was still in flight. The screenshot taken afterwards (.sdlc/evidence/slice-12/R-8.31.png) is the Dashboard, so the deletion did complete. The fileDownload read that followed ran before the delete finished and was let through. After confirming the delete, wait until the management page has been left (the URL is no longer the opportunity's edit page) before returning.

No earlier condition on this line of work is open, so no builder session ran. The application is verified again with that other work in place.