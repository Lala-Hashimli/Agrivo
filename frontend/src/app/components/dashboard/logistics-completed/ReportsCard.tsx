import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "../../ui/button";

export function ReportsCard({
  onExport,
  onDownloadMonthly,
  onDownloadDriver,
}: {
  onExport: () => void;
  onDownloadMonthly: () => void;
  onDownloadDriver: () => void;
}) {
  return (
    <section className="agrivo-completed-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Reports</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Export delivery records</p>
      <div className="agrivo-completed-reports-actions">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={onExport}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export completed deliveries
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={onDownloadMonthly}
        >
          <FileText className="mr-2 h-4 w-4" />
          Download monthly report
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
          onClick={onDownloadDriver}
        >
          <Download className="mr-2 h-4 w-4" />
          Download driver performance
        </Button>
      </div>
    </section>
  );
}
