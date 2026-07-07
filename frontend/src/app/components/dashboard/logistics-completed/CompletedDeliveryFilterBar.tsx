import { Search } from "lucide-react";
import {
  COMPLETION_STATUS_LABELS,
  type CompletedDateFilter,
  type CompletedRatingFilter,
  type CompletedStatusFilter,
  type CompletionStatus,
} from "../../../utils/completedDeliveriesStorage";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const STATUS_OPTIONS: CompletionStatus[] = [
  "completed_on_time",
  "completed_late",
  "completed_with_issue",
];

interface CompletedDeliveryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateFilter: CompletedDateFilter;
  onDateFilterChange: (value: CompletedDateFilter) => void;
  region: string;
  onRegionChange: (value: string) => void;
  regions: string[];
  driver: string;
  onDriverChange: (value: string) => void;
  drivers: string[];
  ratingFilter: CompletedRatingFilter;
  onRatingFilterChange: (value: CompletedRatingFilter) => void;
  status: CompletedStatusFilter;
  onStatusChange: (value: CompletedStatusFilter) => void;
}

export function CompletedDeliveryFilterBar(props: CompletedDeliveryFilterBarProps) {
  return (
    <section className="agrivo-completed-filters agrivo-dashboard-panel">
      <div className="agrivo-completed-filters__search">
        <Search className="agrivo-completed-filters__search-icon" />
        <Input
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder="Search by delivery ID, farmer, buyer, product, or driver"
          className="agrivo-completed-filters__input"
        />
      </div>
      <div className="agrivo-completed-filters__controls">
        <Select
          value={props.dateFilter}
          onValueChange={(v) => props.onDateFilterChange(v as CompletedDateFilter)}
        >
          <SelectTrigger className="agrivo-completed-filters__select">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={props.region} onValueChange={props.onRegionChange}>
          <SelectTrigger className="agrivo-completed-filters__select">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {props.regions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={props.driver} onValueChange={props.onDriverChange}>
          <SelectTrigger className="agrivo-completed-filters__select">
            <SelectValue placeholder="Driver" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All drivers</SelectItem>
            {props.drivers.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={props.ratingFilter}
          onValueChange={(v) => props.onRatingFilterChange(v as CompletedRatingFilter)}
        >
          <SelectTrigger className="agrivo-completed-filters__select">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
            <SelectItem value="4plus">4+ stars</SelectItem>
            <SelectItem value="below4">Below 4</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={props.status}
          onValueChange={(v) => props.onStatusChange(v as CompletedStatusFilter)}
        >
          <SelectTrigger className="agrivo-completed-filters__select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {COMPLETION_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
