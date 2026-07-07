import { Search } from "lucide-react";
import {
  FARMER_ORDER_STATUS_LABELS,
  type FarmerManagementOrderStatus,
  type FarmerOrderDateFilter,
  type FarmerOrderSortOption,
} from "../../../utils/farmerOrdersStorage";
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

const STATUS_FILTERS: Array<FarmerManagementOrderStatus | "all"> = [
  "all",
  "pending",
  "accepted",
  "preparing",
  "ready_for_pickup",
  "delivered",
  "cancelled",
];

const DATE_FILTERS: Array<{ value: FarmerOrderDateFilter; label: string }> = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const SORT_OPTIONS: Array<{ value: FarmerOrderSortOption; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "value-desc", label: "Highest value" },
];

interface OrdersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: FarmerManagementOrderStatus | "all";
  onStatusChange: (value: FarmerManagementOrderStatus | "all") => void;
  dateFilter: FarmerOrderDateFilter;
  onDateFilterChange: (value: FarmerOrderDateFilter) => void;
  sort: FarmerOrderSortOption;
  onSortChange: (value: FarmerOrderSortOption) => void;
}

export function OrdersFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  sort,
  onSortChange,
}: OrdersFilterBarProps) {
  return (
    <div className="agrivo-farmer-order-filters">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by buyer, product, or order ID"
          className="h-11 rounded-full border-[#DEECE0] bg-[#F7FBF5] pl-10 text-sm"
        />
      </div>

      <Select value={status} onValueChange={(value) => onStatusChange(value as FarmerManagementOrderStatus | "all")}>
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[190px]")}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTERS.map((item) => (
            <SelectItem key={item} value={item}>
              {item === "all" ? "All statuses" : FARMER_ORDER_STATUS_LABELS[item]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={dateFilter} onValueChange={(value) => onDateFilterChange(value as FarmerOrderDateFilter)}>
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[160px]")}>
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

      <Select value={sort} onValueChange={(value) => onSortChange(value as FarmerOrderSortOption)}>
        <SelectTrigger className={cn(filterClass, "w-full sm:w-[170px]")}>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
