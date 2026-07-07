import { FileText, Upload } from "lucide-react";
import {
  getDocumentStatusStyles,
  getVerificationStatusLabel,
  type DocumentStatus,
  type LogisticsDashboardProfile,
} from "../../../utils/logisticsProfileStorage";
import { Button } from "../../ui/button";
import { ProfileCard, ProfileCardBody, ProfileCardHeader } from "../farmer-profile/ProfileLayout";

const DOCUMENT_ITEMS: Array<{
  key: keyof LogisticsDashboardProfile["documents"];
  label: string;
  uploadLabel: string;
}> = [
  { key: "registration", label: "Business registration", uploadLabel: "Upload business document" },
  { key: "transportLicense", label: "Transport license", uploadLabel: "Upload license" },
  { key: "vehicleDocs", label: "Vehicle documents", uploadLabel: "Upload vehicle docs" },
  { key: "insurance", label: "Insurance", uploadLabel: "Upload insurance" },
  { key: "driverVerification", label: "Driver verification", uploadLabel: "Upload driver records" },
];

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span className={`agrivo-logistics-doc-status ${getDocumentStatusStyles(status)}`}>
      {getVerificationStatusLabel(status)}
    </span>
  );
}

export function DocumentsComplianceCard({
  profile,
  onUpload,
}: {
  profile: LogisticsDashboardProfile;
  onUpload?: (label: string) => void;
}) {
  return (
    <ProfileCard>
      <ProfileCardHeader icon={FileText} title="Documents & Compliance" />
      <ProfileCardBody className="agrivo-logistics-doc-body">
        <ul className="agrivo-logistics-doc-list agrivo-logistics-doc-list--compact">
          {DOCUMENT_ITEMS.map((item) => (
            <li key={item.key} className="agrivo-logistics-doc-row agrivo-logistics-doc-row--compact">
              <span className="agrivo-logistics-doc-label">{item.label}</span>
              <DocumentStatusBadge status={profile.documents[item.key]} />
            </li>
          ))}
        </ul>

        <div className="agrivo-logistics-doc-uploads agrivo-logistics-doc-uploads--compact">
          {DOCUMENT_ITEMS.slice(0, 3).map((item) => (
            <Button
              key={item.key}
              type="button"
              variant="outline"
              size="sm"
              className="agrivo-logistics-doc-upload-btn rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
              onClick={() => onUpload?.(item.uploadLabel)}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              <span className="truncate">{item.uploadLabel}</span>
            </Button>
          ))}
        </div>
      </ProfileCardBody>
    </ProfileCard>
  );
}
