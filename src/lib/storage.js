import {
  COMPLETED_AGENDA_RETENTION_MS,
  EBOARD_AGENDA_STORAGE_KEY,
  EBOARD_BUDGET_STORAGE_KEY,
  EBOARD_NOTES_STORAGE_KEY,
  LOGIN_STORAGE_KEY,
  MEMBER_ACCOUNTS_STORAGE_KEY,
  MEMBERSHIP_REQUESTS_STORAGE_KEY,
  PRIVATE_LINKS_STORAGE_KEY,
  TROPHIES_CONTENT_STORAGE_KEY,
} from "../data/config";
import {
  agendaItems,
  defaultTrophiesContent,
  initialBudgetRevenueRows,
  initialBudgetRows,
  privateLinkDefaultsById,
  privateLinks,
} from "../data/content";

export function getStoredAuth() {
  try {
    const stored = window.localStorage.getItem(LOGIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveStoredAuth(auth) {
  window.localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(LOGIN_STORAGE_KEY);
}

export function getStoredNotes() {
  try {
    const stored = window.localStorage.getItem(EBOARD_NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveStoredNotes(notes) {
  window.localStorage.setItem(EBOARD_NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export function getStoredAgenda() {
  try {
    const stored = window.localStorage.getItem(EBOARD_AGENDA_STORAGE_KEY);
    return normalizeAgendaItems(stored ? JSON.parse(stored) : agendaItems);
  } catch {
    return normalizeAgendaItems(agendaItems);
  }
}

export function saveStoredAgenda(items) {
  window.localStorage.setItem(EBOARD_AGENDA_STORAGE_KEY, JSON.stringify(normalizeAgendaItems(items)));
}

export function isExpiredCompletedAgendaItem(item) {
  if (!item.completed_at) return false;
  const completedAt = Date.parse(item.completed_at);
  return Number.isFinite(completedAt) && Date.now() - completedAt > COMPLETED_AGENDA_RETENTION_MS;
}

export function normalizeAgendaItems(items) {
  return items
    .map((item) => ({ ...item, completed_at: item.completed_at ?? null }))
    .filter((item) => !isExpiredCompletedAgendaItem(item));
}

export function getStoredBudget() {
  try {
    const stored = window.localStorage.getItem(EBOARD_BUDGET_STORAGE_KEY);
    return normalizeBudget(stored ? JSON.parse(stored) : { total: 5750, rows: initialBudgetRows, revenueRows: initialBudgetRevenueRows });
  } catch {
    return normalizeBudget({ total: 5750, rows: initialBudgetRows, revenueRows: initialBudgetRevenueRows });
  }
}

export function saveStoredBudget(budget) {
  window.localStorage.setItem(EBOARD_BUDGET_STORAGE_KEY, JSON.stringify(normalizeBudget(budget)));
}

export function normalizeBudget(budget) {
  return {
    total: Number(budget.total) || 5750,
    rows: budget.rows || initialBudgetRows,
    revenueRows: budget.revenueRows || initialBudgetRevenueRows,
  };
}

export function getStoredPrivateLinks() {
  try {
    const stored = window.localStorage.getItem(PRIVATE_LINKS_STORAGE_KEY);
    return stored ? enrichPrivateLinks(JSON.parse(stored)) : privateLinks;
  } catch {
    return privateLinks;
  }
}

export function saveStoredPrivateLinks(links) {
  window.localStorage.setItem(PRIVATE_LINKS_STORAGE_KEY, JSON.stringify(links));
}

export function getStoredMembershipRequests() {
  try {
    const stored = window.localStorage.getItem(MEMBERSHIP_REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveStoredMembershipRequests(requests) {
  window.localStorage.setItem(MEMBERSHIP_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

export function getStoredMemberAccounts() {
  try {
    const stored = window.localStorage.getItem(MEMBER_ACCOUNTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveStoredMemberAccounts(accounts) {
  window.localStorage.setItem(MEMBER_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function getStoredTrophiesContent() {
  try {
    const stored = window.localStorage.getItem(TROPHIES_CONTENT_STORAGE_KEY);
    return normalizeTrophiesContent(stored ? JSON.parse(stored) : defaultTrophiesContent);
  } catch {
    return normalizeTrophiesContent(defaultTrophiesContent);
  }
}

export function saveStoredTrophiesContent(content) {
  window.localStorage.setItem(TROPHIES_CONTENT_STORAGE_KEY, JSON.stringify(normalizeTrophiesContent(content)));
}

export function normalizeTrophiesContent(content = defaultTrophiesContent) {
  const source = { ...defaultTrophiesContent, ...content };
  return {
    sourceUrl: source.sourceUrl || defaultTrophiesContent.sourceUrl,
    stats: normalizeTrophyItems(source.stats, (item, index) => ({
      id: item.id || `stat-${index}-${slugify(item.label || item.value || "item")}`,
      value: item.value || "",
      label: item.label || "",
      detail: item.detail || "",
    })),
    milestones: normalizeTrophyItems(source.milestones, (item, index) => ({
      id: item.id || `milestone-${index}-${slugify(item.year || item.title || "item")}`,
      year: item.year || "",
      title: item.title || "",
      copy: item.copy || "",
    })),
    accomplishments: (source.accomplishments || []).map((item, index) => {
      const text = typeof item === "string" ? item : item.text;
      return {
        id: typeof item === "object" && item?.id ? item.id : `accomplishment-${index}-${slugify(text || "item")}`,
        text: text || "",
      };
    }),
    results: normalizeTrophyItems(source.results, (item, index) => ({
      id: item.id || `result-${index}-${slugify(`${item.date || ""}-${item.tournament || "item"}`)}`,
      date: item.date || "",
      tournament: item.tournament || "",
      highlights: Array.isArray(item.highlights) ? item.highlights.filter(Boolean) : [],
    })),
    members: normalizeTrophyItems(source.members, (item, index) => ({
      id: item.id || `member-${index}-${slugify(item.name || "item")}`,
      name: item.name || "",
      meta: item.meta || "",
      achievements: Array.isArray(item.achievements) ? item.achievements.filter(Boolean) : [],
    })),
  };
}

function normalizeTrophyItems(items, normalizeItem) {
  return (items || []).map(normalizeItem).filter((item) => item.id);
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "item";
}

export function enrichPrivateLinks(links) {
  return links
    .map((link, index) => {
      const defaults = privateLinkDefaultsById[link.id];
      return {
        ...defaults,
        ...link,
        section: link.section || defaults?.section || "Team Links",
        order: link.order || defaults?.order || index + 100,
      };
    })
    .sort((a, b) => a.order - b.order);
}
