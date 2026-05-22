import {
  COMPLETED_AGENDA_RETENTION_MS,
  EBOARD_AGENDA_STORAGE_KEY,
  EBOARD_BUDGET_STORAGE_KEY,
  EBOARD_NOTES_STORAGE_KEY,
  LOGIN_STORAGE_KEY,
  MEMBER_ACCOUNTS_STORAGE_KEY,
  MEETINGS_CONTENT_STORAGE_KEY,
  MEMBERSHIP_REQUESTS_STORAGE_KEY,
  NOVICE_CONTENT_STORAGE_KEY,
  PRIVATE_LINKS_STORAGE_KEY,
  TROPHIES_CONTENT_STORAGE_KEY,
} from "../data/config";
import {
  agendaItems,
  defaultNoviceContent,
  defaultTrophiesContent,
  defaultMeetingsContent,
  getPrivateLinkSection,
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
    total: budget.total === "" ? "" : Number(budget.total) || 5750,
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

export function getStoredMeetingsContent() {
  try {
    const stored = window.localStorage.getItem(MEETINGS_CONTENT_STORAGE_KEY);
    return normalizeMeetingsContent(stored ? JSON.parse(stored) : defaultMeetingsContent);
  } catch {
    return normalizeMeetingsContent(defaultMeetingsContent);
  }
}

export function saveStoredMeetingsContent(content) {
  window.localStorage.setItem(MEETINGS_CONTENT_STORAGE_KEY, JSON.stringify(normalizeMeetingsContent(content)));
}

export function getStoredNoviceContent() {
  try {
    const stored = window.localStorage.getItem(NOVICE_CONTENT_STORAGE_KEY);
    return normalizeNoviceContent(stored ? JSON.parse(stored) : defaultNoviceContent);
  } catch {
    return normalizeNoviceContent(defaultNoviceContent);
  }
}

export function saveStoredNoviceContent(content) {
  window.localStorage.setItem(NOVICE_CONTENT_STORAGE_KEY, JSON.stringify(normalizeNoviceContent(content)));
}

export function normalizeMeetingsContent(content = defaultMeetingsContent) {
  const source = { ...defaultMeetingsContent, ...content };
  return {
    announcementTitle: source.announcementTitle || defaultMeetingsContent.announcementTitle,
    announcementBody: source.announcementBody || "",
    announcementUpdatedAt: source.announcementUpdatedAt || "",
  };
}

export function normalizeNoviceContent(content = defaultNoviceContent) {
  const source = { ...defaultNoviceContent, ...content };
  return {
    speechSteps: normalizeTrophyItems(source.speechSteps, (item, index) => ({
      id: item.id || `speech-${index}-${slugify(item.title || "item")}`,
      order: Number(item.order) || index + 1,
      side: item.side === "opp" ? "opp" : "gov",
      title: item.title || "",
      time: item.time || "",
      icon: item.icon || "mic",
      copy: item.copy || "",
      note: item.note || "",
    })).sort((a, b) => a.order - b.order),
    faqs: normalizeTrophyItems(source.faqs, (item, index) => ({
      id: item.id || `faq-${index}-${slugify(item.question || "item")}`,
      question: item.question || "",
      answer: item.answer || "",
    })),
  };
}

export function normalizeTrophiesContent(content = defaultTrophiesContent) {
  const source = { ...defaultTrophiesContent, ...content };
  const normalizedResultSeasons = normalizeResultSeasons(source);
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
    resultSeasons: normalizedResultSeasons,
    results: normalizedResultSeasons.find((season) => season.id === "2025-2026")?.results || normalizedResultSeasons[0]?.results || [],
    members: mergeTrophyMembersByName(normalizeTrophyItems(source.members, (item, index) => ({
      id: item.id || `member-${index}-${slugify(item.name || "item")}`,
      name: item.name || "",
      meta: item.meta || "",
      achievements: Array.isArray(item.achievements) ? item.achievements.filter(Boolean) : [],
    }))),
  };
}

function isPlaceholderAchievement(value = "") {
  return /^no .* awards listed yet\.$/i.test(value.trim());
}

function mergeAchievements(existing = [], incoming = []) {
  const merged = [...existing, ...incoming].map((item) => item.trim()).filter(Boolean);
  const realAchievements = merged.filter((item) => !isPlaceholderAchievement(item));
  const source = realAchievements.length > 0 ? realAchievements : merged;
  return [...new Set(source)];
}

function memberMergeRank(member) {
  const achievements = member.achievements || [];
  const realAchievementCount = achievements.filter((item) => !isPlaceholderAchievement(item)).length;
  return realAchievementCount * 1000 + achievements.length;
}

function mergeTrophyMembersByName(members) {
  const memberMap = new Map();

  members.forEach((member) => {
    const key = member.name.trim().toLowerCase();
    if (!key) return;
    const existing = memberMap.get(key);
    if (!existing) {
      memberMap.set(key, {
        ...member,
        name: member.name.trim(),
        achievements: mergeAchievements(member.achievements),
      });
      return;
    }

    const primary = memberMergeRank(member) > memberMergeRank(existing) ? member : existing;
    const secondary = primary === member ? existing : member;
    memberMap.set(key, {
      ...primary,
      name: primary.name.trim(),
      meta: primary.meta || secondary.meta,
      achievements: mergeAchievements(existing.achievements, member.achievements),
    });
  });

  return [...memberMap.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeResultSeasons(source) {
  const legacyResults = normalizeResults(source.results || []);
  const defaultSeasons = defaultTrophiesContent.resultSeasons || [];
  const hasExplicitSeasons = Array.isArray(source.resultSeasons);
  const rawSeasons = hasExplicitSeasons
    ? source.resultSeasons
    : defaultSeasons;
  const seasonMap = new Map();

  rawSeasons.forEach((season, index) => {
    const id = season.id || season.year || `season-${index}`;
    seasonMap.set(id, {
      id,
      label: season.label || `${id} Results Timeline`,
      results: normalizeResults(season.results || []),
    });
  });

  if (legacyResults.length > 0) {
    const existingSeason = seasonMap.get("2025-2026");
    seasonMap.set("2025-2026", {
      id: "2025-2026",
      label: existingSeason?.label || "2025-26 Results Timeline",
      results: existingSeason?.results?.length ? existingSeason.results : legacyResults,
    });
  }

  if (!hasExplicitSeasons) {
    defaultSeasons.forEach((season) => {
      if (!seasonMap.has(season.id)) {
        seasonMap.set(season.id, {
          id: season.id,
          label: season.label,
          results: normalizeResults(season.results || []),
        });
      }
    });
  }

  return [...seasonMap.values()].sort((a, b) => b.id.localeCompare(a.id));
}

function normalizeResults(results) {
  return normalizeTrophyItems(results, (item, index) => ({
      id: item.id || `result-${index}-${slugify(`${item.date || ""}-${item.tournament || "item"}`)}`,
      date: item.date || "",
      tournament: item.tournament || "",
      highlights: Array.isArray(item.highlights) ? item.highlights.filter(Boolean) : [],
    }));
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
        section: getPrivateLinkSection(link) || defaults?.section || "Team Links",
        order: link.order || defaults?.order || index + 100,
      };
    })
    .sort((a, b) => a.order - b.order);
}
