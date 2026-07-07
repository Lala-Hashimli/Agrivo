import { BadgeCheck, CheckCircle2 } from "lucide-react";
import {
  calculateProfileCompletion,
  type LogisticsDashboardProfile,
} from "../../../utils/logisticsProfileStorage";
import { ProfileCompletionBar } from "../farmer-profile/ProfileCompletionBar";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "../farmer-profile/ProfileLayout";

export function TrustVerificationCard({ profile }: { profile: LogisticsDashboardProfile }) {
  const completion = calculateProfileCompletion(profile);
  const hasFleet = profile.driversCount > 0 && profile.vehiclesCount > 0;
  const hasRegions = profile.serviceRegions.length > 0;
  const hasHours =
    profile.workingDays.length > 0 && Boolean(profile.openingTime && profile.closingTime);

  const checklist = [
    { label: "Company identity verified", done: profile.identityVerified },
    { label: "Phone verified", done: profile.phoneVerified },
    { label: "Fleet information added", done: hasFleet },
    { label: "Service regions added", done: hasRegions },
    { label: "Operating hours completed", done: hasHours },
  ];

  return (
    <ProfileCard className="agrivo-logistics-trust-card">
      <div className="agrivo-logistics-trust-header agrivo-logistics-trust-header--compact">
        <ProfileCardHeader icon={BadgeCheck} title="Trust & Verification" />
        <ProfileCompletionBar
          percent={completion.percent}
          className="agrivo-logistics-trust-progress agrivo-logistics-trust-progress--compact"
        />
      </div>

      <ProfileCardBody className="agrivo-logistics-trust-body">
        <ul className="agrivo-logistics-trust-list agrivo-logistics-trust-list--compact">
          {checklist.map((item) => (
            <li
              key={item.label}
              className={
                item.done ? "agrivo-logistics-trust-item--done" : "agrivo-logistics-trust-item"
              }
            >
              <span className="agrivo-logistics-trust-icon">
                {item.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16a34a]" />
                ) : (
                  <span className="agrivo-logistics-trust-icon-pending" />
                )}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        {completion.missingItems.length > 0 ? (
          <p className="agrivo-logistics-trust-hint agrivo-logistics-trust-hint--compact">
            Complete: {completion.missingItems.join(", ").toLowerCase()}.
          </p>
        ) : null}
      </ProfileCardBody>
    </ProfileCard>
  );
}
