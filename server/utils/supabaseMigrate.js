require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env file before running this migration.');
  console.error('Please configure your credentials and rerun: npm.cmd run migrate:supabase\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function migrate() {
  console.log('\n======================================================================');
  console.log('  VILLAGE HUB — Supabase Data Migration & Import');
  console.log('======================================================================\n');

  const migrationErrors = [];
  const summary = {
    villages: { expected: 0, existing: 0, imported: 0, verified: 0, status: 'PENDING' },
    complaints: { expected: 0, existing: 0, imported: 0, verified: 0, status: 'PENDING' },
    applications: { expected: 0, existing: 0, imported: 0, verified: 0, status: 'PENDING' },
    admin: { status: 'PENDING', userId: null, profileLinked: false }
  };

  // 0. Permission Pre-flight Check
  console.log('[Pre-flight] Verifying database connectivity and table permissions...');
  try {
    const { error: permCheckErr } = await supabase.from('villages').select('id').limit(1);
    if (permCheckErr) {
      if (permCheckErr.code === '42501' || permCheckErr.message.includes('permission denied')) {
        console.error('\n❌ PERMISSION DENIED ERROR:');
        console.error('  The service_role does not have table permissions on public schema tables.');
        console.error('  Please execute the SQL migration script:');
        console.error('  supabase/migrations/20261015000001_fix_permissions.sql');
        console.error('  in your Supabase SQL Editor, then rerun this migration.\n');
        process.exitCode = 1;
        return;
      }
      throw permCheckErr;
    }
    console.log('  ✅ Table permissions verified successfully for service_role.');
  } catch (err) {
    console.error('❌ Pre-flight check failed:', err.message);
    process.exitCode = 1;
    return;
  }

  // 1. Inspect Existing Data (Pre-migration Inspection)
  console.log('\n[Inspection] Inspecting existing records in Supabase...');
  try {
    const { count: vCount } = await supabase.from('villages').select('*', { count: 'exact', head: true });
    summary.villages.existing = vCount || 0;
    console.log(`  - Existing villages in database: ${summary.villages.existing}`);

    const { count: cCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
    summary.complaints.existing = cCount || 0;
    console.log(`  - Existing complaints in database: ${summary.complaints.existing}`);

    const { count: aCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });
    summary.applications.existing = aCount || 0;
    console.log(`  - Existing applications in database: ${summary.applications.existing}`);
  } catch (err) {
    console.warn('  ⚠️ Could not query pre-existing counts:', err.message);
  }

  // 2. Migrate Villages (46 Census Villages)
  const villagesPath = path.join(__dirname, '..', 'data', 'villages.json');
  if (fs.existsSync(villagesPath)) {
    const rawVillages = JSON.parse(fs.readFileSync(villagesPath, 'utf8'));
    summary.villages.expected = rawVillages.length;
    console.log(`\n[Villages] Processing ${rawVillages.length} source records from villages.json...`);

    const formattedVillages = rawVillages.map((v) => ({
      name: v.name,
      district: v.district,
      tehsil: v.tehsil || '',
      population: String(v.population || v.pop || '0'),
      problems: v.problems || v.focus || '',
      status: v.status || 'Under Assessment',
      progress: Number(v.progress) || 0,
      latitude: Number(v.latitude || v.lat) || 28.65,
      longitude: Number(v.longitude || v.lng) || 77.65,
      schools: Number(v.schools) || 0,
      hospitals: Number(v.hospitals) || 0
    }));

    // Idempotent upsert by (name, district) unique constraint
    const { data: upsertedData, error: vErr } = await supabase
      .from('villages')
      .upsert(formattedVillages, { onConflict: 'name,district' })
      .select('id, name');

    if (vErr) {
      console.error('❌ Error migrating villages:', vErr.message);
      migrationErrors.push(`Villages migration failed: ${vErr.message}`);
      summary.villages.status = 'FAILED';
    } else {
      summary.villages.imported = upsertedData ? upsertedData.length : formattedVillages.length;
      summary.villages.status = 'SUCCESS';
      console.log(`  ✅ [Villages] Upserted ${summary.villages.imported} village records.`);
    }
  } else {
    migrationErrors.push(`Villages dataset not found at ${villagesPath}`);
    summary.villages.status = 'FILE_NOT_FOUND';
  }

  // 3. Complaints - Skip old mock test data
  console.log('\n[Complaints] Skipping import of old mock test complaints from backup files.');
  summary.complaints.status = 'SKIPPED (Clean Database Policy)';

  // 4. Applications - Skip old mock test data
  console.log('\n[Applications] Skipping import of old mock test applications from backup files.');
  summary.applications.status = 'SKIPPED (Clean Database Policy)';

  // 5. Ensure Administrator Account in Supabase Auth & public.profiles
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@villagehub.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@VillageHub2024';

  console.log(`\n[Admin Auth] Ensuring administrator account for ${adminEmail}...`);
  try {
    const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) throw listErr;

    let adminUser = usersData && usersData.users ? usersData.users.find(u => u.email === adminEmail) : null;

    if (!adminUser) {
      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { name: 'Village Hub Admin', role: 'admin' }
      });
      if (createErr) throw createErr;
      adminUser = newUser.user;
      console.log(`  ✅ Admin user created in Supabase Auth (ID: ${adminUser.id})`);
    } else {
      console.log(`  ℹ️ Admin user already exists in Supabase Auth (ID: ${adminUser.id})`);
    }

    summary.admin.userId = adminUser.id;

    // Link/Upsert to public.profiles with role = 'admin'
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        name: 'Village Hub Admin',
        email: adminEmail,
        role: 'admin'
      }, { onConflict: 'id' });

    if (profileErr) {
      console.error('  ❌ Error linking admin profile:', profileErr.message);
      migrationErrors.push(`Admin profile linking failed: ${profileErr.message}`);
      summary.admin.status = 'FAILED';
    } else {
      summary.admin.profileLinked = true;
      summary.admin.status = 'SUCCESS';
      console.log(`  ✅ Admin verified with role = 'admin' in profiles table.`);
    }
  } catch (err) {
    console.error('  ❌ Admin Auth/Profile error:', err.message);
    migrationErrors.push(`Admin creation error: ${err.message}`);
    summary.admin.status = 'FAILED';
  }

  // 6. Post-migration Verification & Actual Count Auditing
  console.log('\n[Verification] Auditing final record counts in Supabase database...');
  try {
    const { count: finalVillages, error: vCountErr } = await supabase
      .from('villages')
      .select('*', { count: 'exact', head: true });
    if (vCountErr) throw vCountErr;
    summary.villages.verified = finalVillages || 0;

    const { count: finalComplaints, error: cCountErr } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });
    if (cCountErr) throw cCountErr;
    summary.complaints.verified = finalComplaints || 0;

    const { count: finalApps, error: aCountErr } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });
    if (aCountErr) throw aCountErr;
    summary.applications.verified = finalApps || 0;

    // Verify admin in profiles table
    const { data: adminProfile, error: profErr } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', adminEmail)
      .maybeSingle();

    if (profErr || !adminProfile || adminProfile.role !== 'admin') {
      migrationErrors.push(`Admin profile verification failed: profile not found or role !== 'admin'`);
      summary.admin.profileLinked = false;
    } else {
      summary.admin.profileLinked = true;
    }
  } catch (err) {
    console.error('❌ Verification query error:', err.message);
    migrationErrors.push(`Verification query failed: ${err.message}`);
  }

  // Check count matches
  if (summary.villages.verified < 46) {
    migrationErrors.push(`Villages count mismatch: verified ${summary.villages.verified} < 46 expected`);
  }

  // 7. Migration Summary & Safe Exit
  console.log('\n======================================================================');
  console.log('  MIGRATION SUMMARY');
  console.log('======================================================================');
  console.log(`  Villages:      ${summary.villages.verified} verified in database [${summary.villages.status}]`);
  console.log(`  Complaints:    ${summary.complaints.verified} existing in database [${summary.complaints.status}]`);
  console.log(`  Applications:  ${summary.applications.verified} existing in database [${summary.applications.status}]`);
  console.log(`  Admin Auth:    ID ${summary.admin.userId || 'N/A'} [${summary.admin.userId ? 'EXISTS' : 'FAILED'}]`);
  console.log(`  Admin Profile: role = 'admin' [${summary.admin.profileLinked ? 'VERIFIED' : 'FAILED'}]`);
  console.log('======================================================================\n');

  if (migrationErrors.length > 0) {
    console.error('❌ MIGRATION FAILED with the following error(s):');
    migrationErrors.forEach((e, idx) => console.error(`  ${idx + 1}. ${e}`));
    console.error('\nPlease resolve the issues above and rerun: npm.cmd run migrate:supabase\n');
    process.exitCode = 1;
    return;
  }

  console.log('🎉 Supabase Data Migration Completed and Verified Successfully!\n');
  process.exitCode = 0;
}

migrate().catch((err) => {
  console.error('\n❌ Fatal migration error:', err);
  process.exitCode = 1;
});
