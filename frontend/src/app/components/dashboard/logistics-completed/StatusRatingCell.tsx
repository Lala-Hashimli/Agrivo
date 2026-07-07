import type { CompletedDelivery } from "../../../utils/completedDeliveriesStorage";
import { CompletionStatusBadge } from "./CompletionStatusBadge";
import { RatingDisplay } from "./RatingDisplay";

export function StatusRatingCell({ delivery }: { delivery: CompletedDelivery }) {
  return (
    <div className="agrivo-completed-status-rating-cell">
      <CompletionStatusBadge status={delivery.status} short />
      <RatingDisplay rating={delivery.rating} showEmpty />
    </div>
  );
}
