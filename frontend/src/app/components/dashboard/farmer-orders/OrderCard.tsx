import { Eye, Truck, UserRound } from "lucide-react";
import {
  formatOrderCurrency,
  formatOrderQuantity,
  type FarmerManagementOrder,
  type FarmerManagementOrderStatus,
} from "../../../utils/farmerOrdersStorage";
import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import { Button } from "../../ui/button";
import { FarmerMgmtOrderStatusBadge } from "./FarmerMgmtOrderStatusBadge";

interface OrderCardProps {
  order: FarmerManagementOrder;
  onViewDetails: (order: FarmerManagementOrder) => void;
  onStatusChange: (orderId: string, status: FarmerManagementOrderStatus) => void;
  onReject: (order: FarmerManagementOrder) => void;
}

export function OrderCard({ order, onViewDetails, onStatusChange, onReject }: OrderCardProps) {
  const primaryAction = getPrimaryAction(order.status);

  return (
    <article className="agrivo-farmer-order-card agrivo-card">
      <div className="agrivo-farmer-order-card__header">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">Order ID</p>
          <p className="mt-0.5 truncate text-sm font-bold text-[#102018]">{order.orderId}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <FarmerMgmtOrderStatusBadge status={order.status} />
          <p className="text-xs text-[#6b7a70]">{order.orderDateLabel}</p>
        </div>
      </div>

      <div className="agrivo-farmer-order-card__body">
        <div className="agrivo-farmer-order-card__buyer">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5]">
            <UserRound className="h-4 w-4 text-[#14532D]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#102018]">{order.buyerName}</p>
            <p className="text-xs text-[#6b7a70]">{order.buyerType}</p>
          </div>
        </div>

        <div className="agrivo-farmer-order-card__product">
          <div className="agrivo-product-title-block !mt-0">
            <p className="text-sm font-semibold text-[#102018]">{order.productName}</p>
            <ProductVarietyBadge variety={order.variety} />
          </div>
        </div>

        <dl className="agrivo-farmer-order-card__meta">
          <div>
            <dt>Quantity</dt>
            <dd>{formatOrderQuantity(order)}</dd>
          </div>
          <div>
            <dt>Total price</dt>
            <dd>{formatOrderCurrency(order.totalPrice)}</dd>
          </div>
          <div className="agrivo-farmer-order-card__meta-delivery">
            <dt>
              <Truck className="h-3.5 w-3.5" aria-hidden />
              Delivery
            </dt>
            <dd>{order.deliveryMethod}</dd>
          </div>
        </dl>
      </div>

      <div className="agrivo-farmer-order-card__actions">
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>

        {primaryAction ? (
          <Button
            type="button"
            className="agrivo-button-soft rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={() => onStatusChange(order.id, primaryAction.nextStatus)}
          >
            {primaryAction.label}
          </Button>
        ) : null}

        {order.status === "pending" ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
            onClick={() => onReject(order)}
          >
            Reject
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function getPrimaryAction(
  status: FarmerManagementOrderStatus,
): { label: string; nextStatus: FarmerManagementOrderStatus } | null {
  switch (status) {
    case "pending":
      return { label: "Accept Order", nextStatus: "accepted" };
    case "accepted":
      return { label: "Mark as Preparing", nextStatus: "preparing" };
    case "preparing":
      return { label: "Mark as Ready", nextStatus: "ready_for_pickup" };
    case "ready_for_pickup":
      return { label: "Mark as Delivered", nextStatus: "delivered" };
    default:
      return null;
  }
}
