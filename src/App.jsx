import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
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
} from "./data/config";
import {
  apdaSourceUrl,
  board,
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
  loadDatabaseState,
  loadMemberAccounts,
  loadMembershipRequests,
  loadTrophiesContent,
  revokeMemberAccount,
  unrevokeMemberAccount,
  updateMemberAccountRole,
  updateMembershipRequestStatus,
  upsertAgendaItem,
  upsertBudgetRevenueRow,
  upsertBudgetRow,
  upsertBudgetSettings,
  upsertMemberAccount,
  upsertPrivateLink,
  upsertTrophiesContent,
} from "./lib/supabaseData";
import {
  clearStoredAuth,
  getStoredAgenda,
  getStoredAuth,
  getStoredBudget,
  getStoredMemberAccounts,
  getStoredMembershipRequests,
  getStoredNotes,
  getStoredPrivateLinks,
  getStoredTrophiesContent,
  saveStoredAgenda,
  saveStoredAuth,
  saveStoredBudget,
  saveStoredMemberAccounts,
  saveStoredMembershipRequests,
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
        <div className="overflow-hidden border border-[#2D2926]/90 bg-[#2D2926] text-white shadow-[0_18px_48px_rgba(45,41,38,0.12)]">
          <div className="grid gap-0 sm:grid-cols-[0.82fr_1.18fr]">
            <div className="flex min-h-48 flex-col justify-between bg-[#CC0000] p-6 text-white sm:min-h-[24rem] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/78">2026 national rank</p>
              <p className="text-[5rem] font-black leading-none tracking-tight sm:text-[6.5rem]">#4</p>
            </div>
            <div className="grid content-center gap-7 p-6 md:p-8">
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
        className="pt-2 lg:col-span-2 lg:pt-4"
      >
        <PhotoCarousel />
      </motion.div>
    </section>
  );
}

function ConfirmationModal({ confirmation, onCancel, onConfirm }) {
  if (!confirmation) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#2D2926]/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border border-[#ded8d2] bg-white p-6 shadow-[0_28px_80px_rgba(45,41,38,0.24)]">
        <Eyebrow>Are you sure?</Eyebrow>
        <h2 className="mt-3 text-2xl font-black leading-tight text-[#2D2926]">{confirmation.title}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#5b5450]">{confirmation.body}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#ded8d2] bg-[#f6f4f2] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#2D2926]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-[#CC0000] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white"
          >
            {confirmation.actionLabel || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
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

function NoviceHubPage() {
  return (
    <Page>
      <PageHeader eyebrow="Novice Hub" title="A Cleaner Path from First Practice to First Tournament.">
        Give new debaters the essentials without burying them in a long scroll.
      </PageHeader>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {noviceResources.map((resource) => (
          <Card key={resource.title} className="group flex min-h-64 flex-col transition hover:-translate-y-1">
            <span className="w-fit bg-[#CC0000] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">{resource.tag}</span>
            <h2 className="mt-6 text-2xl font-black leading-tight text-[#2D2926]">{resource.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-[#5b5450]">{resource.description}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-left text-sm font-black uppercase tracking-[0.08em] text-[#CC0000]"
            >
              Open link <ChevronRight className="transition group-hover:translate-x-1" size={16} />
            </a>
          </Card>
        ))}
      </div>
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

function MeetingsPage({ auth, onRequestConfirmation }) {
  const [meetingPosts, setMeetingPosts] = useState(() => getStoredNotes());
  const canDeletePosts = auth?.role === "eboard" || auth?.role === ADMIN_ROLE;
  const sortedPosts = sortMeetingPosts(meetingPosts);
  const meetingNumberById = new Map(
    [...sortedPosts]
      .reverse()
      .map((post, index) => [post.id, String(index + 1).padStart(2, "0")])
  );
  const latestMeetingLabel = sortedPosts[0]?.date ? formatMeetingDate(sortedPosts[0].date) : "None yet";

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
        <div className="grid content-between gap-4 border border-[#ded8d2] bg-white p-5 shadow-[0_16px_45px_rgba(45,41,38,0.08)] sm:p-8 md:p-10">
          <div className="grid border border-[#ded8d2] sm:grid-cols-2">
            <div className="border-b border-r border-[#ded8d2] p-5">
              <p className="text-4xl font-black leading-none text-[#CC0000]">{sortedPosts.length}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">Published Posts</p>
            </div>
            <div className="border-b border-[#ded8d2] p-5">
              <p className="text-2xl font-black leading-tight text-[#2D2926]">{latestMeetingLabel}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">Latest Update</p>
            </div>
            <div className="border-r border-[#ded8d2] p-5">
              <p className="text-4xl font-black leading-none text-[#2D2926]">New</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">Newest Notes First</p>
            </div>
            <div className="p-5">
              <p className="text-4xl font-black leading-none text-[#2D2926]">EBD</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#6d6560]">E-Board Managed</p>
            </div>
          </div>
          <p className="text-sm font-semibold leading-6 text-[#5b5450]">
            Only logged-in e-board members can delete meeting posts. Everyone can read the public meeting archive.
          </p>
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
              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-[#4d4743]">
                {post.body || "No Notes Body Added."}
              </p>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
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
            <h2 className="text-3xl font-black text-[#2D2926]">2025-26 Results Timeline</h2>
          </div>
          <div className="grid gap-4">
            {[...trophiesContent.results].reverse().map((result) => (
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trophiesContent.members.map((member) => (
            <Card key={member.id || member.name} className="p-5">
              <p className="text-xl font-black leading-tight text-[#2D2926]">{member.name}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#CC0000]">{member.meta}</p>
              <ul className="mt-4 grid gap-2">
                {member.achievements.map((achievement) => (
                  <li key={achievement} className="border-t border-[#ded8d2] pt-2 text-sm font-semibold leading-6 text-[#5b5450]">
                    {achievement}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
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
          <Card key={`${member.name}-${member.role}`}>
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
        <div className="flex min-h-[28rem] flex-col justify-between border border-[#9a0000] bg-[#CC0000] p-6 text-left text-white shadow-[0_20px_55px_rgba(45,41,38,0.14)] sm:min-h-[34rem] md:p-10">
          <div>
            <span className="inline-flex bg-[#2D2926] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
              Join BUDS
            </span>
            <h1 className="mt-8 max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Request membership in the Boston University Debate Society.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8">
              Send a quick request with your BU email. Administrators can review new members, accept or deny requests, and leave a decision reason.
            </p>
          </div>
          <div className="mt-10 grid gap-4 border border-white/40 bg-white p-4 text-[#2D2926] sm:p-6">
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
        Members unlock private team resources. E-board unlocks the same member hub plus the e-board workspace.
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="!bg-[#2D2926] p-5 text-white sm:p-8">
          <div className="border-t-4 border-[#CC0000] pt-6">
            <Eyebrow light>Private Access</Eyebrow>
            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">Log in with your membership ID.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
              Use the email and password connected to your BUDS account. Members can access private team resources, and e-board members can open the workspace from the e-board login option.
            </p>
          </div>
          <div className="mt-8 grid gap-3 border border-white/20 bg-white/5 p-5 text-sm font-bold text-white/80">
            <p>Accepted members use the password they chose on the join form.</p>
            <p>Use a BU email unless you have an approved administrator account.</p>
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

function PrivateHubPage({ auth, trophiesContent, onTrophiesContentChange, onRequestConfirmation, onLogout }) {
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
  const [newTrophyStat, setNewTrophyStat] = useState({ value: "", label: "", detail: "" });
  const [newTrophyAccomplishment, setNewTrophyAccomplishment] = useState("");
  const [newTrophyMilestone, setNewTrophyMilestone] = useState({ year: "", title: "", copy: "" });
  const [newTrophyResult, setNewTrophyResult] = useState({ date: "", tournament: "", highlights: "" });
  const [newTrophyMember, setNewTrophyMember] = useState({ name: "", meta: "", achievement: "" });
  const [trophyEditorOpen, setTrophyEditorOpen] = useState(false);

  const isAdmin = auth?.role === ADMIN_ROLE;
  const canManageMembers = isAdmin || MEMBER_MANAGER_EMAILS.includes(auth?.email);
  const isEboard = auth?.role === "eboard" || isAdmin;
  const canEdit = isAdmin;
  const canEditTrophies = isEboard;
  const canWriteNotes = isEboard;
  const canUsePrivateTabs = isEboard || canManageMembers;
  const visibleTab = canUsePrivateTabs ? activeTab : "member";
  const sortedNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  const selectedNote = sortedNotes.find((note) => note.id === selectedNoteId) ?? sortedNotes[0];
  const approvedBudgetRows = budget.rows.filter((row) => row.status === "Approved");
  const getBudgetStatusClassName = (status) => {
    if (status === "Approved") return "text-[#0b6b35]";
    if (status === "Denied") return "text-[#8a0000]";
    return "text-[#CC0000]";
  };
  const totalSpent = approvedBudgetRows.reduce((sum, row) => sum + (Number(row.spent) || 0), 0);
  const totalAllocated = approvedBudgetRows.reduce((sum, row) => sum + (Number(row.allocated) || 0), 0);
  const totalRevenue = budget.revenueRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const effectiveBudget = (Number(budget.total) || 0) + totalRevenue;
  const remainingBudget = effectiveBudget - totalSpent;
  const displayName = auth?.name?.trim() || auth?.email?.split("@")[0] || "member";
  const hubTitle = visibleTab === "member"
    ? `Welcome, ${displayName}`
    : visibleTab === "members"
      ? "Members"
      : "E-Board Workspace";
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

    if (canManageMembers) hydrateMemberAccounts();

    return () => {
      ignore = true;
    };
  }, [canManageMembers]);

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
    const nextNote = {
      id: `${meetingDate}-${Date.now()}`,
      date: meetingDate,
      title: meetingTitle.trim(),
      body: meetingNotes.trim(),
      created_at: new Date().toISOString(),
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
    if (!canEdit) return;
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
    if (!canEdit) return;
    const nextBudget = { ...budget, total };
    updateBudget(nextBudget);
    upsertBudgetSettings(total);
  };

  const updateBudgetRow = (id, field, value) => {
    if (!canEdit) return;
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
    if (!canEdit) return;
    const nextLinks = memberLinks.map((link) => (
      link.id === id ? { ...link, [field]: value } : link
    ));
    setMemberLinks(nextLinks);
    saveStoredPrivateLinks(nextLinks);
    const updatedLink = nextLinks.find((link) => link.id === id);
    if (updatedLink) upsertPrivateLink(updatedLink);
  };

  const requestDeleteConfirmation = ({ title, body, actionLabel, onConfirm }) => {
    onRequestConfirmation({ title, body, actionLabel, onConfirm });
  };

  const persistTrophiesContent = (updater) => {
    if (!canEditTrophies) return;
    const nextContent = typeof updater === "function" ? updater(trophiesContent) : updater;
    onTrophiesContentChange(nextContent);
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
    if (!newTrophyStat.value.trim() || !newTrophyStat.label.trim()) return;
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
    if (!text) return;
    persistTrophiesContent((content) => ({
      ...content,
      accomplishments: [...content.accomplishments, { id: `accomplishment-${Date.now()}`, text }],
    }));
    setNewTrophyAccomplishment("");
  };

  const addTrophyMilestone = (event) => {
    event.preventDefault();
    if (!newTrophyMilestone.year.trim() || !newTrophyMilestone.title.trim()) return;
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
    if (!newTrophyResult.date || !newTrophyResult.tournament.trim() || highlights.length === 0) return;
    const nextResult = {
      id: `result-${Date.now()}`,
      date: newTrophyResult.date,
      tournament: newTrophyResult.tournament.trim(),
      highlights,
    };
    persistTrophiesContent((content) => ({ ...content, results: [...content.results, nextResult] }));
    setNewTrophyResult({ date: "", tournament: "", highlights: "" });
  };

  const addTrophyMemberAchievement = (event) => {
    event.preventDefault();
    const name = newTrophyMember.name.trim();
    const achievement = newTrophyMember.achievement.trim();
    if (!name || !achievement) return;
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

  const updateTrophyResultHighlight = (resultId, highlightIndex, value) => {
    persistTrophiesContent((content) => ({
      ...content,
      results: content.results.map((result) => (
        result.id === resultId
          ? { ...result, highlights: result.highlights.map((highlight, index) => (index === highlightIndex ? value : highlight)) }
          : result
      )),
    }));
  };

  const removeTrophyResultHighlight = (resultId, highlightIndex) => {
    persistTrophiesContent((content) => ({
      ...content,
      results: content.results.map((result) => (
        result.id === resultId
          ? { ...result, highlights: result.highlights.filter((_, index) => index !== highlightIndex) }
          : result
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
      <div className="mb-3 flex flex-col gap-3 border-b-4 border-[#CC0000] bg-white p-3 shadow-[0_16px_45px_rgba(45,41,38,0.08)] md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow>Private Hub</Eyebrow>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#2D2926] md:text-3xl">
            {hubTitle}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="break-all text-xs font-semibold text-[#6d6560]">{auth.email}</p>
            {isAdmin && (
              <span className="bg-[#2D2926] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-white">
                Administrator
              </span>
            )}
            {!isAdmin && canManageMembers && (
              <span className="bg-[#CC0000] px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.08em] text-white">
                Member Manager
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
        {canManageMembers && (
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
          <PageHeader eyebrow="Members Only" title="Private BUDS Links and Debate Resources.">
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
                    <div key={link.id} className="group flex min-h-[20rem] flex-col border border-[#ded8d2] bg-white p-5 shadow-[0_20px_55px_rgba(45,41,38,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(45,41,38,0.12)] sm:min-h-[25rem] sm:p-7">
                      <div className="mb-10">
                        <span className="inline-flex bg-[#CC0000] px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                          {group.section === "Debater Resources" ? "Resource" : "Team Link"}
                        </span>
                      </div>
                      {canEdit ? (
                        <>
                          <label className="grid gap-2">
                            <span className="sr-only">Link Name</span>
                            <textarea
                              value={getMemberLinkTitleValue(link)}
                              onChange={(event) => updateMemberLink(link.id, "label", event.target.value)}
                              rows={2}
                              className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-3xl font-black leading-tight tracking-normal text-[#2D2926] outline-none focus:text-[#CC0000]"
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
                          <h3 className="break-words text-2xl font-black leading-tight tracking-normal text-[#2D2926] sm:text-3xl">
                            <MemberLinkTitle link={link} />
                          </h3>
                          <p className="mt-5 flex-1 text-base font-medium leading-7 text-[#5b5450] sm:mt-6 sm:text-lg sm:leading-8">{link.description}</p>
                        </>
                      )}
                      <div className="mt-7 grid gap-4">
                        <a href={link.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.12em] text-[#CC0000] sm:text-base sm:tracking-[0.18em]">
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
                        <button
                          type="button"
                          onClick={() => removeAgendaItem(item)}
                          disabled={!canEdit}
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
                          {(() => {
                            const currentStatus = BUDGET_STATUSES.includes(row.status) ? row.status : "On Hold";

                            return (
                              <select
                                value={currentStatus}
                                onChange={(event) => updateBudgetRow(row.id, "status", event.target.value)}
                                disabled={!canEdit}
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
            <Card className="flex min-h-0 flex-col p-4 sm:p-5">
              <div className="mb-5 flex items-center gap-3">
                <FileText className="text-[#CC0000]" />
                <h2 className="text-xl font-black text-[#2D2926]">Secretary Meeting Notes</h2>
              </div>
              <form onSubmit={handleNoteSubmit} className="grid gap-4">
                <fieldset disabled={!canWriteNotes} className="grid gap-4 disabled:opacity-55">
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
                    <textarea
                      value={meetingNotes}
                      onChange={(event) => setMeetingNotes(event.target.value)}
                      rows={5}
                      placeholder={canWriteNotes ? "Type meeting minutes, decisions, votes, next steps, and owner assignments here." : "E-board-only editing"}
                      className="resize-none border border-[#ded8d2] px-3 py-2 text-sm font-medium normal-case tracking-normal outline-none focus:border-[#CC0000] xl:h-[9rem]"
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
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5b5450]">{selectedNote.body || "No Notes Body Added."}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setTrophyEditorOpen((current) => !current)}
              className="flex w-full flex-col gap-3 border-b-4 border-[#CC0000] pb-4 text-left md:flex-row md:items-end md:justify-between"
              aria-expanded={trophyEditorOpen}
            >
              <div>
                <Eyebrow>Trophies Page Editor</Eyebrow>
                <h2 className="mt-2 text-2xl font-black text-[#2D2926]">Add and Update Public Achievements</h2>
                <p className="mt-2 text-sm leading-6 text-[#5b5450]">
                  Changes save to the public Trophies page. Use one highlight per line for tournament entries.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 self-start border border-[#ded8d2] bg-[#f6f4f2] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#2D2926] md:self-auto">
                {trophyEditorOpen ? "Close Editor" : "Open Editor"} <ChevronDown size={16} className={`transition ${trophyEditorOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            {trophyEditorOpen && (
              <div className="mt-5">
                <PrimaryButton href="/trophies" className="mb-5 px-4 py-2 text-xs">
                  Preview <ExternalLink size={14} />
                </PrimaryButton>

            <div className="columns-1 gap-5 xl:columns-2">
              <details className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3" open>
                <summary className="cursor-pointer text-lg font-black text-[#2D2926]">Top Stats</summary>
                <div className="mt-3 grid gap-3">
                <form onSubmit={addTrophyStat} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <div className="grid gap-2 2xl:grid-cols-[0.45fr_0.8fr_1fr_auto]">
                    <input value={newTrophyStat.value} onChange={(event) => setNewTrophyStat((current) => ({ ...current, value: event.target.value }))} placeholder="#4" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyStat.label} onChange={(event) => setNewTrophyStat((current) => ({ ...current, label: event.target.value }))} placeholder="Label" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyStat.detail} onChange={(event) => setNewTrophyStat((current) => ({ ...current, detail: event.target.value }))} placeholder="Detail" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                </form>
                <div className="grid gap-2">
                  {trophiesContent.stats.map((stat) => (
                    <div key={stat.id} className="grid gap-2 border border-[#ded8d2] bg-white p-3 2xl:grid-cols-[0.35fr_0.75fr_1fr_auto]">
                      <input value={stat.value} onChange={(event) => updateTrophyItem("stats", stat.id, "value", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                      <input value={stat.label} onChange={(event) => updateTrophyItem("stats", stat.id, "label", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000]" />
                      <input value={stat.detail} onChange={(event) => updateTrophyItem("stats", stat.id, "detail", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                      <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${stat.label}?`, body: "This stat will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("stats", stat.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${stat.label}`}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                </div>
              </details>

              <details className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <summary className="cursor-pointer text-lg font-black text-[#2D2926]">Accomplishments List</summary>
                <div className="mt-3 grid gap-3">
                <form onSubmit={addTrophyAccomplishment} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3 2xl:grid-cols-[1fr_auto]">
                  <input value={newTrophyAccomplishment} onChange={(event) => setNewTrophyAccomplishment(event.target.value)} placeholder="Add accomplishment line" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                </form>
                <div className="grid gap-2">
                  {trophiesContent.accomplishments.map((item) => (
                    <div key={item.id} className="grid gap-2 border border-[#ded8d2] bg-white p-3 2xl:grid-cols-[1fr_auto]">
                      <input value={item.text} onChange={(event) => updateTrophyItem("accomplishments", item.id, "text", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000]" />
                      <button type="button" onClick={() => requestDeleteConfirmation({ title: "Delete this accomplishment?", body: item.text, onConfirm: () => removeTrophyItem("accomplishments", item.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${item.text}`}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
                </div>
              </details>

              <details className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <summary className="cursor-pointer text-lg font-black text-[#2D2926]">Milestone Cards</summary>
                <div className="mt-3 grid gap-3">
                <form onSubmit={addTrophyMilestone} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                    <input value={newTrophyMilestone.year} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, year: event.target.value }))} placeholder="Year" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyMilestone.title} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                  <textarea value={newTrophyMilestone.copy} onChange={(event) => setNewTrophyMilestone((current) => ({ ...current, copy: event.target.value }))} placeholder="Short description" rows={2} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                </form>
                <div className="grid gap-2">
                  {trophiesContent.milestones.map((item) => (
                    <div key={item.id} className="grid gap-2 border border-[#ded8d2] bg-white p-3">
                      <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                        <input value={item.year} onChange={(event) => updateTrophyItem("milestones", item.id, "year", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                        <input value={item.title} onChange={(event) => updateTrophyItem("milestones", item.id, "title", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-bold outline-none focus:border-[#CC0000]" />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${item.title}?`, body: "This milestone card will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("milestones", item.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${item.title}`}><Trash2 size={16} /></button>
                      </div>
                      <textarea value={item.copy} onChange={(event) => updateTrophyItem("milestones", item.id, "copy", event.target.value)} rows={2} className="resize-none border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    </div>
                  ))}
                </div>
                </div>
              </details>

              <details className="mb-5 break-inside-avoid border border-[#ded8d2] bg-white p-3">
                <summary className="cursor-pointer text-lg font-black text-[#2D2926]">Current Member Achievements</summary>
                <div className="mt-3 grid gap-3">
                <form onSubmit={addTrophyMemberAchievement} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                  <div className="grid gap-2 2xl:grid-cols-[1fr_0.75fr_auto]">
                    <input value={newTrophyMember.name} onChange={(event) => setNewTrophyMember((current) => ({ ...current, name: event.target.value }))} placeholder="Member name" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <input value={newTrophyMember.meta} onChange={(event) => setNewTrophyMember((current) => ({ ...current, meta: event.target.value }))} placeholder="Meta, optional" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                    <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                  </div>
                  <textarea value={newTrophyMember.achievement} onChange={(event) => setNewTrophyMember((current) => ({ ...current, achievement: event.target.value }))} placeholder="Achievement to add to this member" rows={2} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                </form>
                <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
                  {trophiesContent.members.map((member) => (
                    <div key={member.id} className="grid gap-2 border border-[#ded8d2] bg-white p-3">
                      <div className="grid gap-2 2xl:grid-cols-[1fr_0.75fr_auto]">
                        <input value={member.name} onChange={(event) => updateTrophyItem("members", member.id, "name", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                        <input value={member.meta} onChange={(event) => updateTrophyItem("members", member.id, "meta", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${member.name}?`, body: "This member achievement card will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("members", member.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${member.name}`}><Trash2 size={16} /></button>
                      </div>
                      {member.achievements.map((achievement, index) => (
                        <div key={`${member.id}-${index}`} className="grid gap-2 2xl:grid-cols-[1fr_auto]">
                          <input value={achievement} onChange={(event) => updateTrophyMemberAchievement(member.id, index, event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                          <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete achievement for ${member.name}?`, body: achievement, onConfirm: () => removeTrophyMemberAchievement(member.id, index) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove achievement for ${member.name}`}><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                </div>
              </details>
            </div>

            <details className="mt-5 border border-[#ded8d2] bg-white p-3">
              <summary className="cursor-pointer text-lg font-black text-[#2D2926]">Tournament Results Timeline</summary>
              <div className="mt-3 grid gap-3">
              <form onSubmit={addTrophyResult} className="grid gap-2 border border-[#CC0000]/45 bg-white p-3">
                <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                  <input type="date" value={newTrophyResult.date} onChange={(event) => setNewTrophyResult((current) => ({ ...current, date: event.target.value }))} className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <input value={newTrophyResult.tournament} onChange={(event) => setNewTrophyResult((current) => ({ ...current, tournament: event.target.value }))} placeholder="Tournament name" className="border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
                  <button type="submit" className="bg-[#CC0000] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">Add</button>
                </div>
                <textarea value={newTrophyResult.highlights} onChange={(event) => setNewTrophyResult((current) => ({ ...current, highlights: event.target.value }))} placeholder="One highlight per line" rows={4} className="resize-none border border-[#ded8d2] px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
              </form>
              <div className="grid gap-2">
                {[...trophiesContent.results].reverse().map((result) => (
                  <div key={result.id} className="grid gap-2 border border-[#ded8d2] bg-white p-3">
                    <div className="grid gap-2 2xl:grid-cols-[0.45fr_1fr_auto]">
                      <input type="date" value={result.date} onChange={(event) => updateTrophyItem("results", result.id, "date", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                      <input value={result.tournament} onChange={(event) => updateTrophyItem("results", result.id, "tournament", event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm font-black outline-none focus:border-[#CC0000]" />
                      <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete ${result.tournament}?`, body: "This tournament entry and its highlights will be removed from the public Trophies page.", onConfirm: () => removeTrophyItem("results", result.id) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove ${result.tournament}`}><Trash2 size={16} /></button>
                    </div>
                    {result.highlights.map((highlight, index) => (
                      <div key={`${result.id}-${index}`} className="grid gap-2 2xl:grid-cols-[1fr_auto]">
                        <input value={highlight} onChange={(event) => updateTrophyResultHighlight(result.id, index, event.target.value)} className="border border-[#ded8d2] px-2 py-2 text-sm outline-none focus:border-[#CC0000]" />
                        <button type="button" onClick={() => requestDeleteConfirmation({ title: `Delete highlight from ${result.tournament}?`, body: highlight, onConfirm: () => removeTrophyResultHighlight(result.id, index) })} className="grid h-10 w-10 place-items-center border border-[#ded8d2] text-[#CC0000]" aria-label={`Remove highlight from ${result.tournament}`}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              </div>
            </details>
              </div>
            )}
          </Card>
        </div>
      )}
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

    async function hydrateTrophiesContent() {
      const databaseContent = await loadTrophiesContent();
      if (!databaseContent || ignore) return;
      setTrophiesContent(databaseContent);
      saveStoredTrophiesContent(databaseContent);
    }

    hydrateTrophiesContent();

    return () => {
      ignore = true;
    };
  }, []);

  const updateTrophiesContent = useCallback((nextContent) => {
    setTrophiesContent(nextContent);
    saveStoredTrophiesContent(nextContent);
    upsertTrophiesContent(nextContent);
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
        return <NoviceHubPage />;
      case "/calendar":
        return <CalendarPage calendarEmbedUrl={calendarEmbedUrl} />;
      case "/meetings":
        return <MeetingsPage auth={auth} onRequestConfirmation={requestConfirmation} />;
      case "/history":
        return <HistoryPage />;
      case "/trophies":
        return <TrophiesPage trophiesContent={trophiesContent} />;
      case "/eboard":
        return <EBoardPage />;
      case "/contact":
        return <ContactPage />;
      case "/join":
        return <JoinPage auth={auth} onRequestConfirmation={requestConfirmation} />;
      case "/login":
        return <LoginPage onLogin={setAuth} />;
      case "/hub":
        return <PrivateHubPage auth={auth} trophiesContent={trophiesContent} onTrophiesContentChange={updateTrophiesContent} onRequestConfirmation={requestConfirmation} onLogout={() => {
          clearStoredAuth();
          setAuth(null);
          navigateTo("/login");
        }} />;
      default:
        return <NotFoundPage />;
    }
  }, [auth, calendarEmbedUrl, path, requestConfirmation, trophiesContent, updateTrophiesContent]);

  return (
    <main className="min-h-screen bg-[#f6f4f2] text-[#2D2926]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(45,41,38,0.045)_1px,transparent_1px),linear-gradient(rgba(45,41,38,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <header className="sticky top-0 z-50 border-b border-[#c9c7c3] bg-[#e1dfdc]/95 shadow-[0_16px_42px_rgba(45,41,38,0.08)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[98rem] items-center justify-between gap-4 px-5 py-3 md:px-8">
          <SiteLink href="/" className="group flex min-w-0 items-center gap-3">
            <img
              src="/buds-logo.png"
              alt="BU Debate Society logo"
              className="h-14 w-14 shrink-0 rounded-sm object-cover shadow-sm transition group-hover:brightness-95"
            />
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
