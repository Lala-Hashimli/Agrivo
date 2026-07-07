import {
  getPrimaryPickupAction,
  getSecondaryPickupActions,
  type PickupTask,
  type PickupTaskAction,
} from "../../../utils/pickupTasksStorage";
import { PickupActionButton } from "./PickupActionButton";

interface PickupCardActionsProps {
  task: PickupTask;
  onAction: (task: PickupTask, action: PickupTaskAction) => void;
}

export function PickupCardActions({ task, onAction }: PickupCardActionsProps) {
  const primaryAction = getPrimaryPickupAction(task.status);
  const secondaryActions = getSecondaryPickupActions(task.status);

  return (
    <div className="agrivo-assigned-card__actions">
      {primaryAction ? (
        <div className="agrivo-assigned-card__actions-primary">
          <PickupActionButton
            action={primaryAction}
            variant={primaryAction === "move_to_in_transit" ? "primary" : "primary"}
            onClick={() => onAction(task, primaryAction)}
          />
        </div>
      ) : null}

      {secondaryActions.length > 0 ? (
        <div className="agrivo-assigned-card__actions-secondary">
          {secondaryActions.map((action) => (
            <PickupActionButton
              key={action}
              action={action}
              variant="secondary"
              onClick={() => onAction(task, action)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
