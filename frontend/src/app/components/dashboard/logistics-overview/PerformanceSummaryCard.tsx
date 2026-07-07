import { BarChart3, Clock3, Star, TrendingUp } from "lucide-react";
import type { LogisticsPerformance } from "../../../utils/logisticsDashboardStorage";

export function PerformanceSummaryCard({ performance }: { performance: LogisticsPerformance }) {
  const metrics = [
    {
      label: "On-time rate",
      value: `${performance.onTimeRate}%`,
      icon: TrendingUp,
      progress: performance.onTimeRate,
    },
    {
      label: "Avg. delivery time",
      value: performance.avgDeliveryTime,
      icon: Clock3,
    },
    {
      label: "Completed this week",
      value: String(performance.completedThisWeek),
      icon: BarChart3,
    },
    {
      label: "Success rate",
      value: `${performance.successRate}%`,
      icon: Star,
      progress: performance.successRate,
    },
  ];

  return (
    <section className="agrivo-logistics-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Performance Summary</h3>
      <div className="agrivo-logistics-performance mt-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="agrivo-logistics-performance-item">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="agrivo-logistics-performance-icon">
                    <Icon className="h-3.5 w-3.5 text-[#14532D]" />
                  </span>
                  <p className="text-xs font-medium text-[#5F6F64]">{metric.label}</p>
                </div>
                <p className="text-sm font-bold text-[#102018]">{metric.value}</p>
              </div>
              {metric.progress !== undefined ? (
                <div className="agrivo-logistics-performance-bar">
                  <span style={{ width: `${metric.progress}%` }} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
