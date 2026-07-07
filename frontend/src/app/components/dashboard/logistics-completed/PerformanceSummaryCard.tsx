import type { PerformanceSummary } from "../../../utils/completedDeliveriesStorage";

export function PerformanceSummaryCard({ summary }: { summary: PerformanceSummary }) {
  const rows = [
    { label: "On-time rate", value: `${summary.onTimeRate}%`, width: summary.onTimeRate },
    { label: "Issue rate", value: `${summary.issueRate}%`, width: summary.issueRate },
  ];

  return (
    <section className="agrivo-completed-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Performance Summary</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Delivery performance metrics</p>

      <dl className="agrivo-completed-metrics">
        <div>
          <dt>Average duration</dt>
          <dd>{summary.averageDuration}</dd>
        </div>
        <div>
          <dt>Completed deliveries</dt>
          <dd>{summary.totalCompleted}</dd>
        </div>
      </dl>

      <div className="agrivo-completed-progress-bars">
        {rows.map((row) => (
          <div key={row.label} className="agrivo-completed-progress-row">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#33443a]">{row.label}</p>
              <p className="text-sm font-bold text-[#14532D]">{row.value}</p>
            </div>
            <div className="agrivo-transit-card__progress-track">
              <span style={{ width: `${row.width}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
