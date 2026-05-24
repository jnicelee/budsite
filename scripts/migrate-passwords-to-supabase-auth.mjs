import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Set SUPABASE_URL or VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this migration.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function loadRows(table) {
  const { data, error } = await supabase
    .from(table)
    .select("name,email,password")
    .not("password", "is", null)
    .neq("password", "");

  if (error) throw new Error(`${table}: ${error.message}`);
  return data || [];
}

async function ensureAuthUser(row) {
  const email = row.email?.trim().toLowerCase();
  const password = row.password;

  if (!email || !password) return { email, status: "skipped" };

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: row.name || "",
      source: "budsite-password-migration",
    },
  });

  if (!error) return { email, status: "created" };
  if (/already registered|already been registered|already exists/i.test(error.message)) {
    return { email, status: "already-exists" };
  }

  throw new Error(`${email}: ${error.message}`);
}

const rowsByEmail = new Map();

for (const row of await loadRows("member_accounts")) {
  rowsByEmail.set(row.email.trim().toLowerCase(), row);
}

for (const row of await loadRows("membership_requests")) {
  const email = row.email.trim().toLowerCase();
  if (!rowsByEmail.has(email)) rowsByEmail.set(email, row);
}

const results = [];
for (const row of rowsByEmail.values()) {
  results.push(await ensureAuthUser(row));
}

const summary = results.reduce((counts, result) => {
  counts[result.status] = (counts[result.status] || 0) + 1;
  return counts;
}, {});

console.log(`Supabase Auth password migration complete: ${JSON.stringify(summary)}`);
