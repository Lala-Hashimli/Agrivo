import type { CompletedDelivery } from "../../../utils/completedDeliveriesStorage";
import { CompletedDeliveryRow } from "./CompletedDeliveryRow";

const TABLE_COLUMNS = [
  { key: "delivery", label: "Delivery ID", className: "agrivo-completed-table__col--delivery" },
  { key: "route", label: "Route", className: "agrivo-completed-table__col--route" },
  { key: "product", label: "Product", className: "agrivo-completed-table__col--product" },
  { key: "quantity", label: "Quantity", className: "agrivo-completed-table__col--qty" },
  { key: "driver", label: "Driver", className: "agrivo-completed-table__col--driver" },
  { key: "completed", label: "Completed", className: "agrivo-completed-table__col--completed" },
  {
    key: "status",
    label: "Status / Rating",
    className: "agrivo-completed-table__col--status",
  },
  { key: "actions", label: "Action", className: "agrivo-completed-table__col--actions" },
] as const;

export function CompletedDeliveriesTable({
  deliveries,
  onView,
  onDownloadReceipt,
}: {
  deliveries: CompletedDelivery[];
  onView: (delivery: CompletedDelivery) => void;
  onDownloadReceipt?: (delivery: CompletedDelivery) => void;
}) {
  return (
    <div className="agrivo-completed-table-wrap agrivo-dashboard-panel agrivo-completed-deliveries-table-view">
      <table className="agrivo-completed-table">
        <colgroup>
          {TABLE_COLUMNS.map((col) => (
            <col key={col.key} className={col.className} />
          ))}
        </colgroup>
        <thead className="agrivo-completed-table__head">
          <tr>
            {TABLE_COLUMNS.map((col) => (
              <th key={col.key} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <CompletedDeliveryRow
              key={delivery.id}
              delivery={delivery}
              onView={onView}
              onDownloadReceipt={onDownloadReceipt}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
