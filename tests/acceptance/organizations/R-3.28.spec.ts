// criterion: @R-3.28 v1
// provenance: blind, spec@05e88fb7765c5d6327f910e43f990e6c321b63fa, derived 2026-10-18
import { test, expect, persona } from "../../fixtures";
import type { Surface } from "../../fixtures";

// The given is an organization approved for two service areas. Each test builds its own: the
// organization owner registers an organization under a name no other test or run uses, and the
// administrator approves it for the two areas. Nothing else reads or changes that organization,
// so what each test reads is what it did, whatever runs beside it.
const kept = "FULL_STACK_DEVELOPER";
const cleared = "AGILE_COACH";
// The third area to tick. No seed handle names the service areas the installation offers;
// this one is among those tests/seed/000-installation.sql puts in place.
const third = "DATA_PROFESSIONAL";

function details(legalName: string) {
  return {
    legalName,
    streetAddress: "28 Marine Way",
    addressLineTwo: "",
    city: "Victoria",
    region: "British Columbia",
    mailCode: "V8V1V1",
    country: "Canada",
    contactName: "Service Areas Test Contact",
    contactTitle: "",
    contactEmail: "service.areas@example.test",
    contactPhone: "",
    website: "",
  };
}

async function readOrEmpty(read: () => Promise<string>): Promise<string> {
  try {
    return (await read()) ?? "";
  } catch {
    return "";
  }
}

// A service area may be named by its code or by its label ("FULL_STACK_DEVELOPER" or "Full
// Stack Developer"), so it is matched on its words whichever way it is written.
function area(code: string): RegExp {
  return new RegExp(code.split("_").join("[\\s_-]*"), "i");
}

function approvedFor(approvals: string, codes: string[], not: string[]): boolean {
  return codes.every((code) => area(code).test(approvals)) && not.every((code) => !area(code).test(approvals));
}

async function approvalsAsAdministrator(surface: Surface, orgId: string): Promise<string> {
  await surface.signIn(persona.administrator);
  await surface.organizationEdit.open({ orgId });
  return readOrEmpty(() => surface.organizationEdit.serviceAreaCheckbox());
}

// Registers an organization of the test's own, owned by the organization owner, and has the
// administrator approve it for exactly the two areas of the given.
async function organizationApprovedForTwo(surface: Surface, purpose: string): Promise<string> {
  const unique = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  await surface.signIn(persona.organizationOwner);
  await surface.organizationCreate.open();
  await surface.organizationCreate.createOrganization(details(`Service Areas ${purpose} ${unique} Ltd.`));
  const orgId = await readOrEmpty(() => surface.organizationEdit.organizationIdentifier());
  expect(orgId, "registering the test's own organization did not land on an organization the test can address").toBeTruthy();

  await surface.signIn(persona.administrator);
  await surface.organizationEdit.open({ orgId });
  await surface.organizationEdit.editServiceAreas();
  await surface.organizationEdit.saveServiceAreas({ serviceAreas: [kept, cleared] });
  await expect
    .poll(async () => approvedFor(await approvalsAsAdministrator(surface, orgId), [kept, cleared], [third]), {
      message: `the organization does not stand approved for exactly ${kept} and ${cleared}`,
    })
    .toBe(true);
  return orgId;
}

// The criterion promises that the owner is offered no editing control, not a message. A
// control that is not offered, or is offered and cannot be used, is that refusal, so an
// attempt the page does not let through is not itself a failure; what is asserted is that the
// approvals did not change.
async function attempt(action: () => Promise<void>): Promise<void> {
  await action().catch(() => undefined);
}

test("saving a selection of service areas replaces the organization's previous approvals entirely", async ({ surface }) => {
  const orgId = await organizationApprovedForTwo(surface, "Replaced");

  await surface.signIn(persona.administrator);
  await surface.organizationEdit.open({ orgId });
  await surface.organizationEdit.editServiceAreas();
  await surface.organizationEdit.saveServiceAreas({ serviceAreas: [kept, third] });

  await expect
    .poll(async () => approvedFor(await approvalsAsAdministrator(surface, orgId), [kept, third], [cleared]), {
      message: `the organization is not approved for exactly ${kept} and ${third} once the save has completed`,
    })
    .toBe(true);
});

test("only an administrator may set which service areas an organization is approved for, not the organization's own owner", async ({
  surface,
}) => {
  const orgId = await organizationApprovedForTwo(surface, "Owner Refused");

  await surface.signIn(persona.organizationOwner);
  await surface.organizationEdit.open({ orgId });
  await attempt(() => surface.organizationEdit.editServiceAreas());
  await attempt(() => surface.organizationEdit.saveServiceAreas({ serviceAreas: [kept, third] }));

  expect(approvedFor(await approvalsAsAdministrator(surface, orgId), [kept, cleared], [third])).toBe(true);
});
