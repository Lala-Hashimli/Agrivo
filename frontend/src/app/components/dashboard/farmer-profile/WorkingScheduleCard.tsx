import { Clock3 } from "lucide-react";
import type { FarmerDashboardProfile } from "../../../utils/farmerProfileStorage";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "./ProfileLayout";
import { WorkingSchedulePicker } from "./WorkingSchedulePicker";

interface WorkingScheduleCardProps {
  profile: FarmerDashboardProfile;
  isEditing: boolean;
  errors?: Record<string, string>;
  onChange: (updates: Partial<FarmerDashboardProfile>) => void;
}

export function WorkingScheduleCard({
  profile,
  isEditing,
  errors,
  onChange,
}: WorkingScheduleCardProps) {
  return (
    <ProfileCard>
      <ProfileCardHeader icon={Clock3} title="Working Schedule" />
      <ProfileCardBody>
        <WorkingSchedulePicker
          workingDays={profile.workingDays}
          openingTime={profile.openingTime}
          closingTime={profile.closingTime}
          isEditing={isEditing}
          errors={errors}
          onChange={onChange}
        />
      </ProfileCardBody>
    </ProfileCard>
  );
}
