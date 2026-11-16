import {
  formatVisitTime,
  type VisitorSummary,
  type VisitRecord,
} from "../lib/visitor-config";

export function setupVisitorDashboard() {
  document
    .querySelectorAll<HTMLElement>("[data-visitor-dashboard]")
    .forEach(init);
}

function init(root: HTMLElement) {
  if (root.dataset.initialized) return;
  root.dataset.initialized = "true";
  const api = root.dataset.api!;
  const compact = root.dataset.compact === "true";
  const controller = new AbortController();
  const { signal } = controller;
  const get = <T extends HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const status = get("[data-visitor-status]");
  const retry = get<HTMLButtonElement>("[data-visitor-retry]");
  const period = root.querySelector<HTMLSelectElement>("[data-visitor-period]");
  const owner =
    location.origin === new URL(api).origin &&
    /^\/admin\/?$/.test(location.pathname);
  const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countryName = (code: string) => {
    try {
      return code ? countryNames.of(code) || code : "Unknown region";
    } catch {
      return code || "Unknown region";
    }
  };
  let summary: VisitorSummary | undefined;
  let queryGeneration = 0;
  let globe: { destroy(): void } | undefined;
  let globeRequested = false;
  let globeGeneration = 0;
  let globeMarkers: { location: [number, number]; size: number }[] = [];
  const canvas = get<HTMLCanvasElement>("[data-visitor-globe]");
  const rotation = get<HTMLButtonElement>("[data-globe-rotate]");
  let rotating = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  let phi = 0.5;
  let theta = 0.2;
  let pointerX: number | null = null;
  let pointerY = 0;
  let width = 0;
  let isVisible = true;

  function syncRotationButton() {
    rotation.textContent = rotating ? "Pause rotation" : "Resume rotation";
    rotation.setAttribute("aria-pressed", String(rotating));
  }
  syncRotationButton();
  rotation.addEventListener(
    "click",
    () => {
      rotating = !rotating;
      syncRotationButton();
    },
    { signal },
  );
  canvas.addEventListener(
    "pointerdown",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    },
    { signal },
  );
  canvas.addEventListener(
    "pointermove",
    (event) => {
      if (pointerX === null) return;
      phi += (event.clientX - pointerX) / 180;
      theta = Math.max(
        -0.8,
        Math.min(0.8, theta + (event.clientY - pointerY) / 250),
      );
      pointerX = event.clientX;
      pointerY = event.clientY;
    },
    { signal },
  );
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) {
    canvas.addEventListener(
      event,
      () => {
        pointerX = null;
      },
      { signal },
    );
  }
  canvas.addEventListener(
    "keydown",
    (event) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key === "ArrowLeft") phi -= 0.15;
      if (event.key === "ArrowRight") phi += 0.15;
      if (event.key === "ArrowUp") theta = Math.min(0.8, theta + 0.1);
      if (event.key === "ArrowDown") theta = Math.max(-0.8, theta - 0.1);
    },
    { signal },
  );
  const resize = new ResizeObserver(() => {
    width = canvas.clientWidth;
  });
  resize.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  });
  visibility.observe(canvas);

  async function startGlobe() {
    globeRequested = true;
    const generation = ++globeGeneration;
    try {
      const { default: createGlobe } = await import("cobe");
      if (signal.aborted || generation !== globeGeneration) return;
      globe?.destroy();
      width = canvas.clientWidth;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      let previousFrame = performance.now();
      globe = createGlobe(canvas, {
        devicePixelRatio: ratio,
        width: width * ratio,
        height: canvas.clientHeight * ratio,
        phi,
        theta,
        dark: 1,
        diffuse: 1.3,
        mapSamples: compact ? 12000 : 20000,
        mapBrightness: 5,
        baseColor: [0.38, 0.56, 0.46],
        markerColor: [0.78, 1, 0.72],
        glowColor: [0.16, 0.3, 0.24],
        markers: globeMarkers,
        onRender: (state) => {
          const frame = performance.now();
          if (rotating && pointerX === null && isVisible && !document.hidden) {
            phi += Math.min(frame - previousFrame, 50) * 0.00012;
          }
          previousFrame = frame;
          state.phi = phi;
          state.theta = theta;
          state.width = width * ratio;
          state.height = canvas.clientHeight * ratio;
        },
      });
      if (!canvas.getContext("webgl") && !canvas.getContext("webgl2"))
        throw new Error("WebGL unavailable");
    } catch {
      get("[data-globe-fallback]").hidden = false;
      canvas.hidden = true;
      rotation.hidden = true;
    }
  }

  function renderSummary(data: VisitorSummary) {
    summary = data;
    get("[data-visitor-views]").textContent =
      data.totals.views.toLocaleString();
    get("[data-visitor-ips]").textContent =
      data.totals.visitors.toLocaleString();
    get("[data-visitor-countries]").textContent =
      data.totals.countries.toLocaleString();
    globeMarkers = data.locations.slice(0, 64).map((point) => ({
      location: [point.lat, point.lng],
      size: Math.min(0.12, 0.035 + Math.log1p(point.views) * 0.009),
    }));
    // COBE 0.6 has 64 marker slots. Recreate with the complete marker array
    // because its dynamic-marker update counts pairs differently.
    if (globeRequested) void startGlobe();
    const list = get("[data-visitor-country-list]");
    list.replaceChildren();
    for (const place of data.countries.slice(0, compact ? 4 : 50)) {
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = countryName(place.country);
      const count = document.createElement("span");
      count.textContent = place.views.toLocaleString();
      const track = document.createElement("div");
      track.className = "visitor-country-bar";
      const bar = document.createElement("span");
      bar.style.width = `${Math.max(2, (place.views / Math.max(1, data.totals.views)) * 100)}%`;
      track.append(bar);
      li.append(name, count, track);
      list.append(li);
    }
    if (!data.countries.length) {
      const li = document.createElement("li");
      li.className = "visitor-empty";
      li.textContent = "No visits in this period yet.";
      list.append(li);
    }
    const missing = data.totals.views > 0 && !data.locations.length;
    status.textContent = `${missing ? "Locations are unavailable for these visits. " : ""}Updated ${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(data.generatedAt)} · ${compact ? "Last 30 days" : "Refresh for latest visits"}`;
    retry.hidden = true;
    if (!compact) renderTrend(data);
  }

  function renderTrend(data: VisitorSummary) {
    const trend = get("[data-visitor-trend]");
    const days = period?.value || "30";
    const now = Date.now();
    const start =
      days === "all"
        ? Math.max(data.totals.firstVisit || now, now - 365 * 86400000)
        : now - Number(days) * 86400000;
    const dayCounts = new Map(data.daily.map((day) => [day.day, day.views]));
    const entries: { day: string; views: number }[] = [];
    for (let day = start; day <= now; day += 86400000) {
      const date = new Date(day).toISOString().slice(0, 10);
      entries.push({ day: date, views: dayCounts.get(date) || 0 });
    }
    const max = Math.max(1, ...entries.map((day) => day.views));
    trend.replaceChildren();
    for (const entry of entries) {
      const bar = document.createElement("div");
      bar.className = "visitor-trend-bar";
      bar.style.height = `${Math.max(2, (entry.views / max) * 100)}%`;
      bar.style.opacity = entry.views ? "1" : "0.18";
      bar.title = `${entry.day}: ${entry.views} views`;
      trend.append(bar);
    }
    trend.setAttribute(
      "aria-label",
      `Daily page views (UTC): ${entries.map((entry) => `${entry.day}: ${entry.views}`).join("; ")}${days === "all" ? ". Chart shows up to the most recent year." : ""}`,
    );
    get("[data-trend-start]").textContent = entries[0]?.day || "—";
    get("[data-trend-end]").textContent = entries.at(-1)?.day || "—";
  }

  async function loadSummary() {
    const generation = ++queryGeneration;
    status.textContent = "Updating visitor statistics…";
    retry.hidden = true;
    try {
      const result = await fetch(
        `${api}/api/summary?days=${period?.value || "30"}`,
        { signal },
      );
      if (!result.ok) throw new Error("Unavailable");
      const data: VisitorSummary = await result.json();
      if (generation !== queryGeneration) return;
      renderSummary(data);
    } catch {
      if (signal.aborted || generation !== queryGeneration) return;
      status.textContent = summary
        ? "Could not update. Showing the last loaded statistics."
        : "Visitor statistics are temporarily unavailable.";
      retry.hidden = false;
      if (!summary)
        get("[data-visitor-country-list]").textContent =
          "Regions will appear when the connection is restored.";
    }
  }

  let page = 1;
  let mode = "ips";
  let recordGeneration = 0;
  let loadedRecords: VisitRecord[] = [];
  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  const search = root.querySelector<HTMLInputElement>("[data-record-search]");
  const zoneSelect =
    root.querySelector<HTMLSelectElement>("[data-record-zone]");
  const previous = root.querySelector<HTMLButtonElement>("[data-record-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-record-next]");
  const getZone = () =>
    zoneSelect?.value === "local"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : zoneSelect?.value || "Asia/Shanghai";

  function renderRecords() {
    const head = get("[data-record-head]");
    const body = get("[data-record-body]");
    head.replaceChildren();
    body.replaceChildren();
    const header = document.createElement("tr");
    for (const label of mode === "ips"
      ? ["IP address", "Region", "Visits", "First visit", "Last visit"]
      : [
          "IP address",
          "Region",
          "Time",
          "Page",
          "Referrer",
          "Browser / device",
        ]) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = label;
      header.append(th);
    }
    head.append(header);
    for (const record of loadedRecords) {
      const row = document.createElement("tr");
      const region = [record.city, record.region, countryName(record.country)]
        .filter(Boolean)
        .join(", ");
      const cells =
        mode === "ips"
          ? [
              record.ip,
              region,
              String(record.views),
              formatVisitTime(record.firstVisit, getZone()),
              formatVisitTime(record.lastVisit, getZone()),
            ]
          : [
              record.ip,
              region,
              formatVisitTime(record.visited_at, getZone()),
              record.path || "/",
              record.referrer || "Direct",
              `${record.browser} / ${record.device}`,
            ];
      for (const value of cells) {
        const td = document.createElement("td");
        td.textContent = value;
        row.append(td);
      }
      body.append(row);
    }
  }

  async function loadRecords() {
    if (!owner) return;
    const generation = ++recordGeneration;
    const recordStatus = get("[data-record-status]");
    recordStatus.textContent = "Loading private records…";
    previous!.disabled = true;
    next!.disabled = true;
    try {
      const params = new URLSearchParams({
        days: period?.value || "30",
        mode,
        page: String(page),
        q: search?.value || "",
      });
      const result = await fetch(`${api}/api/records?${params}`, {
        signal,
        credentials: "same-origin",
      });
      if (!result.ok)
        throw new Error(
          result.status === 403
            ? "Sign in with the owner’s account to view records."
            : "Could not load records. Use Refresh to retry.",
        );
      const data: { records: VisitRecord[]; total: number; pageSize: number } =
        await result.json();
      if (generation !== recordGeneration) return;
      loadedRecords = data.records;
      renderRecords();
      recordStatus.textContent = `${data.total.toLocaleString()} ${mode === "ips" ? "unique IPs" : "visits"}${data.total === 0 ? " · No matching records." : ""} · ${getZone()}`;
      get("[data-record-page]").textContent =
        `Page ${page} of ${Math.max(1, Math.ceil(data.total / data.pageSize))}`;
      previous!.disabled = page <= 1;
      next!.disabled = page * data.pageSize >= data.total;
    } catch (error) {
      if (signal.aborted || generation !== recordGeneration) return;
      loadedRecords = [];
      renderRecords();
      recordStatus.textContent = (error as Error).message;
    }
  }

  function refresh() {
    void loadSummary();
    void loadRecords();
  }
  retry.addEventListener("click", refresh, { signal });
  root
    .querySelector("[data-visitor-refresh]")
    ?.addEventListener("click", refresh, { signal });
  period?.addEventListener(
    "change",
    () => {
      get("[data-visitor-range]").textContent =
        period.selectedOptions[0].textContent;
      page = 1;
      refresh();
    },
    { signal },
  );
  if (owner) {
    get("[data-owner-callout]").hidden = true;
    get("[data-owner-records]").hidden = false;
    root
      .querySelectorAll<HTMLButtonElement>("[data-record-mode]")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            mode = button.dataset.recordMode!;
            page = 1;
            root
              .querySelectorAll<HTMLButtonElement>("[data-record-mode]")
              .forEach((tab) =>
                tab.setAttribute("aria-pressed", String(tab === button)),
              );
            void loadRecords();
          },
          { signal },
        );
      });
    search?.addEventListener(
      "input",
      () => {
        clearTimeout(searchTimer);
        ++recordGeneration;
        searchTimer = setTimeout(() => {
          page = 1;
          void loadRecords();
        }, 300);
      },
      { signal },
    );
    zoneSelect?.addEventListener(
      "change",
      () => {
        renderRecords();
        void loadRecords();
      },
      { signal },
    );
    previous?.addEventListener(
      "click",
      () => {
        page--;
        void loadRecords();
      },
      { signal },
    );
    next?.addEventListener(
      "click",
      () => {
        page++;
        void loadRecords();
      },
      { signal },
    );
    void loadRecords();
  }

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    void startGlobe();
    void loadSummary();
  };
  const lazy = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        start();
        lazy.disconnect();
      }
    },
    { rootMargin: "200px" },
  );
  if (compact) lazy.observe(root);
  else start();
  document.addEventListener(
    "astro:before-swap",
    () => {
      controller.abort();
      globe?.destroy();
      resize.disconnect();
      visibility.disconnect();
      lazy.disconnect();
      clearTimeout(searchTimer);
      delete root.dataset.initialized;
    },
    { once: true },
  );
}
