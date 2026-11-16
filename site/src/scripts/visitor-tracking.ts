import { VISITOR_API } from "../lib/visitor-config";

let lastNavigation = "";
let lastTime = 0;

export function trackVisit() {
  // Previews, prerendered pages, owner dashboards and background tabs don't count.
  if (
    location.hostname !== "beijixionghelulu.github.io" ||
    document.visibilityState !== "visible"
  )
    return;
  const now = performance.now();
  if (location.pathname === lastNavigation && now - lastTime < 1000) return;
  lastNavigation = location.pathname;
  lastTime = now;
  const event = {
    eventId: crypto.randomUUID(),
    path: location.pathname,
    referrer: document.referrer,
  };
  // Keep analytics independent of navigation; the edge supplies IP and time.
  void fetch(`${VISITOR_API}/api/collect`, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => {});
}
