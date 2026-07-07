import { BadgeCheck, CheckCircle2 } from "lucide-react";
import {
  computeProfileCompletion,
  type FarmerDashboardProfile,
} from "../../../utils/farmerProfileStorage";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "./ProfileLayout";
import { ProfileCompletionBar } from "./ProfileCompletionBar";

export function TrustVerificationCard({ profile }: { profile: FarmerDashboardProfile }) {
  const completion = computeProfileCompletion(profile);
  const hasLocation = Boolean(profile.region && profile.district && profile.address.trim());
  const hasProducts = profile.mainProducts.length > 0;

  const checklist = [
    { label: "Identity verified", done: profile.identityVerified },
    { label: "Phone verified", done: profile.phoneVerified },
    { label: "Farm location added", done: hasLocation },
    { label: "Products listed", done: hasProducts },
  ];

  return (
    <ProfileCard>
      <div className="agrivo-farmer-dash-trust-header">
        <ProfileCardHeader icon={BadgeCheck} title="Trust & Verification" />
        <ProfileCompletionBar percent={completion.percent} className="agrivo-farmer-dash-trust-progress" />
      </div>

      <ProfileCardBody>
        <ul className="agrivo-farmer-dash-trust-list">
          {checklist.map((item) => (
            <li
              key={item.label}
              className={
                item.done ? "agrivo-farmer-dash-trust-item--done" : "agrivo-farmer-dash-trust-item"
              }
            >
              <span className="agrivo-farmer-dash-trust-icon">
                {item.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16a34a]" />
                ) : (
                  <span className="agrivo-farmer-dash-trust-icon-pending" />
                )}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        {completion.missingItems.length > 0 ? (
          <p className="agrivo-farmer-dash-trust-hint">
            Complete: {completion.missingItems.join(", ").toLowerCase()}.
          </p>
        ) : null}
      </ProfileCardBody>
    </ProfileCard>
  );
}
