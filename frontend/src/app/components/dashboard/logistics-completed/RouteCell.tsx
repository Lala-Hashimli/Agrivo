import {
  formatRoute,
  truncateText,
  type CompletedDelivery,
} from "../../../utils/completedDeliveriesStorage";

export function RouteCell({ delivery }: { delivery: CompletedDelivery }) {
  const { pickup, dropoff } = formatRoute(delivery.pickupLocation, delivery.dropoffLocation);
  const fullRoute = `${pickup} → ${dropoff}`;

  return (
    <div className="agrivo-completed-route-cell" title={fullRoute}>
      <span className="agrivo-completed-route-cell__line agrivo-completed-route-cell__pickup">
        {truncateText(pickup, 34)}
      </span>
      <span className="agrivo-completed-route-cell__line agrivo-completed-route-cell__dropoff">
        <span className="agrivo-completed-route-cell__arrow" aria-hidden>
          →
        </span>
        {truncateText(dropoff, 32)}
      </span>
    </div>
  );
}
