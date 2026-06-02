import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bold,
  BookOpenText,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  CircleHelp,
  ClipboardList,
  DollarSign,
  ExternalLink,
  FileText,
  Filter,
  Gavel,
  Handshake,
  Heart,
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
  Plane,
  RefreshCw,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trash2,
  Trophy,
  Underline,
  Upload,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
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
  HOME_CAROUSEL_CAPTION_MAX_LENGTH,
  MEMBER_ACCOUNT_ROLES,
  MEMBER_MANAGER_EMAILS,
  MEMBERSHIP_REQUEST_STATUSES,
  RESERVED_ACCOUNT_EMAILS,
  TITLE_EDITING_TOGGLE_EMAIL,
} from "./data/config";
import {
  apdaSourceUrl,
  defaultBudsiteEditorSectionTitles,
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
  findMemberAccountByEmail,
  findMembershipRequestByEmail,
  insertMembershipRequest,
  insertNote,
  loadAboutContent,
  loadContentRevisions,
  loadEboardContent,
  loadHomeContent,
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
  upsertAdminControlSettings,
  upsertAboutContent,
  upsertBudgetRevenueRow,
  upsertBudgetRow,
  upsertBudgetSettings,
  upsertBudsiteEditorSectionTitles,
  upsertContentRevisions,
  upsertEboardContent,
  upsertHomeContent,
  upsertMeetingsContent,
  upsertMemberAccount,
  upsertNoviceContent,
  upsertPrivateLink,
  upsertTrophiesContent,
  uploadPublicImage,
} from "./lib/supabaseData";
import {
  clearStoredAuth,
  getStoredAboutContent,
  getStoredAgenda,
  getStoredAuth,
  getStoredBudget,
  getStoredEboardContent,
  getStoredHomeContent,
  getStoredMemberAccounts,
  getStoredMeetingsContent,
  getStoredMembershipRequests,
  getStoredNoviceContent,
  getStoredNotes,
  getStoredPrivateLinks,
  getStoredTrophiesContent,
  normalizeAboutContent,
  normalizeEboardContent,
  normalizeHomeContent,
  normalizeMeetingsContent,
  normalizeBudsiteEditorSectionTitles,
  normalizeAdminControlSettings,
  normalizeNoviceContent,
  normalizeTrophiesContent,
  saveStoredAgenda,
  saveStoredAuth,
  saveStoredAboutContent,
  saveStoredBudget,
  saveStoredEboardContent,
  saveStoredHomeContent,
  saveStoredMemberAccounts,
  saveStoredMeetingsContent,
  saveStoredMembershipRequests,
  saveStoredNoviceContent,
  saveStoredNotes,
  saveStoredPrivateLinks,
  saveStoredTrophiesContent,
} from "./lib/storage";

function HomePage({ homeContent }) {
  const carouselSlides = normalizeHomeContent(homeContent).carouselSlides;
  const [activeCommunityIndex, setActiveCommunityIndex] = useState(0);
  const [communityDirection, setCommunityDirection] = useState(1);
  const [isCommunityPaused, setIsCommunityPaused] = useState(false);
  const featureItems = [
    { icon: "/icons/users.svg", title: "Open to all majors", body: "and experience levels" },
    { icon: "/icons/calendar.svg", title: "Weekly meetings", body: "& flexible schedule" },
    { icon: "/icons/trophy.svg", title: "Travel, compete,", body: "and make friends" },
    { icon: "/icons/heart.svg", title: "Supportive community", body: "that has your back" },
  ];
  const pathwaySteps = [
    { icon: BookOpenText, title: "Read Novice Hub", body: "Learn the basics at your own pace." },
    { icon: UsersRound, title: "Come to Practice", body: "No pressure, just come and observe!" },
    { icon: Handshake, title: "Find a Partner", body: "We'll help you find the right partner." },
    { icon: Trophy, title: "Try a Tournament", body: "Jump in and have fun competing!" },
  ];
  const communityIconCycle = [Users, Plane, TrendingUp, Trophy];
  const communityFallbacks = [
    { title: "Build Lifelong Friendships", body: "Find a close-knit team that supports you through practices, tournaments, and everything in between." },
    { title: "Travel & Compete", body: "Represent BU at tournaments, explore new campuses, and make memories with teammates on the road." },
    { title: "Grow Your Skills", body: "Think critically, speak confidently, and learn how to build arguments under pressure." },
    { title: "Be Part of Our Legacy", body: "Join a tradition of competitive excellence and help carry Boston University debate forward." },
  ];
  const communitySlides = carouselSlides.length ? carouselSlides : normalizeHomeContent().carouselSlides;
  const communityCards = communitySlides.map((slide, index) => ({
    icon: communityIconCycle[index % communityIconCycle.length],
    title: slide.kicker || communityFallbacks[index % communityFallbacks.length].title,
    body: slide.caption || communityFallbacks[index % communityFallbacks.length].body,
    image: slide.src || communitySlides.find((item) => item.src)?.src || "",
    alt: slide.alt || slide.kicker || "BUDS community photo",
  }));
  const safeCommunityIndex = Math.min(activeCommunityIndex, communityCards.length - 1);
  const activeCommunityCard = communityCards[safeCommunityIndex] || communityCards[0];
  const ActiveCommunityIcon = activeCommunityCard.icon;
  const selectCommunityCard = (index) => {
    if (index === safeCommunityIndex) return;
    setCommunityDirection(index > safeCommunityIndex ? 1 : -1);
    setActiveCommunityIndex(index);
  };
  const rotateCommunityCard = (direction) => {
    setCommunityDirection(direction);
    setActiveCommunityIndex((current) => (current + direction + communityCards.length) % communityCards.length);
  };
  useEffect(() => {
    if (isCommunityPaused) return undefined;
    const timer = window.setInterval(() => {
      setCommunityDirection(1);
      setActiveCommunityIndex((current) => (current + 1) % communityCards.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [communityCards.length, isCommunityPaused]);

  return (
    <section className="mx-auto w-full max-w-[118rem] px-5 py-12 sm:px-8 md:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="min-w-0">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-[#CC0000] shadow-[0_10px_30px_rgba(45,41,38,0.08)]">
            <Trophy size={15} /> Ranked #4 nationally in 2026
          </div>
          <h1 className="max-w-[42rem] text-5xl font-black leading-[0.92] tracking-tight text-[#070707] sm:text-6xl lg:text-[5.2rem] xl:text-[5.8rem]">
            Debate.
            <span className="block whitespace-nowrap"><span className="text-[#CC0000]">Learn.</span> Lead.</span>
          </h1>
          <p className="mt-8 max-w-[43rem] text-xl font-medium leading-9 text-[#201d1a]">
            BUDS is Boston University's parliamentary debate team. No experience needed, just curiosity and a willingness to grow.
          </p>
          <div className="mt-9 flex flex-col gap-5 sm:flex-row">
            <PrimaryButton href="/join" className="rounded-md px-9 py-4 text-[1.02rem] !font-extrabold tracking-[0.14em]">
              Join BUDS <ArrowRight size={18} />
            </PrimaryButton>
            <SecondaryButton href="/novice-hub" className="rounded-md border-[#cc0000]/35 px-8 py-4 text-[1.02rem] !font-extrabold tracking-[0.14em] text-[#CC0000]">
              New to debate? <Sparkles size={17} />
            </SecondaryButton>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-lg border border-[#ebe5df] bg-white shadow-[0_14px_32px_rgba(45,41,38,0.08)] sm:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((item, index) => (
              <div key={item.title} className={`flex min-h-[4.75rem] items-center gap-3 px-4 py-3 sm:px-5 xl:px-4 2xl:px-5 ${index < 2 ? "border-b border-[#ebe5df] xl:border-b-0" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-[#ebe5df]" : ""} ${index < featureItems.length - 1 ? "xl:border-r xl:border-[#ebe5df]" : ""}`}>
                <img src={item.icon} alt="" className="h-7 w-7 shrink-0 object-contain 2xl:h-8 2xl:w-8" />
                <div className="min-w-0">
                  <p className="text-[0.92rem] font-black leading-tight text-[#15120f] 2xl:text-base">{item.title}</p>
                  <p className="text-[0.92rem] font-medium leading-5 text-[#2D2926] 2xl:text-base">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
          <div className="overflow-hidden !rounded-[1.35rem] bg-[#1f1f1f] shadow-[0_22px_48px_rgba(45,41,38,0.16)] sm:grid sm:min-h-[31rem] sm:grid-cols-[45%_55%]">
            <div className="relative flex min-h-[29rem] flex-col justify-between overflow-hidden bg-[#B70503] p-10 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.22),transparent_35%)]" />
              <div className="relative text-center">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-white">2026 National Rank</p>
                <p className="mt-7 text-[8.5rem] font-black leading-[0.75] tracking-tight text-white drop-shadow-[0_8px_0_rgba(0,0,0,0.16)] lg:text-[9.5rem]">#4</p>
              </div>
              <div className="relative">
                <img src="/trophy-red.png" alt="" className="mx-auto mb-6 h-44 w-64 object-contain" />
                <p className="max-w-[10rem] text-lg font-black leading-tight">Proven. Competitive. Boston Strong.</p>
              </div>
            </div>
            <div className="grid content-center gap-7 bg-[#202020] p-8 text-white sm:p-10">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-white/72">Format</p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
                  APDA
                  <span className="block">Parliamentary</span>
                  <span className="block">Debate</span>
                </h2>
                <p className="mt-4 max-w-[20rem] text-base font-medium leading-7 text-white/75">
                  Two-person teams, limited prep, and tournaments across the collegiate debate circuit.
                </p>
              </div>
              <div className="grid gap-0 text-sm font-black uppercase tracking-[0.12em] text-white/80">
                {[
                  ["Tryouts", "0", Sparkles],
                  ["Member Fees", "$0", CalendarDays],
                  ["League Format", "APDA", Trophy],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="flex items-center justify-between border-t border-white/12 py-4">
                    <span className="inline-flex items-center gap-3"><Icon className="text-[#ffdddd]" size={18} /> {label}</span>
                    <span className="text-xl leading-none text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mt-10 rounded-lg border border-[#ebe5df] bg-white p-8 shadow-[0_18px_38px_rgba(45,41,38,0.08)]">
        <div className="grid gap-9 lg:grid-cols-[0.2fr_0.8fr] lg:items-center">
          <div className="border-b border-[#e5ded7] pb-7 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">New to debate?</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#111]">It's easier than you think.</h2>
            <div className="mt-2 h-1.5 w-36 bg-[#ffd247]" />
            <p className="mt-5 text-lg font-medium leading-8 text-[#3e3934]">We'll guide you every step of the way.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {pathwaySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="grid gap-4 sm:grid-cols-[5.75rem_1fr] sm:items-center xl:grid-cols-1">
                  <div className="grid h-24 w-24 place-items-center overflow-hidden !rounded-full border border-[#f0d7c3] bg-[#fbf2ea] text-[#CC0000]">
                    <Icon size={39} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="mb-1 text-2xl font-black leading-none text-[#CC0000]">{index + 1}</p>
                    <h3 className="text-lg font-black uppercase leading-tight tracking-[0.05em] text-[#111]">{step.title}</h3>
                    <p className="mt-2 text-base font-medium leading-6 text-[#3e3934]">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="mt-8 rounded-lg border border-[#ebe5df] bg-white p-8 shadow-[0_18px_38px_rgba(45,41,38,0.08)]">
        <div className="grid gap-8 xl:grid-cols-[0.27fr_0.73fr]">
          <div className="relative flex min-h-[24rem] flex-col justify-between overflow-hidden !rounded-[1.25rem] border border-[#ebe5df] bg-white p-7">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#CC0000]" />
            <div>
              <div className="grid h-14 w-14 place-items-center !rounded-lg bg-[#CC0000] text-white">
                <Users size={28} strokeWidth={1.9} />
              </div>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.14em] text-[#CC0000]">Community</p>
              <h2 className="mt-3 text-[2rem] font-black leading-tight text-[#111]">More than debate. It's a community.</h2>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-1.5 w-24 bg-[#ffd247]" />
                <div className="h-px flex-1 bg-[#ebe5df]" />
              </div>
              <p className="mt-5 text-lg font-medium leading-8 text-[#3e3934]">From late-night prep to tournament victories, we do it together.</p>
            </div>
            <div className="mt-8 border-t border-[#eadfd6] pt-5">
              <SecondaryButton href="/about" className="rounded-md border-[#CC0000]/40 bg-white px-6 py-3 text-sm text-[#CC0000] shadow-none">
                See our community <ArrowRight size={15} />
              </SecondaryButton>
            </div>
          </div>
          <div
            className="grid overflow-hidden !rounded-[1.25rem] border border-[#ebe5df] bg-[#f8f5f2] shadow-[0_18px_42px_rgba(45,41,38,0.08)] md:grid-cols-[1.2fr_0.8fr]"
            onMouseEnter={() => setIsCommunityPaused(true)}
            onMouseLeave={() => setIsCommunityPaused(false)}
          >
            <div className="relative h-[30rem] overflow-hidden bg-[#2D2926] md:h-[28rem]">
              <AnimatePresence mode="popLayout" custom={communityDirection}>
                <motion.img
                  key={activeCommunityCard.image}
                  src={activeCommunityCard.image}
                  alt={activeCommunityCard.alt}
                  custom={communityDirection}
                  initial={{ opacity: 0, x: communityDirection * 58, scale: 1.08 }}
                  animate={{ opacity: 1, x: 0, scale: 1.02 }}
                  exit={{ opacity: 0, x: communityDirection * -58, scale: 1.06 }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/60 via-[#2D2926]/8 to-transparent" />
              <motion.div
                key={`${activeCommunityCard.title}-caption`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                className="absolute bottom-12 left-5 max-w-[22rem] text-white"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/80">BUDS Community</p>
                <p className="mt-2 text-2xl font-black leading-tight">{activeCommunityCard.title}</p>
              </motion.div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="flex gap-2">
                  {communityCards.map((card, index) => (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => selectCommunityCard(index)}
                      className={`h-2.5 flex-1 !rounded-full shadow-none transition duration-300 ${index === activeCommunityIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                      aria-label={`Show ${card.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative flex h-[30rem] flex-col justify-between overflow-hidden p-8 md:h-[28rem]">
              <AnimatePresence mode="wait" custom={communityDirection}>
                <motion.div
                  key={activeCommunityCard.title}
                  custom={communityDirection}
                  initial={{ opacity: 0, x: communityDirection * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: communityDirection * -28 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-0 pr-1"
                >
                  <div className="grid h-16 w-16 place-items-center !rounded-full border border-[#f0d7c3] bg-white text-[#CC0000]">
                    <ActiveCommunityIcon size={32} strokeWidth={1.8} />
                  </div>
                  <p className="mt-6 text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">
                    {safeCommunityIndex + 1} / {communityCards.length}
                  </p>
                  <h3 className="mt-3 text-3xl font-black leading-tight text-[#111]">{activeCommunityCard.title}</h3>
                  <p className="mt-4 line-clamp-2 text-lg font-medium leading-8 text-[#3e3934]">{activeCommunityCard.body}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 grid gap-5">
                <div className="grid grid-cols-4 gap-2">
                  {communityCards.map((card, index) => (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => selectCommunityCard(index)}
                      className={`group overflow-hidden !rounded-lg border bg-white p-0 shadow-none transition duration-300 ${index === activeCommunityIndex ? "border-[#CC0000] ring-2 ring-[#CC0000]/12" : "border-[#e1d7ce] hover:border-[#CC0000]/55"}`}
                      aria-label={`Preview ${card.title}`}
                    >
                      <img src={card.image} alt="" className={`h-14 w-full object-cover transition duration-500 ${index === activeCommunityIndex ? "scale-110" : "opacity-70 group-hover:scale-105 group-hover:opacity-100"}`} />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => rotateCommunityCard(-1)}
                    className="grid h-11 w-11 place-items-center !rounded-full border border-[#d7cbc3] bg-white text-[#2D2926] shadow-none transition hover:border-[#CC0000] hover:text-[#CC0000]"
                    aria-label="Previous community photo"
                  >
                    <ArrowRight className="rotate-180" size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => rotateCommunityCard(1)}
                    className="grid h-11 w-11 place-items-center !rounded-full border border-[#d7cbc3] bg-white text-[#2D2926] shadow-none transition hover:border-[#CC0000] hover:text-[#CC0000]"
                    aria-label="Next community photo"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                className="border border-[#ded8d2] bg-[#f3f4f4] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] transition duration-200 hover:border-[#2D2926] hover:bg-white"
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

function SmoothDetails({ title, children, className = "", defaultOpen = false, scrollOffset = 96, scrollTargetRef = null }) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionRef = useRef(null);
  const openedByUserRef = useRef(false);
  const toggleOpen = () => {
    openedByUserRef.current = true;
    setOpen((current) => !current);
  };

  useEffect(() => {
    if (!open || !openedByUserRef.current || typeof window === "undefined") return undefined;
    const scrollAnimationRef = { current: null };
    const timeoutId = window.setTimeout(() => {
      const targetElement = scrollTargetRef?.current || sectionRef.current;
      scrollElementIntoComfortView(targetElement, scrollAnimationRef, {
        offset: scrollOffset,
        lowerBoundRatio: 0.42,
        duration: 620,
      });
    }, 180);
    return () => {
      window.clearTimeout(timeoutId);
      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [open, scrollOffset, scrollTargetRef]);

  return (
    <section ref={sectionRef} className={className}>
      <div className="flex w-full items-center justify-between gap-3 text-left text-lg font-black text-[#2D2926]">
        <div
          role="button"
          tabIndex={0}
          onClick={toggleOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleOpen();
            }
          }}
          className="min-w-0 flex-1"
          aria-expanded={open}
        >
          {title}
        </div>
        <button type="button" onClick={toggleOpen} aria-label={open ? "Close section" : "Open section"}>
          <ChevronDown size={18} className={`shrink-0 transition duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
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

function scrollElementIntoComfortView(element, animationRef, { offset = 96, lowerBoundRatio = 0.42, duration = 620 } = {}) {
  if (!element || typeof window === "undefined") return;
  const rect = element.getBoundingClientRect();
  const comfortableLowerBound = window.innerHeight * lowerBoundRatio;
  if (rect.top >= offset && rect.top <= comfortableLowerBound) return;
  if (animationRef.current) {
    window.cancelAnimationFrame(animationRef.current);
  }
  const startTop = window.scrollY;
  const targetTop = Math.max(startTop + rect.top - offset, 0);
  const distance = targetTop - startTop;
  const startTime = window.performance.now();
  const easeOutCubic = (progress) => 1 - ((1 - progress) ** 3);
  const animateScroll = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    window.scrollTo(0, startTop + distance * easeOutCubic(progress));
    if (progress < 1) {
      animationRef.current = window.requestAnimationFrame(animateScroll);
    }
  };
  animationRef.current = window.requestAnimationFrame(animateScroll);
}

function useAutoScrollOnOpen(open, { delay = 140, offset = 96, lowerBoundRatio = 0.42, duration = 620 } = {}) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!open || !elementRef.current || typeof window === "undefined") return undefined;
    const scrollAnimationRef = { current: null };
    const timeoutId = window.setTimeout(() => {
      scrollElementIntoComfortView(elementRef.current, scrollAnimationRef, { offset, lowerBoundRatio, duration });
    }, delay);
    return () => {
      window.clearTimeout(timeoutId);
      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [open, delay, offset, lowerBoundRatio, duration]);

  return elementRef;
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
  return (
    <AnimatePresence initial={false}>
      {notice?.message && (
        <motion.p
          key={notice.message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`rounded-lg border-l-4 px-4 py-3 text-sm font-black ${
            notice.type === "error"
              ? "border-[#CC0000] bg-[#fff1f1] text-[#8a0000]"
              : "border-[#0b6b35] bg-[#e5f7ec] text-[#0b6b35]"
          }`}
        >
          {notice.message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function ResourceEntryModal({ open, resource, onChange, onCancel, onSubmit, eyebrow, title, submitLabel, labelPlaceholder = "Case name", tagPlaceholder, tagOptions = null, descriptionPlaceholder, urlPlaceholder = "Google Doc URL" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-[#2D2926]/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.form
            onSubmit={onSubmit}
            className="w-full max-w-2xl border border-[#ded8d2] bg-white p-5 shadow-[0_28px_80px_rgba(45,41,38,0.24)]"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-3 text-2xl font-black leading-tight text-[#2D2926]">{title}</h2>
            <div className="mt-5 grid gap-3">
              <input
                value={resource.label}
                onChange={(event) => onChange((current) => ({ ...current, label: event.target.value }))}
                placeholder={labelPlaceholder}
                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold text-[#2D2926] outline-none focus:border-[#CC0000]"
              />
              {tagOptions ? (
                <select
                  value={resource.topicTags}
                  onChange={(event) => onChange((current) => ({ ...current, topicTags: event.target.value }))}
                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium text-[#2D2926] outline-none focus:border-[#CC0000]"
                >
                  {tagOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={resource.topicTags}
                  onChange={(event) => onChange((current) => ({ ...current, topicTags: event.target.value }))}
                  placeholder={tagPlaceholder}
                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium text-[#2D2926] outline-none focus:border-[#CC0000]"
                />
              )}
              <textarea
                value={resource.description}
                onChange={(event) => onChange((current) => ({ ...current, description: event.target.value }))}
                rows={4}
                placeholder={descriptionPlaceholder}
                className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium leading-5 text-[#2D2926] outline-none focus:border-[#CC0000]"
              />
              <input
                type="url"
                value={resource.url}
                onChange={(event) => onChange((current) => ({ ...current, url: event.target.value }))}
                placeholder={urlPlaceholder}
                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium text-[#2D2926] outline-none focus:border-[#CC0000]"
              />
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="border border-[#ded8d2] bg-[#f3f4f4] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] transition duration-200 hover:border-[#2D2926] hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#CC0000] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition duration-200 hover:bg-[#a90000]"
              >
                {submitLabel}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReorderButtons({ onMoveUp, onMoveDown, disabledUp = false, disabledDown = false }) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disabledUp}
        className="grid h-7 w-7 place-items-center border border-[#ded8d2] bg-white text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Move up"
        title="Move up"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disabledDown}
        className="grid h-7 w-7 place-items-center border border-[#ded8d2] bg-white text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-35"
        aria-label="Move down"
        title="Move down"
      >
        <ArrowDown size={14} />
      </button>
    </div>
  );
}

function normalizeComparisonValue(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

const BUDSITE_EDITOR_SECTION_TITLE_STORAGE_KEY = "buds-budsite-editor-section-titles";
const LINK_TILE_DESCRIPTION_MAX_LENGTH = 95;

function getStoredBudsiteEditorSectionTitles() {
  try {
    const stored = window.localStorage.getItem(BUDSITE_EDITOR_SECTION_TITLE_STORAGE_KEY);
    return normalizeBudsiteEditorSectionTitles(stored ? JSON.parse(stored) : defaultBudsiteEditorSectionTitles);
  } catch {
    return normalizeBudsiteEditorSectionTitles(defaultBudsiteEditorSectionTitles);
  }
}

function saveStoredBudsiteEditorSectionTitles(titles) {
  window.localStorage.setItem(BUDSITE_EDITOR_SECTION_TITLE_STORAGE_KEY, JSON.stringify(normalizeBudsiteEditorSectionTitles(titles)));
}

function hasCustomBudsiteEditorSectionTitles(titles) {
  const normalizedTitles = normalizeBudsiteEditorSectionTitles(titles);
  const defaultTitles = normalizeBudsiteEditorSectionTitles(defaultBudsiteEditorSectionTitles);
  return Object.entries(normalizedTitles).some(([id, sectionTitle]) => (
    sectionTitle.eyebrow !== defaultTitles[id]?.eyebrow || sectionTitle.title !== defaultTitles[id]?.title
  ));
}

function limitLinkTileDescription(description) {
  return String(description || "").slice(0, LINK_TILE_DESCRIPTION_MAX_LENGTH);
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
const contentRevisionNormalizers = {
  trophies: normalizeTrophiesContent,
  meetings: normalizeMeetingsContent,
  novice: normalizeNoviceContent,
  eboard: normalizeEboardContent,
  home: normalizeHomeContent,
  about: normalizeAboutContent,
};
const contentRevisionIds = ["trophies", "meetings", "novice", "eboard", "home", "about"];
const resourceDescriptionEditIds = ["memberCasebook", "memberPrepOuts", "memberRecordings"];

function getResourceEditModeStorageKey(email = "") {
  return `buds-resource-edit-mode:${email.toLowerCase()}`;
}

function getStoredResourceEditMode(email = "") {
  if (typeof window === "undefined" || !email) return false;
  try {
    return window.localStorage.getItem(getResourceEditModeStorageKey(email)) === "true";
  } catch {
    return false;
  }
}

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

function normalizeContentRevisions(id, revisions = []) {
  const normalizer = contentRevisionNormalizers[id] || ((content) => content);
  return revisions.slice(0, 3).map((revision) => ({
    ...revision,
    content: normalizer(revision.content),
  }));
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
      summarizeArrayChanges("APDA glossary", draft.glossaryTerms, published.glossaryTerms),
    ].filter(Boolean).join("; ") || "Novice Hub content changed.";
  }
  if (id === "eboard") {
    return summarizeArrayChanges("E-board members", draft.members, published.members) || "E-Board page content changed.";
  }
  if (id === "home") {
    return summarizeArrayChanges("Landing community carousel cards", draft.carouselSlides, published.carouselSlides) || "Landing page community carousel changed.";
  }
  if (id === "about") {
    return [
      summarizeArrayChanges("About photos", draft.photos, published.photos),
      draft.quote !== published.quote || draft.quoteAttribution !== published.quoteAttribution ? "testimonial quote changed" : "",
    ].filter(Boolean).join("; ") || "About page content changed.";
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
  if (id === "history") {
    return summarizeArrayChanges("History milestone cards", draft.milestones, published.milestones) || "History page milestones changed.";
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
      <div className="border-b border-[#ded8d2] bg-[#f3f4f4] p-2">
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

function isSignedBudgetInputValue(value) {
  return /^-?\d*(?:\.\d{0,2})?$/.test(value);
}

function cleanCurrencyInputValue(value) {
  return String(value).replace(/[$,\s]/g, "");
}

function formatBudgetInputValue(value) {
  if (value === "") return "0.00";
  const [wholePart, decimalPart] = String(value).split(".");
  const formattedWhole = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(wholePart.replace(/,/g, "")) || 0);
  return decimalPart === undefined ? formattedWhole : `${formattedWhole}.${decimalPart}`;
}

function formatSignedCurrency(value) {
  const amount = Number(value) || 0;
  return amount > 0 ? `+${formatCurrency(amount)}` : formatCurrency(amount);
}

function isApdaManagedStat(stat) {
  return stat.id?.startsWith("apda-") || /coty rank|coty contributors|current members/i.test(`${stat.label} ${stat.detail}`);
}

function isApdaManagedAccomplishment(item) {
  return item.id?.startsWith("apda-") || /terrier central|coty/i.test(item.text || "");
}

function mergeApdaTrophiesProposal(content, proposal) {
  const nextStats = [
    ...(proposal.stats || []),
    ...(content.stats || []).filter((stat) => !proposal.stats?.some((proposalStat) => proposalStat.id === stat.id)),
  ];

  const nextAccomplishments = [
    ...(proposal.accomplishments || []),
    ...(content.accomplishments || []).filter((item) => !proposal.accomplishments?.some((proposalItem) => proposalItem.id === item.id)),
  ];
  const mergeResultSeason = (season) => {
    if (season.id !== proposal.resultSeason.id) return season;
    const resultsById = new Map((season.results || []).map((result) => [result.id, result]));
    (proposal.resultSeason.results || []).forEach((result) => resultsById.set(result.id, result));
    return {
      ...season,
      label: proposal.resultSeason.label || season.label,
      results: [...resultsById.values()].sort((a, b) => a.date.localeCompare(b.date)),
    };
  };
  const nextResultSeasons = (content.resultSeasons || []).some((season) => season.id === proposal.resultSeason.id)
    ? content.resultSeasons.map(mergeResultSeason)
    : [...(content.resultSeasons || []), proposal.resultSeason];
  const membersByName = new Map((content.members || []).map((member) => [member.name.trim().toLowerCase(), member]));
  (proposal.members || []).forEach((member) => membersByName.set(member.name.trim().toLowerCase(), member));

  return {
    ...content,
    sourceUrl: proposal.sourceUrl || content.sourceUrl,
    stats: nextStats,
    accomplishments: nextAccomplishments,
    resultSeasons: sortResultSeasons(nextResultSeasons),
    members: [...membersByName.values()].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

function apdaValueKey(value) {
  return JSON.stringify(value ?? "");
}

function formatApdaStatChange(stat) {
  return `${stat.value} ${stat.label} (${stat.detail})`;
}

function formatApdaResultChange(result) {
  return `${result.date} - ${result.tournament}: ${(result.highlights || []).join("; ") || "No listed highlights"}`;
}

function formatApdaMemberChange(member) {
  return `${member.meta}: ${(member.achievements || []).join("; ") || "No listed achievements"}`;
}

function buildApdaPreviewChangeSummary(currentContent, proposal) {
  const changes = [];
  const currentStats = new Map((currentContent.stats || []).filter(isApdaManagedStat).map((stat) => [stat.id, stat]));
  (proposal.stats || []).forEach((stat) => {
    const current = currentStats.get(stat.id);
    if (!current) {
      changes.push({ type: "added", area: "Top Stats", title: stat.label, after: formatApdaStatChange(stat) });
      return;
    }
    if (apdaValueKey(current) !== apdaValueKey(stat)) {
      changes.push({ type: "changed", area: "Top Stats", title: stat.label, before: formatApdaStatChange(current), after: formatApdaStatChange(stat) });
    }
  });

  const currentAccomplishments = new Map((currentContent.accomplishments || []).filter(isApdaManagedAccomplishment).map((item) => [item.id, item]));
  (proposal.accomplishments || []).forEach((item) => {
    const current = currentAccomplishments.get(item.id);
    if (!current) {
      changes.push({ type: "added", area: "Accomplishments", title: item.text, after: item.text });
      return;
    }
    if ((current.text || "") !== (item.text || "")) {
      changes.push({ type: "changed", area: "Accomplishments", title: item.id, before: current.text, after: item.text });
    }
  });

  const currentSeason = (currentContent.resultSeasons || []).find((season) => season.id === proposal.resultSeason?.id);
  const currentResults = new Map((currentSeason?.results || []).map((result) => [result.id, result]));
  (proposal.resultSeason?.results || []).forEach((result) => {
    const current = currentResults.get(result.id);
    if (!current) {
      changes.push({ type: "added", area: "Results Timeline", title: result.tournament, after: formatApdaResultChange(result) });
      return;
    }
    if (apdaValueKey(current) !== apdaValueKey(result)) {
      changes.push({ type: "changed", area: "Results Timeline", title: result.tournament, before: formatApdaResultChange(current), after: formatApdaResultChange(result) });
    }
  });

  const currentMembers = new Map((currentContent.members || []).map((member) => [member.name.trim().toLowerCase(), member]));
  (proposal.members || []).forEach((member) => {
    const current = currentMembers.get(member.name.trim().toLowerCase());
    if (!current) {
      changes.push({ type: "added", area: "Member Achievement Cards", title: member.name, after: formatApdaMemberChange(member) });
      return;
    }
    if (apdaValueKey({ meta: current.meta, achievements: current.achievements }) !== apdaValueKey({ meta: member.meta, achievements: member.achievements })) {
      changes.push({ type: "changed", area: "Member Achievement Cards", title: member.name, before: formatApdaMemberChange(current), after: formatApdaMemberChange(member) });
    }
  });

  return {
    added: changes.filter((change) => change.type === "added"),
    changed: changes.filter((change) => change.type === "changed"),
    all: changes,
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

function AboutPage({ aboutContent }) {
  const normalizedAboutContent = normalizeAboutContent(aboutContent);
  const aboutHighlights = [
    { icon: CalendarDays, value: "1999", label: "Founded", detail: "Modern BUDS Era" },
    { icon: Trophy, value: "APDA", label: "National", detail: "Debate Circuit" },
    { icon: DollarSign, value: "$0", label: "Membership", detail: "Dues" },
    { icon: Users, value: "0", label: "Tryouts", detail: "Required" },
  ];
  const whatWeDoItems = [
    { icon: CalendarDays, label: "Practice", detail: "weekly" },
    { icon: Plane, label: "Travel to", detail: "tournaments" },
    { icon: FileText, label: "Write", detail: "cases" },
    { icon: Heart, label: "Help each", detail: "other improve" },
  ];
  const joinBenefits = [
    { icon: Users, title: "Beginner-friendly training", copy: "You do not need previous debate experience to join. We teach case construction, rebuttal, speaking style, and more." },
    { icon: Trophy, title: "Competitive travel", copy: "BUDS competes on the APDA circuit, giving members the chance to debate students from colleges across the country." },
    { icon: Medal, title: "Skills That Transfer", copy: "Debate sharpens public speaking, research instincts, persuasion, fast thinking, teamwork, and confidence under pressure." },
    { icon: MapPin, title: "A Social Home at BU", copy: "Weekly practices, mentorship, tournament weekends, team events, and older members who help new debaters find their footing." },
    { icon: Sparkles, title: "Build Your Resume", copy: "Leadership opportunities, speaking awards, and real accomplishments that stand out in internships, grad school, and beyond." },
    { icon: Handshake, title: "Supportive Community", copy: "We celebrate wins, learn from losses, and lift each other up every step of the way." },
  ];
  const aboutTimeline = [
    { year: "Before 1999", title: "A Longer BU Debating Tradition", copy: "Boston University students competed in earlier forms of collegiate debate before the current parliamentary team took shape." },
    { year: "1999", title: "The Modern Society Forms", copy: "The current Boston University Debate Society began its modern chapter in 1999, building a home for APDA-style parliamentary debate on campus." },
    { year: "Today", title: "Open, Competitive, and Growing", copy: "BUDS now combines novice training, tournament travel, member mentorship, and a culture built around learning out loud." },
  ];
  const aboutPhotos = normalizedAboutContent.photos;

  return (
    <Page className="max-w-[118rem]">
      <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr]">
        <section className="grid min-w-0 gap-8">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_16rem]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#CC0000]">About BUDS</p>
              <h1 className="mt-5 max-w-[38rem] text-5xl font-black leading-[0.98] tracking-tight text-[#111] sm:text-6xl xl:text-[4.6rem]">
                Debate hard.
                <span className="block text-[#CC0000]">Learn fast. Find your people.</span>
              </h1>
              <p className="mt-7 max-w-[41rem] text-lg font-medium leading-8 text-[#201d1a]">
                The Boston University Debate Society is BU's home for parliamentary debate, competitive travel, novice development, and the kind of argument that makes people sharper without making them smaller.
              </p>
            </div>
            <div className="hidden -translate-y-5 justify-items-center md:grid">
              <div className="relative grid h-56 w-56 place-items-center">
                <div className="absolute inset-8 rounded-full border border-[#eadfd6] bg-white/60" />
                <img src="/buds-logo.png" alt="BUDS logo" className="relative h-32 w-32 object-contain" />
                <p className="absolute bottom-8 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Est. 1999</p>
              </div>
            </div>
          </div>

          <div className="grid overflow-hidden !rounded-lg bg-[#CC0000] text-white shadow-[0_18px_42px_rgba(45,41,38,0.11)] sm:grid-cols-2 xl:grid-cols-4">
            {aboutHighlights.map((item, index) => (
              <div key={item.label} className={`flex items-center gap-5 p-6 ${index < 2 ? "border-b border-white/18 xl:border-b-0" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-white/18" : ""} ${index < aboutHighlights.length - 1 ? "xl:border-r xl:border-white/18" : ""}`}>
                <item.icon className="text-white/32" size={33} strokeWidth={1.8} />
                <div>
                  <p className="text-3xl font-black leading-none">{item.value}</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white">{item.label}</p>
                  <p className="mt-1 text-xs font-medium text-white/86">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          <Card className="p-7 shadow-[0_18px_42px_rgba(45,41,38,0.08)] md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="grid h-16 w-16 shrink-0 place-items-center !rounded-lg bg-[#202020] text-white">
                <Trophy size={25} />
              </div>
              <div className="min-w-0">
                <Eyebrow>What We Do</Eyebrow>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#111]">APDA Parliamentary Debate, Built for BU Students.</h2>
                <p className="mt-5 max-w-[44rem] text-xl font-medium leading-9 text-[#3e3934]">
                  We compete in the American Parliamentary Debate Association in a limited-prep format with two-person teams, fast adaptation, and lots of room for creativity.
                </p>
              </div>
            </div>
            <div className="mt-12 grid min-h-[7rem] items-center border-t border-[#ded8d2] pt-8 sm:grid-cols-2 xl:grid-cols-4">
              {whatWeDoItems.map((item, index) => (
                <div key={`${item.label}-${item.detail}`} className={`flex h-full items-center justify-center gap-4 px-4 py-5 ${index < 2 ? "border-b border-[#ebe5df] xl:border-b-0" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-[#ebe5df]" : ""} ${index < whatWeDoItems.length - 1 ? "xl:border-r xl:border-[#ebe5df]" : ""}`}>
                  <item.icon className="shrink-0 text-[#CC0000]" size={36} strokeWidth={1.8} />
                  <p className="text-base font-black leading-tight text-[#111]">
                    {item.label}
                    <span className="block font-medium text-[#2D2926]">{item.detail}</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="relative overflow-hidden !rounded-lg !bg-[#202020] p-7 text-white">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#ff4a4a]">Best For</p>
              <p className="mt-4 text-2xl font-bold leading-8">Curious people who like ideas like feminism, politics, philosophy, law, comedy, or economics.</p>
              <p className="absolute bottom-3 right-6 text-8xl font-serif leading-none text-white/10">”</p>
            </Card>
            <Card className="relative overflow-hidden p-7">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#CC0000]">Start Here</p>
              <p className="mt-4 pr-12 text-2xl font-bold leading-8 text-[#111]">Show up to practice. No tryout, no dues, no prior debate resume.</p>
              <img
                src="/about-handshake.png"
                alt=""
                className="absolute bottom-3 right-4 h-28 w-28 object-contain opacity-80"
              />
            </Card>
          </div>
        </section>
      </div>

      <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[0.26fr_0.74fr]">
        <SiteLink href="/history" className="group block">
          <Card className="flex h-full flex-col p-5 transition hover:border-[#CC0000] hover:shadow-[0_24px_70px_rgba(45,41,38,0.12)] sm:p-6">
            <Eyebrow>Our History</Eyebrow>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#111] transition group-hover:text-[#CC0000]">A BU team with memory and momentum.</h2>
            <div className="relative mt-8 grid flex-1 content-between gap-7 pl-7">
              <div className="absolute bottom-5 left-3 top-2 w-px bg-[#efb0b0]" />
              {aboutTimeline.map((item) => (
                <div key={item.year} className="relative">
                  <span className="absolute -left-[1.85rem] top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f7dede]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#CC0000]" />
                  </span>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[#CC0000]">{item.year}</p>
                  <h3 className="mt-2 text-lg font-black leading-tight text-[#111]">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#3e3934]">{item.copy}</p>
                </div>
              ))}
            </div>
            <span className="mt-6 inline-flex items-center justify-center gap-2 border border-[#CC0000]/40 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000] shadow-none transition group-hover:bg-[#CC0000] group-hover:text-white">
              View Our History <ArrowRight size={14} />
            </span>
          </Card>
        </SiteLink>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.68fr]">
          <div>
            <div className="mb-6 flex flex-col gap-4 border-b border-[#CC0000] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Why Join</Eyebrow>
                <h2 className="mt-3 text-4xl font-black leading-tight text-[#111]">The Practical Upside of BUDS</h2>
              </div>
              <PrimaryButton href="/join" className="mt-5 px-4 py-2 text-[0.68rem] shadow-none sm:self-end">
                Request to Join <ArrowRight size={13} />
              </PrimaryButton>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {joinBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card key={benefit.title} className="group min-h-[14.5rem] p-6 transition hover:-translate-y-1 hover:border-[#CC0000] hover:shadow-[0_24px_70px_rgba(45,41,38,0.12)]">
                    <div className="mb-5 grid h-16 w-16 place-items-center !rounded-full bg-[#fde9e9] text-[#CC0000] transition group-hover:bg-[#CC0000] group-hover:text-white">
                      <Icon size={30} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-xl font-black leading-tight text-[#111]">{benefit.title}</h3>
                    <p className="mt-4 text-sm font-medium leading-6 text-[#3e3934]">{benefit.copy}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid content-start gap-3">
            <div className="group relative aspect-[1.8/1] overflow-hidden !rounded-lg border border-[#eadfd6] bg-white">
              <img src={aboutPhotos[0]?.src} alt={aboutPhotos[0]?.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#2D2926]/86 p-4 text-sm font-bold leading-6 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {aboutPhotos[0]?.caption}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="group relative aspect-[1.35/1] overflow-hidden !rounded-lg bg-white">
                <img src={aboutPhotos[1]?.src} alt={aboutPhotos[1]?.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#2D2926]/86 p-3 text-xs font-bold leading-5 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {aboutPhotos[1]?.caption}
                </div>
              </div>
              <div className="group relative aspect-[1.35/1] overflow-hidden !rounded-lg bg-white">
                <img src={aboutPhotos[2]?.src} alt={aboutPhotos[2]?.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#2D2926]/86 p-3 text-xs font-bold leading-5 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {aboutPhotos[2]?.caption}
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden !rounded-lg bg-[#CC0000] p-6 pb-8 text-white">
              <p className="text-6xl font-serif leading-none text-white">&ldquo;</p>
              <p className="-mt-7 pl-12 pr-10 text-2xl font-semibold italic leading-9 text-white">{normalizedAboutContent.quote}</p>
              <p className="mt-4 pl-12 text-base font-extrabold tracking-normal text-white/88">- {normalizedAboutContent.quoteAttribution}</p>
              <p className="absolute bottom-3 right-6 text-6xl font-serif leading-none text-white">&rdquo;</p>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}

const apdaSpeakerScaleResource = { label: "Speaker Scale", url: "https://docs.google.com/document/d/1yptW79G1oL9mNDhCPcuZf0zwibPtz05-Xg6qjGjC9FU/edit?tab=t.0" };
const apdaStandingsResource = { label: "APDA Standings", url: "https://apda.online/coty-standings-temporary/" };
const apdaGuideResource = { label: "APDA Guide", url: "https://apda.online/about/guide-to-apda/" };
const apdaNoviceGuidesResource = { label: "APDA Novice Guides", url: "https://apda.online/category/nm-guides/" };
const speechIconMap = {
  file: FileText,
  help: CircleHelp,
  mic: Mic2,
  scroll: ScrollText,
};
const defaultApdaGlossaryTerms = [
  { term: "APDA", category: "League", definition: "American Parliamentary Debate Association, the college parliamentary debate league BUDS competes in.", resources: [apdaGuideResource, apdaNoviceGuidesResource] },
  { term: "Burn", category: "League", definition: "To tell other people about someone else's case without permission. This is against league norms unless the case-writer says it is okay." },
  { term: "COTY", category: "League", definition: "Club of the Year points, earned when members win or break at tournaments.", resources: [apdaStandingsResource, apdaGuideResource] },
  { term: "SOTY", category: "League", definition: "Speaker of the Year points, earned by speaking highly at tournaments.", resources: [apdaStandingsResource, apdaSpeakerScaleResource] },
  { term: "TOTY", category: "League", definition: "Team of the Year points, earned by winning or breaking at tournaments.", resources: [apdaStandingsResource, apdaGuideResource] },
  { term: "Dinos", category: "League", definition: "Alumni who have graduated and return to judge, and sometimes compete at open tournaments." },
  { term: "Northern Schools", category: "Geography", definition: "Schools above New York, such as Harvard, Brown, Northeastern, or the University of Chicago." },
  { term: "Southern Schools", category: "Geography", definition: "Schools below New Jersey, such as GW, Georgetown, UMD, or UVA." },
  { term: "Central Schools", category: "Geography", definition: "The in-between region including Pennsylvania, New York, and New Jersey schools." },
  { term: "Novice", category: "League", definition: "A debater in their first year of APDA competition.", resources: [apdaNoviceGuidesResource] },
  { term: "Owning Souls", category: "League", definition: "Beating the same person or team three times in a row." },
  { term: "Pround", category: "League", definition: "A practice round." },
  { term: "Reaffiliation", category: "League", definition: "When someone leaves one school's team to join another under extreme circumstances. The bar is high and judging affiliations still matter." },
  { term: "Varsity", category: "League", definition: "A debater who has completed at least one year on APDA." },
  { term: "All Up / Down One", category: "Tournament", definition: "Phrases that describe a team's current win-loss record and therefore the bracket they are in." },
  { term: "Bracket", category: "Tournament", definition: "The win-loss or speaker-point group used to determine who you hit next." },
  { term: "Break", category: "Tournament", definition: "To do well enough in prelims to advance to outrounds like quarters, semis, or finals." },
  { term: "Bubble", category: "Tournament", definition: "A round where both teams usually need to win in order to break." },
  { term: "Calibrate", category: "Tournament", definition: "Before some tournaments, judges watch a practice round and give an RFD so tab can place them into rooms that fit their judging level." },
  { term: "Cases Tournament", category: "Tournament", definition: "A tournament where government chooses and presents the case for the round. Also called a loose-link tournament." },
  { term: "Civil War", category: "Tournament", definition: "When two teams from the same school or affiliation hit each other in a round." },
  { term: "EO / EOF", category: "Tournament", definition: "Equity officers or equity opportunity facilitators. They handle equity concerns, scratches, accommodations, and good tournament practices." },
  { term: "Gender Minority Tournament", category: "Tournament", definition: "A tournament only open to women and gender minorities. It can count for COTY and Nationals qualifying, but not every OTY category." },
  { term: "General Assembly", category: "Tournament", definition: "The tournament gathering space between rounds, usually used for check-in, announcements, food, and hanging out." },
  { term: "Hitting", category: "Tournament", definition: "Debating against another team." },
  { term: "Hybrid", category: "Tournament", definition: "A team made of debaters from different schools. The team must choose which school protection to take." },
  { term: "Iron", category: "Tournament", definition: "When only one person debates on one side of the round." },
  { term: "Judge-Screw", category: "Tournament", definition: "A claim that a judge made a bad call. Use this very sparingly and be kind to judges." },
  { term: "Justify", category: "Judging", definition: "Speaker scores at or beyond a tournament's justification bar, often very high or very low scores, must be explained to tab.", resources: [apdaSpeakerScaleResource] },
  { term: "Motions Tournament", category: "Tournament", definition: "A tournament where the CA team releases topics shortly before the round and both teams prep from that motion. Also called a tight-link tournament." },
  { term: "Nationals", category: "Tournament", definition: "APDA's national championship. Teams qualify through qual points or a school's free seed." },
  { term: "NorthAms", category: "Tournament", definition: "A tournament hosted in Canada and the United States in alternating years, mixing APDA and CUSID formats." },
  { term: "Novice Tournament", category: "Tournament", definition: "A tournament only novices can compete in. It usually does not count for Nationals qualifying or OTY points." },
  { term: "Running", category: "Tournament", definition: "Government choosing and debating a case." },
  { term: "Open Tournament", category: "Tournament", definition: "A tournament where alumni can compete. Semi-open means alumni can compete but not as dino-dino teams; closed means no alumni competitors." },
  { term: "Paradigm", category: "Judging", definition: "A document where a judge explains their judging style and preferences." },
  { term: "Pick Up", category: "Judging", definition: "To win the round." },
  { term: "Post-Round", category: "Judging", definition: "Keeping the judge after the round to ask questions about the RFD. Clarification is fine; debating the judge is not." },
  { term: "Prelims / In-Rounds", category: "Tournament", definition: "The preliminary rounds of a tournament, usually rounds 1-5, or 1-7 at Nationals." },
  { term: "Pro-Am", category: "Tournament", definition: "A tournament pairing that combines a varsity debater and a novice debater." },
  { term: "Protection", category: "Tournament", definition: "Tournament pairing protection that prevents teams from the same affiliation from hitting each other." },
  { term: "Pull Up", category: "Tournament", definition: "When an uneven bracket causes the lowest-speaking team from the bracket below to be paired up into the bracket above." },
  { term: "Punt", category: "Tournament", definition: "When a team concedes before the round starts, giving everyone average speaks and ranks." },
  { term: "Qual", category: "Tournament", definition: "To qualify for Nationals, usually by breaking at tournaments." },
  { term: "Ranks", category: "Judging", definition: "The 1-4 rank assigned to each debater based on how much they contributed to the round. Lower ranks are better.", resources: [apdaSpeakerScaleResource] },
  { term: "RFD", category: "Judging", definition: "Reason for decision: the judge's explanation of who won and why." },
  { term: "Scratches", category: "Tournament", definition: "A form submitted to tab or equity listing judges you believe cannot judge you equitably because of relationship, history, or similar concerns." },
  { term: "Seeding", category: "Tournament", definition: "Pairing status based on how many people on a team are qualified, affecting round-one pairings." },
  { term: "Full Seed", category: "Tournament", definition: "A team where both members are qualified." },
  { term: "Half Seed", category: "Tournament", definition: "A team where one member is qualified." },
  { term: "Free Seed", category: "Tournament", definition: "Each club can designate one unseeded team as a free seed, placing them just above unseeded teams for round-one pairing." },
  { term: "Unseeded", category: "Tournament", definition: "A team where no one is qualified." },
  { term: "Slot", category: "Tournament", definition: "Choosing a case because it is outside the opposing team's topic strengths." },
  { term: "Speaks", category: "Judging", definition: "Speaker points given to each debater based on individual contribution to the round. They are scored out of 40, usually around 25-35.", resources: [apdaSpeakerScaleResource] },
  { term: "Spreading", category: "Tournament", definition: "Speed-reading so quickly that it becomes incomprehensible. It is less common in APDA and should be avoided." },
  { term: "Tab", category: "Tournament", definition: "The tournament staff in charge of pairings and results, usually with tournament software." },
  { term: "Techy", category: "Tournament", definition: "A technical round with lots of theory or advanced debate terminology, usually involving debaters with strong conceptual familiarity." },
  { term: "TO", category: "Tournament", definition: "Tab observer, who oversees tab and helps ensure pairings are done equitably." },
  { term: "Actor Case", category: "Round", definition: "A case argued from the perspective of a specific person, institution, or actor, requiring attention to that actor's interests and values." },
  { term: "Ballot / Voting Issues", category: "Round", definition: "The issues the judge should vote on: where your side is winning and why." },
  { term: "Call", category: "Round", definition: "A judge's decision." },
  { term: "Case Construct / Background", category: "Round", definition: "The construct is the topic; the background is the information needed to debate it." },
  { term: "Caveat", category: "Round", definition: "A condition in background that makes something true for the round or limits what opposition can do." },
  { term: "Clash", category: "Round", definition: "The key part of the round both teams focus on and fight over." },
  { term: "Collapse", category: "Round", definition: "In rebuttals, the argument your team goes for or makes most important to the judge." },
  { term: "Flow", category: "Round", definition: "A written record of speeches, arguments, and responses used to track how arguments interact." },
  { term: "Gov", category: "Round", definition: "Government: the team presenting and defending the case." },
  { term: "Impact", category: "Round", definition: "What your argument leads to and why it matters." },
  { term: "IPs", category: "Round", definition: "Independent points: standalone arguments with claims, warrants, and impacts. Similar to contentions." },
  { term: "Line-by-Line", category: "Round", definition: "Responding to each argument individually in order." },
  { term: "Link Chain", category: "Round", definition: "A sequence of warrants explaining how one thing leads to your impact." },
  { term: "Mishandled / Dropped", category: "Round", definition: "An argument that is poorly answered or not answered at all." },
  { term: "Off-Case", category: "Round", definition: "Arguments from, or responding to, the opposition case." },
  { term: "On-Case", category: "Round", definition: "Arguments from, or responding to, the government case." },
  { term: "Opp", category: "Round", definition: "Opposition: the team opposing the government case." },
  { term: "Opp Choice", category: "Round", definition: "A case format where opposition chooses which side to argue." },
  { term: "Opp Block", category: "Speech", definition: "The back-to-back MO and LOR speeches, giving opposition a long stretch before PMR." },
  { term: "POC", category: "Round", definition: "Point of clarification: the pre-speech time when opposition asks government questions about the case and prepares arguments." },
  { term: "POI", category: "Round", definition: "Point of inquiry: a question about information presented in a speech. Speech time does not pause." },
  { term: "POO", category: "Round", definition: "Point of order: calling out new material in rebuttal speeches. Time pauses while it is addressed." },
  { term: "Pref Squo", category: "Round", definition: "A case that says it is preferable to the status quo, meaning opposition can only defend the way things currently are." },
  { term: "Road Map", category: "Speech", definition: "A quick preview of the order your speech will follow, such as on-case, off-case, framing, then weighing." },
  { term: "This House", category: "Round", definition: "A case-statement starter like This House Believes, This House Opposes, or This House Supports." },
  { term: "Timespace", category: "Round", definition: "A constraint that limits what information can be used to a specific time, preventing hindsight or future events." },
  { term: "Weighing", category: "Round", definition: "Explaining why your arguments or impacts matter more than the other side's, such as through probability or magnitude." },
  { term: "A Priori", category: "Theory", definition: "An argument that comes before another argument, often a philosophical obligation that matters before consequences." },
  { term: "Countercase", category: "Theory", definition: "An opposition strategy that says the government's idea is bad and offers a better alternative rather than just defending the status quo." },
  { term: "Counterfactual", category: "Theory", definition: "The alternative to a case or argument." },
  { term: "Cross App", category: "Theory", definition: "Applying an argument or warrant from a previous point to a new one so you do not have to re-explain everything." },
  { term: "Deont", category: "Theory", definition: "Shorthand for deontology." },
  { term: "Downstream", category: "Theory", definition: "An impact that happens after another impact." },
  { term: "Equity Shell", category: "Theory", definition: "Theory arguing that the other side made an inequitable argument or constructed the case inequitably, affecting engagement and scores." },
  { term: "Fiat", category: "Theory", definition: "Government's power to make its advocacy true for the debate, so opposition cannot simply say the policy would never pass." },
  { term: "Knife", category: "Theory", definition: "A contradiction or double bind that forces the other side to choose which argument they stand by." },
  { term: "Nonunique", category: "Theory", definition: "An impact that happens on either side of the debate." },
  { term: "Normative Case", category: "Theory", definition: "A case based on overall benefit to society as defined by the winning framework." },
  { term: "Open", category: "Theory", definition: "A case that is very oppable; the opposite of tight." },
  { term: "Phil", category: "Theory", definition: "Shorthand for philosophy." },
  { term: "Prag", category: "Theory", definition: "Pragmatic impacts: real-world harms or benefits to specific people." },
  { term: "Pre-Fiat", category: "Theory", definition: "Arguments that come before the case statement, such as equity issues, Ks, or theory shells." },
  { term: "Revealed Preference", category: "Theory", definition: "An actor's values shown through past choices." },
  { term: "Skep", category: "Theory", definition: "Shorthand for skepticism." },
  { term: "Moral Skep", category: "Theory", definition: "Skepticism about morality itself or a general conception of morality." },
  { term: "Snug", category: "Theory", definition: "A case that is not tight, but close enough that it may still sometimes be tight-called." },
  { term: "Spec", category: "Theory", definition: "Theory claiming the case requires specific knowledge not included in background, hurting opposition's ability to debate." },
  { term: "Straight Opp", category: "Theory", definition: "When opposition does not tight-call and instead gives a normal opposition speech." },
  { term: "Squo", category: "Theory", definition: "Status quo: what is happening right now or what actually happened. Cases cannot be the squo." },
  { term: "Tabula Rasa", category: "Theory", definition: "Blank slate judging: the judge evaluates only what happens in the round, not real-life truth value." },
  { term: "Theory", category: "Theory", definition: "Arguments about what the debate itself should look like." },
  { term: "Tight", category: "Theory", definition: "A case that opposition claims is unbeatable or unfairly hard to oppose." },
  { term: "Beat Case", category: "Theory", definition: "A tight-call standard where opposition says government must beat the case themselves to prove it is not tight." },
  { term: "Path to Victory", category: "Theory", definition: "A tight-call standard where government says it only needs to show a possible path opposition could use to win." },
  { term: "Tight Block", category: "Theory", definition: "A prewritten response to being tight-called." },
  { term: "Turn", category: "Theory", definition: "An argument that says the other side's point actually helps your side." },
  { term: "Upstream", category: "Theory", definition: "Something necessary for another impact to happen." },
  { term: "Util", category: "Theory", definition: "Shorthand for utilitarianism." },
  { term: "Role Fulfillment", category: "Speaker Scale", definition: "How well a speaker performs the job of their speech, including responses, weighing, and strategic choices.", resources: [apdaSpeakerScaleResource] },
  { term: "Argument Quality", category: "Speaker Scale", definition: "The quality of a speech's warrants, impacts, weighing, and rebuttal. Judges assess the strengths and weaknesses holistically.", resources: [apdaSpeakerScaleResource] },
  { term: "Low-Point Win", category: "Speaker Scale", definition: "A result APDA speaker-scale guidance avoids: the winning team should not have fewer total speaks than the losing team.", resources: [apdaSpeakerScaleResource] },
];

function createGlossaryId(term = "term", index = Date.now()) {
  return `glossary-${index}-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 36) || "term"}`;
}

function normalizeGlossaryTermForEditor(item, index) {
  return {
    id: item.id || createGlossaryId(item.term, index),
    term: item.term || "",
    category: item.category || "",
    definition: item.definition || "",
    resources: Array.isArray(item.resources)
      ? item.resources.map((resource) => ({
        label: resource.label || "",
        url: resource.url || "",
      })).filter((resource) => resource.label || resource.url)
      : [],
  };
}

function getInitialNoviceGlossaryTerms(content = {}) {
  const source = content.glossaryTerms?.length > 0 ? content.glossaryTerms : defaultApdaGlossaryTerms;
  return source.map(normalizeGlossaryTermForEditor);
}

function NoviceHubPage({ noviceContent }) {
  const [glossarySearch, setGlossarySearch] = useState("");
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState("APDA");
  const noviceFaqSectionRef = useRef(null);
  const apdaSpeechSteps = noviceContent.speechSteps || [];
  const apdaGlossaryTerms = getInitialNoviceGlossaryTerms(noviceContent);
  const resourceAccentClasses = [
    "bg-[#ef233c] text-white",
    "bg-[#f49b12] text-white",
    "bg-[#2f70d8] text-white",
    "bg-[#4ca85a] text-white",
  ];
  const resourceIcons = [ExternalLink, BookOpenText, FileText, Trophy];
  const glossaryQuery = glossarySearch.trim().toLowerCase();
  const getGlossarySearchRank = (item) => {
    if (!glossaryQuery) return 0;
    const term = item.term.toLowerCase();
    const category = item.category.toLowerCase();
    const definition = item.definition.toLowerCase();
    if (term === glossaryQuery) return 0;
    if (term.startsWith(glossaryQuery)) return 1;
    if (term.includes(glossaryQuery)) return 2 + (term.indexOf(glossaryQuery) / 100);
    if (category.includes(glossaryQuery)) return 3 + (category.indexOf(glossaryQuery) / 100);
    if (definition.includes(glossaryQuery)) return 4 + (definition.indexOf(glossaryQuery) / 1000);
    return Number.POSITIVE_INFINITY;
  };
  const filteredGlossaryTerms = [...apdaGlossaryTerms]
    .map((item) => ({ item, rank: getGlossarySearchRank(item) }))
    .filter(({ rank }) => {
      if (!glossaryQuery) return true;
      return Number.isFinite(rank);
    })
    .sort((a, b) => a.rank - b.rank || a.item.term.localeCompare(b.item.term))
    .map(({ item }) => item);
  const displayedGlossaryTerm = filteredGlossaryTerms.find((item) => item.term === selectedGlossaryTerm)
    || filteredGlossaryTerms[0]
    || apdaGlossaryTerms.find((item) => item.term === selectedGlossaryTerm)
    || apdaGlossaryTerms[0];
  const noviceFaqSection = (
    <section ref={noviceFaqSectionRef} className="mt-5">
      <div className="mb-3 flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f2c9c9] bg-white text-[#CC0000]">
          <CircleHelp size={25} />
        </span>
        <h2 className="text-2xl font-black text-[#202020]">Common First-Round Questions</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {noviceContent.faqs.map((faq, index) => (
          <SmoothDetails
            key={faq.id}
            title={faq.question}
            defaultOpen={index === 0}
            className={`rounded-lg border border-[#ded8d2] bg-white p-4 shadow-[0_10px_28px_rgba(45,41,38,0.05)] ${
              index === 0 ? "bg-[#fffafa]" : ""
            }`}
            scrollTargetRef={noviceFaqSectionRef}
          >
            <p className="text-[0.95rem] font-medium leading-7 text-[#4c4641]">{faq.answer}</p>
          </SmoothDetails>
        ))}
      </div>
    </section>
  );
  const apdaGlossarySection = (
    <section className="flex flex-col rounded-lg border border-[#ded8d2] bg-white p-5 shadow-[0_14px_34px_rgba(45,41,38,0.05)]">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-[#286bd1]">
          <BookOpenText size={25} />
        </span>
        <div>
          <h2 className="text-2xl font-black leading-tight text-[#202020]">Learn the Lingo</h2>
          <p className="mt-1 text-sm font-bold text-[#2D2926]">Common APDA Terms</p>
        </div>
      </div>
      <div className="h-[34rem] min-h-0 overflow-hidden rounded-lg border border-[#ded8d2] bg-[#f7f4f1] lg:grid lg:grid-cols-[17rem_1fr]">
        <div className="flex h-full min-h-0 flex-col border-b border-[#ded8d2] bg-white p-3 lg:border-b-0 lg:border-r">
          <label className="grid gap-1">
            <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#8f8781]">Search terms</span>
            <input
              type="search"
              value={glossarySearch}
              onChange={(event) => setGlossarySearch(event.target.value)}
              placeholder="Try POC, speaks, break..."
              className="border border-[#ded8d2] bg-[#f3f4f4] px-3 py-2 text-sm font-semibold text-[#2D2926] outline-none transition focus:border-[#CC0000] focus:bg-white"
            />
          </label>
          <div className="mt-3 h-0 min-h-0 flex-1 overflow-y-auto border-t border-[#ded8d2] pt-1">
              {filteredGlossaryTerms.map((item) => (
                <button
                  key={item.term}
                  type="button"
                  onClick={() => setSelectedGlossaryTerm(item.term)}
                  className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-sm font-black transition ${
                    displayedGlossaryTerm?.term === item.term
                      ? "text-[#CC0000]"
                      : "text-[#2D2926] hover:text-[#CC0000]"
                  }`}
                >
                  <span>{item.term}</span>
                  <span className={`text-[0.58rem] uppercase tracking-[0.1em] ${
                    displayedGlossaryTerm?.term === item.term ? "text-[#CC0000]" : "text-[#8f8781]"
                  }`}>
                    {item.category}
                  </span>
                </button>
              ))}
              {filteredGlossaryTerms.length === 0 && (
                <p className="px-3 py-4 text-sm font-bold text-[#6d6560]">
                  No matching terms.
                </p>
              )}
          </div>
        </div>
        <div className="h-full overflow-y-auto bg-[#faf8f6] p-4 lg:p-5">
          {displayedGlossaryTerm ? (
            <>
              <span className="inline-flex bg-[#CC0000] px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-white">
                {displayedGlossaryTerm.category}
              </span>
              <h3 className="mt-3 text-2xl font-black leading-tight text-[#2D2926]">{displayedGlossaryTerm.term}</h3>
              <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#5b5450]">
                {displayedGlossaryTerm.definition}
              </p>
              {displayedGlossaryTerm.resources?.length > 0 && (
                <div className="mt-4 border-t border-[#ded8d2] pt-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#8f8781]">Helpful resources</p>
                  <ul className="mt-2 grid gap-1">
                    {displayedGlossaryTerm.resources.map((resource) => (
                      <li key={resource.url} className="flex items-center gap-2 text-[#CC0000]">
                        <span className="h-1.5 w-1.5 shrink-0 bg-[#CC0000]" />
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[0.68rem] font-black uppercase tracking-[0.06em] transition hover:text-[#2D2926]"
                        >
                          {resource.label} <ExternalLink size={10} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm font-bold text-[#6d6560]">Search for a term to see its definition.</p>
          )}
        </div>
      </div>
    </section>
  );
  const apdaBasicsSection = (
    <section className="overflow-hidden rounded-lg border border-[#ded8d2] bg-white p-5 shadow-[0_14px_34px_rgba(45,41,38,0.05)]">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-[#286bd1]">
          <Mic2 size={25} />
        </span>
        <div>
          <h2 className="text-2xl font-black leading-tight text-[#202020]">The APDA Speeches</h2>
          <p className="mt-1 max-w-xl text-sm font-medium leading-6 text-[#5b5450]">
          A quick map of who speaks when in a standard APDA cases round.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-sm bg-[#eef5ff] px-2.5 py-1 text-[0.7rem] font-black text-[#135fbe]">
              <span className="h-2.5 w-2.5 bg-[#1d67c4]" /> Government
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm bg-[#fff1f1] px-2.5 py-1 text-[0.7rem] font-black text-[#b31313]">
              <span className="h-2.5 w-2.5 bg-[#CC0000]" /> Opposition
            </span>
          </div>
        </div>
      </div>

      <div className="relative grid gap-2 before:absolute before:left-4 before:top-0 before:h-full before:w-1 before:bg-[#ded8d2]">
        {apdaSpeechSteps.map((step) => {
          const Icon = speechIconMap[step.icon] || Mic2;
          const isGov = step.side === "gov";
          return (
            <div key={step.order} className="relative grid grid-cols-[2.25rem_1fr] gap-3">
              <div className="relative z-10 grid h-8 w-8 place-items-center self-start border-4 border-white text-xs font-black text-white shadow-[0_8px_18px_rgba(45,41,38,0.12)]">
                <span className={`grid h-full w-full place-items-center ${isGov ? "bg-[#1d67c4]" : "bg-[#CC0000]"}`}>
                  {step.order}
                </span>
              </div>
              <article className={`grid gap-2 rounded-md border bg-white p-3 shadow-[0_8px_20px_rgba(45,41,38,0.04)] ${
                isGov
                  ? "border-[#a9c7f5] bg-[#f4f8ff]"
                  : "border-[#f0b7b7] bg-[#fff6f6]"
              }`}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon size={16} className={isGov ? "text-[#1d67c4]" : "text-[#CC0000]"} />
                    <h3 className="text-sm font-black leading-tight text-[#202020]">{step.title}</h3>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <p className={`inline-flex px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.08em] ${
                      isGov ? "bg-[#dceaff] text-[#0b4fa8]" : "bg-[#ffe0e0] text-[#9b0d0d]"
                    }`}>
                      {isGov ? "Government" : "Opposition"}
                    </p>
                    <p className={`inline-flex px-2 py-0.5 text-[0.58rem] font-black ${
                      isGov ? "bg-[#dceaff] text-[#0b4fa8]" : "bg-[#ffe0e0] text-[#9b0d0d]"
                    }`}>
                      {step.time}
                    </p>
                  </div>
                  <p className="mt-1 text-xs font-medium leading-5 text-[#403a36]">{step.copy}</p>
                </div>
              </article>
            </div>
          );
        })}
      </div>

    </section>
  );

  return (
    <Page className="max-w-[118rem] bg-[#f7f4f1] pb-0">
      <section className="grid gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex text-[0.75rem] font-black uppercase tracking-[0.18em] text-[#CC0000]">
            Novice Hub
          </span>
          <h1 className="mt-7 max-w-[48rem] text-5xl font-black leading-[0.94] tracking-tight text-[#070707] sm:text-6xl lg:text-[5.2rem] xl:text-[5.8rem]">
            Your Debate Journey
            <span className="block text-[#CC0000]">Starts Here.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#5b5450]">
            New to debate? We&apos;ve got you. Explore resources, learn the basics, and take your first step with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#start-here"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#CC0000] px-6 py-4 text-sm font-extrabold normal-case tracking-normal text-white shadow-none transition hover:bg-[#A00000]"
            >
              I&apos;m New! Where Do I Start? <ArrowRight size={19} />
            </a>
            <SecondaryButton href="/calendar" className="rounded-lg px-6 py-4 normal-case tracking-normal shadow-none">
              See Upcoming Events <CalendarDays size={18} />
            </SecondaryButton>
          </div>
        </div>
        <div className="min-w-0 px-4 lg:-ml-16 lg:pl-0 lg:pr-20 xl:-ml-20 xl:pr-24">
          <img
            src="/buds-up.png"
            alt="BUDS growth illustration"
            className="mx-auto h-auto w-full max-w-[36rem] object-contain"
          />
        </div>
      </section>

      <section id="start-here" className="mt-8 rounded-2xl border border-[#eaded5] bg-[#fff7f7] p-5 shadow-[0_14px_36px_rgba(45,41,38,0.05)] sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#202020]">Start Here</h2>
          <Sparkles className="text-[#CC0000]" size={23} />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {noviceResources.map((resource, index) => {
            const Icon = resourceIcons[index] || ExternalLink;
            return (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-[17rem] flex-col rounded-lg border border-[#ded8d2] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#CC0000]"
              >
                <span className={`grid h-16 w-16 place-items-center rounded-full ${resourceAccentClasses[index] || resourceAccentClasses[0]}`}>
                  <Icon size={30} />
                </span>
                <h3 className="mt-8 text-xl font-black leading-tight text-[#202020]">
                  {index === 0 ? "APDA Website" : resource.title.replace("APDA Online Website", "APDA Website")}
                </h3>
                <p className="mt-3 flex-1 text-[0.95rem] font-medium leading-6 text-[#403a36]">{resource.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#CC0000]">
                  {index === 0 ? "Visit Site" : index === 1 ? "Read Guide" : index === 2 ? "Open Dictionary" : "Explore Guide"}
                  <ArrowRight className="transition group-hover:translate-x-1" size={15} />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {noviceFaqSection}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr] xl:items-start">
        {apdaGlossarySection}
        {apdaBasicsSection}
      </div>
      <section className="mt-5 grid gap-4 rounded-lg border border-[#f1d38a] bg-[#fff2d8] p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#f49b12]">
          <Gavel size={29} />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#202020]">You don&apos;t need to know everything yet.</h2>
          <p className="mt-1 text-base font-medium text-[#403a36]">Show up, ask questions, and we&apos;ll help you learn the rest.</p>
        </div>
        <PrimaryButton href="/calendar" className="rounded-lg px-6 py-3 normal-case tracking-normal shadow-none">
          Join Our Next Meeting <ArrowRight size={18} />
        </PrimaryButton>
      </section>
    </Page>
  );
}

function CalendarPage({ calendarEmbedUrl }) {
  return (
    <Page className="max-w-[118rem]">
      <section className="mb-9 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-[#fff0f0] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#CC0000]">
            Calendar
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[0.94] tracking-tight text-[#070707] sm:text-6xl xl:text-[5.2rem]">
            Practices, Tournaments,
            <span className="block text-[#CC0000]">and Team Events.</span>
          </h1>
          <p className="mt-6 max-w-4xl text-xl font-medium leading-9 text-[#403a36] lg:whitespace-nowrap">
            Feel free to pull up to any meeting. No pressure, just come see what BUDS is about.
          </p>
        </div>
        <div className="min-w-0 overflow-visible">
          <img
            src="/calendar-page-art.png"
            alt="Calendar illustration"
            className="mx-auto h-auto max-h-[20rem] w-full max-w-[42rem] object-contain lg:mr-0 xl:max-h-[22rem]"
          />
        </div>
      </section>
      <Card className="overflow-hidden rounded-[1.5rem] p-3 shadow-[0_16px_45px_rgba(45,41,38,0.07)]">
        <div className="aspect-[16/10] overflow-hidden rounded-[1.2rem] border border-[#ded8d2] bg-white md:aspect-[16/8]">
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
  const [meetingSearch, setMeetingSearch] = useState("");
  const [meetingFilter, setMeetingFilter] = useState("all");
  const [expandedMeetingId, setExpandedMeetingId] = useState(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const canDeletePosts = auth?.role === "eboard" || auth?.role === ADMIN_ROLE;
  const sortedPosts = sortMeetingPosts(meetingPosts);
  const currentYear = new Date().getFullYear();
  const meetingQuery = meetingSearch.trim().toLowerCase();
  const filteredPosts = sortedPosts.filter((post) => {
    const plainBody = richTextToPlainText(post.body || "").toLowerCase();
    const matchesQuery = !meetingQuery
      || (post.title || "").toLowerCase().includes(meetingQuery)
      || plainBody.includes(meetingQuery)
      || formatMeetingDate(post.date).toLowerCase().includes(meetingQuery);
    const postYear = post.date ? new Date(`${post.date}T00:00:00`).getFullYear() : null;
    const matchesFilter = meetingFilter === "all" || postYear === currentYear;
    return matchesQuery && matchesFilter;
  });
  const meetingNumberById = new Map(
    [...sortedPosts]
      .reverse()
      .map((post, index) => [post.id, String(index + 1).padStart(2, "0")])
  );
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
    <>
      <AnimatePresence>
        {showAnnouncementModal && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-[#2D2926]/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.article
              className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-[#f1cfcf] bg-white p-6 shadow-[0_28px_80px_rgba(45,41,38,0.24)] sm:p-8"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(false)}
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#ded8d2] bg-[#f7f4f1] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
                aria-label="Close announcement"
              >
                <X size={18} />
              </button>
              <span className="inline-flex rounded-full bg-[#fff0f0] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#CC0000]">
                Announcement
              </span>
              <h2 className="mt-5 pr-10 text-4xl font-black leading-tight text-[#202020] sm:text-5xl">
                {announcementTitle}
              </h2>
              <p className="mt-5 whitespace-pre-wrap text-lg font-medium leading-9 text-[#403a36]">
                {announcementBody}
              </p>
              <p className="mt-8 border-t border-[#eaded5] pt-4 text-sm font-black text-[#766f69]">
                {meetingsContent.announcementUpdatedAt ? `Updated ${formatMeetingDate(meetingsContent.announcementUpdatedAt)}` : "No update posted yet"}
              </p>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <Page className="max-w-[118rem]">
      <section className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] xl:gap-14">
        <div className="min-w-0">
          <h1 className="max-w-[42rem] text-5xl font-black leading-[0.94] tracking-tight text-[#070707] sm:text-6xl xl:text-[4.8rem]">
            Stay in the Loop.
            <span className="block text-[#CC0000]">Never Miss a Meeting.</span>
          </h1>
          <p className="mt-7 max-w-[36rem] text-xl font-medium leading-9 text-[#4b4540]">
            All meeting notes, announcements, and important updates in one place, organized by our secretary, so you can focus on debating.
          </p>
        </div>
        <div className="min-w-0 overflow-visible">
          <img
            src="/meetings-page-art.png"
            alt="Meetings checklist illustration"
            className="mx-auto h-auto max-h-[20rem] w-full max-w-[40rem] object-contain lg:mr-0 xl:max-h-[22rem]"
          />
        </div>
      </section>

      <section className="mt-9 grid gap-4 lg:grid-cols-[1.25fr_0.9fr_0.95fr]">
        <article className="flex min-h-36 items-center gap-4 rounded-lg border border-[#f1cfcf] bg-[#fff4f4] p-5 shadow-[0_12px_28px_rgba(45,41,38,0.045)]">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f2c5c5] bg-[#fff7f7] text-[#CC0000]">
            <ClipboardList size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#CC0000]">Announcement</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-[#202020]">{announcementTitle}</h2>
            <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-base font-medium leading-6 text-[#403a36]">{announcementBody}</p>
            <p className="mt-3 text-xs font-black text-[#766f69]">
              {meetingsContent.announcementUpdatedAt ? `Updated ${formatMeetingDate(meetingsContent.announcementUpdatedAt)}` : "No update posted yet"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAnnouncementModal(true)}
            className="ml-auto hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-[#f1cfcf] bg-white text-[#CC0000] transition hover:border-[#CC0000] hover:bg-[#fff8f8] sm:grid"
            aria-label="Open full announcement"
          >
            <ArrowRight size={24} />
          </button>
        </article>

        <article className="flex min-h-36 items-center gap-4 rounded-lg border border-[#d9eadb] bg-[#f4fbf4] p-5 shadow-[0_12px_28px_rgba(45,41,38,0.045)]">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#cde6d0] bg-[#f6fff7] text-[#2f9d51]">
            <CalendarDays size={23} />
          </span>
          <div>
            <p className="text-3xl font-black leading-none text-[#2f9d51]">2</p>
            <h2 className="mt-1 text-xl font-black text-[#202020]">Bi-Weekly Meetings</h2>
            <p className="mt-2 text-base font-medium leading-6 text-[#403a36]">New meetings posted every other week.</p>
          </div>
        </article>

        <article className="flex min-h-36 items-center gap-4 rounded-lg border border-[#e4d9ef] bg-[#faf7ff] p-5 shadow-[0_12px_28px_rgba(45,41,38,0.045)]">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#ded0ef] bg-[#fbf8ff] text-[#5b2dab]">
            <FileText size={23} />
          </span>
          <div>
            <p className="text-3xl font-black leading-none text-[#5b2dab]">{sortedPosts.length}</p>
            <h2 className="mt-1 text-xl font-black text-[#202020]">Published Posts</h2>
            <p className="mt-2 text-base font-medium leading-6 text-[#403a36]">Notes and updates available to read.</p>
          </div>
        </article>
      </section>

      <section className="mt-9">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#ffe8e8] text-[#CC0000]">
              <FileText size={27} />
            </span>
            <h2 className="text-3xl font-black text-[#202020]">Meeting Notes</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-w-0 items-center gap-3 rounded-lg border border-[#ded8d2] bg-white px-4 py-3 text-[#5b5450] sm:w-[24rem]">
              <Search size={22} className="shrink-0 text-[#2D2926]" />
              <input
                type="search"
                value={meetingSearch}
                onChange={(event) => setMeetingSearch(event.target.value)}
                placeholder="Search meetings..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[#8f8781]"
              />
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-[#ded8d2] bg-white px-4 py-3 text-base font-black text-[#202020]">
              <Filter size={21} />
              <select
                value={meetingFilter}
                onChange={(event) => setMeetingFilter(event.target.value)}
                className="bg-transparent pr-1 font-black outline-none"
              >
                <option value="all">Filter</option>
                <option value="year">This Year</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredPosts.length === 0 && (
            <div className="p-10 text-center">
              <Eyebrow>No Posts Yet</Eyebrow>
              <h3 className="mt-3 text-3xl font-black text-[#2D2926]">No meeting notes match this view.</h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#5b5450]">
                Try clearing the search or changing the filter.
              </p>
            </div>
          )}
          {filteredPosts.map((post, index) => {
            const plainBody = richTextToPlainText(post.body || "");
            const preview = plainBody || "No Notes Body Added.";
            return (
              <article key={post.id} className="group grid min-h-[8.25rem] overflow-hidden rounded-[2rem] border border-[#d9d0ca] bg-white shadow-[0_12px_30px_rgba(45,41,38,0.06)] transition duration-300 hover:scale-[1.015] hover:border-[#CC0000]/45 hover:shadow-[0_18px_46px_rgba(45,41,38,0.10)] sm:grid-cols-[9.5rem_1fr]">
                <div className="flex items-center justify-between bg-[#CC0000] px-7 py-5 text-white sm:block">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-white/82">No.</p>
                  <p className="mt-0 text-6xl font-black leading-none sm:mt-3">{meetingNumberById.get(post.id) || String(index + 1).padStart(2, "0")}</p>
                </div>
                <div className="grid gap-5 bg-[#fffdfb] p-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#CC0000]">
                      <CalendarDays size={16} /> {formatMeetingDate(post.date)}
                    </p>
                    <h3 className="mt-3 text-3xl font-black leading-tight text-[#202020]">{post.title || "Untitled Meeting"}</h3>
                    <p className="mt-1 line-clamp-2 max-w-4xl text-lg font-medium leading-7 text-[#403a36]">{preview}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <button
                      type="button"
                      onClick={() => setExpandedMeetingId((current) => current === post.id ? null : post.id)}
                      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-base font-black transition duration-200 ${
                        expandedMeetingId === post.id
                          ? "border-[#CC0000] bg-white text-[#CC0000] hover:bg-[#fff3f3]"
                          : "border-[#CC0000] bg-[#CC0000] text-white shadow-none hover:bg-[#a90000]"
                      }`}
                      aria-expanded={expandedMeetingId === post.id}
                    >
                      {expandedMeetingId === post.id ? "Hide Notes" : "View Notes"}
                      <ArrowRight size={18} className={expandedMeetingId === post.id ? "-rotate-90 transition" : "transition"} />
                    </button>
                    {canDeletePosts && (
                      <button
                        type="button"
                        onClick={() => onRequestConfirmation({
                          title: `Delete ${post.title || "this meeting post"}?`,
                          body: "This meeting post will be removed from the public meeting archive.",
                          onConfirm: () => removeMeetingPost(post.id),
                        })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#6d6560] transition hover:text-[#CC0000]"
                        aria-label={`Delete ${post.title || "meeting post"}`}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                  {expandedMeetingId === post.id && (
                    <div className="md:col-span-2">
                      <div
                        className="rich-note border-t border-[#ded8d2] pt-5 text-base leading-8 text-[#4d4743]"
                        dangerouslySetInnerHTML={{ __html: normalizeRichTextForDisplay(post.body || "No Notes Body Added.") }}
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      </Page>
    </>
  );
}

const alumniSpotlightDebaters = [
  {
    rank: 1,
    name: "Alex Taubes",
    era: "2007-12",
    totalPoints: "486.75",
    bestSeason: "2010-11: 186.75 COTY points",
    accent: "bg-[#CC0000]",
    sourceUrl: "https://results.apda.online/core/debaters/627",
    accolades: [
      "2011 APDA National Champion with Greg Meyer",
      "2011 Team of the Year with Greg Meyer",
      "2011 Speaker of the Year",
      "2010-11 APDA President",
      "2011 Jeff Williams Award and Chris Porcaro Award",
    ],
  },
  {
    rank: 2,
    name: "Jasper Primack",
    era: "2015-19",
    totalPoints: "265.75",
    bestSeason: "2018-19: 177.25 COTY points",
    accent: "bg-[#a91313]",
    sourceUrl: "https://results.apda.online/core/debaters/2906",
    accolades: [
      "2019 Team of the Year tie with Teddy Wyman",
      "2019 Jeff Williams Award",
      "Three APDA qualifying seasons listed in BU records",
    ],
  },
  {
    rank: 3,
    name: "Teddy Wyman",
    era: "2016-20",
    totalPoints: "259.75",
    bestSeason: "2018-19: 152.75 COTY points",
    accent: "bg-[#822222]",
    sourceUrl: "https://results.apda.online/core/debaters/3409",
    accolades: [
      "2019 Team of the Year tie with Jasper Primack",
      "Three APDA qualifying seasons listed in BU records",
      "Top-three cumulative BU COTY scorer in APDA Results",
    ],
  },
  {
    rank: 4,
    name: "Jake Campbell",
    era: "2007-10",
    totalPoints: "184.5",
    bestSeason: "2008-09: 94 COTY points",
    accent: "bg-[#5f2b2b]",
    sourceUrl: "https://results.apda.online/core/debaters/541",
    accolades: [
      "Three APDA qualifying seasons listed in BU records",
      "Top-five cumulative BU COTY scorer in APDA Results",
      "Part of BU's late-2000s APDA rise",
    ],
  },
  {
    rank: 5,
    name: "Rocky Lotito",
    era: "2007-09",
    totalPoints: "133",
    bestSeason: "2008-09: 94.5 COTY points",
    accent: "bg-[#3f3331]",
    sourceUrl: "https://results.apda.online/core/debaters/125",
    accolades: [
      "Two APDA qualifying seasons listed in BU records",
      "Top-five cumulative BU COTY scorer in APDA Results",
      "Helped anchor BU's 2008-09 national push",
    ],
  },
];

function HistoryPage({ trophiesContent }) {
  const archiveStats = [
    {
      label: "Timeline Milestones",
      value: trophiesContent.milestones.length,
      detail: "Big BUDS moments saved as public history cards.",
      icon: ScrollText,
    },
    {
      label: "Recorded Seasons",
      value: trophiesContent.results.length,
      detail: "APDA seasons and tournament results preserved.",
      icon: Trophy,
    },
    {
      label: "Debater Spotlights",
      value: trophiesContent.members.length,
      detail: "Alumni achievements that continue to inspire.",
      icon: Medal,
    },
    {
      label: "Historian Note",
      value: "",
      detail: "This archive is built to grow: milestones preserve team memory, and alumni spotlights keep the people visible.",
      icon: Italic,
    },
  ];
  const impactStats = [
    { icon: Trophy, value: "20+", label: "Years of Debate Excellence" },
    { icon: Medal, value: "100+", label: "Tournament Wins and Counting" },
    { icon: UsersRound, value: "1000+", label: "Debaters Who've Called BUDS Home" },
    { icon: MapPin, value: "Top 5", label: "Consistent National Presence" },
  ];

  return (
    <Page className="max-w-[118rem]">
      <section className="relative min-h-[34rem] overflow-visible lg:min-h-[38rem]">
        <div
          className="pointer-events-none absolute left-[8%] top-[9rem] h-[27rem] w-[84%] bg-[#f3dfcf]/58"
          style={{ borderRadius: "34% 52% 42% 48% / 42% 34% 56% 48%", transform: "rotate(-7deg)" }}
        />
        <span className="pointer-events-none absolute left-[35%] top-[10rem] text-4xl font-black text-[#e9b994]/70">+</span>
        <span className="pointer-events-none absolute left-[47%] top-[5.5rem] text-2xl font-black text-[#e9b994]/70">+</span>
        <span className="pointer-events-none absolute right-[30%] top-[6.5rem] text-3xl font-black text-[#e9b994]/70">+</span>
        <span className="pointer-events-none absolute right-[16%] bottom-[6.5rem] text-3xl font-black text-[#e9b994]/70">+</span>
        <span className="pointer-events-none absolute left-[7%] bottom-[7rem] h-3 w-3 rounded-full bg-[#e9b994]/70" />
        <span className="pointer-events-none absolute right-[23%] bottom-[10rem] h-2.5 w-2.5 rounded-full border-2 border-[#e9b994]/70" />
        <span className="pointer-events-none absolute right-[8%] bottom-[9.5rem] h-4 w-4 rounded-full bg-[#e9b994]/70" />
        <div className="relative z-10 max-w-[40rem] pt-3">
          <Eyebrow>History</Eyebrow>
          <h1 className="mt-6 max-w-[40rem] text-6xl font-black leading-[0.98] tracking-tight text-[#202020] sm:text-7xl xl:text-[5.2rem]">
            A Timeline That Can Grow with the Team.
          </h1>
          <div className="ml-[9.5rem] mt-1 h-2 w-36 rounded-full bg-[#CC0000]" />
          <div className="ml-[10.25rem] mt-1 h-1.5 w-28 rounded-full bg-[#CC0000]" />
          <p className="mt-10 max-w-[24rem] text-xl font-medium leading-8 text-[#403a36]">
            Explore the records, milestones, and alumni moments that built BUDS.
          </p>
        </div>
        <div className="relative z-0 mt-6 lg:absolute lg:right-20 lg:top-0 lg:mt-0 xl:right-24">
          <img
            src="/history-art.png"
            alt="BUDS history timeline infographic"
            className="ml-auto h-auto w-full max-w-[58rem] object-contain mix-blend-multiply lg:max-w-[61rem] xl:max-w-[64rem]"
          />
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="h-full rounded-[1.5rem] p-8 shadow-[0_18px_50px_rgba(45,41,38,0.06)]">
            <Eyebrow>The Archive</Eyebrow>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#202020]">Preserving Our Debate Legacy.</h2>
            <p className="mt-5 max-w-md text-lg font-medium leading-8 text-[#403a36]">
              Every season, every speech, every win, saved for the next generation.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {archiveStats.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="min-h-[13rem] rounded-lg border border-[#eaded5] bg-[#fffdfb] p-5">
                  <Icon size={29} className="text-[#CC0000]" />
                  <p className="mt-4 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#202020]">{item.label}</p>
                  {item.value ? <p className="mt-4 text-5xl font-black leading-none text-[#202020]">{item.value}</p> : null}
                  <p className="mt-3 text-sm font-medium leading-6 text-[#403a36]">{item.detail}</p>
                </article>
              );
            })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="h-full rounded-[1.5rem] p-8 shadow-[0_18px_50px_rgba(45,41,38,0.06)]">
            <Eyebrow>Alumni Spotlight</Eyebrow>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="mt-4 text-4xl font-black leading-tight text-[#202020]">The APDA Results Hall of Heat</h2>
                <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-[#403a36]">
                Top five BUDS debaters by cumulative Boston University COTY points listed in official APDA Results records, with major APDA History awards called out where listed.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {alumniSpotlightDebaters.slice(0, 3).map((debater, index) => (
              <motion.article
                key={debater.name}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.42, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="group grid gap-0 overflow-hidden rounded-lg border border-[#ded8d2] bg-white shadow-[0_10px_28px_rgba(45,41,38,0.05)] transition hover:border-[#CC0000] hover:shadow-[0_18px_45px_rgba(45,41,38,0.1)] lg:grid-cols-[6.5rem_1fr]"
              >
                <div className={`${debater.accent} grid place-items-center p-4 text-white`}>
                  <div className="text-center">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-white/70">Rank</p>
                    <p className="mt-1 text-5xl font-black leading-none">#{debater.rank}</p>
                  </div>
                </div>
                <div className="grid gap-4 p-4 lg:grid-cols-[1fr_11rem] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-black leading-tight text-[#2D2926]">{debater.name}</h3>
                      <span className="bg-[#f3f4f4] px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.1em] text-[#6d6560]">{debater.era}</span>
                    </div>
                    <ul className="mt-3 grid gap-1.5">
                      {debater.accolades.map((item) => (
                        <li key={item} className="flex gap-2 text-sm font-semibold leading-6 text-[#5b5450]">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#CC0000]" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-2 border border-[#ded8d2] bg-[#f3f4f4] p-3">
                    <p className="text-[0.6rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">COTY points</p>
                    <p className="text-3xl font-black leading-none text-[#2D2926]">{debater.totalPoints}</p>
                    <p className="text-xs font-bold leading-5 text-[#5b5450]">{debater.bestSeason}</p>
                    <a href={debater.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#CC0000]">
                      Debater record <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
            </div>
            <a
              href="https://results.apda.online/core/schools/6"
              target="_blank"
              rel="noreferrer"
              className="mx-auto mt-7 inline-flex items-center justify-center gap-2 rounded-md border border-[#CC0000] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#CC0000] transition hover:bg-[#CC0000] hover:text-white"
            >
              View full hall of heat <ArrowRight size={16} />
            </a>
          </Card>
        </motion.div>
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-[#eaded5] bg-white p-8 shadow-[0_18px_50px_rgba(45,41,38,0.06)]">
        <Eyebrow>By The Numbers</Eyebrow>
        <h2 className="mt-4 text-4xl font-black leading-tight text-[#202020]">Our History. Our Impact.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {impactStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4">
                <Icon size={42} className="shrink-0 text-[#CC0000]" />
                <div>
                  <p className="text-3xl font-black leading-none text-[#202020]">{item.value}</p>
                  <p className="mt-1 text-base font-medium leading-6 text-[#403a36]">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
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

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Medal className="text-[#CC0000]" />
            <h2 className="min-w-0 break-words text-2xl font-black text-[#2D2926] sm:text-3xl">Accomplishments</h2>
          </div>
          <div className="grid gap-3">
            {trophiesContent.accomplishments.map((item) => (
              <div key={item.id || item.text} className="flex items-start gap-3 border border-[#ded8d2] bg-[#f3f4f4] px-4 py-4">
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
                  <div className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-4 text-sm font-bold text-[#5b5450]">
                    No results logged yet.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {[...season.results].reverse().map((result) => (
                      <div key={result.id || `${result.date}-${result.tournament}`} className="border-l-4 border-[#CC0000] bg-[#f3f4f4] p-4">
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
                scrollOffset={190}
              >
                <ul className="grid gap-2">
                  {member.achievements.map((achievement) => (
                    <li key={achievement} className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2 text-sm font-semibold leading-6 text-[#5b5450]">
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
        Contact an eboard member via email or messenger!
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
              <div className="mt-3 text-sm font-bold text-[#CC0000]">
                {member.email ? (
                  <a href={`mailto:${member.email}`} className="inline-flex min-w-0 items-center gap-1.5 transition hover:text-[#CC0000]">
                    <Mail size={13} className="shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    Email coming soon
                  </span>
                )}
              </div>
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
          <div className="border-t-8 border-t-[#CC0000] bg-[#f3f4f4] p-7">
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

function MembershipRequestsPanel({ auth, onRequestConfirmation }) {
  const [requests, setRequests] = useState(() => getStoredMembershipRequests());
  const [reviewReasons, setReviewReasons] = useState({});
  const isAdmin = auth?.role === ADMIN_ROLE;
  const defaultDenyReason = "Your membership request was not approved at this time.";

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

  const reviewMembershipRequest = async (id, status) => {
    const reviewedRequest = requests.find((request) => request.id === id);
    if (status === "Accepted" && reviewedRequest && RESERVED_ACCOUNT_EMAILS.includes(reviewedRequest.email.toLowerCase())) {
      setReviewReasons((current) => ({ ...current, [id]: "This email is reserved and cannot be accepted through requests." }));
      return;
    }

    const reason = reviewReasons[id]?.trim() || (status === "Accepted" ? "Welcome to BUDS!" : defaultDenyReason);
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
      if (isSupabaseConfigured && reviewedRequest.password) {
        await supabase.auth.signUp({
          email: reviewedRequest.email,
          password: reviewedRequest.password,
          options: {
            data: { name: reviewedRequest.name, membership_status: "accepted" },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        await supabase.auth.signOut();
      }

      upsertMemberAccount({
        id: reviewedRequest.email,
        name: reviewedRequest.name,
        email: reviewedRequest.email,
        ...(!isSupabaseConfigured ? { password: reviewedRequest.password } : {}),
        role: "member",
        status: "active",
        updated_at: new Date().toISOString(),
      });
    }
    setReviewReasons((current) => ({ ...current, [id]: "" }));
  };

  const requestMembershipDecision = (request, status) => {
    const isAccepting = status === "Accepted";
    onRequestConfirmation({
      title: `${isAccepting ? "Accept" : "Deny"} ${request.name || request.email}?`,
      body: isAccepting
        ? "Accepting this request gives this person access to private BUDS resources. Make sure this membership has been approved by a member of e-board before continuing."
        : `This will deny the membership request. If you do not write a custom reason, the default message will be: "${defaultDenyReason}"`,
      actionLabel: isAccepting ? "Accept" : "Deny",
      onConfirm: () => reviewMembershipRequest(request.id, status),
    });
  };

  const removeMembershipRequest = (id) => {
    const nextRequests = requests.filter((request) => request.id !== id);
    setRequests(nextRequests);
    saveStoredMembershipRequests(nextRequests);
    deleteMembershipRequest(id);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-1.5 border-b-4 border-[#CC0000] pb-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>{isAdmin ? "Administrator" : "E-Board"}</Eyebrow>
          <h2 className="mt-1.5 text-2xl font-black text-[#2D2926]">Membership Requests</h2>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">{requests.length} total</p>
      </div>
      <div className="mt-4 grid gap-3">
        {requests.length === 0 && (
          <div className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-4 text-sm font-bold text-[#5b5450]">
            No membership requests yet.
          </div>
        )}
        {requests.map((request) => {
          const isAccepted = request.status === "Accepted";
          const hasDecision = request.status === "Accepted" || request.status === "Denied";
          return (
            <div key={request.id} className={`relative grid gap-3 border p-4 pr-12 lg:grid-cols-[1fr_0.8fr] ${hasDecision ? "border-[#a9a29c] bg-[#d4d0cc] opacity-90" : "border-[#ded8d2] bg-white"}`}>
              <button
                type="button"
                onClick={() => onRequestConfirmation({
                  title: `Delete request from ${request.name}?`,
                  body: "This membership request will be permanently removed from the review queue.",
                  onConfirm: () => removeMembershipRequest(request.id),
                })}
                aria-label={`Delete request from ${request.name}`}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center border border-[#bdb6b0] bg-white/80 text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
              >
                <Trash2 size={15} />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-[#2D2926]">{request.name}</h3>
                  <span className={`px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] ${request.status === "Accepted" ? "bg-[#e5f7ec] text-[#0b6b35]" : request.status === "Denied" ? "bg-[#fff1f1] text-[#8a0000]" : "bg-[#f3f4f4] text-[#6d6560]"}`}>
                    {MEMBERSHIP_REQUEST_STATUSES.includes(request.status) ? request.status : "Pending"}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-[#6d6560]">{request.email}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-5 text-[#5b5450]">{request.message || "No optional note added."}</p>
                {request.reason && <p className="mt-3 border-l-4 border-[#0b6b35] bg-[#e5f7ec] px-3 py-2 text-sm font-bold text-[#0b6b35]">Reason: {request.reason}</p>}
              </div>
              <div className="grid gap-2.5">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                  Decision reason
                  <textarea
                    value={reviewReasons[request.id] ?? ""}
                    onChange={(event) => setReviewReasons((current) => ({ ...current, [request.id]: event.target.value }))}
                    rows={3}
                    placeholder="Defaults to Welcome to BUDS! when accepting"
                    className="resize-none border border-[#ded8d2] bg-[#f3f4f4] px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                  />
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => requestMembershipDecision(request, "Accepted")} className="flex-1 bg-[#2D2926] px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white">
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => requestMembershipDecision(request, "Denied")}
                    disabled={isAccepted}
                    className={`flex-1 px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white ${isAccepted ? "cursor-not-allowed bg-[#8f8781] opacity-60" : "bg-[#CC0000]"}`}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function JoinPage() {
  const [requests, setRequests] = useState(() => getStoredMembershipRequests());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestPassword, setRequestPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("success");

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

  const submitMembershipRequest = async (event) => {
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

    const existingLocalRequest = requests.find((request) => request.email.toLowerCase() === normalizedEmail);
    if (existingLocalRequest) {
      setSubmitMessageType("error");
      setSubmitMessage("That email already has a membership request. Please wait for an admin or e-board member to review it.");
      return;
    }

    const [existingDatabaseRequest, existingAccount] = await Promise.all([
      findMembershipRequestByEmail(normalizedEmail),
      findMemberAccountByEmail(normalizedEmail),
    ]);

    if (existingDatabaseRequest) {
      setSubmitMessageType("error");
      setSubmitMessage("That email already has a membership request. Please wait for an admin or e-board member to review it.");
      return;
    }

    if (existingAccount) {
      setSubmitMessageType("error");
      setSubmitMessage("That email already has a member account. Please log in through the Hub.");
      return;
    }

    const nextRequest = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      ...(!isSupabaseConfigured ? { password: requestPassword } : {}),
      message: message.trim(),
      status: "Pending",
      reason: "",
      created_at: new Date().toISOString(),
      reviewed_at: null,
    };

    if (isSupabaseConfigured) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: requestPassword,
        options: {
          data: { name: name.trim(), membership_status: "pending" },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      await supabase.auth.signOut();

      if (signUpError) {
        setSubmitMessageType("error");
        setSubmitMessage(signUpError.message || "Supabase could not create this login. Please try again.");
        return;
      }
    }

    const nextRequests = [nextRequest, ...requests];
    setRequests(nextRequests);
    saveStoredMembershipRequests(nextRequests);
    insertMembershipRequest(nextRequest);
    setName("");
    setEmail("");
    setRequestPassword("");
    setMessage("");
    setSubmitMessageType("success");
    setSubmitMessage("Request sent. An admin or e-board member can review it from this page.");
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
              New members request an account first. After an admin or e-board member accepts you, use this same BU email and password to log in through the Hub.
            </p>
          </div>
          <div className="mt-10 grid gap-4 border border-white/40 bg-white p-4 text-[#2D2926] sm:p-6">
            <div className="grid gap-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926] sm:grid-cols-3">
              <div className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2">1. Request</div>
              <div className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2">2. Wait for approval</div>
              <div className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2">3. Log in</div>
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

    </Page>
  );
}

function LoginPage({ onLogin, onRequestConfirmation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(() => (
    isSupabaseConfigured && new URLSearchParams(window.location.search).get("reset") === "password"
  ));

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) {
          setError("That password reset link could not be verified. Please request a new reset email.");
          return;
        }
        setIsPasswordRecovery(true);
        window.history.replaceState({}, "", "/login?reset=password");
      });
    }

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsPasswordRecovery(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isBuEmail = /@([a-z0-9-]+\.)?bu\.edu$/.test(normalizedEmail);

    if (!isBuEmail) {
      setError("Please use a BU email address ending in @bu.edu.");
      return;
    }

    let existingAccount;
    if (isSupabaseConfigured) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        setError("Incorrect account password.");
        return;
      }

      existingAccount = await findMemberAccountByEmail(normalizedEmail);
    } else {
      existingAccount = await findMemberAccountByEmail(normalizedEmail);
    }

    if (!existingAccount && normalizedEmail === TITLE_EDITING_TOGGLE_EMAIL) {
      existingAccount = {
        id: normalizedEmail,
        name: "Yeon",
        email: normalizedEmail,
        role: ADMIN_ROLE,
        status: "active",
      };
    }

    if (!existingAccount) {
      if (isSupabaseConfigured) await supabase.auth.signOut();
      setError("No accepted BUDS account was found for that email.");
      return;
    }

    if (existingAccount.status === "revoked") {
      if (isSupabaseConfigured) await supabase.auth.signOut();
      setError("This membership has been revoked. Contact BUDS if this is a mistake.");
      return;
    }

    if (!isSupabaseConfigured && existingAccount.password !== password) {
      setError("Incorrect account password.");
      return;
    }

    const auth = { role: existingAccount.role, email: existingAccount.email, name: existingAccount.name, accountId: existingAccount.id };
    saveStoredAuth(auth);
    onLogin(auth);
    navigateTo("/hub");
  };

  const sendPasswordReset = async (normalizedEmail) => {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/login?reset=password`,
    });

    if (resetError) {
      setError(resetError.message || "Could not send the password reset email. Please try again.");
      return;
    }

    setResetMessage("Password reset email sent. Open the link in your email to choose a new password.");
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const isBuEmail = /@([a-z0-9-]+\.)?bu\.edu$/.test(normalizedEmail);

    setError("");
    setResetMessage("");

    if (!isSupabaseConfigured) {
      setError("Password reset is available when Supabase is connected.");
      return;
    }

    if (!isBuEmail) {
      setError("Enter your BU email first, then request a password reset.");
      return;
    }

    const existingAccount = await findMemberAccountByEmail(normalizedEmail);
    if (!existingAccount || existingAccount.status !== "active") {
      setResetMessage("If this is an active approved BUDS account, a reset email will be sent.");
      return;
    }

    onRequestConfirmation({
      title: "Send password reset email?",
      body: `Supabase will email a password reset link to ${normalizedEmail}. Only use this if you want to reset this account password now.`,
      actionLabel: "Send Reset",
      onConfirm: () => sendPasswordReset(normalizedEmail),
    });
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setError("");
    setResetMessage("");

    if (newPassword.trim().length < 6) {
      setError("Please choose a password with at least 6 characters.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message || "Could not update your password. Please request a new reset email.");
      return;
    }

    await supabase.auth.signOut();
    setNewPassword("");
    setPassword("");
    setIsPasswordRecovery(false);
    setResetMessage("Password updated. You can log in with your new password.");
    window.history.replaceState({}, "", "/login");
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
            <a href="/join" onClick={(event) => { event.preventDefault(); navigateTo("/join"); }} className="mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:bg-[#f3f4f4] hover:text-[#CC0000]">
              Request Account <ArrowRight size={16} />
            </a>
          </div>
        </Card>

        <Card className="p-5 sm:p-8">
          {isPasswordRecovery ? (
          <form onSubmit={handlePasswordUpdate} className="grid gap-5">
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={6}
                required
                className="border border-[#ded8d2] bg-white px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
              />
            </label>
            {error && <p className="border-l-4 border-[#CC0000] bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#8a0000]">{error}</p>}
            {resetMessage && <p className="border-l-4 border-[#0b6b35] bg-[#e5f7ec] px-4 py-3 text-sm font-bold text-[#0b6b35]">{resetMessage}</p>}
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
              Update Password <Lock size={16} />
            </button>
          </form>
          ) : (
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
            <button type="button" onClick={handleForgotPassword} className="w-fit text-[0.58rem] font-black uppercase tracking-[0.08em] text-[#8a817b] underline decoration-[#8a817b]/30 underline-offset-4 transition hover:text-[#CC0000]">
              Forgot password?
            </button>
            {error && <p className="border-l-4 border-[#CC0000] bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#8a0000]">{error}</p>}
            {resetMessage && <p className="border-l-4 border-[#0b6b35] bg-[#e5f7ec] px-4 py-3 text-sm font-bold text-[#0b6b35]">{resetMessage}</p>}
            <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
              Log in <Lock size={16} />
            </button>
          </form>
          )}
        </Card>
      </div>
    </Page>
  );
}

function PrivateHubPage({ auth, trophiesContent, meetingsContent, noviceContent, eboardContent, homeContent, aboutContent, onTrophiesContentChange, onMeetingsContentChange, onNoviceContentChange, onEboardContentChange, onHomeContentChange, onAboutContentChange, onRequestConfirmation, onLogout }) {
  const [activeTab, setActiveTab] = useState("member");
  const [draftTrophiesContent, setDraftTrophiesContent] = useState(() => getStoredDraftContent("trophies", trophiesContent, normalizeTrophiesContent));
  const [draftMeetingsContent, setDraftMeetingsContent] = useState(() => getStoredDraftContent("meetings", meetingsContent, normalizeMeetingsContent));
  const [draftNoviceContent, setDraftNoviceContent] = useState(() => getStoredDraftContent("novice", noviceContent, normalizeNoviceContent));
  const [draftEboardContent, setDraftEboardContent] = useState(() => getStoredDraftContent("eboard", eboardContent, normalizeEboardContent));
  const [draftHomeContent, setDraftHomeContent] = useState(() => getStoredDraftContent("home", homeContent, normalizeHomeContent));
  const [draftAboutContent, setDraftAboutContent] = useState(() => getStoredDraftContent("about", aboutContent, normalizeAboutContent));
  const [contentRevisions, setContentRevisions] = useState(() => ({
    trophies: getStoredContentRevisions("trophies", normalizeTrophiesContent),
    meetings: getStoredContentRevisions("meetings", normalizeMeetingsContent),
    novice: getStoredContentRevisions("novice", normalizeNoviceContent),
    eboard: getStoredContentRevisions("eboard", normalizeEboardContent),
    about: getStoredContentRevisions("about", normalizeAboutContent),
  }));
  const [notes, setNotes] = useState(() => getStoredNotes());
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetingAnnouncement, setMeetingAnnouncement] = useState(draftMeetingsContent);
  const [budsiteEditorSectionTitles, setBudsiteEditorSectionTitles] = useState(() => getStoredBudsiteEditorSectionTitles());
  const [noviceFaqs, setNoviceFaqs] = useState(draftNoviceContent.faqs);
  const [noviceSpeechSteps, setNoviceSpeechSteps] = useState(draftNoviceContent.speechSteps || []);
  const [newNoviceFaq, setNewNoviceFaq] = useState({ question: "", answer: "" });
  const [noviceGlossaryTerms, setNoviceGlossaryTerms] = useState(() => getInitialNoviceGlossaryTerms(draftNoviceContent));
  const [selectedEditorGlossaryTermId, setSelectedEditorGlossaryTermId] = useState("");
  const [newGlossaryTerm, setNewGlossaryTerm] = useState({ term: "", category: "", definition: "", resourcesText: "" });
  const [eboardMembers, setEboardMembers] = useState(draftEboardContent.members || []);
  const [newEboardMember, setNewEboardMember] = useState({ name: "", role: "", email: "", bio: "", photo: "" });
  const [newCarouselSlide, setNewCarouselSlide] = useState({ src: "", alt: "", kicker: "", caption: "" });
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
  const [newCasebookCase, setNewCasebookCase] = useState({ label: "", description: "", url: "", topicTags: "" });
  const [casebookModalOpen, setCasebookModalOpen] = useState(false);
  const [newPrepOut, setNewPrepOut] = useState({ label: "", description: "", url: "", topicTags: "" });
  const [prepOutModalOpen, setPrepOutModalOpen] = useState(false);
  const [newRecording, setNewRecording] = useState({ label: "", description: "", url: "", topicTags: "Cases" });
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [resourceSearches, setResourceSearches] = useState({});
  const [memberAccounts, setMemberAccounts] = useState(() => getStoredMemberAccounts());
  const [memberAccountsStatus, setMemberAccountsStatus] = useState("idle");
  const [newTrophyStat, setNewTrophyStat] = useState({ value: "", label: "", detail: "" });
  const [newTrophyAccomplishment, setNewTrophyAccomplishment] = useState("");
  const [newTrophyMilestone, setNewTrophyMilestone] = useState({ year: "", title: "", copy: "" });
  const [newTrophyResult, setNewTrophyResult] = useState({ date: "", tournament: "", highlights: "" });
  const [selectedTrophySeasonId, setSelectedTrophySeasonId] = useState("");
  const [newTrophySeason, setNewTrophySeason] = useState("");
  const [newTrophyMember, setNewTrophyMember] = useState({ name: "", meta: "", achievement: "" });
  const [trophyMemberSearch, setTrophyMemberSearch] = useState("");
  const [apdaUpdatePreview, setApdaUpdatePreview] = useState(null);
  const [apdaUpdateStatus, setApdaUpdateStatus] = useState({ state: "idle", message: "" });
  const [notesEditorOpen, setNotesEditorOpen] = useState(false);
  const [announcementEditorOpen, setAnnouncementEditorOpen] = useState(false);
  const [noviceInfographicEditorOpen, setNoviceInfographicEditorOpen] = useState(false);
  const [noviceFaqEditorOpen, setNoviceFaqEditorOpen] = useState(false);
  const [noviceGlossaryEditorOpen, setNoviceGlossaryEditorOpen] = useState(false);
  const [noviceGlossaryManagerSearch, setNoviceGlossaryManagerSearch] = useState("");
  const [eboardEditorOpen, setEboardEditorOpen] = useState(false);
  const [carouselEditorOpen, setCarouselEditorOpen] = useState(false);
  const [historyEditorOpen, setHistoryEditorOpen] = useState(false);
  const [trophyEditorOpen, setTrophyEditorOpen] = useState(false);
  const [trophyEditorSection, setTrophyEditorSection] = useState("stats");
  const notesEditorCardRef = useAutoScrollOnOpen(notesEditorOpen);
  const announcementEditorCardRef = useAutoScrollOnOpen(announcementEditorOpen);
  const noviceGlossaryEditorCardRef = useAutoScrollOnOpen(noviceGlossaryEditorOpen);
  const noviceInfographicEditorCardRef = useAutoScrollOnOpen(noviceInfographicEditorOpen);
  const noviceFaqEditorCardRef = useAutoScrollOnOpen(noviceFaqEditorOpen);
  const eboardEditorCardRef = useAutoScrollOnOpen(eboardEditorOpen);
  const historyEditorCardRef = useAutoScrollOnOpen(historyEditorOpen);
  const trophyEditorCardRef = useAutoScrollOnOpen(trophyEditorOpen);
  const carouselEditorCardRef = useAutoScrollOnOpen(carouselEditorOpen);
  const [editorNotice, setEditorNotice] = useState({ type: "", message: "" });
  const [dragItem, setDragItem] = useState(null);
  const [previewDraftId, setPreviewDraftId] = useState("");
  const [adminControlSettings, setAdminControlSettings] = useState(() => normalizeAdminControlSettings());
  const [resourceEditModeEnabled, setResourceEditModeEnabled] = useState(() => {
    if (auth?.role !== "eboard" || !auth?.email) return false;
    return getStoredResourceEditMode(auth.email);
  });
  const initialBudsiteEditorSectionTitlesRef = useRef(budsiteEditorSectionTitles);

  const isAdmin = auth?.role === ADMIN_ROLE;
  const isTitleEditingToggleAccount = auth?.email?.toLowerCase() === TITLE_EDITING_TOGGLE_EMAIL;
  const authEmail = auth?.email?.toLowerCase();
  const canManageMembers = isAdmin || MEMBER_MANAGER_EMAILS.includes(authEmail);
  const isEboard = auth?.role === "eboard" || isAdmin;
  const canEditWorkspace = isEboard;
  const canEditTrophies = isEboard;
  const canWriteNotes = isEboard;
  const canEditBudsiteTitles = isAdmin && (!isTitleEditingToggleAccount || adminControlSettings.titleEditingEnabledForYeon);
  const canEditMemberLinks = canEditBudsiteTitles || (auth?.role === "eboard" && resourceEditModeEnabled);
  const canEditCasebookLinks = canEditMemberLinks;
  const canEditMemberLinkTileContent = canEditMemberLinks;
  const canDeleteCasebookLinks = canEditMemberLinks;
  const canUsePrivateTabs = isEboard || canManageMembers;
  const visibleTab = activeTab === "member" || activeTab === "operations" || canUsePrivateTabs ? activeTab : "member";
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
    : visibleTab === "operations"
      ? "Club Resources"
      : visibleTab === "members"
        ? "Members"
        : visibleTab === "budsite"
          ? "Budsite Editor"
          : visibleTab === "requests"
            ? "Membership Requests"
            : "E-Board Workspace";
  const memberLinksBySection = privateLinkSections.map((section) => ({
    section,
    links: memberLinks
      .filter((link) => getPrivateLinkSection(link) === section)
      .sort((a, b) => (
        ["BUDS Casebook", "BUDS Prep Outs", "Recorded APDA Rounds"].includes(section)
          ? getMemberLinkTitleValue(a).localeCompare(getMemberLinkTitleValue(b), undefined, { sensitivity: "base" })
          : 0
      )),
  })).filter((group) => group.links.length > 0 && !["Forms", "Debater Resources"].includes(group.section));
  const nonCompetitiveFormLinks = memberLinks.filter((link) => getPrivateLinkSection(link) === "Forms");
  const prepOutRequestLink = memberLinks.find((link) => link.id === "link-prep-out");
  const getFilteredResourceLinks = (group) => {
    const query = (resourceSearches[group.section] || "").trim().toLowerCase();
    if (!query) return group.links;
    return group.links.filter((link) => [
      getMemberLinkTitleValue(link),
      link.description,
      link.url,
      ...(link.topicTags || []),
    ].join(" ").toLowerCase().includes(query));
  };
  const contentDashboardItems = [
    { id: "home", title: "Landing Page", href: "/", draft: draftHomeContent, published: homeContent },
    { id: "about", title: "About Page", href: "/about", draft: draftAboutContent, published: aboutContent },
    { id: "history", title: "History", href: "/history", draft: { milestones: draftTrophiesContent.milestones }, published: { milestones: trophiesContent.milestones }, publishId: "history", revisionId: "trophies", previewId: "history" },
    { id: "trophies", title: "Trophies", href: "/trophies", draft: draftTrophiesContent, published: trophiesContent },
    { id: "meetings", title: "Meetings Announcement", href: "/meetings", draft: draftMeetingsContent, published: meetingsContent },
    { id: "novice", title: "Novice Hub", href: "/novice-hub", draft: draftNoviceContent, published: noviceContent },
    { id: "eboard", title: "E-Board Page", href: "/eboard", draft: draftEboardContent, published: eboardContent },
  ];

  const showEditorNotice = (message, type = "success") => {
    setEditorNotice({ type, message });
  };

  const toggleResourceEditMode = () => {
    if (auth?.role !== "eboard" || !auth?.email) return;
    setResourceEditModeEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(getResourceEditModeStorageKey(auth.email), String(next));
      return next;
    });
  };

  const toggleTitleEditingForYeon = () => {
    if (!isAdmin) return;
    const nextSettings = normalizeAdminControlSettings({
      ...adminControlSettings,
      titleEditingEnabledForYeon: !adminControlSettings.titleEditingEnabledForYeon,
    });
    setAdminControlSettings(nextSettings);
    upsertAdminControlSettings(nextSettings);
  };

  const updateBudsiteEditorSectionTitle = (id, field, value) => {
    const canEditResourceDescription = field === "description" && resourceDescriptionEditIds.includes(id) && canEditMemberLinks;
    if (!canEditBudsiteTitles && !canEditResourceDescription) return;
    const nextTitles = normalizeBudsiteEditorSectionTitles({
      ...budsiteEditorSectionTitles,
      [id]: {
        ...(budsiteEditorSectionTitles[id] || defaultBudsiteEditorSectionTitles[id]),
        [field]: value,
      },
    });
    setBudsiteEditorSectionTitles(nextTitles);
    saveStoredBudsiteEditorSectionTitles(nextTitles);
    upsertBudsiteEditorSectionTitles(nextTitles);
  };

  const renderBudsiteEditorSectionTitle = (id) => {
    const sectionTitle = budsiteEditorSectionTitles[id] || defaultBudsiteEditorSectionTitles[id];
    const sectionCount = id === "novice" && !isAdmin ? "1 editor" : sectionTitle.count;
    return (
      <span className="flex w-full items-center justify-between gap-3 border-b-2 border-[#CC0000] pb-2">
        {canEditBudsiteTitles ? (
          <span
            className="grid min-w-0 flex-1 gap-1"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <input
              value={sectionTitle.eyebrow}
              onChange={(event) => updateBudsiteEditorSectionTitle(id, "eyebrow", event.target.value)}
              className="w-full border border-transparent bg-transparent p-0 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1"
              aria-label="Dropdown eyebrow"
            />
            <input
              value={sectionTitle.title}
              onChange={(event) => updateBudsiteEditorSectionTitle(id, "title", event.target.value)}
              className="w-full border border-transparent bg-transparent p-0 text-xl font-black text-[#2D2926] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1"
              aria-label="Dropdown title"
            />
          </span>
        ) : (
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">{sectionTitle.eyebrow}</span>
            <span className="mt-1 block text-xl font-black text-[#2D2926]">{sectionTitle.title}</span>
          </span>
        )}
        <span className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">{sectionCount}</span>
      </span>
    );
  };

  const renderEditableDropdownTitle = (id, metaText = "") => {
    const sectionTitle = budsiteEditorSectionTitles[id] || defaultBudsiteEditorSectionTitles[id] || { title: id };
    return (
      <span className="flex w-full items-center justify-between gap-3 border-b-2 border-[#CC0000] pb-2">
        {canEditBudsiteTitles ? (
          <input
            value={sectionTitle.title}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            onChange={(event) => updateBudsiteEditorSectionTitle(id, "title", event.target.value)}
            className="min-w-0 flex-1 border border-transparent bg-transparent p-0 text-xl font-black text-[#2D2926] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1"
            aria-label="Dropdown title"
          />
        ) : (
          <span className="min-w-0 flex-1 text-xl font-black text-[#2D2926]">{sectionTitle.title}</span>
        )}
        {metaText && (
          <span className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">{metaText}</span>
        )}
      </span>
    );
  };

  const renderEditableResourceNote = (id) => {
    const sectionTitle = budsiteEditorSectionTitles[id] || defaultBudsiteEditorSectionTitles[id] || {};
    const canEditResourceDescription = resourceDescriptionEditIds.includes(id) && canEditMemberLinks;
    if (canEditBudsiteTitles || canEditResourceDescription) {
      return (
        <textarea
          value={sectionTitle.description || ""}
          onChange={(event) => updateBudsiteEditorSectionTitle(id, "description", event.target.value)}
          rows={1}
          className="field-sizing-content min-h-0 w-full resize-none overflow-hidden border border-transparent bg-transparent p-0 text-sm font-semibold leading-6 text-[#5b5450] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1"
          aria-label="Section description"
        />
      );
    }
    return <p>{sectionTitle.description}</p>;
  };

  const renderEditablePrivatePageHeader = (id) => {
    const sectionTitle = budsiteEditorSectionTitles[id] || defaultBudsiteEditorSectionTitles[id] || {};
    if (canEditBudsiteTitles) {
      return (
        <div className="flex flex-col gap-2">
          <div className="min-w-0">
            <input
              value={sectionTitle.eyebrow || ""}
              onChange={(event) => updateBudsiteEditorSectionTitle(id, "eyebrow", event.target.value)}
              className="w-full border border-transparent bg-transparent p-0 text-xs font-black uppercase leading-none tracking-[0.18em] text-[#CC0000] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1"
              aria-label="Page eyebrow"
            />
            <textarea
              value={sectionTitle.title || ""}
              onChange={(event) => updateBudsiteEditorSectionTitle(id, "title", event.target.value)}
              rows={1}
              className="mt-2 block h-[3.2rem] w-full resize-none overflow-hidden border border-transparent bg-transparent p-0 text-4xl font-black leading-[1.02] tracking-tight text-[#2D2926] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1 md:h-[3.45rem] md:text-5xl"
              aria-label="Page title"
            />
          </div>
          <textarea
            value={sectionTitle.description || ""}
            onChange={(event) => updateBudsiteEditorSectionTitle(id, "description", event.target.value)}
            rows={1}
            className="h-6 max-w-xl resize-none overflow-hidden border border-transparent bg-transparent p-0 text-sm font-semibold leading-6 text-[#5b5450] outline-none focus:border-[#ded8d2] focus:bg-white focus:px-2 focus:py-1"
            aria-label="Page description"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CC0000]">{sectionTitle.eyebrow}</p>
          <h1 className="mt-2 max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-[#2D2926] md:text-5xl">
            {sectionTitle.title}
          </h1>
        </div>
        <p className="max-w-xl text-sm font-semibold leading-6 text-[#5b5450]">
          {sectionTitle.description}
        </p>
      </div>
    );
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

  const persistContentRevisions = (id, revisions) => {
    const nextRevisions = normalizeContentRevisions(id, revisions);
    setContentRevisions((current) => ({ ...current, [id]: nextRevisions }));
    saveStoredContentRevisions(id, nextRevisions);
    upsertContentRevisions(id, nextRevisions);
  };

  const updateRevisionList = (id, revision) => {
    persistContentRevisions(id, [revision, ...(contentRevisions[id] || [])]);
  };

  const publishContentDraft = (id) => {
    const publishMap = {
      trophies: {
        label: "Trophies page",
        published: trophiesContent,
        draft: draftTrophiesContent,
        normalizer: normalizeTrophiesContent,
        publish: onTrophiesContentChange,
        storageId: "trophies",
        revisionId: "trophies",
      },
      history: {
        label: "History page milestones",
        published: trophiesContent,
        draft: { ...trophiesContent, milestones: draftTrophiesContent.milestones },
        normalizer: normalizeTrophiesContent,
        publish: onTrophiesContentChange,
        setDraft: setDraftTrophiesContent,
        storageId: "trophies",
        revisionId: "trophies",
      },
      meetings: {
        label: "Meetings page announcement",
        published: meetingsContent,
        draft: draftMeetingsContent,
        normalizer: normalizeMeetingsContent,
        publish: onMeetingsContentChange,
        storageId: "meetings",
        revisionId: "meetings",
      },
      novice: {
        label: "Novice Hub",
        published: noviceContent,
        draft: draftNoviceContent,
        normalizer: normalizeNoviceContent,
        publish: onNoviceContentChange,
        storageId: "novice",
        revisionId: "novice",
      },
      eboard: {
        label: "E-Board page",
        published: eboardContent,
        draft: draftEboardContent,
        normalizer: normalizeEboardContent,
        publish: onEboardContentChange,
        storageId: "eboard",
        revisionId: "eboard",
      },
      home: {
        label: "Landing page",
        published: homeContent,
        draft: draftHomeContent,
        normalizer: normalizeHomeContent,
        publish: onHomeContentChange,
        storageId: "home",
        revisionId: "home",
      },
      about: {
        label: "About page",
        published: aboutContent,
        draft: draftAboutContent,
        normalizer: normalizeAboutContent,
        publish: onAboutContentChange,
        storageId: "about",
        revisionId: "about",
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
        updateRevisionList(target.revisionId || id, revision);
        target.publish(normalizedDraft);
        target.setDraft?.(normalizedDraft);
        saveStoredDraftContent(target.storageId || id, normalizedDraft);
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
      home: { setDraft: setDraftHomeContent, normalizer: normalizeHomeContent },
      about: { setDraft: setDraftAboutContent, normalizer: normalizeAboutContent },
    };
    const target = restoreMap[id];
    if (!target) return;
    const restoredContent = target.normalizer(revision.content);
    target.setDraft(restoredContent);
    target.sync?.(restoredContent);
    if (id === "novice") {
      setNoviceFaqs(restoredContent.faqs);
      setNoviceSpeechSteps(restoredContent.speechSteps || []);
      const restoredGlossaryTerms = getInitialNoviceGlossaryTerms(restoredContent);
      setNoviceGlossaryTerms(restoredGlossaryTerms);
      setSelectedEditorGlossaryTermId(restoredGlossaryTerms[0]?.id || "");
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
        persistContentRevisions(id, nextRevisions);
        showEditorNotice("Revision deleted.");
      },
    });
  };

  useEffect(() => {
    let ignore = false;

    async function hydrateSharedRevisions() {
      const revisionEntries = await Promise.all(
        contentRevisionIds.map(async (id) => {
          const sharedRevisions = await loadContentRevisions(id);
          return [id, sharedRevisions];
        }),
      );
      if (ignore) return;

      setContentRevisions((current) => {
        const next = { ...current };
        revisionEntries.forEach(([id, sharedRevisions]) => {
          if (sharedRevisions) {
            next[id] = sharedRevisions;
            saveStoredContentRevisions(id, sharedRevisions);
            return;
          }
          if ((current[id] || []).length > 0) {
            upsertContentRevisions(id, current[id]);
          }
        });
        return next;
      });
    }

    hydrateSharedRevisions();

    return () => {
      ignore = true;
    };
  }, []);

  const newNoviceFaqDuplicate = hasDuplicateValue(noviceFaqs, newNoviceFaq.question, (faq) => faq.question);
  const newEboardMemberDuplicate = hasDuplicateValue(eboardMembers, newEboardMember.name, (member) => member.name);
  const newTrophyStatDuplicate = hasDuplicateValue(draftTrophiesContent.stats, newTrophyStat.label, (stat) => stat.label);
  const newTrophyAccomplishmentDuplicate = hasDuplicateValue(draftTrophiesContent.accomplishments, newTrophyAccomplishment, (item) => item.text);
  const newTrophyMilestoneDuplicate = hasDuplicateValue(draftTrophiesContent.milestones, newTrophyMilestone.title, (item) => item.title);
  const newTrophyResultDuplicate = hasDuplicateValue(selectedTrophySeason?.results || [], newTrophyResult.tournament, (result) => result.tournament);
  const selectedEditorGlossaryTerm = noviceGlossaryTerms.find((term) => term.id === selectedEditorGlossaryTermId);
  const normalizedGlossaryManagerSearch = noviceGlossaryManagerSearch.trim().toLowerCase();
  const visibleNoviceGlossaryTerms = normalizedGlossaryManagerSearch
    ? noviceGlossaryTerms.filter((term) => (
      term.term.toLowerCase().includes(normalizedGlossaryManagerSearch)
      || term.category.toLowerCase().includes(normalizedGlossaryManagerSearch)
      || term.definition.toLowerCase().includes(normalizedGlossaryManagerSearch)
    ))
    : noviceGlossaryTerms;
  const normalizedTrophyMemberSearch = trophyMemberSearch.trim().toLowerCase();
  const visibleTrophyMembers = draftTrophiesContent.members
    .map((member, index) => ({ member, index }))
    .filter(({ member }) => (
      !normalizedTrophyMemberSearch
      || member.name.toLowerCase().includes(normalizedTrophyMemberSearch)
      || member.meta.toLowerCase().includes(normalizedTrophyMemberSearch)
      || member.achievements.some((achievement) => achievement.toLowerCase().includes(normalizedTrophyMemberSearch))
    ));

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
        setNoviceGlossaryTerms((current) => current.length > 0 ? current : getInitialNoviceGlossaryTerms(databaseState.noviceContent));
        onNoviceContentChange(databaseState.noviceContent);
      }
      if (databaseState.eboardContent) {
        setDraftEboardContent((current) => current || databaseState.eboardContent);
        setEboardMembers((current) => current.length > 0 ? current : databaseState.eboardContent.members || []);
        onEboardContentChange(databaseState.eboardContent);
      }
      if (databaseState.homeContent) {
        setDraftHomeContent((current) => current || databaseState.homeContent);
        onHomeContentChange(databaseState.homeContent);
      }
      if (databaseState.aboutContent) {
        setDraftAboutContent((current) => current || databaseState.aboutContent);
        onAboutContentChange(databaseState.aboutContent);
      }
      if (databaseState.budsiteEditorSectionTitles) {
        setBudsiteEditorSectionTitles(databaseState.budsiteEditorSectionTitles);
        saveStoredBudsiteEditorSectionTitles(databaseState.budsiteEditorSectionTitles);
      } else if (isAdmin && hasCustomBudsiteEditorSectionTitles(initialBudsiteEditorSectionTitlesRef.current)) {
        upsertBudsiteEditorSectionTitles(initialBudsiteEditorSectionTitlesRef.current);
      }
      if (databaseState.adminControlSettings) {
        setAdminControlSettings(databaseState.adminControlSettings);
      }
      saveStoredAgenda(databaseState.agenda);
      saveStoredNotes(databaseState.notes);
      saveStoredBudget(databaseState.budget);
      saveStoredPrivateLinks(databaseState.privateLinks);
      if (databaseState.eboardContent) saveStoredEboardContent(databaseState.eboardContent);
      if (databaseState.homeContent) saveStoredHomeContent(databaseState.homeContent);
      if (databaseState.aboutContent) saveStoredAboutContent(databaseState.aboutContent);
    }

    hydrateFromDatabase();

    return () => {
      ignore = true;
    };
  }, [isAdmin, onAboutContentChange, onEboardContentChange, onHomeContentChange, onMeetingsContentChange, onNoviceContentChange]);

  const hydrateMemberAccounts = useCallback(async () => {
    if (!canManageMembers) return;
    setMemberAccountsStatus("loading");
    const databaseAccounts = await loadMemberAccounts();
    if (!databaseAccounts) {
      setMemberAccountsStatus("error");
      return;
    }
    setMemberAccounts(databaseAccounts);
    saveStoredMemberAccounts(databaseAccounts);
    setMemberAccountsStatus("loaded");
  }, [canManageMembers]);

  useEffect(() => {
    let ignore = false;

    async function hydrateOnMount() {
      if (!canManageMembers) return;
      const databaseAccounts = await loadMemberAccounts();
      if (!databaseAccounts || ignore) {
        if (!ignore) setMemberAccountsStatus("error");
        return;
      }
      setMemberAccounts(databaseAccounts);
      saveStoredMemberAccounts(databaseAccounts);
      setMemberAccountsStatus("loaded");
    }

    hydrateOnMount();

    return () => {
      ignore = true;
    };
  }, [canManageMembers]);

  useEffect(() => {
    let ignore = false;

    async function hydrateOnMembersTab() {
      if (!canManageMembers || visibleTab !== "members") return;
      const databaseAccounts = await loadMemberAccounts();
      if (!databaseAccounts || ignore) {
        if (!ignore) setMemberAccountsStatus("error");
        return;
      }
      setMemberAccounts(databaseAccounts);
      saveStoredMemberAccounts(databaseAccounts);
      setMemberAccountsStatus("loaded");
    }

    hydrateOnMembersTab();

    return () => {
      ignore = true;
    };
  }, [canManageMembers, visibleTab]);

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
    const nextContent = { ...draftNoviceContent, speechSteps: noviceSpeechSteps, faqs: nextFaqs, glossaryTerms: noviceGlossaryTerms };
    setDraftNoviceContent(nextContent);
    setNoviceFaqs(nextFaqs);
    saveStoredDraftContent("novice", nextContent);
    showEditorNotice("Novice FAQ draft saved. Publish it when ready.");
  };

  const persistNoviceSpeechSteps = (nextSteps) => {
    if (!isAdmin) return;
    const normalizedSteps = [...nextSteps].sort((a, b) => Number(a.order) - Number(b.order));
    const nextContent = { ...draftNoviceContent, speechSteps: normalizedSteps, faqs: noviceFaqs, glossaryTerms: noviceGlossaryTerms };
    setDraftNoviceContent(nextContent);
    setNoviceSpeechSteps(normalizedSteps);
    saveStoredDraftContent("novice", nextContent);
    showEditorNotice("Novice infographic draft saved. Publish it when ready.");
  };

  const persistNoviceGlossaryTerms = (nextTerms, nextSelectedId = selectedEditorGlossaryTermId) => {
    if (!canWriteNotes) return;
    const normalizedTerms = nextTerms.map(normalizeGlossaryTermForEditor).filter((term) => term.term.trim());
    const nextContent = { ...draftNoviceContent, speechSteps: noviceSpeechSteps, faqs: noviceFaqs, glossaryTerms: normalizedTerms };
    setDraftNoviceContent(nextContent);
    setNoviceGlossaryTerms(normalizedTerms);
    setSelectedEditorGlossaryTermId(nextSelectedId || normalizedTerms[0]?.id || "");
    saveStoredDraftContent("novice", nextContent);
    showEditorNotice("APDA glossary draft saved. Publish it when ready.");
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

  const parseGlossaryResources = (resourcesText = "") => resourcesText
    .split("\n")
    .map((line) => {
      const [label = "", ...urlParts] = line.split("|");
      return { label: label.trim(), url: urlParts.join("|").trim() };
    })
    .filter((resource) => resource.label && resource.url);

  const formatGlossaryResources = (resources = []) => resources.map((resource) => `${resource.label} | ${resource.url}`).join("\n");

  const addGlossaryTerm = (event) => {
    event.preventDefault();
    const term = newGlossaryTerm.term.trim();
    const definition = newGlossaryTerm.definition.trim();
    if (!term || !definition) {
      showEditorNotice("Add a term and definition before saving.", "error");
      return;
    }
    if (hasDuplicateValue(noviceGlossaryTerms, term, (item) => item.term)) {
      showEditorNotice("That glossary term already exists.", "error");
      return;
    }
    const nextTerm = normalizeGlossaryTermForEditor({
      id: createGlossaryId(term),
      term,
      category: newGlossaryTerm.category.trim() || "General",
      definition,
      resources: parseGlossaryResources(newGlossaryTerm.resourcesText),
    });
    persistNoviceGlossaryTerms([...noviceGlossaryTerms, nextTerm], nextTerm.id);
    setNewGlossaryTerm({ term: "", category: "", definition: "", resourcesText: "" });
  };

  const updateGlossaryTerm = (id, field, value) => {
    persistNoviceGlossaryTerms(noviceGlossaryTerms.map((item) => (
      item.id === id
        ? {
          ...item,
          [field]: field === "resources" ? parseGlossaryResources(value) : value,
        }
        : item
    )), id);
  };

  const deleteGlossaryTerm = (term) => {
    if (!term) return;
    requestDeleteConfirmation({
      title: `Delete "${term.term}"?`,
      body: "This term will be removed from the public APDA Glossary after the Novice Hub draft is published.",
      onConfirm: () => {
        const nextTerms = noviceGlossaryTerms.filter((item) => item.id !== term.id);
        persistNoviceGlossaryTerms(nextTerms, nextTerms[0]?.id || "");
      },
    });
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
    const cleanedTotal = cleanCurrencyInputValue(total);
    const normalizedTotal = cleanedTotal === "" ? "0.00" : cleanedTotal;
    if (!isBudgetInputValue(normalizedTotal)) return;
    const nextBudget = { ...budget, total: normalizedTotal };
    updateBudget(nextBudget);
    upsertBudgetSettings(budgetNumberValue(normalizedTotal));
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
    if (!category || !Number.isFinite(amount) || amount === 0) return;

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
    if (!isSignedBudgetInputValue(value)) return;
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

  const addCasebookCase = (event) => {
    event.preventDefault();
    if (!canEditMemberLinks) return;
    const label = newCasebookCase.label.trim();
    const description = newCasebookCase.description.trim();
    const url = newCasebookCase.url.trim();
    if (!label || !description || !url) {
      showEditorNotice("Add a case title, case statement, and link before saving.", "error");
      return;
    }

    const topicTags = newCasebookCase.topicTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 2);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "case";
    const nextCase = {
      id: `casebook-${slug}-${Date.now()}`,
      section: "BUDS Casebook",
      order: memberLinks.length + 1,
      label,
      description,
      url,
      topicTags,
    };
    const nextLinks = [...memberLinks, nextCase];
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    upsertPrivateLink(nextCase);
    setNewCasebookCase({ label: "", description: "", url: "", topicTags: "" });
    setCasebookModalOpen(false);
    showEditorNotice("Casebook case added.");
  };

  const addPrepOut = (event) => {
    event.preventDefault();
    if (!canEditMemberLinks) return;
    const label = newPrepOut.label.trim();
    const description = newPrepOut.description.trim();
    const url = newPrepOut.url.trim();
    if (!label || !description || !url) {
      showEditorNotice("Add a prep-out title, case statement, and link before saving.", "error");
      return;
    }

    const topicTags = newPrepOut.topicTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 2);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "prep-out";
    const nextPrepOut = {
      id: `prepout-${slug}-${Date.now()}`,
      section: "BUDS Prep Outs",
      order: memberLinks.length + 1,
      label,
      description,
      url,
      topicTags,
    };
    const nextLinks = [...memberLinks, nextPrepOut];
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    upsertPrivateLink(nextPrepOut);
    setNewPrepOut({ label: "", description: "", url: "", topicTags: "" });
    setPrepOutModalOpen(false);
    showEditorNotice("Prep-out added.");
  };

  const addRecording = (event) => {
    event.preventDefault();
    if (!canEditMemberLinks) return;
    const label = newRecording.label.trim();
    const description = newRecording.description.trim();
    const url = newRecording.url.trim();
    if (!label || !description || !url) {
      showEditorNotice("Add a recording title, case or motion statement, and link before saving.", "error");
      return;
    }

    const topicTags = newRecording.topicTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 2);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "recording";
    const nextRecording = {
      id: `recording-${slug}-${Date.now()}`,
      section: "Recorded APDA Rounds",
      order: memberLinks.length + 1,
      label,
      description,
      url,
      topicTags,
    };
    const nextLinks = [...memberLinks, nextRecording];
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    upsertPrivateLink(nextRecording);
    setNewRecording({ label: "", description: "", url: "", topicTags: "Cases" });
    setRecordingModalOpen(false);
    showEditorNotice("Recording added.");
  };

  const deleteCasebookCase = (caseLink) => {
    if (!canDeleteCasebookLinks) return;
    const section = getPrivateLinkSection(caseLink);
    const resourceLabel = section === "BUDS Prep Outs" ? "prep out" : section === "Recorded APDA Rounds" ? "recording" : "case";
    requestDeleteConfirmation({
      title: `Delete ${caseLink.label || `this ${resourceLabel}`}?`,
      body: `This ${resourceLabel} will be removed from the ${getPrivateLinkSection(caseLink)} list.`,
      actionLabel: `Delete ${resourceLabel}`,
      onConfirm: () => {
        const tombstone = {
          ...caseLink,
          label: caseLink.label || "Deleted case",
          description: "__deleted__",
          url: "__deleted__",
        };
        const nextLinks = memberLinks.filter((link) => link.id !== caseLink.id);
        setMemberLinks(nextLinks);
        saveStoredPrivateLinks([...nextLinks, tombstone]);
        upsertPrivateLink(tombstone);
        showEditorNotice("Casebook case deleted.");
      },
    });
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
      email: newEboardMember.email.trim(),
      bio: newEboardMember.bio.trim(),
      photo: newEboardMember.photo,
    };
    persistEboardContent((content) => ({ ...content, members: [...content.members, nextMember] }));
    setNewEboardMember({ name: "", role: "", email: "", bio: "", photo: "" });
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

  const persistHomeContent = (updater) => {
    if (!canWriteNotes) return;
    const nextContent = typeof updater === "function" ? updater(draftHomeContent) : updater;
    const normalizedContent = normalizeHomeContent(nextContent);
    setDraftHomeContent(normalizedContent);
    saveStoredDraftContent("home", normalizedContent);
    showEditorNotice("Landing page community carousel draft saved. Publish it when ready.");
  };

  const updateCarouselSlide = (id, field, value) => {
    const nextValue = field === "caption" ? value.slice(0, HOME_CAROUSEL_CAPTION_MAX_LENGTH) : value;
    persistHomeContent((content) => ({
      ...content,
      carouselSlides: content.carouselSlides.map((slide) => (
        slide.id === id ? { ...slide, [field]: nextValue } : slide
      )),
    }));
  };

  const handleCarouselPhotoUpload = async (id, file) => {
    if (!canWriteNotes || !file || !file.type.startsWith("image/")) return;
    const storedUrl = await uploadPublicImage(file, "home-carousel");
    const photo = storedUrl || await readFileAsDataUrl(file);
    updateCarouselSlide(id, "src", photo);
    showEditorNotice(storedUrl ? "Carousel photo uploaded to Supabase Storage." : "Photo saved locally for preview. Supabase Storage is not configured.", storedUrl ? "success" : "error");
  };

  const handleNewCarouselPhotoUpload = async (file) => {
    if (!canWriteNotes || !file || !file.type.startsWith("image/")) return;
    const storedUrl = await uploadPublicImage(file, "home-carousel");
    const photo = storedUrl || await readFileAsDataUrl(file);
    setNewCarouselSlide((current) => ({ ...current, src: photo }));
    showEditorNotice(storedUrl ? "Carousel photo uploaded to Supabase Storage." : "Photo saved locally for preview. Supabase Storage is not configured.", storedUrl ? "success" : "error");
  };

  const addCarouselSlide = (event) => {
    event.preventDefault();
    if (!canWriteNotes || !newCarouselSlide.src.trim()) {
      showEditorNotice("Upload a photo or paste an image URL before adding a carousel slide.", "error");
      return;
    }
    const carouselCardDefaults = [
      { title: "Build Lifelong Friendships", body: "Find a close-knit team that supports you through practices, tournaments, and everything in between." },
      { title: "Travel & Compete", body: "Represent BU at tournaments, explore new campuses, and make memories with teammates on the road." },
      { title: "Grow Your Skills", body: "Think critically, speak confidently, and learn how to build arguments under pressure." },
      { title: "Be Part of Our Legacy", body: "Join a tradition of competitive excellence and help carry Boston University debate forward." },
    ];
    const fallbackCard = carouselCardDefaults[draftHomeContent.carouselSlides.length % carouselCardDefaults.length];
    const nextSlide = {
      id: `home-slide-${Date.now()}`,
      src: newCarouselSlide.src.trim(),
      alt: newCarouselSlide.alt.trim() || "BUDS team photo",
      kicker: newCarouselSlide.kicker.trim() || fallbackCard.title,
      caption: (newCarouselSlide.caption.trim() || fallbackCard.body).slice(0, HOME_CAROUSEL_CAPTION_MAX_LENGTH),
    };
    persistHomeContent((content) => ({ ...content, carouselSlides: [...content.carouselSlides, nextSlide] }));
    setNewCarouselSlide({ src: "", alt: "", kicker: "", caption: "" });
  };

  const removeCarouselSlide = (slide) => {
    if (!canWriteNotes) return;
    requestDeleteConfirmation({
      title: `Delete ${slide.kicker || "this community card"}?`,
      body: "This will remove the card from the landing page community carousel draft.",
      onConfirm: () => {
        persistHomeContent((content) => ({
          ...content,
          carouselSlides: content.carouselSlides.filter((item) => item.id !== slide.id),
        }));
      },
    });
  };

  const moveCarouselSlide = (index, direction) => {
    persistHomeContent((content) => ({
      ...content,
      carouselSlides: moveArrayItem(content.carouselSlides, index, index + direction),
    }));
  };

  const dropCarouselSlide = (targetId) => {
    if (dragItem?.collection !== "home-carousel" || dragItem.id === targetId) return;
    persistHomeContent((content) => ({
      ...content,
      carouselSlides: reorderArrayById(content.carouselSlides, dragItem.id, targetId),
    }));
    finishEditorDrag();
  };

  const persistAboutContent = (updater) => {
    if (!canWriteNotes) return;
    const nextContent = typeof updater === "function" ? updater(draftAboutContent) : updater;
    const normalizedContent = normalizeAboutContent(nextContent);
    setDraftAboutContent(normalizedContent);
    saveStoredDraftContent("about", normalizedContent);
    showEditorNotice("About page draft saved. Publish it when ready.");
  };

  const updateAboutPhoto = (id, field, value) => {
    persistAboutContent((content) => ({
      ...content,
      photos: content.photos.map((photo) => (
        photo.id === id ? { ...photo, [field]: value } : photo
      )),
    }));
  };

  const handleAboutPhotoUpload = async (id, file) => {
    if (!canWriteNotes || !file || !file.type.startsWith("image/")) return;
    const storedUrl = await uploadPublicImage(file, "about-page");
    const photo = storedUrl || await readFileAsDataUrl(file);
    updateAboutPhoto(id, "src", photo);
    showEditorNotice(storedUrl ? "About photo uploaded to Supabase Storage." : "Photo saved locally for preview. Supabase Storage is not configured.", storedUrl ? "success" : "error");
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
    setApdaUpdateStatus({ state: "loading", message: "Pulling new APDA changes. Existing Trophies content is untouched." });
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
      const changes = buildApdaPreviewChangeSummary(draftTrophiesContent, data);
      const preview = { ...data, changes };
      setApdaUpdatePreview(preview);
      const addedCount = changes.added.length;
      const changedCount = changes.changed.length;
      const changeMessage = changes.all.length > 0
        ? `Review APDA changes before applying: ${addedCount} being added, ${changedCount} before and after change${changedCount === 1 ? "" : "s"}.`
        : "Nothing new is there. APDA matches the current Trophies draft, so there is nothing to apply.";
      setApdaUpdateStatus({
        state: changes.all.length > 0 ? "ready" : "idle",
        message: changeMessage,
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
    if (!apdaUpdatePreview.changes?.all?.length) {
      setApdaUpdateStatus({ state: "idle", message: "Nothing new is there. APDA matches the current Trophies draft, so there is nothing to apply." });
      return;
    }
    requestDeleteConfirmation({
      title: `Apply APDA update for ${apdaUpdatePreview.seasonDisplay}?`,
      body: `This will apply only the reviewed APDA changes: ${apdaUpdatePreview.changes.added.length} being added and ${apdaUpdatePreview.changes.changed.length} before and after change${apdaUpdatePreview.changes.changed.length === 1 ? "" : "s"}. You already reviewed the preview; this is the final save step.`,
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
    <>
    <Page className={isEboard ? "max-w-[98rem] py-3 md:py-4" : ""}>
      <div className="mb-3 border-b-4 border-[#CC0000] bg-white px-4 py-3 shadow-[0_16px_45px_rgba(45,41,38,0.08)] md:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Eyebrow>Private Hub</Eyebrow>
            <h1 className="mt-1.5 text-3xl font-black leading-tight tracking-tight text-[#2D2926] md:text-[2.2rem]">
              {hubTitle}
            </h1>
            <p className="mt-1.5 break-all text-sm font-semibold text-[#6d6560]">{auth.email}</p>
          </div>
          <button onClick={onLogout} className="inline-flex items-center justify-center gap-2 self-start border border-[#d6d0ca] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] shadow-[0_4px_0_#d6d0ca,0_12px_24px_rgba(45,41,38,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#CC0000] hover:bg-white hover:text-[#CC0000] hover:shadow-[0_5px_0_#CC0000,0_16px_30px_rgba(45,41,38,0.12)] active:translate-y-0.5 active:shadow-[0_2px_0_#CC0000,0_8px_18px_rgba(45,41,38,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC0000] focus-visible:ring-offset-2 md:self-center">
            Log out <LogOut size={15} />
          </button>
        </div>
        {(isEboard || canManageMembers) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#ded8d2] pt-2.5">
          {isAdmin && (
            <span className="inline-flex h-8 items-center bg-[#2D2926] px-3 text-[0.68rem] font-black uppercase leading-none tracking-[0.1em] text-white">
              Administrator
            </span>
          )}
          {!isAdmin && auth?.role === "eboard" && (
            <span className="inline-flex h-8 items-center bg-[#CC0000] px-3 text-[0.68rem] font-black uppercase leading-none tracking-[0.1em] text-white">
              E-Board
            </span>
          )}
          {!isAdmin && canManageMembers && (
            <span className="inline-flex h-8 items-center bg-[#CC0000] px-3 text-[0.68rem] font-black uppercase leading-none tracking-[0.1em] text-white">
              Member Manager
            </span>
          )}
          {isEboard && (
            <span className={`inline-flex h-8 items-center px-3 text-[0.68rem] font-black uppercase leading-none tracking-[0.1em] ${isSupabaseConfigured ? "bg-[#e5f7ec] text-[#0b6b35]" : "bg-[#fff1f1] text-[#8a0000]"}`}>
              {isSupabaseConfigured ? "Database connected" : "Local storage mode"}
            </span>
          )}
          {!isAdmin && auth?.role === "eboard" && (
            <button
              type="button"
              role="switch"
              aria-checked={resourceEditModeEnabled}
              onClick={toggleResourceEditMode}
              className="inline-flex h-8 items-center gap-2 border border-[#ded8d2] bg-white px-3 text-[0.68rem] font-black uppercase leading-none tracking-[0.1em] text-[#2D2926] transition hover:border-[#2D2926] md:ml-auto"
            >
              <span
                className={`h-3 w-6 rounded-full border transition ${
                  resourceEditModeEnabled
                    ? "border-[#79c792] bg-[#a8e6ba]"
                    : "border-[#ded8d2] bg-[#f3f4f4]"
                }`}
              >
                <span
                  className={`block h-full w-1/2 rounded-full bg-white transition ${
                    resourceEditModeEnabled ? "translate-x-full" : "translate-x-0"
                  }`}
                />
              </span>
              Edit Mode
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              role="switch"
              aria-checked={adminControlSettings.titleEditingEnabledForYeon}
              onClick={toggleTitleEditingForYeon}
              className="inline-flex h-8 items-center gap-2 border border-[#ded8d2] bg-white px-3 text-[0.68rem] font-black uppercase leading-none tracking-[0.1em] text-[#2D2926] transition hover:border-[#2D2926] md:ml-auto"
            >
              <span
                className={`h-3 w-6 rounded-full border transition ${
                  adminControlSettings.titleEditingEnabledForYeon
                    ? "border-[#79c792] bg-[#a8e6ba]"
                    : "border-[#ded8d2] bg-[#f3f4f4]"
                }`}
              >
                <span
                  className={`block h-full w-1/2 rounded-full bg-white transition ${
                    adminControlSettings.titleEditingEnabledForYeon ? "translate-x-full" : "translate-x-0"
                  }`}
                />
              </span>
              Edit Mode
            </button>
          )}
        </div>
        )}
      </div>

      <div className="mx-3 my-5 flex flex-wrap gap-2 border-y border-[#ded8d2] bg-[#f3f4f4]/70 px-3 py-3 sm:mx-5 sm:px-4">
        <button
          type="button"
          onClick={() => setActiveTab("member")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "member" ? "bg-[#2D2926] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
        >
          Debate Resources
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("operations")}
          className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "operations" ? "bg-[#2D2926] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
        >
          Club Resources
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
            <button
              type="button"
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 text-xs font-black uppercase tracking-[0.08em] transition duration-300 ${visibleTab === "requests" ? "bg-[#CC0000] text-white" : "border border-[#ded8d2] bg-white text-[#2D2926]"}`}
            >
              Membership Requests
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
        <div className="pt-2">
          <div className="mb-6 border-b-4 border-[#CC0000] pb-4">
            {renderEditablePrivatePageHeader("memberResourcesHero")}
              <div className={`overflow-hidden transition-all ${canEditMemberLinks ? "mt-3 max-h-16 opacity-100" : "mt-0 max-h-0 pointer-events-none opacity-0"}`}>
                <SaveNotice notice={editorNotice} />
              </div>
          </div>
          <div className="grid gap-7">
            {memberLinksBySection.map((group) => (
              <SmoothDetails
                key={group.section}
                className="border border-[#ded8d2] bg-white p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
                defaultOpen={group.section === "BUDS Team Specific Links"}
                title={renderEditableDropdownTitle(
                  group.section === "BUDS Casebook" ? "memberCasebook" : group.section === "BUDS Prep Outs" ? "memberPrepOuts" : group.section === "Recorded APDA Rounds" ? "memberRecordings" : "memberTeamLinks",
                  `${group.links.length} links`
                )}
              >
                {["BUDS Casebook", "BUDS Prep Outs", "Recorded APDA Rounds"].includes(group.section) ? (
                  <div className="grid gap-2">
                    {(() => {
                      const filteredLinks = getFilteredResourceLinks(group);
                      return (
                        <>
                    {group.section === "BUDS Prep Outs" && (
                      <div className="mb-3 grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3 text-sm font-semibold leading-6 text-[#5b5450]">
                        {renderEditableResourceNote("memberPrepOuts")}
                        <div className="flex flex-wrap gap-3">
                          <a href={prepOutRequestLink?.url || "#"} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#CC0000]">
                            Request a Prep-Out <ChevronRight size={14} />
                          </a>
                          {canEditMemberLinks && (
                            <button type="button" onClick={() => setPrepOutModalOpen(true)} className="inline-flex w-fit items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#CC0000]">
                              Add a Prep-Out <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {group.section === "Recorded APDA Rounds" && (
                      <div className="mb-3 grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3 text-sm font-semibold leading-6 text-[#5b5450]">
                        {renderEditableResourceNote("memberRecordings")}
                        {canEditMemberLinks && (
                          <button type="button" onClick={() => setRecordingModalOpen(true)} className="inline-flex w-fit items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#CC0000]">
                            Add Recording <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    )}
                    {group.section === "BUDS Casebook" && (
                      <div className="mb-3 grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3 text-sm font-semibold leading-6 text-[#5b5450]">
                        {renderEditableResourceNote("memberCasebook")}
                        {canEditMemberLinks && (
                          <button type="button" onClick={() => setCasebookModalOpen(true)} className="inline-flex w-fit items-center gap-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#CC0000]">
                            Add to Casebook <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="mb-2 grid gap-1">
                      <label className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#8f8781]" htmlFor={`resource-search-${group.section.replace(/\s+/g, "-").toLowerCase()}`}>
                        Search {group.section}
                      </label>
                      <input
                        id={`resource-search-${group.section.replace(/\s+/g, "-").toLowerCase()}`}
                        type="search"
                        value={resourceSearches[group.section] || ""}
                        onChange={(event) => setResourceSearches((current) => ({ ...current, [group.section]: event.target.value }))}
                        placeholder="Search by case, statement, tag, or link"
                        className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-semibold text-[#2D2926] outline-none transition focus:border-[#CC0000]"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {filteredLinks.map((link) => (
                        <div
                          key={link.id}
                          className="group relative flex min-h-[12rem] flex-col border border-[#ded8d2] bg-white p-4 shadow-[0_10px_28px_rgba(45,41,38,0.045)] transition hover:border-[#CC0000] hover:bg-[#fffafa] hover:shadow-[0_18px_40px_rgba(45,41,38,0.09)]"
                        >
                          <div className="mb-3 flex flex-wrap gap-1.5">
                              {canEditCasebookLinks ? (
                                <input
                                  type="text"
                                  value={(link.topicTags || []).slice(0, 2).join(", ")}
                                  onChange={(event) => updateMemberLink(link.id, "topicTags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 2))}
                                  placeholder="Tags, max 2"
                                  className="w-full border border-[#ded8d2] bg-[#f3f4f4] px-2 py-1 text-[0.68rem] font-bold text-[#2D2926] outline-none focus:border-[#CC0000]"
                                />
                              ) : (
                                (link.topicTags || ["Case"]).slice(0, 2).map((tag) => (
                                  <span key={tag} className="inline-flex bg-[#CC0000] px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.1em] text-white">
                                    {tag}
                                  </span>
                                ))
                              )}
                          </div>
                          {canEditCasebookLinks ? (
                            <textarea
                              value={getMemberLinkTitleValue(link)}
                              onChange={(event) => updateMemberLink(link.id, "label", event.target.value)}
                              rows={1}
                              className="block w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-xl font-black leading-tight text-[#2D2926] outline-none focus:text-[#CC0000]"
                            />
                          ) : (
                            <h3 className="break-words text-xl font-black leading-tight text-[#2D2926]">
                              <MemberLinkTitle link={link} />
                            </h3>
                          )}

                          {canEditCasebookLinks ? (
                            <textarea
                              value={link.description}
                              onChange={(event) => updateMemberLink(link.id, "description", event.target.value)}
                              rows={3}
                              className="mt-3 min-h-16 w-full flex-1 resize-none overflow-hidden border-0 bg-transparent p-0 text-sm font-medium leading-5 text-[#5b5450] outline-none focus:text-[#2D2926]"
                            />
                          ) : (
                            <p className="mt-3 flex-1 text-sm font-medium leading-5 text-[#5b5450]">{link.description}</p>
                          )}

                          <div className="mt-4 flex flex-wrap items-center border-t border-[#ded8d2] pt-3 gap-2">
                            <a href={link.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#CC0000]">
                              Open <ChevronRight className="transition group-hover:translate-x-1" size={12} />
                            </a>
                            {canEditCasebookLinks && (
                              <input
                                type="url"
                                value={link.url}
                                onChange={(event) => updateMemberLink(link.id, "url", event.target.value)}
                                placeholder="https://..."
                                className="min-w-0 flex-1 border border-[#ded8d2] bg-[#f3f4f4] px-2 py-1.5 text-xs font-medium text-[#2D2926] outline-none focus:border-[#CC0000]"
                              />
                            )}
                          </div>
                          {canDeleteCasebookLinks && (
                            <button
                              type="button"
                              onClick={() => deleteCasebookCase(link)}
                                  className="absolute bottom-3 right-3 grid h-6 w-6 place-items-center border border-[#ded8d2] bg-white text-[#8f8781] transition hover:border-[#CC0000] hover:bg-[#fff1f1] hover:text-[#CC0000]"
                                  aria-label={`Delete ${link.label || (group.section === "BUDS Prep Outs" ? "prep out" : group.section === "Recorded APDA Rounds" ? "recording" : "case")}`}
                                  title={group.section === "BUDS Prep Outs" ? "Delete prep out" : group.section === "Recorded APDA Rounds" ? "Delete recording" : "Delete case"}
                                >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {filteredLinks.length === 0 && (
                      <p className="border border-[#ded8d2] bg-[#f3f4f4] px-3 py-4 text-sm font-bold text-[#6d6560]">
                        No matching resources.
                      </p>
                    )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                    {group.links.map((link) => (
                    <div
                      key={link.id}
                      draggable={canEditMemberLinks}
                      onDragStart={() => startEditorDrag(`member-link-${group.section}`, link.id)}
                      onDragOver={allowEditorDrop}
                      onDrop={() => dropMemberLink(link.id, group.section)}
                      onDragEnd={finishEditorDrag}
                      className="group flex min-h-[12.5rem] flex-col border border-[#ded8d2] bg-white p-3 shadow-[0_10px_26px_rgba(45,41,38,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(45,41,38,0.09)]"
                    >
                      <div className="mb-3">
                        <span className="inline-flex bg-[#CC0000] px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.12em] text-white">
                          {group.section === "Forms" ? "Form" : group.section === "Debater Resources" ? "Resource" : group.section === "BUDS Casebook" ? "Case" : "Team Link"}
                        </span>
                      </div>
                      {canEditMemberLinkTileContent ? (
                        <>
                          <label className="grid gap-2">
                            <span className="sr-only">Link Name</span>
                            <textarea
                            value={getMemberLinkTitleValue(link)}
                            onChange={(event) => updateMemberLink(link.id, "label", event.target.value)}
                              rows={1}
                              className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-lg font-black leading-tight tracking-normal text-[#2D2926] outline-none focus:text-[#CC0000]"
                            />
                          </label>
                          <label className="mt-2 grid flex-1 gap-2">
                            <span className="sr-only">Description</span>
                            <textarea
                              value={limitLinkTileDescription(link.description)}
                              onChange={(event) => updateMemberLink(link.id, "description", limitLinkTileDescription(event.target.value))}
                              rows={3}
                              maxLength={LINK_TILE_DESCRIPTION_MAX_LENGTH}
                              className="h-[3.75rem] resize-none overflow-hidden border-0 bg-transparent p-0 text-sm font-medium leading-5 tracking-normal text-[#5b5450] outline-none focus:text-[#2D2926]"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <h3 className="break-words text-lg font-black leading-tight tracking-normal text-[#2D2926]">
                            <MemberLinkTitle link={link} />
                          </h3>
                          <p className="mt-2 flex-1 text-sm font-medium leading-5 text-[#5b5450]">{limitLinkTileDescription(link.description)}</p>
                        </>
                      )}
                      <div className="mt-3 grid gap-2">
                        <a href={link.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-[0.1em] text-[#CC0000]">
                          Open link <ChevronRight className="transition group-hover:translate-x-1" size={14} />
                        </a>
                        {canEditMemberLinkTileContent && (
                          <>
                            <label className="grid gap-1 text-[0.58rem] font-black uppercase tracking-[0.12em] text-[#8f8781]">
                              Edit URL
                              <input
                                type="url"
                                value={link.url}
                                onChange={(event) => updateMemberLink(link.id, "url", event.target.value)}
                                placeholder="https://..."
                                className="border border-[#ded8d2] bg-[#f3f4f4] px-2 py-1.5 text-[0.7rem] font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                    ))}
                  </div>
                )}
              </SmoothDetails>
            ))}
          </div>
        </div>
      )}

      {visibleTab === "operations" && (
        <div className="pt-2">
          <div className="mb-6 border-b-4 border-[#CC0000] pb-4">
            {renderEditablePrivatePageHeader("clubResourcesHero")}
              <div className={`overflow-hidden transition-all ${canEditMemberLinks ? "mt-3 max-h-16 opacity-100" : "mt-0 max-h-0 pointer-events-none opacity-0"}`}>
                <SaveNotice notice={editorNotice} />
              </div>
          </div>

          {nonCompetitiveFormLinks.length > 0 && (
            <SmoothDetails
              className="mb-5 border border-[#ded8d2] bg-white p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
              title={renderEditableDropdownTitle("clubForms", `${nonCompetitiveFormLinks.length} links`)}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                {nonCompetitiveFormLinks.map((link) => (
                  <div
                    key={link.id}
                    draggable={canEditMemberLinks}
                    onDragStart={() => startEditorDrag("member-link-Forms", link.id)}
                    onDragOver={allowEditorDrop}
                    onDrop={() => dropMemberLink(link.id, "Forms")}
                    onDragEnd={finishEditorDrag}
                    className="group flex min-h-[12.5rem] flex-col border border-[#ded8d2] bg-white p-3 shadow-[0_10px_26px_rgba(45,41,38,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(45,41,38,0.09)]"
                  >
                    <div className="mb-3">
                      <span className="inline-flex bg-[#CC0000] px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.12em] text-white">
                        Form
                      </span>
                    </div>
                    {canEditMemberLinkTileContent ? (
                      <>
                        <label className="grid gap-2">
                          <span className="sr-only">Link Name</span>
                          <textarea
                            value={getMemberLinkTitleValue(link)}
                            onChange={(event) => updateMemberLink(link.id, "label", event.target.value)}
                            rows={1}
                            className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-lg font-black leading-tight tracking-normal text-[#2D2926] outline-none focus:text-[#CC0000]"
                          />
                        </label>
                        <label className="mt-2 grid flex-1 gap-2">
                          <span className="sr-only">Description</span>
                          <textarea
                            value={limitLinkTileDescription(link.description)}
                            onChange={(event) => updateMemberLink(link.id, "description", limitLinkTileDescription(event.target.value))}
                            rows={3}
                            maxLength={LINK_TILE_DESCRIPTION_MAX_LENGTH}
                            className="h-[3.75rem] resize-none overflow-hidden border-0 bg-transparent p-0 text-sm font-medium leading-5 tracking-normal text-[#5b5450] outline-none focus:text-[#2D2926]"
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <h3 className="break-words text-lg font-black leading-tight tracking-normal text-[#2D2926]">
                          <MemberLinkTitle link={link} />
                        </h3>
                        <p className="mt-2 flex-1 text-sm font-medium leading-5 text-[#5b5450]">{limitLinkTileDescription(link.description)}</p>
                      </>
                    )}
                    <div className="mt-3 grid gap-2">
                      <a href={link.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-[0.1em] text-[#CC0000]">
                        Open link <ChevronRight className="transition group-hover:translate-x-1" size={14} />
                      </a>
                      {canEditMemberLinkTileContent && (
                        <>
                          <label className="grid gap-1 text-[0.58rem] font-black uppercase tracking-[0.12em] text-[#8f8781]">
                            Edit URL
                            <input
                              type="url"
                              value={link.url}
                              onChange={(event) => updateMemberLink(link.id, "url", event.target.value)}
                              placeholder="https://..."
                              className="border border-[#ded8d2] bg-[#f3f4f4] px-2 py-1.5 text-[0.7rem] font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SmoothDetails>
          )}

          <SmoothDetails
            className="mb-5 border border-[#ded8d2] bg-white p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderEditableDropdownTitle("clubParadigms", "Guide")}
          >
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-4">
                <div className="border-b-2 border-[#CC0000] pb-3">
                  <Eyebrow>Judge Adaptation</Eyebrow>
                  <h2 className="mt-1 text-2xl font-black leading-tight text-[#2D2926]">All About Paradigms</h2>
                  <p className="mt-1 max-w-2xl text-sm font-semibold leading-5 text-[#5b5450]">
                    A paradigm is the framework a judge uses to evaluate a round. Knowing it before the round helps you adapt your debating to what that judge values.
                  </p>
                </div>
                <div className="mt-4 grid gap-3">
                  {[
                    {
                      title: "Why paradigms matter",
                      body: "Some judges prefer real-world, robust arguments. Others may be willing to vote on fast blips read in the MG.",
                    },
                    {
                      title: "How to use them",
                      body: "Read your judge's preferences before round so you can adapt strategy, weighing, speed, and explanation.",
                    },
                    {
                      title: "How to find one",
                      body: "Open the paradigm spreadsheet and Command/Control-F your judge's name on the list.",
                    },
                    {
                      title: "If you are judging",
                      body: "Create a Google Doc, set viewing permissions to anyone with the link can view, then submit it through the form.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="border border-[#ded8d2] bg-white p-3">
                      <h3 className="text-base font-black text-[#2D2926]">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium leading-5 text-[#5b5450]">{item.body}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4">
                <Card className="p-4">
                  <Eyebrow>Before Round</Eyebrow>
                  <h2 className="mt-1 text-xl font-black text-[#2D2926]">Check Your Judge</h2>
                  <p className="mt-2 text-sm font-semibold leading-5 text-[#5b5450]">
                    Use the shared list to find judge paradigms and prep your approach before the round starts.
                  </p>
                  <a href="https://docs.google.com/spreadsheets/d/1ZMRIHR00ZXKPluV4sFORzcH-ROER-QiGPtOOblpEgdI/edit?gid=0#gid=0" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 bg-[#CC0000] px-4 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#a90000]">
                    Open Paradigm List <ExternalLink size={15} />
                  </a>
                </Card>
                <Card className="p-4">
                  <Eyebrow>When Judging</Eyebrow>
                  <h2 className="mt-1 text-xl font-black text-[#2D2926]">Submit a Paradigm</h2>
                  <p className="mt-2 text-sm font-semibold leading-5 text-[#5b5450]">
                    Make a public-view Google Doc explaining how you judge, then submit the link here.
                  </p>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSdS8k_CAvhQ1Z-y64SDc1JxjRSsPLCzAtAQpLLtr-ucNpT7YA/viewform" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                    Submit Paradigm <ExternalLink size={15} />
                  </a>
                </Card>
              </div>
            </div>
          </SmoothDetails>

          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderEditableDropdownTitle("clubReimbursements", "Guide")}
          >
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="p-4">
              <div className="flex flex-col gap-3 border-b-2 border-[#CC0000] pb-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Eyebrow>Terrier Central</Eyebrow>
                  <h2 className="mt-1 text-2xl font-black leading-tight text-[#2D2926]">Requesting a Reimbursement</h2>
                  <p className="mt-1 max-w-2xl text-sm font-semibold leading-5 text-[#5b5450]">
                    Use Terrier Central after you make an approved club purchase. Keep receipts and any event approval documentation ready before starting.
                  </p>
                </div>
                <DollarSign className="shrink-0 text-[#CC0000]" size={28} />
              </div>

              <ol className="mt-4 grid gap-2">
                {[
                  {
                    title: "Log in to Terrier Central",
                    body: "Go to terriercentral.bu.edu and sign in with your BU email.",
                  },
                  {
                    title: "Open the Student Reimbursement Request",
                    body: "Go to Forms, choose Student Reimbursement Request, then scroll down and click Next.",
                  },
                  {
                    title: "Select the BUDS account",
                    body: "On page 1, select BU Debate Society - 1124.",
                  },
                  {
                    title: "Choose Event or General Business",
                    body: "Use Event for tournament-related reimbursement. Use General Business for other approved club purchases.",
                  },
                  {
                    title: "Enter purchase and payee details",
                    body: "Add the event name/date if applicable, your name, address, phone number, BU email, BU ID, purchase description, reimbursement amount, and receipts.",
                  },
                  {
                    title: "Send it to the reviewer",
                    body: "For reviewer, enter njsaxena@bu.edu and submit.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="grid gap-3 border border-[#ded8d2] bg-white p-3 sm:grid-cols-[2.25rem_1fr]">
                    <span className="grid h-8 w-8 place-items-center bg-[#2D2926] text-xs font-black text-white">{index + 1}</span>
                    <div>
                      <h3 className="text-base font-black text-[#2D2926]">{step.title}</h3>
                      <p className="mt-0.5 text-sm font-medium leading-5 text-[#5b5450]">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <a href="https://terriercentral.bu.edu/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 bg-[#CC0000] px-4 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#a90000]">
                Open Terrier Central <ExternalLink size={16} />
              </a>
            </Card>

            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Eyebrow>Timeline</Eyebrow>
                    <h2 className="mt-1 text-xl font-black text-[#2D2926]">What Happens Next</h2>
                  </div>
                  <FileText className="text-[#CC0000]" size={24} />
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    "You should receive an SAO email confirming the submission.",
                    "Expect approval, denial, or a revision request in 3-5 business days.",
                    "If approved, checks are usually ready in about 2 weeks at the GSU 2nd floor.",
                  ].map((item) => (
                    <p key={item} className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2 text-sm font-semibold leading-5 text-[#2D2926]">
                      {item}
                    </p>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <Eyebrow>Before You Submit</Eyebrow>
                <h2 className="mt-1 text-xl font-black text-[#2D2926]">Have These Ready</h2>
                <ul className="mt-4 grid gap-2 text-sm font-semibold leading-5 text-[#5b5450]">
                  <li className="border border-[#ded8d2] bg-white p-2.5">Receipt for each purchase.</li>
                  <li className="border border-[#ded8d2] bg-white p-2.5">Event approval screenshot from SLIC for event/tournament requests.</li>
                  <li className="border border-[#ded8d2] bg-white p-2.5">Your mailing address, phone number, BU email, and BU ID.</li>
                  <li className="border border-[#ded8d2] bg-white p-2.5">A short description of what the purchase was used for.</li>
                </ul>
              </Card>
            </div>
            </div>
          </SmoothDetails>
        </div>
      )}

      {visibleTab === "requests" && isEboard && (
        <MembershipRequestsPanel auth={auth} onRequestConfirmation={onRequestConfirmation} />
      )}

      {visibleTab === "members" && canManageMembers && (
        <Card className="p-5">
          <div className="flex flex-col gap-2 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>{isAdmin ? "Administrator" : "Member Manager"}</Eyebrow>
              <h2 className="mt-2 text-3xl font-black text-[#2D2926]">Member Accounts</h2>
              <p className="mt-2 text-sm leading-6 text-[#5b5450]">Change account status between member and e-board, or revoke membership access.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-black uppercase tracking-[0.08em] text-[#6d6560]">{memberAccounts.length} accounts</p>
              <button type="button" onClick={hydrateMemberAccounts} className="border border-[#ded8d2] bg-[#f3f4f4] px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                Refresh
              </button>
            </div>
          </div>
          {memberAccountsStatus === "loading" && (
            <p className="mt-5 border-l-4 border-[#2D2926] bg-[#f3f4f4] px-4 py-3 text-sm font-bold text-[#2D2926]">Loading approved member accounts...</p>
          )}
          {memberAccountsStatus === "error" && (
            <p className="mt-5 border-l-4 border-[#CC0000] bg-[#fff1f1] px-4 py-3 text-sm font-bold text-[#8a0000]">Could not load approved member accounts from Supabase. Try Refresh or check the database connection.</p>
          )}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead className="bg-[#2D2926] text-white">
                <tr>
                  <th className="px-4 py-3 font-black">Name</th>
                  <th className="px-4 py-3 font-black">Email</th>
                  <th className="px-4 py-3 font-black">Status</th>
                  <th className="px-4 py-3 font-black">Role</th>
                  <th className="w-64 px-4 py-3 font-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {memberAccounts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] px-4 py-6 text-center font-bold text-[#5b5450]">
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
                        className="border border-[#ded8d2] bg-[#f3f4f4] px-3 py-2 font-bold uppercase tracking-[0.08em] text-[#CC0000] outline-none focus:border-[#CC0000] disabled:opacity-50"
                      >
                        <option value="member">Member</option>
                        <option value="eboard">E-Board</option>
                      </select>
                    </td>
                    <td className="w-64 px-4 py-3">
                      <div className="flex w-full items-center justify-between gap-4">
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
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <Card className="relative flex min-h-[28rem] flex-col p-4 sm:min-h-[34rem] sm:p-5">
              <div className={`pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 bg-[#0b6b35] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white transition duration-700 ${agendaCompleteFlash ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
                Checked off
              </div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ClipboardList className="text-[#CC0000]" />
                  <h2 className="text-xl font-black text-[#2D2926]">Agenda</h2>
                </div>
                <button
                  type="button"
                  onClick={undoAgendaDelete}
                  disabled={!canEditWorkspace || !lastDeletedAgendaItem}
                  className="border border-[#ded8d2] bg-[#f3f4f4] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] disabled:cursor-not-allowed disabled:opacity-40"
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
                    <div className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-4 text-sm font-bold text-[#5b5450]">
                      No Agenda Items Right Now. Add One Above.
                    </div>
                  )}
                  {agenda.map((item) => {
                    const isComplete = Boolean(item.completed_at);
                    return (
                      <div key={item.id} className={`group flex items-start gap-3 border p-3 transition ${isComplete ? "border-[#c9c2bc] bg-[#d4d0cc] opacity-80" : "border-[#ded8d2] bg-[#f3f4f4]"}`}>
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
                  <span className="flex items-center gap-1 text-2xl font-black">
                    <span aria-hidden="true">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formatBudgetInputValue(budget.total)}
                      onChange={(event) => updateBudgetTotal(event.target.value)}
                      disabled={!canEditWorkspace}
                      aria-label="Base budget"
                      className="min-w-0 flex-1 bg-transparent outline-none disabled:opacity-70"
                    />
                  </span>
                </label>
                <div className="bg-[#f3f4f4] p-3">
                  <p className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">Revenue</p>
                  <p className={`mt-1 text-2xl font-black ${totalRevenue < 0 ? "text-[#CC0000]" : "text-[#0b6b35]"}`}>
                    {formatSignedCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="bg-[#f3f4f4] p-3">
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
                            className="w-full border border-transparent bg-[#f3f4f4] px-2 py-2 font-bold text-[#2D2926] outline-none focus:border-[#CC0000] disabled:opacity-70"
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
                            className="w-full border border-transparent bg-[#f3f4f4] px-2 py-2 text-[#5b5450] outline-none focus:border-[#CC0000] disabled:opacity-70"
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
                            className="w-full border border-transparent bg-[#f3f4f4] px-2 py-2 text-[#5b5450] outline-none focus:border-[#CC0000] disabled:opacity-70"
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
                                className={`w-full border border-transparent bg-[#f3f4f4] px-2 py-2 font-bold outline-none focus:border-[#CC0000] disabled:opacity-70 ${getBudgetStatusClassName(currentStatus)}`}
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
                  <span className={`text-sm font-black ${totalRevenue < 0 ? "text-[#CC0000]" : "text-[#0b6b35]"}`}>
                    {formatSignedCurrency(totalRevenue)}
                  </span>
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
                    step="0.01"
                    value={newRevenueAmount}
                    onChange={(event) => updateNewRevenueAmount(event.target.value)}
                    placeholder="Amount, use - for debt"
                    disabled={!canEditWorkspace}
                    className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:opacity-55"
                  />
                  <button type="submit" disabled={!canEditWorkspace} className="bg-[#0b6b35] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-40">
                    Add Money
                  </button>
                </form>
                <div className="mt-3 grid max-h-52 gap-2 overflow-y-auto pr-1">
                  {(budget.revenueRows || []).length === 0 && (
                    <div className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-3 text-sm font-bold text-[#5b5450]">
                      No Revenue Logged Yet.
                    </div>
                  )}
                  {(budget.revenueRows || []).map((row) => {
                    const isDebt = Number(row.amount) < 0;
                    return (
                      <div key={row.id} className={`flex items-center justify-between gap-3 border px-3 py-2 ${isDebt ? "border-[#f0c2c2] bg-[#fff1f1]" : "border-[#ded8d2] bg-[#e5f7ec]"}`}>
                        <div className="min-w-0">
                          <p className="font-black text-[#2D2926]">{row.category}</p>
                          <p className={`text-sm font-bold ${isDebt ? "text-[#CC0000]" : "text-[#0b6b35]"}`}>
                            {formatSignedCurrency(row.amount)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBudgetRevenueRow(row.id)}
                          disabled={!canEditWorkspace}
                          aria-label={`Remove ${row.category} revenue`}
                          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border bg-white text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000] disabled:cursor-not-allowed disabled:opacity-40 ${isDebt ? "border-[#f0c2c2]" : "border-[#b7d9c4]"}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {visibleTab === "budsite" && isEboard && (
        <div className="grid gap-5">
          <Card className="relative bg-[#f3f4f4] p-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Eyebrow>Editing Guide</Eyebrow>
                <h2 className="mt-1 text-xl font-black text-[#2D2926]">Manage public page updates with confidence.</h2>
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
              <div className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">1. Draft</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5b5450]">Edit modules below. Changes stay private until published.</p>
              </div>
              <div className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">2. Preview</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5b5450]">Use Preview Draft to check what the public page will look like.</p>
              </div>
              <div className="border-l-4 border-[#CC0000] bg-[#f3f4f4] px-3 py-2">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">3. Publish</p>
                <p className="mt-1 text-xs font-bold leading-5 text-[#5b5450]">Review the change summary, confirm, then the live page updates.</p>
              </div>
            </div>
            <div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">Publishing Control</p>
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto border border-[#ded8d2] bg-[#f3f4f4] p-3">
              {contentDashboardItems.map((item) => {
                const isDirty = JSON.stringify(item.draft) !== JSON.stringify(item.published);
                const previewKey = item.previewId || item.id;
                const publishKey = item.publishId || item.id;
                const revisionKey = item.revisionId || item.id;
                return (
                  <div key={item.id} className="grid w-[16rem] shrink-0 gap-2 border border-[#d9dddc] bg-[#eceeed] p-3">
                    <div>
                      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#CC0000]">{isDirty ? "Draft changes" : "Published"}</p>
                      <h3 className="mt-1 text-base font-black leading-tight text-[#2D2926]">{item.title}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <button type="button" onClick={() => setPreviewDraftId(previewDraftId === previewKey ? "" : previewKey)} style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0" }} className="border border-[#ded8d2] bg-white px-1.5 py-1 uppercase leading-tight text-[#2D2926]">
                        {previewDraftId === previewKey ? "Hide Preview" : "Preview Draft"}
                      </button>
                      <button type="button" onClick={() => publishContentDraft(publishKey)} disabled={!isDirty} style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0" }} className="bg-[#CC0000] px-1.5 py-1 uppercase leading-tight text-white disabled:cursor-not-allowed disabled:bg-[#bdb6b0]">
                        Publish
                      </button>
                      <a href={item.href} style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0" }} className="inline-flex items-center justify-center border border-[#ded8d2] bg-white px-1.5 py-1 text-center uppercase leading-tight text-[#2D2926]">
                        Live Page
                      </a>
                    </div>
                    <div className="border-t border-[#ded8d2] pt-2">
                      <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#6d6560]">Revision History</p>
                      {(contentRevisions[revisionKey] || []).length > 0 ? (
                        <div className="grid max-h-[5.5rem] min-h-[2.25rem] gap-1 overflow-y-auto pr-1">
                          {contentRevisions[revisionKey].map((revision) => (
                            <div key={revision.id} className="grid grid-cols-[1fr_auto] gap-1">
                              <button type="button" onClick={() => restoreContentRevision(revisionKey, revision)} style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.04em" }} className="border border-[#ded8d2] bg-white px-2 py-1.5 text-left uppercase text-[#8f8781] transition hover:border-[#CC0000] hover:bg-[#fff1f1] hover:text-[#CC0000]">
                                Restore {formatMeetingDate(revision.createdAt.slice(0, 10))}
                              </button>
                              <button type="button" onClick={() => deleteContentRevision(revisionKey, revision)} className="grid h-full min-h-8 w-8 place-items-center border border-[#ded8d2] bg-white text-[#CC0000] transition hover:border-[#CC0000] hover:bg-[#fff1f1]" aria-label={`Delete revision from ${formatMeetingDate(revision.createdAt.slice(0, 10))}`}>
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
                {previewDraftId === "history" && <HistoryPage trophiesContent={draftTrophiesContent} />}
                {previewDraftId === "trophies" && <TrophiesPage trophiesContent={draftTrophiesContent} />}
                {previewDraftId === "meetings" && <MeetingsPage auth={auth} meetingsContent={draftMeetingsContent} onRequestConfirmation={onRequestConfirmation} />}
                {previewDraftId === "novice" && <NoviceHubPage noviceContent={draftNoviceContent} />}
                {previewDraftId === "eboard" && <EBoardPage eboardContent={draftEboardContent} />}
                {previewDraftId === "home" && <HomePage homeContent={draftHomeContent} />}
                {previewDraftId === "about" && <AboutPage aboutContent={draftAboutContent} />}
              </div>
            )}
          </Card>
          <SmoothDetails
            className="order-last border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("about")}
          >
            <div className="grid gap-5">
              <Card className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
                <div className="border-b-4 border-[#CC0000] pb-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-[#CC0000]" />
                    <Eyebrow>Budsite Editor</Eyebrow>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-[#2D2926]">About Page Photos and Quote</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                    Edit the right-side photo collage hover captions and the red testimonial quote block.
                  </p>
                </div>

                <fieldset disabled={!canWriteNotes} className="mt-5 grid gap-5 disabled:opacity-55">
                  <div className="grid gap-4">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Photo Hover Captions</p>
                    {draftAboutContent.photos.map((photo, index) => (
                      <div key={photo.id} className="grid gap-4 border border-[#ded8d2] bg-[#f3f4f4] p-3 lg:grid-cols-[12rem_1fr]">
                        <div className="grid gap-2">
                          <div className="aspect-[4/3] overflow-hidden bg-[#2D2926]">
                            {photo.src ? (
                              <img src={photo.src} alt={photo.alt || "About page preview"} className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full place-items-center text-sm font-black uppercase tracking-[0.08em] text-white">No photo</div>
                            )}
                          </div>
                          <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-[#ded8d2] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                            <Upload size={14} /> Upload Photo
                            <input type="file" accept="image/*" onChange={(event) => handleAboutPhotoUpload(photo.id, event.target.files?.[0])} disabled={!canWriteNotes} className="sr-only" />
                          </label>
                        </div>
                        <div className="grid gap-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Image URL
                              <input
                                value={photo.src}
                                onChange={(event) => updateAboutPhoto(photo.id, "src", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Alt Text
                              <input
                                value={photo.alt}
                                onChange={(event) => updateAboutPhoto(photo.id, "alt", event.target.value)}
                                placeholder={`About photo ${index + 1}`}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                          </div>
                          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Hover Caption
                            <textarea
                              value={photo.caption}
                              onChange={(event) => updateAboutPhoto(photo.id, "caption", event.target.value)}
                              rows={3}
                              className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 border-t border-[#ded8d2] pt-5">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Quote Block</p>
                    <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                      Quote
                      <textarea
                        value={draftAboutContent.quote}
                        onChange={(event) => persistAboutContent((content) => ({ ...content, quote: event.target.value }))}
                        rows={3}
                        className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                      />
                    </label>
                    <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                      Attribution
                      <input
                        value={draftAboutContent.quoteAttribution}
                        onChange={(event) => persistAboutContent((content) => ({ ...content, quoteAttribution: event.target.value }))}
                        className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                      />
                    </label>
                  </div>
                </fieldset>
              </Card>
            </div>
          </SmoothDetails>
          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("meetings")}
          >
          <div className="grid gap-5">
          <div className="grid">
            <Card ref={notesEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
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
                <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
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
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add Meeting Note</p>
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
                    <p className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Past Meeting Notes</p>
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
                      <div className="mt-3 max-h-[11rem] overflow-y-auto border border-[#ded8d2] bg-[#f3f4f4] p-4">
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

          <Card ref={announcementEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
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
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
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
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Edit Announcement</p>
                    <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                      <HelperText>This appears beside the meeting summary. Leave the body blank to show the default announcement message.</HelperText>
                      <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                        Announcement Title
                        <input
                          type="text"
                          value={meetingAnnouncement.announcementTitle}
                          onChange={(event) => setMeetingAnnouncement((current) => ({ ...current, announcementTitle: event.target.value }))}
                          disabled={!canEditBudsiteTitles}
                          className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
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

          </div>
          </SmoothDetails>

          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("novice")}
          >
          <div className="grid gap-5">

          <Card ref={noviceGlossaryEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setNoviceGlossaryEditorOpen((current) => !current)}
              className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
              aria-expanded={noviceGlossaryEditorOpen}
            >
              <div>
                <div className="flex items-center gap-3">
                  <FileText className="text-[#CC0000]" />
                  <Eyebrow>Budsite Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">APDA Glossary Manager</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Add, edit, and delete terms in the public Novice Hub APDA Glossary.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                {noviceGlossaryEditorOpen ? "Close Glossary" : "Open Glossary"} <ChevronDown size={16} className={`transition ${noviceGlossaryEditorOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {noviceGlossaryEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-4">
                    <div className="grid gap-4 border border-[#2D2926] bg-white p-3">
                      <div className="flex flex-col gap-2 border-b-2 border-[#CC0000] pb-3 md:flex-row md:items-end md:justify-between">
                        <div>
                          <Eyebrow>APDA Glossary</Eyebrow>
                          <h3 className="mt-1 text-xl font-black text-[#2D2926]">Manage Terms</h3>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#5b5450]">
                            Select a term to edit it. Deleting removes it from the public glossary after publishing.
                          </p>
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.08em] text-[#6d6560]">{noviceGlossaryTerms.length} terms</span>
                      </div>

                      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New Glossary Term</p>
                      <form onSubmit={addGlossaryTerm} className="grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3">
                        <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                          <div className="grid gap-3 md:grid-cols-[0.7fr_0.55fr_1fr]">
                            <input
                              value={newGlossaryTerm.term}
                              onChange={(event) => setNewGlossaryTerm((current) => ({ ...current, term: event.target.value }))}
                              placeholder="Term"
                              className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#CC0000]"
                            />
                            <input
                              value={newGlossaryTerm.category}
                              onChange={(event) => setNewGlossaryTerm((current) => ({ ...current, category: event.target.value }))}
                              placeholder="Category"
                              className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#CC0000]"
                            />
                            <input
                              value={newGlossaryTerm.resourcesText}
                              onChange={(event) => setNewGlossaryTerm((current) => ({ ...current, resourcesText: event.target.value }))}
                              placeholder="Optional resource: Label | URL"
                              className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#CC0000]"
                            />
                          </div>
                          <textarea
                            value={newGlossaryTerm.definition}
                            onChange={(event) => setNewGlossaryTerm((current) => ({ ...current, definition: event.target.value }))}
                            placeholder="Definition"
                            rows={2}
                            className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#CC0000]"
                          />
                          <button type="submit" className="w-fit bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
                            Add Term
                          </button>
                        </fieldset>
                      </form>

                      <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Glossary Terms</p>
                      <div className="grid gap-3 lg:grid-cols-[16rem_1fr]">
                        <div className="grid min-h-0 grid-rows-[auto_1fr] border border-[#ded8d2] bg-white">
                          <label className="border-b border-[#ded8d2] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-[#8f8781]">
                            Search terms
                            <input
                              type="search"
                              value={noviceGlossaryManagerSearch}
                              onChange={(event) => setNoviceGlossaryManagerSearch(event.target.value)}
                              placeholder="Search glossary"
                              className="mt-1 w-full border border-[#ded8d2] bg-white px-2 py-1.5 text-sm font-semibold normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <div className="max-h-72 overflow-y-auto">
                            {visibleNoviceGlossaryTerms.length > 0 ? visibleNoviceGlossaryTerms.map((term) => (
                              <button
                                key={term.id}
                                type="button"
                                onClick={() => setSelectedEditorGlossaryTermId(term.id)}
                                className={`grid w-full grid-cols-[0.35rem_1fr_auto] items-center gap-2 border-b border-[#ece7e2] px-3 py-1.5 text-left text-sm transition last:border-b-0 ${selectedEditorGlossaryTerm?.id === term.id ? "text-[#2D2926]" : "text-[#5b5450] hover:text-[#2D2926]"}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${selectedEditorGlossaryTerm?.id === term.id ? "bg-[#CC0000]" : "bg-transparent"}`} />
                                <span className="truncate font-medium">{term.term}</span>
                                <span className="shrink-0 text-[0.56rem] font-black uppercase tracking-[0.1em] text-[#8f8781]">{term.category}</span>
                              </button>
                            )) : (
                              <div className="px-3 py-4 text-sm font-bold text-[#6d6560]">
                                No terms match your search.
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedEditorGlossaryTerm ? (
                          <fieldset disabled={!canWriteNotes} className="grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3 disabled:opacity-55">
                            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Selected Term Editor</p>
                            <div className="grid gap-3 md:grid-cols-[0.75fr_0.5fr_auto]">
                              <input
                                value={selectedEditorGlossaryTerm.term}
                                onChange={(event) => updateGlossaryTerm(selectedEditorGlossaryTerm.id, "term", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-black outline-none focus:border-[#CC0000]"
                              />
                              <input
                                value={selectedEditorGlossaryTerm.category}
                                onChange={(event) => updateGlossaryTerm(selectedEditorGlossaryTerm.id, "category", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#CC0000]"
                              />
                              <button
                                type="button"
                                onClick={() => deleteGlossaryTerm(selectedEditorGlossaryTerm)}
                                className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000]"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                            <textarea
                              value={selectedEditorGlossaryTerm.definition}
                              onChange={(event) => updateGlossaryTerm(selectedEditorGlossaryTerm.id, "definition", event.target.value)}
                              rows={4}
                              className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#CC0000]"
                            />
                            <label className="grid gap-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#8f8781]">
                              Helpful resources, one per line: Label | URL
                              <textarea
                                value={formatGlossaryResources(selectedEditorGlossaryTerm.resources)}
                                onChange={(event) => updateGlossaryTerm(selectedEditorGlossaryTerm.id, "resources", event.target.value)}
                                rows={2}
                                className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
                              />
                            </label>
                          </fieldset>
                        ) : (
                          <div className="grid content-start gap-2 border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-4 text-sm text-[#6d6560]">
                            <h4 className="text-base font-black text-[#2D2926]">No term selected</h4>
                            <p className="font-semibold leading-6">
                              Choose a term from the list to load its editor. Nothing can be changed or deleted from this panel until a term is selected.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {isAdmin && (
            <Card ref={noviceInfographicEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
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
                <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
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
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Speech Steps</p>
                      <HelperText>Order controls update the speech number automatically. Keep descriptions short enough to fit the public infographic.</HelperText>
                      {noviceSpeechSteps.map((step, index) => (
                        <div key={step.id} className="grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3">
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
                              disabled={!canEditBudsiteTitles}
                              className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
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

          <Card ref={noviceFaqEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
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
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
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
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New FAQ</p>
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
                            disabled={!canEditBudsiteTitles}
                            className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
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

                    <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing FAQs</p>
                    <div className="grid gap-3">
                      {noviceFaqs.map((faq, index) => (
                        <div
                          key={faq.id}
                          draggable={canWriteNotes}
                          onDragStart={() => startEditorDrag("novice-faq", faq.id)}
                          onDragOver={allowEditorDrop}
                          onDrop={() => dropNoviceFaq(faq.id)}
                          onDragEnd={finishEditorDrag}
                          className="grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3"
                        >
                          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Question
                              <input
                                value={faq.question}
                                onChange={(event) => updateNoviceFaq(faq.id, "question", event.target.value)}
                                disabled={!canEditBudsiteTitles}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
                              />
                            </label>
                            <div className="flex items-end gap-2">
                              <ReorderButtons onMoveUp={() => moveNoviceFaq(index, -1)} onMoveDown={() => moveNoviceFaq(index, 1)} disabledUp={index === 0} disabledDown={index === noviceFaqs.length - 1} />
                              <button
                                type="button"
                                onClick={() => removeNoviceFaq(faq)}
                                className="grid h-10 w-10 place-items-center border border-[#ded8d2] bg-white text-[#CC0000]"
                                aria-label={`Remove ${faq.question}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
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
          </div>
          </SmoothDetails>

          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("eboard")}
          >
          <div className="grid gap-5">

          <Card ref={eboardEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
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
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
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
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New Officer</p>
                    <form onSubmit={addEboardMember} className="grid gap-3 border border-[#CC0000]/45 bg-white p-3">
                      <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                        <HelperText>Recommended photos are square or portrait images under 2 MB. Name and role are required.</HelperText>
                        <div className="grid gap-3 lg:grid-cols-[0.65fr_0.65fr_0.8fr_1fr]">
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Name
                            <input
                              type="text"
                              value={newEboardMember.name}
                              onChange={(event) => setNewEboardMember((current) => ({ ...current, name: event.target.value }))}
                              placeholder="New officer name"
                              disabled={!canEditBudsiteTitles}
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Role
                            <input
                              type="text"
                              value={newEboardMember.role}
                              onChange={(event) => setNewEboardMember((current) => ({ ...current, role: event.target.value }))}
                              placeholder="President"
                              disabled={!canEditBudsiteTitles}
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Email
                            <input
                              type="email"
                              value={newEboardMember.email}
                              onChange={(event) => setNewEboardMember((current) => ({ ...current, email: event.target.value }))}
                              placeholder="name@bu.edu"
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Photo
                            <span className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f3f4f4] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
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
                          <div className="grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3 sm:grid-cols-[8rem_1fr] sm:items-center">
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

                    <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Officers</p>
                    <div className="grid gap-4">
                      {eboardMembers.map((member, index) => (
                        <div
                          key={member.id}
                          draggable={canWriteNotes}
                          onDragStart={() => startEditorDrag("eboard-member", member.id)}
                          onDragOver={allowEditorDrop}
                          onDrop={() => dropEboardMember(member.id)}
                          onDragEnd={finishEditorDrag}
                          className="grid gap-4 border border-[#ded8d2] bg-[#f3f4f4] p-3 lg:grid-cols-[12rem_1fr_auto]"
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
                            <div className="grid gap-3 md:grid-cols-3">
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Name
                                <input
                                  value={member.name}
                                  onChange={(event) => updateEboardMember(member.id, "name", event.target.value)}
                                  disabled={!canEditBudsiteTitles}
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
                                />
                              </label>
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Role
                                <input
                                  value={member.role}
                                  onChange={(event) => updateEboardMember(member.id, "role", event.target.value)}
                                  disabled={!canEditBudsiteTitles}
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]"
                                />
                              </label>
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Email
                                <input
                                  type="email"
                                  value={member.email || ""}
                                  onChange={(event) => updateEboardMember(member.id, "email", event.target.value)}
                                  placeholder="name@bu.edu"
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
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
          </div>
          </SmoothDetails>

          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("history")}
          >
          <div className="grid gap-5">
          <Card ref={historyEditorCardRef} className="budsite-editor-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 border-b-4 border-[#CC0000] pb-4 md:flex-row md:items-end md:justify-between">
              <button
                type="button"
                onClick={() => setHistoryEditorOpen((current) => !current)}
                className="min-w-0 flex-1 text-left"
                aria-expanded={historyEditorOpen}
              >
                <div className="flex items-center gap-3">
                  <ScrollText className="text-[#CC0000]" />
                  <Eyebrow>History Page Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Add and Update Timeline Milestones</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Changes save to the public History page. Use milestones for longer historical cards that should not be overwritten by APDA updates.
                </p>
              </button>
              <div className="flex shrink-0 flex-wrap gap-2">
                <a
                  href="/history"
                  className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
                >
                  Preview <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => setHistoryEditorOpen((current) => !current)}
                  className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
                  aria-expanded={historyEditorOpen}
                >
                  {historyEditorOpen ? "Close Editor" : "Open Editor"} <ChevronDown size={16} className={`transition ${historyEditorOpen ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {historyEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid justify-items-center gap-5">
                    <div className="w-full max-w-5xl border border-[#ded8d2] bg-white p-3">
                      {renderEditableDropdownTitle("trophyMilestones")}
                      <div className="mt-3 grid gap-3">
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New Milestone</p>
                      <form onSubmit={addTrophyMilestone} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                        <HelperText>Use milestones for longer historical cards that should not be overwritten by APDA updates.</HelperText>
                        <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                          <input value={newTrophyMilestone.year} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, year: event.target.value }))} placeholder="Year" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                          <input value={newTrophyMilestone.title} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, title: event.target.value }))} placeholder="Title" disabled={!canEditBudsiteTitles} className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
                          <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                        </div>
                        <textarea value={newTrophyMilestone.copy} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, copy: event.target.value }))} placeholder="Short description" rows={2} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                        <FieldWarning>{newTrophyMilestoneDuplicate ? "A milestone with this title already exists." : ""}</FieldWarning>
                      </form>
                      <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Milestones</p>
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
                              <input value={item.title} onChange={(event) => updateTrophyItem("milestones", item.id, "title", event.target.value)} disabled={!canEditBudsiteTitles} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
                              <div className="flex items-center gap-2">
                                <ReorderButtons onMoveUp={() => moveTrophyItem("milestones", index, -1)} onMoveDown={() => moveTrophyItem("milestones", index, 1)} disabledUp={index === 0} disabledDown={index === draftTrophiesContent.milestones.length - 1} />
                                <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${item.title}?`, body: "This milestone card will be removed from the public History page.", onConfirm: () => removeTrophyItem("milestones", item.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${item.title}`}><Trash2 size={16} /></button>
                              </div>
                            </div>
                            <textarea value={item.copy} onChange={(event) => updateTrophyItem("milestones", item.id, "copy", event.target.value)} rows={2} className="resize-none border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                          </div>
                        ))}
                      </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          <SmoothDetails
            className="budsite-editor-card p-4 sm:p-5"
            title={renderEditableDropdownTitle("apdaUpdate", "Tool")}
            defaultOpen
          >
          <div className="grid gap-5">
          <div>
            <div className="border-b-4 border-[#CC0000] pb-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#CC0000]" />
                    <Eyebrow>Budsite Editor</Eyebrow>
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Update Top BU Debaters</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                    Pull new APDA changes into a review module before saving anything. The preview says what is being added, what has a before and after change, or when nothing new is there.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={pullApdaTrophiesPreview}
                  disabled={apdaUpdateStatus.state === "loading"}
                  className="inline-flex items-center justify-center gap-2 bg-[#2D2926] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#CC0000] disabled:cursor-wait disabled:opacity-55"
                >
                  <RefreshCw size={15} className={apdaUpdateStatus.state === "loading" ? "animate-spin" : ""} />
                  {apdaUpdateStatus.state === "loading" ? "Updating Debaters" : "Update Top BU Debaters"}
                </button>
              </div>
            </div>
            {apdaUpdateStatus.message && (
              <p className={`mt-4 border-l-4 px-3 py-2 text-sm font-bold ${
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
                    <h3 className="mt-1 text-lg font-black text-[#2D2926]">{apdaUpdatePreview.seasonDisplay} proposed update</h3>
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
                <div className="grid gap-3">
                  {apdaUpdatePreview.changes?.all?.length > 0 ? (
                    <>
                      <div className="border border-[#ded8d2] bg-[#f3f4f4] p-3">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2D2926]">Being Added</p>
                        <div className="mt-3 grid gap-2">
                          {apdaUpdatePreview.changes.added.length > 0 ? apdaUpdatePreview.changes.added.map((change) => (
                            <div key={`${change.area}-${change.title}`} className="border border-[#ded8d2] bg-white p-2 text-sm">
                              <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#CC0000]">{change.area}</p>
                              <p className="mt-1 font-black text-[#2D2926]">{change.title}</p>
                              <p className="mt-1 leading-6 text-[#5b5450]">{change.after}</p>
                            </div>
                          )) : (
                            <p className="border border-dashed border-[#ded8d2] bg-white p-2 text-sm font-bold text-[#6d6560]">Nothing is being added.</p>
                          )}
                        </div>
                      </div>
                      <div className="border border-[#ded8d2] bg-[#f3f4f4] p-3">
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#2D2926]">Before And After Change</p>
                        <div className="mt-3 grid gap-2">
                          {apdaUpdatePreview.changes.changed.length > 0 ? apdaUpdatePreview.changes.changed.map((change) => (
                            <div key={`${change.area}-${change.title}`} className="grid gap-2 border border-[#ded8d2] bg-white p-2 text-sm">
                              <div>
                                <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#CC0000]">{change.area}</p>
                                <p className="mt-1 font-black text-[#2D2926]">{change.title}</p>
                              </div>
                              <div className="grid gap-2 md:grid-cols-2">
                                <div className="border border-[#ded8d2] bg-[#f3f4f4] p-2">
                                  <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#6d6560]">Before</p>
                                  <p className="mt-1 leading-6 text-[#5b5450]">{change.before}</p>
                                </div>
                                <div className="border border-[#ded8d2] bg-[#fff1f1] p-2">
                                  <p className="text-[0.65rem] font-black uppercase tracking-[0.08em] text-[#CC0000]">After</p>
                                  <p className="mt-1 leading-6 text-[#2D2926]">{change.after}</p>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <p className="border border-dashed border-[#ded8d2] bg-white p-2 text-sm font-bold text-[#6d6560]">There are no before and after changes.</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-3 text-sm font-bold text-[#5b5450]">
                      Nothing new is there. APDA matches the current Trophies draft, so there is nothing to apply.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setApdaUpdatePreview(null);
                      setApdaUpdateStatus({ state: "idle", message: "APDA preview dismissed. No changes were saved." });
                    }}
                    className="border border-[#ded8d2] bg-[#f3f4f4] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]"
                  >
                    Dismiss Preview
                  </button>
                  <button
                    type="button"
                    onClick={applyApdaTrophiesPreview}
                    disabled={!apdaUpdatePreview.changes?.all?.length}
                    className="bg-[#CC0000] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000] disabled:cursor-not-allowed disabled:bg-[#bdb6b0]"
                  >
                    Apply Reviewed Changes
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
          </SmoothDetails>


          </div>
          </SmoothDetails>

          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("trophies")}
          >
          <div className="grid gap-5">

          <Card ref={trophyEditorCardRef} className="budsite-editor-card budsite-trophy-editor-card p-4 sm:p-5">
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
                  className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]"
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
                        ["members", "Individual Achievements"],
                        ["results", "Seasons / Results"],
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
            <div className="grid justify-items-center gap-5">
              {trophyEditorSection === "stats" && (
              <div className="w-full max-w-5xl border border-[#ded8d2] bg-white p-3">
                {renderEditableDropdownTitle("trophyTopStats")}
                <div className="mt-3 grid gap-3">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New Top Stat</p>
                <form onSubmit={addTrophyStat} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <HelperText>Use short public stats. Labels that come from APDA may be overwritten by the APDA updater.</HelperText>
                  <div className="grid gap-2 2xl:grid-cols-[0.45fr_0.8fr_1fr_auto]">
                    <input value={newTrophyStat.value} onChange={(event) => setNewTrophyStat((current) => ({ ...current, value: event.target.value }))} placeholder="#4" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyStat.label} onChange={(event) => setNewTrophyStat((current) => ({ ...current, label: event.target.value }))} placeholder="Label" disabled={!canEditBudsiteTitles} className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
                    <input value={newTrophyStat.detail} onChange={(event) => setNewTrophyStat((current) => ({ ...current, detail: event.target.value }))} placeholder="Detail" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                  <FieldWarning>{newTrophyStatDuplicate ? "A top stat with this label already exists." : ""}</FieldWarning>
                </form>
                <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Top Stats</p>
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
                      <input value={stat.label} onChange={(event) => updateTrophyItem("stats", stat.id, "label", event.target.value)} disabled={!canEditBudsiteTitles} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
                      <input value={stat.detail} onChange={(event) => updateTrophyItem("stats", stat.id, "detail", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                      <div className="flex items-center gap-2">
                        <ReorderButtons onMoveUp={() => moveTrophyItem("stats", index, -1)} onMoveDown={() => moveTrophyItem("stats", index, 1)} disabledUp={index === 0} disabledDown={index === draftTrophiesContent.stats.length - 1} />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${stat.label}?`, body: "This stat will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("stats", stat.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${stat.label}`}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
              )}

              {trophyEditorSection === "accomplishments" && (
              <div className="w-full max-w-5xl border border-[#ded8d2] bg-white p-3">
                {renderEditableDropdownTitle("trophyAccomplishments")}
                <div className="mt-3 grid gap-3">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New Accomplishment</p>
                <form onSubmit={addTrophyAccomplishment} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3 2xl:grid-cols-[1fr_auto]">
                  <input value={newTrophyAccomplishment} onChange={(event) => setNewTrophyAccomplishment(event.target.value)} placeholder="Add accomplishment line" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  <div className="2xl:col-span-2">
                    <HelperText>Keep these as short public bullet points. APDA-managed lines may be replaced when the updater runs.</HelperText>
                    <FieldWarning>{newTrophyAccomplishmentDuplicate ? "This accomplishment already exists." : ""}</FieldWarning>
                  </div>
                </form>
                <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Accomplishments</p>
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
                </div>
              </div>
              )}

              {trophyEditorSection === "members" && (
              <div className="w-full max-w-5xl border border-[#ded8d2] bg-white p-3">
                {renderEditableDropdownTitle("trophyMembers")}
                <div className="mt-3 grid gap-3">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add Member Achievement</p>
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
                <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Member Achievements</p>
                <label className="grid gap-2 border border-[#ded8d2] bg-[#f3f4f4] p-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                  Find Current Member
                  <input
                    type="search"
                    value={trophyMemberSearch}
                    onChange={(event) => setTrophyMemberSearch(event.target.value)}
                    placeholder="Search by name, meta, or achievement"
                    className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                  />
                </label>
                <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
                  {visibleTrophyMembers.length > 0 ? visibleTrophyMembers.map(({ member, index: memberIndex }) => (
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
                        <input value={member.name} onChange={(event) => updateTrophyItem("members", member.id, "name", event.target.value)} disabled={!isAdmin} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
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
                  )) : (
                    <div className="border border-dashed border-[#ded8d2] bg-white p-4 text-sm font-bold text-[#6d6560]">
                      No members match your search.
                    </div>
                  )}
                </div>
                </div>
              </div>
              )}
            </div>

            {trophyEditorSection === "results" && (
            <div className="mx-auto mt-5 w-full max-w-5xl border border-[#ded8d2] bg-white p-3">
              {renderEditableDropdownTitle("trophyResults")}
              <div className="mt-3 grid gap-3">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add New Season</p>
              <form onSubmit={addTrophyResultSeason} className="grid gap-2 border border-[#ded8d2] bg-[#f3f4f4] p-3 sm:grid-cols-[1fr_auto]">
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
              <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Selected Season</p>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                  Season
                  <select
                    value={selectedTrophySeasonIdValue}
                    onChange={(event) => setSelectedTrophySeasonId(event.target.value)}
                    className="border border-[#ded8d2] bg-[#f3f4f4] px-3 py-2 text-sm font-bold normal-case tracking-normal text-[#2D2926] outline-none focus:border-[#CC0000]"
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
              <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add Tournament Result</p>
              <form onSubmit={addTrophyResult} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                <HelperText>Use one highlight per line. Keep wording consistent with the public Trophies page.</HelperText>
                <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                  <input type="date" value={newTrophyResult.date} onChange={(event) => setNewTrophyResult((current) => ({ ...current, date: event.target.value }))} className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <input value={newTrophyResult.tournament} onChange={(event) => setNewTrophyResult((current) => ({ ...current, tournament: event.target.value }))} placeholder="Tournament name" disabled={!canEditBudsiteTitles} className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
                  <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                </div>
                <textarea value={newTrophyResult.highlights} onChange={(event) => setNewTrophyResult((current) => ({ ...current, highlights: event.target.value }))} placeholder="One highlight per line" rows={4} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                <FieldWarning>{newTrophyResultDuplicate ? "This tournament already exists in the selected season." : ""}</FieldWarning>
              </form>
              <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Tournament Results</p>
              <div className="grid gap-2">
                {(selectedTrophySeason?.results || []).length === 0 && (
                  <div className="border border-dashed border-[#ded8d2] bg-[#f3f4f4] p-3 text-sm font-bold text-[#5b5450]">
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
                      <input value={result.tournament} onChange={(event) => updateTrophyResult(result.id, "tournament", event.target.value)} disabled={!canEditBudsiteTitles} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000] disabled:cursor-not-allowed disabled:bg-[#f3f4f4] disabled:text-[#8f8781]" />
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
              </div>
            </div>
            )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          </div>
          </SmoothDetails>
          <SmoothDetails
            className="border border-[#ded8d2] bg-[#f3f4f4] p-4 shadow-[0_16px_45px_rgba(45,41,38,0.06)]"
            title={renderBudsiteEditorSectionTitle("home")}
          >
          <div className="grid gap-5">
          <Card ref={carouselEditorCardRef} className="budsite-editor-card flex min-h-0 flex-col p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setCarouselEditorOpen((current) => !current)}
              className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
              aria-expanded={carouselEditorOpen}
            >
              <div>
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-[#CC0000]" />
                  <Eyebrow>Budsite Editor</Eyebrow>
                </div>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Landing Page Community Carousel</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Upload photos, edit card titles and descriptions, and reorder the rotating community carousel.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f3f4f4] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                {carouselEditorOpen ? "Close Carousel" : "Open Carousel"} <ChevronDown size={16} className={`transition ${carouselEditorOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {carouselEditorOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-4">
                    <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#CC0000]">Add Community Card</p>
                    <form onSubmit={addCarouselSlide} className="grid gap-3 border border-[#CC0000]/45 bg-white p-3">
                      <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                        <HelperText>Upload a photo or paste an image URL. The title and description appear beside the photo in the community carousel.</HelperText>
                        <div className="grid gap-3 lg:grid-cols-[0.75fr_1fr_1fr]">
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Photo
                            <span className="inline-flex items-center justify-center gap-2 border border-[#ded8d2] bg-[#f3f4f4] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                              <Upload size={16} /> Upload Photo
                              <input type="file" accept="image/*" onChange={(event) => handleNewCarouselPhotoUpload(event.target.files?.[0])} className="sr-only" />
                            </span>
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Image URL
                            <input
                              type="url"
                              value={newCarouselSlide.src}
                              onChange={(event) => setNewCarouselSlide((current) => ({ ...current, src: event.target.value }))}
                              placeholder="https://..."
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Card Title
                            <input
                              value={newCarouselSlide.kicker}
                              onChange={(event) => setNewCarouselSlide((current) => ({ ...current, kicker: event.target.value }))}
                              placeholder="Travel & Compete"
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                        </div>
                        <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Alt Text
                            <input
                              value={newCarouselSlide.alt}
                              onChange={(event) => setNewCarouselSlide((current) => ({ ...current, alt: event.target.value }))}
                              placeholder="Team members at a tournament"
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]">
                            Card Description
                            <input
                              value={newCarouselSlide.caption}
                              maxLength={HOME_CAROUSEL_CAPTION_MAX_LENGTH}
                              onChange={(event) => setNewCarouselSlide((current) => ({ ...current, caption: event.target.value.slice(0, HOME_CAROUSEL_CAPTION_MAX_LENGTH) }))}
                              placeholder="Short public description"
                              className="border border-[#ded8d2] px-4 py-3 text-base font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                            />
                            <span className="text-[0.65rem] font-black normal-case tracking-normal text-[#8f8781]">
                              {newCarouselSlide.caption.length}/{HOME_CAROUSEL_CAPTION_MAX_LENGTH} characters
                            </span>
                          </label>
                        </div>
                        {newCarouselSlide.src && (
                          <div className="grid gap-3 border border-[#ded8d2] bg-[#f3f4f4] p-3 sm:grid-cols-[10rem_1fr] sm:items-center">
                            <img src={newCarouselSlide.src} alt="New carousel preview" className="aspect-[16/9] w-full object-cover" />
                            <button type="button" onClick={() => setNewCarouselSlide((current) => ({ ...current, src: "" }))} className="w-fit border border-[#ded8d2] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000]">
                              Remove Photo
                            </button>
                          </div>
                        )}
                        <button type="submit" className="w-fit bg-[#CC0000] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] text-white hover:bg-[#A00000]">
                          Add Community Card
                        </button>
                      </fieldset>
                    </form>

                    <p className="border-t border-[#ded8d2] pt-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#6d6560]">Existing Community Cards</p>
                    <div className="grid gap-4">
                      {draftHomeContent.carouselSlides.map((slide, index) => (
                        <div
                          key={slide.id}
                          draggable={canWriteNotes}
                          onDragStart={() => startEditorDrag("home-carousel", slide.id)}
                          onDragOver={allowEditorDrop}
                          onDrop={() => dropCarouselSlide(slide.id)}
                          onDragEnd={finishEditorDrag}
                          className="grid gap-4 border border-[#ded8d2] bg-[#f3f4f4] p-3 lg:grid-cols-[13rem_1fr_auto]"
                        >
                          <div className="grid gap-2">
                            <div className="aspect-[16/9] overflow-hidden bg-[#2D2926]">
                              {slide.src ? (
                                <img src={slide.src} alt={slide.alt || slide.kicker || "Carousel preview"} className="h-full w-full object-cover" />
                              ) : (
                                <div className="grid h-full place-items-center text-sm font-black uppercase tracking-[0.08em] text-white">No photo</div>
                              )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center justify-center gap-2 border border-[#ded8d2] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] transition hover:border-[#CC0000] hover:text-[#CC0000]">
                              <Upload size={14} /> Change Photo
                              <input type="file" accept="image/*" onChange={(event) => handleCarouselPhotoUpload(slide.id, event.target.files?.[0])} disabled={!canWriteNotes} className="sr-only" />
                            </label>
                            <button type="button" onClick={() => updateCarouselSlide(slide.id, "src", "")} disabled={!canWriteNotes} className="border border-[#ded8d2] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#CC0000] disabled:opacity-40">
                              Remove Photo
                            </button>
                          </div>
                          <fieldset disabled={!canWriteNotes} className="grid gap-3 disabled:opacity-55">
                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Card Title
                                <input
                                  value={slide.kicker}
                                  onChange={(event) => updateCarouselSlide(slide.id, "kicker", event.target.value)}
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-bold normal-case tracking-normal outline-none focus:border-[#CC0000]"
                                />
                              </label>
                              <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                                Image URL
                                <input
                                  value={slide.src}
                                  onChange={(event) => updateCarouselSlide(slide.id, "src", event.target.value)}
                                  className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                                />
                              </label>
                            </div>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Alt Text
                              <input
                                value={slide.alt}
                                onChange={(event) => updateCarouselSlide(slide.id, "alt", event.target.value)}
                                className="border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                            </label>
                            <label className="grid gap-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926]">
                              Card Description
                              <textarea
                                value={slide.caption}
                                maxLength={HOME_CAROUSEL_CAPTION_MAX_LENGTH}
                                onChange={(event) => updateCarouselSlide(slide.id, "caption", event.target.value)}
                                rows={3}
                                className="resize-none border border-[#ded8d2] bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000]"
                              />
                              <span className="text-[0.65rem] font-black normal-case tracking-normal text-[#8f8781]">
                                {slide.caption.length}/{HOME_CAROUSEL_CAPTION_MAX_LENGTH} characters
                              </span>
                            </label>
                          </fieldset>
                          <button
                            type="button"
                            onClick={() => removeCarouselSlide(slide)}
                            disabled={!canWriteNotes}
                            className="grid h-10 w-10 place-items-center border border-[#ded8d2] bg-white text-[#CC0000] disabled:opacity-40 lg:self-start"
                            aria-label={`Remove ${slide.kicker || "community card"}`}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className="lg:col-start-3 lg:row-start-2">
                            <ReorderButtons onMoveUp={() => moveCarouselSlide(index, -1)} onMoveDown={() => moveCarouselSlide(index, 1)} disabledUp={index === 0} disabledDown={index === draftHomeContent.carouselSlides.length - 1} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          </div>
          </SmoothDetails>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </Page>
    <ResourceEntryModal
      open={casebookModalOpen}
      resource={newCasebookCase}
      onChange={setNewCasebookCase}
      onCancel={() => setCasebookModalOpen(false)}
      onSubmit={addCasebookCase}
      eyebrow="BUDS Casebook"
      title="Add to Casebook"
      submitLabel="Add Case"
      tagPlaceholder="Topic tags, max 2"
      descriptionPlaceholder="Case statement"
    />
    <ResourceEntryModal
      open={prepOutModalOpen}
      resource={newPrepOut}
      onChange={setNewPrepOut}
      onCancel={() => setPrepOutModalOpen(false)}
      onSubmit={addPrepOut}
      eyebrow="BUDS Prep Outs"
      title="Add a Prep-Out"
      submitLabel="Add Prep-Out"
      tagPlaceholder="Team / institution tags, max 2"
      descriptionPlaceholder="Case statement / background"
    />
    <ResourceEntryModal
      open={recordingModalOpen}
      resource={newRecording}
      onChange={setNewRecording}
      onCancel={() => setRecordingModalOpen(false)}
      onSubmit={addRecording}
      eyebrow="Recorded APDA Rounds"
      title="Add Recording"
      submitLabel="Add Recording"
      labelPlaceholder="Round Name"
      tagOptions={["Cases", "Motions"]}
      tagPlaceholder="Cases or Motions"
      descriptionPlaceholder="Case or motion statement"
      urlPlaceholder="Link to video"
    />
    </>
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
  const [homeContent, setHomeContent] = useState(() => getStoredHomeContent());
  const [aboutContent, setAboutContent] = useState(() => getStoredAboutContent());
  const [confirmation, setConfirmation] = useState(null);

  const calendarEmbedUrl = useMemo(() => {
    return "https://calendar.google.com/calendar/embed?src=c_2be8297a9561724f2234792e9cd68ed9f2fc5d6c6be910056b5a7258d5098cf7%40group.calendar.google.com&ctz=America%2FNew_York";
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
      const [databaseTrophiesContent, databaseMeetingsContent, databaseNoviceContent, databaseEboardContent, databaseHomeContent, databaseAboutContent] = await Promise.all([
        loadTrophiesContent(),
        loadMeetingsContent(),
        loadNoviceContent(),
        loadEboardContent(),
        loadHomeContent(),
        loadAboutContent(),
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
      if (databaseHomeContent) {
        setHomeContent(databaseHomeContent);
        saveStoredHomeContent(databaseHomeContent);
      }
      if (databaseAboutContent) {
        setAboutContent(databaseAboutContent);
        saveStoredAboutContent(databaseAboutContent);
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

  const updateHomeContent = useCallback((nextContent) => {
    setHomeContent(nextContent);
    saveStoredHomeContent(nextContent);
    upsertHomeContent(nextContent);
  }, []);

  const updateAboutContent = useCallback((nextContent) => {
    setAboutContent(nextContent);
    saveStoredAboutContent(nextContent);
    upsertAboutContent(nextContent);
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
        return <HomePage homeContent={homeContent} />;
      case "/about":
        return <AboutPage aboutContent={aboutContent} />;
      case "/novice-hub":
        return <NoviceHubPage noviceContent={noviceContent} />;
      case "/calendar":
        return <CalendarPage calendarEmbedUrl={calendarEmbedUrl} />;
      case "/meetings":
        return <MeetingsPage auth={auth} meetingsContent={meetingsContent} onRequestConfirmation={requestConfirmation} />;
      case "/history":
        return <HistoryPage trophiesContent={trophiesContent} />;
      case "/trophies":
        return <TrophiesPage trophiesContent={trophiesContent} />;
      case "/eboard":
        return <EBoardPage eboardContent={eboardContent} />;
      case "/contact":
        return <ContactPage />;
      case "/join":
        return <JoinPage auth={auth} onRequestConfirmation={requestConfirmation} />;
      case "/login":
        return <LoginPage onLogin={setAuth} onRequestConfirmation={requestConfirmation} />;
      case "/hub":
        return <PrivateHubPage auth={auth} trophiesContent={trophiesContent} meetingsContent={meetingsContent} noviceContent={noviceContent} eboardContent={eboardContent} homeContent={homeContent} aboutContent={aboutContent} onTrophiesContentChange={updateTrophiesContent} onMeetingsContentChange={updateMeetingsContent} onNoviceContentChange={updateNoviceContent} onEboardContentChange={updateEboardContent} onHomeContentChange={updateHomeContent} onAboutContentChange={updateAboutContent} onRequestConfirmation={requestConfirmation} onLogout={() => {
          if (isSupabaseConfigured) supabase.auth.signOut();
          clearStoredAuth();
          setAuth(null);
          navigateTo("/login");
        }} />;
      default:
        return <NotFoundPage />;
    }
  }, [aboutContent, auth, calendarEmbedUrl, eboardContent, homeContent, meetingsContent, noviceContent, path, requestConfirmation, trophiesContent, updateAboutContent, updateEboardContent, updateHomeContent, updateMeetingsContent, updateNoviceContent, updateTrophiesContent]);

  return (
    <main className="min-h-screen bg-[#f7f4f1] text-[#2D2926]">
      <header className="sticky top-0 z-50 border-b border-[#e6e0db] bg-white/96 shadow-[0_6px_22px_rgba(45,41,38,0.06)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[118rem] items-center justify-between gap-6 px-5 py-3 sm:px-8">
          <SiteLink href="/" className="group flex min-w-0 items-center gap-3">
            <img
              src="/buds-logo.png"
              alt="BU Debate Society logo"
              className="h-14 w-14 shrink-0 rounded-md object-cover shadow-sm transition group-hover:brightness-95"
            />
            <div className="min-w-0">
              <p className="text-2xl font-black uppercase leading-none tracking-[0.06em] text-[#111]">BUDS</p>
              <p className="mt-1 hidden truncate text-sm font-medium text-[#201d1a] sm:block">Boston University Debate Society</p>
            </div>
          </SiteLink>

          <div className="hidden items-center gap-6 xl:flex 2xl:gap-8">
            {navItems.map((item) => {
              const active = item.href === path;
              return (
                <SiteLink
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap text-base font-medium transition ${
                    active
                      ? "text-[#CC0000]"
                      : "text-[#111] hover:text-[#CC0000]"
                  }`}
                >
                  {item.label}
                </SiteLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <PrimaryButton href="/join" className="rounded-md px-6 py-3">
              Join BUDS <ArrowRight size={16} />
            </PrimaryButton>
            <SecondaryButton href={auth ? "/hub" : "/login"} className="rounded-md border-[#bca7a0] bg-white px-6 py-3">
              Hub
            </SecondaryButton>
          </div>

          <button className="rounded-sm border border-[#ded8d2] bg-white p-3 shadow-sm xl:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#2D2926]/45 p-4 backdrop-blur-sm xl:hidden">
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
                    className={`px-4 py-3 font-black ${active ? "bg-[#2D2926] text-white" : "bg-[#f3f4f4] text-[#2D2926]"}`}
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
                className={`px-4 py-3 font-black ${path === "/login" || path === "/hub" ? "bg-[#2D2926] text-white" : "bg-[#f3f4f4] text-[#2D2926]"}`}
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

