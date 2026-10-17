/**
 * The site shell's own style sheet, as `design/catalogue/site.tsx` writes it: the skip link, the
 * account area, the marked section, the phone menu, and two corrections to the design system.
 *
 * The current section is marked three ways: `aria-current="page"`, a bar and bold text. A bar and
 * bold text are what make it visible without relying on colour.
 *
 * The skip link is the first thing on the page, drawn as the design system draws its own. The
 * design system's Header places its skip links after the logo link, which would make "Skip to
 * main content" the second Tab stop.
 *
 * A Link drawn as a button keeps the browser's underline for links, which the design system's
 * button styles do not remove, so it is removed here. The Footer gives the logo block and the
 * link list minimum widths wider than a 320-pixel screen less the footer's padding, so on small
 * screens both shrink to the screen instead of scrolling it sideways.
 */
export const SITE_CSS = `
a.bcds-react-aria-Button {
  text-decoration: none;
}
.site-skip {
  position: absolute;
  z-index: 1;
  top: var(--layout-padding-small);
  left: -100000px;
  padding: var(--layout-padding-xsmall) var(--layout-padding-medium);
  background-color: var(--surface-color-forms-default);
  color: var(--typography-color-link);
  font: var(--typography-regular-body);
  white-space: nowrap;
}
.site-skip:focus {
  left: var(--layout-padding-medium);
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
}
.site-menu-toggle {
  margin-inline-start: auto;
}
.site-account {
  display: flex;
  align-items: center;
  gap: var(--layout-margin-small);
}
.site-header .bcds-Subheader a[aria-current="page"] {
  font-weight: var(--typography-font-weights-bold);
  box-shadow: inset 0 calc(-1 * var(--layout-border-width-large)) 0 var(--surface-color-primary-default);
}
.site-menu {
  background-color: var(--surface-color-background-white);
  border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
  padding-block: var(--layout-padding-small) var(--layout-padding-medium);
}
.site-menu-name {
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-small) var(--layout-padding-medium);
  font: var(--typography-bold-h4);
  color: var(--typography-color-primary);
}
.site-menu ul {
  list-style: none;
  margin: var(--layout-margin-none);
  padding: var(--layout-padding-none);
}
.site-menu li {
  display: flex;
  padding-block: var(--layout-padding-small);
  border-left: var(--layout-border-width-large) solid transparent;
}
.site-menu li:has(> a[aria-current="page"]) {
  border-left-color: var(--surface-color-primary-default);
}
.site-menu li > a[aria-current="page"] {
  font-weight: var(--typography-font-weights-bold);
}
.site-menu-account {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--layout-margin-small);
  margin-top: var(--layout-margin-small);
  padding: var(--layout-padding-medium) var(--layout-padding-medium) var(--layout-padding-small);
  border-top: var(--layout-border-width-small) solid var(--surface-color-border-default);
}
.site-menu-account > a {
  justify-content: center;
}
.site-menu-account > p {
  margin: var(--layout-margin-none);
}
.site-menu-account nav {
  margin-inline: calc(-1 * var(--layout-padding-medium));
}
@media (max-width: 575px) {
  .bcds-footer > .bcds-footer--container > .bcds-footer--container-content > .bcds-footer--logo-links > .bcds-footer--logo,
  .bcds-footer > .bcds-footer--container > .bcds-footer--container-content > .bcds-footer--logo-links.horizontal > .bcds-footer--links {
    min-width: 0;
    max-width: 100%;
  }
}
`;
