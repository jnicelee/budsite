import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2]?.trim().toLowerCase();
const providedPassword = process.argv[3];

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Set SUPABASE_URL or VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  process.exit(1);
}

if (!email) {
  console.error("Usage: npm run reset:approved-login -- member@bu.edu [temporary-password]");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function generatePassword(length = 18) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

const { data: account, error: accountError } = await supabase
  .from("member_accounts")
  .select("id,name,email,role,status")
  .eq("email", email)
  .maybeSingle();

if (accountError) throw new Error(accountError.message);

if (!account || account.status !== "active") {
  throw new Error(`${email} is not an active approved member account.`);
}

const password = providedPassword || generatePassword();
const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (usersError) throw new Error(usersError.message);

const authUser = users.users.find((user) => user.email?.toLowerCase() === email);

if (authUser) {
  const { error } = await supabase.auth.admin.updateUserById(authUser.id, {
    password,
    email_confirm: true,
    user_metadata: {
      ...authUser.user_metadata,
      name: account.name,
      role: account.role,
    },
  });
  if (error) throw new Error(error.message);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: account.name,
      role: account.role,
      source: "budsite-approved-login-reset",
    },
  });
  if (error) throw new Error(error.message);
}

console.log(JSON.stringify({
  email,
  role: account.role,
  temporaryPassword: password,
}, null, 2));
