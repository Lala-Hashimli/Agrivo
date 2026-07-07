import { Building2 } from "lucide-react";
import type { LogisticsDashboardProfile } from "../../../utils/logisticsProfileStorage";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "../farmer-profile/ProfileLayout";
import {
  ProfileInfoField,
  ProfileInfoGrid,
  profileInfoInputClassName,
} from "./ProfileInfoField";

export function CompanyInfoCard({
  profile,
  isEditing,
  errors,
  onChange,
}: {
  profile: LogisticsDashboardProfile;
  isEditing: boolean;
  errors: Record<string, string>;
  onChange: (updates: Partial<LogisticsDashboardProfile>) => void;
}) {
  return (
    <ProfileCard>
      <ProfileCardHeader icon={Building2} title="Company Information" />
      <ProfileCardBody className="agrivo-profile-info-card-body">
        <ProfileInfoGrid>
          <ProfileInfoField
            label="Company Name"
            emphasized
            isEditing={isEditing}
            error={errors.companyName}
            edit={
              <Input
                id="company-name"
                value={profile.companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.companyName || "Add company name"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Contact Person"
            emphasized
            isEditing={isEditing}
            error={errors.contactPerson}
            edit={
              <Input
                id="contact-person"
                value={profile.contactPerson}
                onChange={(e) => onChange({ contactPerson: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.contactPerson || "Add contact person"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Company Registration Number"
            isEditing={isEditing}
            edit={
              <Input
                id="registration-number"
                value={profile.registrationNumber}
                onChange={(e) => onChange({ registrationNumber: e.target.value })}
                placeholder="Optional"
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.registrationNumber || "Not added"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Headquarters Address"
            isEditing={isEditing}
            edit={
              <Input
                id="headquarters"
                value={profile.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.address || "Add headquarters address"}
          </ProfileInfoField>
        </ProfileInfoGrid>

        <ProfileInfoField
          label="Company Description"
          multiline
          fullWidth
          isEditing={isEditing}
          edit={
            <Textarea
              id="company-description"
              value={profile.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={4}
              className="rounded-xl border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]"
            />
          }
        >
          {profile.description || "Add company description"}
        </ProfileInfoField>
      </ProfileCardBody>
    </ProfileCard>
  );
}
