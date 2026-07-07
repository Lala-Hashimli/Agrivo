import { Search } from "lucide-react";
import {
  DELIVERY_PRIORITY_LABELS,
  DELIVERY_STATUS_LABELS,
  type DeliveryDateFilter,
  type DeliveryPriorityFilter,
  type DeliveryStatusFilter,
} from "../../../utils/logisticsDashboardStorage";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "../../ui/utils";

const filterClass =
  "agrivo-filter-control h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] text-sm text-[#102018]";

const STATUS_FILTERS: DeliveryStatusFilter[] = [
  "all",
  "assigned",
  "pickup_scheduled",
  "picked_up",
  "in_transit",
  "delivered",
  "delayed",
];

const DATE_FILTERS: Array<{ value: DeliveryDateFilter; label: string }> = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
];

const PRIORITY_FILTERS: DeliveryPriorityFilter[] = ["all", "high", "normal", "low"];

interface DeliveryTasksFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: DeliveryStatusFilter;
  onStatusChange: (value: DeliveryStatusFilter) => void;
  region: string;
  onRegionChange: (value: string) => void;
  regions: string[];
  dateFilter: DeliveryDateFilter;
  onDateFilterChange: (value: DeliveryDateFilter) => void;
  priority: DeliveryPriorityFilter;
  onPriorityChange: (value: DeliveryPriorityFilter) => void;
}

export function DeliveryTasksFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  region,
  onRegionChange,
  regions,
  dateFilter,
  onDateFilterChange,
  priority,
  onPriorityChange,
}: DeliveryTasksFilterBarProps) {
  return (
    <div className="agrivo-logistics-tasks-filters">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by farm, buyer, product, or task ID"
          className="h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] pl-10 text-sm"
        />
      </div>

      <Select value={status} onValueChange={(value) => onStatusChange(value as DeliveryStatusFilter)}>
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[170px]")}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTERS.map((item) => (
            <SelectItem key={item} value={item}>
              {item === "all" ? "All statuses" : DELIVERY_STATUS_LABELS[item]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={region} onValueChange={onRegionChange}>
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[150px]")}>
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

      <Select value={dateFilter} onValueChange={(value) => onDateFilterChange(value as DeliveryDateFilter)}>
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[140px]")}>
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          {DATE_FILTERS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={priority}
        onValueChange={(value) => onPriorityChange(value as DeliveryPriorityFilter)}
      >
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[140px]")}>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_FILTERS.map((item) => (
            <SelectItem key={item} value={item}>
              {item === "all" ? "All priorities" : DELIVERY_PRIORITY_LABELS[item]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
