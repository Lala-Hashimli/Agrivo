import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { EconomicRegion } from "../../../data/azerbaijanRegions";
import { economicRegions, getDistrictsForRegion } from "../../../data/azerbaijanRegions";
import {
  getProductNamesForCategory,
  getVarietiesByProduct,
  supportsProductVarieties,
} from "../../../data/productVarieties";
import type {
  FarmerDeliveryOption,
  ProductFormCategory,
  ProductFormTag,
} from "../../../utils/farmerProductsStorage";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { cn } from "../../ui/utils";
import { ComboboxInput } from "./ComboboxInput";
import { FormField, formInputClass, formTextareaClass } from "./FormField";
import { FormGrid, FormMediaGrid } from "./FormGrid";
import { ImageUpload } from "./ImageUpload";
import { QuantityInput } from "./QuantityInput";

const CATEGORIES: ProductFormCategory[] = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Grains",
  "Herbs",
  "Other",
];

const UNITS = ["kg", "ton", "box", "piece"] as const;

const TAGS: ProductFormTag[] = ["Fresh", "Organic", "Available Now"];

const DELIVERY_OPTIONS: FarmerDeliveryOption[] = [
  "Farmer delivery",
  "Buyer pickup",
  "Logistics partner",
];

const filterSelectClass =
  "agrivo-filter-control mt-1.5 h-11 w-full rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

const compactTextareaClass =
  "mt-1.5 min-h-[96px] w-full rounded-xl border border-[#DEECE0] bg-[#F7FBF5] px-3.5 py-2.5 text-sm text-[#102018] transition-colors placeholder:text-[#9ca3af] focus:border-[#86efac] focus:outline-none focus:ring-2 focus:ring-[#bbf7d0]/60 lg:min-h-[140px]";

export interface ProductFormValues {
  name: string;
  category: ProductFormCategory | "";
  variety: string;
  region: EconomicRegion | "";
  district: string;
  price: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  image: string;
  description: string;
  tags: ProductFormTag[];
  deliveryOption: FarmerDeliveryOption | "";
}

export interface ProductFormSubmitPayload {
  name: string;
  category: ProductFormCategory;
  variety: string;
  region: string;
  district: string;
  price: number;
  quantity: number;
  unit: string;
  harvestDate: string;
  image: string;
  description: string;
  tags: ProductFormTag[];
  deliveryOption: FarmerDeliveryOption;
}

const initialValues: ProductFormValues = {
  name: "",
  category: "",
  variety: "",
  region: "",
  district: "",
  price: "",
  quantity: 0,
  unit: "kg",
  harvestDate: "",
  image: "",
  description: "",
  tags: ["Fresh"],
  deliveryOption: "",
};

type FormErrors = Partial<Record<keyof ProductFormValues | "submit", string>>;

function validate(values: ProductFormValues, isPublish: boolean): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Product name is required.";
  if (!values.category) errors.category = "Select a category.";
  if (!values.region) errors.region = "Select a region.";
  if (!values.district) errors.district = "Select a district.";
  const price = Number(values.price);
  if (!values.price.trim() || !Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a valid price greater than 0.";
  }
  if (isPublish && values.quantity <= 0) {
    errors.quantity = "Quantity must be at least 1 to publish.";
  }
  if (!values.harvestDate) errors.harvestDate = "Harvest date is required.";
  if (isPublish && !values.image) errors.image = "Add a product photo before publishing.";
  if (isPublish && !values.description.trim()) {
    errors.description = "Description is required to publish.";
  }
  if (!values.deliveryOption) errors.deliveryOption = "Select a delivery option.";
  return errors;
}

function TagPill({
  label,
  selected,
  onClick,
}: {
  label: ProductFormTag;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "agrivo-product-tag-pill",
        selected && "agrivo-product-tag-pill--selected",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="agrivo-product-form-section agrivo-dashboard-panel">
      <div className="agrivo-product-form-section-header">
        <h3 className="agrivo-heading text-base font-bold text-[#102018] sm:text-lg">{title}</h3>
        {subtitle ? <p className="agrivo-product-form-section-subtitle">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ProductForm({
  onSubmit,
  isSaving,
  defaultValues,
  mode = "create",
}: {
  onSubmit: (payload: ProductFormSubmitPayload, mode: "draft" | "publish") => void;
  isSaving: boolean;
  defaultValues?: Partial<ProductFormValues>;
  mode?: "create" | "edit";
}) {
  const [values, setValues] = useState<ProductFormValues>({ ...initialValues, ...defaultValues });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (defaultValues) {
      setValues({ ...initialValues, ...defaultValues });
      setErrors({});
    }
  }, [defaultValues]);

  const districts = useMemo(() => {
    if (!values.region) return [];
    return getDistrictsForRegion(values.region);
  }, [values.region]);

  const productNameOptions = useMemo(
    () => (values.category ? getProductNamesForCategory(values.category) : []),
    [values.category],
  );

  const varietyOptions = useMemo(
    () =>
      values.category && values.name
        ? getVarietiesByProduct(values.category, values.name)
        : [],
    [values.category, values.name],
  );

  const hasVarietySupport = values.category ? supportsProductVarieties(values.category) : false;
  const varietyDisabled = !hasVarietySupport || !values.name.trim();

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleTag = (tag: ProductFormTag) => {
    setValues((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (mode: "draft" | "publish") => {
    const nextErrors = validate(values, mode === "publish");
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const price = Number(values.price);
    onSubmit(
      {
        name: values.name.trim(),
        category: values.category as ProductFormCategory,
        variety: values.variety.trim(),
        region: values.region as string,
        district: values.district,
        price,
        quantity: values.quantity,
        unit: values.unit,
        harvestDate: values.harvestDate,
        image: values.image,
        description: values.description.trim(),
        tags: values.tags,
        deliveryOption: values.deliveryOption as FarmerDeliveryOption,
      },
      mode,
    );
  };

  return (
    <form
      className="agrivo-product-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit("publish");
      }}
    >
      <FormSection title="Basic Product Info" subtitle="Category, name, variety, and location.">
        <FormGrid columns={3}>
          <FormField label="Category" required error={errors.category}>
            <Select
              value={values.category}
              onValueChange={(v) => {
                update("category", v as ProductFormCategory);
                update("name", "");
                update("variety", "");
              }}
              disabled={isSaving}
            >
              <SelectTrigger className={filterSelectClass}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Product Name" htmlFor="product-name" required error={errors.name}>
            {productNameOptions.length > 0 ? (
              <ComboboxInput
                id="product-name"
                value={values.name}
                onChange={(v) => {
                  update("name", v);
                  update("variety", "");
                }}
                options={productNameOptions}
                disabled={!values.category || isSaving}
                placeholder="e.g. Apple, Tomato"
                className={formInputClass}
                emptyHint="Select category first"
              />
            ) : (
              <Input
                id="product-name"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Milk, Wheat"
                className={formInputClass}
                disabled={!values.category || isSaving}
              />
            )}
          </FormField>

          <FormField
            label="Product Variety / Sort"
            htmlFor="product-variety"
            error={errors.variety}
          >
            <ComboboxInput
              id="product-variety"
              value={values.variety}
              onChange={(v) => update("variety", v)}
              options={varietyOptions}
              disabled={varietyDisabled || isSaving}
              placeholder="e.g. Qızıl Əhmədi"
              className={formInputClass}
              emptyHint="Select product first"
            />
            <p className="agrivo-form-helper">
              {hasVarietySupport
                ? "Select a known variety or type your own."
                : "Optional for this category."}
            </p>
          </FormField>

          <FormField label="Region" required error={errors.region}>
            <Select
              value={values.region}
              onValueChange={(v) => {
                update("region", v as EconomicRegion);
                update("district", "");
              }}
              disabled={isSaving}
            >
              <SelectTrigger className={filterSelectClass}>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {economicRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="District" required error={errors.district}>
            <Select
              value={values.district}
              onValueChange={(v) => update("district", v)}
              disabled={!values.region || isSaving}
            >
              <SelectTrigger className={filterSelectClass}>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Harvest Date" htmlFor="harvest-date" required error={errors.harvestDate}>
            <Input
              id="harvest-date"
              type="date"
              value={values.harvestDate}
              onChange={(e) => update("harvestDate", e.target.value)}
              className={formInputClass}
              disabled={isSaving}
            />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection title="Pricing & Stock" subtitle="Price, unit, and available quantity.">
        <FormGrid columns={3}>
          <FormField label="Price (AZN)" htmlFor="product-price" required error={errors.price}>
            <Input
              id="product-price"
              type="number"
              min={0}
              step="0.01"
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="2.50"
              className={formInputClass}
              disabled={isSaving}
            />
          </FormField>

          <FormField label="Unit" required>
            <Select
              value={values.unit}
              onValueChange={(v) => update("unit", v)}
              disabled={isSaving}
            >
              <SelectTrigger className={filterSelectClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Quantity" required error={errors.quantity}>
            <QuantityInput
              id="product-quantity"
              value={values.quantity}
              onChange={(v) => update("quantity", v)}
              className="agrivo-quantity-input--compact"
            />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection title="Media & Description" subtitle="Photo, description, tags, and delivery.">
        <FormMediaGrid>
          <FormField label="Product Image" required error={errors.image}>
            <ImageUpload
              value={values.image}
              onChange={(v) => update("image", v)}
              error={errors.image}
              compact
            />
          </FormField>

          <div className="agrivo-form-media-fields">
            <FormField
              label="Description"
              htmlFor="product-description"
              required
              error={errors.description}
            >
              <Textarea
                id="product-description"
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Freshness, packaging, grading, availability..."
                className={compactTextareaClass}
                disabled={isSaving}
              />
            </FormField>

            <FormGrid columns={2}>
              <FormField label="Product status">
                <div className="agrivo-product-tag-group">
                  {TAGS.map((tag) => (
                    <TagPill
                      key={tag}
                      label={tag}
                      selected={values.tags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    />
                  ))}
                </div>
              </FormField>

              <FormField label="Delivery option" required error={errors.deliveryOption}>
                <Select
                  value={values.deliveryOption}
                  onValueChange={(v) => update("deliveryOption", v as FarmerDeliveryOption)}
                  disabled={isSaving}
                >
                  <SelectTrigger className={filterSelectClass}>
                    <SelectValue placeholder="Delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormGrid>
          </div>
        </FormMediaGrid>
      </FormSection>

      <div className="agrivo-product-form-actions">
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#dbe7d4] px-6 text-[#14532D] hover:bg-[#EAF7EC]"
          disabled={isSaving}
          onClick={() => handleSubmit("draft")}
        >
          {isSaving ? "Saving..." : mode === "edit" ? "Save Draft" : "Save as Draft"}
        </Button>
        <Button
          type="submit"
          className="rounded-full bg-[#14532D] px-6 text-white hover:bg-[#1D6A3B]"
          disabled={isSaving}
        >
          {isSaving
            ? mode === "edit"
              ? "Updating..."
              : "Publishing..."
            : mode === "edit"
              ? "Save Changes"
              : "Publish Product"}
        </Button>
      </div>
    </form>
  );
}
