import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bold,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  DollarSign,
  ExternalLink,
  FileText,
  Gavel,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Medal,
  Menu,
  Mic2,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  Underline,
  Upload,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { PhotoCarousel } from "./components/PhotoCarousel";
import {
  Card,
  Eyebrow,
  MemberLinkTitle,
  Page,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  SiteLink,
} from "./components/ui";
import {
  ADMIN_ROLE,
  BUDGET_STATUSES,
  MEMBER_ACCOUNT_ROLES,
  MEMBER_MANAGER_EMAILS,
  MEMBERSHIP_REQUEST_STATUSES,
  RESERVED_ACCOUNT_EMAILS,
} from "./data/config";
import {
  apdaSourceUrl,
  getPrivateLinkSection,
  navItems,
  noviceResources,
  privateLinkSections,
} from "./data/content";
import { formatCurrency, formatMeetingDate, getMemberLinkTitleValue, sortMeetingPosts } from "./lib/formatters";
import { navigateTo } from "./lib/navigation";
import {
  deleteAgendaItem,
  deleteBudgetRevenueRow,
  deleteBudgetRow,
  deleteMemberAccount,
  deleteMembershipRequest,
  deleteNote,
  findMemberAccount,
  findMemberAccountByEmail,
  insertMembershipRequest,
  insertNote,
  loadEboardContent,
  loadMeetingsContent,
  loadDatabaseState,
  loadMemberAccounts,
  loadMembershipRequests,
  loadNoviceContent,
  loadTrophiesContent,
  revokeMemberAccount,
  unrevokeMemberAccount,
  updateMemberAccountName,
  updateMemberAccountRole,
  updateMembershipRequestStatus,
  upsertAgendaItem,
  upsertBudgetRevenueRow,
  upsertBudgetRow,
  upsertBudgetSettings,
  upsertEboardContent,
  upsertMeetingsContent,
  upsertMemberAccount,
  upsertNoviceContent,
  upsertPrivateLink,
  upsertTrophiesContent,
  uploadPublicImage,
} from "./lib/supabaseData";
import {
  clearStoredAuth,
  getStoredAgenda,
  getStoredAuth,
  getStoredBudget,
  getStoredEboardContent,
  getStoredMemberAccounts,
  getStoredMeetingsContent,
  getStoredMembershipRequests,
  getStoredNoviceContent,
  getStoredNotes,
  getStoredPrivateLinks,
  getStoredTrophiesContent,
  normalizeEboardContent,
  normalizeMeetingsContent,
  normalizeNoviceContent,
  normalizeTrophiesContent,
  saveStoredAgenda,
  saveStoredAuth,
  saveStoredBudget,
  saveStoredEboardContent,
  saveStoredMemberAccounts,
  saveStoredMeetingsContent,
  saveStoredMembershipRequests,
  saveStoredNoviceContent,
  saveStoredNotes,
  saveStoredPrivateLinks,
  saveStoredTrophiesContent,
} from "./lib/storage";

function HomePage() {
  return (
    <section className="mx-auto grid w-full max-w-[92rem] items-start gap-8 px-4 py-8 sm:px-5 md:px-8 md:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 border border-[#ded8d2] bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#2D2926] shadow-sm">
          <Trophy size={16} className="text-[#CC0000]" /> Ranked #4 nationally in 2026
        </div>
        <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-[#2D2926] sm:text-5xl md:text-6xl xl:text-[4rem]">
          Nationally ranked debate, open to anyone at BU.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#5b5450] sm:text-lg sm:leading-8">
          BUDS competes in APDA, the American Parliamentary Debate Association. No tryouts, no dues, no experience required, just weekly chances to travel, argue, learn, and represent Boston University.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton href="/join" className="px-6">
            Join BUDS <ArrowRight size={16} />
          </PrimaryButton>
          <SecondaryButton href="/novice-hub" className="px-6">
            New to debate? <Sparkles size={16} />
          </SecondaryButton>
        </div>
        <div className="mt-8 inline-flex max-w-full flex-wrap gap-x-5 gap-y-2 border-l-4 border-[#CC0000] bg-white/65 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] shadow-sm">
          {["No tryouts", "No dues", "Weekly tournaments"].map((item) => (
            <span key={item} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
        <div className="min-h-[26rem] overflow-hidden border border-[#2D2926]/90 bg-[#2D2926] text-white shadow-[0_18px_48px_rgba(45,41,38,0.12)] sm:min-h-[31rem] lg:min-h-[33rem]">
          <div className="grid h-full gap-0 sm:grid-cols-[0.82fr_1.18fr]">
            <div className="flex min-h-48 flex-col justify-between bg-[#CC0000] p-6 text-white sm:min-h-[31rem] lg:min-h-[33rem] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/78">2026 national rank</p>
              <p className="text-[5rem] font-black leading-none tracking-tight sm:text-[6.5rem]">#4</p>
            </div>
            <div className="grid content-center gap-7 p-6 md:p-8 lg:p-10">
              <div>
                <Eyebrow light>Format</Eyebrow>
                <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">APDA Parliamentary Debate</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
                  Two-person teams, limited prep, and tournaments across the collegiate debate circuit.
                </p>
              </div>
              <div className="grid gap-3 text-sm font-black uppercase tracking-[0.12em] text-white/72">
                <div className="flex items-center justify-between border-t border-white/15 pt-3">
                  <span>Tryouts</span>
                  <span className="text-xl leading-none text-white">0</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/15 pt-3">
                  <span>Member fees</span>
                  <span className="text-xl leading-none text-white">$0</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/15 pt-3">
                  <span>League format</span>
                  <span className="text-xl leading-none text-white">APDA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="grid gap-5 pt-2 lg:col-span-2 lg:pt-4"
      >
        <div className="border border-[#ded8d2] bg-white p-5 shadow-[0_16px_42px_rgba(45,41,38,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Eyebrow>New Debater Path</Eyebrow>
              <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Start with one practice, then one round.</h2>
            </div>
            <div className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] sm:grid-cols-4">
              {["Read Novice Hub", "Come to Practice", "Find a Partner", "Try a Tournament"].map((step, index) => (
                <div key={step} className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">
                  <span className="mr-2 text-[#CC0000]">{index + 1}</span>{step}
                </div>
              ))}
            </div>
          </div>
        </div>
        <PhotoCarousel />
      </motion.div>
    </section>
  );
}

function ConfirmationModal({ confirmation, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {confirmation && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-[#2D2926]/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="w-full max-w-md border border-[#ded8d2] bg-white p-6 shadow-[0_28px_80px_rgba(45,41,38,0.24)]"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>Are you sure?</Eyebrow>
            <h2 className="mt-3 text-2xl font-black leading-tight text-[#2D2926]">{confirmation.title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#5b5450]">{confirmation.body}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="border border-[#ded8d2] bg-[#f6f4f2] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] transition duration-200 hover:border-[#2D2926] hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="bg-[#CC0000] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition duration-200 hover:bg-[#a90000]"
              >
                {confirmation.actionLabel || "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SmoothDetails({ title, children, className = "", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={className}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left text-lg font-black text-[#2D2926]"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown size={18} className={`shrink-0 transition duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function HelperText({ children }) {
  return (
    <p className="text-xs font-bold normal-case leading-5 tracking-normal text-[#8f8781]">
      {children}
    </p>
  );
}

function FieldWarning({ children }) {
  if (!children) return null;
  return (
    <p className="border-l-4 border-[#CC0000] bg-[#fff1f1] px-3 py-2 text-xs font-black normal-case leading-5 tracking-normal text-[#8a0000]">
      {children}
    </p>
  );
}

function SaveNotice({ notice }) {
  if (!notice?.message) return null;
  return (
    <p className={`border-l-4 px-4 py-3 text-sm font-black ${
      notice.type === "error"
        ? "border-[#CC0000] bg-[#fff1f1] text-[#8a0000]"
        : "border-[#0b6b35] bg-[#e5f7ec] text-[#0b6b35]"
    }`}>
      {notice.message}
    </p>
  );
}

function ReorderButtons({ onMoveUp, onMoveDown, disabledUp = false, disabledDown = false }) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disabledUp}
        className="border border-[#ded8d2] bg-white px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-35"
      >
        Up
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disabledDown}
        className="border border-[#ded8d2] bg-white px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-35"
      >
        Down
      </button>
    </div>
  );
}

function normalizeComparisonValue(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function hasDuplicateValue(items, value, selector = (item) => item, ignoreId = "") {
  const normalizedValue = normalizeComparisonValue(value);
  if (!normalizedValue) return false;
  return items.some((item) => item?.id !== ignoreId && normalizeComparisonValue(selector(item)) === normalizedValue);
}

function moveArrayItem(items, fromIndex, toIndex) {
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return items;
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

function reorderArrayById(items, sourceId, targetId) {
  const sourceIndex = items.findIndex((item) => item.id === sourceId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  return moveArrayItem(items, sourceIndex, targetIndex);
}

const draftStorageKey = (id) => `buds-draft-${id}`;
const revisionsStorageKey = (id) => `buds-revisions-${id}`;

function getStoredDraftContent(id, fallback, normalizer) {
  try {
    const stored = window.localStorage.getItem(draftStorageKey(id));
    return stored ? normalizer(JSON.parse(stored)) : normalizer(fallback);
  } catch {
    return normalizer(fallback);
  }
}

function saveStoredDraftContent(id, content) {
  window.localStorage.setItem(draftStorageKey(id), JSON.stringify(content));
}

function getStoredContentRevisions(id, normalizer) {
  try {
    const stored = window.localStorage.getItem(revisionsStorageKey(id));
    const revisions = stored ? JSON.parse(stored) : [];
    return revisions.map((revision) => ({ ...revision, content: normalizer(revision.content) }));
  } catch {
    return [];
  }
}

function saveStoredContentRevisions(id, revisions) {
  window.localStorage.setItem(revisionsStorageKey(id), JSON.stringify(revisions.slice(0, 3)));
}

function createContentRevision(content, label) {
  return {
    id: `revision-${Date.now()}`,
    label,
    createdAt: new Date().toISOString(),
    content,
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  });
}

function summarizeArrayChanges(label, draftItems = [], publishedItems = []) {
  const draftById = new Map(draftItems.map((item) => [item.id, item]));
  const publishedById = new Map(publishedItems.map((item) => [item.id, item]));
  const added = draftItems.filter((item) => !publishedById.has(item.id)).length;
  const removed = publishedItems.filter((item) => !draftById.has(item.id)).length;
  const edited = draftItems.filter((item) => {
    const publishedItem = publishedById.get(item.id);
    return publishedItem && JSON.stringify(item) !== JSON.stringify(publishedItem);
  }).length;
  const parts = [];
  if (added) parts.push(`${added} added`);
  if (edited) parts.push(`${edited} edited`);
  if (removed) parts.push(`${removed} removed`);
  return parts.length > 0 ? `${label}: ${parts.join(", ")}` : "";
}

function getPublishChangeSummary(id, draft, published) {
  if (JSON.stringify(draft) === JSON.stringify(published)) return "No draft changes detected.";
  if (id === "meetings") {
    const changes = [];
    if (draft.announcementTitle !== published.announcementTitle) changes.push("announcement title changed");
    if (draft.announcementBody !== published.announcementBody) changes.push("announcement body changed");
    if (draft.announcementUpdatedAt !== published.announcementUpdatedAt) changes.push("updated date changed");
    return changes.length > 0 ? changes.join("; ") : "Meetings announcement changed.";
  }
  if (id === "novice") {
    return [
      summarizeArrayChanges("Speech infographic", draft.speechSteps, published.speechSteps),
      summarizeArrayChanges("FAQ", draft.faqs, published.faqs),
    ].filter(Boolean).join("; ") || "Novice Hub content changed.";
  }
  if (id === "eboard") {
    return summarizeArrayChanges("E-board members", draft.members, published.members) || "E-Board page content changed.";
  }
  if (id === "trophies") {
    return [
      summarizeArrayChanges("Top stats", draft.stats, published.stats),
      summarizeArrayChanges("Accomplishments", draft.accomplishments, published.accomplishments),
      summarizeArrayChanges("Milestones", draft.milestones, published.milestones),
      summarizeArrayChanges("Result seasons", draft.resultSeasons, published.resultSeasons),
      summarizeArrayChanges("Member achievement cards", draft.members, published.members),
    ].filter(Boolean).join("; ") || "Trophies page content changed.";
  }
  return "Draft content changed.";
}

const richTextToolbarTools = [
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Underline", icon: Underline, command: "underline" },
  { label: "Bulleted list", icon: List, command: "insertUnorderedList" },
  { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
];

function RichTextEditor({ value, onChange, disabled = false, placeholder = "" }) {
  const editorRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    if (!editorRef.current || focused) return;
    editorRef.current.innerHTML = value || "";
  }, [focused, value]);

  const syncValue = () => {
    const nextValue = sanitizeRichText(editorRef.current?.innerHTML || "");
    onChange(nextValue);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current?.contains(selection.anchorNode)) return;
    savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedSelectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(savedSelectionRef.current);
  };

  const runCommand = (command, commandValue = null) => {
    if (disabled) return;
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    saveSelection();
    syncValue();
  };

  const openLinkPanel = () => {
    if (disabled) return;
    saveSelection();
    const selectedText = window.getSelection()?.toString() || "";
    setLinkText(selectedText);
    setLinkUrl("");
    setLinkPanelOpen((current) => !current);
  };

  const applyLink = () => {
    if (disabled || !linkUrl.trim()) return;
    const url = normalizeLinkUrl(linkUrl);
    const displayText = linkText.trim();
    if (!displayText) return;
    editorRef.current?.focus();
    restoreSelection();

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.textContent = displayText;

    const selection = window.getSelection();
    const hasEditorSelection =
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(selection.getRangeAt(0).commonAncestorContainer);

    if (hasEditorSelection) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (editorRef.current) {
      if (editorRef.current.innerHTML.trim()) {
        editorRef.current.append(document.createTextNode(" "));
      }
      editorRef.current.append(anchor);
    }

    setLinkPanelOpen(false);
    setLinkText("");
    setLinkUrl("");
    saveSelection();
    syncValue();
  };

  const handleToolbarClick = (command) => {
    runCommand(command);
  };

  const isEmpty = !richTextToPlainText(value);

  return (
    <div className={`border border-[#ded8d2] bg-white ${disabled ? "opacity-55" : ""}`}>
      <div className="border-b border-[#ded8d2] bg-[#f6f4f2] p-2">
        <div className="flex flex-wrap items-center gap-1">
          {richTextToolbarTools.map(({ label, icon: Icon, command }) => (
            <button
              key={label}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleToolbarClick(command)}
              disabled={disabled}
              title={label}
              aria-label={label}
              className="grid h-9 w-9 place-items-center border border-[#ded8d2] bg-white text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon size={16} />
            </button>
          ))}
          <span className="mx-1 h-7 w-px bg-[#ded8d2]" />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={openLinkPanel}
            disabled={disabled}
            title="Embed link"
            aria-label="Embed link"
            className={`inline-flex h-9 items-center gap-2 border px-3 text-xs font-black uppercase tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
              linkPanelOpen ? "border-[#CC0000] bg-[#CC0000] text-white" : "border-[#ded8d2] bg-white text-[#2D2926] hover:border-[#CC0000] hover:text-[#CC0000]"
            }`}
          >
            <Link2 size={16} /> Link
          </button>
        </div>
        <AnimatePresence initial={false}>
          {linkPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid gap-2 border border-[#ded8d2] bg-white p-3 normal-case tracking-normal sm:grid-cols-[1fr_1.35fr_auto]">
                <label className="grid gap-1 text-[0.68rem] font-black uppercase tracking-[0.1em] text-[#5b5450]">
                  Link text
                  <input
                    type="text"
                    value={linkText}
                    onChange={(event) => setLinkText(event.target.value)}
                    placeholder="Selected text"
                    className="border border-[#ded8d2] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                  />
                </label>
                <label className="grid gap-1 text-[0.68rem] font-black uppercase tracking-[0.1em] text-[#5b5450]">
                  URL
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    placeholder="https://example.com"
                    className="border border-[#ded8d2] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                  />
                </label>
                <button
                  type="button"
                  onClick={applyLink}
                  disabled={!linkUrl.trim() || !linkText.trim()}
                  className="self-end bg-[#2D2926] px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#CC0000] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        {isEmpty && !focused && (
          <p className="pointer-events-none absolute left-3 top-3 text-sm font-medium text-[#8f8781]">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            saveSelection();
            syncValue();
          }}
          onKeyUp={saveSelection}
          onInput={syncValue}
          onMouseUp={saveSelection}
          className="rich-note min-h-40 px-3 py-3 text-sm font-medium leading-7 text-[#2D2926] outline-none normal-case tracking-normal focus:ring-2 focus:ring-[#CC0000]/25"
        />
      </div>
    </div>
  );
}

function sortResultSeasons(seasons = []) {
  return [...seasons].sort((a, b) => b.id.localeCompare(a.id));
}

function budgetNumberValue(value) {
  return value === "" ? 0 : Number(value) || 0;
}

function isBudgetInputValue(value) {
  return /^\d*(?:\.\d{0,2})?$/.test(value);
}

function isApdaManagedStat(stat) {
  return stat.id?.startsWith("apda-") || /coty rank|coty contributors|current members/i.test(`${stat.label} ${stat.detail}`);
}

function isApdaManagedAccomplishment(item) {
  return item.id?.startsWith("apda-") || /terrier central|coty/i.test(item.text || "");
}

function mergeApdaTrophiesProposal(content, proposal) {
  const nextStats = [
    ...proposal.stats,
    ...(content.stats || []).filter((stat) => !isApdaManagedStat(stat)),
  ];
  const nextAccomplishments = [
    ...proposal.accomplishments,
    ...(content.accomplishments || []).filter((item) => !isApdaManagedAccomplishment(item)),
  ];
  const nextResultSeasons = (content.resultSeasons || []).some((season) => season.id === proposal.resultSeason.id)
    ? content.resultSeasons.map((season) => (season.id === proposal.resultSeason.id ? proposal.resultSeason : season))
    : [...(content.resultSeasons || []), proposal.resultSeason];

  return {
    ...content,
    sourceUrl: proposal.sourceUrl || content.sourceUrl,
    stats: nextStats,
    accomplishments: nextAccomplishments,
    resultSeasons: sortResultSeasons(nextResultSeasons),
    members: proposal.members || content.members,
  };
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isRichText(value = "") {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function richTextToPlainText(value = "") {
  if (!value) return "";
  if (typeof window === "undefined") return value.replace(/<[^>]*>/g, " ").trim();
  const wrapper = document.createElement("div");
  wrapper.innerHTML = sanitizeRichText(value);
  return wrapper.textContent?.trim() || "";
}

function normalizeRichTextForDisplay(value = "") {
  if (!value) return "";
  return isRichText(value) ? sanitizeRichText(value) : escapeHtml(value).replace(/\n/g, "<br>");
}

function normalizeLinkUrl(value = "") {
  const trimmed = value.trim();
  return /^(https?:|mailto:)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function sanitizeRichText(value = "") {
  if (!value) return "";
  if (typeof window === "undefined") return escapeHtml(value);

  const allowedTags = new Set(["A", "B", "BR", "DIV", "EM", "I", "LI", "OL", "P", "SPAN", "STRONG", "U", "UL"]);
  const template = document.createElement("template");
  template.innerHTML = value;

  const cleanNode = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) return;
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        return;
      }

      if (["SCRIPT", "STYLE"].includes(child.tagName)) {
        child.remove();
        return;
      }

      if (!allowedTags.has(child.tagName)) {
        cleanNode(child);
        child.replaceWith(...child.childNodes);
        return;
      }

      const href = child.tagName === "A" ? child.getAttribute("href") || "" : "";
      [...child.attributes].forEach((attribute) => child.removeAttribute(attribute.name));
      if (child.tagName === "A") {
        const isAllowedHref = /^(https?:|mailto:)/i.test(href);
        if (isAllowedHref) {
          child.setAttribute("href", href);
          child.setAttribute("target", "_blank");
          child.setAttribute("rel", "noreferrer");
        }
      }
      cleanNode(child);
    });
  };

  cleanNode(template.content);
  return template.innerHTML;
}

function normalizeSeasonId(value) {
  const trimmed = value.trim();
  const match = trimmed.match(/(20\d{2})\D*(\d{2,4})/);
  if (!match) return trimmed;
  const startYear = match[1];
  const endYear = match[2].length === 2 ? `20${match[2]}` : match[2];
  return `${startYear}-${endYear}`;
}

function AboutPage() {
  const aboutHighlights = [
    { value: "1999", label: "Modern BUDS era" },
    { value: "APDA", label: "National debate circuit" },
    { value: "$0", label: "Membership dues" },
    { value: "0", label: "Tryouts required" },
  ];
  const joinBenefits = [
    {
      icon: Sparkles,
      title: "Beginner-friendly training",
      copy: "You do not need previous debate experience to join. Practices teach case construction, rebuttal, weighing, flowing, speaking style, and tournament strategy from the ground up.",
    },
    {
      icon: Trophy,
      title: "Competitive travel",
      copy: "BUDS competes on the American Parliamentary Debate Association circuit, giving members the chance to debate students from colleges across the country and build a real competitive record.",
    },
    {
      icon: Medal,
      title: "Skills That Transfer",
      copy: "Debate sharpens public speaking, research instincts, persuasion, fast thinking, teamwork, and confidence under pressure. Those skills show up everywhere from class discussions to interviews.",
    },
    {
      icon: MapPin,
      title: "A Social Home at BU",
      copy: "The team is also a community: weekly practices, mentorship, tournament weekends, team events, and older members who help new debaters find their footing.",
    },
  ];
  const aboutTimeline = [
    {
      year: "Before 1999",
      title: "A Longer BU Debating Tradition",
      copy: "Boston University students competed in earlier forms of collegiate debate before the current parliamentary team took shape.",
    },
    {
      year: "1999",
      title: "The Modern Society Forms",
      copy: "The current Boston University Debate Society began its modern chapter in 1999, building a home for APDA-style parliamentary debate on campus.",
    },
    {
      year: "Today",
      title: "Open, Competitive, and Growing",
      copy: "BUDS now combines novice training, tournament travel, member mentorship, and a culture built around learning out loud.",
    },
  ];

  return (
    <Page>
      <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative min-w-0 overflow-hidden border border-[#ded8d2] bg-[#CC0000] p-5 text-white shadow-[0_22px_70px_rgba(45,41,38,0.14)] sm:p-7 md:p-10">
          <img
            src="/about-buds-logo.png"
            alt="BUDS logo"
            className="absolute right-5 top-5 hidden h-24 w-24 border-2 border-white/30 object-cover shadow-[0_12px_34px_rgba(45,41,38,0.18)] sm:right-6 sm:top-6 sm:block md:h-32 md:w-32"
          />
          <div className="max-w-2xl sm:pr-24 md:pr-36">
            <Eyebrow light>About BUDS</Eyebrow>
            <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">
              Debate hard. Learn fast. Find your people.
            </h1>
            <p className="mt-6 text-lg font-medium leading-8 text-white/86">
              The Boston University Debate Society is BU's home for parliamentary debate, competitive travel, novice development, and the kind of argument that makes people sharper without making them smaller.
            </p>
          </div>
          <div className="mt-10 grid border border-white/25 sm:grid-cols-4">
            {aboutHighlights.map((item, index) => (
              <div key={item.label} className={`p-4 ${index < aboutHighlights.length - 1 ? "border-b border-white/25 sm:border-b-0 sm:border-r" : ""}`}>
                <p className="text-3xl font-black leading-none">{item.value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <Card className="p-7 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#2D2926] text-white">
                <Trophy size={22} />
              </div>
              <div>
                <Eyebrow>What We Do</Eyebrow>
              <h2 className="mt-3 text-2xl font-black leading-tight text-[#2D2926] sm:text-3xl">APDA Parliamentary Debate, Built for BU Students.</h2>
                <p className="mt-4 text-base leading-7 text-[#5b5450]">
                  BUDS competes in the American Parliamentary Debate Association, a limited-prep format with two-person teams, fast adaptation, and lots of room for creativity. Members practice weekly, travel to tournaments, write cases, judge rounds, and help each other improve.
                </p>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="!bg-[#2D2926] p-6 text-white">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-white/60">Best For</p>
              <p className="mt-4 text-2xl font-black leading-tight">Curious people who like ideas like feminism, politics, philosophy, law, comedy, or economics.</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#CC0000]">Start Here</p>
              <p className="mt-4 text-2xl font-black leading-tight text-[#2D2926]">Show up to practice. No tryout, no dues, no prior debate resume.</p>
            </Card>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <SiteLink href="/history" className="group block">
          <Card className="p-5 transition hover:border-[#CC0000] hover:shadow-[0_24px_70px_rgba(45,41,38,0.12)] sm:p-7 md:p-8">
            <Eyebrow>History</Eyebrow>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#2D2926] transition group-hover:text-[#CC0000]">A BU team with memory and momentum.</h2>
            <div className="mt-6 grid gap-4">
              {aboutTimeline.map((item) => (
                <div key={item.year} className="grid gap-3 border-t border-[#ded8d2] pt-4 sm:grid-cols-[5.5rem_1fr] sm:gap-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">{item.year}</p>
                  <div>
                    <h3 className="text-lg font-black text-[#2D2926]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5b5450]">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </SiteLink>

        <section>
          <div className="mb-4 flex flex-col gap-2 border-b-4 border-[#CC0000] pb-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Why Join</Eyebrow>
              <h2 className="mt-2 text-3xl font-black text-[#2D2926]">The Practical Upside of BUDS</h2>
            </div>
            <PrimaryButton href="/join" className="sm:self-center">
              Request to Join <ArrowRight size={16} />
            </PrimaryButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {joinBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="group min-h-64 p-6 transition hover:-translate-y-1 hover:border-[#CC0000] hover:shadow-[0_24px_70px_rgba(45,41,38,0.12)]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#CC0000] text-white transition group-hover:bg-[#2D2926]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-[#2D2926]">{benefit.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#5b5450]">{benefit.copy}</p>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </Page>
  );
}

function NoviceHubPage({ noviceContent }) {
  const speechIconMap = {
    file: FileText,
    help: CircleHelp,
    mic: Mic2,
    scroll: ScrollText,
  };
  const apdaSpeechSteps = noviceContent.speechSteps || [];

  return (
    <Page>
      <PageHeader eyebrow="Novice Hub" title="A Cleaner Path from First Practice to First Tournament.">
        Give new debaters the essentials without burying them in a long scroll.
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {noviceResources.map((resource) => (
          <Card key={resource.title} className="group flex min-h-52 flex-col p-4 transition hover:-translate-y-1 sm:p-5">
            <span className="w-fit bg-[#CC0000] px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white">{resource.tag}</span>
            <h2 className="mt-4 text-xl font-black leading-tight text-[#2D2926]">{resource.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#5b5450]">{resource.description}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-left text-xs font-black uppercase tracking-[0.08em] text-[#CC0000]"
            >
              Open link <ChevronRight className="transition group-hover:translate-x-1" size={16} />
            </a>
          </Card>
        ))}
      </div>
      <section className="mt-6 overflow-hidden border border-[#ded8d2] bg-white p-5 shadow-[0_18px_55px_rgba(45,41,38,0.08)] sm:p-7 md:p-9">
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow>APDA Basics</Eyebrow>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#2D2926] md:text-5xl">APDA Speech Order</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#5b5450] md:text-base md:leading-7">
            A quick map of who speaks when in a standard APDA cases round.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <span className="inline-flex items-center justify-center gap-2 border border-[#b7cff8] bg-[#eef5ff] px-4 py-2 text-sm font-black text-[#135fbe]">
              <span className="h-3 w-3 bg-[#1d67c4]" /> Government: prepared case
            </span>
            <span className="inline-flex items-center justify-center gap-2 border border-[#f0b7b7] bg-[#fff1f1] px-4 py-2 text-sm font-black text-[#b31313]">
              <span className="h-3 w-3 bg-[#CC0000]" /> Opposition: no prep
            </span>
          </div>
        </div>

        <div className="relative mx-auto mt-8 grid max-w-6xl gap-4 md:mt-10 md:gap-6">
          <div className="pointer-events-none absolute left-8 top-0 hidden h-full border-l-2 border-dashed border-[#cfd5dd] md:left-1/2 md:block" />
          {apdaSpeechSteps.map((step) => {
            const Icon = speechIconMap[step.icon] || Mic2;
            const isGov = step.side === "gov";
            const speechCard = (
              <article className={`relative grid min-h-full gap-3 border p-4 shadow-[0_12px_34px_rgba(45,41,38,0.06)] sm:grid-cols-[3.5rem_1fr] sm:p-5 ${
                isGov ? "border-[#a9c7f5] bg-[#f4f8ff]" : "border-[#f0b7b7] bg-[#fff6f6]"
              }`}>
                <span className={`absolute right-3 top-3 grid h-8 w-8 place-items-center text-sm font-black text-white md:hidden ${isGov ? "bg-[#1d67c4]" : "bg-[#CC0000]"}`}>
                  {step.order}
                </span>
                <div className={`grid h-12 w-12 place-items-center self-start ${
                  isGov ? "bg-[#1d67c4] text-white" : "bg-[#CC0000] text-white"
                }`}>
                  <Icon size={24} />
                </div>
                <div className="pr-9 md:pr-0">
                  <h3 className="text-lg font-black leading-tight text-[#202020]">{step.title}</h3>
                  <p className={`mt-2 inline-flex px-3 py-1 text-xs font-black ${
                    isGov ? "bg-[#dceaff] text-[#0b4fa8]" : "bg-[#ffe0e0] text-[#9b0d0d]"
                  }`}>
                    {step.time}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#403a36]">{step.copy}</p>
                  {step.note && (
                    <p className="mt-3 border border-[#f4d690] bg-[#fff5d6] px-3 py-2 text-xs font-black text-[#6d4a00]">
                      {step.note}
                    </p>
                  )}
                </div>
              </article>
            );
            return (
              <div key={step.order} className="grid gap-3 md:grid-cols-[1fr_4rem_1fr] md:items-center">
                <div>{isGov ? speechCard : null}</div>
                <div className="hidden items-center justify-center md:col-start-2 md:flex">
                  <span className={`relative z-10 grid h-11 w-11 place-items-center border-4 border-white text-lg font-black text-white shadow-[0_10px_25px_rgba(45,41,38,0.16)] ${
                    isGov ? "bg-[#1d67c4]" : "bg-[#CC0000]"
                  }`}>
                    {step.order}
                  </span>
                </div>
                <div>{isGov ? null : speechCard}</div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-5 flex max-w-6xl items-start gap-4 border border-[#f1d38a] bg-[#fff8df] p-4 text-[#2D2926] sm:items-center sm:p-5">
          <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#f1aa1d] text-white">
            <Gavel size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black">The Judge Decides</h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#5b5450]">
              After the round, both teams leave the room to let the judge deliberate on which side gave the more convincing, better supported, and better weighed reasons.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-2 border-b-4 border-[#CC0000] pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Novice FAQ</Eyebrow>
            <h2 className="mt-2 text-3xl font-black text-[#2D2926]">Common First-Round Questions</h2>
          </div>
        </div>
        <div className="columns-1 gap-3 md:columns-2">
          {noviceContent.faqs.map((faq, index) => (
            <SmoothDetails
              key={faq.id}
              title={faq.question}
              defaultOpen={index === 0}
              className="mb-3 break-inside-avoid border border-[#ded8d2] bg-white p-4 shadow-[0_14px_38px_rgba(45,41,38,0.06)]"
            >
              <p className="text-sm font-semibold leading-6 text-[#5b5450]">{faq.answer}</p>
            </SmoothDetails>
          ))}
        </div>
      </section>
      <section className="mt-6 grid gap-6 border border-[#4d4640] bg-[#2D2926] p-5 text-white shadow-[0_16px_45px_rgba(45,41,38,0.16)] sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#f4f1ee]"><Lock size={16} /> Learn by Watching Rounds</div>
          <p className="max-w-4xl text-xl font-black leading-tight text-white md:text-2xl">
            The best way to learn APDA is to stay for a practice round, or "pround," after practice. Demonstration rounds, walkthroughs, and examples are also shown regularly during meetings so new debaters can see how cases, rebuttals, and weighing work in real time.
          </p>
        </div>
        <div className="border border-white/30 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white md:justify-self-end">Members Only</div>
      </section>
    </Page>
  );
}

function CalendarPage({ calendarEmbedUrl }) {
  return (
    <Page>
      <PageHeader eyebrow="Calendar" title="Practices, Tournaments, and Team Events.">
        Feel free to pull up to any meeting! No Pressure!
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

function MeetingsPage({ auth, meetingsContent, onRequestConfirmation }) {
  const [meetingPosts, setMeetingPosts] = useState(() => getStoredNotes());
  const canDeletePosts = auth?.role === "eboard" || auth?.role === ADMIN_ROLE;
  const sortedPosts = sortMeetingPosts(meetingPosts);
  const meetingNumberById = new Map(
    [...sortedPosts]
      .reverse()
      .map((post, index) => [post.id, String(index + 1).padStart(2, "0")])
  );
  const latestMeetingLabel = sortedPosts[0]?.date ? formatMeetingDate(sortedPosts[0].date) : "None yet";
  const announcementTitle = meetingsContent.announcementTitle.trim() || "No Announcements";
  const announcementBody = meetingsContent.announcementBody.trim() || "No announcements right now. Check back soon for meeting updates.";

  useEffect(() => {
    let ignore = false;

    async function hydrateMeetingPosts() {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from("eboard_notes")
        .select("id,date,title,body,created_at")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase meeting notes load failed", error);
        return;
      }
      if (ignore) return;
      setMeetingPosts(data || []);
      saveStoredNotes(data || []);
    }

    hydrateMeetingPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const removeMeetingPost = (id) => {
    if (!canDeletePosts) return;
    const nextPosts = meetingPosts.filter((post) => post.id !== id);
    setMeetingPosts(nextPosts);
    saveStoredNotes(nextPosts);
    deleteNote(id);
  };

  return (
    <Page>
      <div className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#2D2926] bg-[#2D2926] p-6 text-white shadow-[0_22px_70px_rgba(45,41,38,0.14)] md:p-10">
          <Eyebrow light>Meetings</Eyebrow>
          <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">
            Meeting Notes, Organized Like a Team Record.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
            <span className="block">Don't worry! Secretary records the meetings in case you miss one.</span>
            <span className="block">Organized newest first, so announcements and lecture updates stay easy to browse.</span>
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="grid gap-3 border border-[#ded8d2] bg-white p-5 shadow-[0_16px_45px_rgba(45,41,38,0.08)]">
            <div>
              <p className="text-4xl font-black leading-none text-[#CC0000]">{sortedPosts.length}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">Published Posts</p>
            </div>
            <div className="border-t border-[#ded8d2] pt-3">
              <p className="text-xl font-black leading-tight text-[#2D2926]">{latestMeetingLabel}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">Latest Update</p>
            </div>
          </div>
          <div className="flex min-h-44 flex-col border border-[#ded8d2] bg-white p-5 shadow-[0_16px_45px_rgba(45,41,38,0.08)]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Announcements</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-[#2D2926]">{announcementTitle}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#5b5450]">{announcementBody}</p>
            </div>
            <p className="mt-auto pt-4 text-xs font-black uppercase tracking-[0.12em] text-[#6d6560]">
              {meetingsContent.announcementUpdatedAt ? `Updated ${formatMeetingDate(meetingsContent.announcementUpdatedAt)}` : "No update posted yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedPosts.length === 0 && (
          <Card className="border-dashed p-10 text-center">
            <Eyebrow>No Posts Yet</Eyebrow>
            <h2 className="mt-3 text-3xl font-black text-[#2D2926]">Secretary Notes Will Appear Here Automatically.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#5b5450]">
              Saved meeting notes with a date and brief title, and this page will turn them into an organized archive.
            </p>
          </Card>
        )}
        {sortedPosts.map((post, index) => (
          <article key={post.id} className="group grid gap-0 border border-[#ded8d2] bg-white shadow-[0_16px_45px_rgba(45,41,38,0.08)] transition hover:-translate-y-1 hover:border-[#CC0000] hover:shadow-[0_24px_70px_rgba(45,41,38,0.12)] sm:grid-cols-[7rem_1fr] lg:grid-cols-[8rem_1fr]">
            <div className="flex items-center justify-between border-b border-[#ded8d2] bg-[#CC0000] p-5 text-white lg:block lg:border-b-0 lg:border-r">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">No.</p>
              <p className="mt-0 text-5xl font-black leading-none lg:mt-3">{meetingNumberById.get(post.id) || String(index + 1).padStart(2, "0")}</p>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CC0000]">{formatMeetingDate(post.date)}</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#2D2926] md:text-4xl">{post.title || "Untitled Meeting"}</h2>
                </div>
                {canDeletePosts && (
                  <button
                    type="button"
                    onClick={() => onRequestConfirmation({
                      title: `Delete ${post.title || "this meeting post"}?`,
                      body: "This meeting post will be removed from the public meeting archive.",
                      onConfirm: () => removeMeetingPost(post.id),
                    })}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#ded8d2] bg-[#f6f4f2] text-[#6d6560] opacity-100 transition hover:border-[#CC0000] hover:text-[#CC0000] md:opacity-0 md:group-hover:opacity-100"
                    aria-label={`Delete ${post.title || "meeting post"}`}
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
              {post.body ? (
                <div
                  className="rich-note mt-5 text-base leading-8 text-[#4d4743]"
                  dangerouslySetInnerHTML={{ __html: normalizeRichTextForDisplay(post.body) }}
                />
              ) : (
                <p className="mt-5 text-base leading-8 text-[#4d4743]">No Notes Body Added.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}

function HistoryPage() {
  const historyTimeline = [
    {
      year: "Founded",
      title: "A Home for Parliamentary Debate at BU",
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
  const historyAccomplishments = [
    "Tournament wins and finals appearances",
    "Speaker awards and novice breaks",
    "Team awards and season milestones",
    "Alumni judging, coaching, and mentorship",
  ];
  const historyAlumni = [
    {
      name: "Alumni Spotlight",
      detail: "Add a short profile on a former BUDS member, including their favorite memory and post-grad path.",
    },
    {
      name: "Mentor Network",
      detail: "Create a directory of alumni who are open to judging, coaching, career chats, or tournament support.",
    },
  ];

  return (
    <Page>
      <PageHeader eyebrow="History" title="A Timeline That Can Grow with the Team.">
        Add each year once you have records, photos, e-board names, and major results.
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-3">
        {historyTimeline.map((item) => (
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
            <h2 className="min-w-0 break-words text-2xl font-black text-[#2D2926] sm:text-3xl">Accomplishments</h2>
          </div>
          <div className="grid gap-3">
            {historyAccomplishments.map((item) => (
              <div key={item} className="flex items-start gap-3 border border-[#ded8d2] bg-[#f6f4f2] px-4 py-4">
                <span className="mt-2 h-2 w-2 shrink-0 bg-[#CC0000]" aria-hidden="true" />
                <span className="font-bold text-[#2D2926]">{item}</span>
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
            {historyAlumni.map((person) => (
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

function TrophiesPage({ trophiesContent }) {
  const resultSeasons = sortResultSeasons(trophiesContent.resultSeasons || []);

  return (
    <Page>
      <PageHeader eyebrow="Trophies" title="BU Debate Results, in APDA Order.">
        Current season records pulled from APDA Results for Boston University and the 2025-26 roster.
      </PageHeader>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {trophiesContent.stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-4xl font-black leading-none text-[#CC0000]">{stat.value}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#2D2926]">{stat.label}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#5b5450]">{stat.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {trophiesContent.milestones.map((item) => (
          <Card key={item.id || item.year} className="border-t-8 border-t-[#CC0000]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CC0000]">{item.year}</p>
            <h2 className="mt-4 text-2xl font-black leading-tight text-[#2D2926]">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5b5450]">{item.copy}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Medal className="text-[#CC0000]" />
            <h2 className="min-w-0 break-words text-2xl font-black text-[#2D2926] sm:text-3xl">Accomplishments</h2>
          </div>
          <div className="grid gap-3">
            {trophiesContent.accomplishments.map((item) => (
              <div key={item.id || item.text} className="flex items-start gap-3 border border-[#ded8d2] bg-[#f6f4f2] px-4 py-4">
                <span className="mt-2 h-2 w-2 shrink-0 bg-[#CC0000]" aria-hidden="true" />
                <span className="font-bold text-[#2D2926]">{item.text}</span>
              </div>
            ))}
          </div>
          <a
            href={trophiesContent.sourceUrl || apdaSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#CC0000]"
          >
            View APDA source <ExternalLink size={15} />
          </a>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Trophy className="text-[#CC0000]" />
            <h2 className="text-3xl font-black text-[#2D2926]">Results Timelines</h2>
          </div>
          <div className="grid gap-3">
            {resultSeasons.map((season, index) => (
              <SmoothDetails key={season.id} title={season.label} defaultOpen={index === 0} className="border border-[#ded8d2] bg-white p-3">
                {season.results.length === 0 ? (
                  <div className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] p-4 text-sm font-bold text-[#5b5450]">
                    No results logged yet.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {[...season.results].reverse().map((result) => (
                      <div key={result.id || `${result.date}-${result.tournament}`} className="border-l-4 border-[#CC0000] bg-[#f6f4f2] p-4">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <h3 className="text-xl font-black text-[#2D2926]">{result.tournament}</h3>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">{result.date}</p>
                        </div>
                        <ul className="mt-3 grid gap-2">
                          {result.highlights.map((highlight) => (
                            <li key={highlight} className="text-sm font-semibold leading-6 text-[#5b5450]">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </SmoothDetails>
            ))}
          </div>
        </Card>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-2 border-b-4 border-[#CC0000] pb-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Current Members</Eyebrow>
            <h2 className="mt-2 text-3xl font-black text-[#2D2926]">APDA Achievement Record</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-6 text-[#5b5450]">
            Each card reflects the current 2025-26 Boston University roster. Members with no listed award row are still recorded here as current roster members.
          </p>
        </div>
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {trophiesContent.members.map((member) => (
            <Card key={member.id || member.name} className="mb-4 break-inside-avoid p-5">
              <p className="text-xl font-black leading-tight text-[#2D2926]">{member.name}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">{member.meta}</p>
              <SmoothDetails
                title="Achievements"
                className="mt-4 border-t border-[#ded8d2] pt-3"
              >
                <ul className="grid gap-2">
                  {member.achievements.map((achievement) => (
                    <li key={achievement} className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2 text-sm font-semibold leading-6 text-[#5b5450]">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </SmoothDetails>
            </Card>
          ))}
        </div>
      </section>
    </Page>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function EBoardPage({ eboardContent }) {
  const members = eboardContent.members || [];

  return (
    <Page>
      <PageHeader eyebrow="People" title="Current E-Board.">
        Add photos, short bios, and clear contact paths for prospective members.
      </PageHeader>
      <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id || `${member.name}-${member.role}`} className="overflow-hidden p-0">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#2D2926]">
              {member.photo ? (
                <img src={member.photo} alt={`${member.name}, ${member.role}`} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#2D2926,#514944)]">
                  <div className="grid h-24 w-24 place-items-center border-4 border-white bg-[#CC0000] text-3xl font-black text-white shadow-[0_16px_32px_rgba(0,0,0,0.24)]">
                    {getInitials(member.name || member.role || "BU")}
                  </div>
                </div>
              )}
              <div className="absolute left-4 top-4 bg-white px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000] shadow-sm">
                {member.role}
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-black leading-tight text-[#2D2926]">{member.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[#5b5450]">{member.bio}</p>
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function ContactPage() {
  return (
    <Page>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-[28rem] w-full min-w-0 max-w-full flex-col justify-between overflow-hidden border border-[#1f1b19] bg-[#2D2926] p-5 text-left text-white shadow-[0_20px_55px_rgba(45,41,38,0.14)] sm:min-h-[34rem] sm:p-6 md:p-10">
          <div>
            <span className="inline-flex bg-[#CC0000] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              Contact
            </span>
            <h1 className="mt-8 max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Come to practice. Watch a round. Ask a question.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-white/85 sm:text-lg sm:leading-8">
              BUDS is open to BU students of every experience level. Reach out, stop by practice, or request membership through the join form when you are ready.
            </p>
            <div className="mt-8 grid min-w-0 gap-3 border border-white/20 bg-white/5 p-4 text-sm font-bold text-white/90 sm:p-5">
              <a href="mailto:boston.university.debate@gmail.com" className="break-words hover:text-white">
                Email: boston.university.debate@gmail.com
              </a>
              <a href="https://www.instagram.com/budebatesociety" target="_blank" rel="noreferrer" className="break-words hover:text-white">
                Instagram: @budebatesociety
              </a>
              <a href="https://www.linkedin.com/company/budebatesociety/posts/?feedView=all" target="_blank" rel="noreferrer" className="break-words hover:text-white">
                LinkedIn: linkedin.com/company/budebatesociety
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <a href="mailto:boston.university.debate@gmail.com" className="inline-flex items-center justify-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                Email us <Mail size={16} />
              </a>
              <a href="https://www.instagram.com/budebatesociety" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/35 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white hover:bg-white/10">
                Instagram <ExternalLink size={16} />
              </a>
              <a href="https://www.linkedin.com/company/budebatesociety/posts/?feedView=all" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-white/35 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white hover:bg-white/10">
                LinkedIn <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border border-[#ded8d2] bg-white p-5 shadow-[0_20px_55px_rgba(45,41,38,0.08)] sm:p-8 md:p-10">
          <div className="border-t-8 border-t-[#CC0000] bg-[#f6f4f2] p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#CC0000] text-white">
                <MapPin />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#CC0000]">Practice Information</p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-[#2D2926] sm:text-3xl">
                  Mondays & Wednesdays
                  <span className="block">@ 7-8 PM</span>
                </h2>
                <p className="mt-4 text-lg font-bold text-[#2D2926]">Location: SAR 101</p>
                <p className="mt-3 text-base leading-7 text-[#5b5450]">Open to all BU students, including complete beginners. Come by to observe, ask questions, or jump into drills.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="border border-[#ded8d2] bg-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">Best First Step</p>
              <p className="mt-3 text-sm leading-6 text-[#5b5450]">Visit a practice and introduce yourself to one of the E-Board members!</p>
            </div>
            <div className="border border-[#ded8d2] bg-white p-5">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">Ready to Join?</p>
              <p className="mt-3 text-sm leading-6 text-[#5b5450]">Use the membership request form below so admins can add you to the team's flow.</p>
            </div>
          </div>
          <div className="mt-8">
            <PrimaryButton href="/join" className="w-full px-10 py-4 text-base">
              Request to Join <ArrowRight size={16} />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Page>
  );
}

function JoinPage({ auth, onRequestConfirmation }) {
  const [requests, setRequests] = useState(() => getStoredMembershipRequests());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestPassword, setRequestPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("success");
  const [reviewReasons, setReviewReasons] = useState({});
  const isAdmin = auth?.role === ADMIN_ROLE;

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

    if (RESERVED_ACCOUNT_EMAILS.includes(normalizedEmail)) {
      setSubmitMessageType("error");
      setSubmitMessage("That email is reserved and cannot be used for a membership request.");
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
    const reviewedRequest = requests.find((request) => request.id === id);
    if (status === "Accepted" && reviewedRequest && RESERVED_ACCOUNT_EMAILS.includes(reviewedRequest.email.toLowerCase())) {
      setReviewReasons((current) => ({ ...current, [id]: "This email is reserved and cannot be accepted through requests." }));
      return;
    }

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
        <div className="flex min-h-[28rem] flex-col justify-between border border-[#9a0000] bg-[#CC0000] p-6 text-left text-white shadow-[0_20px_55px_rgba(45,41,38,0.14)] sm:min-h-[34rem] md:p-10">
          <div>
            <span className="inline-flex bg-[#2D2926] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              Join BUDS
            </span>
            <h1 className="mt-8 max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Request membership in the Boston University Debate Society.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
              New members request an account first. After an administrator accepts you, use this same BU email and password to log in through the Hub.
            </p>
          </div>
          <div className="mt-10 grid gap-4 border border-white/40 bg-white p-4 text-[#2D2926] sm:p-6">
            <div className="grid gap-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] sm:grid-cols-3">
              <div className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">1. Request</div>
              <div className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">2. Wait for approval</div>
              <div className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">3. Log in</div>
            </div>
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
              Submit Request <ArrowRight size={16} />
            </button>
          </form>
        </Card>
      </div>

      {isAdmin && (
        <Card className="mt-6">
          <div className="flex flex-col gap-2 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Administrator</Eyebrow>
              <h2 className="mt-2 text-3xl font-black text-[#2D2926]">Membership Requests</h2>
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
                    onClick={() => onRequestConfirmation({
                      title: `Delete request from ${request.name}?`,
                      body: "This membership request will be permanently removed from the review queue.",
                      onConfirm: () => removeMembershipRequest(request.id),
                    })}
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isBuEmail = /@([a-z0-9-]+\.)?bu\.edu$/.test(normalizedEmail);

    if (!isBuEmail) {
      setError("Please use a BU email address ending in @bu.edu.");
      return;
    }

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

    setError("No accepted BUDS account was found for that email and password.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Private Login" title="Choose Your BUDS Access Level.">
        Accepted members log in here. New members should request an account first.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="!bg-[#2D2926] p-5 text-white sm:p-8">
          <div className="border-t-4 border-[#CC0000] pt-6">
            <Eyebrow light>Private Access</Eyebrow>
            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">Log in with your membership ID.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
              Use the BU email and password from your approved membership request. Members get resources.
            </p>
          </div>
          <div className="mt-8 grid gap-3 border border-white/20 bg-white/5 p-5 text-sm font-bold text-white/80">
            <p>New? Request an account before trying to log in.</p>
            <p>Waiting? You can log in only after an admin accepts your request.</p>
            <a href="/join" onClick={(event) => { event.preventDefault(); navigateTo("/join"); }} className="mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:bg-[#f6f4f2] hover:text-[#CC0000]">
              Request Account <ArrowRight size={16} />
            </a>
          </div>
        </Card>

        <Card className="p-5 sm:p-8">
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

function PrivateHubPage({ auth, trophiesContent, meetingsContent, noviceContent, eboardContent, onTrophiesContentChange, onMeetingsContentChange, onNoviceContentChange, onEboardContentChange, onRequestConfirmation, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => (auth?.role === "eboard" || auth?.role === ADMIN_ROLE ? "eboard" : "member"));
  const [draftTrophiesContent, setDraftTrophiesContent] = useState(() => getStoredDraftContent("trophies", trophiesContent, normalizeTrophiesContent));
  const [draftMeetingsContent, setDraftMeetingsContent] = useState(() => getStoredDraftContent("meetings", meetingsContent, normalizeMeetingsContent));
  const [draftNoviceContent, setDraftNoviceContent] = useState(() => getStoredDraftContent("novice", noviceContent, normalizeNoviceContent));
  const [draftEboardContent, setDraftEboardContent] = useState(() => getStoredDraftContent("eboard", eboardContent, normalizeEboardContent));
  const [contentRevisions, setContentRevisions] = useState(() => ({
    trophies: getStoredContentRevisions("trophies", normalizeTrophiesContent),
    meetings: getStoredContentRevisions("meetings", normalizeMeetingsContent),
    novice: getStoredContentRevisions("novice", normalizeNoviceContent),
    eboard: getStoredContentRevisions("eboard", normalizeEboardContent),
  }));
  const [notes, setNotes] = useState(() => getStoredNotes());
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetingAnnouncement, setMeetingAnnouncement] = useState(draftMeetingsContent);
  const [noviceFaqs, setNoviceFaqs] = useState(draftNoviceContent.faqs);
  const [noviceSpeechSteps, setNoviceSpeechSteps] = useState(draftNoviceContent.speechSteps || []);
  const [newNoviceFaq, setNewNoviceFaq] = useState({ question: "", answer: "" });
  const [eboardMembers, setEboardMembers] = useState(draftEboardContent.members || []);
  const [newEboardMember, setNewEboardMember] = useState({ name: "", role: "", bio: "", photo: "" });
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
  const [newTrophyStat, setNewTrophyStat] = useState({ value: "", label: "", detail: "" });
  const [newTrophyAccomplishment, setNewTrophyAccomplishment] = useState("");
  const [newTrophyMilestone, setNewTrophyMilestone] = useState({ year: "", title: "", copy: "" });
  const [newTrophyResult, setNewTrophyResult] = useState({ date: "", tournament: "", highlights: "" });
  const [selectedTrophySeasonId, setSelectedTrophySeasonId] = useState("");
  const [newTrophySeason, setNewTrophySeason] = useState("");
  const [newTrophyMember, setNewTrophyMember] = useState({ name: "", meta: "", achievement: "" });
  const [apdaUpdatePreview, setApdaUpdatePreview] = useState(null);
  const [apdaUpdateStatus, setApdaUpdateStatus] = useState({ state: "idle", message: "" });
  const [notesEditorOpen, setNotesEditorOpen] = useState(false);
  const [announcementEditorOpen, setAnnouncementEditorOpen] = useState(false);
  const [noviceInfographicEditorOpen, setNoviceInfographicEditorOpen] = useState(false);
  const [noviceFaqEditorOpen, setNoviceFaqEditorOpen] = useState(false);
  const [eboardEditorOpen, setEboardEditorOpen] = useState(false);
  const [trophyEditorOpen, setTrophyEditorOpen] = useState(false);
  const [trophyEditorSection, setTrophyEditorSection] = useState("stats");
  const [editorNotice, setEditorNotice] = useState({ type: "", message: "" });
  const [dragItem, setDragItem] = useState(null);
  const [previewDraftId, setPreviewDraftId] = useState("");

  const isAdmin = auth?.role === ADMIN_ROLE;
  const canManageMembers = isAdmin || MEMBER_MANAGER_EMAILS.includes(auth?.email);
  const isEboard = auth?.role === "eboard" || isAdmin;
  const canEditWorkspace = isEboard;
  const canEditMemberLinks = isAdmin;
  const canEditTrophies = isEboard;
  const canWriteNotes = isEboard;
  const canUsePrivateTabs = isEboard || canManageMembers;
  const visibleTab = canUsePrivateTabs ? activeTab : "member";
  const sortedNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const selectedNote = sortedNotes.find((note) => note.id === selectedNoteId) ?? sortedNotes[0];
  const trophyResultSeasons = sortResultSeasons(draftTrophiesContent.resultSeasons || []);
  const selectedTrophySeason = trophyResultSeasons.find((season) => season.id === selectedTrophySeasonId) || trophyResultSeasons[0];
  const selectedTrophySeasonIdValue = selectedTrophySeason?.id || "";
  const approvedBudgetRows = budget.rows.filter((row) => row.status === "Approved");
  const getBudgetStatusClassName = (status) => {
    if (status === "Approved") return "text-[#0b6b35]";
    if (status === "Denied") return "text-[#8a0000]";
    return "text-[#CC0000]";
  };
  const totalSpent = approvedBudgetRows.reduce((sum, row) => sum + budgetNumberValue(row.spent), 0);
  const totalAllocated = approvedBudgetRows.reduce((sum, row) => sum + budgetNumberValue(row.allocated), 0);
  const totalRevenue = budget.revenueRows.reduce((sum, row) => sum + budgetNumberValue(row.amount), 0);
  const effectiveBudget = budgetNumberValue(budget.total) + totalRevenue;
  const remainingBudget = effectiveBudget - totalSpent;
  const displayName = auth?.name?.trim() || auth?.email?.split("@")[0] || "member";
  const hubTitle = visibleTab === "member"
    ? `Welcome, ${displayName}`
    : visibleTab === "members"
      ? "Members"
      : visibleTab === "budsite"
        ? "Budsite Editor"
        : "E-Board Workspace";
  const memberLinksBySection = privateLinkSections.map((section) => ({
    section,
    links: memberLinks.filter((link) => getPrivateLinkSection(link) === section),
  })).filter((group) => group.links.length > 0);
  const contentDashboardItems = [
    { id: "trophies", title: "Trophies", href: "/trophies", draft: draftTrophiesContent, published: trophiesContent },
    { id: "meetings", title: "Meetings Announcement", href: "/meetings", draft: draftMeetingsContent, published: meetingsContent },
    { id: "novice", title: "Novice Hub", href: "/novice-hub", draft: draftNoviceContent, published: noviceContent },
    { id: "eboard", title: "E-Board Page", href: "/eboard", draft: draftEboardContent, published: eboardContent },
  ];

  const showEditorNotice = (message, type = "success") => {
    setEditorNotice({ type, message });
  };

  const startEditorDrag = (collection, id) => {
    setDragItem({ collection, id });
  };

  const finishEditorDrag = () => {
    setDragItem(null);
  };

  const allowEditorDrop = (event) => {
    event.preventDefault();
  };

  const updateRevisionList = (id, revision, normalizer) => {
    const nextRevisions = [revision, ...(contentRevisions[id] || [])].slice(0, 3);
    setContentRevisions((current) => ({ ...current, [id]: nextRevisions }));
    saveStoredContentRevisions(id, nextRevisions.map((item) => ({ ...item, content: normalizer(item.content) })));
  };

  const publishContentDraft = (id) => {
    const publishMap = {
      trophies: {
        label: "Trophies page",
        published: trophiesContent,
        draft: draftTrophiesContent,
        normalizer: normalizeTrophiesContent,
        publish: onTrophiesContentChange,
      },
      meetings: {
        label: "Meetings page announcement",
        published: meetingsContent,
        draft: draftMeetingsContent,
        normalizer: normalizeMeetingsContent,
        publish: onMeetingsContentChange,
      },
      novice: {
        label: "Novice Hub",
        published: noviceContent,
        draft: draftNoviceContent,
        normalizer: normalizeNoviceContent,
        publish: onNoviceContentChange,
      },
      eboard: {
        label: "E-Board page",
        published: eboardContent,
        draft: draftEboardContent,
        normalizer: normalizeEboardContent,
        publish: onEboardContentChange,
      },
    };
    const target = publishMap[id];
    if (!target) return;
    const normalizedDraft = target.normalizer(target.draft);
    const normalizedPublished = target.normalizer(target.published);
    const summary = getPublishChangeSummary(id, normalizedDraft, normalizedPublished);
    requestDeleteConfirmation({
      title: `Publish ${target.label}?`,
      body: `Change summary: ${summary} Publishing will replace the live public page and save the current live version in revision history.`,
      actionLabel: "Publish",
      onConfirm: () => {
        const revision = createContentRevision(normalizedPublished, `${target.label} before publish`);
        updateRevisionList(id, revision, target.normalizer);
        target.publish(normalizedDraft);
        saveStoredDraftContent(id, normalizedDraft);
        showEditorNotice(`${target.label} published.`);
      },
    });
  };

  const restoreContentRevision = (id, revision) => {
    const restoreMap = {
      trophies: { setDraft: setDraftTrophiesContent, normalizer: normalizeTrophiesContent },
      meetings: { setDraft: setDraftMeetingsContent, normalizer: normalizeMeetingsContent, sync: setMeetingAnnouncement },
      novice: { setDraft: setDraftNoviceContent, normalizer: normalizeNoviceContent },
      eboard: { setDraft: setDraftEboardContent, normalizer: normalizeEboardContent },
    };
    const target = restoreMap[id];
    if (!target) return;
    const restoredContent = target.normalizer(revision.content);
    target.setDraft(restoredContent);
    target.sync?.(restoredContent);
    if (id === "novice") {
      setNoviceFaqs(restoredContent.faqs);
      setNoviceSpeechSteps(restoredContent.speechSteps || []);
    }
    if (id === "eboard") setEboardMembers(restoredContent.members || []);
    saveStoredDraftContent(id, restoredContent);
    showEditorNotice("Revision restored into draft. Publish it when ready.");
  };

  const deleteContentRevision = (id, revision) => {
    requestDeleteConfirmation({
      title: `Delete revision from ${formatMeetingDate(revision.createdAt.slice(0, 10))}?`,
      body: "This saved revision will be removed from revision history. The current draft and live page will not change.",
      onConfirm: () => {
        const nextRevisions = (contentRevisions[id] || []).filter((item) => item.id !== revision.id);
        setContentRevisions((current) => ({ ...current, [id]: nextRevisions }));
        saveStoredContentRevisions(id, nextRevisions);
        showEditorNotice("Revision deleted.");
      },
    });
  };

  const newNoviceFaqDuplicate = hasDuplicateValue(noviceFaqs, newNoviceFaq.question, (faq) => faq.question);
  const newEboardMemberDuplicate = hasDuplicateValue(eboardMembers, newEboardMember.name, (member) => member.name);
  const newTrophyStatDuplicate = hasDuplicateValue(draftTrophiesContent.stats, newTrophyStat.label, (stat) => stat.label);
  const newTrophyAccomplishmentDuplicate = hasDuplicateValue(draftTrophiesContent.accomplishments, newTrophyAccomplishment, (item) => item.text);
  const newTrophyMilestoneDuplicate = hasDuplicateValue(draftTrophiesContent.milestones, newTrophyMilestone.title, (item) => item.title);
  const newTrophyResultDuplicate = hasDuplicateValue(selectedTrophySeason?.results || [], newTrophyResult.tournament, (result) => result.tournament);

  useEffect(() => {
    let ignore = false;

    async function hydrateFromDatabase() {
      const databaseState = await loadDatabaseState();
      if (!databaseState || ignore) return;

      setAgenda(databaseState.agenda);
      setNotes(databaseState.notes);
      setBudget(databaseState.budget);
      setMemberLinks(databaseState.privateLinks);
      if (databaseState.meetingsContent) {
        setDraftMeetingsContent((current) => current || databaseState.meetingsContent);
        setMeetingAnnouncement((current) => current || databaseState.meetingsContent);
        onMeetingsContentChange(databaseState.meetingsContent);
      }
      if (databaseState.noviceContent) {
        setDraftNoviceContent((current) => current || databaseState.noviceContent);
        setNoviceFaqs((current) => current.length > 0 ? current : databaseState.noviceContent.faqs);
        setNoviceSpeechSteps((current) => current.length > 0 ? current : databaseState.noviceContent.speechSteps || []);
        onNoviceContentChange(databaseState.noviceContent);
      }
      if (databaseState.eboardContent) {
        setDraftEboardContent((current) => current || databaseState.eboardContent);
        setEboardMembers((current) => current.length > 0 ? current : databaseState.eboardContent.members || []);
        onEboardContentChange(databaseState.eboardContent);
      }
      saveStoredAgenda(databaseState.agenda);
      saveStoredNotes(databaseState.notes);
      saveStoredBudget(databaseState.budget);
      saveStoredPrivateLinks(databaseState.privateLinks);
      if (databaseState.eboardContent) saveStoredEboardContent(databaseState.eboardContent);
    }

    hydrateFromDatabase();

    return () => {
      ignore = true;
    };
  }, [onEboardContentChange, onMeetingsContentChange, onNoviceContentChange]);

  useEffect(() => {
    let ignore = false;

    async function hydrateMemberAccounts() {
      const databaseAccounts = await loadMemberAccounts();
      if (!databaseAccounts || ignore) return;
      setMemberAccounts(databaseAccounts);
      saveStoredMemberAccounts(databaseAccounts);
    }

    if (canManageMembers) hydrateMemberAccounts();

    return () => {
      ignore = true;
    };
  }, [canManageMembers]);

  useEffect(() => {
    if (!editorNotice.message) return undefined;
    const timeoutId = window.setTimeout(() => setEditorNotice({ type: "", message: "" }), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [editorNotice]);

  if (!auth) {
    return (
      <Page>
        <Card className="mx-auto max-w-2xl text-center">
          <Eyebrow>Login Required</Eyebrow>
          <h1 className="mt-4 text-4xl font-black text-[#2D2926]">Please Log In to View the Private BUDS Hub.</h1>
          <PrimaryButton href="/login" className="mt-8">
            Go to Login <ArrowRight size={16} />
          </PrimaryButton>
        </Card>
      </Page>
    );
  }

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if (!canWriteNotes) return;
    const body = sanitizeRichText(meetingNotes);
    if (!richTextToPlainText(body)) return;
    const nextNote = {
      id: `${meetingDate}-${Date.now()}`,
      date: meetingDate,
      title: meetingTitle.trim(),
      body,
      created_at: new Date().toISOString(),
    };
    const nextNotes = [nextNote, ...notes];
    setNotes(nextNotes);
    saveStoredNotes(nextNotes);
    insertNote(nextNote);
    showEditorNotice("Meeting note published.");
    setSelectedNoteId(nextNote.id);
    setMeetingDate("");
    setMeetingTitle("");
    setMeetingNotes("");
  };

  const handleAnnouncementSubmit = (event) => {
    event.preventDefault();
    if (!canWriteNotes) return;
    const nextContent = {
      announcementTitle: meetingAnnouncement.announcementTitle.trim() || "Announcements",
      announcementBody: meetingAnnouncement.announcementBody.trim(),
      announcementUpdatedAt: new Date().toISOString().slice(0, 10),
    };
    setMeetingAnnouncement(nextContent);
    setDraftMeetingsContent(nextContent);
    saveStoredDraftContent("meetings", nextContent);
    showEditorNotice("Meeting announcement draft saved. Publish it when ready.");
  };

  const persistNoviceFaqs = (nextFaqs) => {
    if (!canWriteNotes) return;
    const nextContent = { ...draftNoviceContent, speechSteps: noviceSpeechSteps, faqs: nextFaqs };
    setDraftNoviceContent(nextContent);
    setNoviceFaqs(nextFaqs);
    saveStoredDraftContent("novice", nextContent);
    showEditorNotice("Novice FAQ draft saved. Publish it when ready.");
  };

  const persistNoviceSpeechSteps = (nextSteps) => {
    if (!isAdmin) return;
    const normalizedSteps = [...nextSteps].sort((a, b) => Number(a.order) - Number(b.order));
    const nextContent = { ...draftNoviceContent, speechSteps: normalizedSteps, faqs: noviceFaqs };
    setDraftNoviceContent(nextContent);
    setNoviceSpeechSteps(normalizedSteps);
    saveStoredDraftContent("novice", nextContent);
    showEditorNotice("Novice infographic draft saved. Publish it when ready.");
  };

  const handleNoviceFaqSubmit = (event) => {
    event.preventDefault();
    if (!canWriteNotes) return;
    const question = newNoviceFaq.question.trim();
    const answer = newNoviceFaq.answer.trim();
    if (!question || !answer) {
      showEditorNotice("Add both a question and an answer before saving.", "error");
      return;
    }
    if (hasDuplicateValue(noviceFaqs, question, (faq) => faq.question)) {
      showEditorNotice("That FAQ question already exists.", "error");
      return;
    }
    persistNoviceFaqs([
      ...noviceFaqs,
      { id: `faq-${Date.now()}`, question, answer },
    ]);
    setNewNoviceFaq({ question: "", answer: "" });
  };

  const updateNoviceFaq = (id, field, value) => {
    persistNoviceFaqs(noviceFaqs.map((faq) => (
      faq.id === id ? { ...faq, [field]: value } : faq
    )));
  };

  const removeNoviceFaq = (faq) => {
    requestDeleteConfirmation({
      title: `Delete "${faq.question}"?`,
      body: "This FAQ will be removed from the public Novice Hub.",
      onConfirm: () => persistNoviceFaqs(noviceFaqs.filter((item) => item.id !== faq.id)),
    });
  };

  const moveNoviceFaq = (index, direction) => {
    const nextFaqs = moveArrayItem(noviceFaqs, index, index + direction);
    persistNoviceFaqs(nextFaqs);
  };

  const dropNoviceFaq = (targetId) => {
    if (dragItem?.collection !== "novice-faq" || dragItem.id === targetId) return;
    persistNoviceFaqs(reorderArrayById(noviceFaqs, dragItem.id, targetId));
    finishEditorDrag();
  };

  const updateNoviceSpeechStep = (id, field, value) => {
    persistNoviceSpeechSteps(noviceSpeechSteps.map((step) => (
      step.id === id
        ? { ...step, [field]: field === "order" ? Number(value) : value }
        : step
    )));
  };

  const moveNoviceSpeechStep = (index, direction) => {
    const nextSteps = moveArrayItem(noviceSpeechSteps, index, index + direction).map((step, stepIndex) => ({
      ...step,
      order: stepIndex + 1,
    }));
    persistNoviceSpeechSteps(nextSteps);
  };

  const handleAgendaSubmit = (event) => {
    event.preventDefault();
    if (!canEditWorkspace) return;
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
    if (!canEditWorkspace) return;
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
    if (!canEditWorkspace) return;
    if (!lastDeletedAgendaItem) return;
    const restoredItem = { ...lastDeletedAgendaItem, completed_at: null };
    const itemStillExists = agenda.some((agendaItem) => agendaItem.id === restoredItem.id);
    const nextAgenda = itemStillExists
      ? agenda.map((agendaItem) => (
        agendaItem.id === restoredItem.id ? restoredItem : agendaItem
      ))
      : [restoredItem, ...agenda];
    setAgenda(nextAgenda);
    saveStoredAgenda(nextAgenda);
    upsertAgendaItem(restoredItem);
    setLastDeletedAgendaItem(null);
  };

  const removeAgendaItem = (item) => {
    if (!canEditWorkspace) return;
    requestDeleteConfirmation({
      title: `Delete ${item.text}?`,
      body: "This agenda item will be removed from the workspace.",
      onConfirm: () => {
        const nextAgenda = agenda.filter((agendaItem) => agendaItem.id !== item.id);
        setLastDeletedAgendaItem(item);
        setAgenda(nextAgenda);
        saveStoredAgenda(nextAgenda);
        deleteAgendaItem(item.id);
      },
    });
  };

  const updateBudget = (nextBudget) => {
    setBudget(nextBudget);
    saveStoredBudget(nextBudget);
  };

  const updateBudgetTotal = (total) => {
    if (!canEditWorkspace) return;
    if (!isBudgetInputValue(total)) return;
    const nextBudget = { ...budget, total };
    updateBudget(nextBudget);
    upsertBudgetSettings(budgetNumberValue(total));
  };

  const updateBudgetRow = (id, field, value) => {
    if (!canEditWorkspace) return;
    if ((field === "allocated" || field === "spent") && !isBudgetInputValue(value)) return;
    if (field === "status" && value === "Denied") {
      const row = budget.rows.find((budgetRow) => budgetRow.id === id);
      requestDeleteConfirmation({
        title: `Deny and delete ${row?.category || "this budget item"}?`,
        body: "Denied budget items are removed from the budget tracker.",
        actionLabel: "Deny",
        onConfirm: () => {
          deleteBudgetRow(id);
          updateBudget({
            ...budget,
            rows: budget.rows.filter((budgetRow) => budgetRow.id !== id),
          });
        },
      });
      return;
    }

    const nextBudget = {
      ...budget,
      rows: budget.rows.map((row) => (
        row.id === id
          ? { ...row, [field]: value }
          : row
      )),
    };
    updateBudget(nextBudget);
    const updatedRow = nextBudget.rows.find((row) => row.id === id);
    if (updatedRow) {
      upsertBudgetRow({
        ...updatedRow,
        allocated: budgetNumberValue(updatedRow.allocated),
        spent: budgetNumberValue(updatedRow.spent),
      });
    }
  };

  const addBudgetRow = (event) => {
    event.preventDefault();
    if (!canEditWorkspace) return;
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
    if (!canEditWorkspace) return;
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

  const updateNewRevenueAmount = (value) => {
    if (!isBudgetInputValue(value)) return;
    setNewRevenueAmount(value);
  };

  const removeBudgetRevenueRow = (id) => {
    if (!canEditWorkspace) return;
    const row = (budget.revenueRows || []).find((revenueRow) => revenueRow.id === id);
    requestDeleteConfirmation({
      title: `Delete ${row?.category || "this revenue item"}?`,
      body: "This revenue entry will be removed from the budget tracker.",
      onConfirm: () => {
        const nextBudget = {
          ...budget,
          revenueRows: (budget.revenueRows || []).filter((revenueRow) => revenueRow.id !== id),
        };
        updateBudget(nextBudget);
        deleteBudgetRevenueRow(id);
      },
    });
  };

  const updateMemberLink = (id, field, value) => {
    if (!canEditMemberLinks) return;
    const nextLinks = memberLinks.map((link) => (
      link.id === id ? { ...link, [field]: value } : link
    ));
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    const updatedLink = nextLinks.find((link) => link.id === id);
    if (updatedLink) upsertPrivateLink(updatedLink);
    showEditorNotice("Member resource link saved.");
  };

  const moveMemberLink = (id, direction, section) => {
    if (!canEditMemberLinks) return;
    const sectionLinks = memberLinks.filter((link) => getPrivateLinkSection(link) === section);
    const currentSectionIndex = sectionLinks.findIndex((link) => link.id === id);
    const nextSectionLinks = moveArrayItem(sectionLinks, currentSectionIndex, currentSectionIndex + direction);
    let nextSectionIndex = 0;
    const nextLinks = memberLinks.map((link) => (
      getPrivateLinkSection(link) === section ? nextSectionLinks[nextSectionIndex++] : link
    ));
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    nextSectionLinks.forEach((link) => upsertPrivateLink(link));
    showEditorNotice("Member resource order saved.");
  };

  const dropMemberLink = (targetId, section) => {
    if (dragItem?.collection !== `member-link-${section}` || dragItem.id === targetId) return;
    const sectionLinks = memberLinks.filter((link) => getPrivateLinkSection(link) === section);
    const nextSectionLinks = reorderArrayById(sectionLinks, dragItem.id, targetId);
    let nextSectionIndex = 0;
    const nextLinks = memberLinks.map((link) => (
      getPrivateLinkSection(link) === section ? nextSectionLinks[nextSectionIndex++] : link
    ));
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    nextSectionLinks.forEach((link) => upsertPrivateLink(link));
    finishEditorDrag();
    showEditorNotice("Member resource order saved.");
  };

  const requestDeleteConfirmation = ({ title, body, actionLabel, onConfirm }) => {
    onRequestConfirmation({ title, body, actionLabel, onConfirm });
  };

  const persistEboardContent = (updater) => {
    if (!canWriteNotes) return;
    const currentContent = { ...draftEboardContent, members: eboardMembers };
    const nextContent = typeof updater === "function" ? updater(currentContent) : updater;
    setDraftEboardContent(nextContent);
    setEboardMembers(nextContent.members || []);
    saveStoredDraftContent("eboard", nextContent);
    showEditorNotice("E-Board page draft saved. Publish it when ready.");
  };

  const updateEboardMember = (id, field, value) => {
    persistEboardContent((content) => ({
      ...content,
      members: content.members.map((member) => (
        member.id === id ? { ...member, [field]: value } : member
      )),
    }));
  };

  const handleEboardPhotoUpload = async (id, file) => {
    if (!canWriteNotes || !file || !file.type.startsWith("image/")) return;
    const storedUrl = await uploadPublicImage(file, "eboard");
    const photo = storedUrl || await readFileAsDataUrl(file);
    updateEboardMember(id, "photo", photo);
    showEditorNotice(storedUrl ? "Photo uploaded to Supabase Storage." : "Photo saved locally for preview. Supabase Storage is not configured.", storedUrl ? "success" : "error");
  };

  const handleNewEboardPhotoUpload = async (file) => {
    if (!canWriteNotes || !file || !file.type.startsWith("image/")) return;
    const storedUrl = await uploadPublicImage(file, "eboard");
    const photo = storedUrl || await readFileAsDataUrl(file);
    setNewEboardMember((current) => ({ ...current, photo }));
    showEditorNotice(storedUrl ? "Photo uploaded to Supabase Storage." : "Photo saved locally for preview. Supabase Storage is not configured.", storedUrl ? "success" : "error");
  };

  const addEboardMember = (event) => {
    event.preventDefault();
    if (!canWriteNotes || !newEboardMember.name.trim() || !newEboardMember.role.trim()) {
      showEditorNotice("Add at least a name and role before saving an officer.", "error");
      return;
    }
    if (hasDuplicateValue(eboardMembers, newEboardMember.name, (member) => member.name)) {
      showEditorNotice("That e-board member already exists.", "error");
      return;
    }
    const nextMember = {
      id: `eboard-${Date.now()}`,
      name: newEboardMember.name.trim(),
      role: newEboardMember.role.trim(),
      bio: newEboardMember.bio.trim(),
      photo: newEboardMember.photo,
    };
    persistEboardContent((content) => ({ ...content, members: [...content.members, nextMember] }));
    setNewEboardMember({ name: "", role: "", bio: "", photo: "" });
  };

  const removeEboardMember = (member) => {
    if (!canWriteNotes) return;
    requestDeleteConfirmation({
      title: `Delete ${member.name || "this e-board member"}?`,
      body: "This will remove the person from the public E-Board page.",
      onConfirm: () => {
        persistEboardContent((content) => ({
          ...content,
          members: content.members.filter((item) => item.id !== member.id),
        }));
      },
    });
  };

  const moveEboardMember = (index, direction) => {
    persistEboardContent((content) => ({
      ...content,
      members: moveArrayItem(content.members, index, index + direction),
    }));
  };

  const dropEboardMember = (targetId) => {
    if (dragItem?.collection !== "eboard-member" || dragItem.id === targetId) return;
    persistEboardContent((content) => ({
      ...content,
      members: reorderArrayById(content.members, dragItem.id, targetId),
    }));
    finishEditorDrag();
  };

  const persistTrophiesContent = (updater) => {
    if (!canEditTrophies) return;
    const nextContent = typeof updater === "function" ? updater(draftTrophiesContent) : updater;
    setDraftTrophiesContent(nextContent);
    saveStoredDraftContent("trophies", nextContent);
    showEditorNotice("Trophies page draft saved. Publish it when ready.");
  };

  const updateTrophyItem = (section, id, field, value) => {
    persistTrophiesContent((content) => ({
      ...content,
      [section]: content[section].map((item) => (
        item.id === id ? { ...item, [field]: value } : item
      )),
    }));
  };

  const removeTrophyItem = (section, id) => {
    persistTrophiesContent((content) => ({
      ...content,
      [section]: content[section].filter((item) => item.id !== id),
    }));
  };

  const addTrophyStat = (event) => {
    event.preventDefault();
    if (!newTrophyStat.value.trim() || !newTrophyStat.label.trim()) {
      showEditorNotice("Add both a stat value and label before saving.", "error");
      return;
    }
    if (hasDuplicateValue(draftTrophiesContent.stats, newTrophyStat.label, (stat) => stat.label)) {
      showEditorNotice("That top stat already exists.", "error");
      return;
    }
    const nextStat = {
      id: `stat-${Date.now()}`,
      value: newTrophyStat.value.trim(),
      label: newTrophyStat.label.trim(),
      detail: newTrophyStat.detail.trim(),
    };
    persistTrophiesContent((content) => ({ ...content, stats: [...content.stats, nextStat] }));
    setNewTrophyStat({ value: "", label: "", detail: "" });
  };

  const addTrophyAccomplishment = (event) => {
    event.preventDefault();
    const text = newTrophyAccomplishment.trim();
    if (!text) {
      showEditorNotice("Add accomplishment text before saving.", "error");
      return;
    }
    if (hasDuplicateValue(draftTrophiesContent.accomplishments, text, (item) => item.text)) {
      showEditorNotice("That accomplishment already exists.", "error");
      return;
    }
    persistTrophiesContent((content) => ({
      ...content,
      accomplishments: [...content.accomplishments, { id: `accomplishment-${Date.now()}`, text }],
    }));
    setNewTrophyAccomplishment("");
  };

  const addTrophyMilestone = (event) => {
    event.preventDefault();
    if (!newTrophyMilestone.year.trim() || !newTrophyMilestone.title.trim()) {
      showEditorNotice("Add both a milestone year and title before saving.", "error");
      return;
    }
    if (hasDuplicateValue(draftTrophiesContent.milestones, newTrophyMilestone.title, (item) => item.title)) {
      showEditorNotice("That milestone title already exists.", "error");
      return;
    }
    const nextMilestone = {
      id: `milestone-${Date.now()}`,
      year: newTrophyMilestone.year.trim(),
      title: newTrophyMilestone.title.trim(),
      copy: newTrophyMilestone.copy.trim(),
    };
    persistTrophiesContent((content) => ({ ...content, milestones: [...content.milestones, nextMilestone] }));
    setNewTrophyMilestone({ year: "", title: "", copy: "" });
  };

  const addTrophyResult = (event) => {
    event.preventDefault();
    const highlights = newTrophyResult.highlights.split("\n").map((item) => item.trim()).filter(Boolean);
    if (!selectedTrophySeasonIdValue || !newTrophyResult.date || !newTrophyResult.tournament.trim() || highlights.length === 0) {
      showEditorNotice("Add a season, date, tournament name, and at least one highlight before saving.", "error");
      return;
    }
    if (hasDuplicateValue(selectedTrophySeason?.results || [], newTrophyResult.tournament, (result) => result.tournament)) {
      showEditorNotice("That tournament already exists in this season.", "error");
      return;
    }
    const nextResult = {
      id: `result-${Math.round(event.timeStamp)}`,
      date: newTrophyResult.date,
      tournament: newTrophyResult.tournament.trim(),
      highlights,
    };
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? { ...season, results: [...season.results, nextResult] }
          : season
      )),
    }));
    setNewTrophyResult({ date: "", tournament: "", highlights: "" });
  };

  const moveTrophyItem = (section, index, direction) => {
    persistTrophiesContent((content) => ({
      ...content,
      [section]: moveArrayItem(content[section], index, index + direction),
    }));
  };

  const dropTrophyItem = (section, targetId) => {
    if (dragItem?.collection !== `trophy-${section}` || dragItem.id === targetId) return;
    persistTrophiesContent((content) => ({
      ...content,
      [section]: reorderArrayById(content[section], dragItem.id, targetId),
    }));
    finishEditorDrag();
  };

  const addTrophyResultSeason = (event) => {
    event.preventDefault();
    const seasonId = normalizeSeasonId(newTrophySeason);
    if (!seasonId) {
      showEditorNotice("Use a season format like 2026-2027.", "error");
      return;
    }
    if (trophyResultSeasons.some((season) => season.id === seasonId)) {
      setSelectedTrophySeasonId(seasonId);
      setNewTrophySeason("");
      showEditorNotice("That season already exists, so it was selected instead.", "error");
      return;
    }

    const nextSeason = {
      id: seasonId,
      label: `${seasonId} Results Timeline`,
      results: [],
    };
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: [...content.resultSeasons, nextSeason],
    }));
    setSelectedTrophySeasonId(seasonId);
    setNewTrophySeason("");
  };

  const removeTrophyResultSeason = () => {
    if (!selectedTrophySeasonIdValue || !selectedTrophySeason) return;
    requestDeleteConfirmation({
      title: `Delete ${selectedTrophySeason.label}?`,
      body: "This season and every tournament result inside it will be removed from the public Trophies page.",
      onConfirm: () => {
        const remainingSeasons = trophyResultSeasons.filter((season) => season.id !== selectedTrophySeasonIdValue);
        persistTrophiesContent((content) => ({
          ...content,
          resultSeasons: content.resultSeasons.filter((season) => season.id !== selectedTrophySeasonIdValue),
        }));
        setSelectedTrophySeasonId(remainingSeasons[0]?.id || "");
      },
    });
  };

  const pullApdaTrophiesPreview = async () => {
    if (!canEditTrophies) return;
    setApdaUpdateStatus({ state: "loading", message: "Pulling the latest APDA standings. Existing Trophies content is untouched." });
    setApdaUpdatePreview(null);
    try {
      const currentSeason = selectedTrophySeasonIdValue ? selectedTrophySeasonIdValue.slice(0, 4) : "";
      const response = await fetch(`/api/apda-preview${currentSeason ? `?season=${encodeURIComponent(currentSeason)}` : ""}`);
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.includes("application/json")) {
        const responseText = await response.text();
        throw new Error(responseText.includes("const APDA")
          ? "The APDA updater API is not running yet. Refresh after the latest deploy finishes, then try again."
          : "The APDA updater returned an unexpected response. Please try again after refreshing.");
      }
      const data = await response.json();
      setApdaUpdatePreview(data);
      setApdaUpdateStatus({
        state: "ready",
        message: `Review ${data.summary.tournamentCount} tournaments, ${data.summary.highlightCount} highlights, and ${data.summary.memberCount} member cards before applying.`,
      });
    } catch (error) {
      setApdaUpdateStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not pull APDA standings safely.",
      });
    }
  };

  const applyApdaTrophiesPreview = () => {
    if (!apdaUpdatePreview) return;
    requestDeleteConfirmation({
      title: `Apply APDA update for ${apdaUpdatePreview.seasonDisplay}?`,
      body: `This will update APDA-managed stats, accomplishments, the ${apdaUpdatePreview.seasonDisplay} results timeline, and current member achievement cards. You already reviewed the preview; this is the final save step.`,
      actionLabel: "Apply Update",
      onConfirm: () => {
        persistTrophiesContent((content) => mergeApdaTrophiesProposal(content, apdaUpdatePreview));
        setSelectedTrophySeasonId(apdaUpdatePreview.resultSeason.id);
        setApdaUpdateStatus({ state: "idle", message: `Applied APDA update for ${apdaUpdatePreview.seasonDisplay}.` });
        setApdaUpdatePreview(null);
      },
    });
  };

  const addTrophyMemberAchievement = (event) => {
    event.preventDefault();
    const name = newTrophyMember.name.trim();
    const achievement = newTrophyMember.achievement.trim();
    if (!name || !achievement) {
      showEditorNotice("Choose a member and write an achievement before saving.", "error");
      return;
    }
    persistTrophiesContent((content) => {
      const existingMember = content.members.find((member) => member.name.toLowerCase() === name.toLowerCase());
      if (existingMember) {
        return {
          ...content,
          members: content.members.map((member) => (
            member.id === existingMember.id
              ? { ...member, meta: newTrophyMember.meta.trim() || member.meta, achievements: [...member.achievements, achievement] }
              : member
          )),
        };
      }
      return {
        ...content,
        members: [
          ...content.members,
          { id: `member-${Date.now()}`, name, meta: newTrophyMember.meta.trim() || "Current member", achievements: [achievement] },
        ],
      };
    });
    setNewTrophyMember({ name: "", meta: "", achievement: "" });
  };

  const updateTrophyResult = (resultId, field, value) => {
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? {
            ...season,
            results: season.results.map((result) => (
              result.id === resultId ? { ...result, [field]: value } : result
            )),
          }
          : season
      )),
    }));
  };

  const removeTrophyResult = (resultId) => {
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? { ...season, results: season.results.filter((result) => result.id !== resultId) }
          : season
      )),
    }));
  };

  const moveTrophyResult = (resultId, direction) => {
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => {
        if (season.id !== selectedTrophySeasonIdValue) return season;
        const index = season.results.findIndex((result) => result.id === resultId);
        return { ...season, results: moveArrayItem(season.results, index, index + direction) };
      }),
    }));
  };

  const dropTrophyResult = (targetId) => {
    if (dragItem?.collection !== "trophy-result" || dragItem.id === targetId) return;
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? { ...season, results: reorderArrayById(season.results, dragItem.id, targetId) }
          : season
      )),
    }));
    finishEditorDrag();
  };

  const updateTrophyResultHighlight = (resultId, highlightIndex, value) => {
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? {
            ...season,
            results: season.results.map((result) => (
              result.id === resultId
                ? { ...result, highlights: result.highlights.map((highlight, index) => (index === highlightIndex ? value : highlight)) }
                : result
            )),
          }
          : season
      )),
    }));
  };

  const removeTrophyResultHighlight = (resultId, highlightIndex) => {
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? {
            ...season,
            results: season.results.map((result) => (
              result.id === resultId
                ? { ...result, highlights: result.highlights.filter((_, index) => index !== highlightIndex) }
                : result
            )),
          }
          : season
      )),
    }));
  };

  const moveTrophyResultHighlight = (resultId, highlightIndex, direction) => {
    persistTrophiesContent((content) => ({
      ...content,
      resultSeasons: content.resultSeasons.map((season) => (
        season.id === selectedTrophySeasonIdValue
          ? {
            ...season,
            results: season.results.map((result) => (
              result.id === resultId
                ? { ...result, highlights: moveArrayItem(result.highlights, highlightIndex, highlightIndex + direction) }
                : result
            )),
          }
          : season
      )),
    }));
  };

  const updateTrophyMemberAchievement = (memberId, achievementIndex, value) => {
    persistTrophiesContent((content) => ({
      ...content,
      members: content.members.map((member) => (
        member.id === memberId
          ? { ...member, achievements: member.achievements.map((achievement, index) => (index === achievementIndex ? value : achievement)) }
          : member
      )),
    }));
  };

  const removeTrophyMemberAchievement = (memberId, achievementIndex) => {
    persistTrophiesContent((content) => ({
      ...content,
      members: content.members.map((member) => (
        member.id === memberId
          ? { ...member, achievements: member.achievements.filter((_, index) => index !== achievementIndex) }
          : member
      )),
    }));
  };

  const updateMemberStatus = (id, role) => {
    if (!canManageMembers) return;
    const nextAccounts = memberAccounts.map((account) => (
      account.id === id ? { ...account, role, updated_at: new Date().toISOString() } : account
    ));
    setMemberAccounts(nextAccounts);
    saveStoredMemberAccounts(nextAccounts);
    updateMemberAccountRole(id, role);
  };

  const moveTrophyMemberAchievement = (memberId, achievementIndex, direction) => {
    persistTrophiesContent((content) => ({
      ...content,
      members: content.members.map((member) => (
        member.id === memberId
          ? { ...member, achievements: moveArrayItem(member.achievements, achievementIndex, achievementIndex + direction) }
          : member
      )),
    }));
  };

  const updateMemberName = (id, name) => {
    if (!isAdmin) return;
    const nextAccounts = memberAccounts.map((account) => (
      account.id === id ? { ...account, name, updated_at: new Date().toISOString() } : account
    ));
    setMemberAccounts(nextAccounts);
    saveStoredMemberAccounts(nextAccounts);
    updateMemberAccountName(id, name);
  };

  const revokeMember = (id) => {
    if (!canManageMembers) return;
    const account = memberAccounts.find((memberAccount) => memberAccount.id === id);
    requestDeleteConfirmation({
      title: `Revoke ${account?.name || account?.email || "this member"}?`,
      body: "This member will lose access until someone unrevokes their account.",
      actionLabel: "Revoke",
      onConfirm: () => {
        const nextAccounts = memberAccounts.map((memberAccount) => (
          memberAccount.id === id ? { ...memberAccount, status: "revoked", updated_at: new Date().toISOString() } : memberAccount
        ));
        setMemberAccounts(nextAccounts);
        saveStoredMemberAccounts(nextAccounts);
        revokeMemberAccount(id);
      },
    });
  };

  const unrevokeMember = (id) => {
    if (!canManageMembers) return;
    const nextAccounts = memberAccounts.map((account) => (
      account.id === id ? { ...account, status: "active", updated_at: new Date().toISOString() } : account
    ));
    setMemberAccounts(nextAccounts);
    saveStoredMemberAccounts(nextAccounts);
    unrevokeMemberAccount(id);
  };

  const deleteMember = (account) => {
    if (!canManageMembers) return;
    requestDeleteConfirmation({
      title: `Delete ${account.name || account.email}?`,
      body: "This member account will be removed from the members list.",
      onConfirm: () => {
        const nextAccounts = memberAccounts.filter((memberAccount) => memberAccount.id !== account.id);
        setMemberAccounts(nextAccounts);
        saveStoredMemberAccounts(nextAccounts);
        deleteMemberAccount(account.id);
      },
    });
  };

  return (
    <Page className={isEboard ? "max-w-[98rem] py-4 md:py-5" : ""}>
      <div className="mb-3 border-b-4 border-[#CC0000] bg-white px-4 py-4 shadow-[0_16px_45px_rgba(45,41,38,0.08)] md:px-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Eyebrow>Private Hub</Eyebrow>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-[#2D2926] md:text-4xl">
              {hubTitle}
            </h1>
            <p className="mt-2 break-all text-sm font-semibold text-[#6d6560]">{auth.email}</p>
          </div>
          <button onClick={onLogout} className="inline-flex items-center justify-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] md:self-center">
            Log out <LogOut size={15} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#ded8d2] pt-3">
          {isAdmin && (
            <span className="bg-[#2D2926] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.1em] text-white">
              Administrator
            </span>
          )}
          {!isAdmin && auth?.role === "eboard" && (
            <span className="bg-[#CC0000] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.1em] text-white">
              E-Board
            </span>
          )}
          {!isAdmin && canManageMembers && (
            <span className="bg-[#CC0000] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.1em] text-white">
              Member Manager
            </span>
          )}
          <span className={`px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.1em] ${isSupabaseConfigured ? "bg-[#e5f7ec] text-[#0b6b35]" : "bg-[#fff1f1] text-[#8a0000]"}`}>
            {isSupabaseConfigured ? "Database connected" : "Local storage mode"}
          </span>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("member")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "member" ? "bg-[#2D2926] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
        >
          Member Resources
        </button>
        {isEboard && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab("eboard")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "eboard" ? "bg-[#CC0000] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
            >
              E-Board Workspace
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("budsite")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "budsite" ? "bg-[#CC0000] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
            >
              Budsite Editor
            </button>
          </>
        )}
        {canManageMembers && (
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "members" ? "bg-[#2D2926] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
          >
            Members
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={visibleTab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
      {visibleTab === "member" && (
        <div>
          <div className="mb-6 border-b-4 border-[#CC0000] pb-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CC0000]">Members Only</p>
                <h1 className="mt-2 max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-[#2D2926] md:text-5xl">
                  Private BUDS links and debate resources.
                </h1>
              </div>
              <p className="max-w-xl text-sm font-semibold leading-6 text-[#5b5450]">
                Team documents, forms, calendars, and APDA guides for the season.
              </p>
            </div>
            {canEditMemberLinks && (
              <div className="mt-4">
                <SaveNotice notice={editorNotice} />
              </div>
            )}
          </div>
          <div className="grid gap-7">
            {memberLinksBySection.map((group) => (
              <SmoothDetails
                key={group.section}
                className="border border-[#ded8d2] bg-white p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
                defaultOpen={group.section === "BUDS Team Specific Links"}
                title={(
                  <span className="flex w-full items-center justify-between gap-3 border-b-2 border-[#CC0000] pb-2">
                    <span className="text-xl font-black text-[#2D2926]">{group.section}</span>
                    <span className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">{group.links.length} links</span>
                  </span>
                )}
              >
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {group.links.map((link) => (
                    <div
                      key={link.id}
                      draggable={canEditMemberLinks}
                      onDragStart={() => startEditorDrag(`member-link-${group.section}`, link.id)}
                      onDragOver={allowEditorDrop}
                      onDrop={() => dropMemberLink(link.id, group.section)}
                      onDragEnd={finishEditorDrag}
                      className="group flex min-h-[16rem] flex-col border border-[#ded8d2] bg-white p-4 shadow-[0_16px_42px_rgba(45,41,38,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(45,41,38,0.11)] sm:min-h-[19rem] sm:p-5"
                    >
                      <div className="mb-7">
                        <span className="inline-flex bg-[#CC0000] px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white">
                          {group.section === "Forms" ? "Form" : group.section === "Debater Resources" ? "Resource" : "Team Link"}
                        </span>
                      </div>
                      {canEditMemberLinks ? (
                        <>
                          <label className="grid gap-2">
                            <span className="sr-only">Link Name</span>
                            <textarea
                              value={getMemberLinkTitleValue(link)}
                              onChange={(event) => updateMemberLink(link.id, "label", event.target.value)}
                              rows={2}
                              className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-2xl font-black leading-tight tracking-normal text-[#2D2926] outline-none focus:text-[#CC0000]"
                            />
                          </label>
                          <label className="mt-4 grid flex-1 gap-2">
                            <span className="sr-only">Description</span>
                            <textarea
                              value={link.description}
                              onChange={(event) => updateMemberLink(link.id, "description", event.target.value)}
                              rows={4}
                              className="h-full min-h-24 resize-none border-0 bg-transparent p-0 text-base font-medium leading-7 tracking-normal text-[#5b5450] outline-none focus:text-[#2D2926]"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <h3 className="break-words text-2xl font-black leading-tight tracking-normal text-[#2D2926]">
                            <MemberLinkTitle link={link} />
                          </h3>
                          <p className="mt-4 flex-1 text-sm font-medium leading-6 text-[#5b5450] sm:text-base sm:leading-7">{link.description}</p>
                        </>
                      )}
                      <div className="mt-5 grid gap-3">
                        <a href={link.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#CC0000] sm:text-sm sm:tracking-[0.14em]">
                          Open link <ChevronRight className="transition group-hover:translate-x-1" size={18} />
                        </a>
                        {canEditMemberLinks && (
                          <>
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
                            <div className="flex items-center justify-between gap-2 border-t border-[#ded8d2] pt-3">
                              <HelperText>Drag this tile or use buttons to reorder within the section.</HelperText>
                              <ReorderButtons
                                onMoveUp={() => moveMemberLink(link.id, -1, group.section)}
                                onMoveDown={() => moveMemberLink(link.id, 1, group.section)}
                                disabledUp={group.links.findIndex((item) => item.id === link.id) === 0}
                                disabledDown={group.links.findIndex((item) => item.id === link.id) === group.links.length - 1}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SmoothDetails>
            ))}
          </div>
        </div>
      )}

      {visibleTab === "members" && canManageMembers && (
        <Card className="p-5">
          <div className="flex flex-col gap-2 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>{isAdmin ? "Administrator" : "Member Manager"}</Eyebrow>
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
                      No Accepted Member Accounts Yet.
                    </td>
                  </tr>
                )}
                {memberAccounts.map((account) => (
                  <tr key={account.id} className={`${account.status === "revoked" ? "bg-[#d4d0cc] opacity-80" : "bg-white"} border-b border-[#ded8d2]`}>
                    <td className="px-4 py-3 font-black text-[#2D2926]">
                      {isAdmin ? (
                        <input
                          value={account.name}
                          onChange={(event) => updateMemberName(account.id, event.target.value)}
                          className="w-full min-w-40 border border-[#ded8d2] bg-white px-3 py-2 font-black text-[#2D2926] outline-none focus:border-[#CC0000]"
                          aria-label={`Name for ${account.email}`}
                        />
                      ) : (
                        account.name
                      )}
                    </td>
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
                      <div className="flex items-center gap-2">
                        {account.status === "revoked" ? (
                          <button
                            type="button"
                            onClick={() => unrevokeMember(account.id)}
                            className="inline-flex items-center gap-2 bg-[#2D2926] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#48423e]"
                          >
                            Unrevoke
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => revokeMember(account.id)}
                            className="inline-flex items-center gap-2 bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#a90000]"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteMember(account)}
                          className="grid h-9 w-9 place-items-center border border-[#ded8d2] bg-white text-[#2D2926] transition hover:border-[#CC0000] hover:bg-[#fff1f1] hover:text-[#CC0000]"
                          aria-label={`Delete ${account.name || account.email}`}
                          title="Delete member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
            <Card className="relative flex min-h-[28rem] flex-col p-4 sm:min-h-[34rem] sm:p-5">
              <div className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 bg-[#0b6b35] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white transition duration-700 ${agendaCompleteFlash ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
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
                  disabled={!canEditWorkspace || !lastDeletedAgendaItem}
                  className="border border-[#ded8d2] bg-[#f6f4f2] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Undo
                </button>
              </div>

              <form onSubmit={handleAgendaSubmit} className="mb-4 grid gap-2">
                <fieldset disabled={!canEditWorkspace} className="grid gap-2 disabled:opacity-55">
                  <input
                    type="text"
                    value={newAgendaText}
                    onChange={(event) => setNewAgendaText(event.target.value)}
                    placeholder={canEditWorkspace ? "Add agenda item or accountability task" : "E-board-only editing"}
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
                      No Agenda Items Right Now. Add One Above.
                    </div>
                  )}
                  {agenda.map((item) => {
                    const isComplete = Boolean(item.completed_at);
                    return (
                      <div key={item.id} className={`group flex items-start gap-3 border p-3 transition ${isComplete ? "border-[#c9c2bc] bg-[#d4d0cc] opacity-80" : "border-[#ded8d2] bg-[#f6f4f2]"}`}>
                        <label className="flex min-w-0 flex-1 gap-3">
                          <input
                            type="checkbox"
                            checked={isComplete}
                            onChange={() => completeAgendaItem(item)}
                            disabled={!canEditWorkspace}
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
                        <button
                          type="button"
                          onClick={() => removeAgendaItem(item)}
                          disabled={!canEditWorkspace}
                          aria-label={`Delete ${item.text}`}
                          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-[#c9c2bc] bg-white text-[#6d6560] opacity-0 transition hover:border-[#CC0000] hover:text-[#CC0000] focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card className="flex min-h-[28rem] flex-col p-4 sm:min-h-[34rem] sm:p-5">
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
                    step="0.01"
                    value={budget.total}
                    onChange={(event) => updateBudgetTotal(event.target.value)}
                    disabled={!canEditWorkspace}
                    className="w-full bg-transparent text-2xl font-black outline-none disabled:opacity-70"
                  />
                </label>
                <div className="bg-[#f6f4f2] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">Revenue</p>
                  <p className="mt-1 text-2xl font-black text-[#0b6b35]">+{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-[#f6f4f2] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">Remaining Total</p>
                  <p className="mt-1 text-2xl font-black text-[#2D2926]">{formatCurrency(remainingBudget)}</p>
                </div>
              </div>

              <div className="min-h-0 max-h-[24rem] flex-1 overflow-auto pr-1">
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
                            disabled={!canEditWorkspace}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 font-bold text-[#2D2926] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.allocated}
                            onChange={(event) => updateBudgetRow(row.id, "allocated", event.target.value)}
                            disabled={!canEditWorkspace}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 text-[#5b5450] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={row.spent}
                            onChange={(event) => updateBudgetRow(row.id, "spent", event.target.value)}
                            disabled={!canEditWorkspace}
                            className="w-full border border-transparent bg-[#f6f4f2] px-2 py-2 text-[#5b5450] outline-none focus:border-[#CC0000] disabled:opacity-70"
                          />
                        </td>
                        <td className="px-2 py-2">
                          {(() => {
                            const currentStatus = BUDGET_STATUSES.includes(row.status) ? row.status : "On Hold";

                            return (
                              <select
                                value={currentStatus}
                                onChange={(event) => updateBudgetRow(row.id, "status", event.target.value)}
                                disabled={!canEditWorkspace}
                                className={`w-full border border-transparent bg-[#f6f4f2] px-2 py-2 font-bold outline-none focus:border-[#CC0000] disabled:opacity-70 ${getBudgetStatusClassName(currentStatus)}`}
                              >
                                {BUDGET_STATUSES.map((status) => (
                                  <option key={status} value={status} className={getBudgetStatusClassName(status)}>{status}</option>
                                ))}
                              </select>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <form onSubmit={addBudgetRow} className="mt-3 grid gap-2 sm:flex">
                <input
                  type="text"
                  value={newBudgetCategory}
                  onChange={(event) => setNewBudgetCategory(event.target.value)}
                  placeholder={canEditWorkspace ? "New budget category" : "E-board-only editing"}
                  disabled={!canEditWorkspace}
                  className="min-w-0 flex-1 border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                />
                <button type="submit" disabled={!canEditWorkspace} className="bg-[#CC0000] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-40">
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
                    placeholder={canEditWorkspace ? "Revenue category, e.g. Hosted tournament" : "E-board-only editing"}
                    disabled={!canEditWorkspace}
                    className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRevenueAmount}
                    onChange={(event) => updateNewRevenueAmount(event.target.value)}
                    placeholder="Amount"
                    disabled={!canEditWorkspace}
                    className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                  />
                  <button type="submit" disabled={!canEditWorkspace} className="bg-[#0b6b35] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-40">
                    Add Money
                  </button>
                </form>
                <div className="mt-3 grid max-h-52 gap-2 overflow-y-auto pr-1">
                  {(budget.revenueRows || []).length === 0 && (
                    <div className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] p-3 text-sm font-bold text-[#5b5450]">
                      No Revenue Logged Yet.
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
                        disabled={!canEditWorkspace}
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
        </div>
      )}

      {visibleTab === "budsite" && isEboard && (
        <div className="grid gap-5">
          <Card className="relative p-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Eyebrow>Editing Guide</Eyebrow>
                <h2 className="mt-1 text-xl font-black text-[#2D2926]">Change public pages without touching code.</h2>
                <p className="mt-1 text-sm leading-6 text-[#5b5450]">
                  Draft changes stay private until you publish. Preview drafts here, then publish when the page looks right.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <SaveNotice notice={editorNotice} />
                <div className="group relative">
                  <button
                    type="button"
                    aria-label="Show editor manual"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ded8d2] bg-white text-[#CC0000] transition hover:border-[#CC0000] hover:bg-[#fff7f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CC0000]"
                  >
                    <CircleHelp size={18} />
                  </button>
                  <div className="pointer-events-none absolute right-0 top-11 z-20 w-[min(22rem,calc(100vw-3rem))] rounded-md border border-[#ded8d2] bg-white p-4 text-left opacity-0 shadow-xl transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#CC0000]">Editor Manual</p>
                    <div className="mt-3 grid gap-3 text-sm font-semibold leading-6 text-[#5b5450]">
                      <div>
                        <p className="font-black uppercase tracking-[0.08em] text-[#2D2926]">Publishing</p>
                        <p className="mt-1">Public pages do not update until Publish is confirmed. Publishing saves the previous live version as a revision.</p>
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-[0.08em] text-[#2D2926]">Restoring</p>
                        <p className="mt-1">Restore puts an old version into draft only. Preview it, then publish if it should become live.</p>
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-[0.08em] text-[#2D2926]">Photos and APDA</p>
                        <p className="mt-1">E-board photos upload to Supabase Storage. APDA updates should be previewed before applying and publishing.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-y border-[#ded8d2] py-3 lg:grid-cols-3">
              <div className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">1. Draft</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5b5450]">Edit modules below. Changes stay private until published.</p>
              </div>
              <div className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">2. Preview</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5b5450]">Use Preview Draft to check what the public page will look like.</p>
              </div>
              <div className="border-l-4 border-[#CC0000] bg-[#f6f4f2] px-3 py-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">3. Publish</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5b5450]">Review the change summary, confirm, then the live page updates.</p>
              </div>
            </div>
            <div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Publishing Control</p>
            </div>
            <div className="mt-4 grid items-start gap-3 lg:grid-cols-4">
              {contentDashboardItems.map((item) => {
                const isDirty = JSON.stringify(item.draft) !== JSON.stringify(item.published);
                return (
                  <div key={item.id} className="grid gap-2 border border-[#ded8d2] bg-[#f6f4f2] p-3">
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">{isDirty ? "Draft changes" : "Published"}</p>
                      <h3 className="mt-1 text-base font-black leading-tight text-[#2D2926]">{item.title}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <button type="button" onClick={() => setPreviewDraftId(previewDraftId === item.id ? "" : item.id)} className="border border-[#ded8d2] bg-white px-2 py-2 text-[0.62rem] font-black uppercase tracking-[0.06em] text-[#2D2926]">
                        {previewDraftId === item.id ? "Hide Preview" : "Preview Draft"}
                      </button>
                      <button type="button" onClick={() => publishContentDraft(item.id)} disabled={!isDirty} className="bg-[#CC0000] px-2 py-2 text-[0.62rem] font-black uppercase tracking-[0.06em] text-white disabled:cursor-not-allowed disabled:bg-[#bdb6b0]">
                        Publish
                      </button>
                      <a href={item.href} className="inline-flex items-center justify-center border border-[#ded8d2] bg-white px-2 py-2 text-center text-[0.62rem] font-black uppercase tracking-[0.06em] text-[#2D2926]">
                        Live Page
                      </a>
                    </div>
                    <div className="border-t border-[#ded8d2] pt-2">
                      <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#6d6560]">Revision History</p>
                      {(contentRevisions[item.id] || []).length > 0 ? (
                        <div className="grid max-h-[5.5rem] min-h-[2.25rem] gap-1 overflow-y-auto pr-1">
                          {contentRevisions[item.id].map((revision) => (
                            <div key={revision.id} className="grid grid-cols-[1fr_auto] gap-1">
                              <button type="button" onClick={() => restoreContentRevision(item.id, revision)} className="border border-[#ded8d2] bg-white px-2 py-1.5 text-left text-[0.65rem] font-black uppercase tracking-[0.04em] text-[#2D2926] transition hover:border-[#CC0000] hover:bg-[#fff1f1] hover:text-[#CC0000]">
                                Restore {formatMeetingDate(revision.createdAt.slice(0, 10))}
                              </button>
                              <button type="button" onClick={() => deleteContentRevision(item.id, revision)} className="grid h-full min-h-8 w-8 place-items-center border border-[#ded8d2] bg-white text-[#CC0000] transition hover:border-[#CC0000] hover:bg-[#fff1f1]" aria-label={`Delete revision from ${formatMeetingDate(revision.createdAt.slice(0, 10))}`}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="border border-dashed border-[#ded8d2] bg-white px-2 py-2 text-[0.65rem] font-black uppercase tracking-[0.04em] text-[#8f8781]">
                          No revisions yet
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {previewDraftId && (
              <div className="mt-5 max-h-[32rem] overflow-y-auto border border-[#ded8d2] bg-white p-4">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Draft Preview</p>
                {previewDraftId === "trophies" && <TrophiesPage trophiesContent={draftTrophiesContent} />}
                {previewDraftId === "meetings" && <MeetingsPage auth={auth} meetingsContent={draftMeetingsContent} onRequestConfirmation={onRequestConfirmation} />}
                {previewDraftId === "novice" && <NoviceHubPage noviceContent={draftNoviceContent} />}
                {previewDraftId === "eboard" && <EBoardPage eboardContent={draftEboardContent} />}
              </div>
            )}
          </Card>
          <div className="border-b-4 border-[#CC0000] pb-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Meeting Tools</p>
            <h2 className="mt-1 text-xl font-black text-[#2D2926]">Meeting notes and public announcements</h2>
          </div>
          <div className="grid">
            <Card className="flex min-h-0 flex-col p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setNotesEditorOpen((current) => !current)}
                className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
                aria-expanded={notesEditorOpen}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#CC0000]" />
                    <Eyebrow>Budsite Editor</Eyebrow>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Secretary Meeting Notes</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                    Save public meeting notes and choose a past note to preview.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                  {notesEditorOpen ? "Close Notes" : "Open Notes"} <ChevronDown size={16} className={`transition ${notesEditorOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {notesEditorOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5">
                  <form onSubmit={handleNoteSubmit} className="grid gap-4">
                    <fieldset disabled={!canWriteNotes} className="grid gap-4 disabled:opacity-55">
                      <HelperText>Meeting notes publish to the public Meetings page. Use the formatting toolbar for links, lists, and emphasis.</HelperText>
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
                            placeholder={canWriteNotes ? "Budget approvals and novice outreach" : "E-board-only editing"}
                            className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                          />
                        </label>
                      </div>
                      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                        Notes
                        <RichTextEditor
                          value={meetingNotes}
                          onChange={setMeetingNotes}
                          disabled={!canWriteNotes}
                          placeholder={canWriteNotes ? "Type meeting minutes, decisions, votes, next steps, and owner assignments here." : "E-board-only editing"}
                        />
                      </label>
                      <button type="submit" disabled={!canWriteNotes} className="w-fit bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000] disabled:cursor-not-allowed disabled:opacity-40">
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
                        {sortedNotes.length === 0 && <option>No Saved Notes Yet</option>}
                        {sortedNotes.map((note) => (
                          <option key={note.id} value={note.id}>{note.date} - {note.title}</option>
                        ))}
                      </select>
                    </label>
                    {selectedNote && (
                      <div className="mt-3 max-h-[11rem] overflow-y-auto border border-[#ded8d2] bg-[#f6f4f2] p-4">
                        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">{selectedNote.date}</p>
                        <h3 className="mt-2 text-xl font-black text-[#2D2926]">{selectedNote.title}</h3>
                        {selectedNote.body ? (
                          <div
                            className="rich-note mt-3 text-sm leading-6 text-[#5b5450]"
                            dangerouslySetInnerHTML={{ __html: normalizeRichTextForDisplay(selectedNote.body) }}
                          />
                        ) : (
                          <p className="mt-3 text-sm leading-6 text-[#5b5450]">No Notes Body Added.</p>
                        )}
                      </div>
                    )}
                  </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          <Card className="flex min-h-0 flex-col p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setAnnouncementEditorOpen((current) => !current)}
              className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
              aria-expanded={announcementEditorOpen}
            >
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="text-[#CC0000]" />
                  <Eyebrow>Budsite Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Meetings Page Announcement</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Edit the small public announcement block on the Meetings page.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                {announcementEditorOpen ? "Close Announcement" : "Open Announcement"} <ChevronDown size={16} className={`transition ${announcementEditorOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {announcementEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleAnnouncementSubmit} className="mt-5 grid gap-3">
                    <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                      <HelperText>This appears beside the meeting summary. Leave the body blank to show the default announcement message.</HelperText>
                      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                        Announcement Title
                        <input
                          type="text"
                          value={meetingAnnouncement.announcementTitle}
                          onChange={(event) => setMeetingAnnouncement((current) => ({ ...current, announcementTitle: event.target.value }))}
                          className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                        Announcement Body
                        <textarea
                          value={meetingAnnouncement.announcementBody}
                          onChange={(event) => setMeetingAnnouncement((current) => ({ ...current, announcementBody: event.target.value }))}
                          rows={3}
                          className="resize-none border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                        />
                      </label>
                      <button type="submit" className="w-fit bg-[#2D2926] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#CC0000]">
                        Save Announcement
                      </button>
                    </fieldset>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="border-b-4 border-[#CC0000] pb-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Novice Hub Editors</p>
            <h2 className="mt-1 text-xl font-black text-[#2D2926]">Beginner education and FAQ content</h2>
          </div>

          {isAdmin && (
            <Card className="flex min-h-0 flex-col p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setNoviceInfographicEditorOpen((current) => !current)}
                className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
                aria-expanded={noviceInfographicEditorOpen}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <ScrollText className="text-[#CC0000]" />
                    <Eyebrow>Administrator Only</Eyebrow>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Novice Hub Infographic</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                    Edit the speech names, timing, sides, and descriptions in the public APDA Speech Order infographic.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                  {noviceInfographicEditorOpen ? "Close Infographic" : "Open Infographic"} <ChevronDown size={16} className={`transition ${noviceInfographicEditorOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {noviceInfographicEditorOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 grid gap-3">
                      <HelperText>Order controls update the speech number automatically. Keep descriptions short enough to fit the public infographic.</HelperText>
                      {noviceSpeechSteps.map((step, index) => (
                        <div key={step.id} className="grid gap-3 border border-[#ded8d2] bg-[#f6f4f2] p-3">
                          <div className="flex justify-end">
                            <ReorderButtons onMoveUp={() => moveNoviceSpeechStep(index, -1)} onMoveDown={() => moveNoviceSpeechStep(index, 1)} disabledUp={index === 0} disabledDown={index === noviceSpeechSteps.length - 1} />
                          </div>
                          <div className="grid gap-3 lg:grid-cols-[0.35fr_0.6fr_0.7fr_1.25fr]">
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Order
                              <input
                                type="number"
                                min="1"
                                value={step.order}
                                onChange={(event) => updateNoviceSpeechStep(step.id, "order", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Side
                              <select
                                value={step.side}
                                onChange={(event) => updateNoviceSpeechStep(step.id, "side", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              >
                                <option value="gov">Government</option>
                                <option value="opp">Opposition</option>
                              </select>
                            </label>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Icon
                              <select
                                value={step.icon}
                                onChange={(event) => updateNoviceSpeechStep(step.id, "icon", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              >
                                <option value="file">File</option>
                                <option value="help">Question</option>
                                <option value="mic">Speech</option>
                                <option value="scroll">Rebuttal</option>
                              </select>
                            </label>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Time
                              <input
                                value={step.time}
                                onChange={(event) => updateNoviceSpeechStep(step.id, "time", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                          </div>
                          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Title
                            <input
                              value={step.title}
                              onChange={(event) => updateNoviceSpeechStep(step.id, "title", event.target.value)}
                              className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Description
                            <textarea
                              value={step.copy}
                              onChange={(event) => updateNoviceSpeechStep(step.id, "copy", event.target.value)}
                              rows={2}
                              className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Note
                            <input
                              value={step.note || ""}
                              onChange={(event) => updateNoviceSpeechStep(step.id, "note", event.target.value)}
                              placeholder="Optional"
                              className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )}

          <Card className="flex min-h-0 flex-col p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setNoviceFaqEditorOpen((current) => !current)}
              className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
              aria-expanded={noviceFaqEditorOpen}
            >
              <div>
                <div className="flex items-center gap-3">
                  <CircleHelp className="text-[#CC0000]" />
                  <Eyebrow>Budsite Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Novice Hub FAQ</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Add and edit basic debate questions shown publicly on the Novice Hub.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                {noviceFaqEditorOpen ? "Close FAQ" : "Open FAQ"} <ChevronDown size={16} className={`transition ${noviceFaqEditorOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {noviceFaqEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-4">
                    <form onSubmit={handleNoviceFaqSubmit} className="grid gap-3 border border-[#CC0000]/45 bg-white p-3">
                      <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                        <HelperText>Write basic, beginner-facing questions. Avoid duplicating a question that is already listed below.</HelperText>
                        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                          Question
                          <input
                            type="text"
                            value={newNoviceFaq.question}
                            onChange={(event) => setNewNoviceFaq((current) => ({ ...current, question: event.target.value }))}
                            placeholder="What is a tight call?"
                            className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                          Answer
                          <textarea
                            value={newNoviceFaq.answer}
                            onChange={(event) => setNewNoviceFaq((current) => ({ ...current, answer: event.target.value }))}
                            placeholder="Write the answer novices should see."
                            rows={3}
                            className="resize-none border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                          />
                        </label>
                        <button type="submit" className="w-fit bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
                          Add FAQ
                        </button>
                        <FieldWarning>{newNoviceFaqDuplicate ? "This FAQ question already exists." : ""}</FieldWarning>
                      </fieldset>
                    </form>

                    <div className="grid gap-3">
                      {noviceFaqs.map((faq, index) => (
                        <div
                          key={faq.id}
                          draggable={canWriteNotes}
                          onDragStart={() => startEditorDrag("novice-faq", faq.id)}
                          onDragOver={allowEditorDrop}
                          onDrop={() => dropNoviceFaq(faq.id)}
                          onDragEnd={finishEditorDrag}
                          className="grid gap-3 border border-[#ded8d2] bg-[#f6f4f2] p-3"
                        >
                          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Question
                              <input
                                value={faq.question}
                                onChange={(event) => updateNoviceFaq(faq.id, "question", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeNoviceFaq(faq)}
                              className="grid h-10 w-10 place-items-center self-end border border-[#ded8d2] bg-white text-[#CC0000]"
                              aria-label={`Remove ${faq.question}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <ReorderButtons onMoveUp={() => moveNoviceFaq(index, -1)} onMoveDown={() => moveNoviceFaq(index, 1)} disabledUp={index === 0} disabledDown={index === noviceFaqs.length - 1} />
                          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Answer
                            <textarea
                              value={faq.answer}
                              onChange={(event) => updateNoviceFaq(faq.id, "answer", event.target.value)}
                              rows={3}
                              className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="border-b-4 border-[#CC0000] pb-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Public People</p>
            <h2 className="mt-1 text-xl font-black text-[#2D2926]">Current e-board profiles and photos</h2>
          </div>

          <Card className="flex min-h-0 flex-col p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setEboardEditorOpen((current) => !current)}
              className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
              aria-expanded={eboardEditorOpen}
            >
              <div>
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-[#CC0000]" />
                  <Eyebrow>Budsite Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">E-Board Page</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Edit the public officer cards and upload photos for each person.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                {eboardEditorOpen ? "Close E-Board" : "Open E-Board"} <ChevronDown size={16} className={`transition ${eboardEditorOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {eboardEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-4">
                    <form onSubmit={addEboardMember} className="grid gap-3 border border-[#CC0000]/45 bg-white p-3">
                      <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                        <HelperText>Recommended photos are square or portrait images under 2 MB. Name and role are required.</HelperText>
                        <div className="grid gap-3 lg:grid-cols-[0.65fr_0.65fr_1fr]">
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Name
                            <input
                              type="text"
                              value={newEboardMember.name}
                              onChange={(event) => setNewEboardMember((current) => ({ ...current, name: event.target.value }))}
                              placeholder="New officer name"
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Role
                            <input
                              type="text"
                              value={newEboardMember.role}
                              onChange={(event) => setNewEboardMember((current) => ({ ...current, role: event.target.value }))}
                              placeholder="President"
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Photo
                            <span className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f6f4f2] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                              <Upload size={16} /> Upload Photo
                              <input type="file" accept="image/*" onChange={(event) => handleNewEboardPhotoUpload(event.target.files?.[0])} className="sr-only" />
                            </span>
                          </label>
                        </div>
                        <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                          Bio
                          <textarea
                            value={newEboardMember.bio}
                            onChange={(event) => setNewEboardMember((current) => ({ ...current, bio: event.target.value }))}
                            placeholder="Short public bio for this officer."
                            rows={3}
                            className="resize-none border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                          />
                        </label>
                        {newEboardMember.photo && (
                          <div className="grid gap-3 border border-[#ded8d2] bg-[#f6f4f2] p-3 sm:grid-cols-[8rem_1fr] sm:items-center">
                            <img src={newEboardMember.photo} alt="New e-board member preview" className="aspect-[4/3] w-full object-cover" />
                            <button type="button" onClick={() => setNewEboardMember((current) => ({ ...current, photo: "" }))} className="w-fit border border-[#ded8d2] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000]">
                              Remove Photo
                            </button>
                          </div>
                        )}
                        <FieldWarning>{newEboardMemberDuplicate ? "This e-board member already exists." : ""}</FieldWarning>
                        <button type="submit" className="w-fit bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
                          Add Officer
                        </button>
                      </fieldset>
                    </form>

                    <div className="grid gap-4">
                      {eboardMembers.map((member, index) => (
                        <div
                          key={member.id}
                          draggable={canWriteNotes}
                          onDragStart={() => startEditorDrag("eboard-member", member.id)}
                          onDragOver={allowEditorDrop}
                          onDrop={() => dropEboardMember(member.id)}
                          onDragEnd={finishEditorDrag}
                          className="grid gap-4 border border-[#ded8d2] bg-[#f6f4f2] p-3 lg:grid-cols-[12rem_1fr_auto]"
                        >
                          <div className="grid gap-2">
                            <div className="aspect-[4/3] overflow-hidden bg-[#2D2926]">
                              {member.photo ? (
                                <img src={member.photo} alt={`${member.name} preview`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="grid h-full place-items-center text-2xl font-black text-white">
                                  {getInitials(member.name || member.role || "BU")}
                                </div>
                              )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-[#ded8d2] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                              <Upload size={14} /> Change
                              <input type="file" accept="image/*" onChange={(event) => handleEboardPhotoUpload(member.id, event.target.files?.[0])} disabled={!canWriteNotes} className="sr-only" />
                            </label>
                            {member.photo && (
                              <button type="button" onClick={() => updateEboardMember(member.id, "photo", "")} disabled={!canWriteNotes} className="border border-[#ded8d2] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000] disabled:opacity-40">
                                Remove Photo
                              </button>
                            )}
                          </div>
                          <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Name
                                <input
                                  value={member.name}
                                  onChange={(event) => updateEboardMember(member.id, "name", event.target.value)}
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                                />
                              </label>
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Role
                                <input
                                  value={member.role}
                                  onChange={(event) => updateEboardMember(member.id, "role", event.target.value)}
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                                />
                              </label>
                            </div>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Bio
                              <textarea
                                value={member.bio}
                                onChange={(event) => updateEboardMember(member.id, "bio", event.target.value)}
                                rows={4}
                                className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                          </fieldset>
                          <button
                            type="button"
                            onClick={() => removeEboardMember(member)}
                            disabled={!canWriteNotes}
                            className="grid h-10 w-10 place-items-center border border-[#ded8d2] bg-white text-[#CC0000] disabled:opacity-40 lg:self-start"
                            aria-label={`Remove ${member.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="lg:col-start-3 lg:row-start-2">
                            <ReorderButtons onMoveUp={() => moveEboardMember(index, -1)} onMoveDown={() => moveEboardMember(index, 1)} disabledUp={index === 0} disabledDown={index === eboardMembers.length - 1} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="border-b-4 border-[#CC0000] pb-2">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Trophies / APDA</p>
            <h2 className="mt-1 text-xl font-black text-[#2D2926]">Results, achievements, and standings updates</h2>
          </div>

          <Card className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
              <button
                type="button"
                onClick={() => setTrophyEditorOpen((current) => !current)}
                className="min-w-0 flex-1 text-left"
                aria-expanded={trophyEditorOpen}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="text-[#CC0000]" />
                  <Eyebrow>Trophies Page Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Add and Update Public Achievements</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Changes save to the public Trophies page. Use one highlight per line for tournament entries.
                </p>
              </button>
              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href="/trophies"
                  className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
                >
                  Preview <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => setTrophyEditorOpen((current) => !current)}
                  className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
                  aria-expanded={trophyEditorOpen}
                >
                  {trophyEditorOpen ? "Close Editor" : "Open Editor"} <ChevronDown size={16} className={`transition ${trophyEditorOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {trophyEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5">
                    <div className="mb-5 flex flex-wrap gap-2">
                      {[
                        ["stats", "Top Stats"],
                        ["accomplishments", "Accomplishments"],
                        ["milestones", "Milestones"],
                        ["members", "Individual Achievements"],
                        ["results", "Seasons / Results"],
                        ["apda", "APDA Update"],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setTrophyEditorSection(id)}
                          className={`border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${trophyEditorSection === id ? "border-[#CC0000] bg-[#CC0000] text-white" : "border-[#ded8d2] bg-white text-[#2D2926] hover:border-[#CC0000] hover:text-[#CC0000]"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {trophyEditorSection === "apda" && (
                    <div className="mb-5 border border-[#ded8d2] bg-[#f6f4f2] p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-[#CC0000]" />
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Safe APDA Update</p>
                          </div>
                          <h3 className="mt-2 text-xl font-black text-[#2D2926]">Pull standings, review, then apply.</h3>
                          <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                            This creates a preview from APDA before saving anything. Applying the preview updates APDA-managed stats, accomplishments, the selected season timeline, and member achievement cards.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={pullApdaTrophiesPreview}
                          disabled={apdaUpdateStatus.state === "loading"}
                          className="inline-flex items-center justify-center gap-2 bg-[#2D2926] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#CC0000] disabled:cursor-wait disabled:opacity-55"
                        >
                          <RefreshCw size={15} className={apdaUpdateStatus.state === "loading" ? "animate-spin" : ""} />
                          {apdaUpdateStatus.state === "loading" ? "Pulling APDA" : "Update from APDA"}
                        </button>
                      </div>
                      {apdaUpdateStatus.message && (
                        <p className={`mt-3 border-l-4 px-3 py-2 text-sm font-bold ${
                          apdaUpdateStatus.state === "error"
                            ? "border-[#CC0000] bg-[#fff1f1] text-[#8a0000]"
                            : "border-[#2D2926] bg-white text-[#5b5450]"
                        }`}>
                          {apdaUpdateStatus.message}
                        </p>
                      )}
                      {apdaUpdatePreview && (
                        <div className="mt-4 grid gap-4 border border-[#ded8d2] bg-white p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Review Required</p>
                              <h4 className="mt-1 text-lg font-black text-[#2D2926]">{apdaUpdatePreview.seasonDisplay} proposed update</h4>
                              <p className="mt-1 text-sm leading-6 text-[#5b5450]">
                                Source: <a href={apdaUpdatePreview.sourceUrl} className="font-black text-[#CC0000] underline">APDA Boston University standings</a>
                              </p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-4">
                              <div className="border border-[#ded8d2] p-2 text-center">
                                <p className="text-lg font-black">{apdaUpdatePreview.summary.tournamentCount}</p>
                                <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#6d6560]">Tournaments</p>
                              </div>
                              <div className="border border-[#ded8d2] p-2 text-center">
                                <p className="text-lg font-black">{apdaUpdatePreview.summary.highlightCount}</p>
                                <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#6d6560]">Highlights</p>
                              </div>
                              <div className="border border-[#ded8d2] p-2 text-center">
                                <p className="text-lg font-black">{apdaUpdatePreview.summary.memberCount}</p>
                                <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#6d6560]">Members</p>
                              </div>
                              <div className="border border-[#ded8d2] p-2 text-center">
                                <p className="text-lg font-black">{apdaUpdatePreview.summary.cotyContributorCount}</p>
                                <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#6d6560]">COTY</p>
                              </div>
                            </div>
                          </div>
                          {apdaUpdatePreview.warnings?.map((warning) => (
                            <p key={warning} className="border-l-4 border-[#CC0000] bg-[#fff1f1] px-3 py-2 text-sm font-bold text-[#8a0000]">
                              {warning}
                            </p>
                          ))}
                          <div className="grid gap-3 xl:grid-cols-2">
                            <div className="border border-[#ded8d2] bg-[#f6f4f2] p-3">
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2D2926]">Stats and accomplishments to update</p>
                              <div className="mt-3 grid gap-2">
                                {apdaUpdatePreview.stats.map((stat) => (
                                  <div key={stat.id} className="border border-[#ded8d2] bg-white p-2 text-sm">
                                    <span className="font-black">{stat.value}</span> {stat.label} <span className="text-[#6d6560]">({stat.detail})</span>
                                  </div>
                                ))}
                                {apdaUpdatePreview.accomplishments.map((item) => (
                                  <div key={item.id} className="border border-[#ded8d2] bg-white p-2 text-sm font-bold">
                                    {item.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="border border-[#ded8d2] bg-[#f6f4f2] p-3">
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2D2926]">Timeline preview</p>
                              <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto pr-1">
                                {apdaUpdatePreview.resultSeason.results.slice(0, 8).map((result) => (
                                  <div key={result.id} className="border border-[#ded8d2] bg-white p-2">
                                    <p className="text-xs font-black text-[#CC0000]">{result.date}</p>
                                    <p className="text-sm font-black text-[#2D2926]">{result.tournament}</p>
                                    <ul className="mt-1 list-disc pl-5 text-xs leading-5 text-[#5b5450]">
                                      {result.highlights.slice(0, 4).map((highlight) => (
                                        <li key={highlight}>{highlight}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setApdaUpdatePreview(null);
                                setApdaUpdateStatus({ state: "idle", message: "APDA preview dismissed. No changes were saved." });
                              }}
                              className="border border-[#ded8d2] bg-[#f6f4f2] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]"
                            >
                              Dismiss Preview
                            </button>
                            <button
                              type="button"
                              onClick={applyApdaTrophiesPreview}
                              className="bg-[#CC0000] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]"
                            >
                              Apply Reviewed Changes
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    )}
            <div className="columns-1 gap-5 xl:columns-2">
              {trophyEditorSection === "stats" && (
              <SmoothDetails title="Top Stats" className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <form onSubmit={addTrophyStat} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <HelperText>Use short public stats. Labels that come from APDA may be overwritten by the APDA updater.</HelperText>
                  <div className="grid gap-2 2xl:grid-cols-[0.45fr_0.8fr_1fr_auto]">
                    <input value={newTrophyStat.value} onChange={(event) => setNewTrophyStat((current) => ({ ...current, value: event.target.value }))} placeholder="#4" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyStat.label} onChange={(event) => setNewTrophyStat((current) => ({ ...current, label: event.target.value }))} placeholder="Label" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyStat.detail} onChange={(event) => setNewTrophyStat((current) => ({ ...current, detail: event.target.value }))} placeholder="Detail" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                  <FieldWarning>{newTrophyStatDuplicate ? "A top stat with this label already exists." : ""}</FieldWarning>
                </form>
                <div className="grid gap-2">
                  {draftTrophiesContent.stats.map((stat, index) => (
                    <div
                      key={stat.id}
                      draggable
                      onDragStart={() => startEditorDrag("trophy-stats", stat.id)}
                      onDragOver={allowEditorDrop}
                      onDrop={() => dropTrophyItem("stats", stat.id)}
                      onDragEnd={finishEditorDrag}
                      className="grid gap-2 border border-[#ded8d2] bg-white p-3 2xl:grid-cols-[0.35fr_0.75fr_1fr_auto]"
                    >
                      <input value={stat.value} onChange={(event) => updateTrophyItem("stats", stat.id, "value", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                      <input value={stat.label} onChange={(event) => updateTrophyItem("stats", stat.id, "label", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000]" />
                      <input value={stat.detail} onChange={(event) => updateTrophyItem("stats", stat.id, "detail", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                      <div className="flex items-center gap-2">
                        <ReorderButtons onMoveUp={() => moveTrophyItem("stats", index, -1)} onMoveDown={() => moveTrophyItem("stats", index, 1)} disabledUp={index === 0} disabledDown={index === draftTrophiesContent.stats.length - 1} />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${stat.label}?`, body: "This stat will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("stats", stat.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${stat.label}`}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </SmoothDetails>
              )}

              {trophyEditorSection === "accomplishments" && (
              <SmoothDetails title="Accomplishments List" className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <form onSubmit={addTrophyAccomplishment} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3 2xl:grid-cols-[1fr_auto]">
                  <input value={newTrophyAccomplishment} onChange={(event) => setNewTrophyAccomplishment(event.target.value)} placeholder="Add accomplishment line" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  <div className="2xl:col-span-2">
                    <HelperText>Keep these as short public bullet points. APDA-managed lines may be replaced when the updater runs.</HelperText>
                    <FieldWarning>{newTrophyAccomplishmentDuplicate ? "This accomplishment already exists." : ""}</FieldWarning>
                  </div>
                </form>
                <div className="grid gap-2">
                  {draftTrophiesContent.accomplishments.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => startEditorDrag("trophy-accomplishments", item.id)}
                      onDragOver={allowEditorDrop}
                      onDrop={() => dropTrophyItem("accomplishments", item.id)}
                      onDragEnd={finishEditorDrag}
                      className="grid gap-2 border border-[#ded8d2] bg-white p-3 2xl:grid-cols-[1fr_auto]"
                    >
                      <input value={item.text} onChange={(event) => updateTrophyItem("accomplishments", item.id, "text", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000]" />
                      <div className="flex items-center gap-2">
                        <ReorderButtons onMoveUp={() => moveTrophyItem("accomplishments", index, -1)} onMoveDown={() => moveTrophyItem("accomplishments", index, 1)} disabledUp={index === 0} disabledDown={index === draftTrophiesContent.accomplishments.length - 1} />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: "Delete this accomplishment?", body: item.text, onConfirm: () => removeTrophyItem("accomplishments", item.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${item.text}`}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </SmoothDetails>
              )}

              {trophyEditorSection === "milestones" && (
              <SmoothDetails title="Milestone Cards" className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <form onSubmit={addTrophyMilestone} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <HelperText>Use milestones for longer historical cards that should not be overwritten by APDA updates.</HelperText>
                  <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                    <input value={newTrophyMilestone.year} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, year: event.target.value }))} placeholder="Year" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyMilestone.title} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                  <textarea value={newTrophyMilestone.copy} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, copy: event.target.value }))} placeholder="Short description" rows={2} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <FieldWarning>{newTrophyMilestoneDuplicate ? "A milestone with this title already exists." : ""}</FieldWarning>
                </form>
                <div className="grid gap-2">
                  {draftTrophiesContent.milestones.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => startEditorDrag("trophy-milestones", item.id)}
                      onDragOver={allowEditorDrop}
                      onDrop={() => dropTrophyItem("milestones", item.id)}
                      onDragEnd={finishEditorDrag}
                      className="grid gap-2 border border-[#ded8d2] bg-white p-3"
                    >
                      <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                        <input value={item.year} onChange={(event) => updateTrophyItem("milestones", item.id, "year", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                        <input value={item.title} onChange={(event) => updateTrophyItem("milestones", item.id, "title", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000]" />
                        <div className="flex items-center gap-2">
                          <ReorderButtons onMoveUp={() => moveTrophyItem("milestones", index, -1)} onMoveDown={() => moveTrophyItem("milestones", index, 1)} disabledUp={index === 0} disabledDown={index === draftTrophiesContent.milestones.length - 1} />
                          <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${item.title}?`, body: "This milestone card will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("milestones", item.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${item.title}`}><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <textarea value={item.copy} onChange={(event) => updateTrophyItem("milestones", item.id, "copy", event.target.value)} rows={2} className="resize-none border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    </div>
                  ))}
                </div>
              </SmoothDetails>
              )}

              {trophyEditorSection === "members" && (
              <SmoothDetails title="Current Member Achievements" className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <form onSubmit={addTrophyMemberAchievement} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <HelperText>Add one achievement at a time. Only administrators can create or rename member cards; e-board can add achievements to existing people.</HelperText>
                  <div className="grid gap-2 2xl:grid-cols-[1fr_0.75fr_auto]">
                    {isAdmin ? (
                      <input value={newTrophyMember.name} onChange={(event) => setNewTrophyMember((current) => ({ ...current, name: event.target.value }))} placeholder="Member name" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    ) : (
                      <select value={newTrophyMember.name} onChange={(event) => setNewTrophyMember((current) => ({ ...current, name: event.target.value }))} className="border border-[#ded8d2] bg-white px-3 py-2 text-sm outline-none focus:border-[#CC0000]">
                        <option value="">Choose member</option>
                        {draftTrophiesContent.members.map((member) => (
                          <option key={member.id} value={member.name}>{member.name}</option>
                        ))}
                      </select>
                    )}
                    <input value={newTrophyMember.meta} onChange={(event) => setNewTrophyMember((current) => ({ ...current, meta: event.target.value }))} placeholder="Meta, optional" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                  <textarea value={newTrophyMember.achievement} onChange={(event) => setNewTrophyMember((current) => ({ ...current, achievement: event.target.value }))} placeholder="Achievement to add to this member" rows={2} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                </form>
                <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
                  {draftTrophiesContent.members.map((member, memberIndex) => (
                    <div
                      key={member.id}
                      draggable
                      onDragStart={() => startEditorDrag("trophy-members", member.id)}
                      onDragOver={allowEditorDrop}
                      onDrop={() => dropTrophyItem("members", member.id)}
                      onDragEnd={finishEditorDrag}
                      className="grid gap-2 border border-[#ded8d2] bg-white p-3"
                    >
                      <div className="grid gap-2 2xl:grid-cols-[1fr_0.75fr_auto]">
                        <input value={member.name} onChange={(event) => updateTrophyItem("members", member.id, "name", event.target.value)} disabled={!isAdmin} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f6f4f2] disabled:text-[#8f8781]" />
                        <input value={member.meta} onChange={(event) => updateTrophyItem("members", member.id, "meta", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                        <div className="flex items-center gap-2">
                          <ReorderButtons onMoveUp={() => moveTrophyItem("members", memberIndex, -1)} onMoveDown={() => moveTrophyItem("members", memberIndex, 1)} disabledUp={memberIndex === 0} disabledDown={memberIndex === draftTrophiesContent.members.length - 1} />
                          <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${member.name}?`, body: "This member achievement card will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("members", member.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${member.name}`}><Trash2 size={16} /></button>
                        </div>
                      </div>
                      {member.achievements.map((achievement, index) => (
                        <div key={`${member.id}-${index}`} className="grid gap-2 2xl:grid-cols-[1fr_auto]">
                          <input value={achievement} onChange={(event) => updateTrophyMemberAchievement(member.id, index, event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                          <div className="flex items-center gap-2">
                            <ReorderButtons onMoveUp={() => moveTrophyMemberAchievement(member.id, index, -1)} onMoveDown={() => moveTrophyMemberAchievement(member.id, index, 1)} disabledUp={index === 0} disabledDown={index === member.achievements.length - 1} />
                            <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete achievement for ${member.name}?`, body: achievement, onConfirm: () => removeTrophyMemberAchievement(member.id, index) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove achievement for ${member.name}`}><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </SmoothDetails>
              )}
            </div>

            {trophyEditorSection === "results" && (
            <SmoothDetails title="Tournament Results Timeline" className="mt-5 border border-[#ded8d2] bg-white p-3">
              <form onSubmit={addTrophyResultSeason} className="grid gap-2 border border-[#ded8d2] bg-[#f6f4f2] p-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={newTrophySeason}
                  onChange={(event) => setNewTrophySeason(event.target.value)}
                  placeholder="Add season, e.g. 2027-2028"
                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm outline-none focus:border-[#CC0000]"
                />
                <button type="submit" className="bg-[#2D2926] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
                  Add Season
                </button>
                <div className="sm:col-span-2">
                  <HelperText>Use seasons like 2026-2027. The most recent season should stay selected before using APDA update.</HelperText>
                </div>
              </form>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                  Season
                  <select
                    value={selectedTrophySeasonIdValue}
                    onChange={(event) => setSelectedTrophySeasonId(event.target.value)}
                    className="border border-[#ded8d2] bg-[#f6f4f2] px-3 py-2 text-sm font-bold normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                  >
                    {trophyResultSeasons.map((season) => (
                      <option key={season.id} value={season.id}>{season.label}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={removeTrophyResultSeason}
                  disabled={!selectedTrophySeasonIdValue}
                  className="self-end border border-[#ded8d2] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000] transition hover:border-[#CC0000] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Delete Season
                </button>
              </div>
              <form onSubmit={addTrophyResult} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                <HelperText>Use one highlight per line. Keep wording consistent with the public Trophies page.</HelperText>
                <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                  <input type="date" value={newTrophyResult.date} onChange={(event) => setNewTrophyResult((current) => ({ ...current, date: event.target.value }))} className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <input value={newTrophyResult.tournament} onChange={(event) => setNewTrophyResult((current) => ({ ...current, tournament: event.target.value }))} placeholder="Tournament name" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                </div>
                <textarea value={newTrophyResult.highlights} onChange={(event) => setNewTrophyResult((current) => ({ ...current, highlights: event.target.value }))} placeholder="One highlight per line" rows={4} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                <FieldWarning>{newTrophyResultDuplicate ? "This tournament already exists in the selected season." : ""}</FieldWarning>
              </form>
              <div className="grid gap-2">
                {(selectedTrophySeason?.results || []).length === 0 && (
                  <div className="border border-dashed border-[#ded8d2] bg-[#f6f4f2] p-3 text-sm font-bold text-[#5b5450]">
                    No results logged for this season yet.
                  </div>
                )}
                {[...(selectedTrophySeason?.results || [])].reverse().map((result) => {
                  const originalIndex = (selectedTrophySeason?.results || []).findIndex((item) => item.id === result.id);
                  return (
                  <div
                    key={result.id}
                    draggable
                    onDragStart={() => startEditorDrag("trophy-result", result.id)}
                    onDragOver={allowEditorDrop}
                    onDrop={() => dropTrophyResult(result.id)}
                    onDragEnd={finishEditorDrag}
                    className="grid gap-2 border border-[#ded8d2] bg-white p-3"
                  >
                    <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                      <input type="date" value={result.date} onChange={(event) => updateTrophyResult(result.id, "date", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                      <input value={result.tournament} onChange={(event) => updateTrophyResult(result.id, "tournament", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                      <div className="flex items-center gap-2">
                        <ReorderButtons onMoveUp={() => moveTrophyResult(result.id, 1)} onMoveDown={() => moveTrophyResult(result.id, -1)} disabledUp={originalIndex === (selectedTrophySeason?.results || []).length - 1} disabledDown={originalIndex === 0} />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${result.tournament}?`, body: "This tournament entry and its highlights will be removed from the public Trophies page.", onConfirm: () => removeTrophyResult(result.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${result.tournament}`}><Trash2 size={16} /></button>
                      </div>
                    </div>
                    {result.highlights.map((highlight, index) => (
                      <div key={`${result.id}-${index}`} className="grid gap-2 2xl:grid-cols-[1fr_auto]">
                        <input value={highlight} onChange={(event) => updateTrophyResultHighlight(result.id, index, event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                        <div className="flex items-center gap-2">
                          <ReorderButtons onMoveUp={() => moveTrophyResultHighlight(result.id, index, -1)} onMoveDown={() => moveTrophyResultHighlight(result.id, index, 1)} disabledUp={index === 0} disabledDown={index === result.highlights.length - 1} />
                          <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete highlight from ${result.tournament}?`, body: highlight, onConfirm: () => removeTrophyResultHighlight(result.id, index) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove highlight from ${result.tournament}`}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  );
                })}
              </div>
            </SmoothDetails>
            )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}

function NotFoundPage() {
  return (
    <Page>
      <Card className="mx-auto max-w-2xl text-center">
        <Eyebrow>Page Not Found</Eyebrow>
        <h1 className="mt-4 text-4xl font-black text-[#2D2926]">That Page Is Not Part of BUDS Yet.</h1>
        <PrimaryButton href="/" className="mt-8">
          Back Home <ArrowRight size={16} />
        </PrimaryButton>
      </Card>
    </Page>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [trophiesContent, setTrophiesContent] = useState(() => getStoredTrophiesContent());
  const [meetingsContent, setMeetingsContent] = useState(() => getStoredMeetingsContent());
  const [noviceContent, setNoviceContent] = useState(() => getStoredNoviceContent());
  const [eboardContent, setEboardContent] = useState(() => getStoredEboardContent());
  const [confirmation, setConfirmation] = useState(null);

  const calendarEmbedUrl = useMemo(() => {
    return "https://calendar.google.com/calendar/embed?src=c_2be8297a9561724f2234792e9cd68ed9f2fc5d6c6be910056b5a728d5098cf7%40group.calendar.google.com&ctz=America%2FNew_York";
  }, []);

  useEffect(() => {
    const updatePath = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function hydrateSiteContent() {
      const [databaseTrophiesContent, databaseMeetingsContent, databaseNoviceContent, databaseEboardContent] = await Promise.all([
        loadTrophiesContent(),
        loadMeetingsContent(),
        loadNoviceContent(),
        loadEboardContent(),
      ]);
      if (ignore) return;
      if (databaseTrophiesContent) {
        setTrophiesContent(databaseTrophiesContent);
        saveStoredTrophiesContent(databaseTrophiesContent);
      }
      if (databaseMeetingsContent) {
        setMeetingsContent(databaseMeetingsContent);
        saveStoredMeetingsContent(databaseMeetingsContent);
      }
      if (databaseNoviceContent) {
        setNoviceContent(databaseNoviceContent);
        saveStoredNoviceContent(databaseNoviceContent);
      }
      if (databaseEboardContent) {
        setEboardContent(databaseEboardContent);
        saveStoredEboardContent(databaseEboardContent);
      }
    }

    hydrateSiteContent();

    return () => {
      ignore = true;
    };
  }, []);

  const updateTrophiesContent = useCallback((nextContent) => {
    setTrophiesContent(nextContent);
    saveStoredTrophiesContent(nextContent);
    upsertTrophiesContent(nextContent);
  }, []);

  const updateMeetingsContent = useCallback((nextContent) => {
    setMeetingsContent(nextContent);
    saveStoredMeetingsContent(nextContent);
    upsertMeetingsContent(nextContent);
  }, []);

  const updateNoviceContent = useCallback((nextContent) => {
    setNoviceContent(nextContent);
    saveStoredNoviceContent(nextContent);
    upsertNoviceContent(nextContent);
  }, []);

  const updateEboardContent = useCallback((nextContent) => {
    setEboardContent(nextContent);
    saveStoredEboardContent(nextContent);
    upsertEboardContent(nextContent);
  }, []);

  const requestConfirmation = useCallback(({ title, body, actionLabel = "Delete", onConfirm }) => {
    setConfirmation({ title, body, actionLabel, onConfirm });
  }, []);

  const confirmAction = useCallback(() => {
    confirmation?.onConfirm?.();
    setConfirmation(null);
  }, [confirmation]);

  const page = useMemo(() => {
    switch (path) {
      case "/":
        return <HomePage />;
      case "/about":
        return <AboutPage />;
      case "/novice-hub":
        return <NoviceHubPage noviceContent={noviceContent} />;
      case "/calendar":
        return <CalendarPage calendarEmbedUrl={calendarEmbedUrl} />;
      case "/meetings":
        return <MeetingsPage auth={auth} meetingsContent={meetingsContent} onRequestConfirmation={requestConfirmation} />;
      case "/history":
        return <HistoryPage />;
      case "/trophies":
        return <TrophiesPage trophiesContent={trophiesContent} />;
      case "/eboard":
        return <EBoardPage eboardContent={eboardContent} />;
      case "/contact":
        return <ContactPage />;
      case "/join":
        return <JoinPage auth={auth} onRequestConfirmation={requestConfirmation} />;
      case "/login":
        return <LoginPage onLogin={setAuth} />;
      case "/hub":
        return <PrivateHubPage auth={auth} trophiesContent={trophiesContent} meetingsContent={meetingsContent} noviceContent={noviceContent} eboardContent={eboardContent} onTrophiesContentChange={updateTrophiesContent} onMeetingsContentChange={updateMeetingsContent} onNoviceContentChange={updateNoviceContent} onEboardContentChange={updateEboardContent} onRequestConfirmation={requestConfirmation} onLogout={() => {
          clearStoredAuth();
          setAuth(null);
          navigateTo("/login");
        }} />;
      default:
        return <NotFoundPage />;
    }
  }, [auth, calendarEmbedUrl, eboardContent, meetingsContent, noviceContent, path, requestConfirmation, trophiesContent, updateEboardContent, updateMeetingsContent, updateNoviceContent, updateTrophiesContent]);

  return (
    <main className="min-h-screen bg-[#eeeae6] text-[#2D2926]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(45,41,38,0.045)_1px,transparent_1px),linear-gradient(rgba(45,41,38,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <header className="sticky top-0 z-50 border-b border-[#ded8d2] bg-white/95 shadow-[0_10px_28px_rgba(45,41,38,0.07)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[98rem] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <SiteLink href="/" className="group flex min-w-0 items-center gap-3">
            <img
              src="/buds-logo.png"
              alt="BU Debate Society logo"
              className="h-14 w-14 shrink-0 rounded-sm object-cover shadow-sm transition group-hover:brightness-95"
            />
            <div className="min-w-0 border-l border-[#ded8d2] pl-3">
              <p className="text-xl font-black uppercase leading-none tracking-[0.18em] text-[#2D2926]">BUDS</p>
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
                  className={`whitespace-nowrap rounded-sm border px-2.5 py-2 text-sm font-extrabold transition lg:px-3.5 ${
                    active
                      ? "border-[#2D2926] bg-[#2D2926] text-white shadow-[0_8px_18px_rgba(45,41,38,0.14)]"
                      : "border-transparent text-[#4b4541] hover:border-[#c9c7c3] hover:bg-white hover:text-[#2D2926] hover:shadow-sm"
                  }`}
                >
                  {item.label}
                </SiteLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex lg:gap-3">
            <PrimaryButton href="/join" className="rounded-sm px-4 lg:px-6">
              Join <ArrowRight size={16} />
            </PrimaryButton>
            <SecondaryButton href={auth ? "/hub" : "/login"} className="rounded-sm bg-[#fbfaf9] px-4 lg:px-6">
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

      <ConfirmationModal
        confirmation={confirmation}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmAction}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
