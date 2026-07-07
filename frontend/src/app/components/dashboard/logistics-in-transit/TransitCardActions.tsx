import {
  getPrimaryTransitAction,
  getSecondaryTransitActions,
  type InTransitDelivery,
  type InTransitAction,
} from "../../../utils/inTransitStorage";
import { TransitActionButton } from "./TransitActionButton";

export function TransitCardActions({
  delivery,
  onAction,
}: {
  delivery: InTransitDelivery;
  onAction: (delivery: InTransitDelivery, action: InTransitAction) => void;
}) {
  const primary = getPrimaryTransitAction(delivery.status);
  const secondary = getSecondaryTransitActions(delivery.status);

  return (
    <div className="agrivo-assigned-card__actions">
      {primary ? (
        <div className="agrivo-assigned-card__actions-primary">
          <TransitActionButton
            action={primary}
            variant="primary"
            onClick={() => onAction(delivery, primary)}
          />
        </div>
      ) : null}
      {secondary.length > 0 ? (
        <div className="agrivo-assigned-card__actions-secondary">
          {secondary.map((action) => (
            <TransitActionButton
              key={action}
              action={action}
              variant={action === "report_issue" ? "danger" : "secondary"}
              onClick={() => onAction(delivery, action)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
