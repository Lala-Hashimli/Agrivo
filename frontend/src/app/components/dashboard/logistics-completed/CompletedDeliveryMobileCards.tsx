import type { CompletedDelivery } from "../../../utils/completedDeliveriesStorage";
import { CompletedDeliveryCard } from "./CompletedDeliveryCard";

export function CompletedDeliveryMobileCards({
  deliveries,
  onView,
}: {
  deliveries: CompletedDelivery[];
  onView: (delivery: CompletedDelivery) => void;
}) {
  return (
    <div className="agrivo-completed-deliveries-mobile-view">
      {deliveries.map((delivery) => (
        <CompletedDeliveryCard key={delivery.id} delivery={delivery} onView={onView} />
      ))}
    </div>
  );
}
