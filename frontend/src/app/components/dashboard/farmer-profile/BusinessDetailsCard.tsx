import { Briefcase } from "lucide-react";
import {
  FARMER_PROFILE_CATEGORIES,
  FARMER_PROFILE_DELIVERY_OPTIONS,
  FARMER_PROFILE_PAYMENT_METHODS,
  FARMER_PROFILE_PRODUCT_SUGGESTIONS,
  toggleArrayItem,
  type FarmerDashboardProfile,
  type FarmerProfileCategory,
  type FarmerProfileDeliveryOption,
  type FarmerProfilePaymentMethod,
} from "../../../utils/farmerProfileStorage";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { ChipToggle } from "./ChipToggle";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "./ProfileLayout";

interface BusinessDetailsCardProps {
  profile: FarmerDashboardProfile;
  isEditing: boolean;
  onChange: (updates: Partial<FarmerDashboardProfile>) => void;
}

export function BusinessDetailsCard({ profile, isEditing, onChange }: BusinessDetailsCardProps) {
  return (
    <ProfileCard>
      <ProfileCardHeader icon={Briefcase} title="Business Details" />
      <ProfileCardBody className="agrivo-profile-card-body--stacked">
        <div>
          <Label>Main Product Categories</Label>
          {isEditing ? (
            <div className="agrivo-profile-chip-group mt-2">
              {FARMER_PROFILE_CATEGORIES.map((category) => (
                <ChipToggle
                  key={category}
                  label={category}
                  selected={profile.mainCategories.includes(category)}
                  onClick={() =>
                    onChange({
                      mainCategories: toggleArrayItem(
                        profile.mainCategories,
                        category as FarmerProfileCategory,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-profile-chip-group mt-2">
              {profile.mainCategories.length > 0 ? (
                profile.mainCategories.map((category) => (
                  <span key={category} className="agrivo-farmer-dash-preview-chip">
                    {category}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#6b7a70]">Add main categories</p>
              )}
            </div>
          )}
        </div>

        <div>
          <Label>Main Products</Label>
          {isEditing ? (
            <>
              <div className="agrivo-profile-chip-group mt-2">
                {FARMER_PROFILE_PRODUCT_SUGGESTIONS.map((product) => (
                  <ChipToggle
                    key={product}
                    label={product}
                    selected={profile.mainProducts.includes(product)}
                    onClick={() =>
                      onChange({
                        mainProducts: toggleArrayItem(profile.mainProducts, product),
                      })
                    }
                  />
                ))}
              </div>
              <Input
                value={profile.mainProducts.join(", ")}
                onChange={(event) =>
                  onChange({
                    mainProducts: event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Tomatoes, Apples, Watermelon"
                className="mt-2 h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]"
              />
            </>
          ) : (
            <div className="agrivo-profile-chip-group mt-2">
              {profile.mainProducts.length > 0 ? (
                profile.mainProducts.map((product) => (
                  <span key={product} className="agrivo-farmer-dash-preview-chip">
                    {product}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#6b7a70]">Add main products</p>
              )}
            </div>
          )}
        </div>

        <div className="agrivo-profile-form-grid">
          <div>
            <Label htmlFor="farm-size">Farm Size</Label>
            {isEditing ? (
              <Input
                id="farm-size"
                value={profile.farmSize}
                onChange={(event) => onChange({ farmSize: event.target.value })}
                placeholder="5 hectares"
                className="mt-1.5 h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm"
              />
            ) : (
              <p className="mt-1.5 text-sm font-medium text-[#102018]">
                {profile.farmSize || "Add farm size"}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="minimum-order">Minimum Order Quantity</Label>
            {isEditing ? (
              <Input
                id="minimum-order"
                value={profile.minimumOrder}
                onChange={(event) => onChange({ minimumOrder: event.target.value })}
                placeholder="50 kg"
                className="mt-1.5 h-11 rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm"
              />
            ) : (
              <p className="mt-1.5 text-sm font-medium text-[#102018]">
                {profile.minimumOrder || "Add minimum order"}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label>Delivery Options</Label>
          {isEditing ? (
            <div className="agrivo-profile-chip-group mt-2">
              {FARMER_PROFILE_DELIVERY_OPTIONS.map((option) => (
                <ChipToggle
                  key={option}
                  label={option}
                  selected={profile.deliveryOptions.includes(option)}
                  onClick={() =>
                    onChange({
                      deliveryOptions: toggleArrayItem(
                        profile.deliveryOptions,
                        option as FarmerProfileDeliveryOption,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-profile-chip-group mt-2">
              {profile.deliveryOptions.length > 0 ? (
                profile.deliveryOptions.map((option) => (
                  <span key={option} className="agrivo-farmer-dash-preview-chip">
                    {option}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#6b7a70]">No delivery option selected</p>
              )}
            </div>
          )}
        </div>

        <div>
          <Label>Payment Methods</Label>
          {isEditing ? (
            <div className="agrivo-profile-chip-group mt-2">
              {FARMER_PROFILE_PAYMENT_METHODS.map((method) => (
                <ChipToggle
                  key={method}
                  label={method}
                  selected={profile.paymentMethods.includes(method)}
                  onClick={() =>
                    onChange({
                      paymentMethods: toggleArrayItem(
                        profile.paymentMethods,
                        method as FarmerProfilePaymentMethod,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-profile-chip-group mt-2">
              {profile.paymentMethods.length > 0 ? (
                profile.paymentMethods.map((method) => (
                  <span key={method} className="agrivo-farmer-dash-preview-chip">
                    {method}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#6b7a70]">Add payment methods</p>
              )}
            </div>
          )}
        </div>
      </ProfileCardBody>
    </ProfileCard>
  );
}
