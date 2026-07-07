export const WEEKDAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type WeekDay = (typeof WEEKDAY_ORDER)[number];

export type SchedulePreset = "every_day" | "mon_fri" | "mon_sat" | "custom";

export const WEEKDAY_META: Record<WeekDay, { short: string; full: string }> = {
  monday: { short: "Mon", full: "Monday" },
  tuesday: { short: "Tue", full: "Tuesday" },
  wednesday: { short: "Wed", full: "Wednesday" },
  thursday: { short: "Thu", full: "Thursday" },
  friday: { short: "Fri", full: "Friday" },
  saturday: { short: "Sat", full: "Saturday" },
  sunday: { short: "Sun", full: "Sunday" },
};

export const SCHEDULE_PRESETS: Array<{ id: SchedulePreset; label: string }> = [
  { id: "every_day", label: "Every day" },
  { id: "mon_fri", label: "Monday - Friday" },
  { id: "mon_sat", label: "Monday - Saturday" },
  { id: "custom", label: "Custom" },
];

const PRESET_DAYS: Record<Exclude<SchedulePreset, "custom">, WeekDay[]> = {
  every_day: [...WEEKDAY_ORDER],
  mon_fri: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  mon_sat: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
};

export function normalizeWorkingDays(days: unknown): WeekDay[] {
  if (!Array.isArray(days)) return [];
  return WEEKDAY_ORDER.filter((day) => days.includes(day));
}

export function migrateWorkingDays(value: unknown): WeekDay[] {
  if (Array.isArray(value)) {
    const normalized = normalizeWorkingDays(value);
    return normalized.length > 0 ? normalized : PRESET_DAYS.mon_sat;
  }

  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if (!lower) return PRESET_DAYS.mon_sat;

    if (lower.includes("every day") || lower === "daily" || lower.includes("7 days")) {
      return PRESET_DAYS.every_day;
    }

    const hasMonday = lower.includes("monday") || lower.includes("mon");
    const hasFriday = lower.includes("friday") || lower.includes("fri");
    const hasSaturday = lower.includes("saturday") || lower.includes("sat");
    const hasSunday = lower.includes("sunday") || lower.includes("sun");

    if (hasMonday && hasFriday && !hasSaturday && !hasSunday) {
      return PRESET_DAYS.mon_fri;
    }

    if (hasMonday && hasSaturday) {
      return PRESET_DAYS.mon_sat;
    }

    const parsed: WeekDay[] = [];
    for (const day of WEEKDAY_ORDER) {
      const full = WEEKDAY_META[day].full.toLowerCase();
      const short = WEEKDAY_META[day].short.toLowerCase();
      if (lower.includes(full) || new RegExp(`\\b${short}\\b`).test(lower)) {
        parsed.push(day);
      }
    }

    if (parsed.length > 0) return normalizeWorkingDays(parsed);
  }

  return PRESET_DAYS.mon_sat;
}

export function applySchedulePreset(preset: SchedulePreset): WeekDay[] {
  if (preset === "custom") return [];
  return [...PRESET_DAYS[preset]];
}

export function detectSchedulePreset(days: WeekDay[]): SchedulePreset {
  const sorted = sortWorkingDays(days);
  const key = sorted.join(",");

  if (key === PRESET_DAYS.every_day.join(",")) return "every_day";
  if (key === PRESET_DAYS.mon_fri.join(",")) return "mon_fri";
  if (key === PRESET_DAYS.mon_sat.join(",")) return "mon_sat";
  return "custom";
}

export function sortWorkingDays(days: WeekDay[]): WeekDay[] {
  return WEEKDAY_ORDER.filter((day) => days.includes(day));
}

export function toggleWorkingDay(days: WeekDay[], day: WeekDay): WeekDay[] {
  return days.includes(day) ? days.filter((item) => item !== day) : sortWorkingDays([...days, day]);
}

function formatDayRange(days: WeekDay[]): string {
  if (days.length === 0) return "";
  if (days.length === 7) return "Every day";

  const runs: WeekDay[][] = [];
  let current: WeekDay[] = [];

  for (const day of WEEKDAY_ORDER) {
    if (days.includes(day)) {
      current.push(day);
    } else if (current.length > 0) {
      runs.push(current);
      current = [];
    }
  }
  if (current.length > 0) runs.push(current);

  if (runs.length === 1 && runs[0].length > 2) {
    const run = runs[0];
    return `${WEEKDAY_META[run[0]].full} - ${WEEKDAY_META[run[run.length - 1]].full}`;
  }

  return days.map((day) => WEEKDAY_META[day].short).join(", ");
}

export function formatWorkingDays(days: WeekDay[]): string {
  const sorted = sortWorkingDays(days);
  if (sorted.length === 0) return "Select at least one working day";
  return formatDayRange(sorted);
}

export function formatTime12h(time: string): string {
  if (!time) return "";
  const [hourPart, minutePart] = time.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatScheduleSummary(
  days: WeekDay[],
  openingTime: string,
  closingTime: string,
): string {
  if (days.length === 0) {
    return "Select at least one working day.";
  }

  const daysLabel = formatWorkingDays(days);
  if (openingTime && closingTime) {
    return `Open ${daysLabel}, ${formatTime12h(openingTime)} - ${formatTime12h(closingTime)}`;
  }

  return `Open ${daysLabel}`;
}

export function formatPublicScheduleLines(
  days: WeekDay[],
  openingTime: string,
  closingTime: string,
): { daysLine: string; hoursLine: string } | null {
  if (days.length === 0) return null;

  const daysLine = formatWorkingDays(days);
  const hoursLine =
    openingTime && closingTime
      ? `${formatTime12h(openingTime)} - ${formatTime12h(closingTime)}`
      : "";

  return { daysLine, hoursLine };
}

export function validateSchedule(
  days: WeekDay[],
  openingTime: string,
  closingTime: string,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (days.length === 0) {
    errors.workingDays = "Select at least one working day.";
  }

  if (openingTime && closingTime && openingTime >= closingTime) {
    errors.closingTime = "Closing time should be later than opening time.";
  }

  return errors;
}
