import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth/AuthContext";
import type { HarvestListing } from "../data/harvestExplorer";
import {
  getSavedProducts,
  isProductSaved,
  notifySavedProductsChanged,
  removeSavedProduct,
  saveProduct,
  savedProductFromListing,
  SAVED_PRODUCTS_CHANGED_EVENT,
  type SavedProduct,
} from "../utils/savedProductsStorage";

type SaveToggleResult =
  | { ok: true; saved: boolean; message: string }
  | { ok: false; message: string };

interface SavedProductsContextValue {
  savedProducts: SavedProduct[];
  isSaved: (slug: string) => boolean;
  toggleSaveListing: (listing: HarvestListing) => SaveToggleResult;
  toggleSaveProduct: (product: SavedProduct) => SaveToggleResult;
  removeSaved: (slug: string) => void;
  toast: string | null;
  clearToast: () => void;
}

const SavedProductsContext = createContext<SavedProductsContextValue | null>(null);

export function SavedProductsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!user?.id) {
      setSavedProducts([]);
      return;
    }
    setSavedProducts(getSavedProducts(user.id));
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleChange = () => refresh();
    window.addEventListener(SAVED_PRODUCTS_CHANGED_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(SAVED_PRODUCTS_CHANGED_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const toggleSaveProduct = useCallback(
    (product: SavedProduct): SaveToggleResult => {
      if (!isAuthenticated || !user) {
        return { ok: false, message: "Please login as a buyer to save products." };
      }
      if (user.role !== "buyer") {
        return { ok: false, message: "Only buyers can save products." };
      }

      const alreadySaved = isProductSaved(user.id, product.slug);
      if (alreadySaved) {
        removeSavedProduct(user.id, product.slug);
        notifySavedProductsChanged();
        const message = "Removed from saved products";
        showToast(message);
        return { ok: true, saved: false, message };
      }

      saveProduct(user.id, product);
      notifySavedProductsChanged();
      const message = "Product saved";
      showToast(message);
      return { ok: true, saved: true, message };
    },
    [isAuthenticated, showToast, user],
  );

  const toggleSaveListing = useCallback(
    (listing: HarvestListing): SaveToggleResult => {
      return toggleSaveProduct(savedProductFromListing(listing));
    },
    [toggleSaveProduct],
  );

  const removeSaved = useCallback(
    (slug: string) => {
      if (!user?.id) return;
      removeSavedProduct(user.id, slug);
      notifySavedProductsChanged();
      showToast("Removed from saved products");
    },
    [showToast, user?.id],
  );

  const isSaved = useCallback(
    (slug: string) => {
      if (!user?.id) return false;
      return isProductSaved(user.id, slug);
    },
    [user?.id],
  );

  const value = useMemo(
    () => ({
      savedProducts,
      isSaved,
      toggleSaveListing,
      toggleSaveProduct,
      removeSaved,
      toast,
      clearToast,
    }),
    [savedProducts, isSaved, toggleSaveListing, toggleSaveProduct, removeSaved, toast, clearToast],
  );

  return (
    <SavedProductsContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="agrivo-save-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </SavedProductsContext.Provider>
  );
}

export function useSavedProducts(): SavedProductsContextValue {
  const context = useContext(SavedProductsContext);
  if (!context) {
    throw new Error("useSavedProducts must be used within a SavedProductsProvider");
  }
  return context;
}
