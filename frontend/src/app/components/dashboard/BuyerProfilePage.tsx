import {
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardList,
  Heart,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  Shield,
  ShoppingBag,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { setAuthUser } from "../../auth/authStorage";
import { isApiMode } from "../../../config/dataMode";
import { getBuyerProfileApi, updateBuyerProfileApi } from "../../../api/profileApi";
import { useSavedProducts } from "../../context/SavedProductsContext";
import { economicRegions } from "../../data/azerbaijanRegions";
import { getAllBuyerOrders, isActiveBuyerOrder } from "../../data/buyerDashboard";
import { getBulkOrders } from "../../utils/bulkOrdersStorage";
import {
  cloneBuyerProfile,
  mergeAddDeliveryAddress,
  mergeDeleteDeliveryAddress,
  mergeSetDefaultDeliveryAddress,
  mergeUpdateDeliveryAddress,
  formatJoinedDate,
  getBuyerProfile,
  getProfileInitials,
  resolveProfileUserId,
  setBuyerProfile,
  validateBuyerProfile,
  type BuyerProfile,
  type BuyerType,
  type DeliveryAddress,
  type DeliveryMethod,
  type NotificationPreference,
  type ProductCategory,
} from "../../utils/buyerProfileStorage";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { cn } from "../ui/utils";

const BUYER_TYPES: BuyerType[] = [
  "Restaurant",
  "Supermarket",
  "Local greengrocer",
  "Bazaar seller",
  "Wholesale buyer",
  "Other",
];

const CATEGORIES: ProductCategory[] = ["Vegetables", "Fruits", "Dairy Products"];
const DELIVERY_METHODS: DeliveryMethod[] = [
  "Agrivo logistics",
  "Farmer delivery",
  "Pickup from farm",
];
const NOTIFICATION_OPTIONS: NotificationPreference[] = ["WhatsApp", "Email", "Phone"];

const REGION_OPTIONS = [...economicRegions, "All regions"] as const;

const inputClass =
  "mt-1.5 h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";
const filterClass =
  "agrivo-filter-control h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

function ChipToggle({
  label,
  selected,
  onClick,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "agrivo-profile-chip",
        selected && "agrivo-profile-chip--selected",
        disabled && "agrivo-profile-chip--disabled",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="agrivo-profile-section agrivo-dashboard-panel">
      <div className="agrivo-profile-section-header">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4 text-[#43A047]" /> : null}
          <h3 className="agrivo-profile-section-title">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProfileOverviewCard({
  profile,
  isEditing,
  isSaving,
  onEditProfile,
  onSave,
  onCancel,
  onChangePhoto,
}: {
  profile: BuyerProfile;
  isEditing: boolean;
  isSaving: boolean;
  onEditProfile: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChangePhoto: () => void;
}) {
  const initials = getProfileInitials(profile.fullName);

  return (
    <div className="agrivo-profile-overview agrivo-dashboard-panel">
      <div className="agrivo-profile-overview-main">
        <div className="agrivo-profile-avatar-wrap">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.fullName} className="agrivo-profile-avatar-image" />
          ) : (
            <div className="agrivo-profile-avatar">{initials || "B"}</div>
          )}
        </div>

        <div className="agrivo-profile-overview-info">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="agrivo-profile-overview-name">{profile.fullName}</h2>
            <span className="agrivo-profile-role-badge">Buyer</span>
          </div>

          <div className="agrivo-profile-overview-meta">
            <p className="agrivo-profile-meta-row">
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              <span>{profile.email}</span>
              {profile.emailVerified ? (
                <span className="agrivo-profile-verified-badge">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              ) : null}
            </p>
            <p className="agrivo-profile-meta-row">
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              <span>{profile.phone}</span>
              {profile.phoneVerified ? (
                <span className="agrivo-profile-verified-badge">
                  <BadgeCheck className="h-3 w-3" />
                  Verified
                </span>
              ) : null}
            </p>
            <p className="agrivo-profile-meta-row">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              <span>{profile.location}</span>
            </p>
            <p className="agrivo-profile-meta-row">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              <span>{profile.buyerType}</span>
            </p>
            <p className="agrivo-profile-meta-row">
              <Star className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              <span>Joined {formatJoinedDate(profile.joinedAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="agrivo-profile-overview-actions">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </>
        ) : (
          <>
            <Button
              className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={onEditProfile}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={onChangePhoto}
            >
              <Camera className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileStatsCards({
  totalOrders,
  activeOrders,
  savedProducts,
  bulkRequests,
}: {
  totalOrders: number;
  activeOrders: number;
  savedProducts: number;
  bulkRequests: number;
}) {
  const cards = [
    { label: "Total Orders", value: totalOrders, icon: ClipboardList },
    { label: "Active Orders", value: activeOrders, icon: ShoppingBag },
    { label: "Saved Products", value: savedProducts, icon: Heart },
    { label: "Bulk Requests", value: bulkRequests, icon: Package },
  ];

  return (
    <div className="agrivo-profile-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="agrivo-profile-stat-card agrivo-card">
            <div className="agrivo-profile-stat-icon">
              <Icon className="h-4 w-4 text-[#14532D]" />
            </div>
            <p className="agrivo-profile-stat-label">{card.label}</p>
            <p className="agrivo-profile-stat-value">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function AddressFormDialog({
  open,
  onOpenChange,
  initial,
  hasExistingAddresses,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: DeliveryAddress | null;
  hasExistingAddresses: boolean;
  onSave: (data: Omit<DeliveryAddress, "id" | "isDefault"> & { isDefault?: boolean }) => void;
}) {
  const [label, setLabel] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (open) {
      setLabel(initial?.label ?? "");
      setCityDistrict(initial?.cityDistrict ?? "");
      setFullAddress(initial?.fullAddress ?? "");
      setPhone(initial?.phone ?? "");
      setIsDefault(initial?.isDefault ?? !hasExistingAddresses);
    }
  }, [open, initial, hasExistingAddresses]);

  const canSave =
    label.trim() && cityDistrict.trim() && fullAddress.trim() && phone.trim().length >= 7;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-profile-dialog sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            {initial ? "Edit Delivery Address" : "Add Delivery Address"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            Save addresses for faster checkout and bulk order delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <Label htmlFor="addr-label">Address label</Label>
            <Input
              id="addr-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Main Shop, Warehouse"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="addr-city">City / district</Label>
            <Input
              id="addr-city"
              value={cityDistrict}
              onChange={(e) => setCityDistrict(e.target.value)}
              placeholder="Baku, Nizami district"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="addr-full">Full address</Label>
            <Textarea
              id="addr-full"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="Street, building, entrance"
              className="mt-1.5 min-h-[80px] rounded-xl border-[#DEECE0] bg-[#F7FBF5]"
            />
          </div>
          <div>
            <Label htmlFor="addr-phone">Contact phone</Label>
            <Input
              id="addr-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+994 50 000 00 00"
              className={inputClass}
            />
          </div>
          {hasExistingAddresses ? (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#102018]">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-[#DEECE0] text-[#14532D] focus:ring-[#14532D]"
              />
              Set as default address
            </label>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            disabled={!canSave}
            onClick={() => {
              onSave({
                label: label.trim(),
                cityDistrict: cityDistrict.trim(),
                fullAddress: fullAddress.trim(),
                phone: phone.trim(),
                isDefault: hasExistingAddresses ? isDefault : true,
              });
              onOpenChange(false);
            }}
          >
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setCurrent("");
      setNext("");
      setConfirm("");
      setErrors({});
    }
  }, [open]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!current.trim()) {
      nextErrors.current = "Current password is required.";
    }
    if (next.length < 6) {
      nextErrors.next = "New password must be at least 6 characters.";
    }
    if (next !== confirm) {
      nextErrors.confirm = "Passwords do not match.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="agrivo-profile-dialog sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-sm text-[#5F6F64]">
            Update your account password. This is a mock flow for now.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div>
            <Label htmlFor="pwd-current">Current password</Label>
            <Input
              id="pwd-current"
              type="password"
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.current;
                  return updated;
                });
              }}
              className={inputClass}
            />
            {errors.current ? (
              <p className="agrivo-profile-field-error">{errors.current}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="pwd-new">New password</Label>
            <Input
              id="pwd-new"
              type="password"
              value={next}
              onChange={(e) => {
                setNext(e.target.value);
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.next;
                  return updated;
                });
              }}
              className={inputClass}
            />
            {errors.next ? <p className="agrivo-profile-field-error">{errors.next}</p> : null}
          </div>
          <div>
            <Label htmlFor="pwd-confirm">Confirm new password</Label>
            <Input
              id="pwd-confirm"
              type="password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.confirm;
                  return updated;
                });
              }}
              className={inputClass}
            />
            {errors.confirm ? (
              <p className="agrivo-profile-field-error">{errors.confirm}</p>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
            onClick={handleSubmit}
          >
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BuyerProfilePage() {
  const { user, logout } = useAuth();
  const { savedProducts } = useSavedProducts();

  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [draft, setDraft] = useState<BuyerProfile | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<BuyerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const userId = user ? resolveProfileUserId(user) : null;
  const displayProfile = isEditing && draft ? draft : profile;

  const refresh = useCallback(() => {
    if (!user) {
      setProfile(null);
      setDraft(null);
      return;
    }
    if (isApiMode) {
      getBuyerProfileApi<{
        id: string;
        name: string;
        email: string;
        phone?: string | null;
        role: string;
      }>()
        .then((apiProfile) => {
          const loaded = getBuyerProfile({
            ...user,
            name: apiProfile.name,
            email: apiProfile.email,
            phone: apiProfile.phone ?? undefined,
          });
          setProfile(loaded);
          setDraft(loaded);
        })
        .catch((error) =>
          setApiError(error instanceof Error ? error.message : "Failed to load buyer profile."),
        );
      return;
    }
    const loaded = getBuyerProfile(user);
    setProfile(loaded);
    setDraft(loaded);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const enterEditMode = () => {
    if (!profile) return;
    const snapshot = cloneBuyerProfile(profile);
    setSavedSnapshot(snapshot);
    setDraft(snapshot);
    setIsEditing(true);
    setFormErrors({});
  };

  const cancelEdit = () => {
    if (savedSnapshot) {
      setDraft(cloneBuyerProfile(savedSnapshot));
      setProfile(cloneBuyerProfile(savedSnapshot));
    }
    setIsEditing(false);
    setFormErrors({});
    setSavedSnapshot(null);
  };

  const persistProfile = (next: BuyerProfile) => {
    if (!userId) return;
    setBuyerProfile(userId, next);
    setProfile(next);
    setDraft(next);
  };

  const syncAuthUser = (next: BuyerProfile) => {
    if (!user) return;
    setAuthUser({
      ...user,
      name: next.fullName,
      email: next.email,
      phone: next.phone,
    });
    window.dispatchEvent(new Event("agrivo-auth-changed"));
  };

  const handleSaveAll = async () => {
    if (!draft || !user) return;

    const errors = validateBuyerProfile(draft);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please fix the highlighted fields.");
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    const next = cloneBuyerProfile({
      ...draft,
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      businessName: draft.businessName.trim(),
      businessAddress: draft.businessAddress.trim(),
      taxId: draft.taxId.trim(),
      buyerType: draft.buyerType,
    });

    persistProfile(next);
    if (isApiMode) {
      try {
        await updateBuyerProfileApi({
          name: next.fullName,
          phone: next.phone,
        });
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Failed to save buyer profile.");
      }
    }
    syncAuthUser(next);
    setIsEditing(false);
    setSavedSnapshot(null);
    setFormErrors({});
    setIsSaving(false);
    showToast("Profile updated successfully.");
  };

  const updateDraft = (updates: Partial<BuyerProfile>) => {
    setDraft((prev) => (prev ? { ...prev, ...updates } : prev));
    setFormErrors((prev) => {
      const next = { ...prev };
      Object.keys(updates).forEach((key) => {
        delete next[key];
      });
      return next;
    });
  };

  const toggleDraftCategory = (key: "businessCategories" | "preferredCategories", category: ProductCategory) => {
    if (!draft) return;
    const list = draft[key];
    const next = list.includes(category)
      ? list.filter((item) => item !== category)
      : [...list, category];
    updateDraft({ [key]: next });
  };

  const toggleDraftRegion = (region: string) => {
    if (!draft) return;
    if (region === "All regions") {
      updateDraft({ preferredRegions: ["All regions"] });
      return;
    }
    const withoutAll = draft.preferredRegions.filter((item) => item !== "All regions");
    const next = withoutAll.includes(region)
      ? withoutAll.filter((item) => item !== region)
      : [...withoutAll, region];
    updateDraft({ preferredRegions: next.length ? next : ["All regions"] });
  };

  const applyAddressChange = (updater: (current: BuyerProfile) => BuyerProfile) => {
    if (!profile) return;
    const base = isEditing && draft ? draft : profile;
    const next = updater(base);
    if (isEditing) {
      setDraft(next);
    } else {
      persistProfile(next);
    }
    return next;
  };

  const stats = useMemo(() => {
    if (!userId) {
      return { totalOrders: 0, activeOrders: 0, savedProducts: 0, bulkRequests: 0 };
    }
    const orders = getAllBuyerOrders(userId);
    const bulk = getBulkOrders(userId);
    return {
      totalOrders: orders.length,
      activeOrders: orders.filter((order) => isActiveBuyerOrder(order.status)).length,
      savedProducts: savedProducts.length,
      bulkRequests: bulk.length,
    };
  }, [userId, savedProducts.length]);

  if (!profile || !displayProfile || !user || !userId) {
    return null;
  }

  const addresses = displayProfile.deliveryAddresses;

  return (
    <div className="agrivo-buyer-profile space-y-6">
      {toast ? (
        <div className="agrivo-cart-toast agrivo-cart-toast--success" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toast}</span>
        </div>
      ) : null}
      {apiError ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
          {apiError}
        </div>
      ) : null}

      {isEditing ? (
        <div className="agrivo-profile-editing-banner">
          <Pencil className="h-4 w-4 text-[#14532D]" />
          <span>You are editing your profile. Save or cancel your changes.</span>
        </div>
      ) : null}

      <ProfileOverviewCard
        profile={displayProfile}
        isEditing={isEditing}
        isSaving={isSaving}
        onEditProfile={enterEditMode}
        onSave={handleSaveAll}
        onCancel={cancelEdit}
        onChangePhoto={() => setPhotoDialogOpen(true)}
      />

      <ProfileStatsCards
        totalOrders={stats.totalOrders}
        activeOrders={stats.activeOrders}
        savedProducts={stats.savedProducts}
        bulkRequests={stats.bulkRequests}
      />

      <div className="agrivo-profile-layout">
        <div className="agrivo-profile-column">
          <SectionCard title="Personal Information" icon={UserRound}>
            {isEditing ? (
              <div className="agrivo-profile-form-grid">
                <div>
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    value={displayProfile.fullName}
                    onChange={(e) => updateDraft({ fullName: e.target.value })}
                    className={inputClass}
                    disabled={isSaving}
                  />
                  {formErrors.fullName ? (
                    <p className="agrivo-profile-field-error">{formErrors.fullName}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={displayProfile.email}
                    onChange={(e) => updateDraft({ email: e.target.value })}
                    className={inputClass}
                    disabled={isSaving}
                  />
                  {formErrors.email ? (
                    <p className="agrivo-profile-field-error">{formErrors.email}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={displayProfile.phone}
                    onChange={(e) => updateDraft({ phone: e.target.value })}
                    className={inputClass}
                    disabled={isSaving}
                  />
                  {formErrors.phone ? (
                    <p className="agrivo-profile-field-error">{formErrors.phone}</p>
                  ) : null}
                </div>
                <div className="agrivo-profile-password-row">
                  <div>
                    <Label>Password</Label>
                    <p className="mt-1.5 text-sm font-medium text-[#102018]">••••••••</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            ) : (
              <dl className="agrivo-profile-read-grid">
                <div>
                  <dt>Full Name</dt>
                  <dd>{displayProfile.fullName}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{displayProfile.email}</dd>
                </div>
                <div>
                  <dt>Phone Number</dt>
                  <dd>{displayProfile.phone}</dd>
                </div>
                <div className="agrivo-profile-password-row">
                  <div>
                    <dt>Password</dt>
                    <dd>••••••••</dd>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </dl>
            )}
          </SectionCard>

          <SectionCard title="Business Information" icon={Building2}>
            {isEditing ? (
              <div className="agrivo-profile-form-grid">
                <div>
                  <Label htmlFor="biz-name">Business name</Label>
                  <Input
                    id="biz-name"
                    value={displayProfile.businessName}
                    onChange={(e) => updateDraft({ businessName: e.target.value })}
                    className={inputClass}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label>Buyer type</Label>
                  <Select
                    value={displayProfile.buyerType}
                    onValueChange={(v) => updateDraft({ buyerType: v as BuyerType })}
                    disabled={isSaving}
                  >
                    <SelectTrigger className={cn(filterClass, "mt-1.5 w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUYER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.buyerType ? (
                    <p className="agrivo-profile-field-error">{formErrors.buyerType}</p>
                  ) : null}
                </div>
                <div className="agrivo-profile-form-field-full">
                  <Label htmlFor="biz-address">Business address</Label>
                  <Input
                    id="biz-address"
                    value={displayProfile.businessAddress}
                    onChange={(e) => updateDraft({ businessAddress: e.target.value })}
                    className={inputClass}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor="biz-tax">Tax ID / VÖEN (optional)</Label>
                  <Input
                    id="biz-tax"
                    value={displayProfile.taxId}
                    onChange={(e) => updateDraft({ taxId: e.target.value })}
                    placeholder="Optional"
                    className={inputClass}
                    disabled={isSaving}
                  />
                </div>
                <div className="agrivo-profile-form-field-full">
                  <Label>Preferred product categories</Label>
                  <div className="agrivo-profile-chip-group">
                    {CATEGORIES.map((category) => (
                      <ChipToggle
                        key={category}
                        label={category}
                        selected={displayProfile.businessCategories.includes(category)}
                        onClick={() => toggleDraftCategory("businessCategories", category)}
                        disabled={isSaving}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <dl className="agrivo-profile-read-grid">
                <div>
                  <dt>Business name</dt>
                  <dd>{displayProfile.businessName}</dd>
                </div>
                <div>
                  <dt>Buyer type</dt>
                  <dd>{displayProfile.buyerType}</dd>
                </div>
                <div>
                  <dt>Business address</dt>
                  <dd>{displayProfile.businessAddress}</dd>
                </div>
                {displayProfile.taxId ? (
                  <div>
                    <dt>Tax ID / VÖEN</dt>
                    <dd>{displayProfile.taxId}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Preferred product categories</dt>
                  <dd>{displayProfile.businessCategories.join(", ") || "Not set"}</dd>
                </div>
              </dl>
            )}
          </SectionCard>

          <SectionCard title="Delivery Addresses" icon={MapPin}>
            {addresses.length === 0 ? (
              <div className="agrivo-profile-address-empty">
                <p className="font-semibold text-[#102018]">No delivery addresses yet.</p>
                <p className="mt-1 text-sm text-[#5F6F64]">
                  Add an address to make checkout faster.
                </p>
              </div>
            ) : (
              <div className="agrivo-profile-address-list">
                {addresses.map((address) => (
                  <article key={address.id} className="agrivo-profile-address-card">
                    <div className="agrivo-profile-address-card-header">
                      <h4 className="font-semibold text-[#102018]">{address.label}</h4>
                      {address.isDefault ? (
                        <span className="agrivo-profile-default-badge">Default</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#5F6F64]">{address.cityDistrict}</p>
                    <p className="text-sm text-[#102018]">{address.fullAddress}</p>
                    <p className="mt-1 text-sm text-[#6b7a70]">{address.phone}</p>
                    <div className="agrivo-profile-address-actions">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                        onClick={() => {
                          setEditingAddress(address);
                          setAddressDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      {!address.isDefault ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                          onClick={() => {
                            applyAddressChange((current) =>
                              mergeSetDefaultDeliveryAddress(current, address.id),
                            );
                            if (!isEditing) showToast("Default address updated.");
                          }}
                        >
                          Set as default
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2]"
                        onClick={() => {
                          applyAddressChange((current) =>
                            mergeDeleteDeliveryAddress(current, address.id),
                          );
                          showToast(isEditing ? "Address removed from draft." : "Address removed.");
                        }}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="mt-4 w-full rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC] sm:w-auto"
              onClick={() => {
                setEditingAddress(null);
                setAddressDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Delivery Address
            </Button>
          </SectionCard>
        </div>

        <div className="agrivo-profile-column">
          <SectionCard title="Buying Preferences" icon={ShoppingBag}>
            <div className="space-y-5">
              <div>
                <Label>Preferred categories</Label>
                <div className="agrivo-profile-chip-group mt-2">
                  {CATEGORIES.map((category) => (
                    <ChipToggle
                      key={category}
                      label={category}
                      selected={displayProfile.preferredCategories.includes(category)}
                      onClick={() => toggleDraftCategory("preferredCategories", category)}
                      disabled={!isEditing || isSaving}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred regions</Label>
                <div className="agrivo-profile-chip-group mt-2">
                  {REGION_OPTIONS.map((region) => (
                    <ChipToggle
                      key={region}
                      label={region}
                      selected={displayProfile.preferredRegions.includes(region)}
                      onClick={() => toggleDraftRegion(region)}
                      disabled={!isEditing || isSaving}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred delivery method</Label>
                {isEditing ? (
                  <Select
                    value={displayProfile.preferredDeliveryMethod}
                    onValueChange={(v) =>
                      updateDraft({ preferredDeliveryMethod: v as DeliveryMethod })
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger className={cn(filterClass, "mt-2 w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-[#102018]">
                    {displayProfile.preferredDeliveryMethod}
                  </p>
                )}
              </div>

              <div>
                <Label>Notification preference</Label>
                <div className="agrivo-profile-chip-group mt-2">
                  {NOTIFICATION_OPTIONS.map((option) => (
                    <ChipToggle
                      key={option}
                      label={option}
                      selected={displayProfile.notificationPreference === option}
                      onClick={() => updateDraft({ notificationPreference: option })}
                      disabled={!isEditing || isSaving}
                    />
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Account Security" icon={Shield}>
            <dl className="agrivo-profile-security-list">
              <div>
                <dt>Password</dt>
                <dd className="flex flex-wrap items-center justify-between gap-2">
                  <span>••••••••</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                    Change Password
                  </Button>
                </dd>
              </div>
              <div>
                <dt>Login email</dt>
                <dd>{displayProfile.email}</dd>
              </div>
              <div>
                <dt>Last login</dt>
                <dd>{displayProfile.lastLogin}</dd>
              </div>
            </dl>
            <Button
              variant="outline"
              className="mt-4 w-full rounded-full border-[#fecaca] text-[#b91c1c] hover:bg-[#fef2f2] sm:w-auto"
              onClick={() => {
                logout();
                window.location.hash = "login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SectionCard>
        </div>
      </div>

      <AddressFormDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        initial={editingAddress}
        hasExistingAddresses={
          editingAddress ? addresses.length > 1 : addresses.length > 0
        }
        onSave={(data) => {
          if (editingAddress) {
            applyAddressChange((current) =>
              mergeUpdateDeliveryAddress(current, editingAddress.id, data),
            );
          } else {
            applyAddressChange((current) => mergeAddDeliveryAddress(current, data));
          }
          showToast(isEditing ? "Address updated in draft." : "Address saved.");
        }}
      />

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onSuccess={() => showToast("Password updated successfully.")}
      />

      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="agrivo-profile-dialog sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="agrivo-heading text-lg font-bold text-[#102018]">
              Change Photo
            </DialogTitle>
            <DialogDescription className="text-sm text-[#5F6F64]">
              Photo upload will be available in a future update. Your initials will continue to be
              used for now.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={() => setPhotoDialogOpen(false)}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
