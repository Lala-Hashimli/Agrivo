import { MapPinned } from "lucide-react";
import {
  LOGISTICS_ROUTE_SUGGESTIONS,
  LOGISTICS_SERVICE_REGIONS,
  toggleArrayItem,
  type LogisticsDashboardProfile,
} from "../../../utils/logisticsProfileStorage";
import { Input } from "../../ui/input";
import { ChipToggle } from "../farmer-profile/ChipToggle";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "../farmer-profile/ProfileLayout";
import {
  ProfileInfoField,
  ProfileInfoGrid,
  ProfileInfoGroup,
  profileInfoInputClassName,
} from "./ProfileInfoField";

export function ServiceCoverageCard({
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
      <ProfileCardHeader icon={MapPinned} title="Service Coverage" />
      <ProfileCardBody className="agrivo-profile-info-card-body">
        <ProfileInfoGroup label="Service Regions">
          {isEditing ? (
            <div className="agrivo-profile-chip-group">
              {LOGISTICS_SERVICE_REGIONS.map((region) => (
                <ChipToggle
                  key={region}
                  label={region}
                  selected={profile.serviceRegions.includes(region)}
                  onClick={() =>
                    onChange({
                      serviceRegions: toggleArrayItem(profile.serviceRegions, region),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-profile-chip-group">
              {profile.serviceRegions.length > 0 ? (
                profile.serviceRegions.map((region) => (
                  <span key={region} className="agrivo-logistics-preview-chip">
                    {region}
                  </span>
                ))
              ) : (
                <span className="agrivo-profile-info-field__value--placeholder">
                  Select service regions
                </span>
              )}
            </div>
          )}
        </ProfileInfoGroup>

        <ProfileInfoGroup label="Main Delivery Routes">
          {isEditing ? (
            <div className="agrivo-profile-chip-group">
              {LOGISTICS_ROUTE_SUGGESTIONS.map((route) => (
                <ChipToggle
                  key={route}
                  label={route}
                  selected={profile.mainRoutes.includes(route)}
                  onClick={() =>
                    onChange({
                      mainRoutes: toggleArrayItem(profile.mainRoutes, route),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <ul className="agrivo-logistics-routes-list">
              {profile.mainRoutes.length > 0 ? (
                profile.mainRoutes.map((route) => (
                  <li key={route} className="agrivo-logistics-route-item">
                    <MapPinned className="h-3.5 w-3.5 shrink-0 text-[#43A047]" />
                    <span className="agrivo-profile-info-field__value">{route}</span>
                  </li>
                ))
              ) : (
                <li className="agrivo-profile-info-field__value--placeholder">
                  Add main delivery routes
                </li>
              )}
            </ul>
          )}
        </ProfileInfoGroup>

        <ProfileInfoGrid>
          <ProfileInfoField
            label="Delivery Radius / Coverage Area"
            isEditing={isEditing}
            edit={
              <Input
                id="delivery-radius"
                value={profile.deliveryRadius}
                onChange={(e) => onChange({ deliveryRadius: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.deliveryRadius || "Add coverage area"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Operating Hours"
            isEditing={isEditing}
            edit={
              <Input
                id="operating-hours"
                value={profile.operatingHours}
                onChange={(e) => onChange({ operatingHours: e.target.value })}
                placeholder="e.g. 08:00 - 20:00"
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.operatingHours || "Add operating hours"}
          </ProfileInfoField>
        </ProfileInfoGrid>
      </ProfileCardBody>
    </ProfileCard>
  );
}
