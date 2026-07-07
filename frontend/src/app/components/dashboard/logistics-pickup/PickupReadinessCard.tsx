import type { PickupReadinessSummary } from "../../../utils/pickupTasksStorage";

const READINESS_ITEMS = [
  { key: "readyNow", label: "Ready now", color: "#16a34a" },
  { key: "packingInProgress", label: "Packing in progress", color: "#0e7490" },
  { key: "waitingForDriver", label: "Waiting for driver", color: "#b45309" },
  { key: "delayedReadiness", label: "Delayed readiness", color: "#c2410c" },
] as const;

export function PickupReadinessCard({ summary }: { summary: PickupReadinessSummary }) {
  const total = Math.max(
    1,
    summary.readyNow +
      summary.packingInProgress +
      summary.waitingForDriver +
      summary.delayedReadiness,
  );

  return (
    <section className="agrivo-pickup-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Pickup Readiness</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Collection readiness breakdown</p>

      <dl className="agrivo-pickup-readiness-grid">
        {READINESS_ITEMS.map((item) => {
          const value = summary[item.key];
          return (
            <div key={item.key} className="agrivo-pickup-readiness-item">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-xs font-semibold text-[#33443a]">{item.label}</dt>
                <dd className="text-sm font-bold text-[#102018]">{value}</dd>
              </div>
              <div className="agrivo-pickup-readiness-track">
                <span
                  style={{
                    width: `${(value / total) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
