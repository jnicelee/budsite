export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export function formatMeetingDate(value) {
  if (!value) return "Date pending";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getMeetingSortTime(post) {
  const meetingTime = Date.parse(`${post.date || ""}T12:00:00`);
  if (Number.isFinite(meetingTime)) return meetingTime;
  const createdTime = Date.parse(post.created_at || "");
  return Number.isFinite(createdTime) ? createdTime : 0;
}

export function sortMeetingPosts(posts) {
  return [...posts].sort((a, b) => {
    const dateCompare = getMeetingSortTime(b) - getMeetingSortTime(a);
    if (dateCompare !== 0) return dateCompare;
    const createdCompare = (b.created_at || "").localeCompare(a.created_at || "");
    return createdCompare || (b.id || "").localeCompare(a.id || "");
  });
}

export function getMemberLinkTitleValue(link) {
  return link.id === "link-tournament-signups" ? "Tournament\nSign-Ups" : link.label;
}
