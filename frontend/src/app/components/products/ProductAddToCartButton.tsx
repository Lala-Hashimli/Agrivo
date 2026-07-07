import { Check, Loader2, ShoppingCart } from "lucide-react";
import { useCallback, useState } from "react";
import { getProductBySlug, type HarvestListing } from "../../data/harvestExplorer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../auth/AuthContext";
import { cn } from "../ui/utils";
import type { SavedProduct } from "../../utils/savedProductsStorage";

type ButtonPhase = "idle" | "loading" | "success";

interface ProductAddToCartButtonProps {
  listing?: HarvestListing;
  product?: SavedProduct;
  slug?: string;
  className?: string;
  variant?: "icon" | "button";
  label?: string;
}

const SUCCESS_RESET_MS = 1800;
const LOADING_MIN_MS = 220;

function getSuccessLabel(outcome?: string): string {
  if (outcome === "quantity_updated") return "Updated";
  if (outcome === "already_at_max") return "In cart";
  return "Added";
}

export function ProductAddToCartButton({
  listing: listingProp,
  product,
  slug,
  className,
  variant = "button",
  label = "Add to cart",
}: ProductAddToCartButtonProps) {
  const { addListingToCart, addSavedToCart, addSlugToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const listing = listingProp ?? (slug ? getProductBySlug(slug) : undefined);
  const [phase, setPhase] = useState<ButtonPhase>("idle");
  const [successLabel, setSuccessLabel] = useState("Added");

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();

      if (phase === "loading" || (!listing && !product && !slug)) {
        return;
      }

      setPhase("loading");

      await new Promise((resolve) => window.setTimeout(resolve, LOADING_MIN_MS));

      let result;
      try {
        if (listing) {
          result = addListingToCart(listing);
        } else if (product) {
          result = addSavedToCart(product);
        } else if (slug) {
          result = addSlugToCart(slug);
        } else {
          setPhase("idle");
          return;
        }
      } catch {
        setPhase("idle");
        return;
      }

      if (!result.ok) {
        setPhase("idle");
        if (!isAuthenticated) {
          window.location.hash = "login";
        }
        return;
      }

      setSuccessLabel(getSuccessLabel(result.outcome));
      setPhase("success");
      window.setTimeout(() => setPhase("idle"), SUCCESS_RESET_MS);
    },
    [addListingToCart, addSavedToCart, addSlugToCart, isAuthenticated, listing, phase, product, slug],
  );

  const isDisabled = phase === "loading" || (!listing && !product && !slug);
  const isSuccess = phase === "success";

  if (variant === "icon") {
    return (
      <button
        type="button"
        className={cn(
          "agrivo-product-cart-btn",
          isSuccess && "agrivo-product-cart-btn--success",
          className,
        )}
        aria-label={isSuccess ? "Added to cart" : "Add to cart"}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {phase === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSuccess ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "agrivo-product-cart-btn--inline inline-flex items-center justify-center gap-2",
        isSuccess && "agrivo-product-cart-btn--inline-success",
        className,
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={phase === "loading"}
    >
      {phase === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSuccess ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      <span>
        {phase === "loading" ? "Adding…" : isSuccess ? successLabel : label}
      </span>
    </button>
  );
}
