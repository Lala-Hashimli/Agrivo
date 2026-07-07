import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import type { CompletedDelivery } from "../../../utils/completedDeliveriesStorage";

export function ProductCell({ delivery }: { delivery: CompletedDelivery }) {
  return (
    <div className="agrivo-completed-product-cell">
      <p className="agrivo-completed-product-cell__name">{delivery.productName}</p>
      <ProductVarietyBadge
        variety={delivery.variety}
        showLabel={false}
        size="sm"
        compact
      />
    </div>
  );
}
