import {
  getPrimaryAction,
  getSecondaryActions,
  type AssignedDelivery,
  type AssignedDeliveryAction,
} from "../../../utils/assignedDeliveriesStorage";
import { DeliveryActionButton } from "./DeliveryActionButton";

interface DeliveryCardActionsProps {
  delivery: AssignedDelivery;
  onAction: (delivery: AssignedDelivery, action: AssignedDeliveryAction) => void;
}

export function DeliveryCardActions({ delivery, onAction }: DeliveryCardActionsProps) {
  const primaryAction = getPrimaryAction(delivery.status);
  const secondaryActions = getSecondaryActions(delivery.status);

  return (
    <div className="agrivo-assigned-card__actions">
      {primaryAction ? (
        <div className="agrivo-assigned-card__actions-primary">
          <DeliveryActionButton
            action={primaryAction}
            variant="primary"
            onClick={() => onAction(delivery, primaryAction)}
          />
        </div>
      ) : null}

      {secondaryActions.length > 0 ? (
        <div className="agrivo-assigned-card__actions-secondary">
          {secondaryActions.map((action) => (
            <DeliveryActionButton
              key={action}
              action={action}
              variant="secondary"
              onClick={() => onAction(delivery, action)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
