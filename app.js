// ── DEVLOG DATA ──
// To add a new entry: open data/entries.json, add a new object at the top of the array.
// Fields: date (YYYY-MM-DD), tag (built | learned | fixed | figured out), title, desc, stack (array)

let ENTRIES = [];

// ── TAG CONFIG ──
const TAG_CONFIG = {
  built: { dotColor: "#4a9e5c", cls: "tag-built" },
  learned: { dotColor: "#378add", cls: "tag-learned" },
  fixed: { dotColor: "#d85a30", cls: "tag-fixed" },
  "figured out": { dotColor: "#ba7517", cls: "tag-figured" },
  keep: { dotColor: "#6c63d4", cls: "tag-keep" },
  wins: { dotColor: "#c4407a", cls: "tag-wins" },
};

// ── STATE ──
let activeFilter = "all";
let searchQuery = "";

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  bindFilters();
  bindSearch();
  bindTheme();

  fetch("data/entries.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load entries.json");
      return res.json();
    })
    .then((data) => {
      ENTRIES = data;
      renderTimeline();
      updateMeta();
      setLastUpdated();
    })
    .catch((err) => {
      console.error("Devlog error:", err);
      document.getElementById("timeline").innerHTML =
        `<div class="empty-state"><span class="mono">// failed to load entries.json</span></div>`;
    });
});

// ── THEME ──
function initTheme() {
  const saved = localStorage.getItem("devlog_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

function bindTheme() {
  document.getElementById("themeBtn").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("devlog_theme", next);
  });
}

// ── FILTER & SEARCH ──
function bindFilters() {
  document.getElementById("filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderTimeline();
  });
}

function bindSearch() {
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTimeline();
  });
}

// ── FILTER LOGIC ──
function getFiltered() {
  return ENTRIES.filter((entry) => {
    const matchesTag = activeFilter === "all" || entry.tag === activeFilter;
    const matchesSearch =
      !searchQuery ||
      entry.title.toLowerCase().includes(searchQuery) ||
      entry.desc.toLowerCase().includes(searchQuery) ||
      entry.stack.some((s) => s.toLowerCase().includes(searchQuery)) ||
      entry.tag.toLowerCase().includes(searchQuery);
    return matchesTag && matchesSearch;
  });
}

// ── GROUP BY MONTH ──
function groupByMonth(entries) {
  const groups = {};
  entries.forEach((entry) => {
    const d = new Date(entry.date);
    const key = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  });
  return groups;
}

// ── RENDER ──
function renderTimeline() {
  const timeline = document.getElementById("timeline");
  const emptyState = document.getElementById("emptyState");
  const filtered = getFiltered();

  if (filtered.length === 0) {
    timeline.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  const groups = groupByMonth(filtered);
  let html = "";
  let delay = 0;

  for (const [month, entries] of Object.entries(groups)) {
    html += `<div class="month-group">`;
    html += `<div class="month-label">${month}</div>`;
    entries.forEach((entry, i) => {
      const cfg = TAG_CONFIG[entry.tag] || TAG_CONFIG["built"];
      const d = new Date(entry.date);
      const day = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const isLast = i === entries.length - 1;
      const stackHtml = entry.stack
        .map((s) => `<span class="stack-tag">${s}</span>`)
        .join("");
      html += `
        <div class="entry" style="animation-delay:${delay * 40}ms">
          <div class="entry-left">
            <div class="entry-dot" style="background:${cfg.dotColor}"></div>
            ${!isLast ? '<div class="entry-line"></div>' : ""}
            <div class="entry-day">${day.split(" ")[1]}</div>
          </div>
<div class="entry-card">
  <div class="entry-top">
    <span class="tag ${cfg.cls}">${entry.tag}</span>
    <span class="entry-title">${entry.title}</span>
  </div>
  <div class="entry-desc">${entry.desc}</div>
  ${entry.stack.length ? `<div class="entry-stack">${stackHtml}</div>` : ""}
  ${entry.link ? `<a href="${entry.link}" target="_blank" class="entry-link">↗ reference</a>` : ""}
</div>
        </div>`;
      delay++;
    });
    html += `</div>`;
  }

  timeline.innerHTML = html;
}

// ── META ──
function updateMeta() {
  document.getElementById("entry-count").textContent =
    `${ENTRIES.length} entries`;
}

function setLastUpdated() {
  if (!ENTRIES.length) return;
  const latest = new Date(ENTRIES[0].date);
  const str = latest.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  document.getElementById("last-updated").textContent = `last updated ${str}`;
}
