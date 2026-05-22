const APDA_BASE_URL = "https://results.apda.online";
const BU_SCHOOL_ID = 6;
const SCHOOL_NAME = "Boston University";

function seasonIdFromDisplay(display = "") {
  const match = String(display).match(/(20\d{2})-(\d{2})/);
  if (!match) return "";
  return `${match[1]}-20${match[2]}`;
}

function ordinal(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value || "");
  const suffix = number % 100 >= 11 && number % 100 <= 13 ? "th" : { 1: "st", 2: "nd", 3: "rd" }[number % 10] || "th";
  return `${number}${suffix}`;
}

function formatTeamResult(result) {
  const type = result.type || "Varsity";
  const teamName = result.team?.name || "Boston University";
  const debaters = (result.team?.debaters || []).map((debater) => debater.name).filter(Boolean);
  const debaterText = debaters.length > 0 ? ` (${debaters.join(" and ")})` : "";
  const place = result.place_display || ordinal(result.place);
  if (place === "1st") return `${teamName}${debaterText} are ${type} Champions.`;
  if (place === "2nd") return `${teamName}${debaterText} places 2nd in ${type} Team.`;
  if (/finalist/i.test(place)) return `${teamName}${debaterText} reaches ${type} ${place.replace(/-?Finalist/i, "-Finals")}.`;
  return `${teamName}${debaterText} reaches ${type} ${place}.`;
}

function isPlacedResult(result) {
  return Number(result.place) > 0 && Boolean(result.place_display || result.place);
}

function formatSpeakerResult(result) {
  const type = result.type || "Varsity";
  return `${result.debater?.name} earns ${ordinal(result.place)} ${type} Speaker.`;
}

function divisionPrestige(type = "") {
  return type === "Varsity" ? 0 : type === "Novice" ? 1 : 2;
}

function awardPrestige(award) {
  const result = award.result || {};
  const kindRank = award.kind === "team" ? 0 : 1;
  const placeRank = Number(result.place) || 999;
  return (kindRank * 1000) + (divisionPrestige(result.type) * 100) + placeRank;
}

function sortAwardsByPrestige(awards) {
  return [...awards].sort((a, b) => awardPrestige(a) - awardPrestige(b) || a.text.localeCompare(b.text));
}

async function fetchJson(path) {
  const response = await fetch(`${APDA_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`APDA returned ${response.status} for ${path}`);
  }
  return response.json();
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

function mergeTournamentAward(tournamentMap, tournament, award) {
  if (!tournament?.id || !tournament?.date) return;
  const current = tournamentMap.get(tournament.id) || {
    id: `apda-result-${tournament.id}`,
    date: tournament.date,
    tournament: tournament.display || tournament.name,
    teamAwards: new Map(),
    speakerAwards: new Map(),
  };
  if (award.kind === "team") current.teamAwards.set(award.id, award);
  if (award.kind === "speaker") current.speakerAwards.set(award.id, award);
  tournamentMap.set(tournament.id, current);
}

function buildMemberAchievement(member, debaterDetail, season) {
  const summary = (debaterDetail.season_summaries || []).find((item) => item.season === season);
  const seasonLabel = summary?.season_display || String(season || "Selected season");
  const achievements = [];
  const teamAwardSeen = new Set();
  const speakerAwardSeen = new Set();

  (summary?.tournaments || []).forEach((entry) => {
    (entry.team_results || []).forEach((result) => {
      if (!isPlacedResult(result)) return;
      if (!result.id || teamAwardSeen.has(result.id)) return;
      teamAwardSeen.add(result.id);
      const place = result.place_display === "1st" ? "Champion" : result.place_display;
      achievements.push(`${seasonLabel} ${entry.tournament?.display || entry.tournament?.name}: ${result.type || "Varsity"} ${place}`);
    });
    (entry.speaker_results || []).forEach((result) => {
      if (!result.id || speakerAwardSeen.has(result.id)) return;
      speakerAwardSeen.add(result.id);
      achievements.push(`${seasonLabel} ${entry.tournament?.display || entry.tournament?.name}: ${ordinal(result.place)} ${result.type || "Varsity"} Speaker`);
    });
  });

  return {
    id: `apda-member-${member.debater.id}`,
    name: member.debater.name,
    meta: `${member.years_on_team}${member.years_on_team === 1 ? "st" : member.years_on_team === 2 ? "nd" : member.years_on_team === 3 ? "rd" : "th"} year, ${member.debater.status || "Debater"}`,
    achievements: achievements.length > 0 ? achievements : [`No ${summary?.season_display || "selected season"} APDA awards listed yet.`],
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

function mergeMembersByName(members) {
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

function buildContentProposal(schoolDetail, debaterDetails) {
  const season = schoolDetail.season;
  const seasonDisplay = schoolDetail.season_display;
  const seasonId = seasonIdFromDisplay(seasonDisplay);
  const currentCoty = (schoolDetail.coty_history || []).find((entry) => entry.season === season);
  const previousCoty = (schoolDetail.coty_history || []).find((entry) => entry.season !== season);
  const members = schoolDetail.season_summary?.members || [];
  const cotyBreakdown = schoolDetail.season_summary?.coty_breakdown || [];
  const tournamentMap = new Map();

  debaterDetails.forEach((detail) => {
    const summary = (detail.season_summaries || []).find((item) => item.season === season);
    (summary?.tournaments || []).forEach((entry) => {
      (entry.team_results || []).forEach((result) => {
        if (!isPlacedResult(result)) return;
        const debaters = result.team?.debaters || [];
        const hasBuDebater = debaters.some((debater) => debater.school_id === BU_SCHOOL_ID || debater.school_name === SCHOOL_NAME);
        if (!hasBuDebater) return;
        mergeTournamentAward(tournamentMap, entry.tournament, {
          kind: "team",
          id: result.id,
          text: formatTeamResult(result),
          result,
        });
      });
      (entry.speaker_results || []).forEach((result) => {
        if (result.debater?.school_id !== BU_SCHOOL_ID && result.debater?.school_name !== SCHOOL_NAME) return;
        mergeTournamentAward(tournamentMap, entry.tournament, {
          kind: "speaker",
          id: result.id,
          text: formatSpeakerResult(result),
          result,
        });
      });
    });
  });

  const results = [...tournamentMap.values()]
    .map((entry) => ({
      id: entry.id,
      date: entry.date,
      tournament: entry.tournament,
      highlights: sortAwardsByPrestige([...entry.teamAwards.values(), ...entry.speakerAwards.values()]).map((award) => award.text),
    }))
    .filter((entry) => entry.highlights.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const proposedMembers = mergeMembersByName(members.map((member, index) => buildMemberAchievement(member, debaterDetails[index], season)));

  const stats = [
    {
      id: "apda-current-coty-rank",
      value: currentCoty ? `#${currentCoty.place}` : "N/A",
      label: `${seasonDisplay} COTY rank`,
      detail: currentCoty ? `${currentCoty.points} points` : "Not listed by APDA yet",
    },
    {
      id: "apda-current-members",
      value: "100+",
      label: "Current members",
      detail: "Members on Terrier Central",
    },
    {
      id: "apda-coty-contributors",
      value: String(cotyBreakdown.length),
      label: "COTY contributors",
      detail: `Debaters with ${seasonDisplay} COTY points`,
    },
    {
      id: "apda-previous-coty-rank",
      value: previousCoty ? `#${previousCoty.place}` : "N/A",
      label: previousCoty ? `${previousCoty.season_display} COTY rank` : "Previous COTY rank",
      detail: previousCoty ? `${previousCoty.points} points` : "Not listed by APDA",
    },
  ];

  const accomplishments = [
    { id: "apda-terrier-central-members", text: "100+ members on Terrier Central" },
    ...(currentCoty ? [{ id: "apda-current-coty", text: `${seasonDisplay} COTY: #${currentCoty.place} nationally, ${currentCoty.points} points` }] : []),
    ...(previousCoty ? [{ id: "apda-previous-coty", text: `${previousCoty.season_display} COTY: #${previousCoty.place} nationally, ${previousCoty.points} points` }] : []),
    { id: "apda-current-coty-contributors", text: `${seasonDisplay} COTY contributors: ${cotyBreakdown.length} BU debaters` },
  ];

  return {
    sourceUrl: `${APDA_BASE_URL}/core/schools/${BU_SCHOOL_ID}?season=${season}`,
    season,
    seasonDisplay,
    seasonId,
    stats,
    accomplishments,
    resultSeason: {
      id: seasonId,
      label: `${seasonDisplay} Results Timeline`,
      results,
    },
    members: proposedMembers,
    summary: {
      memberCount: members.length,
      cotyContributorCount: cotyBreakdown.length,
      tournamentCount: results.length,
      highlightCount: results.reduce((total, result) => total + result.highlights.length, 0),
    },
    warnings: results.length === 0 ? ["APDA returned no BU awards for this season. Existing results will not be changed unless you apply the preview."] : [],
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchApdaPreviewProposal(requestedSeason = "") {
  const schoolPath = `/api/schools/${BU_SCHOOL_ID}/detail/${requestedSeason ? `?season=${encodeURIComponent(requestedSeason)}` : ""}`;
  const schoolDetail = await fetchJson(schoolPath);
  const members = schoolDetail.season_summary?.members || [];
  const debaterDetails = await mapWithConcurrency(members, 5, (member) => (
    fetchJson(`/api/debaters/${member.debater.id}/detail/?season=${encodeURIComponent(schoolDetail.season)}`)
  ));

  return buildContentProposal(schoolDetail, debaterDetails);
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const requestedUrl = new URL(request.url || "/", "https://budsite.local");
    const requestedSeason = request.query?.season || requestedUrl.searchParams.get("season") || "";
    response.status(200).json(await fetchApdaPreviewProposal(requestedSeason));
  } catch (error) {
    response.status(502).json({
      error: "Could not pull APDA standings safely.",
      detail: error instanceof Error ? error.message : "Unknown APDA update error",
    });
  }
}
