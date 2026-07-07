import {
  PICKUP_PRIORITY_LABELS,
  PICKUP_STATUS_LABELS,
  type PickupPriority,
  type PickupPriorityFilter,
  type PickupStatusFilter,
  type PickupTaskStatus,
  type PickupTimeFilter,
} from "../../../utils/pickupTasksStorage";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Search } from "lucide-react";

interface PickupFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: PickupStatusFilter;
  onStatusChange: (value: PickupStatusFilter) => void;
  timeFilter: PickupTimeFilter;
  onTimeFilterChange: (value: PickupTimeFilter) => void;
  region: string;
  onRegionChange: (value: string) => void;
  regions: string[];
  priority: PickupPriorityFilter;
  onPriorityChange: (value: PickupPriorityFilter) => void;
}

const STATUS_OPTIONS: PickupTaskStatus[] = [
  "scheduled",
  "ready_for_pickup",
  "driver_assigned",
  "pickup_started",
  "collected",
  "delayed",
  "cancelled",
];

const PRIORITY_OPTIONS: PickupPriority[] = ["high", "medium", "low"];

export function PickupFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  timeFilter,
  onTimeFilterChange,
  region,
  onRegionChange,
  regions,
  priority,
  onPriorityChange,
}: PickupFilterBarProps) {
  return (
    <section className="agrivo-pickup-filters agrivo-dashboard-panel">
      <div className="agrivo-pickup-filters__search">
        <Search className="agrivo-pickup-filters__search-icon" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by farm, product, farmer, or pickup ID"
          className="agrivo-pickup-filters__input"
        />
      </div>

      <div className="agrivo-pickup-filters__controls">
        <Select value={status} onValueChange={(value) => onStatusChange(value as PickupStatusFilter)}>
          <SelectTrigger className="agrivo-pickup-filters__select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((item) => (
              <SelectItem key={item} value={item}>
                {PICKUP_STATUS_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={timeFilter}
          onValueChange={(value) => onTimeFilterChange(value as PickupTimeFilter)}
        >
          <SelectTrigger className="agrivo-pickup-filters__select">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="next_2_hours">Next 2 hours</SelectItem>
            <SelectItem value="afternoon">This afternoon</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="agrivo-pickup-filters__select">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {regions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priority}
          onValueChange={(value) => onPriorityChange(value as PickupPriorityFilter)}
        >
          <SelectTrigger className="agrivo-pickup-filters__select">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {PRIORITY_OPTIONS.map((item) => (
              <SelectItem key={item} value={item}>
                {PICKUP_PRIORITY_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
