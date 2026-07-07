import { MapPin, Phone, Mail, Truck, UserRound } from "lucide-react";
import {
  FARMER_ORDER_STATUS_LABELS,
  formatOrderCurrency,
  formatOrderQuantity,
  type FarmerManagementOrder,
} from "../../../utils/farmerOrdersStorage";
import { ProductVarietyBadge } from "../../products/ProductVarietyBadge";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { FarmerMgmtOrderStatusBadge } from "./FarmerMgmtOrderStatusBadge";

interface OrderDetailsModalProps {
  order: FarmerManagementOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-farmer-order-detail-dialog sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
            <div>
              <DialogTitle className="agrivo-heading text-xl font-bold text-[#102018]">
                Order {order.orderId}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-[#5F6F64]">
                Placed {order.orderDateLabel.toLowerCase()}
              </DialogDescription>
            </div>
            <FarmerMgmtOrderStatusBadge status={order.status} />
          </div>
        </DialogHeader>

        <div className="agrivo-farmer-order-detail-grid">
          <section className="agrivo-farmer-order-detail-section">
            <h4 className="agrivo-farmer-order-detail-heading">
              <UserRound className="h-4 w-4" />
              Buyer
            </h4>
            <p className="text-sm font-semibold text-[#102018]">{order.buyerName}</p>
            <p className="text-sm text-[#5F6F64]">{order.buyerType}</p>
            {order.buyerPhone ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-[#5F6F64]">
                <Phone className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
                {order.buyerPhone}
              </p>
            ) : null}
            {order.buyerEmail ? (
              <p className="mt-1 flex items-center gap-2 text-sm text-[#5F6F64]">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
                {order.buyerEmail}
              </p>
            ) : null}
          </section>

          <section className="agrivo-farmer-order-detail-section">
            <h4 className="agrivo-farmer-order-detail-heading">Product</h4>
            <p className="text-sm font-semibold text-[#102018]">{order.productName}</p>
            <ProductVarietyBadge variety={order.variety} className="mt-2" />
            <dl className="agrivo-farmer-order-detail-meta mt-3">
              <div>
                <dt>Quantity</dt>
                <dd>{formatOrderQuantity(order)}</dd>
              </div>
              <div>
                <dt>Price per unit</dt>
                <dd>{formatOrderCurrency(order.pricePerUnit)}</dd>
              </div>
              <div>
                <dt>Total price</dt>
                <dd>{formatOrderCurrency(order.totalPrice)}</dd>
              </div>
            </dl>
          </section>

          <section className="agrivo-farmer-order-detail-section">
            <h4 className="agrivo-farmer-order-detail-heading">
              <Truck className="h-4 w-4" />
              Delivery
            </h4>
            <p className="text-sm font-semibold text-[#102018]">{order.deliveryMethod}</p>
            <p className="mt-1 flex items-start gap-2 text-sm text-[#5F6F64]">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              {order.deliveryAddress}
            </p>
          </section>

          <section className="agrivo-farmer-order-detail-section">
            <h4 className="agrivo-farmer-order-detail-heading">Status</h4>
            <p className="text-sm text-[#5F6F64]">
              Current status:{" "}
              <span className="font-semibold text-[#102018]">
                {FARMER_ORDER_STATUS_LABELS[order.status]}
              </span>
            </p>
            {order.farmerNotes ? (
              <div className="agrivo-farmer-order-detail-notes mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a70]">
                  Farmer notes
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5F6F64]">{order.farmerNotes}</p>
              </div>
            ) : null}
          </section>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
