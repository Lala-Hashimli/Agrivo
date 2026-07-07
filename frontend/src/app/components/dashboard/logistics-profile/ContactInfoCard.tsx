import { Phone } from "lucide-react";
import {
  LOGISTICS_PREFERRED_CONTACT_OPTIONS,
  type LogisticsDashboardProfile,
} from "../../../utils/logisticsProfileStorage";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "../farmer-profile/ProfileLayout";
import {
  ProfileInfoField,
  ProfileInfoGrid,
  profileInfoInputClassName,
} from "./ProfileInfoField";

export function ContactInfoCard({
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
      <ProfileCardHeader icon={Phone} title="Contact Information" />
      <ProfileCardBody className="agrivo-profile-info-card-body">
        <ProfileInfoGrid>
          <ProfileInfoField
            label="Phone Number"
            emphasized
            isEditing={isEditing}
            error={errors.phone}
            edit={
              <Input
                id="logistics-phone"
                value={profile.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.phone || "Add phone number"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Email Address"
            isEditing={isEditing}
            error={errors.email}
            edit={
              <Input
                id="logistics-email"
                type="email"
                value={profile.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.email || "Add email address"}
          </ProfileInfoField>

          <ProfileInfoField
            label="WhatsApp Number"
            isEditing={isEditing}
            edit={
              <Input
                id="logistics-whatsapp"
                value={profile.whatsapp}
                onChange={(e) => onChange({ whatsapp: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.whatsapp || "Add WhatsApp number"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Emergency Contact Number"
            isEditing={isEditing}
            edit={
              <Input
                id="logistics-emergency"
                value={profile.emergencyContact}
                onChange={(e) => onChange({ emergencyContact: e.target.value })}
                className={profileInfoInputClassName}
              />
            }
          >
            {profile.emergencyContact || "Add emergency contact"}
          </ProfileInfoField>

          <ProfileInfoField
            label="Preferred Contact Method"
            fullWidth
            isEditing={isEditing}
            edit={
              <Select
                value={profile.preferredContactMethod}
                onValueChange={(value) =>
                  onChange({
                    preferredContactMethod: value as LogisticsDashboardProfile["preferredContactMethod"],
                  })
                }
              >
                <SelectTrigger className={profileInfoInputClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOGISTICS_PREFERRED_CONTACT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          >
            {profile.preferredContactMethod}
          </ProfileInfoField>
        </ProfileInfoGrid>
      </ProfileCardBody>
    </ProfileCard>
  );
}
