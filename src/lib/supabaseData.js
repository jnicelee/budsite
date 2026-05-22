import { agendaItems, initialBudgetRevenueRows, initialBudgetRows, privateLinks } from "../data/content";
import { isSupabaseConfigured, supabase } from "../supabaseClient";
import { enrichPrivateLinks, isExpiredCompletedAgendaItem, normalizeAgendaItems, normalizeEboardContent, normalizeHomeContent, normalizeMeetingsContent, normalizeNoviceContent, normalizeTrophiesContent } from "./storage";

const contentNormalizers = {
  trophies: normalizeTrophiesContent,
  meetings: normalizeMeetingsContent,
  novice: normalizeNoviceContent,
  eboard: normalizeEboardContent,
  home: normalizeHomeContent,
};

const contentRevisionsId = (id) => `${id}-revisions`;

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

function normalizeContentRevisionList(id, revisions = []) {
  const normalizer = contentNormalizers[id] || ((content) => content);
  return revisions.slice(0, 3).map((revision) => ({
    ...revision,
    content: normalizer(revision.content),
  }));
}

export async function loadDatabaseState() {
  if (!isSupabaseConfigured) return null;

  const [
    agendaResult,
    notesResult,
    budgetSettingsResult,
    budgetRowsResult,
    budgetRevenueResult,
    privateLinksResult,
    trophiesContentResult,
    meetingsContentResult,
    noviceContentResult,
    eboardContentResult,
    homeContentResult,
  ] = await Promise.all([
    supabase.from("eboard_agenda").select("id,text,owner,due,completed_at").order("created_at", { ascending: false }),
    supabase.from("eboard_notes").select("id,date,title,body,created_at").order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase.from("eboard_budget_settings").select("total").eq("id", "default").maybeSingle(),
    supabase.from("eboard_budget_rows").select("id,category,allocated,spent,status").order("created_at", { ascending: true }),
    supabase.from("eboard_budget_revenue").select("id,category,amount").order("created_at", { ascending: true }),
    supabase.from("private_links").select("id,label,description,url").order("created_at", { ascending: true }),
    supabase.from("site_content").select("content").eq("id", "trophies").maybeSingle(),
    supabase.from("site_content").select("content").eq("id", "meetings").maybeSingle(),
    supabase.from("site_content").select("content").eq("id", "novice").maybeSingle(),
    supabase.from("site_content").select("content").eq("id", "eboard").maybeSingle(),
    supabase.from("site_content").select("content").eq("id", "home").maybeSingle(),
  ]);

  if (agendaResult.error || notesResult.error || budgetSettingsResult.error || budgetRowsResult.error || budgetRevenueResult.error || privateLinksResult.error || trophiesContentResult.error || meetingsContentResult.error || noviceContentResult.error || eboardContentResult.error || homeContentResult.error) {
    console.error("Supabase load failed", {
      agendaError: agendaResult.error,
      notesError: notesResult.error,
      budgetSettingsError: budgetSettingsResult.error,
      budgetRowsError: budgetRowsResult.error,
      budgetRevenueError: budgetRevenueResult.error,
      privateLinksError: privateLinksResult.error,
      trophiesContentError: trophiesContentResult.error,
      meetingsContentError: meetingsContentResult.error,
      noviceContentError: noviceContentResult.error,
      eboardContentError: eboardContentResult.error,
      homeContentError: homeContentResult.error,
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
    trophiesContent: trophiesContentResult.data?.content ? normalizeTrophiesContent(trophiesContentResult.data.content) : null,
    meetingsContent: meetingsContentResult.data?.content ? normalizeMeetingsContent(meetingsContentResult.data.content) : null,
    noviceContent: noviceContentResult.data?.content ? normalizeNoviceContent(noviceContentResult.data.content) : null,
    eboardContent: eboardContentResult.data?.content ? normalizeEboardContent(eboardContentResult.data.content) : null,
    homeContent: homeContentResult.data?.content ? normalizeHomeContent(homeContentResult.data.content) : null,
  };
}

export async function loadEboardContent() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("site_content").select("content").eq("id", "eboard").maybeSingle();
  if (error) {
    console.error("Supabase eboard content load failed", error);
    return null;
  }
  return data?.content ? normalizeEboardContent(data.content) : null;
}

export async function upsertEboardContent(content) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: "eboard", content: normalizeEboardContent(content), updated_at: new Date().toISOString() });
  if (error) console.error("Supabase eboard content upsert failed", error);
}

export async function loadMeetingsContent() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("site_content").select("content").eq("id", "meetings").maybeSingle();
  if (error) {
    console.error("Supabase meetings content load failed", error);
    return null;
  }
  return data?.content ? normalizeMeetingsContent(data.content) : null;
}

export async function upsertMeetingsContent(content) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: "meetings", content: normalizeMeetingsContent(content), updated_at: new Date().toISOString() });
  if (error) console.error("Supabase meetings content upsert failed", error);
}

export async function loadNoviceContent() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("site_content").select("content").eq("id", "novice").maybeSingle();
  if (error) {
    console.error("Supabase novice content load failed", error);
    return null;
  }
  return data?.content ? normalizeNoviceContent(data.content) : null;
}

export async function upsertNoviceContent(content) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: "novice", content: normalizeNoviceContent(content), updated_at: new Date().toISOString() });
  if (error) console.error("Supabase novice content upsert failed", error);
}

export async function loadTrophiesContent() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("site_content").select("content").eq("id", "trophies").maybeSingle();
  if (error) {
    console.error("Supabase trophies content load failed", error);
    return null;
  }
  return data?.content ? normalizeTrophiesContent(data.content) : null;
}

export async function upsertTrophiesContent(content) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: "trophies", content: normalizeTrophiesContent(content), updated_at: new Date().toISOString() });
  if (error) console.error("Supabase trophies content upsert failed", error);
}

export async function loadHomeContent() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("site_content").select("content").eq("id", "home").maybeSingle();
  if (error) {
    console.error("Supabase home content load failed", error);
    return null;
  }
  return data?.content ? normalizeHomeContent(data.content) : null;
}

export async function upsertHomeContent(content) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: "home", content: normalizeHomeContent(content), updated_at: new Date().toISOString() });
  if (error) console.error("Supabase home content upsert failed", error);
}

export async function loadContentRevisions(id) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from("site_content").select("content").eq("id", contentRevisionsId(id)).maybeSingle();
  if (error) {
    console.error("Supabase content revisions load failed", error);
    return null;
  }
  if (!data) return null;
  return normalizeContentRevisionList(id, data?.content?.revisions || []);
}

export async function upsertContentRevisions(id, revisions) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("site_content")
    .upsert({
      id: contentRevisionsId(id),
      content: { revisions: normalizeContentRevisionList(id, revisions) },
      updated_at: new Date().toISOString(),
    });
  if (error) console.error("Supabase content revisions upsert failed", error);
}

export async function uploadPublicImage(file, folder = "uploads") {
  if (!isSupabaseConfigured || !file) return null;
  const extension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from("public-assets").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("Supabase image upload failed", error);
    return null;
  }
  const { data } = supabase.storage.from("public-assets").getPublicUrl(path);
  return data.publicUrl || null;
}

export async function upsertAgendaItem(item) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_agenda").upsert(item);
  if (error) console.error("Supabase agenda upsert failed", error);
}

export async function deleteAgendaItem(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_agenda").delete().eq("id", id);
  if (error) console.error("Supabase agenda delete failed", error);
}

export async function upsertBudgetSettings(total) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("eboard_budget_settings")
    .upsert({ id: "default", total, updated_at: new Date().toISOString() });
  if (error) console.error("Supabase budget settings upsert failed", error);
}

export async function upsertBudgetRow(row) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_rows").upsert(row);
  if (error) console.error("Supabase budget row upsert failed", error);
}

export async function deleteBudgetRow(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_rows").delete().eq("id", id);
  if (error) console.error("Supabase budget row delete failed", error);
}

export async function upsertBudgetRevenueRow(row) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_revenue").upsert(row);
  if (error) console.error("Supabase budget revenue upsert failed", error);
}

export async function deleteBudgetRevenueRow(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_budget_revenue").delete().eq("id", id);
  if (error) console.error("Supabase budget revenue delete failed", error);
}

export async function insertNote(note) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_notes").insert(note);
  if (error) console.error("Supabase note insert failed", error);
}

export async function deleteNote(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("eboard_notes").delete().eq("id", id);
  if (error) console.error("Supabase note delete failed", error);
}

export async function upsertPrivateLink(link) {
  if (!isSupabaseConfigured) return;
  const { id, label, description, url } = link;
  const { error } = await supabase.from("private_links").upsert({ id, label, description, url });
  if (error) console.error("Supabase private link upsert failed", error);
}

export async function loadMembershipRequests() {
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

export async function findMembershipRequestByEmail(email) {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("membership_requests")
    .select("id,name,email,status,created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("Supabase membership request lookup failed", error);
    return null;
  }
  return data;
}

export async function insertMembershipRequest(request) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("membership_requests").insert(request);
  if (error) console.error("Supabase membership request insert failed", error);
}

export async function updateMembershipRequestStatus(id, status, reason) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("membership_requests")
    .update({ status, reason, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase membership request review failed", error);
}

export async function deleteMembershipRequest(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("membership_requests").delete().eq("id", id);
  if (error) console.error("Supabase membership request delete failed", error);
}

export async function loadMemberAccounts() {
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

export async function findMemberAccount(email, password) {
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

export async function findMemberAccountByEmail(email) {
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

export async function upsertMemberAccount(account) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("member_accounts").upsert(account);
  if (error) console.error("Supabase member account upsert failed", error);
}

export async function updateMemberAccountRole(id, role) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase member role update failed", error);
}

export async function updateMemberAccountName(id, name) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase member name update failed", error);
}

export async function revokeMemberAccount(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase member revoke failed", error);
}

export async function unrevokeMemberAccount(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) console.error("Supabase member unrevoke failed", error);
}

export async function deleteMemberAccount(id) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from("member_accounts")
    .delete()
    .eq("id", id);
  if (error) console.error("Supabase member delete failed", error);
}
