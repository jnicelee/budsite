import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  ClipboardList,
  DollarSign,
  ExternalLink,
  FileText,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Medal,
  Menu,
  Sparkles,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const LOGIN_STORAGE_KEY = "buds-auth";
const EBOARD_NOTES_STORAGE_KEY = "buds-eboard-notes";
const EBOARD_AGENDA_STORAGE_KEY = "buds-eboard-agenda";
const EBOARD_BUDGET_STORAGE_KEY = "buds-eboard-budget";
const PRIVATE_LINKS_STORAGE_KEY = "buds-private-links";
const MEMBERSHIP_REQUESTS_STORAGE_KEY = "buds-membership-requests";
const MEMBER_ACCOUNTS_STORAGE_KEY = "buds-member-accounts";
const COMPLETED_AGENDA_RETENTION_MS = 14 * 24 * 60 * 60 * 1000;
const BUDGET_STATUSES = ["On Hold", "Approved", "Denied"];
const MEMBERSHIP_REQUEST_STATUSES = ["Pending", "Accepted", "Denied"];
const MEMBER_ACCOUNT_ROLES = ["member", "eboard"];
const MEMBER_PASSWORD = "buds-members";
const EBOARD_PASSWORD = "buds-eboard";
const MASTER_EBOARD_EMAIL = "yeon1@bu.edu";
const SECONDARY_EBOARD_EMAIL = "iankim6488@gmail.com";
const MASTER_EBOARD_PASSWORD = "computa";
const ADMIN_ROLE = "admin";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Novice Hub", href: "/novice-hub" },
  { label: "Calendar", href: "/calendar" },
  { label: "History", href: "/history" },
  { label: "E-Board", href: "/eboard" },
  { label: "Contact", href: "/contact" },
];

const noviceResources = [
  {
    title: "APDA 101",
    description: "A plain-language guide to rounds, speaker roles, prep time, points of information, and how tournaments work.",
    tag: "Start here",
  },
  {
    title: "Case Construction",
    description: "Templates for PMCs, LOCs, mechanisms, burdens, and weighing so new debaters can build rounds faster.",
    tag: "Core skill",
  },
  {
    title: "Practice Drills",
    description: "Short exercises for extensions, rebuttal, weighing, impact comparison, and flowing.",
    tag: "Weekly use",
  },
  {
    title: "Round Library",
    description: "Annotated videos, sample cases, judge feedback, and model speeches from BUDS members.",
    tag: "Members",
  },
];

const privateLinks = [
  { id: "link-buds-drive", section: "BUDS Team Specific Links", order: 1, label: "BUDS Drive", description: "Google Drive that contains the casebook, resources, equity forms, meeting notes, and other shared team materials.", url: "http://tinyurl.com/budsdrive" },
  { id: "link-equity-complaint", section: "BUDS Team Specific Links", order: 2, label: "Equity Complaint Form", description: "Form to express concerns about inequity among debaters or within the team environment.", url: "https://tinyurl.com/budsequity" },
  { id: "link-tournament-signups", section: "BUDS Team Specific Links", order: 3, label: "Tournament Sign-Ups", description: "List of tournaments BUDS plans to attend, where members can sign up as competitors, judges, or mark that they are looking for a partner.", url: "https://docs.google.com/spreadsheets/d/1HUdRoHPHAwAfzchtA406yVSuRHhgjy-MGMmQbiouGnk/edit?usp=sharing" },
  { id: "link-events-calendar", section: "BUDS Team Specific Links", order: 4, label: "Events Google Calendar", description: "Add this calendar to see upcoming BUDS events, practices, and tournaments in Google Calendar.", url: "https://calendar.google.com/calendar/u/0?cid=Y18yYmU4Mjk3YTk1NjE3MjRmMjIzNDc5MmU5Y2Q2OGVkOWYyZmM1ZDZjNmJlOTEwMDU2YjVhNzI1OGQ1MDk4Y2Y3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20" },
  { id: "link-big-little", section: "BUDS Team Specific Links", order: 5, label: "Big-Little Form", description: "Form for new members to rank preferences for bigs in the BUDS mentor pairing system.", url: "https://forms.gle/KXnfMfoggy6Mv4A1A" },
  { id: "link-prep-out", section: "BUDS Team Specific Links", order: 6, label: "Prep-Out Form", description: "Request prep-outs for cases you have hit so the team can build stronger shared responses.", url: "http://tinyurl.com/budsprepouts" },
  { id: "link-birthday", section: "BUDS Team Specific Links", order: 7, label: "Birthday Form", description: "Share your birthday so BUDS can add it to the calendar, say happy birthday, and make tournament registration easier.", url: "https://forms.gle/7zdPNeiaw4XfMmoy7" },
  { id: "link-feedback", section: "BUDS Team Specific Links", order: 8, label: "Feedback Form", description: "Propose ideas or give feedback about lectures, events, tournaments, and the club in general.", url: "https://forms.gle/ZiTMaAG1YNthi4Rh7" },
  { id: "link-apda-website", section: "Debater Resources", order: 9, label: "APDA Website", description: "League hub for resources, club standings, the APDA forum, and other debate information.", url: "https://apda.online/" },
  { id: "link-apda-novice-guide", section: "Debater Resources", order: 10, label: "APDA Novice Guide to Debate", description: "Beginner-friendly guide made by APDA debaters that explains the basics of parliamentary debate for newcomers.", url: "https://docs.google.com/document/d/17ST1qeuoEmJB6zcFU80zfD6pmmSQVjwoERZu8btnOlM/edit?usp=sharing" },
  { id: "link-apda-dictionary", section: "Debater Resources", order: 11, label: "APDA Dictionary", description: "Reference for common APDA terms and lingo used in rounds, tournaments, and team discussions.", url: "https://docs.google.com/document/d/1M2odwpanTZe5w7Q4WCOCuBzlKkg2Re4-R48iIB3JT3g/edit?usp=sharing" },
  { id: "link-apda-master-guide", section: "Debater Resources", order: 12, label: "APDA Master Guide", description: "More exhaustive APDA knowledge base with links, advice, notes, and advanced resources.", url: "https://docs.google.com/document/d/1hO5OMV78lV0K4KjhqEFq3SqCRDGGdWmQT3DwS9ltZvA/edit?usp=sharing" },
];

const privateLinkDefaultsById = Object.fromEntries(privateLinks.map((link) => [link.id, link]));
const privateLinkSections = ["BUDS Team Specific Links", "Debater Resources"];

const agendaItems = [
  { id: "agenda-1", text: "Tournament registration and travel", owner: "President", due: "Add date" },
  { id: "agenda-2", text: "Novice curriculum updates", owner: "Co-Vice Presidents", due: "Add date" },
  { id: "agenda-3", text: "Practice attendance and pairings", owner: "Secretary", due: "Add date" },
  { id: "agenda-4", text: "Funding, reimbursements, and budget approvals", owner: "Treasurer", due: "Add date" },
  { id: "agenda-5", text: "Outreach, alumni, and recruitment", owner: "Membership Coordinator", due: "Add date" },
];

const initialBudgetRows = [
  { id: "budget-1", category: "Tournament fees", allocated: 1500, spent: 0, status: "On Hold" },
  { id: "budget-2", category: "Travel", allocated: 3000, spent: 0, status: "On Hold" },
  { id: "budget-3", category: "Team events", allocated: 500, spent: 0, status: "On Hold" },
  { id: "budget-4", category: "Merch and supplies", allocated: 750, spent: 0, status: "On Hold" },
];

const initialBudgetRevenueRows = [];

const accomplishments = [
  "Tournament wins and finals appearances",
  "Speaker awards and novice breaks",
  "Team awards and season milestones",
  "Alumni judging, coaching, and mentorship",
];

const timeline = [
  {
    year: "Founded",
    title: "A home for parliamentary debate at BU",
    copy: "Add the founding year, early leadership, and the story of how BUDS became a competitive APDA team.",
  },
  {
    year: "Growth",
    title: "Practices, tournaments, and institutional memory",
    copy: "Use this section to track team traditions, regular meetings, major tournaments, and shifts in team culture.",
  },
  {
    year: "Today",
    title: "A competitive and welcoming debate community",
    copy: "Feature current priorities, novice development, team goals, and the strongest recent accomplishments.",
  },
];

const board = [
  {
    name: "Josh Lyons",
    role: "President",
    bio: "Calls, presides over, and adjourns BUDS meetings while guiding voting procedures for the team. He also serves as BUDS's liaison to APDA, registers tournament teams, allocates the free seed, and represents BU at APDA meetings.",
  },
  {
    name: "Janice Lee",
    role: "Co-Vice President",
    bio: "Helps lead BUDS when the President is unavailable and serves as a primary contact between team members and e-board. She also supports novice training by helping craft instructional meetings, presentations, drills, and exercises.",
  },
  {
    name: "Cassie Fitts",
    role: "Co-Vice President",
    bio: "Shares responsibility for stepping in when the President cannot attend and keeping communication clear between members and e-board. She helps lead novice education, including training presentations, practice exercises, and instructional team meetings.",
  },
  {
    name: "Nikhil Saxena",
    role: "Treasurer",
    bio: "Manages financial matters for BUDS and keeps the team organized around budgets, paperwork, and funding. As treasurer, he authorizes Student Activities paperwork and acts as the signatory for organization funds.",
  },
  {
    name: "Lucia Bronfman",
    role: "Secretary",
    bio: "Keeps members informed about meetings, events, and general team information while managing publicity and organizational correspondence. She also tracks membership status, maintains contact information, and preserves team records as BUDS historian.",
  },
  {
    name: "Flo Arnado",
    role: "Membership Coordinator",
    bio: "Focuses on growing and retaining team membership throughout the school year. She maintains BUDS social media, organizes team social events, and oversees the mentor and mentee program.",
  },
  {
    name: "John Yule",
    role: "Equity Officer",
    bio: "Upholds BUDS equity procedures and helps communicate policies to the team in line with BU and APDA best practices. He serves as a resource for equity concerns, supports complaint processes, and helps coordinate inclusive team norms and bonding.",
  },
  {
    name: "Vishaal Arunprasad",
    role: "Special Events Coordinator",
    bio: "Helps plan and facilitate BUDS tournaments by coordinating logistics such as judges, housing, meals, tab materials, awards, registration, and invitations. He works with team members on tournament themes and helps protect tab integrity while serving as a contact for attending teams.",
  },
  {
    name: "Ezzah Tariq",
    role: "Special Events Coordinator",
    bio: "Helps plan and facilitate BUDS tournaments, including tournament logistics, hospitality, registration, tab policy, trophies, and communications with attending teams. She supports theme planning, complaint handling, and the behind-the-scenes work needed for a smooth tournament weekend.",
  },
];

const alumni = [
  {
    name: "Alumni Spotlight",
    detail: "Add a short profile on a former BUDS member, including their favorite memory and post-grad path.",
  },
  {
    name: "Mentor Network",
    detail: "Create a directory of alumni who are open to judging, coaching, career chats, or tournament support.",
  },
];

function navigateTo(href) {
  if (window.location.pathname === href) return;
  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function SiteLink({ href, children, className = "", onClick }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(href);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function getStoredAuth() {
  try {
    const stored = window.localStorage.getItem(LOGIN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveStoredAuth(auth) {
  window.localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(auth));
}

function clearStoredAuth() {
  window.localStorage.removeItem(LOGIN_STORAGE_KEY);
}

function getStoredNotes() {
  try {
    const stored = window.localStorage.getItem(EBOARD_NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredNotes(notes) {
  window.localStorage.setItem(EBOARD_NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function getStoredAgenda() {
  try {
    const stored = window.localStorage.getItem(EBOARD_AGENDA_STORAGE_KEY);
    return normalizeAgendaItems(stored ? JSON.parse(stored) : agendaItems);
  } catch {
    return normalizeAgendaItems(agendaItems);
  }
}

function saveStoredAgenda(items) {
  window.localStorage.setItem(EBOARD_AGENDA_STORAGE_KEY, JSON.stringify(normalizeAgendaItems(items)));
}

function isExpiredCompletedAgendaItem(item) {
  if (!item.completed_at) return false;
  const completedAt = Date.parse(item.completed_at);
  return Number.isFinite(completedAt) && Date.now() - completedAt > COMPLETED_AGENDA_RETENTION_MS;
}

function normalizeAgendaItems(items) {
  return items
    .map((item) => ({ ...item, completed_at: item.completed_at ?? null }))
    .filter((item) => !isExpiredCompletedAgendaItem(item));
}

function getStoredBudget() {
  try {
    const stored = window.localStorage.getItem(EBOARD_BUDGET_STORAGE_KEY);
    return normalizeBudget(stored ? JSON.parse(stored) : { total: 5750, rows: initialBudgetRows, revenueRows: initialBudgetRevenueRows });
  } catch {
    return normalizeBudget({ total: 5750, rows: initialBudgetRows, revenueRows: initialBudgetRevenueRows });
  }
}

function saveStoredBudget(budget) {
  window.localStorage.setItem(EBOARD_BUDGET_STORAGE_KEY, JSON.stringify(normalizeBudget(budget)));
}

function normalizeBudget(budget) {
  return {
    total: Number(budget.total) || 5750,
    rows: budget.rows || initialBudgetRows,
    revenueRows: budget.revenueRows || initialBudgetRevenueRows,
  };
}

function getStoredPrivateLinks() {
  try {
    const stored = window.localStorage.getItem(PRIVATE_LINKS_STORAGE_KEY);
    return stored ? enrichPrivateLinks(JSON.parse(stored)) : privateLinks;
  } catch {
    return privateLinks;
  }
}

function saveStoredPrivateLinks(links) {
  window.localStorage.setItem(PRIVATE_LINKS_STORAGE_KEY, JSON.stringify(links));
}

function getStoredMembershipRequests() {
  try {
    const stored = window.localStorage.getItem(MEMBERSHIP_REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredMembershipRequests(requests) {
  window.localStorage.setItem(MEMBERSHIP_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

function getStoredMemberAccounts() {
  try {
    const stored = window.localStorage.getItem(MEMBER_ACCOUNTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveStoredMemberAccounts(accounts) {
  window.localStorage.setItem(MEMBER_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function enrichPrivateLinks(links) {
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

function normalizeSupabaseBudgetRow(row) {
  return {
    id: row.id,
    category: row.category,
    allocated: Number(row.allocated) || 0,
    spent: Number(row.spent) || 0,
    status: row.status,
  };
}

function normalizeSupabaseRevenueRow(row) {
  return {
    id: row.id,
    category: row.category,
    amount: Number(row.amount) || 0,
  };
}

async function loadDatabaseState() {
  if (!isSupabaseConfigured) return null;

  const [
    agendaResult,
    notesResult,
    budgetSettingsResult,
    budgetRowsResult,
    budgetRevenueResult,
    privateLinksResult,
  ] = await Promise.all([
    supabase.from("eboard_agenda").select("id,text,owner,due,completed_at").order("created_at", { ascending: false }),
    supabase.from("eboard_notes").select("id,date,title,body").order("date", { ascending: false }),
    supabase.from("eboard_budget_settings").select("total").eq("id", "default").maybeSingle(),
    supabase.from("eboard_budget_rows").select("id,category,allocated,spent,status").order("created_at", { ascending: true }),
    supabase.from("eboard_budget_revenue").select("id,category,amount").order("created_at", { ascending: true }),
    supabase.from("private_links").select("id,label,description,url").order("created_at", { ascending: true }),
  ]);

  if (agendaResult.error || notesResult.error || budgetSettingsResult.error || budgetRowsResult.error || budgetRevenueResult.error || privateLinksResult.error) {
    console.error("Supabase load failed", {
      agendaError: agendaResult.error,
      notesError: notesResult.error,
      budgetSettingsError: budgetSettingsResult.error,
      budgetRowsError: budgetRowsResult.error,
      budgetRevenueError: budgetRevenueResult.error,
      privateLinksError: privateLinksResult.error,
    });
    return null;
  }

  const expiredAgendaItems = agendaResult.data.filter(isExpiredCompletedAgendaItem);
  if (expiredAgendaItems.length > 0) {
    await Promise.all(expiredAgendaItems.map((item) => deleteAgendaItem(item.id)));
  }

  return {
    agenda: agendaResult.data.length > 0 ? normalizeAgendaItems(agendaResult.data) : normalizeAgendaItems(agendaItems),
    notes: notesResult.data,
    budget: {
      total: Number(budgetSettingsResult.data?.total) || 5750,
      rows: budgetRowsResult.data.length > 0
        ? budgetRowsResult.data.map(normalizeSupabaseBudgetRow)
        : initialBudgetRows,
      revenueRows: budgetRevenueResult.data.length > 0
        ? budgetRevenueResult.data.map(normalizeSupabaseRevenueRow)
        : initialBudgetRevenueRows,
    },
    privateLinks: privateLinksResult.data.length > 0 ? enrichPrivateLinks(privateLinksResult.data) : privateLinks,
  };
}

async function upsertAgendaItem(item) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_agenda").upsert(item);
  if (error) console.error("Supabase agenda upsert failed", error);
}

async function deleteAgendaItem(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_agenda").delete().eq("id", id);
  if (error) console.error("Supabase agenda delete failed", error);
}

async function upsertBudgetSettings(total) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("eboard_budget_settings")
    .upsert({ id: "default", total, updated_at: new Date().toISOString() });
  if (error) console.error("Supabase budget settings upsert failed", error);
}

async function upsertBudgetRow(row) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_rows").upsert(row);
  if (error) console.error("Supabase budget row upsert failed", error);
}

async function deleteBudgetRow(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_rows").delete().eq("id", id);
  if (error) console.error("Supabase budget row delete failed", error);
}

async function upsertBudgetRevenueRow(row) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_revenue").upsert(row);
  if (error) console.error("Supabase budget revenue upsert failed", error);
}

async function deleteBudgetRevenueRow(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_revenue").delete().eq("id", id);
  if (error) console.error("Supabase budget revenue delete failed", error);
}

async function insertNote(note) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_notes").insert(note);
  if (error) console.error("Supabase note insert failed", error);
}

async function upsertPrivateLink(link) {
  if (!isSupabaseConfigured) return;
  const { id, label, description, url } = link;
  const { error } = await supabase.from("private_links").upsert({ id, label, description, url });
  if (error) console.error("Supabase private link upsert failed", error);
}

async function loadMembershipRequests() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("membership_requests")
    .select("id,name,email,password,message,status,reason,created_at,reviewed_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase membership requests load failed", error);
    return null;
  }
  return data;
}

async function insertMembershipRequest(request) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("membership_requests").insert(request);
  if (error) console.error("Supabase membership request insert failed", error);
}

async function updateMembershipRequestStatus(id, status, reason) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("membership_requests")
    .update({ status, reason, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase membership request review failed", error);
}

async function deleteMembershipRequest(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("membership_requests").delete().eq("id", id);
  if (error) console.error("Supabase membership request delete failed", error);
}

async function loadMemberAccounts() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("member_accounts")
    .select("id,name,email,password,role,status,created_at,updated_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase member accounts load failed", error);
    return null;
  }
  return data;
}

async function findMemberAccount(email, password) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("member_accounts")
    .select("id,name,email,role,status")
    .eq("email", email)
    .eq("password", password)
    .eq("status", "active")
    .maybeSingle();
  if (error) {
    console.error("Supabase member login failed", error);
    return null;
  }
  return data;
}

async function findMemberAccountByEmail(email) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("member_accounts")
    .select("id,name,email,password,role,status")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    console.error("Supabase member account lookup failed", error);
    return null;
  }
  return data;
}

async function upsertMemberAccount(account) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("member_accounts").upsert(account);
  if (error) console.error("Supabase member account upsert failed", error);
}

async function updateMemberAccountRole(id, role) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase member role update failed", error);
}

async function revokeMemberAccount(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase member revoke failed", error);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function Eyebrow({ children, light = false }) {
  return (
    <p className={`text-xs font-black uppercase tracking-[0.22em] ${light ? "text-white/75" : "text-[#CC0000]"}`}>
      {children}
    </p>
  );
}

function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-10 max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 text-4xl font-black leading-[1.02] tracking-tight text-[#2D2926] md:text-6xl">
        {title}
      </h1>
      {children && <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5b5450]">{children}</p>}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`border border-[#ded8d2] bg-white p-6 shadow-[0_16px_45px_rgba(45,41,38,0.08)] ${className}`}>
      {children}
    </div>
  );
}

function PrimaryButton({ href, children, className = "" }) {
  return (
    <SiteLink
      href={href}
      className={`inline-flex items-center justify-center gap-2 bg-[#CC0000] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#A00000] ${className}`}
    >
      {children}
    </SiteLink>
  );
}

function SecondaryButton({ href, children, className = "" }) {
  return (
    <SiteLink
      href={href}
      className={`inline-flex items-center justify-center gap-2 border border-[#2D2926]/20 bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#2D2926] ${className}`}
    >
      {children}
    </SiteLink>
  );
}

function Page({ children, className = "" }) {
  return (
    <section className={`mx-auto min-h-[calc(100vh-4.75rem)] w-full max-w-7xl px-5 py-10 md:px-8 md:py-16 ${className}`}>
      {children}
    </section>
  );
}

function HomePage() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-start gap-10 px-5 py-7 md:px-8 md:py-8 lg:grid-cols-[1.02fr_0.98fr]">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="mb-6 inline-flex items-center gap-2 border border-[#ded8d2] bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#2D2926]">
          <Trophy size={16} className="text-[#CC0000]" /> Ranked #4 nationally in 2026
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight text-[#2D2926] md:text-6xl xl:text-[4.35rem]">
          Nationally ranked debate, open to anyone at BU.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5b5450]">
          BUDS competes in APDA, the American Parliamentary Debate Association. No tryouts, no dues, no experience required, just weekly chances to travel, argue, learn, and represent Boston University.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton href="/join" className="px-6">
            Join BUDS <ArrowRight size={16} />
          </PrimaryButton>
          <SecondaryButton href="/novice-hub" className="px-6">
            New to debate? <Sparkles size={16} />
          </SecondaryButton>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {["No tryouts", "No dues", "Weekly tournaments"].map((item) => (
            <div key={item} className="border-l-4 border-[#CC0000] bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] shadow-[0_10px_26px_rgba(45,41,38,0.05)]">
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="grid gap-5">
        <div className="overflow-hidden border border-[#1f1b19] bg-[#2D2926] text-white shadow-[0_20px_55px_rgba(45,41,38,0.14)]">
          <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
            <div className="flex min-h-64 flex-col justify-between bg-[#CC0000] p-7 text-white md:min-h-[29rem] md:p-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/80">2026 national rank</p>
                <p className="mt-5 text-[7rem] font-black leading-none tracking-tight md:text-[7.5rem]">#4</p>
              </div>
              <p className="max-w-xs text-base font-bold leading-7 text-white/90">
                A top national team that still starts with an open door.
              </p>
            </div>
            <div className="grid content-between gap-6 p-7 md:p-8">
              <div>
                <Eyebrow light>Format</Eyebrow>
                <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">APDA parliamentary debate</h2>
                <p className="mt-4 text-sm leading-6 text-white/72">
                  Two-person teams, limited prep, persuasion under pressure, and tournaments across the collegiate circuit.
                </p>
              </div>
              <div className="grid grid-cols-2 border border-white/15">
                <div className="border-b border-r border-white/15 p-4">
                  <p className="text-3xl font-black leading-none">0</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white/60">Tryouts</p>
                </div>
                <div className="border-b border-white/15 p-4">
                  <p className="text-3xl font-black leading-none">$0</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white/60">Member fees</p>
                </div>
                <div className="border-r border-white/15 p-4">
                  <p className="text-3xl font-black leading-none">APDA</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white/60">League format</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-black leading-none">Travel</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white/60">Weekly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}

function AboutPage() {
  return (
    <Page>
      <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-[#CC0000] p-8 text-black md:p-10">
          <Eyebrow light>About BUDS</Eyebrow>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-5xl">
            A team built for argument, friendship, and institutional memory.
          </h1>
        </Card>
        <Card className="p-8 md:p-10">
          <p className="text-lg leading-8 text-[#4d4743]">
            The Boston University Debate Society is a member of the American Parliamentary Debate Association (also known as APDA). The current incarnation of the Boston University Debate Society was formed in 1999, and competes in parliamentary debate. Previously, Boston University teams competed in other varieties of collegiate debate.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["No experience required", "Weekly practices", "Tournament travel"].map((item) => (
              <div key={item} className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-4 py-4 text-sm font-black text-[#2D2926]">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

function NoviceHubPage() {
  return (
    <Page>
      <PageHeader eyebrow="Novice Hub" title="A cleaner path from first practice to first tournament.">
        Give new debaters the essentials without burying them in a long scroll.
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {noviceResources.map((resource) => (
          <Card key={resource.title} className="group flex min-h-64 flex-col transition hover:-translate-y-1">
            <span className="w-fit bg-[#CC0000] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">{resource.tag}</span>
            <h2 className="mt-6 text-2xl font-black leading-tight text-[#2D2926]">{resource.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-[#5b5450]">{resource.description}</p>
            <button className="mt-6 inline-flex items-center gap-2 text-left text-sm font-black uppercase tracking-[0.08em] text-[#CC0000]">
              Add link <ChevronRight className="transition group-hover:translate-x-1" size={16} />
            </button>
          </Card>
        ))}
      </div>
      <Card className="mt-6 flex flex-col gap-5 bg-[#2D2926] p-8 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 font-black text-white"><Lock size={16} /> Optional private hub</div>
          <p className="max-w-3xl text-sm leading-6 text-white/70">Use this for member-only case files, strategy guides, practice recordings, and judge feedback. Add authentication later with Firebase, Supabase, Clerk, or Vercel password protection.</p>
        </div>
        <button className="bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">Members only</button>
      </Card>
    </Page>
  );
}

function CalendarPage({ calendarEmbedUrl }) {
  return (
    <Page>
      <PageHeader eyebrow="Calendar" title="Practices, tournaments, and team events.">
        Replace the calendar ID in the code with your public Google Calendar embed link.
      </PageHeader>
      <Card className="overflow-hidden p-3">
        <div className="aspect-[16/10] overflow-hidden border border-[#ded8d2] bg-white md:aspect-[16/8]">
          <iframe
            src={calendarEmbedUrl}
            title="BUDS Google Calendar"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </Card>
    </Page>
  );
}

function HistoryPage() {
  return (
    <Page>
      <PageHeader eyebrow="History" title="A timeline that can grow with the team.">
        Add each year once you have records, photos, e-board names, and major results.
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-3">
        {timeline.map((item) => (
          <Card key={item.year} className="border-t-8 border-t-[#CC0000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CC0000]">{item.year}</p>
            <h2 className="mt-4 text-2xl font-black leading-tight text-[#2D2926]">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5b5450]">{item.copy}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <Medal className="text-[#CC0000]" />
            <h2 className="text-3xl font-black text-[#2D2926]">Accomplishments</h2>
          </div>
          <div className="grid gap-3">
            {accomplishments.map((item) => (
              <div key={item} className="flex items-center justify-between border border-[#ded8d2] bg-[#f6f4f2] px-4 py-4">
                <span className="font-bold text-[#2D2926]">{item}</span>
                <ChevronRight size={18} className="text-[#CC0000]" />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <Sparkles className="text-[#CC0000]" />
            <h2 className="text-3xl font-black text-[#2D2926]">Alumni</h2>
          </div>
          <div className="grid gap-4">
            {alumni.map((person) => (
              <div key={person.name} className="border border-[#ded8d2] bg-white p-5">
                <p className="font-black text-[#2D2926]">{person.name}</p>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">{person.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Page>
  );
}

function EBoardPage() {
  return (
    <Page>
      <PageHeader eyebrow="People" title="Current E-Board.">
        Add photos, short bios, and clear contact paths for prospective members.
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-3">
        {board.map((member) => (
          <Card key={member.role}>
            <div className="mb-6 flex h-36 items-end bg-[#2D2926] p-5">
              <div className="h-16 w-16 border-4 border-white bg-[#CC0000]" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CC0000]">{member.role}</p>
            <h2 className="mt-3 text-2xl font-black text-[#2D2926]">{member.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5b5450]">{member.bio}</p>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function ContactPage() {
  return (
    <Page>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-[34rem] flex-col justify-between border border-[#1f1b19] bg-[#2D2926] p-8 text-left text-white shadow-[0_20px_55px_rgba(45,41,38,0.14)] md:p-10">
          <div>
            <span className="inline-flex bg-[#CC0000] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              Contact
            </span>
            <h1 className="mt-8 max-w-xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Come to practice. Watch a round. Ask a question.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/85">
              BUDS is open to BU students of every experience level. Reach out, stop by practice, or request membership through the join form when you are ready.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <a href="mailto:boston.university.debate@gmail.com" className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                Email the team <Mail size={16} />
            </a>
            <a href="https://www.instagram.com/budebatesociety?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/35 px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-white/10">
                Instagram <ExternalLink size={16} />
            </a>
            <PrimaryButton href="/join" className="sm:col-span-2">
                Request to join <ArrowRight size={16} />
            </PrimaryButton>
          </div>
        </div>

        <div className="border border-[#ded8d2] bg-white p-8 shadow-[0_20px_55px_rgba(45,41,38,0.08)] md:p-10">
          <div className="border-t-8 border-t-[#CC0000] bg-[#f6f4f2] p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#CC0000] text-white">
                <MapPin />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CC0000]">Practice Information</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#2D2926]">Mondays and Wednesdays, 7-8 PM</h2>
                <p className="mt-4 text-lg font-bold text-[#2D2926]">SAR 101</p>
                <p className="mt-3 text-base leading-7 text-[#5b5450]">Open to all BU students, including complete beginners. Come by to observe, ask questions, or jump into drills.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="border border-[#ded8d2] bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">Best first step</p>
              <p className="mt-3 text-sm leading-6 text-[#5b5450]">Visit a practice and introduce yourself to an e-board member.</p>
            </div>
            <div className="border border-[#ded8d2] bg-white p-5">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">Ready to join?</p>
              <p className="mt-3 text-sm leading-6 text-[#5b5450]">Use the membership request form so admins can add you to the team flow.</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function JoinPage({ auth }) {
  const [requests, setRequests] = useState(() => getStoredMembershipRequests());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestPassword, setRequestPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("success");
  const [reviewReasons, setReviewReasons] = useState({});
  const isAdmin = auth?.email === MASTER_EBOARD_EMAIL || auth?.role === ADMIN_ROLE;

  useEffect(() => {
    let ignore = false;

    async function hydrateRequests() {
      const databaseRequests = await loadMembershipRequests();
      if (!databaseRequests || ignore) return;
      setRequests(databaseRequests);
      saveStoredMembershipRequests(databaseRequests);
    }

    hydrateRequests();

    return () => {
      ignore = true;
    };
  }, []);

  const submitMembershipRequest = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isBuEmail = /@([a-z0-9-]+\.)?bu\.edu$/.test(normalizedEmail);

    if (!isBuEmail) {
      setSubmitMessageType("error");
      setSubmitMessage("Please use a BU email address ending in bu.edu.");
      return;
    }

    if (requestPassword.trim().length < 6) {
      setSubmitMessageType("error");
      setSubmitMessage("Please choose a password with at least 6 characters.");
      return;
    }

    const nextRequest = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: requestPassword,
      message: message.trim(),
      status: "Pending",
      reason: "",
      created_at: new Date().toISOString(),
      reviewed_at: null,
    };
    const nextRequests = [nextRequest, ...requests];
    setRequests(nextRequests);
    saveStoredMembershipRequests(nextRequests);
    insertMembershipRequest(nextRequest);
    setName("");
    setEmail("");
    setRequestPassword("");
    setMessage("");
    setSubmitMessageType("success");
    setSubmitMessage("Request sent. An administrator can review it from this page.");
  };

  const reviewMembershipRequest = (id, status) => {
    const reason = reviewReasons[id]?.trim() || (status === "Accepted" ? "Welcome to BUDS!" : "");
    if (!reason) {
      setReviewReasons((current) => ({ ...current, [id]: "Please add a reason before deciding." }));
      return;
    }

    const nextRequests = requests.map((request) => (
      request.id === id
        ? { ...request, status, reason, reviewed_at: new Date().toISOString() }
        : request
    ));
    setRequests(nextRequests);
    saveStoredMembershipRequests(nextRequests);
    updateMembershipRequestStatus(id, status, reason);
    const reviewedRequest = requests.find((request) => request.id === id);
    if (status === "Accepted" && reviewedRequest) {
      upsertMemberAccount({
        id: reviewedRequest.email,
        name: reviewedRequest.name,
        email: reviewedRequest.email,
        password: reviewedRequest.password,
        role: "member",
        status: "active",
        updated_at: new Date().toISOString(),
      });
    }
    setReviewReasons((current) => ({ ...current, [id]: "" }));
  };

  const removeMembershipRequest = (id) => {
    const nextRequests = requests.filter((request) => request.id !== id);
    setRequests(nextRequests);
    saveStoredMembershipRequests(nextRequests);
    deleteMembershipRequest(id);
  };

  return (
    <Page>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-[34rem] flex-col justify-between border border-[#9a0000] bg-[#CC0000] p-8 text-left text-white shadow-[0_20px_55px_rgba(45,41,38,0.14)] md:p-10">
          <div>
            <span className="inline-flex bg-[#2D2926] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              Join BUDS
            </span>
            <h1 className="mt-8 max-w-xl text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
              Request membership in the Boston University Debate Society.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/90">
              Send a quick request with your BU email. Administrators can review new members, accept or deny requests, and leave a decision reason.
            </p>
          </div>
          <div className="mt-10 grid gap-4 border border-white/40 bg-white p-6 text-[#2D2926]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 shrink-0 text-[#CC0000]" />
              <div>
                <p className="font-black uppercase tracking-[0.12em] text-[#CC0000]">Practice</p>
                <p className="mt-2 text-base font-bold leading-7 text-[#2D2926]">Mondays and Wednesdays, 7-8 PM</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[#5b5450]">SAR 101. Beginners are welcome.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-t-8 border-t-[#CC0000] p-8 md:p-10">
          <Eyebrow>Membership Request</Eyebrow>
          <form onSubmit={submitMembershipRequest} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              BU Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@bu.edu"
                required
                className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              Choose Password
              <input
                type="password"
                value={requestPassword}
                onChange={(event) => setRequestPassword(event.target.value)}
                minLength={6}
                required
                className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
              <span className="text-xs font-bold normal-case tracking-normal text-[#8f8781]">At least 6 characters. This is what you will use to log in if accepted.</span>
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              <span>
                Why do you want to join? <span className="text-xs font-bold text-[#9b948e]">Optional</span>
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={5}
                placeholder="Share anything you want us to know."
                className="resize-none border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
            </label>
            {submitMessage && (
              <p className={`border-l-4 px-4 py-3 text-sm font-bold ${
                submitMessageType === "success"
                  ? "border-[#0b6b35] bg-[#e5f7ec] text-[#0b6b35]"
                  : "border-[#CC0000] bg-[#fff1f1] text-[#8a0000]"
              }`}
              >
                {submitMessage}
              </p>
            )}
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
              Submit request <ArrowRight size={16} />
            </button>
          </form>
        </Card>
      </div>

      {isAdmin && (
        <Card className="mt-6">
          <div className="flex flex-col gap-2 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Administrator</Eyebrow>
              <h2 className="mt-2 text-3xl font-black text-[#2D2926]">Membership requests</h2>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-[#6d6560]">{requests.length} total</p>
          </div>
          <div className="mt-5 grid gap-4">
            {requests.length === 0 && (
              <div className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] p-5 text-sm font-bold text-[#5b5450]">
                No membership requests yet.
              </div>
            )}
            {requests.map((request) => {
              const hasDecision = request.status === "Accepted" || request.status === "Denied";
              return (
                <div key={request.id} className={`relative grid gap-4 border p-5 pr-14 lg:grid-cols-[1fr_0.95fr] ${hasDecision ? "border-[#a9a29c] bg-[#d4d0cc] opacity-90" : "border-[#ded8d2] bg-white"}`}>
                  <button
                    type="button"
                    onClick={() => removeMembershipRequest(request.id)}
                    aria-label={`Delete request from ${request.name}`}
                    className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-[#bdb6b0] bg-white/80 text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-[#2D2926]">{request.name}</h3>
                      <span className={`px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] ${request.status === "Accepted" ? "bg-[#e5f7ec] text-[#0b6b35]" : request.status === "Denied" ? "bg-[#fff1f1] text-[#8a0000]" : "bg-[#f6f4f2] text-[#6d6560]"}`}>
                        {MEMBERSHIP_REQUEST_STATUSES.includes(request.status) ? request.status : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#6d6560]">{request.email}</p>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#5b5450]">{request.message || "No optional note added."}</p>
                    {request.reason && <p className="mt-4 border-l-4 border-[#CC0000] bg-[#f6f4f2] px-4 py-3 text-sm font-bold text-[#2D2926]">Reason: {request.reason}</p>}
                  </div>
                  <div className="grid gap-3">
                    <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                      Decision reason
                      <textarea
                        value={reviewReasons[request.id] ?? ""}
                        onChange={(event) => setReviewReasons((current) => ({ ...current, [request.id]: event.target.value }))}
                        rows={4}
                        placeholder="Defaults to Welcome to BUDS! when accepting"
                        className="resize-none border border-[#ded8d2] bg-[#f6f4f2] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                      />
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button type="button" onClick={() => reviewMembershipRequest(request.id, "Accepted")} className="flex-1 bg-[#2D2926] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white">
                        Accept
                      </button>
                      <button type="button" onClick={() => reviewMembershipRequest(request.id, "Denied")} className="flex-1 bg-[#CC0000] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white">
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </Page>
  );
}

function LoginPage({ onLogin }) {
  const [loginType, setLoginType] = useState("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isBuEmail = /@([a-z0-9-]+\.)?bu\.edu$/.test(normalizedEmail);
    const isAdminLogin = normalizedEmail === MASTER_EBOARD_EMAIL && password === MASTER_EBOARD_PASSWORD;
    const isSecondaryEboardLogin = normalizedEmail === SECONDARY_EBOARD_EMAIL && password === MASTER_EBOARD_PASSWORD;
    const isSpecialLogin = isAdminLogin || isSecondaryEboardLogin;
    const hasValidRolePassword = password === (loginType === "eboard" ? EBOARD_PASSWORD : MEMBER_PASSWORD);

    if (normalizedEmail === MASTER_EBOARD_EMAIL && !isAdminLogin) {
      setError("The administrator account must use the administrator password.");
      return;
    }

    if (!isAdminLogin && !isSecondaryEboardLogin) {
      const existingAccount = await findMemberAccountByEmail(normalizedEmail);
      if (existingAccount) {
        if (existingAccount.status === "revoked") {
          setError("This membership has been revoked. Contact BUDS if this is a mistake.");
          return;
        }

        if (existingAccount.password !== password) {
          setError("Incorrect account password.");
          return;
        }

        const auth = { role: existingAccount.role, email: existingAccount.email, name: existingAccount.name, accountId: existingAccount.id };
        saveStoredAuth(auth);
        onLogin(auth);
        navigateTo("/hub");
        return;
      }

      const account = await findMemberAccount(normalizedEmail, password);
      if (account) {
        const auth = { role: account.role, email: account.email, name: account.name, accountId: account.id };
        saveStoredAuth(auth);
        onLogin(auth);
        navigateTo("/hub");
        return;
      }
    }

    if (!isBuEmail && !isSpecialLogin) {
      setError("Please use a BU email address ending in bu.edu.");
      return;
    }

    if (!isSpecialLogin && !hasValidRolePassword) {
      setError(`Incorrect ${loginType === "eboard" ? "e-board" : "member"} password.`);
      return;
    }

    const auth = { role: isAdminLogin ? ADMIN_ROLE : isSecondaryEboardLogin ? "eboard" : loginType, email: normalizedEmail };
    saveStoredAuth(auth);
    onLogin(auth);
    navigateTo("/hub");
  };

  return (
    <Page>
      <PageHeader eyebrow="Private Login" title="Choose your BUDS access level.">
        Members unlock private team resources. E-board unlocks the same member hub plus the e-board workspace.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-[#2D2926] p-8 text-white">
          <Eyebrow light>Private Access</Eyebrow>
          <p className="mt-5 text-lg leading-8 text-white/78">
            Accepted members can log in with the password they chose on the join form. E-board accounts can be promoted from the administrator Members tab.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Administrator login: <span className="font-black text-white">{MASTER_EBOARD_EMAIL}</span> with password <span className="font-black text-white">{MASTER_EBOARD_PASSWORD}</span>. Legacy shared passwords are still available for setup: <span className="font-black text-white">{MEMBER_PASSWORD}</span> and <span className="font-black text-white">{EBOARD_PASSWORD}</span>.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Real privacy should be connected to a backend auth service before storing actual team documents, budgets, or notes.
          </p>
        </Card>

        <Card className="p-8">
          <div className="mb-6 grid grid-cols-2 border border-[#ded8d2] bg-[#f6f4f2] p-1">
            {[
              { id: "member", label: "Member Login" },
              { id: "eboard", label: "E-Board Login" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setLoginType(option.id);
                  setError("");
                  setPassword("");
                }}
                className={`px-4 py-3 text-sm font-black uppercase tracking-[0.08em] ${
                  loginType === option.id ? "bg-[#CC0000] text-white" : "text-[#2D2926]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              BU Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@bu.edu"
                required
                className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
            </label>
            {error && <p className="border-l-4 border-[#CC0000] bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#8a0000]">{error}</p>}
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
              Log in <Lock size={16} />
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
}

function PrivateHubPage({ auth, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => (auth?.role === "eboard" || auth?.role === ADMIN_ROLE ? "eboard" : "member"));
  const [notes, setNotes] = useState(() => getStoredNotes());
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [agenda, setAgenda] = useState(() => getStoredAgenda());
  const [lastDeletedAgendaItem, setLastDeletedAgendaItem] = useState(null);
  const [newAgendaText, setNewAgendaText] = useState("");
  const [newAgendaOwner, setNewAgendaOwner] = useState("");
  const [newAgendaDue, setNewAgendaDue] = useState("");
  const [agendaCompleteFlash, setAgendaCompleteFlash] = useState(false);
  const [budget, setBudget] = useState(() => getStoredBudget());
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newRevenueCategory, setNewRevenueCategory] = useState("");
  const [newRevenueAmount, setNewRevenueAmount] = useState("");
  const [memberLinks, setMemberLinks] = useState(() => getStoredPrivateLinks());
  const [memberAccounts, setMemberAccounts] = useState(() => getStoredMemberAccounts());

  const isAdmin = auth?.email === MASTER_EBOARD_EMAIL || auth?.role === ADMIN_ROLE;
  const isEboard = auth?.role === "eboard" || isAdmin;
  const canEdit = isAdmin;
  const visibleTab = isEboard ? activeTab : "member";
  const sortedNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const selectedNote = sortedNotes.find((note) => note.id === selectedNoteId) ?? sortedNotes[0];
  const totalSpent = budget.rows.reduce((sum, row) => sum + (Number(row.spent) || 0), 0);
  const totalAllocated = budget.rows.reduce((sum, row) => sum + (Number(row.allocated) || 0), 0);
  const totalRevenue = budget.revenueRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const effectiveBudget = (Number(budget.total) || 0) + totalRevenue;
  const remainingBudget = effectiveBudget - totalSpent;
  const memberLinksBySection = privateLinkSections.map((section) => ({
    section,
    links: memberLinks.filter((link) => link.section === section),
  })).filter((group) => group.links.length > 0);

  useEffect(() => {
    let ignore = false;

    async function hydrateFromDatabase() {
      const databaseState = await loadDatabaseState();
      if (!databaseState || ignore) return;

      setAgenda(databaseState.agenda);
      setNotes(databaseState.notes);
      setBudget(databaseState.budget);
      setMemberLinks(databaseState.privateLinks);
      saveStoredAgenda(databaseState.agenda);
      saveStoredNotes(databaseState.notes);
      saveStoredBudget(databaseState.budget);
      saveStoredPrivateLinks(databaseState.privateLinks);
    }

    hydrateFromDatabase();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function hydrateMemberAccounts() {
      const databaseAccounts = await loadMemberAccounts();
      if (!databaseAccounts || ignore) return;
      setMemberAccounts(databaseAccounts);
      saveStoredMemberAccounts(databaseAccounts);
    }

    if (isAdmin) hydrateMemberAccounts();

    return () => {
      ignore = true;
    };
  }, [isAdmin]);

  if (!auth) {
    return (
      <Page>
        <Card className="mx-auto max-w-2xl text-center">
          <Eyebrow>Login required</Eyebrow>
          <h1 className="mt-4 text-4xl font-black text-[#2D2926]">Please log in to view the private BUDS hub.</h1>
          <PrimaryButton href="/login" className="mt-8">
            Go to login <ArrowRight size={16} />
          </PrimaryButton>
        </Card>
      </Page>
    );
  }

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    const nextNote = {
      id: `${meetingDate}-${Date.now()}`,
      date: meetingDate,
      title: meetingTitle.trim(),
      body: meetingNotes.trim(),
    };
    const nextNotes = [nextNote, ...notes];
    setNotes(nextNotes);
    saveStoredNotes(nextNotes);
    insertNote(nextNote);
    setSelectedNoteId(nextNote.id);
    setMeetingDate("");
    setMeetingTitle("");
    setMeetingNotes("");
  };

  const handleAgendaSubmit = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    const text = newAgendaText.trim();
    if (!text) return;

    const nextAgendaItem = {
      id: `agenda-${Date.now()}`,
      text,
      owner: newAgendaOwner.trim() || "Unassigned",
      due: newAgendaDue || "Add date",
      completed_at: null,
    };
    const nextAgenda = [nextAgendaItem, ...agenda];

    setAgenda(nextAgenda);
    saveStoredAgenda(nextAgenda);
    upsertAgendaItem(nextAgendaItem);
    setNewAgendaText("");
    setNewAgendaOwner("");
    setNewAgendaDue("");
  };

  const completeAgendaItem = (item) => {
    if (!canEdit) return;
    const completed_at = item.completed_at ? null : new Date().toISOString();
    const updatedItem = { ...item, completed_at };
    const nextAgenda = agenda.map((agendaItem) => (
      agendaItem.id === item.id ? updatedItem : agendaItem
    ));
    setLastDeletedAgendaItem(completed_at ? item : null);
    setAgenda(nextAgenda);
    saveStoredAgenda(nextAgenda);
    upsertAgendaItem(updatedItem);
    if (completed_at) {
      setAgendaCompleteFlash(true);
      window.setTimeout(() => setAgendaCompleteFlash(false), 1000);
    }
  };

  const undoAgendaDelete = () => {
    if (!canEdit) return;
    if (!lastDeletedAgendaItem) return;
    const restoredItem = { ...lastDeletedAgendaItem, completed_at: null };
    const nextAgenda = agenda.map((agendaItem) => (
      agendaItem.id === restoredItem.id ? restoredItem : agendaItem
    ));
    setAgenda(nextAgenda);
    saveStoredAgenda(nextAgenda);
    upsertAgendaItem(restoredItem);
    setLastDeletedAgendaItem(null);
  };

  const updateBudget = (nextBudget) => {
    setBudget(nextBudget);
    saveStoredBudget(nextBudget);
  };

  const updateBudgetTotal = (total) => {
    if (!canEdit) return;
    const nextBudget = { ...budget, total };
    updateBudget(nextBudget);
    upsertBudgetSettings(total);
  };

  const updateBudgetRow = (id, field, value) => {
    if (!canEdit) return;
    if (field === "status" && value === "Denied") {
      deleteBudgetRow(id);
      updateBudget({
        ...budget,
        rows: budget.rows.filter((row) => row.id !== id),
      });
      return;
    }

    const nextBudget = {
      ...budget,
      rows: budget.rows.map((row) => (
        row.id === id
          ? { ...row, [field]: field === "allocated" || field === "spent" ? Number(value) : value }
          : row
      )),
    };
    updateBudget(nextBudget);
    const updatedRow = nextBudget.rows.find((row) => row.id === id);
    if (updatedRow) upsertBudgetRow(updatedRow);
  };

  const addBudgetRow = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    const category = newBudgetCategory.trim();
    if (!category) return;

    const nextRow = { id: `budget-${Date.now()}`, category, allocated: 0, spent: 0, status: "On Hold" };
    updateBudget({
      ...budget,
      rows: [
        ...budget.rows,
        nextRow,
      ],
    });
    upsertBudgetRow(nextRow);
    setNewBudgetCategory("");
  };

  const addBudgetRevenueRow = (event) => {
    event.preventDefault();
    if (!canEdit) return;
    const category = newRevenueCategory.trim();
    const amount = Number(newRevenueAmount);
    if (!category || amount <= 0) return;

    const nextRow = { id: `revenue-${Date.now()}`, category, amount };
    const nextBudget = {
      ...budget,
      revenueRows: [
        ...(budget.revenueRows || []),
        nextRow,
      ],
    };
    updateBudget(nextBudget);
    upsertBudgetRevenueRow(nextRow);
    setNewRevenueCategory("");
    setNewRevenueAmount("");
  };

  const removeBudgetRevenueRow = (id) => {
    if (!canEdit) return;
    const nextBudget = {
      ...budget,
      revenueRows: (budget.revenueRows || []).filter((row) => row.id !== id),
    };
    updateBudget(nextBudget);
    deleteBudgetRevenueRow(id);
  };

  const updateMemberLink = (id, field, value) => {
    if (!canEdit) return;
    const nextLinks = memberLinks.map((link) => (
      link.id === id ? { ...link, [field]: value } : link
    ));
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    const updatedLink = nextLinks.find((link) => link.id === id);
    if (updatedLink) upsertPrivateLink(updatedLink);
  };

  const updateMemberStatus = (id, role) => {
    if (!isAdmin) return;
    const nextAccounts = memberAccounts.map((account) => (
      account.id === id ? { ...account, role, updated_at: new Date().toISOString() } : account
    ));
    setMemberAccounts(nextAccounts);
    saveStoredMemberAccounts(nextAccounts);
    updateMemberAccountRole(id, role);
  };

  const revokeMember = (id) => {
    if (!isAdmin) return;
    const nextAccounts = memberAccounts.map((account) => (
      account.id === id ? { ...account, status: "revoked", updated_at: new Date().toISOString() } : account
    ));
    setMemberAccounts(nextAccounts);
    saveStoredMemberAccounts(nextAccounts);
    revokeMemberAccount(id);
  };

  return (
    <Page className={isEboard ? "max-w-[98rem] py-4 md:py-5" : ""}>
      <div className="mb-3 flex flex-col gap-3 border-b-4 border-[#CC0000] bg-white p-3 shadow-[0_16px_45px_rgba(45,41,38,0.08)] md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow>Private Hub</Eyebrow>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#2D2926] md:text-3xl">
            {isEboard ? "E-Board Workspace" : "Member Resources"}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-[#6d6560]">{auth.email}</p>
            {isAdmin && (
              <span className="bg-[#2D2926] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-white">
                Administrator
              </span>
            )}
            <span className={`px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] ${isSupabaseConfigured ? "bg-[#e5f7ec] text-[#0b6b35]" : "bg-[#fff1f1] text-[#8a0000]"}`}>
              {isSupabaseConfigured ? "Database connected" : "Local storage mode"}
            </span>
          </div>
        </div>
        <button onClick={onLogout} className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f6f4f2] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
          Log out <LogOut size={16} />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("member")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] ${visibleTab === "member" ? "bg-[#2D2926] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
        >
          Member Resources
        </button>
        {isEboard && (
          <button
            type="button"
            onClick={() => setActiveTab("eboard")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] ${visibleTab === "eboard" ? "bg-[#CC0000] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
          >
            E-Board Workspace
          </button>
        )}
        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] ${visibleTab === "members" ? "bg-[#2D2926] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
          >
            Members
          </button>
        )}
      </div>

      {visibleTab === "member" && (
        <div>
          <PageHeader eyebrow="Members Only" title="Private BUDS links and debate resources.">
            Use these team documents, forms, calendars, and APDA guides throughout the season.
          </PageHeader>
          <div className="grid gap-7">
            {memberLinksBySection.map((group) => (
              <section key={group.section} className="grid gap-3">
                <div className="flex items-center justify-between border-b-2 border-[#CC0000] pb-2">
                  <h2 className="text-xl font-black text-[#2D2926]">{group.section}</h2>
                  <span className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">{group.links.length} links</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {group.links.map((link) => (
                    <div key={link.id} className="group flex min-h-[25rem] flex-col border border-[#ded8d2] bg-white p-7 shadow-[0_20px_55px_rgba(45,41,38,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(45,41,38,0.12)]">
                      <div className="mb-10">
                        <span className="inline-flex bg-[#CC0000] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                          {group.section === "Debater Resources" ? "Resource" : "Team Link"}
                        </span>
                      </div>
                      {canEdit ? (
                        <>
                          <label className="grid gap-2">
                            <span className="sr-only">Link Name</span>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(event) => updateMemberLink(link.id, "label", event.target.value)}
                              className="w-full border-0 bg-transparent p-0 text-3xl font-black tracking-normal text-[#2D2926] outline-none focus:text-[#CC0000]"
                            />
                          </label>
                          <label className="mt-6 grid flex-1 gap-2">
                            <span className="sr-only">Description</span>
                            <textarea
                              value={link.description}
                              onChange={(event) => updateMemberLink(link.id, "description", event.target.value)}
                              rows={5}
                              className="h-full min-h-32 resize-none border-0 bg-transparent p-0 text-lg font-medium leading-8 tracking-normal text-[#5b5450] outline-none focus:text-[#2D2926]"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <h3 className="text-3xl font-black tracking-normal text-[#2D2926]">{link.label}</h3>
                          <p className="mt-6 flex-1 text-lg font-medium leading-8 text-[#5b5450]">{link.description}</p>
                        </>
                      )}
                      <div className="mt-7 grid gap-4">
                        <a href={link.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-base font-black uppercase tracking-[0.18em] text-[#CC0000]">
                          Open link <ChevronRight className="transition group-hover:translate-x-1" size={20} />
                        </a>
                        {canEdit && (
                          <label className="grid gap-2 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#8f8781]">
                            Edit URL
                            <input
                              type="url"
                              value={link.url}
                              onChange={(event) => updateMemberLink(link.id, "url", event.target.value)}
                              placeholder="https://..."
                              className="border border-[#ded8d2] bg-[#f6f4f2] px-3 py-2 text-xs font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {visibleTab === "members" && isAdmin && (
        <Card className="p-5">
          <div className="flex flex-col gap-2 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Administrator</Eyebrow>
              <h2 className="mt-2 text-3xl font-black text-[#2D2926]">Member Accounts</h2>
              <p className="mt-2 text-sm leading-6 text-[#5b5450]">Change account status between member and e-board, or revoke membership access.</p>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.08em] text-[#6d6560]">{memberAccounts.length} accounts</p>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead className="bg-[#2D2926] text-white">
                <tr>
                  <th className="px-4 py-3 font-black">Name</th>
                  <th className="px-4 py-3 font-black">Email</th>
                  <th className="px-4 py-3 font-black">Status</th>
                  <th className="px-4 py-3 font-black">Role</th>
                  <th className="px-4 py-3 font-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {memberAccounts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] px-4 py-6 text-center font-bold text-[#5b5450]">
                      No accepted member accounts yet.
                    </td>
                  </tr>
                )}
                {memberAccounts.map((account) => (
                  <tr key={account.id} className={`${account.status === "revoked" ? "bg-[#d4d0cc] opacity-80" : "bg-white"} border-b border-[#ded8d2]`}>
                    <td className="px-4 py-3 font-black text-[#2D2926]">{account.name}</td>
                    <td className="px-4 py-3 font-semibold text-[#5b5450]">{account.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-black uppercase tracking-[0.08em] ${account.status === "revoked" ? "bg-[#2D2926] text-white" : "bg-[#e5f7ec] text-[#0b6b35]"}`}>
                        {account.status === "revoked" ? "Revoked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={MEMBER_ACCOUNT_ROLES.includes(account.role) ? account.role : "member"}
                        onChange={(event) => updateMemberStatus(account.id, event.target.value)}
                        disabled={account.status === "revoked"}
                        className="border border-[#ded8d2] bg-[#f6f4f2] px-3 py-2 font-bold uppercase tracking-[0.08em] text-[#CC0000] outline-none focus:border-[#CC0000] disabled:opacity-50"
                      >
                        <option value="member">Member</option>
                        <option value="eboard">E-Board</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => revokeMember(account.id)}
                        disabled={account.status === "revoked"}
                        className="inline-flex items-center gap-2 bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:bg-[#8f8781]"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {visibleTab === "eboard" && isEboard && (
        <div className="grid gap-5">
          <div className="grid gap-5 xl:grid-cols-2">
            <Card className="relative flex min-h-[34rem] flex-col p-5">
              <div className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 bg-[#2D2926] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white transition duration-700 ${agendaCompleteFlash ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
                Checked off
              </div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ClipboardList className="text-[#CC0000]" />
                  <h2 className="text-xl font-black text-[#2D2926]">Agenda + Accountability</h2>
                </div>
                <button
                  type="button"
                  onClick={undoAgendaDelete}
                  disabled={!canEdit || !lastDeletedAgendaItem}
                  className="border border-[#ded8d2] bg-[#f6f4f2] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Undo
                </button>
              </div>

              <form onSubmit={handleAgendaSubmit} className="mb-4 grid gap-2">
                <fieldset disabled={!canEdit} className="grid gap-2 disabled:opacity-55">
                  <input
                    type="text"
                    value={newAgendaText}
                    onChange={(event) => setNewAgendaText(event.target.value)}
                    placeholder={canEdit ? "Add agenda item or accountability task" : "Administrator-only editing"}
                    className="border border-[#ded8d2] px-3 py-2 text-sm font-medium outline-none focus:border-[#CC0000]"
                  />
                  <div className="grid gap-2 sm:grid-cols-[1fr_0.75fr_auto]">
                    <input
                      type="text"
                      value={newAgendaOwner}
                      onChange={(event) => setNewAgendaOwner(event.target.value)}
                      placeholder="Owner"
                      className="border border-[#ded8d2] px-3 py-2 text-sm font-medium outline-none focus:border-[#CC0000]"
                    />
                    <input
                      type="date"
                      value={newAgendaDue}
                      onChange={(event) => setNewAgendaDue(event.target.value)}
                      className="border border-[#ded8d2] px-3 py-2 text-sm font-medium outline-none focus:border-[#CC0000]"
                    />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed">
                      Add
                    </button>
                  </div>
                </fieldset>
              </form>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="grid gap-2">
                  {agenda.length === 0 && (
                    <div className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] p-4 text-sm font-bold text-[#5b5450]">
                      No agenda items right now. Add one above.
                    </div>
                  )}
                  {agenda.map((item) => {
                    const isComplete = Boolean(item.completed_at);
                    return (
                      <label key={item.id} className={`flex gap-3 border p-3 transition ${isComplete ? "border-[#c9c2bc] bg-[#d4d0cc] opacity-80" : "border-[#ded8d2] bg-[#f6f4f2]"}`}>
                        <input
                          type="checkbox"
                          checked={isComplete}
                          onChange={() => completeAgendaItem(item)}
                          disabled={!canEdit}
                          className="mt-1 h-4 w-4 shrink-0 accent-[#CC0000]"
                        />
                        <span className="min-w-0">
                          <span className={`block font-black leading-snug ${isComplete ? "text-[#5b5450] line-through" : "text-[#2D2926]"}`}>{item.text}</span>
                          <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.08em] text-[#6d6560]">
                            {item.owner || "Unassigned"} - Due: {item.due || "Add date"}
                          </span>
                          {isComplete && (
                            <span className="mt-1 block text-xs font-bold text-[#6d6560]">
                              Completed {new Date(item.completed_at).toLocaleDateString()} - can be unchecked for 2 weeks.
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card className="flex min-h-[34rem] flex-col p-5">
              <div className="mb-4 flex items-center gap-3">
                <DollarSign className="text-[#CC0000]" />
                <h2 className="text-xl font-black text-[#2D2926]">Budget Tracker</h2>
              </div>
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1 bg-[#2D2926] p-3 text-white">
                  <span className="text-xs font-black uppercase tracking-[0.08em] text-white/70">Base Budget</span>
                  <input
                    type="number"
                    min="0"
                    value={budget.total}
                    onChange={(event) => updateBudgetTotal(Number(event.target.value))}
                    disabled={!canEdit}
                    className="w-full bg-transparent text-2xl font-black outline-none disabled:opacity-70"
                  />
                </label>
                <div className="bg-[#f6f4f2] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">Revenue</p>
                  <p className="mt-1 text-2xl font-black text-[#0b6b35]">+{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-[#f6f4f2] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">Effective Total</p>
                  <p className="mt-1 text-2xl font-black text-[#2D2926]">{formatCurrency(effectiveBudget)}</p>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto pr-1">
                <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-[#2D2926] text-white">
                    <tr>
                      <th className="px-3 py-2 font-black">Category</th>
                      <th className="px-3 py-2 font-black">Allocated</th>
                      <th className="px-3 py-2 font-black">Spent</th>
                      <th className="px-3 py-2 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.rows.map((row) => (
                      <tr key={row.id} className="border-b border-[#ded8d2] bg-white">
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.category}
                            onChange={(event) => updateBudgetRow(row.id, "category", event.target.value)}
                            disabled={!canEdit}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 font-bold text-[#2D2926] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            value={row.allocated}
                            onChange={(event) => updateBudgetRow(row.id, "allocated", event.target.value)}
                            disabled={!canEdit}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 text-[#5b5450] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            value={row.spent}
                            onChange={(event) => updateBudgetRow(row.id, "spent", event.target.value)}
                            disabled={!canEdit}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 text-[#5b5450] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <select
                            value={BUDGET_STATUSES.includes(row.status) ? row.status : "On Hold"}
                            onChange={(event) => updateBudgetRow(row.id, "status", event.target.value)}
                            disabled={!canEdit}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 font-bold text-[#CC0000] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          >
                            {BUDGET_STATUSES.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <form onSubmit={addBudgetRow} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newBudgetCategory}
                  onChange={(event) => setNewBudgetCategory(event.target.value)}
                  placeholder={canEdit ? "New budget category" : "Administrator-only editing"}
                  disabled={!canEdit}
                  className="min-w-0 flex-1 border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                />
                <button type="submit" disabled={!canEdit} className="bg-[#CC0000] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-40">
                  Add
                </button>
              </form>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[#6d6560]">
                Allocated total: {formatCurrency(totalAllocated)} | Spent: {formatCurrency(totalSpent)} | Remaining: {formatCurrency(remainingBudget)}
              </p>
              <div className="mt-4 border-t border-[#ded8d2] pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">Revenue Additions</h3>
                  <span className="text-sm font-black text-[#0b6b35]">+{formatCurrency(totalRevenue)}</span>
                </div>
                <form onSubmit={addBudgetRevenueRow} className="grid gap-2 sm:grid-cols-[1fr_8rem_auto]">
                  <input
                    type="text"
                    value={newRevenueCategory}
                    onChange={(event) => setNewRevenueCategory(event.target.value)}
                    placeholder={canEdit ? "Revenue category, e.g. Hosted tournament" : "Administrator-only editing"}
                    disabled={!canEdit}
                    className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                  />
                  <input
                    type="number"
                    min="0"
                    value={newRevenueAmount}
                    onChange={(event) => setNewRevenueAmount(event.target.value)}
                    placeholder="Amount"
                    disabled={!canEdit}
                    className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                  />
                  <button type="submit" disabled={!canEdit} className="bg-[#0b6b35] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-40">
                    Add Money
                  </button>
                </form>
                <div className="mt-3 grid gap-2">
                  {(budget.revenueRows || []).length === 0 && (
                    <div className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] p-3 text-sm font-bold text-[#5b5450]">
                      No revenue logged yet.
                    </div>
                  )}
                  {(budget.revenueRows || []).map((row) => (
                    <div key={row.id} className="flex items-center justify-between gap-3 border border-[#ded8d2] bg-[#e5f7ec] px-3 py-2">
                      <div className="min-w-0">
                        <p className="font-black text-[#2D2926]">{row.category}</p>
                        <p className="text-sm font-bold text-[#0b6b35]">+{formatCurrency(row.amount)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBudgetRevenueRow(row.id)}
                        disabled={!canEdit}
                        aria-label={`Remove ${row.category} revenue`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#b7d9c4] bg-white text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid">
            <Card className="flex min-h-0 flex-col p-5">
              <div className="mb-5 flex items-center gap-3">
                <FileText className="text-[#CC0000]" />
                <h2 className="text-xl font-black text-[#2D2926]">Secretary Meeting Notes</h2>
              </div>
              <form onSubmit={handleNoteSubmit} className="grid gap-4">
                <fieldset disabled={!canEdit} className="grid gap-4 disabled:opacity-55">
                  <div className="grid gap-4 md:grid-cols-[0.6fr_1fr]">
                    <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                      Meeting Date
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(event) => setMeetingDate(event.target.value)}
                        required
                        className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                      Brief Title
                      <input
                        type="text"
                        value={meetingTitle}
                        onChange={(event) => setMeetingTitle(event.target.value)}
                        required
                        placeholder={canEdit ? "Budget approvals and novice outreach" : "Administrator-only editing"}
                        className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                      />
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                    Notes
                    <textarea
                      value={meetingNotes}
                      onChange={(event) => setMeetingNotes(event.target.value)}
                      rows={5}
                      placeholder={canEdit ? "Type meeting minutes, decisions, votes, next steps, and owner assignments here." : "Administrator-only editing"}
                      className="resize-none border border-[#ded8d2] px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000] xl:h-[9rem]"
                    />
                  </label>
                  <button type="submit" disabled={!canEdit} className="w-fit bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000] disabled:cursor-not-allowed disabled:opacity-40">
                    Save Notes
                  </button>
                </fieldset>
              </form>

              <div className="mt-4 min-h-0 flex-1 border-t border-[#ded8d2] pt-4">
                <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                  Past E-Board Notes
                  <select
                    value={selectedNote?.id ?? ""}
                    onChange={(event) => setSelectedNoteId(event.target.value)}
                    className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                  >
                    {sortedNotes.length === 0 && <option>No saved notes yet</option>}
                    {sortedNotes.map((note) => (
                      <option key={note.id} value={note.id}>{note.date} - {note.title}</option>
                    ))}
                  </select>
                </label>
                {selectedNote && (
                  <div className="mt-3 max-h-[11rem] overflow-y-auto border border-[#ded8d2] bg-[#f6f4f2] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">{selectedNote.date}</p>
                    <h3 className="mt-2 text-xl font-black text-[#2D2926]">{selectedNote.title}</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5b5450]">{selectedNote.body || "No notes body added."}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </Page>
  );
}

function NotFoundPage() {
  return (
    <Page>
      <Card className="mx-auto max-w-2xl text-center">
        <Eyebrow>Page not found</Eyebrow>
        <h1 className="mt-4 text-4xl font-black text-[#2D2926]">That page is not part of BUDS yet.</h1>
        <PrimaryButton href="/" className="mt-8">
          Back home <ArrowRight size={16} />
        </PrimaryButton>
      </Card>
    </Page>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  const [auth, setAuth] = useState(() => getStoredAuth());

  const calendarEmbedUrl = useMemo(() => {
    return "https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID_HERE&ctz=America%2FNew_York";
  }, []);

  useEffect(() => {
    const updatePath = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  const page = useMemo(() => {
    switch (path) {
      case "/":
        return <HomePage />;
      case "/about":
        return <AboutPage />;
      case "/novice-hub":
        return <NoviceHubPage />;
      case "/calendar":
        return <CalendarPage calendarEmbedUrl={calendarEmbedUrl} />;
      case "/history":
        return <HistoryPage />;
      case "/eboard":
        return <EBoardPage />;
      case "/contact":
        return <ContactPage />;
      case "/join":
        return <JoinPage auth={auth} />;
      case "/login":
        return <LoginPage onLogin={setAuth} />;
      case "/hub":
        return <PrivateHubPage auth={auth} onLogout={() => {
          clearStoredAuth();
          setAuth(null);
          navigateTo("/login");
        }} />;
      default:
        return <NotFoundPage />;
    }
  }, [auth, calendarEmbedUrl, path]);

  return (
    <main className="min-h-screen bg-[#f6f4f2] text-[#2D2926]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(45,41,38,0.045)_1px,transparent_1px),linear-gradient(rgba(45,41,38,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <header className="sticky top-0 z-50 border-b border-[#e9e3dd] bg-white/90 shadow-[0_14px_40px_rgba(45,41,38,0.05)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 md:px-8">
          <SiteLink href="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-[#CC0000] text-base font-black text-white transition group-hover:bg-[#A00000]">
              BU
            </div>
            <div className="min-w-0 border-l border-[#ded8d2] pl-3">
              <p className="text-base font-black uppercase leading-none tracking-[0.18em] text-[#2D2926]">BUDS</p>
              <p className="mt-1 hidden truncate text-sm font-medium text-[#6d6560] sm:block">Boston University Debate Society</p>
            </div>
          </SiteLink>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = item.href === path;
              return (
                <SiteLink
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                    active
                      ? "bg-[#2D2926] text-white shadow-[0_8px_18px_rgba(45,41,38,0.16)]"
                      : "text-[#4b4541] hover:bg-white hover:text-[#2D2926] hover:shadow-sm"
                  }`}
                >
                  {item.label}
                </SiteLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <PrimaryButton href="/join" className="rounded-sm px-6">
              Join <ArrowRight size={16} />
            </PrimaryButton>
            <SecondaryButton href={auth ? "/hub" : "/login"} className="rounded-sm bg-[#fbfaf9] px-6">
              {auth ? "Hub" : "Login"}
            </SecondaryButton>
          </div>

          <button className="rounded-sm border border-[#ded8d2] bg-white p-3 shadow-sm md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#2D2926]/45 p-4 backdrop-blur-sm md:hidden">
          <div className="overflow-hidden rounded-sm border border-[#ded8d2] bg-white shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3 px-5 pt-5">
                <div className="flex h-11 w-11 items-center justify-center bg-[#CC0000] text-sm font-black text-white">BU</div>
                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-[#2D2926]">BUDS</p>
                  <p className="text-xs font-semibold text-[#6d6560]">Menu</p>
                </div>
              </div>
              <button className="mr-5 mt-5 border border-[#ded8d2] p-2" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
            </div>
            <div className="grid gap-2 px-5 pb-5">
              {navItems.map((item) => {
                const active = item.href === path;
                return (
                  <SiteLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 font-black ${active ? "bg-[#2D2926] text-white" : "bg-[#f6f4f2] text-[#2D2926]"}`}
                  >
                    {item.label}
                  </SiteLink>
                );
              })}
              <SiteLink
                href="/join"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-between bg-[#CC0000] px-4 py-3 font-black uppercase tracking-[0.08em] text-white"
              >
                Join <ArrowRight size={16} />
              </SiteLink>
              <SiteLink
                href={auth ? "/hub" : "/login"}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 font-black ${path === "/login" || path === "/hub" ? "bg-[#2D2926] text-white" : "bg-[#f6f4f2] text-[#2D2926]"}`}
              >
                {auth ? "Private Hub" : "Login"}
              </SiteLink>
            </div>
          </div>
        </div>
      )}

      {page}
    </main>
  );
}
