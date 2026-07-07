import type { RouteProgressSummary } from "../../../utils/inTransitStorage";

export function RouteProgressCard({ summary }: { summary: RouteProgressSummary }) {
  const rows = [
    { label: "Average completion", value: `${summary.averageCompletion}%`, width: summary.averageCompletion },
    { label: "On-time rate", value: `${summary.onTimeRate}%`, width: summary.onTimeRate },
  ];

  return (
    <section className="agrivo-transit-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Route Progress</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Fleet-wide transit metrics</p>

      <dl className="agrivo-transit-progress-metrics">
        <div>
          <dt>Remaining distance</dt>
          <dd>{summary.totalRemainingDistance} km</dd>
        </div>
        <div>
          <dt>Active routes</dt>
          <dd>{summary.activeRoutes}</dd>
        </div>
      </dl>

      <div className="agrivo-transit-progress-bars">
        {rows.map((row) => (
          <div key={row.label} className="agrivo-transit-progress-row">
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
