import {
  Info,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProductDetailHash } from "../../data/harvestExplorer";
import { placeOrdersFromCart } from "../../utils/buyerPlacedOrdersStorage";
import { isApiMode } from "../../../config/dataMode";
import {
  clearCartApi,
  getCartItemsApi,
  removeCartItemApi,
  type ApiCartItem,
  updateCartItemApi,
} from "../../../api/cartApi";
import { createOrder } from "../../../api/ordersApi";
import {
  formatQuantity,
  getCartItemSubtotal,
  getCartSummary,
  type CartItem,
} from "../../utils/cartStorage";
import { ProductImage } from "../products/ProductImage";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";


function CartQuantityControl({
  item,
  onUpdate,
}: {
  item: CartItem;
  onUpdate: (slug: string, quantity: number) => void;
}) {
  const [inputValue, setInputValue] = useState(String(item.selectedQuantity));
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(String(item.selectedQuantity));
    setValidationMsg(null);
  }, [item.selectedQuantity]);

  const applyQuantity = (raw: number) => {
    if (!Number.isFinite(raw)) {
      setInputValue(String(item.selectedQuantity));
      return;
    }

    const rounded = Math.round(raw);

    if (rounded > item.availableQuantity) {
      const corrected = item.availableQuantity;
      setValidationMsg(`Only ${formatQuantity(corrected, item.unit)} available`);
      onUpdate(item.slug, corrected);
      setInputValue(String(corrected));
      return;
    }

    if (rounded < item.minimumOrder) {
      const corrected = item.minimumOrder;
      setValidationMsg(`Minimum order is ${formatQuantity(corrected, item.unit)}`);
      onUpdate(item.slug, corrected);
      setInputValue(String(corrected));
      return;
    }

    setValidationMsg(null);
    onUpdate(item.slug, rounded);
    setInputValue(String(rounded));
  };

  const handleDecrement = () => {
    if (item.selectedQuantity <= item.minimumOrder) {
      setValidationMsg(`Minimum order is ${formatQuantity(item.minimumOrder, item.unit)}`);
      return;
    }
    applyQuantity(item.selectedQuantity - 1);
  };

  const handleIncrement = () => {
    if (item.selectedQuantity >= item.availableQuantity) {
      setValidationMsg(`Only ${formatQuantity(item.availableQuantity, item.unit)} available`);
      return;
    }
    applyQuantity(item.selectedQuantity + 1);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      setValidationMsg(null);
    }
  };

  const commitInput = () => {
    if (inputValue === "") {
      setInputValue(String(item.selectedQuantity));
      return;
    }
    applyQuantity(Number.parseInt(inputValue, 10));
  };

  return (
    <div className="agrivo-buyer-cart-item-qty-group">
      <div className="agrivo-buyer-cart-stepper">
        <button
          type="button"
          className="agrivo-buyer-cart-stepper-btn"
          aria-label="Decrease quantity by 1"
          onClick={handleDecrement}
          disabled={item.selectedQuantity <= item.minimumOrder}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="agrivo-buyer-cart-stepper-input"
          value={inputValue}
          aria-label={`Quantity in ${item.unit}`}
          onChange={handleInputChange}
          onBlur={commitInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
        <span className="agrivo-buyer-cart-stepper-unit">{item.unit}</span>
        <button
          type="button"
          className="agrivo-buyer-cart-stepper-btn"
          aria-label="Increase quantity by 1"
          onClick={handleIncrement}
          disabled={item.selectedQuantity >= item.availableQuantity}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="agrivo-buyer-cart-qty-hint">
        Minimum order: {formatQuantity(item.minimumOrder, item.unit)} · Available:{" "}
        {item.availableQuantityLabel}
      </p>
      {validationMsg ? <p className="agrivo-buyer-cart-qty-error">{validationMsg}</p> : null}
    </div>
  );
}

function CartItemCard({
  item,
  onUpdate,
  onRemove,
}: {
  item: CartItem;
  onUpdate: (slug: string, quantity: number) => void;
  onRemove: (slug: string) => void;
}) {
  const subtotal = getCartItemSubtotal(item);
  const locationDisplay = item.location.replace(/>/g, " → ");

  return (
    <article className="agrivo-buyer-cart-item">
      <div className="agrivo-buyer-cart-item-thumb">
        <ProductImage
          name={item.name}
          src={item.image}
          alt={item.name}
          className="h-full w-full"
        />
      </div>

      <div className="agrivo-buyer-cart-item-main">
        <div className="agrivo-buyer-cart-item-top">
          <div className="agrivo-buyer-cart-item-info">
            <h3 className="agrivo-buyer-cart-item-name">{item.name}</h3>
            <p className="agrivo-buyer-cart-item-farmer">
              Farmer: <strong>{item.farmer}</strong>
            </p>
            <p className="agrivo-buyer-cart-item-location">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              <span>{locationDisplay}</span>
            </p>
          </div>

          <div className="agrivo-buyer-cart-item-subtotal-block">
            <p className="agrivo-buyer-cart-item-subtotal-label">Subtotal</p>
            <p className="agrivo-buyer-cart-item-subtotal-value">{subtotal.toFixed(2)} AZN</p>
          </div>
        </div>

        <div className="agrivo-buyer-cart-item-details">
          <div className="agrivo-buyer-cart-item-detail">
            <span className="agrivo-buyer-cart-item-detail-label">Price</span>
            <span className="agrivo-buyer-cart-item-detail-value">
              {item.price}
              {item.unit ? ` / ${item.unit}` : ""}
            </span>
          </div>
          <div className="agrivo-buyer-cart-item-detail">
            <span className="agrivo-buyer-cart-item-detail-label">Available</span>
            <span className="agrivo-buyer-cart-item-detail-value">{item.availableQuantityLabel}</span>
          </div>
          <div className="agrivo-buyer-cart-item-detail">
            <span className="agrivo-buyer-cart-item-detail-label">Selected</span>
            <span className="agrivo-buyer-cart-item-detail-value">
              {formatQuantity(item.selectedQuantity, item.unit)}
            </span>
          </div>
          <div className="agrivo-buyer-cart-item-detail">
            {item.deliveryAvailable ? (
              <span className="agrivo-buyer-cart-delivery-badge">
                <Truck className="h-3 w-3" />
                Delivery available
              </span>
            ) : (
              <span className="agrivo-buyer-cart-pickup-badge">Pickup only</span>
            )}
          </div>
        </div>

        <div className="agrivo-buyer-cart-item-controls">
          <CartQuantityControl item={item} onUpdate={onUpdate} />

          <div className="agrivo-buyer-cart-item-actions">
            <Button
              variant="outline"
              size="sm"
              className="agrivo-buyer-cart-action-btn"
              onClick={() => {
                window.location.hash = getProductDetailHash(item.slug);
              }}
            >
              View Product
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="agrivo-buyer-cart-action-btn"
              onClick={() => {
                if (item.farmerSlug) {
                  window.location.hash = `farmers/${item.farmerSlug}`;
                } else {
                  window.location.hash = "login";
                }
              }}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Contact Farmer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="agrivo-buyer-cart-action-btn agrivo-buyer-cart-action-btn--remove"
              onClick={() => onRemove(item.slug)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function OrderSummaryCard({
  items,
  multiFarmer,
  onCheckout,
  onContinueShopping,
}: {
  items: CartItem[];
  multiFarmer: boolean;
  onCheckout: () => void;
  onContinueShopping: () => void;
}) {
  const summary = useMemo(() => getCartSummary(items), [items]);

  return (
    <aside className="agrivo-buyer-cart-summary">
      <h3 className="agrivo-buyer-cart-summary-title">Order Summary</h3>

      <dl className="agrivo-buyer-cart-summary-lines">
        <div className="agrivo-buyer-cart-summary-row">
          <dt>Items</dt>
          <dd>{summary.itemCount}</dd>
        </div>
        <div className="agrivo-buyer-cart-summary-row">
          <dt>Farmers</dt>
          <dd>{summary.farmerCount}</dd>
        </div>
        <div className="agrivo-buyer-cart-summary-divider" />
        <div className="agrivo-buyer-cart-summary-row">
          <dt>Products subtotal</dt>
          <dd>{summary.productsSubtotal.toFixed(2)} AZN</dd>
        </div>
        <div className="agrivo-buyer-cart-summary-row">
          <dt>Delivery fee</dt>
          <dd>{summary.deliveryFee.toFixed(2)} AZN</dd>
        </div>
        <div className="agrivo-buyer-cart-summary-row">
          <dt>Service fee</dt>
          <dd>{summary.serviceFee.toFixed(2)} AZN</dd>
        </div>
        <div className="agrivo-buyer-cart-summary-divider" />
        <div className="agrivo-buyer-cart-summary-row agrivo-buyer-cart-summary-row--total">
          <dt>Total</dt>
          <dd>{summary.total.toFixed(2)} AZN</dd>
        </div>
      </dl>

      <div className="agrivo-buyer-cart-payment">
        <p className="agrivo-buyer-cart-payment-label">Payment method</p>
        <p className="agrivo-buyer-cart-payment-value">Cash on delivery</p>
      </div>

      {multiFarmer ? (
        <div className="agrivo-buyer-cart-multi-note">
          <Info className="h-4 w-4 shrink-0" />
          <p>
            This cart includes products from multiple farmers. Delivery may be coordinated
            separately.
          </p>
        </div>
      ) : null}

      <Button className="agrivo-buyer-cart-checkout-btn" onClick={onCheckout}>
        Proceed to Checkout
      </Button>
      <Button
        variant="outline"
        className="agrivo-buyer-cart-continue-btn"
        onClick={onContinueShopping}
      >
        Continue Shopping
      </Button>
    </aside>
  );
}

function CheckoutDialog({
  open,
  onOpenChange,
  items,
  onPlaceOrder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onPlaceOrder: (details: { address: string; phone: string; note: string }) => void;
}) {
  const summary = useMemo(() => getCartSummary(items), [items]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const canSubmit = address.trim().length > 5 && phone.trim().length >= 7;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-buyer-checkout-dialog sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-xl font-bold text-[#102018]">
            Checkout
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            Confirm delivery details and place your order. Payment is collected on delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="checkout-address">Delivery address</Label>
            <Textarea
              id="checkout-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Street, building, city"
              className="min-h-[88px] rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-phone">Phone number</Label>
            <Input
              id="checkout-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+994 50 000 00 00"
              className="h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-note">Delivery note (optional)</Label>
            <Textarea
              id="checkout-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Gate code, preferred delivery time, etc."
              className="min-h-[72px] rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
            />
          </div>

          <div className="rounded-xl border border-[#edf2ea] bg-[#f8faf4] p-4 text-sm">
            <p className="font-semibold text-[#102018]">Payment method</p>
            <p className="mt-1 text-[#5F6F64]">Cash on delivery</p>
            <p className="mt-3 font-semibold text-[#102018]">
              Order total:{" "}
              <span className="text-[#14532D]">{summary.total.toFixed(2)} AZN</span>
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            disabled={!canSubmit}
            onClick={() =>
              onPlaceOrder({ address: address.trim(), phone: phone.trim(), note: note.trim() })
            }
          >
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CartPageStats({ itemCount, farmerCount }: { itemCount: number; farmerCount: number }) {
  const estimatedDelivery = farmerCount > 1 ? "3–5 business days" : "2–3 business days";

  return (
    <div className="agrivo-buyer-cart-stats">
      <div className="agrivo-buyer-cart-stat">
        <Package className="h-4 w-4 text-[#43A047]" />
        <span>
          <strong>{itemCount}</strong> {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="agrivo-buyer-cart-stat">
        <Users className="h-4 w-4 text-[#43A047]" />
        <span>
          <strong>{farmerCount}</strong> {farmerCount === 1 ? "farmer" : "farmers"}
        </span>
      </div>
      <div className="agrivo-buyer-cart-stat">
        <Truck className="h-4 w-4 text-[#43A047]" />
        <span>
          Est. delivery: <strong>{estimatedDelivery}</strong>
        </span>
      </div>
    </div>
  );
}

export function BuyerCartPage() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearBuyerCart } = useCart();
  const [apiCartItems, setApiCartItems] = useState<CartItem[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const activeCartItems = isApiMode ? apiCartItems : cartItems;
  const summary = useMemo(() => getCartSummary(activeCartItems), [activeCartItems]);
  const multiFarmer = summary.farmerCount > 1;

  useEffect(() => {
    if (!isApiMode) return;
    let mounted = true;
    getCartItemsApi()
      .then((items) => {
        if (!mounted) return;
        setApiCartItems(items.map(mapApiCartItemToCartItem));
      })
      .catch((error) => {
        if (!mounted) return;
        setApiError(error instanceof Error ? error.message : "Failed to load cart.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handlePlaceOrder = async (details: { address: string; phone: string; note: string }) => {
    if (!user?.id || activeCartItems.length === 0) return;
    if (isApiMode) {
      try {
        const groupedByFarmer = new Map<string, CartItem[]>();
        activeCartItems.forEach((item) => {
          const key = item.farmerSlug || item.farmer;
          const list = groupedByFarmer.get(key) ?? [];
          list.push(item);
          groupedByFarmer.set(key, list);
        });
        for (const [farmerKey, items] of groupedByFarmer.entries()) {
          await createOrder({
            farmerId: items[0].farmerSlug || farmerKey,
            deliveryMethod: "Agrivo logistics",
            deliveryAddress: `${details.address} (${details.phone})${details.note ? ` - ${details.note}` : ""}`,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.selectedQuantity,
            })),
          });
        }
        await clearCartApi();
        setApiCartItems([]);
        setCheckoutOpen(false);
        sessionStorage.setItem("agrivo_order_success", "Order placed successfully.");
        window.location.hash = "dashboard/buyer/orders";
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Failed to place order.");
      }
      return;
    }

    placeOrdersFromCart(user.id, activeCartItems);
    clearBuyerCart();
    setCheckoutOpen(false);
    sessionStorage.setItem("agrivo_order_success", "Order placed successfully.");
    window.location.hash = "dashboard/buyer/orders";
  };

  if (activeCartItems.length === 0) {
    return (
      <section className="agrivo-buyer-cart">
        <div className="agrivo-dashboard-page-header">
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">Cart</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
            Review your selected products before placing your order.
          </p>
        </div>
        <div className="agrivo-buyer-cart-empty">
          <div className="agrivo-buyer-cart-empty-icon">
            <ShoppingBag className="h-7 w-7 text-[#14532D]" />
          </div>
          <h3 className="agrivo-buyer-cart-empty-title">Your cart is empty</h3>
          <p className="agrivo-buyer-cart-empty-text">
            Add fresh products from verified farmers to start your order.
          </p>
          <Button
            className="mt-6 rounded-full bg-[#14532D] px-6 text-white hover:bg-[#1D6A3B]"
            onClick={() => {
              window.location.hash = "products";
            }}
          >
            Browse Marketplace
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="agrivo-buyer-cart">
      <div className="agrivo-dashboard-page-header">
        <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">Cart</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
          Review your selected products before placing your order.
        </p>
      </div>

      <CartPageStats itemCount={summary.itemCount} farmerCount={summary.farmerCount} />

      <div className="agrivo-buyer-cart-layout">
        <div className="agrivo-buyer-cart-items-col">
          <p className="agrivo-buyer-cart-items-label">
            {summary.itemCount} {summary.itemCount === 1 ? "product" : "products"} in your cart
          </p>
          <div className="agrivo-buyer-cart-items">
            {activeCartItems.map((item) => (
              <CartItemCard
                key={item.slug}
                item={item}
                onUpdate={(slug, quantity) => {
                  if (!isApiMode) {
                    updateQuantity(slug, quantity);
                    return;
                  }
                  const target = apiCartItems.find((i) => i.slug === slug);
                  if (!target) return;
                  updateCartItemApi(target.slug, quantity)
                    .then(() =>
                      setApiCartItems((prev) =>
                        prev.map((item) =>
                          item.slug === slug ? { ...item, selectedQuantity: quantity } : item,
                        ),
                      ),
                    )
                    .catch((error) =>
                      setApiError(error instanceof Error ? error.message : "Failed to update cart item."),
                    );
                }}
                onRemove={(slug) => {
                  if (!isApiMode) {
                    removeFromCart(slug);
                    return;
                  }
                  removeCartItemApi(slug)
                    .then(() =>
                      setApiCartItems((prev) => prev.filter((item) => item.slug !== slug)),
                    )
                    .catch((error) =>
                      setApiError(error instanceof Error ? error.message : "Failed to remove cart item."),
                    );
                }}
              />
            ))}
          </div>
        </div>

        <OrderSummaryCard
          items={activeCartItems}
          multiFarmer={multiFarmer}
          onCheckout={() => setCheckoutOpen(true)}
          onContinueShopping={() => {
            window.location.hash = "products";
          }}
        />
      </div>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={activeCartItems}
        onPlaceOrder={handlePlaceOrder}
      />
      {apiError ? (
        <p className="mt-3 rounded-lg border border-[#fecaca] bg-[#fff1f2] p-3 text-sm text-[#b91c1c]">
          {apiError}
        </p>
      ) : null}
    </section>
  );
}

function mapApiCartItemToCartItem(item: ApiCartItem): CartItem {
  const unit = item.product.unit || "kg";
  const quantity = item.product.quantity ?? 0;
  const pricePerUnit = item.product.price ?? 0;
  const location = `${item.product.region ?? "Azerbaijan"} > ${item.product.district ?? "District"}${
    item.product.village ? ` > ${item.product.village}` : ""
  }`;
  return {
    id: item.product.id,
    slug: item.id,
    name: item.product.name,
    category: item.product.category,
    image: item.product.imageUrl ?? "",
    farmer: item.product.farmer?.name ?? "Farmer",
    farmerSlug: item.product.farmer?.id ?? null,
    location,
    price: `${pricePerUnit} AZN`,
    unit,
    availableQuantity: quantity,
    availableQuantityLabel: `${quantity} ${unit}`,
    selectedQuantity: item.quantity,
    deliveryAvailable: true,
    minimumOrder: 1,
    step: 1,
    pricePerUnit,
    addedAt: new Date().toISOString(),
  };
}
