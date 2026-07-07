import { Search } from "lucide-react";
import {
  IN_TRANSIT_STATUS_LABELS,
  type EtaStatusFilter,
  type InTransitStatus,
  type InTransitStatusFilter,
} from "../../../utils/inTransitStorage";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const STATUS_OPTIONS: InTransitStatus[] = [
  "in_transit",
  "near_destination",
  "delayed",
  "issue_reported",
];

interface InTransitFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: InTransitStatusFilter;
  onStatusChange: (value: InTransitStatusFilter) => void;
  region: string;
  onRegionChange: (value: string) => void;
  regions: string[];
  etaFilter: EtaStatusFilter;
  onEtaFilterChange: (value: EtaStatusFilter) => void;
  driver: string;
  onDriverChange: (value: string) => void;
  drivers: string[];
}

export function InTransitFilterBar(props: InTransitFilterBarProps) {
  return (
    <section className="agrivo-transit-filters agrivo-dashboard-panel">
      <div className="agrivo-transit-filters__search">
        <Search className="agrivo-transit-filters__search-icon" />
        <Input
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder="Search by delivery ID, driver, vehicle, buyer, or product"
          className="agrivo-transit-filters__input"
        />
      </div>
      <div className="agrivo-transit-filters__controls">
        <Select value={props.status} onValueChange={(v) => props.onStatusChange(v as InTransitStatusFilter)}>
          <SelectTrigger className="agrivo-transit-filters__select">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {IN_TRANSIT_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={props.region} onValueChange={props.onRegionChange}>
          <SelectTrigger className="agrivo-transit-filters__select">
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
        <Select value={props.etaFilter} onValueChange={(v) => props.onEtaFilterChange(v as EtaStatusFilter)}>
          <SelectTrigger className="agrivo-transit-filters__select">
            <SelectValue placeholder="ETA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ETAs</SelectItem>
            <SelectItem value="arriving_soon">Arriving soon</SelectItem>
            <SelectItem value="on_time">On time</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={props.driver} onValueChange={props.onDriverChange}>
          <SelectTrigger className="agrivo-transit-filters__select">
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
      </div>
    </section>
  );
}
