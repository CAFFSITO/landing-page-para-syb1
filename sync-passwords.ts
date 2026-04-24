import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function syncPasswords() {
  console.log("Fetching all socios...");
  const { data: socios, error } = await supabase.from('socios').select('id, token, email');

  if (error) {
    console.error("Error fetching socios:", error);
    process.exit(1);
  }

  console.log(`Found ${socios.length} socios. Updating passwords...`);

  let successCount = 0;
  let errorCount = 0;

  for (const socio of socios) {
    if (!socio.token) {
      console.warn(`Socio ${socio.email} has no token. Skipping.`);
      continue;
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(socio.id, {
      password: socio.token,
    });

    if (updateError) {
      console.error(`Error updating password for ${socio.email}:`, updateError.message);
      errorCount++;
    } else {
      console.log(`Successfully updated password for ${socio.email} to their token.`);
      successCount++;
    }
  }

  console.log(`\nSync complete. Success: ${successCount}, Errors: ${errorCount}`);
}

syncPasswords();
