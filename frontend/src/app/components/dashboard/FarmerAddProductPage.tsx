import { CheckCircle2, ClipboardList, Info, Package, Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getFarmerSectionHash } from "../../data/farmerDashboard";
import {
  addFarmerProduct,
  computeProductsSummary,
  getFarmerProducts,
  resolveFarmerProductsUserId,
} from "../../utils/farmerProductsStorage";
import { ProductForm, type ProductFormSubmitPayload } from "./farmer-product-form/ProductForm";
import { Button } from "../ui/button";
import { isApiMode } from "../../../config/dataMode";
import { createProduct } from "../../../api/productsApi";

function navigate(hash: string) {
  window.location.hash = hash;
}

export function FarmerAddProductPage() {
  const { user } = useAuth();
  const userId = user ? resolveFarmerProductsUserId(user) : null;

  const [stats, setStats] = useState({ totalProducts: 0, activeListings: 0, draftProducts: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshStats = useCallback(() => {
    if (!userId) return;
    const summary = computeProductsSummary(getFarmerProducts(userId));
    setStats({
      totalProducts: summary.totalProducts,
      activeListings: summary.activeListings,
      draftProducts: summary.draftProducts,
    });
  }, [userId]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (payload: ProductFormSubmitPayload, mode: "draft" | "publish") => {
    if (!userId) return;

    setError(null);
    setIsSaving(true);
    try {
      if (isApiMode) {
        await createProduct({
          name: payload.name,
          category: payload.category,
          variety: payload.variety,
          description: payload.description,
          price: payload.price,
          quantity: payload.quantity,
          unit: payload.unit,
          region: payload.region,
          district: payload.district,
          village: "",
          harvestDate: payload.harvestDate,
          imageUrl: payload.image,
          status: mode === "publish" ? "active" : "draft",
          isOrganic: payload.tags.includes("Organic"),
          isFresh: payload.tags.includes("Fresh"),
          availableNow: payload.tags.includes("Available Now"),
        });
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 350));
        addFarmerProduct(userId, {
          ...payload,
          listingStatus: mode === "publish" ? "active" : "draft",
        });
      }

      refreshStats();
      showToast(
        mode === "publish" ? "Product published successfully." : "Product saved as draft.",
      );

      window.setTimeout(() => {
        navigate(getFarmerSectionHash("products"));
      }, 800);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!userId) return null;

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      hint: "All your listings",
      icon: Package,
    },
    {
      label: "Active Listings",
      value: stats.activeListings,
      hint: "Live in marketplace",
      icon: ClipboardList,
    },
    {
      label: "Draft Products",
      value: stats.draftProducts,
      hint: "Not yet published",
      icon: Pencil,
    },
  ];

  return (
    <div className="agrivo-farmer-add-product space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}
      {error ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--error" role="alert">
          <Info className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="agrivo-farmer-add-product-header">
        <div>
          <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">
            Add New Product
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F6F64] sm:text-base">
            List your fresh farm products and make them available for buyers.
          </p>
        </div>
        <aside className="agrivo-farmer-add-product-info-card">
          <Info className="h-5 w-5 shrink-0 text-[#43A047]" />
          <p className="text-sm leading-6 text-[#3f5247]">
            Products you publish will appear in the marketplace for buyers.
          </p>
        </aside>
      </div>

      <section className="agrivo-farmer-add-product-stats">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="agrivo-farmer-add-product-stat agrivo-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfdf5]">
                  <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={1.75} />
                </div>
                <span className="agrivo-heading text-2xl font-bold text-[#102018]">{card.value}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#102018]">{card.label}</p>
              <p className="mt-0.5 text-xs text-[#6b7a70]">{card.hint}</p>
            </div>
          );
        })}
      </section>

      <section className="agrivo-dashboard-panel agrivo-farmer-add-product-form-card">
        <div className="mb-4 flex flex-col gap-2 border-b border-[#edf2ea] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">
              New listing
            </p>
            <h3 className="agrivo-heading mt-1 text-lg font-bold text-[#102018]">Product details</h3>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => navigate(getFarmerSectionHash("products"))}
          >
            View My Products
          </Button>
        </div>

        <ProductForm onSubmit={handleSubmit} isSaving={isSaving} />
      </section>
    </div>
  );
}
