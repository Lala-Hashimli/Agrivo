import type { FarmJob } from "../data/farmJobs";

export interface JobMapLocation {
  lat: number;
  lng: number;
  label: string;
  query: string;
}

const DISTRICT_COORDS: Record<string, JobMapLocation> = {
  Quba: { lat: 41.3614, lng: 48.5136, label: "Quba, Azerbaijan", query: "Quba,Azerbaijan" },
  Şəki: { lat: 41.1917, lng: 47.1706, label: "Şəki, Azerbaijan", query: "Sheki,Azerbaijan" },
  Lənkəran: { lat: 38.7543, lng: 48.8506, label: "Lənkəran, Azerbaijan", query: "Lankaran,Azerbaijan" },
  Gəncə: { lat: 40.6828, lng: 46.3606, label: "Gəncə, Azerbaijan", query: "Ganja,Azerbaijan" },
  Tovuz: { lat: 40.9922, lng: 45.6289, label: "Tovuz, Azerbaijan", query: "Tovuz,Azerbaijan" },
  Masallı: { lat: 38.9403, lng: 48.6654, label: "Masallı, Azerbaijan", query: "Masalli,Azerbaijan" },
};

const VILLAGE_COORDS: Record<string, JobMapLocation> = {
  Alpan: { lat: 41.392, lng: 48.548, label: "Alpan village, Quba, Azerbaijan", query: "Alpan,Quba,Azerbaijan" },
  "Qırmızı Qəsəbə": {
    lat: 41.318,
    lng: 48.492,
    label: "Qırmızı Qəsəbə, Quba, Azerbaijan",
    query: "Qirmizi Qesebe,Quba,Azerbaijan",
  },
  Seyidəkəran: {
    lat: 38.723,
    lng: 48.812,
    label: "Seyidəkəran village, Lənkəran, Azerbaijan",
    query: "Seyidakeran,Lankaran,Azerbaijan",
  },
  Aydınbulaq: {
    lat: 41.248,
    lng: 47.112,
    label: "Aydınbulaq village, Şəki, Azerbaijan",
    query: "Aydinbulaq,Sheki,Azerbaijan",
  },
};

export function getJobMapLocation(job: FarmJob): JobMapLocation {
  if (job.latitude != null && job.longitude != null) {
    const label = job.exactLocation || job.location;
    return {
      lat: job.latitude,
      lng: job.longitude,
      label,
      query: `${job.latitude},${job.longitude}`,
    };
  }

  if (job.village && VILLAGE_COORDS[job.village]) {
    return VILLAGE_COORDS[job.village];
  }

  if (DISTRICT_COORDS[job.district]) {
    const base = DISTRICT_COORDS[job.district];
    if (job.village) {
      const label = `${job.village}, ${job.district}, Azerbaijan`;
      return { ...base, label, query: `${job.village},${job.district},Azerbaijan` };
    }
    return base;
  }

  const label = job.exactLocation || job.location;
  return {
    lat: 40.4093,
    lng: 49.8671,
    label,
    query: `${label},Azerbaijan`,
  };
}

export function buildGoogleMapsEmbedUrl(location: JobMapLocation): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(location.query)}&hl=en&z=13&output=embed`;
}

export function buildGoogleMapsOpenUrl(location: JobMapLocation): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.query)}`;
}

export function buildGoogleMapsDirectionsUrl(location: JobMapLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.query)}`;
}

export function formatPostedAgo(isoDate?: string): string | null {
  if (!isoDate) return null;
  const posted = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 30) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted ${posted.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}
