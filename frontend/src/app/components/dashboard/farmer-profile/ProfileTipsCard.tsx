import { CheckCircle2, Lightbulb } from "lucide-react";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "./ProfileLayout";

const TIPS = [
  "Add clear farm description",
  "Keep contact number updated",
  "Add main products",
  "Update working hours",
];

export function ProfileTipsCard() {
  return (
    <ProfileCard variant="tips">
      <ProfileCardHeader icon={Lightbulb} title="Profile Tips" />
      <ProfileCardBody>
        <p className="text-sm leading-6 text-[#5F6F64]">
          Complete farm details and add product photos to build more trust with buyers.
        </p>
        <ul className="agrivo-profile-tips-list">
          {TIPS.map((tip) => (
            <li key={tip}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#43A047]" aria-hidden />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </ProfileCardBody>
    </ProfileCard>
  );
}
