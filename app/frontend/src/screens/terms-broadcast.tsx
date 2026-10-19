import { useState } from "react";
import { AlertDialog, Button, InlineAlert, Modal } from "@bcgov/design-system-react-components";
import { announceUpdatedTerms } from "../api/notifications";
import { NotificationStyles } from "../app/notification-kit";
import { Actions, Region } from "../app/opportunity-kit";

type Outcome = "notified" | "failed" | null;

/**
 * "Notify vendors of updated terms", the region the managing screen of the service's own terms
 * and conditions page carries after its current wording, and no other page does
 * (notification-terms-broadcast; R-7.13). It asks before anything happens, and once confirmed
 * withdraws every vendor's acceptance and has the active ones emailed (R-6.23). Success is
 * reported as soon as the service answers, which is before the emails have gone, and the wording
 * claims no more than that (R-6.24).
 *
 * Drawn as the catalogue's `TermsBroadcastPage` draws its region: the outcome first, the two
 * sentences, then the button in `Actions`. Edit page is the screen's one primary action, so this
 * button is secondary.
 */
export function TermsBroadcast() {
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  async function notify() {
    setSending(true);
    const answer = await announceUpdatedTerms();
    setSending(false);
    setAsking(false);
    setOutcome(answer === "announced" ? "notified" : "failed");
  }

  return (
    <>
      <NotificationStyles />
      <Region id="notify-vendors-heading" title="Notify vendors of updated terms">
        {outcome === "notified" ? (
          <div data-testid="notify-vendors-success">
            <InlineAlert
              variant="success"
              role="status"
              title="Vendors have been notified"
              description="Every vendor's acceptance of the terms has been withdrawn. Emails asking active vendors to read and accept the new terms are being sent now. This page will not report whether each email arrives."
            />
          </div>
        ) : null}
        {outcome === "failed" ? (
          <div data-testid="notify-vendors-failure">
            <InlineAlert
              variant="danger"
              role="alert"
              title="Vendors have not been notified"
              description="The service could not complete the announcement. Try again."
            />
          </div>
        ) : null}
        <p className="op-text">
          Use this once the changed terms are published. Every vendor's acceptance of the terms is withdrawn, and each
          active vendor is emailed asking them to read and accept the new terms. Until they accept, they cannot submit
          proposals to Code With Us, Sprint With Us or Team With Us.
        </p>
        <p className="op-text">
          Deactivated vendors are not emailed. Their acceptance is withdrawn too, and they will find the change when they
          next sign in.
        </p>
        <Actions>
          <Button
            variant="secondary"
            onPress={() => {
              setOutcome(null);
              setAsking(true);
            }}
            data-testid="notify-vendors-button"
          >
            Notify vendors of updated terms
          </Button>
        </Actions>
      </Region>
      <Modal isOpen={asking} isDismissable onOpenChange={(open) => (sending ? undefined : setAsking(open))}>
        <AlertDialog
          variant="warning"
          title="Notify vendors that the terms have changed?"
          data-testid="notify-vendors-dialog"
          buttons={
            <>
              <Button
                variant="secondary"
                isDisabled={sending}
                onPress={() => setAsking(false)}
                data-testid="notify-vendors-cancel-button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={sending}
                onPress={() => void notify()}
                data-testid="notify-vendors-confirm-button"
              >
                Notify vendors
              </Button>
            </>
          }
        >
          <p className="op-text">
            Every vendor's acceptance of the terms and conditions will be withdrawn, and each active vendor will be
            emailed asking them to read and accept the new terms.
          </p>
          <p className="op-text">
            Withdrawn acceptances cannot be restored. Each vendor has to accept the new terms themselves.
          </p>
        </AlertDialog>
      </Modal>
    </>
  );
}
