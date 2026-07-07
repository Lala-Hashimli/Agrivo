import type { EconomicRegion } from "./azerbaijanRegions";
import {
  districtsMatch,
  getEconomicRegionForDistrict,
} from "./economicRegionDistricts";

export const JOB_TYPES = [
  "Harvesting",
  "Picking",
  "Packing",
  "Planting",
  "Greenhouse Work",
  "Loading",
  "Farm Helper",
] as const;

export const CROP_TYPES = [
  "Cherry",
  "Apple",
  "Tomato",
  "Grape",
  "Hazelnut",
  "Potato",
  "Cucumber",
  "Pepper",
] as const;

export type JobType = (typeof JOB_TYPES)[number];
export type CropType = (typeof CROP_TYPES)[number];
export type JobStatus = "active" | "closed";

export interface FarmJobBenefits {
  mealsIncluded?: boolean;
  transportIncluded?: boolean;
  housingIncluded?: boolean;
  housingOptional?: boolean;
  equipmentProvided?: boolean;
}

export interface FarmJob {
  id: string;
  slug: string;
  title: string;
  farmerName: string;
  farmerSlug?: string;
  farmerVerified: boolean;
  location: string;
  district: string;
  village?: string;
  economicRegion?: EconomicRegion;
  exactLocation?: string;
  latitude?: number;
  longitude?: number;
  jobType: JobType;
  cropType: CropType;
  workersNeeded: number;
  dailyPay: number;
  startDate: string;
  endDate: string;
  workingHours: string;
  benefits: FarmJobBenefits;
  experienceRequired: boolean;
  experienceLabel: string;
  requirements: string[];
  included: string[];
  description: string;
  phone: string;
  whatsapp: string;
  status: JobStatus;
  urgent?: boolean;
  applicantsCount: number;
  postedAt?: string;
  ownerEmail?: string;
  isMock?: boolean;
}

export const DATE_FILTER_LABELS: Record<string, string> = {
  "this-week": "This week",
  "this-month": "This month",
  upcoming: "Upcoming",
};

export interface JobFilters {
  search: string;
  jobType: string;
  cropType: string;
  location: string;
  economicRegion: string;
  dateRange: string;
  payMin: string;
  payMax: string;
  mealsIncluded: boolean;
  transportIncluded: boolean;
  housingIncluded: boolean;
  experienceRequired: boolean | null;
}

export const defaultJobFilters: JobFilters = {
  search: "",
  jobType: "all",
  cropType: "all",
  location: "all",
  economicRegion: "all",
  dateRange: "any",
  payMin: "",
  payMax: "",
  mealsIncluded: false,
  transportIncluded: false,
  housingIncluded: false,
  experienceRequired: null,
};

export function getJobEconomicRegion(job: FarmJob): EconomicRegion | undefined {
  if (job.economicRegion) return job.economicRegion;
  return getEconomicRegionForDistrict(job.district) ?? undefined;
}

export function getEconomicRegionForLocation(location: string): EconomicRegion | "all" {
  if (location === "all") return "all";
  return getEconomicRegionForDistrict(location) ?? "all";
}

export function formatJobDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: "numeric" };

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString("en-US", { month: "long" })} ${start.getDate()} – ${end.getDate()}`;
    }
    return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", yearOpts)}`;
  }

  return `${start.toLocaleDateString("en-US", yearOpts)} – ${end.toLocaleDateString("en-US", yearOpts)}`;
}

export function getJobBenefitTags(job: FarmJob): string[] {
  const tags: string[] = [];
  if (!job.experienceRequired) tags.push("No experience needed");
  else tags.push(job.experienceLabel);
  if (job.benefits.mealsIncluded) tags.push("Meals included");
  if (job.benefits.transportIncluded) tags.push("Transport included");
  if (job.benefits.housingIncluded) tags.push("Housing included");
  if (job.benefits.housingOptional) tags.push("Housing optional");
  if (job.benefits.equipmentProvided) tags.push("Equipment provided");
  if (job.urgent) tags.push("Urgent");
  return tags;
}

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function jobOverlapsRange(job: FarmJob, rangeStart: Date, rangeEnd: Date): boolean {
  const jobStart = parseDateOnly(job.startDate);
  const jobEnd = parseDateOnly(job.endDate);
  return jobStart <= rangeEnd && jobEnd >= rangeStart;
}

function matchesDateFilter(job: FarmJob, dateRange: string): boolean {
  if (dateRange === "any") return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const jobStart = parseDateOnly(job.startDate);
  const jobEnd = parseDateOnly(job.endDate);

  if (dateRange === "upcoming") {
    return jobStart >= today;
  }

  if (dateRange === "this-week") {
    return jobOverlapsRange(job, startOfWeek(today), endOfWeek(today));
  }

  if (dateRange === "this-month") {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    return jobOverlapsRange(job, monthStart, monthEnd);
  }

  return true;
}

export function filterFarmJobs(jobs: FarmJob[], filters: JobFilters, options?: { includeClosed?: boolean }): FarmJob[] {
  const query = filters.search.trim().toLowerCase();
  const payMin = filters.payMin ? Number(filters.payMin) : null;
  const payMax = filters.payMax ? Number(filters.payMax) : null;

  return jobs.filter((job) => {
    if (!options?.includeClosed && job.status === "closed") return false;

    const matchesSearch =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.farmerName.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.cropType.toLowerCase().includes(query) ||
      job.jobType.toLowerCase().includes(query) ||
      job.district.toLowerCase().includes(query) ||
      (job.village?.toLowerCase().includes(query) ?? false);

    const matchesJobType = filters.jobType === "all" || job.jobType === filters.jobType;
    const matchesCrop = filters.cropType === "all" || job.cropType === filters.cropType;

    const jobRegion = getJobEconomicRegion(job);
    const matchesEconomicRegion =
      filters.economicRegion === "all" || jobRegion === filters.economicRegion;

    const matchesLocation =
      filters.location === "all" ||
      districtsMatch(job.district, filters.location) ||
      districtsMatch(job.location, filters.location) ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesPay =
      (payMin === null || job.dailyPay >= payMin) && (payMax === null || job.dailyPay <= payMax);

    const matchesMeals = !filters.mealsIncluded || job.benefits.mealsIncluded === true;
    const matchesTransport = !filters.transportIncluded || job.benefits.transportIncluded === true;
    const matchesHousing =
      !filters.housingIncluded || job.benefits.housingIncluded === true || job.benefits.housingOptional === true;

    const matchesExperience =
      filters.experienceRequired === null || job.experienceRequired === filters.experienceRequired;

    return (
      matchesSearch &&
      matchesJobType &&
      matchesCrop &&
      matchesEconomicRegion &&
      matchesLocation &&
      matchesDateFilter(job, filters.dateRange) &&
      matchesPay &&
      matchesMeals &&
      matchesTransport &&
      matchesHousing &&
      matchesExperience
    );
  });
}

export const mockFarmJobs: FarmJob[] = [
  {
    id: "job-1",
    slug: "cherry-harvest-quba",
    title: "Cherry Harvest Workers Needed",
    farmerName: "Aysel Mammadova",
    farmerSlug: "aysel-mammadova",
    farmerVerified: true,
    location: "Quba, Alpan village",
    district: "Quba",
    village: "Alpan",
    economicRegion: "Quba-Xaçmaz",
    latitude: 41.392,
    longitude: 48.548,
    jobType: "Harvesting",
    cropType: "Cherry",
    workersNeeded: 5,
    dailyPay: 20,
    startDate: "2026-06-20",
    endDate: "2026-06-25",
    workingHours: "08:00 – 17:00",
    benefits: { mealsIncluded: true, transportIncluded: true, equipmentProvided: true },
    experienceRequired: false,
    experienceLabel: "No experience required",
    requirements: [
      "No experience required",
      "Able to work outdoors",
      "Must arrive on time",
      "Comfortable working with fruit harvesting",
    ],
    included: ["Meals included", "Transport included", "Equipment provided"],
    description:
      "We are looking for seasonal workers to help collect cherries in our orchard. Work starts at 08:00 and ends at 17:00. The job is suitable for people who can work outdoors and handle fruit carefully.",
    phone: "+994501234567",
    whatsapp: "+994501234567",
    status: "active",
    applicantsCount: 12,
    postedAt: "2026-06-10",
    isMock: true,
  },
  {
    id: "job-2",
    slug: "apple-picking-quba",
    title: "Apple Picking Workers",
    farmerName: "Nigar Safarova",
    farmerSlug: "nigar-safarova",
    farmerVerified: true,
    location: "Quba, Qırmızı Qəsəbə",
    district: "Quba",
    village: "Qırmızı Qəsəbə",
    economicRegion: "Quba-Xaçmaz",
    latitude: 41.318,
    longitude: 48.492,
    jobType: "Picking",
    cropType: "Apple",
    workersNeeded: 4,
    dailyPay: 18,
    startDate: "2026-09-05",
    endDate: "2026-09-12",
    workingHours: "07:30 – 16:30",
    benefits: { mealsIncluded: true },
    experienceRequired: false,
    experienceLabel: "No experience required",
    requirements: ["No experience required", "Able to work outdoors", "Careful handling of apples"],
    included: ["Meals included"],
    description:
      "Seasonal apple picking in our hillside orchard. Workers will be trained on proper picking technique. Steady daily work for one week.",
    phone: "+994502345678",
    whatsapp: "+994502345678",
    status: "active",
    applicantsCount: 7,
    postedAt: "2026-08-28",
    isMock: true,
  },
  {
    id: "job-3",
    slug: "tomato-greenhouse-lankaran",
    title: "Tomato Greenhouse Helper",
    farmerName: "Ali Hasanov",
    farmerSlug: "ali-hasanov",
    farmerVerified: true,
    location: "Lənkəran, Seyidəkəran village",
    district: "Lənkəran",
    village: "Seyidəkəran",
    economicRegion: "Lənkəran-Astara",
    latitude: 38.723,
    longitude: 48.812,
    jobType: "Greenhouse Work",
    cropType: "Tomato",
    workersNeeded: 3,
    dailyPay: 22,
    startDate: "2026-07-01",
    endDate: "2026-07-10",
    workingHours: "08:00 – 18:00",
    benefits: { transportIncluded: true },
    experienceRequired: true,
    experienceLabel: "Experienced preferred",
    requirements: ["Greenhouse experience preferred", "Able to stand for long periods", "Reliable attendance"],
    included: ["Transport included"],
    description:
      "Help with tomato care, sorting, and packing in our modern greenhouse. Ideal for workers with prior greenhouse or vegetable farm experience.",
    phone: "+994503456789",
    whatsapp: "+994503456789",
    status: "active",
    applicantsCount: 5,
    postedAt: "2026-06-25",
    isMock: true,
  },
  {
    id: "job-4",
    slug: "hazelnut-harvest-sheki",
    title: "Hazelnut Collection Workers",
    farmerName: "Murad Karimov",
    farmerSlug: "murad-karimov",
    farmerVerified: true,
    location: "Şəki, Aydınbulaq village",
    district: "Şəki",
    village: "Aydınbulaq",
    economicRegion: "Şəki-Zaqatala",
    latitude: 41.248,
    longitude: 47.112,
    jobType: "Harvesting",
    cropType: "Hazelnut",
    workersNeeded: 6,
    dailyPay: 25,
    startDate: "2026-08-10",
    endDate: "2026-08-18",
    workingHours: "07:00 – 16:00",
    benefits: { mealsIncluded: true, housingOptional: true },
    experienceRequired: false,
    experienceLabel: "No experience required",
    requirements: ["No experience required", "Comfortable working on slopes", "Team-oriented attitude"],
    included: ["Meals included", "Housing optional"],
    description:
      "Join our hazelnut harvest team in the Şəki highlands. Housing can be arranged for workers coming from outside the district.",
    phone: "+994504567890",
    whatsapp: "+994504567890",
    status: "active",
    applicantsCount: 9,
    postedAt: "2026-07-28",
    isMock: true,
  },
  {
    id: "job-5",
    slug: "grape-harvest-tovuz",
    title: "Grape Harvest Team",
    farmerName: "Rashad Aliyev",
    farmerSlug: "rashad-aliyev",
    farmerVerified: true,
    location: "Tovuz",
    district: "Tovuz",
    economicRegion: "Qazax-Tovuz",
    latitude: 40.9922,
    longitude: 45.6289,
    jobType: "Harvesting",
    cropType: "Grape",
    workersNeeded: 8,
    dailyPay: 24,
    startDate: "2026-09-15",
    endDate: "2026-09-22",
    workingHours: "06:30 – 15:30",
    benefits: { transportIncluded: true, mealsIncluded: true },
    experienceRequired: true,
    experienceLabel: "Experienced preferred",
    requirements: ["Harvest experience preferred", "Early morning availability", "Able to work in vineyard rows"],
    included: ["Transport included", "Meals included"],
    description:
      "Large-scale grape harvest for our vineyard near Tovuz. We need a reliable team for one intensive week during peak season.",
    phone: "+994505678901",
    whatsapp: "+994505678901",
    status: "active",
    applicantsCount: 14,
    postedAt: "2026-08-05",
    isMock: true,
  },
];

export function getRegionJobCounts(
  jobs: FarmJob[],
  filters: JobFilters,
): Partial<Record<EconomicRegion, number>> {
  const withoutRegion: JobFilters = { ...filters, economicRegion: "all", location: "all" };
  const baseJobs = filterFarmJobs(jobs, withoutRegion);
  const counts: Partial<Record<EconomicRegion, number>> = {};

  for (const job of baseJobs) {
    const region = getJobEconomicRegion(job);
    if (!region) continue;
    counts[region] = (counts[region] ?? 0) + 1;
  }

  return counts;
}

export function getJobBySlug(slug: string, jobs: FarmJob[]): FarmJob | undefined {
  return jobs.find((job) => job.slug === slug);
}

export function slugifyJobTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
