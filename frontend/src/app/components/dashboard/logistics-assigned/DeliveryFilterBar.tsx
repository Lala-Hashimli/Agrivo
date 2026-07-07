import { Search } from "lucide-react";
import {
  ASSIGNED_PRIORITY_OPTIONS,
  ASSIGNED_STATUS_LABELS,
  type AssignedDateFilter,
  type AssignedPriorityFilter,
  type AssignedStatusFilter,
} from "../../../utils/assignedDeliveriesStorage";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface DeliveryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: AssignedStatusFilter;
  onStatusChange: (value: AssignedStatusFilter) => void;
  dateFilter: AssignedDateFilter;
  onDateFilterChange: (value: AssignedDateFilter) => void;
  region: string;
  onRegionChange: (value: string) => void;
  regions: string[];
  priority: AssignedPriorityFilter;
  onPriorityChange: (value: AssignedPriorityFilter) => void;
}

export function DeliveryFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  region,
  onRegionChange,
  regions,
  priority,
  onPriorityChange,
}: DeliveryFilterBarProps) {
  return (
    <section className="agrivo-assigned-filters agrivo-dashboard-panel">
      <div className="agrivo-assigned-filters__search">
        <Search className="agrivo-assigned-filters__search-icon" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by delivery ID, farm, buyer, or product"
          className="agrivo-assigned-filters__input"
        />
      </div>

      <div className="agrivo-assigned-filters__controls">
        <Select value={status} onValueChange={(value) => onStatusChange(value as AssignedStatusFilter)}>
          <SelectTrigger className="agrivo-assigned-filters__select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(
              [
                "assigned",
                "pickup_scheduled",
                "picked_up",
                "in_transit",
                "delivered",
                "delayed",
                "cancelled",
              ] as const
            ).map((item) => (
              <SelectItem key={item} value={item}>
                {ASSIGNED_STATUS_LABELS[item]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={dateFilter}
          onValueChange={(value) => onDateFilterChange(value as AssignedDateFilter)}
        >
          <SelectTrigger className="agrivo-assigned-filters__select">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="agrivo-assigned-filters__select">
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
          onValueChange={(value) => onPriorityChange(value as AssignedPriorityFilter)}
        >
          <SelectTrigger className="agrivo-assigned-filters__select">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {ASSIGNED_PRIORITY_OPTIONS.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
