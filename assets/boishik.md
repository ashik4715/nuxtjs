================================================
FILE: README.md
================================================

# Germany University Application Tracker

A public, static Germany university application tracker designed for GitHub Pages or Cloudflare Pages.

## Guest-mode behavior

- Search, filter and sort all published programs.
- The first two desktop table columns remain fixed while the other columns scroll.
- Add, edit, delete and Applied-checkbox changes are saved privately in the visitor's browser.
- Browser-saved changes survive refreshes and normal browser restarts.
- Each browser profile and site origin has its own separate guest data.
- One visitor's changes are never shown to another visitor.
- Guest changes do not modify GitHub, Cloudflare or `data.json`.
- Clearing browser data, using private/incognito mode, changing browser/device, or opening a different deployment domain creates a separate guest profile.
- **Download List** exports only the programs currently visible after filtering and sorting.
- **Reset personal data** deletes that browser's saved customizations and restores the latest public dataset.

## How browser saving works

The app always loads the latest published `data.json` first. It then applies only that visitor's personal field edits, Applied selections, deleted program IDs and custom programs from `localStorage`.

This patch-based design means future updates to untouched public program fields still reach returning visitors.

## Files

- `index.html` — main page and interface
- `styles.css` — responsive design, fixed table columns and hidden-column hint
- `filters.js` — filtering and sorting logic
- `app.js` — guest persistence, editing, rendering and filtered PDF export
- `data.json` — latest public dataset
- `seed-data.js` — fallback copy generated from `data.json`
- `manifest.webmanifest` — site/PWA metadata
- `service-worker.js` — removes caches from older versions; no offline app cache
- `start-server.bat` / `start-server.sh` — optional local testing
- `assets/icon.svg` — keep your existing logo file here

## Important storage note

`localStorage` is isolated by website origin. Data saved on a GitHub Pages URL does not automatically appear on a Cloudflare Pages URL or a custom domain, even in the same browser.

================================================
FILE: app.js
================================================

(function () {
"use strict";

const GUEST_STORAGE_KEY = "germany-university-tracker.guest-profile.v1";
const GUEST_STORAGE_VERSION = 1;
const PROGRAM_FIELDS = [
"universityName",
"courseName",
"intake",
"applicationStartDate",
"applicationEndDate",
"applicationPortal",
"vpdRequired",
"moiAccepted",
"tuitionFee",
"entranceExamInterview",
"greGmat",
"applied",
"qsRanking",
"applicationFee",
"restricted",
"applicationLink",
];

const state = {
programs: [],
metadata: {},
originalDataset: null,
sortField: "applicationStartDate",
sortDirection: "asc",
editingId: null,
storageAvailable: true,
storageErrorShown: false,
};

const elements = {};
const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

document.addEventListener("DOMContentLoaded", init);

async function init() {
cacheElements();
bindEvents();

    const publishedDataset = normalizeDataset(await loadPublishedDataset());
    state.originalDataset = structuredCloneSafe(publishedDataset);

    const savedCustomizations = loadGuestCustomizations();
    const activeDataset = savedCustomizations
      ? applyGuestCustomizations(publishedDataset, savedCustomizations)
      : publishedDataset;

    applyDataset(activeDataset);
    populateFilterOptions();
    render();

    if (!state.storageAvailable) {
      updateSaveStatus(
        "Browser saving unavailable",
        "Changes will last only until this page is closed"
      );
    } else if (savedCustomizations && hasGuestCustomizations(savedCustomizations)) {
      updateSaveStatus(
        "Personal data restored",
        "Saved privately in this browser"
      );
    } else {
      updateSaveStatus(
        "Browser saving ready",
        "Changes stay private to this browser"
      );
    }

    disableServiceWorkerAndCaches();

}

function cacheElements() {
const ids = [
"saveStatus", "fileStatus", "programCount", "visibleCount", "freeTuitionCount", "appliedCount", "appliedPercent", "vpdCount",
"addProgramButton", "exportButton", "resetDataButton",
"searchInput", "sortField", "sortDirection", "filterToggle", "filterPanel", "universityFilter", "intakeFilter", "portalFilter",
"vpdFilter", "moiFilter", "restrictedFilter", "feeTypeFilter", "tuitionFeeMin", "tuitionFeeMax", "startDateFrom", "startDateTo", "appliedFilter",
"clearFiltersButton", "programTableWrap", "tableScrollHint", "tableEdgeFade", "programTable", "programTableBody", "emptyState", "resultSummary", "programDialog", "programForm", "dialogTitle",
"closeDialogButton", "cancelDialogButton", "toastRegion"
];
ids.forEach((id) => { elements[id] = document.getElementById(id); });
}

function bindEvents() {
const liveControls = [
elements.searchInput, elements.sortField, elements.sortDirection, elements.universityFilter, elements.intakeFilter,
elements.portalFilter, elements.vpdFilter, elements.moiFilter, elements.restrictedFilter, elements.feeTypeFilter,
elements.tuitionFeeMin, elements.tuitionFeeMax, elements.startDateFrom, elements.startDateTo, elements.appliedFilter
];
liveControls.forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", render));

    elements.addProgramButton.addEventListener("click", () => openProgramDialog());
    elements.exportButton.addEventListener("click", exportFilteredPdf);
    elements.resetDataButton.addEventListener("click", resetDataset);
    elements.clearFiltersButton.addEventListener("click", clearFilters);
    elements.filterToggle.addEventListener("click", toggleFilters);
    elements.programTable.addEventListener("click", handleTableClick);
    elements.programTable.addEventListener("change", handleTableChange);
    elements.programForm.addEventListener("submit", saveProgramFromForm);
    elements.closeDialogButton.addEventListener("click", closeProgramDialog);
    elements.cancelDialogButton.addEventListener("click", closeProgramDialog);
    elements.programDialog.addEventListener("cancel", (event) => { event.preventDefault(); closeProgramDialog(); });

    elements.programTableWrap.addEventListener("scroll", updateTableScrollHint, { passive: true });
    window.addEventListener("resize", updateTableScrollHint);

}

async function loadPublishedDataset() {
try {
const response = await fetch("data.json", { cache: "no-store" });
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return await response.json();
} catch (error) {
if (window.TRACKER_SEED_DATA) {
return structuredCloneSafe(window.TRACKER_SEED_DATA);
}
throw new Error("No tracker data could be loaded.");
}
}

function loadGuestCustomizations() {
let raw;

    try {
      raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
      state.storageAvailable = true;
    } catch (error) {
      state.storageAvailable = false;
      console.warn("Browser storage is unavailable", error);
      return null;
    }

    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (
        !parsed ||
        Number(parsed.version) !== GUEST_STORAGE_VERSION ||
        typeof parsed.overrides !== "object" ||
        !Array.isArray(parsed.deletedIds) ||
        !Array.isArray(parsed.customPrograms)
      ) {
        throw new Error("Unsupported guest-data format.");
      }

      return {
        version: GUEST_STORAGE_VERSION,
        savedAt: cleanText(parsed.savedAt),
        overrides: parsed.overrides || {},
        deletedIds: parsed.deletedIds.map(cleanText).filter(Boolean),
        customPrograms: parsed.customPrograms.map(normalizeProgram),
      };
    } catch (error) {
      console.warn("Saved guest data could not be read", error);
      try {
        window.localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch (_) {
        // Ignore cleanup errors; storage availability is handled elsewhere.
      }
      showToast(
        "Saved browser data was invalid, so the latest public list was loaded.",
        true
      );
      return null;
    }

}

function applyGuestCustomizations(publishedDataset, customizations) {
const base = normalizeDataset(publishedDataset);
const deletedIds = new Set(customizations.deletedIds);
const baseIds = new Set(base.programs.map((program) => program.id));

    const programs = base.programs
      .filter((program) => !deletedIds.has(program.id))
      .map((program) => {
        const override = customizations.overrides[program.id];
        return override
          ? normalizeProgram({ ...program, ...override })
          : normalizeProgram(program);
      });

    customizations.customPrograms.forEach((program) => {
      if (!baseIds.has(program.id) && !deletedIds.has(program.id)) {
        programs.push(normalizeProgram(program));
      }
    });

    return {
      schemaVersion: base.schemaVersion,
      title: base.title,
      currency: base.currency,
      programs,
    };

}

function buildGuestCustomizations() {
const base = normalizeDataset(
state.originalDataset || window.TRACKER_SEED_DATA || { programs: [] }
);
const baseMap = new Map(base.programs.map((program) => [program.id, program]));
const currentMap = new Map(state.programs.map((program) => [program.id, program]));
const overrides = {};
const customPrograms = [];

    state.programs.forEach((program) => {
      const original = baseMap.get(program.id);

      if (!original) {
        customPrograms.push(normalizeProgram(program));
        return;
      }

      const patch = {};
      PROGRAM_FIELDS.forEach((field) => {
        if (!valuesEqual(program[field], original[field])) {
          patch[field] = program[field];
        }
      });

      if (Object.keys(patch).length) {
        overrides[program.id] = patch;
      }
    });

    const deletedIds = base.programs
      .filter((program) => !currentMap.has(program.id))
      .map((program) => program.id);

    return {
      version: GUEST_STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      overrides,
      deletedIds,
      customPrograms,
    };

}

function hasGuestCustomizations(customizations) {
return Boolean(
Object.keys(customizations?.overrides || {}).length ||
customizations?.deletedIds?.length ||
customizations?.customPrograms?.length
);
}

function valuesEqual(left, right) {
return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function clearGuestCustomizations() {
try {
window.localStorage.removeItem(GUEST_STORAGE_KEY);
state.storageAvailable = true;
return true;
} catch (error) {
state.storageAvailable = false;
console.warn("Could not clear browser-saved guest data", error);
return false;
}
}

function applyDataset(payload) {
const normalized = normalizeDataset(payload);
state.programs = normalized.programs;
state.metadata = {
title: normalized.title || "Germany University Application Tracker (Summer)",
currency: normalized.currency || "EUR",
schemaVersion: normalized.schemaVersion || 1,
};
}

function normalizeDataset(payload) {
const sourcePrograms = Array.isArray(payload) ? payload : payload?.programs;
if (!Array.isArray(sourcePrograms)) throw new Error("JSON must contain a programs array.");
return {
schemaVersion: Number(payload?.schemaVersion) || 1,
title: cleanText(payload?.title) || "Germany University Application Tracker (Summer)",
currency: cleanText(payload?.currency) || "EUR",
programs: sourcePrograms.map(normalizeProgram),
};
}

function normalizeProgram(program, index) {
const numberOrNull = (value) => {
if (value === null || value === undefined || value === "" || value === "-") return null;
if (typeof value === "string" && value.trim().toLowerCase() === "free") return 0;
const parsed = Number(String(value).replace(/[€,]/g, ""));
return Number.isFinite(parsed) ? parsed : null;
};
const bool = typeof program.applied === "boolean" ? program.applied : ["yes", "true", "1", "applied"].includes(cleanText(program.applied).toLowerCase());

    return {
      id: cleanText(program.id) || createId(index),
      universityName: cleanText(program.universityName),
      courseName: cleanText(program.courseName),
      intake: cleanText(program.intake),
      applicationStartDate: normalizeDate(program.applicationStartDate),
      applicationEndDate: normalizeDate(program.applicationEndDate),
      applicationPortal: cleanText(program.applicationPortal),
      vpdRequired: cleanText(program.vpdRequired),
      moiAccepted: cleanText(program.moiAccepted),
      tuitionFee: numberOrNull(program.tuitionFee),
      entranceExamInterview: cleanText(program.entranceExamInterview),
      greGmat: cleanText(program.greGmat),
      applied: bool,
      qsRanking: cleanText(program.qsRanking),
      applicationFee: numberOrNull(program.applicationFee),
      restricted: cleanText(program.restricted),
      applicationLink: cleanText(program.applicationLink),
    };

}

function createId(index = "") {
if (window.crypto?.randomUUID) return crypto.randomUUID();
return `program-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
}

function cleanText(value) {
return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeDate(value) {
const text = cleanText(value);
if (!text) return null;
if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
const parsed = new Date(text);
return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function persistDataset() {
const customizations = buildGuestCustomizations();

    try {
      if (hasGuestCustomizations(customizations)) {
        window.localStorage.setItem(
          GUEST_STORAGE_KEY,
          JSON.stringify(customizations)
        );
      } else {
        window.localStorage.removeItem(GUEST_STORAGE_KEY);
      }

      state.storageAvailable = true;
      state.storageErrorShown = false;

      const savedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());

      updateSaveStatus(
        "Saved in this browser",
        `Private guest data · ${savedTime}`
      );
    } catch (error) {
      state.storageAvailable = false;
      updateSaveStatus(
        "Browser saving failed",
        "Changes may be lost after refresh"
      );
      console.warn("Could not save guest data", error);

      if (!state.storageErrorShown) {
        state.storageErrorShown = true;
        showToast(
          "This browser blocked local saving. Your current changes remain only for this page.",
          true
        );
      }
    }

}

function updateSaveStatus(primary, secondary) {
elements.saveStatus.textContent = primary;
elements.fileStatus.textContent = secondary;
}

function getCriteria() {
return {
query: elements.searchInput.value,
university: elements.universityFilter.value,
intake: elements.intakeFilter.value,
portal: elements.portalFilter.value,
vpd: elements.vpdFilter.value,
moi: elements.moiFilter.value,
restricted: elements.restrictedFilter.value,
feeType: elements.feeTypeFilter.value,
tuitionFeeMin: elements.tuitionFeeMin.value,
tuitionFeeMax: elements.tuitionFeeMax.value,
startFrom: elements.startDateFrom.value,
startTo: elements.startDateTo.value,
applied: elements.appliedFilter.value,
};
}

function render() {
state.sortField = elements.sortField.value;
state.sortDirection = elements.sortDirection.value;
const filtered = TrackerFilters.filterPrograms(state.programs, getCriteria());
const visiblePrograms = TrackerFilters.sortPrograms(filtered, state.sortField, state.sortDirection);
renderStats(visiblePrograms.length);
renderTable(visiblePrograms);
renderSortIndicators();
requestAnimationFrame(updateTableScrollHint);
}

function updateTableScrollHint() {
const wrap = elements.programTableWrap;
const hint = elements.tableScrollHint;
const fade = elements.tableEdgeFade;

    if (!wrap || !hint || !fade) return;

    const maximumScrollLeft = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
    const hasHiddenColumnsOnRight =
      maximumScrollLeft > 2 &&
      wrap.scrollLeft < maximumScrollLeft - 2 &&
      !elements.programTable.hidden;

    hint.classList.toggle("is-visible", hasHiddenColumnsOnRight);
    fade.classList.toggle("is-visible", hasHiddenColumnsOnRight);

}

function renderStats(visibleLength) {
const total = state.programs.length;
const freeTuition = state.programs.filter((item) => item.tuitionFee === 0).length;
const applied = state.programs.filter((item) => item.applied).length;
const vpd = state.programs.filter((item) => item.vpdRequired.toLowerCase() === "yes").length;
elements.programCount.textContent = total.toLocaleString("en-US");
elements.visibleCount.textContent = `${visibleLength.toLocaleString("en-US")} visible`;
elements.freeTuitionCount.textContent = freeTuition.toLocaleString("en-US");
elements.appliedCount.textContent = applied.toLocaleString("en-US");
elements.appliedPercent.textContent = `${total ? Math.round((applied / total) * 100) : 0}% complete`;
elements.vpdCount.textContent = vpd.toLocaleString("en-US");
elements.resultSummary.textContent = `Showing ${visibleLength.toLocaleString("en-US")} of ${total.toLocaleString("en-US")} programs`;
}

function renderTable(programs) {
elements.programTableBody.replaceChildren();
elements.emptyState.hidden = programs.length !== 0;
elements.programTable.hidden = programs.length === 0;
const fragment = document.createDocumentFragment();
programs.forEach((program) => fragment.append(createProgramRow(program)));
elements.programTableBody.append(fragment);
}

function createProgramRow(program) {
const row = document.createElement("tr");
row.dataset.id = program.id;

    addCell(row, "University", program.universityName, "cell-primary");
    addCell(row, "Course", program.courseName, "cell-course");
    addCell(row, "Intake", program.intake, "cell-nowrap");
    addCell(row, "Start date", formatDate(program.applicationStartDate), "cell-nowrap");
    addCell(row, "End date", formatDate(program.applicationEndDate), "cell-nowrap");
    addCell(row, "Portal", program.applicationPortal);
    addBadgeCell(row, "VPD", program.vpdRequired, badgeClass(program.vpdRequired));
    addBadgeCell(row, "MOI", program.moiAccepted, badgeClass(program.moiAccepted));
    addCell(row, "Tuition fee", formatMoney(program.tuitionFee), "cell-nowrap");
    addCell(row, "Exam / interview", program.entranceExamInterview);
    addCell(row, "Application fee", formatMoney(program.applicationFee), "cell-nowrap");

    const appliedCell = document.createElement("td");
    appliedCell.dataset.label = "Applied";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "applied-check";
    checkbox.checked = program.applied;
    checkbox.dataset.action = "toggle-applied";
    checkbox.setAttribute("aria-label", `Mark ${program.courseName} at ${program.universityName} as applied`);
    appliedCell.append(checkbox);
    row.append(appliedCell);

    addCell(row, "QS ranking", program.qsRanking, "cell-nowrap");
    addCell(row, "GRE / GMAT", program.greGmat);
    addBadgeCell(row, "Restricted", program.restricted, badgeClass(program.restricted));

    const linkCell = document.createElement("td");
    linkCell.dataset.label = "Link";
    if (isSafeHttpUrl(program.applicationLink)) {
      const link = document.createElement("a");
      link.className = "link-button";
      link.href = program.applicationLink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open";
      linkCell.append(link);
    } else {
      linkCell.append(createMutedDash());
    }
    row.append(linkCell);

    const actionCell = document.createElement("td");
    actionCell.dataset.label = "Actions";
    const actions = document.createElement("div");
    actions.className = "row-actions";
    actions.append(createRowButton("Edit", "edit"), createRowButton("Delete", "delete", true));
    actionCell.append(actions);
    row.append(actionCell);
    return row;

}

function addCell(row, label, value, className = "") {
const cell = document.createElement("td");
cell.dataset.label = label;
if (className) cell.className = className;
if (value === null || value === undefined || value === "" || value === "-") cell.append(createMutedDash());
else cell.textContent = value;
row.append(cell);
}

function addBadgeCell(row, label, value, className) {
const cell = document.createElement("td");
cell.dataset.label = label;
if (!value || value === "-") {
cell.append(createMutedDash());
} else {
const badge = document.createElement("span");
badge.className = `badge ${className}`.trim();
badge.textContent = value;
cell.append(badge);
}
row.append(cell);
}

function createMutedDash() {
const span = document.createElement("span");
span.className = "muted-value";
span.textContent = "—";
return span;
}

function createRowButton(label, action, danger = false) {
const button = document.createElement("button");
button.type = "button";
button.className = `row-button${danger ? " delete" : ""}`;
button.dataset.action = action;
button.textContent = label;
return button;
}

function formatMoney(value) {
if (value === null || value === undefined || value === "") return "—";
if (Number(value) === 0) return "Free";
return moneyFormatter.format(Number(value));
}

function formatDate(value) {
if (!value) return "—";
const date = new Date(`${value}T00:00:00`);
return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function badgeClass(value) {
const normalized = cleanText(value).toLowerCase();
if (["yes", "free", "no-nc"].includes(normalized)) return "badge-success";
if (["other", "not mentioned"].includes(normalized)) return "badge-warning";
if (["no", "nc"].includes(normalized)) return "badge-danger";
return "";
}

function isSafeHttpUrl(value) {
try {
const url = new URL(value);
return ["http:", "https:"].includes(url.protocol);
} catch (_) {
return false;
}
}

function renderSortIndicators() {
document.querySelectorAll(".sort-button").forEach((button) => {
const active = button.dataset.sort === state.sortField;
if (active) button.dataset.direction = state.sortDirection;
else delete button.dataset.direction;
button.closest("th").setAttribute("aria-sort", active ? (state.sortDirection === "asc" ? "ascending" : "descending") : "none");
});
}

function populateFilterOptions() {
setSelectOptions(elements.universityFilter, TrackerFilters.uniqueValues(state.programs, "universityName"), "All universities");
setSelectOptions(elements.intakeFilter, TrackerFilters.uniqueValues(state.programs, "intake"), "All intakes");
setSelectOptions(elements.portalFilter, TrackerFilters.uniqueValues(state.programs, "applicationPortal"), "All portals");
setSelectOptions(elements.vpdFilter, TrackerFilters.uniqueValues(state.programs, "vpdRequired"), "All VPD statuses");
setSelectOptions(elements.moiFilter, TrackerFilters.uniqueValues(state.programs, "moiAccepted"), "All MOI statuses");
setSelectOptions(elements.restrictedFilter, TrackerFilters.uniqueValues(state.programs, "restricted"), "All restrictions");
}

function setSelectOptions(select, values, firstLabel) {
const current = select.value;
select.replaceChildren(new Option(firstLabel, ""));
values.forEach((value) => select.add(new Option(value, value)));
if ([...select.options].some((option) => option.value === current)) select.value = current;
}

function handleTableClick(event) {
const sortButton = event.target.closest(".sort-button");
if (sortButton) {
const field = sortButton.dataset.sort;
if (state.sortField === field) state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
else {
state.sortField = field;
state.sortDirection = "asc";
}
elements.sortField.value = state.sortField;
elements.sortDirection.value = state.sortDirection;
render();
return;
}

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton || actionButton.dataset.action === "toggle-applied") return;
    const row = actionButton.closest("tr");
    const program = state.programs.find((item) => item.id === row?.dataset.id);
    if (!program) return;
    if (actionButton.dataset.action === "edit") openProgramDialog(program);
    if (actionButton.dataset.action === "delete") deleteProgram(program);

}

function handleTableChange(event) {
if (event.target.dataset.action !== "toggle-applied") return;

    const id = event.target.closest("tr")?.dataset.id;
    const program = state.programs.find((item) => item.id === id);

    if (!program) return;

    const wasApplied = program.applied;
    program.applied = event.target.checked;

    persistDataset();

    /*
     * Show the celebration only when changing:
     * Not applied -> Applied
     *
     * Nothing appears when changing:
     * Applied -> Not applied
     */
    if (!wasApplied && program.applied) {
      showAppliedCelebration();
    }

    /*
     * Re-render so an active Applied / Not applied filter stays accurate
     * immediately after the checkbox changes.
     */
    render();

    showToast(
      program.applied
        ? "Marked as applied."
        : "Marked as not applied."
    );

}

function openProgramDialog(program = null) {
state.editingId = program?.id || null;
elements.programForm.reset();
elements.dialogTitle.textContent = program ? "Edit program" : "Add program";
if (program) {
Object.entries(program).forEach(([key, value]) => {
const field = elements.programForm.elements.namedItem(key);
if (!field) return;
if (field.type === "checkbox") field.checked = Boolean(value);
else field.value = value ?? "";
});
}
elements.programDialog.showModal();
elements.programForm.elements.namedItem("universityName").focus();
}

function closeProgramDialog() {
elements.programDialog.close();
state.editingId = null;
}

function saveProgramFromForm(event) {
event.preventDefault();
if (!elements.programForm.reportValidity()) return;
const form = new FormData(elements.programForm);
const numberOrNull = (name) => form.get(name) === "" ? null : Number(form.get(name));
const program = normalizeProgram({
id: state.editingId || createId(),
universityName: form.get("universityName"),
courseName: form.get("courseName"),
intake: form.get("intake"),
applicationStartDate: form.get("applicationStartDate"),
applicationEndDate: form.get("applicationEndDate"),
applicationPortal: form.get("applicationPortal"),
vpdRequired: form.get("vpdRequired"),
moiAccepted: form.get("moiAccepted"),
tuitionFee: numberOrNull("tuitionFee"),
entranceExamInterview: form.get("entranceExamInterview"),
greGmat: form.get("greGmat"),
applied: elements.programForm.elements.namedItem("applied").checked,
qsRanking: form.get("qsRanking"),
applicationFee: numberOrNull("applicationFee"),
restricted: form.get("restricted"),
applicationLink: form.get("applicationLink"),
});

    const existingIndex = state.programs.findIndex((item) => item.id === state.editingId);
    if (existingIndex >= 0) state.programs.splice(existingIndex, 1, program);
    else state.programs.push(program);
    persistDataset();
    populateFilterOptions();
    render();
    closeProgramDialog();
    showToast(existingIndex >= 0 ? "Program updated." : "Program added.");

}

function deleteProgram(program) {
if (!confirm(`Delete ${program.courseName} at ${program.universityName}?`)) return;
state.programs = state.programs.filter((item) => item.id !== program.id);
persistDataset();
populateFilterOptions();
render();
showToast("Program deleted.");
}

function clearFilters() {
[elements.searchInput, elements.tuitionFeeMin, elements.tuitionFeeMax, elements.startDateFrom, elements.startDateTo].forEach((input) => { input.value = ""; });
[elements.universityFilter, elements.intakeFilter, elements.portalFilter, elements.vpdFilter, elements.moiFilter, elements.restrictedFilter, elements.feeTypeFilter, elements.appliedFilter]
.forEach((select) => { select.value = ""; });
render();
}

function toggleFilters() {
const willHide = !elements.filterPanel.hidden;
elements.filterPanel.hidden = willHide;
elements.filterToggle.setAttribute("aria-expanded", String(!willHide));
elements.filterToggle.textContent = willHide ? "Show Filters" : "Hide Filters";
}

async function resetDataset() {
if (
!confirm(
"Delete all personal browser-saved changes and restore the latest public dataset?"
)
) return;

    const storageCleared = clearGuestCustomizations();
    const original = structuredCloneSafe(
      state.originalDataset || window.TRACKER_SEED_DATA
    );

    applyDataset(original);
    populateFilterOptions();
    clearFilters();
    render();

    if (storageCleared) {
      updateSaveStatus(
        "Personal data reset",
        "Latest public dataset restored"
      );
      showToast("Your browser-saved guest data was deleted.");
    } else {
      updateSaveStatus(
        "Reset for this page",
        "Browser storage could not be cleared"
      );
      showToast(
        "The list was reset, but this browser did not allow saved data to be cleared.",
        true
      );
    }

}

async function exportFilteredPdf() {
state.sortField = elements.sortField.value;
state.sortDirection = elements.sortDirection.value;

    const filteredPrograms = TrackerFilters.filterPrograms(state.programs, getCriteria());
    const visiblePrograms = TrackerFilters.sortPrograms(filteredPrograms, state.sortField, state.sortDirection);

    if (visiblePrograms.length === 0) {
      showToast("There are no visible programs to export.", true);
      return;
    }

    const originalLabel = elements.exportButton.textContent;
    elements.exportButton.disabled = true;
    elements.exportButton.textContent = "Preparing PDF...";

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const pdfBytes = buildProgramsPdf(visiblePrograms);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = createPdfFilename();
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`PDF downloaded with ${visiblePrograms.length} visible program${visiblePrograms.length === 1 ? "" : "s"}.`);
    } catch (error) {
      console.error("PDF export failed", error);
      showToast(`PDF export failed: ${error.message}`, true);
    } finally {
      elements.exportButton.disabled = false;
      elements.exportButton.textContent = originalLabel;
    }

}

function createPdfFilename() {
const criteria = getCriteria();
const date = new Date().toISOString().slice(0, 10);
let scope = "filtered-programs";

    if (criteria.university) scope = criteria.university;
    else if (criteria.applied === "applied") scope = "applied-programs";
    else if (criteria.applied === "not-applied") scope = "not-applied-programs";
    else if (!hasActiveFilters(criteria)) scope = "all-programs";

    const safeScope = cleanText(scope)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "programs";

    return `germany-university-${safeScope}-${date}.pdf`;

}

function hasActiveFilters(criteria) {
return Object.values(criteria).some((value) => cleanText(value) !== "");
}

function buildProgramsPdf(programs) {
const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;
const MARGIN = 34;
const CARD_GAP_X = 12;
const CARD_GAP_Y = 10;
const CARD_HEIGHT = 150;
const CARDS_PER_PAGE = 6;
const CARD_WIDTH = (PAGE_WIDTH - (MARGIN * 2) - CARD_GAP_X) / 2;
const CARD_START_TOP = 77;

    const pages = [];
    const pageCount = Math.ceil(programs.length / CARDS_PER_PAGE);
    const filterSummary = getPdfFilterSummary();
    const sortSummary = getPdfSortSummary();
    const generatedDate = dateFormatter.format(new Date());

    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      const pagePrograms = programs.slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE);
      let stream = "";

      stream += pdfFillRect(0, 0, PAGE_WIDTH, 54, [16, 42, 67], PAGE_HEIGHT);
      stream += pdfText(34, 21, "Germany University Application Tracker", 17, "F2", [255, 255, 255], PAGE_HEIGHT);
      stream += pdfText(34, 40, `${programs.length} currently visible program${programs.length === 1 ? "" : "s"} | Generated ${generatedDate}`, 8.5, "F1", [217, 234, 242], PAGE_HEIGHT);

      const filterLines = wrapPdfText(`Filters: ${filterSummary}`, PAGE_WIDTH - 240, 7.5, 2);
      filterLines.forEach((line, lineIndex) => {
        stream += pdfText(34, 61 + (lineIndex * 9), line, 7.5, "F1", [72, 101, 129], PAGE_HEIGHT);
      });
      stream += pdfText(PAGE_WIDTH - 205, 61, sortSummary, 7.5, "F1", [72, 101, 129], PAGE_HEIGHT);

      pagePrograms.forEach((program, localIndex) => {
        const column = localIndex % 2;
        const row = Math.floor(localIndex / 2);
        const x = MARGIN + column * (CARD_WIDTH + CARD_GAP_X);
        const top = CARD_START_TOP + row * (CARD_HEIGHT + CARD_GAP_Y);
        stream += buildProgramCard(program, x, top, CARD_WIDTH, CARD_HEIGHT, PAGE_HEIGHT);
      });

      stream += pdfLine(MARGIN, PAGE_HEIGHT - 25, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 25, [217, 226, 236]);
      stream += pdfText(MARGIN, PAGE_HEIGHT - 12, "Maintained and Developed by Boishik Barua Tinu", 7.3, "F1", [98, 125, 152], PAGE_HEIGHT);
      const pageLabel = `Page ${pageIndex + 1} of ${pageCount}`;
      stream += pdfText(PAGE_WIDTH - MARGIN - measurePdfText(pageLabel, 7.3), PAGE_HEIGHT - 12, pageLabel, 7.3, "F1", [98, 125, 152], PAGE_HEIGHT);

      pages.push(stream);
    }

    return assemblePdf(pages, PAGE_WIDTH, PAGE_HEIGHT);

}

function buildProgramCard(program, x, top, width, height, pageHeight) {
let stream = "";
stream += pdfFillRect(x, top, width, height, [255, 255, 255], pageHeight);
stream += pdfStrokeRect(x, top, width, height, [201, 214, 226], 0.7, pageHeight);
stream += pdfFillRect(x, top, 4, height, program.applied ? [21, 115, 71] : [11, 114, 133], pageHeight);
stream += pdfFillRect(x + 4, top, width - 4, 46, [245, 248, 251], pageHeight);

    const universityLines = wrapPdfText(pdfDisplayValue(program.universityName), width - 22, 10.4, 2);
    universityLines.forEach((line, index) => {
      stream += pdfText(x + 12, top + 14 + (index * 11), line, 10.4, "F2", [16, 42, 67], pageHeight);
    });

    const courseTop = top + (universityLines.length === 2 ? 35 : 27);
    const courseLines = wrapPdfText(pdfDisplayValue(program.courseName), width - 22, 8.2, universityLines.length === 2 ? 1 : 2);
    courseLines.forEach((line, index) => {
      stream += pdfText(x + 12, courseTop + (index * 9), line, 8.2, "F1", [11, 114, 133], pageHeight);
    });

    const leftFields = [
      ["Intake", program.intake],
      ["Start date", formatDate(program.applicationStartDate)],
      ["End date", formatDate(program.applicationEndDate)],
      ["Portal", program.applicationPortal],
      ["VPD", program.vpdRequired],
      ["MOI", program.moiAccepted],
      ["Tuition fee", formatMoney(program.tuitionFee)],
    ];

    const rightFields = [
      ["Exam / interview", program.entranceExamInterview],
      ["Application fee", formatMoney(program.applicationFee)],
      ["Applied", program.applied ? "Yes" : "No"],
      ["QS ranking", program.qsRanking],
      ["GRE / GMAT", program.greGmat],
      ["Restricted", program.restricted],
      ["Link", program.applicationLink],
    ];

    const fieldTop = top + 57;
    const fieldGap = 12.3;
    const innerGap = 12;
    const fieldWidth = (width - 28 - innerGap) / 2;
    const rightX = x + 14 + fieldWidth + innerGap;

    leftFields.forEach(([label, value], index) => {
      stream += pdfLabelValue(x + 14, fieldTop + (index * fieldGap), label, value, fieldWidth, pageHeight);
    });

    rightFields.forEach(([label, value], index) => {
      stream += pdfLabelValue(rightX, fieldTop + (index * fieldGap), label, value, fieldWidth, pageHeight);
    });

    return stream;

}

function pdfLabelValue(x, top, label, value, maxWidth, pageHeight) {
const labelText = `${label}:`;
const labelSize = 6.7;
const valueSize = 7.1;
const labelWidth = measurePdfText(labelText, labelSize) + 6;
const available = Math.max(24, maxWidth - labelWidth);
const valueText = truncatePdfText(pdfDisplayValue(value), available, valueSize);

    return pdfText(x, top, labelText, labelSize, "F2", [72, 101, 129], pageHeight)
      + pdfText(x + labelWidth, top, valueText, valueSize, "F1", [16, 42, 67], pageHeight);

}

function getPdfFilterSummary() {
const criteria = getCriteria();
const parts = [];

    if (criteria.query) parts.push(`Search = ${criteria.query}`);
    appendSelectedFilter(parts, elements.universityFilter, "University");
    appendSelectedFilter(parts, elements.intakeFilter, "Intake");
    appendSelectedFilter(parts, elements.portalFilter, "Portal");
    appendSelectedFilter(parts, elements.vpdFilter, "VPD");
    appendSelectedFilter(parts, elements.moiFilter, "MOI");
    appendSelectedFilter(parts, elements.restrictedFilter, "Admission");
    appendSelectedFilter(parts, elements.feeTypeFilter, "Application fee");
    if (criteria.tuitionFeeMin) {
      parts.push(`Minimum tuition fee = EUR ${criteria.tuitionFeeMin}`);
    }
    if (criteria.tuitionFeeMax) {
      parts.push(`Maximum tuition fee = EUR ${criteria.tuitionFeeMax}`);
    }
    if (criteria.startFrom) parts.push(`Start from = ${criteria.startFrom}`);
    if (criteria.startTo) parts.push(`Start to = ${criteria.startTo}`);
    appendSelectedFilter(parts, elements.appliedFilter, "Application status");

    return parts.length ? parts.join(" | ") : "None - all programs are included";

}

function appendSelectedFilter(parts, select, label) {
if (!select.value) return;
const selectedText = select.options[select.selectedIndex]?.textContent || select.value;
parts.push(`${label} = ${selectedText}`);
}

function getPdfSortSummary() {
const fieldText = elements.sortField.options[elements.sortField.selectedIndex]?.textContent || state.sortField;
const directionText = state.sortDirection === "desc" ? "Descending" : "Ascending";
return `Sort: ${fieldText} (${directionText})`;
}

function pdfDisplayValue(value) {
if (value === null || value === undefined || value === "" || value === "-") return "Not provided";
return cleanText(value);
}

function wrapPdfText(value, maxWidth, fontSize, maxLines) {
const text = pdfDisplayValue(value);
const words = text.split(/\s+/);
const lines = [];
let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (measurePdfText(candidate, fontSize) <= maxWidth) {
        current = candidate;
      } else if (current) {
        lines.push(current);
        current = word;
      } else {
        lines.push(truncatePdfText(word, maxWidth, fontSize));
        current = "";
      }
    });

    if (current) lines.push(current);
    if (lines.length <= maxLines) return lines;

    const limited = lines.slice(0, maxLines);
    limited[maxLines - 1] = truncatePdfText(`${limited[maxLines - 1]} ${lines.slice(maxLines).join(" ")}`, maxWidth, fontSize);
    return limited;

}

function truncatePdfText(value, maxWidth, fontSize) {
const text = pdfDisplayValue(value);
if (measurePdfText(text, fontSize) <= maxWidth) return text;

    const suffix = "...";
    let shortened = text;
    while (shortened.length > 1 && measurePdfText(`${shortened}${suffix}`, fontSize) > maxWidth) {
      shortened = shortened.slice(0, -1);
    }
    return `${shortened.trimEnd()}${suffix}`;

}

function measurePdfText(value, fontSize) {
const text = String(value ?? "");
let units = 0;
for (const character of text) {
if (" .,:;!|iIl'`".includes(character)) units += 0.27;
else if ("MW@#%&QG".includes(character)) units += 0.82;
else if (character === character.toUpperCase() && character !== character.toLowerCase()) units += 0.61;
else units += 0.52;
}
return units * fontSize;
}

function pdfText(x, top, text, size, font, color, pageHeight) {
const y = pageHeight - top - size;
return `BT /${font} ${pdfNumber(size)} Tf ${pdfColor(color)} rg 1 0 0 1 ${pdfNumber(x)} ${pdfNumber(y)} Tm (${escapePdfText(text)}) Tj ET\n`;
}

function pdfFillRect(x, top, width, height, color, pageHeight) {
const y = pageHeight - top - height;
return `q ${pdfColor(color)} rg ${pdfNumber(x)} ${pdfNumber(y)} ${pdfNumber(width)} ${pdfNumber(height)} re f Q\n`;
}

function pdfStrokeRect(x, top, width, height, color, lineWidth, pageHeight) {
const y = pageHeight - top - height;
return `q ${pdfColor(color)} RG ${pdfNumber(lineWidth)} w ${pdfNumber(x)} ${pdfNumber(y)} ${pdfNumber(width)} ${pdfNumber(height)} re S Q\n`;
}

function pdfLine(x1, y1FromTop, x2, y2FromTop, color) {
const pageHeight = 595.28;
const y1 = pageHeight - y1FromTop;
const y2 = pageHeight - y2FromTop;
return `q ${pdfColor(color)} RG 0.6 w ${pdfNumber(x1)} ${pdfNumber(y1)} m ${pdfNumber(x2)} ${pdfNumber(y2)} l S Q\n`;
}

function pdfColor(color) {
return color.map((component) => pdfNumber(component / 255)).join(" ");
}

function pdfNumber(value) {
return Number(value.toFixed(3)).toString();
}

function escapePdfText(value) {
return encodeWinAnsi(value)
.replace(/\\/g, "\\\\")
.replace(/\(/g, "\\(")
.replace(/\)/g, "\\)")
.replace(/[\r\n]+/g, " ");
}

function encodeWinAnsi(value) {
const replacements = {
"€": 128,
"‚": 130,
"ƒ": 131,
"„": 132,
"…": 133,
"†": 134,
"‡": 135,
"ˆ": 136,
"‰": 137,
"Š": 138,
"‹": 139,
"Œ": 140,
"Ž": 142,
"‘": 145,
"’": 146,
"“": 147,
"”": 148,
"•": 149,
"–": 150,
"—": 151,
"˜": 152,
"™": 153,
"š": 154,
"›": 155,
"œ": 156,
"ž": 158,
"Ÿ": 159,
};

    let result = "";
    for (const character of String(value ?? "")) {
      const code = character.codePointAt(0);
      if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255)) {
        result += String.fromCharCode(code);
      } else if (Object.prototype.hasOwnProperty.call(replacements, character)) {
        result += String.fromCharCode(replacements[character]);
      } else {
        result += "?";
      }
    }
    return result;

}

function assemblePdf(pageStreams, pageWidth, pageHeight) {
const objects = [];
const pageObjectIds = pageStreams.map((_, index) => 5 + (index * 2));

    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageStreams.length} >>`;
    objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
    objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

    pageStreams.forEach((stream, index) => {
      const pageObjectId = 5 + (index * 2);
      const contentObjectId = pageObjectId + 1;
      objects[pageObjectId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfNumber(pageWidth)} ${pdfNumber(pageHeight)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
      objects[contentObjectId] = `<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
    });

    let pdf = "%PDF-1.4\n%âãÏÓ\n";
    const offsets = [0];

    for (let objectId = 1; objectId < objects.length; objectId += 1) {
      offsets[objectId] = pdf.length;
      pdf += `${objectId} 0 obj\n${objects[objectId]}\nendobj\n`;
    }

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length}\n`;
    pdf += "0000000000 65535 f \n";
    for (let objectId = 1; objectId < objects.length; objectId += 1) {
      pdf += `${String(offsets[objectId]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const bytes = new Uint8Array(pdf.length);
    for (let index = 0; index < pdf.length; index += 1) bytes[index] = pdf.charCodeAt(index) & 0xff;
    return bytes;

}

function showAppliedCelebration() {
// Remove an older animation if the checkbox is clicked again quickly.
document.querySelector(".celebration-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "celebration-overlay";
    overlay.setAttribute("aria-hidden", "true");

    const message = document.createElement("div");
    message.className = "celebration-message";
    message.textContent = "Congratulations!";

    overlay.append(message);

    const colors = [
      "#0b7285",
      "#66d9a4",
      "#8fe3eb",
      "#ffd166",
      "#ff7b7b",
      "#ffffff",
      "#7c83fd"
    ];

    const particleCountPerSide = 28;

    ["left", "right"].forEach((side) => {
      for (let index = 0; index < particleCountPerSide; index += 1) {
        const particle = document.createElement("span");

        particle.className =
          `celebration-particle from-${side}`;

        const size = 6 + Math.random() * 10;
        const startY = 15 + Math.random() * 70;
        const travelX =
          Math.max(300, window.innerWidth * (0.35 + Math.random() * 0.35));
        const travelY = -250 + Math.random() * 500;
        const rotation = -720 + Math.random() * 1440;
        const duration = 1.1 + Math.random() * 0.8;
        const delay = Math.random() * 0.22;
        const color =
          colors[Math.floor(Math.random() * colors.length)];

        particle.style.setProperty("--particle-size", `${size}px`);
        particle.style.setProperty("--particle-radius", Math.random() > 0.5 ? "50%" : "2px");
        particle.style.setProperty("--particle-color", color);
        particle.style.setProperty("--start-y", `${startY}%`);
        particle.style.setProperty("--travel-x", `${travelX}px`);
        particle.style.setProperty("--travel-y", `${travelY}px`);
        particle.style.setProperty("--rotation", `${rotation}deg`);
        particle.style.setProperty("--particle-duration", `${duration}s`);
        particle.style.setProperty("--particle-delay", `${delay}s`);

        overlay.append(particle);
      }
    });

    document.body.append(overlay);

    // Remove the complete effect after it finishes.
    window.setTimeout(() => {
      overlay.remove();
    }, 2400);

}

function showToast(message, error = false) {
const toast = document.createElement("div");
toast.className = `toast${error ? " error" : ""}`;
toast.textContent = message;
elements.toastRegion.append(toast);
setTimeout(() => toast.remove(), 3500);
}

function structuredCloneSafe(value) {
return window.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

async function disableServiceWorkerAndCaches() {
if ("serviceWorker" in navigator) {
try {
const currentScope = new URL("./", window.location.href).href;
const registrations = await navigator.serviceWorker.getRegistrations();
await Promise.all(
registrations
.filter((registration) => registration.scope === currentScope)
.map((registration) => registration.unregister())
);
} catch (error) {
console.warn("Service worker cleanup failed", error);
}
}

    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => key.startsWith("germany-university-tracker"))
            .map((key) => caches.delete(key))
        );
      } catch (error) {
        console.warn("Cache cleanup failed", error);
      }
    }

}
})();

================================================
FILE: filters.js
================================================

(function () {
"use strict";

const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase("en");
const isBlank = (value) => value === null || value === undefined || value === "";

function compareNullable(left, right, direction, comparator) {
const leftBlank = isBlank(left);
const rightBlank = isBlank(right);
if (leftBlank && rightBlank) return 0;
if (leftBlank) return 1;
if (rightBlank) return -1;
return comparator(left, right) * (direction === "desc" ? -1 : 1);
}

function compareText(left, right) {
return String(left).localeCompare(String(right), "en", { sensitivity: "base", numeric: true });
}

function compareNumber(left, right) {
return Number(left) - Number(right);
}

function compareDate(left, right) {
return new Date(`${left}T00:00:00`).getTime() - new Date(`${right}T00:00:00`).getTime();
}

function sortPrograms(programs, field, direction = "asc") {
const dateFields = new Set(["applicationStartDate", "applicationEndDate"]);
const numberFields = new Set(["applicationFee", "tuitionFee"]);
const comparator = dateFields.has(field) ? compareDate : numberFields.has(field) ? compareNumber : compareText;

    return [...programs].sort((left, right) => {
      const result = compareNullable(left[field], right[field], direction, comparator);
      if (result !== 0) return result;
      return compareText(left.universityName, right.universityName) || compareText(left.courseName, right.courseName);
    });

}

function filterPrograms(programs, criteria) {
const query = normalize(criteria.query);
const parseOptionalNumber = (value) => {
if (value === "" || value === null || value === undefined) return null;
const parsed = Number(value);
return Number.isFinite(parsed) ? parsed : null;
};

    const tuitionFeeMin = parseOptionalNumber(criteria.tuitionFeeMin);
    const tuitionFeeMax = parseOptionalNumber(criteria.tuitionFeeMax);

    return programs.filter((program) => {
      if (query) {
        const searchable = Object.entries(program)
          .filter(([key]) => key !== "id")
          .map(([, value]) => typeof value === "boolean" ? (value ? "applied" : "not applied") : value)
          .join(" ");
        if (!normalize(searchable).includes(query)) return false;
      }

      if (criteria.university && program.universityName !== criteria.university) return false;
      if (criteria.intake && program.intake !== criteria.intake) return false;
      if (criteria.portal && program.applicationPortal !== criteria.portal) return false;
      if (criteria.vpd && program.vpdRequired !== criteria.vpd) return false;
      if (criteria.moi && program.moiAccepted !== criteria.moi) return false;
      if (criteria.restricted && program.restricted !== criteria.restricted) return false;

      if (criteria.applied === "applied" && !program.applied) return false;
      if (criteria.applied === "not-applied" && program.applied) return false;

      if (criteria.feeType === "free" && program.applicationFee !== 0) return false;
      if (criteria.feeType === "paid" && !(typeof program.applicationFee === "number" && program.applicationFee > 0)) return false;
      if (criteria.feeType === "unknown" && program.applicationFee !== null) return false;

      if (
        tuitionFeeMin !== null &&
        (program.tuitionFee === null || program.tuitionFee < tuitionFeeMin)
      ) return false;

      if (
        tuitionFeeMax !== null &&
        (program.tuitionFee === null || program.tuitionFee > tuitionFeeMax)
      ) return false;

      if (criteria.startFrom && (!program.applicationStartDate || program.applicationStartDate < criteria.startFrom)) return false;
      if (criteria.startTo && (!program.applicationStartDate || program.applicationStartDate > criteria.startTo)) return false;

      return true;
    });

}

function uniqueValues(programs, field) {
return [...new Set(programs.map((program) => program[field]).filter((value) => !isBlank(value)))]
.sort(compareText);
}

window.TrackerFilters = { filterPrograms, sortPrograms, uniqueValues };
})();

================================================
FILE: index.html
================================================

<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102a43">
  <meta name="description"
    content="A public Germany university application tracker with private browser-saved guest data, filtering, sorting and filtered PDF export.">
  <title>Germany University Application Tracker</title>
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" href="assets/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <a class="skip-link" href="#programTable">Skip to programs</a>

  <header class="site-header">
    <div class="header-inner">
      <div>
        <p class="eyebrow">Application workspace</p>
        <h1>Germany University Application Tracker</h1>
        <p class="header-copy">Search, filter, sort and personalize programs. Guest changes are saved privately in
          this browser, and PDF export uses only the currently visible results.</p>
      </div>
      <div class="save-panel" aria-live="polite">
        <span class="status-dot" aria-hidden="true"></span>
        <div>
          <strong id="saveStatus">Loading data…</strong>
          <span id="fileStatus">Guest mode</span>
        </div>
      </div>
    </div>
  </header>

  <main class="app-shell">
    <section class="stats-grid" aria-label="Tracker summary">
      <article class="stat-card">
        <span>Programs</span>
        <strong id="programCount">0</strong>
        <small id="visibleCount">0 visible</small>
      </article>
      <article class="stat-card">
        <span>Free tuition</span>
        <strong id="freeTuitionCount">0</strong>
        <small>Tuition fee is €0</small>
      </article>
      <article class="stat-card">
        <span>Applied</span>
        <strong id="appliedCount">0</strong>
        <small id="appliedPercent">0% complete</small>
      </article>
      <article class="stat-card">
        <span>VPD required</span>
        <strong id="vpdCount">0</strong>
        <small>Marked “Yes”</small>
      </article>
    </section>

    <section class="workspace-card controls-card" aria-labelledby="controlsTitle">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Live controls</p>
          <h2 id="controlsTitle">Find and manage programs</h2>
        </div>
        <div class="action-bar">
          <button class="button button-primary" id="addProgramButton" type="button">+ Add program</button>
          <button class="button" id="exportButton" type="button">Download List</button>
          <button class="button button-danger-quiet" id="resetDataButton" type="button">Reset personal data</button>
        </div>
      </div>

      <p class="session-note"><strong>Guest mode:</strong> your Applied selections, edits, additions and deletions
        are saved privately in this browser and survive refreshes. They are not shared with other visitors or written
        to GitHub or Cloudflare. Clearing browser data, using private browsing, or opening the site in another
        browser/device starts a separate guest profile. PDF export still uses only the currently visible filtered
        results.</p>

      <div class="primary-controls">
        <label class="search-control">
          <span>Search all fields</span>
          <input id="searchInput" type="search" placeholder="University, course, portal, ranking…" autocomplete="off">
        </label>
        <label>
          <span>Sort by</span>
          <select id="sortField">
            <option value="applicationStartDate">Application start date</option>
            <option value="applicationEndDate">Application end date</option>
            <option value="universityName">University name</option>
            <option value="courseName">Course name</option>
            <option value="applicationFee">Application fee</option>
            <option value="tuitionFee">Tuition fee</option>
          </select>
        </label>
        <label>
          <span>Order</span>
          <select id="sortDirection">
            <option value="asc">Low / early / A–Z</option>
            <option value="desc">High / late / Z–A</option>
          </select>
        </label>
        <button class="button filter-toggle" id="filterToggle" type="button" aria-expanded="true"
          aria-controls="filterPanel">Hide Filters</button>
      </div>

      <div class="filter-panel" id="filterPanel">
        <label>
          <span>University</span>
          <select id="universityFilter">
            <option value="">All universities</option>
          </select>
        </label>
        <label>
          <span>Intake</span>
          <select id="intakeFilter">
            <option value="">All intakes</option>
          </select>
        </label>
        <label>
          <span>Portal</span>
          <select id="portalFilter">
            <option value="">All portals</option>
          </select>
        </label>
        <label>
          <span>VPD</span>
          <select id="vpdFilter">
            <option value="">All VPD statuses</option>
          </select>
        </label>
        <label>
          <span>MOI</span>
          <select id="moiFilter">
            <option value="">All MOI statuses</option>
          </select>
        </label>
        <label>
          <span>Admission</span>
          <select id="restrictedFilter">
            <option value="">All restrictions</option>
          </select>
        </label>
        <label>
          <span>Application fee</span>
          <select id="feeTypeFilter">
            <option value="">All fee types</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
            <option value="unknown">Unknown only</option>
          </select>
        </label>
        <label>
          <span>Minimum tuition fee (€)</span>
          <input id="tuitionFeeMin" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0">
        </label>
        <label>
          <span>Maximum tuition fee (€)</span>
          <input id="tuitionFeeMax" type="number" min="0" step="0.01" inputmode="decimal" placeholder="1500">
        </label>
        <label>
          <span>Start date from</span>
          <input id="startDateFrom" type="date">
        </label>
        <label>
          <span>Start date to</span>
          <input id="startDateTo" type="date">
        </label>
        <label>
          <span>Application status</span>
          <select id="appliedFilter">
            <option value="">All statuses</option>
            <option value="applied">Applied</option>
            <option value="not-applied">Not applied</option>
          </select>
        </label>
        <div class="filter-actions">
          <button class="button" id="clearFiltersButton" type="button">Clear filters</button>
        </div>
      </div>
    </section>

    <section class="workspace-card table-card" aria-labelledby="tableTitle">
      <div class="table-toolbar">
        <div>
          <p class="eyebrow">Programs database</p>
          <h2 id="tableTitle">Application list</h2>
        </div>

        <div class="table-toolbar-meta">
          <p id="resultSummary" class="result-summary" aria-live="polite"></p>
          <div class="table-scroll-hint" id="tableScrollHint" aria-hidden="true">
            <span>More columns</span>
            <span class="table-scroll-hint-arrow">→</span>
          </div>
        </div>
      </div>

      <div class="table-scroll-shell">
        <div class="table-wrap" id="programTableWrap">
          <table id="programTable">
            <thead>
              <tr>
                <th scope="col"><button class="sort-button" data-sort="universityName">University</button></th>
                <th scope="col"><button class="sort-button" data-sort="courseName">Course</button></th>
                <th scope="col">Intake</th>
                <th scope="col"><button class="sort-button" data-sort="applicationStartDate">Start date</button></th>
                <th scope="col"><button class="sort-button" data-sort="applicationEndDate">End date</button></th>
                <th scope="col">Portal</th>
                <th scope="col">VPD</th>
                <th scope="col">MOI</th>
                <th scope="col"><button class="sort-button" data-sort="tuitionFee">Tuition fee</button></th>
                <th scope="col">Exam / interview</th>
                <th scope="col"><button class="sort-button" data-sort="applicationFee">Application fee</button></th>
                <th scope="col">Applied</th>
                <th scope="col">QS ranking</th>
                <th scope="col">GRE / GMAT</th>
                <th scope="col">Restricted</th>
                <th scope="col">Link</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody id="programTableBody"></tbody>
          </table>
          <div class="empty-state" id="emptyState" hidden>
            <strong>No matching programs</strong>
            <p>Change or clear the filters to show records again.</p>
          </div>
        </div>

        <div class="table-edge-fade" id="tableEdgeFade" aria-hidden="true"></div>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <p>© Maintained and Developed by Boishik Barua Tinu</p>
  </footer>

  <dialog id="programDialog" class="program-dialog">
    <form id="programForm" novalidate>
      <div class="dialog-header">
        <div>
          <p class="eyebrow">Program record</p>
          <h2 id="dialogTitle">Add program</h2>
        </div>
        <button class="icon-button" id="closeDialogButton" type="button" aria-label="Close">×</button>
      </div>

      <input type="hidden" name="id">
      <div class="form-grid">
        <label class="span-2">
          <span>University name *</span>
          <input name="universityName" required>
        </label>
        <label class="span-2">
          <span>Course name *</span>
          <input name="courseName" required>
        </label>
        <label>
          <span>Intake</span>
          <input name="intake" list="intakeOptions">
        </label>
        <label>
          <span>Application portal</span>
          <input name="applicationPortal" list="portalOptions">
        </label>
        <label>
          <span>Application start date</span>
          <input name="applicationStartDate" type="date">
        </label>
        <label>
          <span>Application end date</span>
          <input name="applicationEndDate" type="date">
        </label>
        <label>
          <span>VPD required</span>
          <input name="vpdRequired" list="vpdOptions">
        </label>
        <label>
          <span>MOI accepted</span>
          <input name="moiAccepted" list="moiOptions">
        </label>
        <label>
          <span>Tuition fee (€)</span>
          <input name="tuitionFee" type="number" min="0" step="0.01" placeholder="0 means Free">
        </label>
        <label>
          <span>Application fee (€)</span>
          <input name="applicationFee" type="number" min="0" step="0.01" placeholder="0 means Free">
        </label>
        <label class="span-2">
          <span>Entrance exam / interview</span>
          <input name="entranceExamInterview">
        </label>
        <label>
          <span>GRE / GMAT</span>
          <input name="greGmat">
        </label>
        <label>
          <span>QS ranking</span>
          <input name="qsRanking">
        </label>
        <label>
          <span>Restricted</span>
          <input name="restricted" list="restrictedOptions">
        </label>
        <label>
          <span>Applied</span>
          <span class="checkbox-field"><input name="applied" type="checkbox"> Mark as applied</span>
        </label>
        <label class="span-2">
          <span>Application link</span>
          <input name="applicationLink" type="url" placeholder="https://…">
        </label>
      </div>

      <datalist id="intakeOptions">
        <option value="Summer">
        <option value="Winter">
      </datalist>
      <datalist id="portalOptions">
        <option value="Uni-Assist">
        <option value="University Portal">
        <option value="Other">
      </datalist>
      <datalist id="vpdOptions">
        <option value="Yes">
        <option value="No">
        <option value="Other">
        <option value="-">
      </datalist>
      <datalist id="moiOptions">
        <option value="yes">
        <option value="no">
        <option value="Not mentioned">
      </datalist>
      <datalist id="restrictedOptions">
        <option value="NC">
        <option value="No-NC">
        <option value="-">
      </datalist>

      <div class="dialog-actions">
        <button class="button" id="cancelDialogButton" type="button">Cancel</button>
        <button class="button button-primary" type="submit">Save program</button>
      </div>
    </form>

  </dialog>

  <div class="toast-region" id="toastRegion" aria-live="polite" aria-atomic="true"></div>

  <script src="seed-data.js"></script>
  <script src="filters.js"></script>
  <script src="app.js"></script>
  <!-- Cloudflare Web Analytics -->
  <script type='module' src='https://static.cloudflareinsights.com/beacon.min.js'
    data-cf-beacon='{"token": "d1cc9fe3aeb4475698350ee0f2efc1c4"}'></script><!-- End Cloudflare Web Analytics -->
</body>

</html>

================================================
FILE: manifest.webmanifest
================================================

{
"name": "Germany University Application Tracker",
"short_name": "Uni Tracker",
"description": "Public Germany university tracker with private browser-saved guest data, filtering, sorting and filtered PDF export.",
"start_url": "./",
"scope": "./",
"display": "standalone",
"background_color": "#eef3f7",
"theme_color": "#102a43",
"icons": [
{
"src": "assets/icon.svg",
"sizes": "any",
"type": "image/svg+xml",
"purpose": "any maskable"
}
]
}

================================================
FILE: seed-data.js
================================================

window.TRACKER_SEED_DATA = {
"schemaVersion": 1,
"title": "Germany University Application Tracker (Summer)",
"currency": "EUR",
"updatedAt": "2026-07-25T18:02:17Z",
"programs": [
{
"id": "program-001",
"universityName": "Bauhaus University Weimar",
"courseName": "M.Sc. Digital Engineering",
"intake": "Summer",
"applicationStartDate": "2026-10-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-weimar.de/en/civil-and-environmental-engineering/studies/master-degree-programmes/digital-engineering/"
},
{
"id": "program-002",
"universityName": "Bauhaus University Weimar",
"courseName": "M.Sc. Human-Computer Interaction",
"intake": "Summer",
"applicationStartDate": "2026-10-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-weimar.de/en/media/studies/human-computer-interaction-msc/"
},
{
"id": "program-003",
"universityName": "Brandenburg University of Technology Cottbus-Senftenberg",
"courseName": "M.Sc. Artificial Intelligence",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.b-tu.de/en/artificial-intelligence-ms/page"
},
{
"id": "program-004",
"universityName": "FAU Erlangen-Nürnberg",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-11-30",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 4000.0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "218",
"applicationFee": 100,
"restricted": "No-NC",
"applicationLink": "https://www.datascience.nat.fau.eu/study/master-data-science-english/"
},
{
"id": "program-005",
"universityName": "Fulda University of Applied Sciences",
"courseName": "M.Sc. Global Software Development",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2026-12-01",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "yes, online test",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.hs-fulda.de/en/studyprogramme/global-software-development-msc"
},
{
"id": "program-006",
"universityName": "Hochschule Bonn-Rhein-Sieg",
"courseName": "M.Sc. Autonomous Systems",
"intake": "Summer",
"applicationStartDate": "2026-05-15",
"applicationEndDate": "2026-08-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "NC",
"applicationLink": "https://www.h-brs.de/en/inf/study/master/autonomous-systems"
},
{
"id": "program-007",
"universityName": "Hof University of Applied Sciences",
"courseName": "M.Sc. Applied Research in Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-11-05",
"applicationEndDate": "2026-11-30",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.hof-university.com/studying-at-hof-university/our-degree-programs/applied-research-in-computer-science-msc.html"
},
{
"id": "program-008",
"universityName": "Hof University of Applied Sciences",
"courseName": "M.Sc. Artificial Intelligence and Robotics",
"intake": "Summer",
"applicationStartDate": "2026-10-05",
"applicationEndDate": "2026-11-30",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.hof-university.com/studying-at-hof-university/our-degree-programs/artificial-intelligence-and-robotics-msc.html"
},
{
"id": "program-009",
"universityName": "Kiel University",
"courseName": "M.Sc. Data Science",
"intake": "",
"applicationStartDate": null,
"applicationEndDate": null,
"applicationPortal": "Other",
"vpdRequired": "Other",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "other",
"greGmat": "",
"applied": false,
"qsRanking": "620",
"applicationFee": null,
"restricted": "-",
"applicationLink": "https://www.uni-kiel.de/en/centres/dsc/teaching"
},
{
"id": "program-010",
"universityName": "Kiel University of Applied Sciences",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.haw-kiel.de/en/degree-courses/courses/computer-science"
},
{
"id": "program-011",
"universityName": "Kiel University of Applied Sciences",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.haw-kiel.de/en/degree-courses/courses/data-science/"
},
{
"id": "program-012",
"universityName": "Osnabrück University",
"courseName": "M.Sc. Cognitive Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-12-01",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.ikw.uni-osnabrueck.de/en/prospective_students/master_cognitive_science.html"
},
{
"id": "program-013",
"universityName": "Otto von Guericke University Magdeburg",
"courseName": "M.Sc. Data and Knowledge Engineering",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-11-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "646",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.ovgu.de/unimagdeburg/en/Study/Study%20Programmes/Master/Data%20and%20Knowledge%20Engineering-p-17625.html"
},
{
"id": "program-014",
"universityName": "Paderborn University",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-11-30",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1201-1400",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-paderborn.de/en/studyoffer/course_of_study/computer-science-master"
},
{
"id": "program-015",
"universityName": "Philipps University Marburg",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-11-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "951-1000",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-marburg.de/en/fb12/studying/degree-programs/m-sc-computer-science"
},
{
"id": "program-016",
"universityName": "Philipps University Marburg",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-11-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "951-1000",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-marburg.de/en/fb12/studying/degree-programs/m-sc-data-science"
},
{
"id": "program-017",
"universityName": "Rhine-Waal University of Applied Sciences",
"courseName": "M.Sc. Information Engineering and Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "NC",
"applicationLink": "https://www.hochschule-rhein-waal.de/en/faculties/communication-and-environment/degree-programmes/master-degree-programmes/information"
},
{
"id": "program-018",
"universityName": "RPTU Kaiserslautern-Landau",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-10-31",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1401+",
"applicationFee": 60,
"restricted": "No-NC",
"applicationLink": "https://rptu.de/studienangebot/22777/Computer_Science-Computer_Science-master"
},
{
"id": "program-019",
"universityName": "Saarland University",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-11-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "588",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.uni-saarland.de/en/study/programmes/master/informatics.html"
},
{
"id": "program-020",
"universityName": "Saarland University",
"courseName": "M.Sc. Data Science and Artificial Intelligence",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-11-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "588",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.uni-saarland.de/en/study/programmes/master/data-science.html"
},
{
"id": "program-021",
"universityName": "Technical University of Applied Sciences Würzburg-Schweinfurt — THWS",
"courseName": "M.Sc. Artificial Intelligence",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2026-12-15",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.thws.de/en/studies-at-thws/application-enrolment-exams-internship/degree-programmes/artificial-intelligence/"
},
{
"id": "program-022",
"universityName": "TU Berlin",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-12-01",
"applicationEndDate": "2027-02-28",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "158",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.tu.berlin/en/studying/study-programs/all-programs-offered/study-course/computer-science-informatik-m-sc"
},
{
"id": "program-023",
"universityName": "TU Braunschweig",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-08-01",
"applicationEndDate": "2026-09-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "781-790",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.tu-braunschweig.de/en/degree-programmes/data-science-master"
},
{
"id": "program-024",
"universityName": "TU Chemnitz",
"courseName": "M.Sc. Automotive Software Engineering",
"intake": "Summer",
"applicationStartDate": "2026-12-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Other",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1001-1200",
"applicationFee": 49.95,
"restricted": "No-NC",
"applicationLink": "https://www.tu-chemnitz.de/informatik/studium/studiengaenge/ma_automotive_software_engineering.php.en"
},
{
"id": "program-025",
"universityName": "TU Clausthal",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2027-04-01",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.studiengaenge.tu-clausthal.de/en/study-at-the-tu-clausthal/masters-programs/computer-science-master"
},
{
"id": "program-026",
"universityName": "TU Darmstadt",
"courseName": "M.Sc. Artificial Intelligence and Machine Learning",
"intake": "Summer",
"applicationStartDate": "2026-12-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "yes, offline test",
"greGmat": "",
"applied": false,
"qsRanking": "250",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.tu-darmstadt.de/studieren/studieninteressierte/studienangebot_studiengaenge/studiengang_334592.en.jsp"
},
{
"id": "program-027",
"universityName": "TU Darmstadt",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-12-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "yes, offline test",
"greGmat": "",
"applied": false,
"qsRanking": "250",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.tu-darmstadt.de/studieren/studieninteressierte/studienangebot_studiengaenge/studiengang_334656.en.jsp"
},
{
"id": "program-028",
"universityName": "TU Dortmund",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "691",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://statistik.tu-dortmund.de/en/studies/degrees/data-science-msc/"
},
{
"id": "program-029",
"universityName": "TU Hamburg",
"courseName": "M.Sc. Computer Science",
"intake": "Winter",
"applicationStartDate": "2026-12-01",
"applicationEndDate": "2027-03-01",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "721-730",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.tuhh.de/tuhh/en/studying/before-studying/degree-courses/masters-programs/computer-science"
},
{
"id": "program-030",
"universityName": "TU Ilmenau",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-08-01",
"applicationEndDate": "2026-11-11",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.tu-ilmenau.de/en/study/before-the-study/range-of-courses/master/data-science-msc"
},
{
"id": "program-031",
"universityName": "TU Ilmenau",
"courseName": "M.Sc. Research in Computer and Systems Engineering",
"intake": "Summer",
"applicationStartDate": "2026-08-01",
"applicationEndDate": "2026-11-11",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.tu-ilmenau.de/en/study/before-the-study/range-of-courses/master/research-in-computer-systems-engineering-msc"
},
{
"id": "program-032",
"universityName": "University of Bamberg",
"courseName": "M.Sc. International Software Systems Science",
"intake": "Summer",
"applicationStartDate": "2026-11-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1201-1400",
"applicationFee": 60,
"restricted": "No-NC",
"applicationLink": "https://www.uni-bamberg.de/en/ma-isosysc/"
},
{
"id": "program-033",
"universityName": "University of Bayreuth",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "472",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-bayreuth.de/en/master/computer-science"
},
{
"id": "program-034",
"universityName": "University of Bonn",
"courseName": "M.Sc. Artificial Intelligence",
"intake": "Winter",
"applicationStartDate": null,
"applicationEndDate": null,
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "209",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-bonn.de/en/studying/degree-programs/degree-programs-a-z/artificial-intelligence-msc"
},
{
"id": "program-035",
"universityName": "University of Bonn",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": null,
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "209",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-bonn.de/en/studying/degree-programs/degree-programs-a-z/computer-science-msc"
},
{
"id": "program-036",
"universityName": "University of Bremen",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-12-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "581",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.uni-bremen.de/en/studies/orientation-application/offered-study-program/dbs/study/computer-science-master"
},
{
"id": "program-037",
"universityName": "University of Göttingen",
"courseName": "M.Sc. Applied Data Science",
"intake": "Summer",
"applicationStartDate": "2026-10-01",
"applicationEndDate": "2026-11-01",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "other",
"greGmat": "",
"applied": false,
"qsRanking": "261",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-goettingen.de/en/642405.html"
},
{
"id": "program-038",
"universityName": "University of Hildesheim",
"courseName": "M.Sc. Data Analytics",
"intake": "Summer",
"applicationStartDate": "2026-09-15",
"applicationEndDate": "2026-12-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-hildesheim.de/en/studium/studieninteressierte/studiengaenge/masterstudium/data-analytics-msc/"
},
{
"id": "program-039",
"universityName": "University of Hildesheim",
"courseName": "M.Sc. Future Analytics: AI and Audio Worlds",
"intake": "Summer",
"applicationStartDate": "2026-09-15",
"applicationEndDate": "2026-12-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "other",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-hildesheim.de/en/studium/studieninteressierte/studiengaenge/masterstudium/future-analytics-ai-audio-worlds-msc-or-ma/"
},
{
"id": "program-040",
"universityName": "University of Hildesheim",
"courseName": "M.Sc. Software Engineering",
"intake": "Summer",
"applicationStartDate": "2026-09-15",
"applicationEndDate": "2026-12-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-hildesheim.de/en/studium/studieninteressierte/studiengaenge/masterstudium/software-engineering-msc/"
},
{
"id": "program-041",
"universityName": "University of Kassel",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-09-01",
"applicationEndDate": "2027-01-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1201-1400",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-kassel.de/uni/en/studium/computer-science-master.html"
},
{
"id": "program-042",
"universityName": "University of Koblenz",
"courseName": "M.Sc. Mathematical Modeling, Simulation and Optimization",
"intake": "Summer",
"applicationStartDate": null,
"applicationEndDate": "2026-12-14",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-koblenz.de/en/degree-programs/mathematical-modeling-msc"
},
{
"id": "program-043",
"universityName": "University of Lübeck",
"courseName": "M.Sc. Robotics and Autonomous Systems",
"intake": "Summer",
"applicationStartDate": "2026-09-01",
"applicationEndDate": "2026-10-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www2.uni-luebeck.de/en/study-program/technology/robotics-and-autonomous-systems/masters-degree-program-robotics-and-autonomous-systems/"
},
{
"id": "program-044",
"universityName": "University of Passau",
"courseName": "M.Sc. Artificial Intelligence Engineering",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2026-12-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1201-1400",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-passau.de/en/msc-ai-eng/"
},
{
"id": "program-045",
"universityName": "University of Passau",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2026-12-15",
"applicationPortal": "Uni-Assist",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1201-1400",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-passau.de/en/msc-computer-science/"
},
{
"id": "program-046",
"universityName": "University of Potsdam",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2026-12-01",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "yes, online test",
"greGmat": "",
"applied": false,
"qsRanking": "500",
"applicationFee": 30,
"restricted": "NC",
"applicationLink": "https://www.uni-potsdam.de/en/studium/what-to-study/master/computer-science"
},
{
"id": "program-047",
"universityName": "University of Regensburg",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2026-12-01",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "696",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-regensburg.de/en/studies/prospective-students/study-programs/master/computer-science-msc"
},
{
"id": "program-048",
"universityName": "University of Regensburg",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2026-12-01",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "696",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-regensburg.de/en/studies/prospective-students/study-programs/master/data-science-msc"
},
{
"id": "program-049",
"universityName": "University of Siegen",
"courseName": "M.Sc. Human-Computer Interaction",
"intake": "Summer",
"applicationStartDate": "2026-10-01",
"applicationEndDate": "2026-10-31",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "Not mentioned",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1201-1400",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.uni-siegen.de/en/study/master/human-computer-interaction"
},
{
"id": "program-050",
"universityName": "Trier University",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-12-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1401+",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.uni-trier.de/en/studium/studienangebot/studiengaenge-von-a-z/english-taught-masters-courses/data-science-master-of-science-1-subject-study-information-en"
},
{
"id": "program-051",
"universityName": "Trier University",
"courseName": "M.Sc. Natural Language Processing",
"intake": "Summer",
"applicationStartDate": "2026-12-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "1401+",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.uni-trier.de/en/studium/studienangebot/studiengaenge-von-a-z/english-taught-masters-courses/natural-language-processing-master-of-science-1-subject-study-information-en"
},
{
"id": "program-052",
"universityName": "University of Würzburg",
"courseName": "M.Sc. Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-08-31",
"applicationEndDate": "2026-10-31",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "yes",
"tuitionFee": 0,
"entranceExamInterview": "yes, viva (mode not stated)",
"greGmat": "",
"applied": false,
"qsRanking": "430",
"applicationFee": 30,
"restricted": "No-NC",
"applicationLink": "https://www.informatik.uni-wuerzburg.de/en/studies/degree-programmes/master-computer-science/"
},
{
"id": "program-053",
"universityName": "Deggendorf Institute of Technology",
"courseName": "M.Sc. Applied Computer Sciences",
"intake": "Summer",
"applicationStartDate": "2026-10-01",
"applicationEndDate": "2026-11-01",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 500.0,
"entranceExamInterview": "yes, online test",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 60,
"restricted": "No-NC",
"applicationLink": "https://www.th-deg.de/ai-m-en"
},
{
"id": "program-054",
"universityName": "Deggendorf Institute of Technology",
"courseName": "M.Sc. Artificial Intelligence and Data Science",
"intake": "Summer",
"applicationStartDate": "2026-10-01",
"applicationEndDate": "2026-11-01",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 500.0,
"entranceExamInterview": "yes, online test",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 60,
"restricted": "No-NC",
"applicationLink": "https://www.th-deg.de/aid-m-en"
},
{
"id": "program-055",
"universityName": "Technische Hochschule Ingolstadt",
"courseName": "M.Eng. AI Engineering of Autonomous Systems",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "yes",
"tuitionFee": 1200.0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "NC",
"applicationLink": "https://www.thi.de/en/electrical-engineering-and-information-technology/degree-programmes/ai-engineering-of-autonomous-systems-meng/"
},
{
"id": "program-056",
"universityName": "Technische Hochschule Ingolstadt",
"courseName": "M.Sc. Artificial Intelligence",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "Yes",
"moiAccepted": "Not mentioned",
"tuitionFee": 1200.0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "-",
"applicationFee": 30,
"restricted": "NC",
"applicationLink": "https://www.thi.de/en/computer-science/degree-programmes/artificial-intelligence-msc/"
},
{
"id": "program-057",
"universityName": "Heidelberg University",
"courseName": "M.Sc. Data and Computer Science",
"intake": "Summer",
"applicationStartDate": "2026-08-01",
"applicationEndDate": "2026-09-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 1500.0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "86",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-heidelberg.de/en/study/all-subjects/computer-science/data-and-computer-science-master"
},
{
"id": "program-058",
"universityName": "University of Freiburg",
"courseName": "M.Sc. Computer Science Artificial Intelligence Specialization",
"intake": "Summer",
"applicationStartDate": "2026-11-01",
"applicationEndDate": "2026-12-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 1500.0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "245",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.tf.uni-freiburg.de/en/study-programs/computer-science/m-sc-computer-science"
},
{
"id": "program-059",
"universityName": "University of Mannheim",
"courseName": "M.Sc. Data Science",
"intake": "Summer",
"applicationStartDate": "2026-10-15",
"applicationEndDate": "2026-11-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "yes",
"tuitionFee": 1500.0,
"entranceExamInterview": "-",
"greGmat": "",
"applied": false,
"qsRanking": "425",
"applicationFee": 0,
"restricted": "NC",
"applicationLink": "https://www.uni-mannheim.de/en/academics/before-your-studies/programs/mannheim-master-in-data-science/"
},
{
"id": "program-060",
"universityName": "University of Stuttgart",
"courseName": "M.Sc. Computer Science",
"intake": "Winter",
"applicationStartDate": "2026-11-15",
"applicationEndDate": "2027-01-15",
"applicationPortal": "University Portal",
"vpdRequired": "-",
"moiAccepted": "no",
"tuitionFee": 1500.0,
"entranceExamInterview": "yes, online viva",
"greGmat": "",
"applied": false,
"qsRanking": "318",
"applicationFee": 0,
"restricted": "No-NC",
"applicationLink": "https://www.uni-stuttgart.de/en/study/study-programs/Computer-Science-M.Sc.-00001/"
}
]
};

================================================
FILE: service-worker.js
================================================

"use strict";

/*

- Guest-mode public version:
- Personal tracker changes are stored in localStorage by app.js.
-
- This service worker intentionally provides no offline application cache.
- It only removes older tracker service workers and caches so deployed HTML,
- CSS, JavaScript and public data updates are fetched normally.
  */

self.addEventListener("install", () => {
self.skipWaiting();
});

self.addEventListener("activate", (event) => {
event.waitUntil(
Promise.all([
caches.keys().then((keys) =>
Promise.all(
keys
.filter((key) => key.startsWith("germany-university-tracker"))
.map((key) => caches.delete(key))
)
),
self.registration.unregister()
]).then(() => self.clients.claim())
);
});

================================================
FILE: start-server.bat
================================================

@echo off
cd /d "%~dp0"
start "" http://localhost:8000
py -3 -m http.server 8000 2>nul || python -m http.server 8000

================================================
FILE: start-server.sh
================================================

#!/usr/bin/env sh
cd "$(dirname "$0")"
printf '%s\n' 'Open http://localhost:8000 in your browser.'
python3 -m http.server 8000

================================================
FILE: styles.css
================================================

:root {
color-scheme: light;
--ink: #102a43;
--muted: #627d98;
--line: #d9e2ec;
--surface: #ffffff;
--surface-soft: #f5f8fb;
--accent: #0b7285;
--accent-dark: #075766;
--accent-soft: #e6f5f7;
--navy: #102a43;
--danger: #b42318;
--danger-soft: #fff1f0;
--success: #157347;
--warning: #9a6700;
--shadow: 0 18px 45px rgba(16, 42, 67, 0.08);
--radius: 18px;
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
BlinkMacSystemFont, "Segoe UI", sans-serif;
}

- {
  box-sizing: border-box;
  }

html {
scroll-behavior: smooth;
}

body {
margin: 0;
min-width: 320px;
background: #eef3f7;
color: var(--ink);
line-height: 1.5;
}

button,
input,
select {
font: inherit;
}

button {
cursor: pointer;
}

.skip-link {
position: fixed;
top: 10px;
left: 10px;
z-index: 1000;
padding: 10px 14px;
border-radius: 10px;
background: #fff;
color: var(--ink);
transform: translateY(-150%);
}

.skip-link:focus {
transform: translateY(0);
}

.site-header {
color: #fff;
background:
radial-gradient(circle at 85% 15%,
rgba(47, 158, 168, 0.33),
transparent 26rem),
linear-gradient(135deg, #102a43 0%, #173f5f 60%, #0b7285 100%);
border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.header-inner {
width: min(1600px, calc(100% - 32px));
margin: 0 auto;
padding: 42px 0 38px;
display: flex;
align-items: flex-end;
justify-content: space-between;
gap: 28px;
}

h1,
h2,
p {
margin-top: 0;
}

h1 {
margin-bottom: 10px;
font-size: clamp(2rem, 4vw, 3.4rem);
line-height: 1.05;
letter-spacing: -0.04em;
}

h2 {
margin-bottom: 0;
font-size: clamp(1.25rem, 2vw, 1.7rem);
letter-spacing: -0.02em;
}

.header-copy {
max-width: 780px;
margin-bottom: 0;
color: #d9eaf2;
font-size: 1.02rem;
}

.eyebrow {
margin-bottom: 6px;
color: var(--accent);
font-size: 0.72rem;
font-weight: 800;
letter-spacing: 0.14em;
text-transform: uppercase;
}

.site-header .eyebrow {
color: #8fe3eb;
}

.save-panel {
min-width: 230px;
display: flex;
align-items: center;
gap: 12px;
padding: 14px 16px;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 14px;
background: rgba(255, 255, 255, 0.09);
backdrop-filter: blur(12px);
}

.save-panel strong,
.save-panel span {
display: block;
}

.save-panel strong {
font-size: 0.9rem;
}

.save-panel span:not(.status-dot) {
color: #c9e0ea;
font-size: 0.77rem;
}

.status-dot {
width: 10px;
height: 10px;
flex: 0 0 auto;
border-radius: 50%;
background: #66d9a4;
box-shadow: 0 0 0 5px rgba(102, 217, 164, 0.14);
}

.app-shell {
width: min(1600px, calc(100% - 32px));
margin: -18px auto 48px;
position: relative;
}

.stats-grid {
display: grid;
grid-template-columns: repeat(4, minmax(0, 1fr));
gap: 14px;
margin-bottom: 18px;
}

.stat-card,
.workspace-card {
background: var(--surface);
border: 1px solid rgba(217, 226, 236, 0.9);
box-shadow: var(--shadow);
}

.stat-card {
padding: 20px;
border-radius: 16px;
}

.stat-card span,
.stat-card small {
display: block;
color: var(--muted);
}

.stat-card span {
font-size: 0.82rem;
font-weight: 750;
text-transform: uppercase;
letter-spacing: 0.06em;
}

.stat-card strong {
display: block;
margin: 4px 0 2px;
font-size: 2rem;
line-height: 1.05;
}

.stat-card small {
font-size: 0.78rem;
}

.workspace-card {
border-radius: var(--radius);
}

.controls-card {
margin-bottom: 18px;
padding: 22px;
}

.section-heading,
.table-toolbar {
display: flex;
align-items: flex-start;
justify-content: space-between;
gap: 20px;
}

.section-heading {
margin-bottom: 20px;
}

.session-note {
margin: -6px 0 18px;
padding: 10px 12px;
border: 1px solid #cfe4e8;
border-radius: 10px;
background: var(--accent-soft);
color: #486581;
font-size: 0.82rem;
font-weight: 650;
}

.action-bar {
display: flex;
flex-wrap: wrap;
justify-content: flex-end;
gap: 8px;
}

.button {
min-height: 40px;
padding: 9px 13px;
border: 1px solid #bcccdc;
border-radius: 10px;
background: #fff;
color: var(--ink);
font-weight: 700;
transition:
border-color 0.15s,
background 0.15s,
transform 0.15s,
box-shadow 0.15s;
}

.button:hover:not(:disabled) {
border-color: var(--accent);
background: var(--accent-soft);
}

.button:active:not(:disabled) {
transform: translateY(1px);
}

.button:focus-visible,
input:focus-visible,
select:focus-visible,
.sort-button:focus-visible,
.icon-button:focus-visible {
outline: 3px solid rgba(11, 114, 133, 0.24);
outline-offset: 2px;
}

.button:disabled {
cursor: not-allowed;
opacity: 0.48;
}

.button-primary {
border-color: var(--accent);
background: var(--accent);
color: #fff;
box-shadow: 0 8px 18px rgba(11, 114, 133, 0.2);
}

.button-primary:hover:not(:disabled) {
background: var(--accent-dark);
color: #fff;
}

.button-danger-quiet {
border-color: #f3c7c3;
color: var(--danger);
}

.button-danger-quiet:hover:not(:disabled) {
background: var(--danger-soft);
border-color: #e9a6a0;
}

.primary-controls {
display: grid;
grid-template-columns:
minmax(260px, 1.8fr) minmax(180px, 0.7fr) minmax(180px, 0.7fr) auto;
gap: 12px;
align-items: end;
}

label>span:first-child {
display: block;
margin-bottom: 6px;
color: #486581;
font-size: 0.77rem;
font-weight: 800;
}

input,
select {
width: 100%;
min-height: 42px;
padding: 9px 11px;
border: 1px solid #bcccdc;
border-radius: 10px;
background: #fff;
color: var(--ink);
}

input::placeholder {
color: #9fb3c8;
}

.search-control input {
padding-left: 14px;
}

.filter-toggle {
min-width: 86px;
}

.filter-panel {
display: grid;
grid-template-columns: repeat(6, minmax(145px, 1fr));
gap: 12px;
margin-top: 16px;
padding-top: 16px;
border-top: 1px solid var(--line);
}

.filter-panel[hidden] {
display: none;
}

.filter-panel > label {
display: flex;
min-width: 0;
flex-direction: column;
}

.filter-panel > label > input,
.filter-panel > label > select {
margin-top: auto;
}

.filter-actions {
display: flex;
align-items: end;
}

.filter-actions .button {
width: 100%;
}

.table-card {
overflow: hidden;
}

.table-toolbar {
padding: 22px 22px 16px;
}

.result-summary {
margin: 8px 0 0;
color: var(--muted);
font-size: 0.88rem;
}

.table-scroll-shell {
position: relative;
}

.table-wrap {
position: relative;
width: 100%;
max-width: 100%;
overflow-x: auto;
overflow-y: auto;
overscroll-behavior-x: contain;
border-top: 1px solid var(--line);
isolation: isolate;
}

/* =========================================================
RIGHT-SIDE HINT FOR HIDDEN TABLE COLUMNS
========================================================= */

.table-toolbar-meta {
min-width: 240px;
display: flex;
flex-direction: column;
align-items: flex-end;
gap: 4px;
text-align: right;
}

.table-toolbar-meta .result-summary {
margin: 8px 0 0;
}

.table-scroll-hint {
display: inline-flex;
align-items: center;
justify-content: flex-end;
gap: 6px;
min-height: 22px;
color: var(--accent-dark);
font-size: 0.78rem;
font-weight: 800;
letter-spacing: 0.01em;
white-space: nowrap;
pointer-events: none;
opacity: 0;
visibility: hidden;
transform: translateY(-2px);
transition:
opacity 0.18s ease,
visibility 0.18s ease,
transform 0.18s ease;
}

.table-scroll-hint.is-visible {
opacity: 1;
visibility: visible;
transform: translateY(0);
}

.table-scroll-hint-arrow {
display: inline-block;
font-size: 1rem;
animation: table-scroll-hint-arrow 1.1s ease-in-out infinite;
}

.table-edge-fade {
position: absolute;
top: 0;
right: 0;
bottom: 0;
z-index: 12;
width: 38px;
background:
linear-gradient(
90deg,
rgba(238, 243, 247, 0) 0%,
rgba(16, 42, 67, 0.08) 58%,
rgba(16, 42, 67, 0.18) 100%
);
pointer-events: none;
opacity: 0;
visibility: hidden;
transition: opacity 0.18s ease, visibility 0.18s ease;
}

.table-edge-fade.is-visible {
opacity: 1;
visibility: visible;
}

@keyframes table-scroll-hint-arrow {
0%,
100% {
transform: translateX(0);
}

50% {
transform: translateX(4px);
}
}

/* =========================================================
DESKTOP TABLE: KEEP UNIVERSITY + COURSE COLUMNS VISIBLE
Applies only above 820px. Mobile keeps the existing card view.
========================================================= */

@media (min-width: 821px) {
.table-wrap {
position: relative;
width: 100%;
max-width: 100%;
overflow-x: auto;
overflow-y: auto;
isolation: isolate;
scrollbar-gutter: stable;
}

/* Keep every desktop header cell visible during vertical scrolling. */
#programTable>thead>tr>th {
position: sticky;
top: 0;
z-index: 3;
background: var(--navy);
background-clip: padding-box;
}

/* First fixed column: University */
#programTable>thead>tr>th:nth-child(1),
#programTable>tbody>tr>td:nth-child(1) {
position: sticky;
left: 0;
width: 230px;
min-width: 230px;
max-width: 230px;
background-clip: padding-box;
}

/* Second fixed column: Course */
#programTable>thead>tr>th:nth-child(2),
#programTable>tbody>tr>td:nth-child(2) {
position: sticky;
left: 230px;
width: 270px;
min-width: 270px;
max-width: 270px;
background-clip: padding-box;
}

/* The two fixed header cells must stay above all body cells. */
#programTable>thead>tr>th:nth-child(1),
#programTable>thead>tr>th:nth-child(2) {
z-index: 6;
background: var(--navy);
}

/* Fixed body cells stay above the horizontally moving columns. */
#programTable>tbody>tr>td:nth-child(1),
#programTable>tbody>tr>td:nth-child(2) {
z-index: 2;
background: #fff;
}

/* Preserve the existing alternating-row style on fixed cells. */
#programTable>tbody>tr:nth-child(even)>td:nth-child(1),
#programTable>tbody>tr:nth-child(even)>td:nth-child(2) {
background: #f8fafc;
}

/* Preserve the existing hover style on fixed cells. */
#programTable>tbody>tr:hover>td:nth-child(1),
#programTable>tbody>tr:hover>td:nth-child(2) {
background: #edf8f9;
}
}

table {
width: 100%;
min-width: 1900px;
border-collapse: separate;
border-spacing: 0;
font-size: 0.86rem;
}

thead {
position: sticky;
top: 0;
z-index: 3;
}

th {
padding: 12px 11px;
border-bottom: 1px solid #193b5a;
background: var(--navy);
color: #fff;
text-align: left;
white-space: nowrap;
font-size: 0.76rem;
letter-spacing: 0.015em;
}

td {
padding: 11px;
border-bottom: 1px solid var(--line);
background: #fff;
vertical-align: top;
}

tbody tr:nth-child(even) td {
background: #f8fafc;
}

tbody tr:hover td {
background: #edf8f9;
}

.sort-button {
padding: 0;
border: 0;
background: transparent;
color: inherit;
font-weight: 800;
}

.sort-button::after {
content: " ⇅";
color: #9fb3c8;
}

.sort-button[data-direction="asc"]::after {
content: " ↑";
color: #8fe3eb;
}

.sort-button[data-direction="desc"]::after {
content: " ↓";
color: #8fe3eb;
}

.cell-primary {
min-width: 230px;
font-weight: 750;
}

.cell-course {
min-width: 270px;
}

.cell-nowrap {
white-space: nowrap;
}

.muted-value {
color: #829ab1;
}

.badge {
display: inline-flex;
align-items: center;
min-height: 25px;
padding: 3px 8px;
border-radius: 999px;
background: #edf2f7;
color: #486581;
font-size: 0.72rem;
font-weight: 800;
white-space: nowrap;
}

.badge-success {
background: #e8f7ef;
color: var(--success);
}

.badge-warning {
background: #fff6dd;
color: var(--warning);
}

.badge-danger {
background: var(--danger-soft);
color: var(--danger);
}

.applied-check {
width: 18px;
min-height: 18px;
accent-color: var(--accent);
}

.link-button {
color: var(--accent-dark);
font-weight: 750;
text-decoration: none;
}

.link-button:hover {
text-decoration: underline;
}

.row-actions {
display: flex;
gap: 6px;
white-space: nowrap;
}

.row-button {
padding: 5px 8px;
border: 1px solid #bcccdc;
border-radius: 8px;
background: #fff;
color: var(--ink);
font-size: 0.75rem;
font-weight: 750;
}

.row-button:hover {
border-color: var(--accent);
background: var(--accent-soft);
}

.row-button.delete {
color: var(--danger);
}

.empty-state {
padding: 64px 20px;
text-align: center;
color: var(--muted);
}

.empty-state strong {
display: block;
margin-bottom: 6px;
color: var(--ink);
font-size: 1.1rem;
}

.empty-state p {
margin-bottom: 0;
}

.program-dialog {
width: min(880px, calc(100% - 28px));
max-height: calc(100vh - 32px);
padding: 0;
border: 0;
border-radius: 18px;
box-shadow: 0 30px 90px rgba(16, 42, 67, 0.28);
color: var(--ink);
}

.program-dialog::backdrop {
background: rgba(16, 42, 67, 0.58);
backdrop-filter: blur(4px);
}

.program-dialog form {
padding: 24px;
}

.dialog-header {
display: flex;
justify-content: space-between;
gap: 20px;
margin-bottom: 20px;
}

.icon-button {
width: 40px;
height: 40px;
border: 1px solid var(--line);
border-radius: 10px;
background: #fff;
color: var(--ink);
font-size: 1.5rem;
line-height: 1;
}

.form-grid {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 14px;
}

.span-2 {
grid-column: span 2;
}

.checkbox-field {
min-height: 42px;
display: flex;
align-items: center;
gap: 10px;
padding: 9px 11px;
border: 1px solid #bcccdc;
border-radius: 10px;
}

.checkbox-field input {
width: 18px;
min-height: 18px;
}

.dialog-actions {
display: flex;
justify-content: flex-end;
gap: 10px;
margin-top: 22px;
padding-top: 18px;
border-top: 1px solid var(--line);
}

/* =========================================================
PAGE FOOTER
========================================================= */

.site-footer {
width: min(1600px, calc(100% - 32px));
margin: -22px auto 30px;
padding-top: 18px;
border-top: 1px solid rgba(98, 125, 152, 0.28);
color: var(--muted);
text-align: center;
}

.site-footer p {
margin: 0;
font-size: 0.84rem;
font-weight: 700;
}

.toast-region {
position: fixed;
right: 18px;
bottom: 18px;
z-index: 2000;
display: grid;
gap: 10px;
}

.toast {
max-width: 360px;
padding: 12px 15px;
border-radius: 12px;
background: var(--navy);
color: #fff;
box-shadow: 0 14px 38px rgba(16, 42, 67, 0.25);
animation: toast-in 0.18s ease-out;
}

.toast.error {
background: #7a271a;
}

@keyframes toast-in {
from {
opacity: 0;
transform: translateY(8px);
}
}

@media (max-width: 1180px) {
.filter-panel {
grid-template-columns: repeat(4, minmax(150px, 1fr));
}

.primary-controls {
grid-template-columns: 1fr 1fr 1fr auto;
}

.search-control {
grid-column: 1 / -1;
}
}

@media (max-width: 820px) {
.table-scroll-hint,
.table-edge-fade {
display: none;
}

.table-toolbar-meta {
min-width: 0;
align-items: flex-start;
text-align: left;
}

.header-inner {
align-items: stretch;
flex-direction: column;
padding-top: 30px;
}

.save-panel {
min-width: 0;
align-self: flex-start;
}

.stats-grid {
grid-template-columns: repeat(2, minmax(0, 1fr));
}

.section-heading,
.table-toolbar {
flex-direction: column;
}

.action-bar {
justify-content: flex-start;
}

.primary-controls {
grid-template-columns: 1fr 1fr;
}

.search-control {
grid-column: 1 / -1;
}

.filter-panel {
grid-template-columns: repeat(2, minmax(0, 1fr));
}

.table-wrap {
overflow: visible;
border-top: 0;
padding: 0 14px 14px;
}

table {
min-width: 0;
display: block;
}

thead {
display: none;
}

tbody {
display: grid;
gap: 12px;
}

tbody tr {
display: block;
border: 1px solid var(--line);
border-radius: 14px;
overflow: hidden;
box-shadow: 0 8px 22px rgba(16, 42, 67, 0.06);
}

td,
tbody tr:nth-child(even) td,
tbody tr:hover td {
display: grid;
grid-template-columns: minmax(115px, 38%) 1fr;
gap: 10px;
padding: 9px 12px;
background: #fff;
}

td::before {
content: attr(data-label);
color: var(--muted);
font-size: 0.72rem;
font-weight: 800;
text-transform: uppercase;
letter-spacing: 0.04em;
}

td:empty {
display: none;
}

.cell-primary,
.cell-course {
min-width: 0;
}

td:first-child {
padding-top: 14px;
}

td:last-child {
padding-bottom: 14px;
border-bottom: 0;
}

.row-actions {
flex-wrap: wrap;
}
}

@media (max-width: 560px) {

.header-inner,
.app-shell,
.site-footer {
width: min(100% - 20px, 1600px);
}

.app-shell {
margin-top: -12px;
}

h1 {
font-size: 2rem;
}

.stats-grid {
gap: 10px;
}

.stat-card {
padding: 16px;
}

.controls-card {
padding: 16px;
}

.action-bar {
display: grid;
grid-template-columns: repeat(2, minmax(0, 1fr));
width: 100%;
}

.action-bar .button {
width: 100%;
}

.primary-controls,
.filter-panel,
.form-grid {
grid-template-columns: 1fr;
}

.search-control,
.span-2 {
grid-column: auto;
}

.filter-toggle {
width: 100%;
}

.program-dialog form {
padding: 18px;
}

.dialog-actions {
position: sticky;
bottom: -18px;
margin-left: -18px;
margin-right: -18px;
padding: 14px 18px;
background: #fff;
}

td {
grid-template-columns: 105px 1fr;
}
}

/* =========================================================
APPLIED CELEBRATION EFFECT
========================================================= */

.celebration-overlay {
position: fixed;
inset: 0;
z-index: 5000;
overflow: hidden;
pointer-events: none;
}

.celebration-message {
position: absolute;
top: 50%;
left: 50%;
width: min(90%, 700px);
transform: translate(-50%, -50%);
color: #ffffff;
font-size: clamp(2.2rem, 7vw, 5.5rem);
font-weight: 900;
line-height: 1;
letter-spacing: -0.04em;
text-align: center;
text-transform: uppercase;
text-shadow:
0 0 12px rgba(255, 255, 255, 0.95),
0 0 30px rgba(11, 114, 133, 0.9),
0 0 70px rgba(11, 114, 133, 0.8);

animation: celebration-message-animation 2.2s ease-out forwards;
}

.celebration-particle {
position: absolute;
top: var(--start-y);
width: var(--particle-size);
height: var(--particle-size);
border-radius: var(--particle-radius);
background: var(--particle-color);
opacity: 0;

animation-duration: var(--particle-duration);
animation-delay: var(--particle-delay);
animation-timing-function: cubic-bezier(0.18, 0.72, 0.22, 1);
animation-fill-mode: forwards;
}

.celebration-particle.from-left {
left: -30px;
animation-name: particle-from-left;
}

.celebration-particle.from-right {
right: -30px;
animation-name: particle-from-right;
}

@keyframes celebration-message-animation {
0% {
opacity: 0;
filter: blur(22px);
transform: translate(-50%, -50%) scale(0.75);
}

22% {
opacity: 1;
filter: blur(0);
transform: translate(-50%, -50%) scale(1);
}

68% {
opacity: 1;
filter: blur(0.5px);
transform: translate(-50%, -50%) scale(1.04);
}

100% {
opacity: 0;
filter: blur(18px);
transform: translate(-50%, -50%) scale(1.18);
}
}

@keyframes particle-from-left {
0% {
opacity: 0;
transform: translate(0, 0) rotate(0deg) scale(0.4);
}

12% {
opacity: 1;
}

100% {
opacity: 0;
transform:
translate(var(--travel-x), var(--travel-y)) rotate(var(--rotation)) scale(1);
}
}

@keyframes particle-from-right {
0% {
opacity: 0;
transform: translate(0, 0) rotate(0deg) scale(0.4);
}

12% {
opacity: 1;
}

100% {
opacity: 0;
transform:
translate(var(--travel-x), var(--travel-y)) rotate(var(--rotation)) scale(1);
}
}

/* Reduce animation for users who disable motion */
@media (prefers-reduced-motion: reduce) {
.table-scroll-hint-arrow {
animation: none;
}

.celebration-particle {
display: none;
}

.celebration-message {
animation-duration: 1.2s;
}
}

================================================
FILE: .nojekyll
================================================

[Empty file]
