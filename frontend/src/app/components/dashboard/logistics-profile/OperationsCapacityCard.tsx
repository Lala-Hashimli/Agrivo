import { Truck } from "lucide-react";
import {
  LOGISTICS_DELIVERY_TYPES,
  LOGISTICS_VEHICLE_TYPES,
  toggleArrayItem,
  type LogisticsDashboardProfile,
} from "../../../utils/logisticsProfileStorage";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { ChipToggle } from "../farmer-profile/ChipToggle";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "../farmer-profile/ProfileLayout";
import {
  ProfileInfoField,
  ProfileInfoGrid,
  ProfileInfoGroup,
  profileInfoInputClassName,
} from "./ProfileInfoField";

export function OperationsCapacityCard({
  profile,
  isEditing,
  onChange,
}: {
  profile: LogisticsDashboardProfile;
  isEditing: boolean;
  onChange: (updates: Partial<LogisticsDashboardProfile>) => void;
}) {
  return (
    <ProfileCard>
      <ProfileCardHeader icon={Truck} title="Operations & Capacity" />
      <ProfileCardBody className="agrivo-profile-info-card-body">
        <ProfileInfoGrid>
          <ProfileInfoField
            label="Number of Drivers"
            emphasized
            isEditing={isEditing}
            edit={
              <Input
                id="drivers-count"
                type="number"
                min={0}
                value={profile.driversCount}
                onChange={(e) => onChange({ driversCount: Number(e.target.value) || 0 })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.driversCount}
          </ProfileInfoField>

          <ProfileInfoField
            label="Number of Vehicles"
            emphasized
            isEditing={isEditing}
            edit={
              <Input
                id="vehicles-count"
                type="number"
                min={0}
                value={profile.vehiclesCount}
                onChange={(e) => onChange({ vehiclesCount: Number(e.target.value) || 0 })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.vehiclesCount}
          </ProfileInfoField>

          <ProfileInfoField
            label="Maximum Daily Delivery Capacity"
            emphasized
            fullWidth
            isEditing={isEditing}
            edit={
              <Input
                value={profile.maxDailyCapacity}
                onChange={(e) => onChange({ maxDailyCapacity: e.target.value })}
                placeholder="e.g. 10 tons"
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.maxDailyCapacity || "Add delivery capacity"}
          </ProfileInfoField>
        </ProfileInfoGrid>

        <ProfileInfoGroup label="Vehicle Types">
          {isEditing ? (
            <div className="agrivo-profile-chip-group">
              {LOGISTICS_VEHICLE_TYPES.map((type) => (
                <ChipToggle
                  key={type}
                  label={type}
                  selected={profile.vehicleTypes.includes(type)}
                  onClick={() =>
                    onChange({
                      vehicleTypes: toggleArrayItem(profile.vehicleTypes, type),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-profile-chip-group">
              {profile.vehicleTypes.length > 0 ? (
                profile.vehicleTypes.map((type) => (
                  <span key={type} className="agrivo-logistics-preview-chip">
                    {type}
                  </span>
                ))
              ) : (
                <span className="agrivo-profile-info-field__value--placeholder">
                  Add vehicle types
                </span>
              )}
            </div>
          )}
        </ProfileInfoGroup>

        <ProfileInfoGroup label="Supported Delivery Types">
          {isEditing ? (
            <div className="agrivo-profile-chip-group">
              {LOGISTICS_DELIVERY_TYPES.map((type) => (
                <ChipToggle
                  key={type}
                  label={type}
                  selected={profile.supportedDeliveryTypes.includes(type)}
                  onClick={() =>
                    onChange({
                      supportedDeliveryTypes: toggleArrayItem(
                        profile.supportedDeliveryTypes,
                        type,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-profile-chip-group">
              {profile.supportedDeliveryTypes.length > 0 ? (
                profile.supportedDeliveryTypes.map((type) => (
                  <span key={type} className="agrivo-logistics-preview-chip">
                    {type}
                  </span>
                ))
              ) : (
                <span className="agrivo-profile-info-field__value--placeholder">
                  Select delivery types
                </span>
              )}
            </div>
          )}
        </ProfileInfoGroup>

        <div className="agrivo-logistics-toggle-grid">
          <div className="agrivo-logistics-toggle-row">
            <div className="agrivo-profile-info-field">
              <span className="agrivo-profile-info-field__label">Cold Chain Support</span>
              <span className="agrivo-profile-info-field__hint">Refrigerated transport available</span>
            </div>
            {isEditing ? (
              <Switch
                checked={profile.coldChainSupport}
                onCheckedChange={(checked) => onChange({ coldChainSupport: checked })}
              />
            ) : (
              <span className="agrivo-profile-info-field__value agrivo-profile-info-field__value--emphasized">
                {profile.coldChainSupport ? "Yes" : "No"}
              </span>
            )}
          </div>

          <div className="agrivo-logistics-toggle-row">
            <div className="agrivo-profile-info-field">
              <span className="agrivo-profile-info-field__label">Same-Day Delivery</span>
              <span className="agrivo-profile-info-field__hint">Express same-day routes</span>
            </div>
            {isEditing ? (
              <Switch
                checked={profile.sameDayDelivery}
                onCheckedChange={(checked) => onChange({ sameDayDelivery: checked })}
              />
            ) : (
              <span className="agrivo-profile-info-field__value agrivo-profile-info-field__value--emphasized">
                {profile.sameDayDelivery ? "Yes" : "No"}
              </span>
            )}
          </div>
        </div>
      </ProfileCardBody>
    </ProfileCard>
  );
}
