export const VISITOR_API =
  "https://jianshu-visitor-analytics.selectwhale8.chatgpt.site";

export interface VisitorSummary {
  totals: {
    views: number;
    visitors: number;
    countries: number;
    firstVisit: number | null;
    lastVisit: number | null;
  };
  locations: { country: string; lat: number; lng: number; views: number }[];
  countries: { country: string; views: number }[];
  daily: { day: string; views: number }[];
  generatedAt: number;
}

export interface VisitRecord {
  id?: number;
  ip: string;
  country: string;
  region: string;
  city: string;
  views?: number;
  firstVisit?: number;
  lastVisit?: number;
  visited_at?: number;
  path?: string;
  referrer?: string;
  browser?: string;
  device?: string;
}

export function formatVisitTime(
  timestamp: number | null | undefined,
  zone: string,
) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: zone,
  }).format(timestamp);
}
