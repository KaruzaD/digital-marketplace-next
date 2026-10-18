import type { ReactNode } from "react";

/**
 * The notifications domain's own pieces, as `design/catalogue/notification-kit.tsx` draws them: a
 * row that holds a sentence and the button beside it, and the status region an immediate save
 * reports into. Built on `./opportunity-kit`; none of them is a design-system component.
 */

const css = `
.nt-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--layout-margin-medium); }
.nt-row > * { margin: var(--layout-margin-none); }
.nt-saved { margin: var(--layout-margin-none); font: var(--typography-regular-small-body); color: var(--typography-color-secondary); }
.nt-saved:empty { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (max-width: 767.98px) {
  .nt-row > button { flex: 1 1 100%; justify-content: center; }
}
`;

export function NotificationStyles() {
  return <style>{css}</style>;
}

/** A sentence and the control beside it, sharing a line where they fit; on a phone the button goes full width. */
export function NoticeRow({ children }: { children: ReactNode }) {
  return <div className="nt-row">{children}</div>;
}

/**
 * The status region a control that saves at once reports into. It is present before anything is
 * saved, so the outcome is announced; while empty it takes no room but stays in the accessibility tree.
 */
export function SaveStatus({ children }: { children?: ReactNode }) {
  return (
    <p role="status" className="nt-saved">
      {children}
    </p>
  );
}
