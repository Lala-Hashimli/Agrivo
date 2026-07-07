import type { PickupTask } from "../../../utils/pickupTasksStorage";
import { PickupStatusBadge } from "./PickupStatusBadge";

export function UpcomingPickupSchedule({ tasks }: { tasks: PickupTask[] }) {
  return (
    <section className="agrivo-pickup-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Upcoming Pickups</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Next collection slots on your route</p>

      <ul className="agrivo-pickup-schedule-list">
        {tasks.map((task) => (
          <li key={task.id} className="agrivo-pickup-schedule-item">
            <div className="agrivo-pickup-schedule-item__time">{task.pickupTime}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#102018]">{task.farmerName}</p>
              <p className="truncate text-xs text-[#5F6F64]">{task.productName}</p>
            </div>
            <PickupStatusBadge status={task.status} className="shrink-0" />
          </li>
        ))}
      </ul>
    </section>
  );
}
