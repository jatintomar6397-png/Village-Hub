require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in your .env file before running this migration.');
  console.error('Please configure your credentials and rerun: node server/utils/supabaseMigrate.js\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function migrate() {
  console.log('\n======================================================================');
  console.log('  VILLAGE HUB — Supabase Data Migration & Import');
  console.log('======================================================================\n');

  // 1. Migrate Villages (46 Census Villages)
  const villagesPath = path.join(__dirname, '..', 'data', 'villages.json');
  if (fs.existsSync(villagesPath)) {
    const rawVillages = JSON.parse(fs.readFileSync(villagesPath, 'utf8'));
    console.log(`[Villages] Found ${rawVillages.length} village records in JSON dataset...`);

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

    const { data, error } = await supabase
      .from('villages')
      .upsert(formattedVillages, { onConflict: 'name,district' })
      .select('id, name');

    if (error) {
      console.error('❌ Error migrating villages:', error.message);
    } else {
      console.log(`✅ [Villages] Successfully migrated/upserted ${data ? data.length : formattedVillages.length} villages!`);
    }
  }

  // 2. Migrate Complaints (Idempotent by complaint_id)
  const complaintsPath = path.join(__dirname, '..', 'data_backup', 'complaints.json');
  if (fs.existsSync(complaintsPath)) {
    const rawComplaints = JSON.parse(fs.readFileSync(complaintsPath, 'utf8'));
    console.log(`\n[Complaints] Found ${rawComplaints.length} complaint records...`);

    let migratedComplaints = 0;
    for (const c of rawComplaints) {
      if (!c.complaintId) continue;

      // Check if complaint already exists
      const { data: existing } = await supabase
        .from('complaints')
        .select('id')
        .eq('complaint_id', c.complaintId)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('complaints').insert({
          complaint_id: c.complaintId,
          name: c.name || 'Anonymous',
          phone: c.phone || '',
          district: c.district || 'Hapur',
          tehsil: c.tehsil || '',
          village: c.village || '',
          category: c.category || 'General',
          description: c.description || '',
          image: c.image || null,
          status: c.status || 'Submitted',
          created_at: c.createdAt || new Date().toISOString()
        });

        if (error) {
          console.warn(`  Warning: Could not insert complaint ${c.complaintId}:`, error.message);
        } else {
          migratedComplaints++;
        }
      }
    }
    console.log(`✅ [Complaints] Migrated ${migratedComplaints} new complaint records (duplicates skipped).`);
  }

  // 3. Migrate Applications (Idempotent by email + village)
  const appsPath = path.join(__dirname, '..', 'data_backup', 'applications.json');
  if (fs.existsSync(appsPath)) {
    const rawApps = JSON.parse(fs.readFileSync(appsPath, 'utf8'));
    console.log(`\n[Applications] Found ${rawApps.length} application records...`);

    let migratedApps = 0;
    for (const a of rawApps) {
      if (!a.email) continue;

      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('email', a.email)
        .eq('village', a.village || '')
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('applications').insert({
          name: a.name || 'Applicant',
          email: a.email,
          phone: a.phone || '',
          village: a.village || '',
          requested_role: a.requestedRole || 'Volunteer',
          message: a.message || '',
          status: a.status || 'Pending',
          created_at: a.createdAt || new Date().toISOString()
        });

        if (error) {
          console.warn(`  Warning: Could not insert application for ${a.email}:`, error.message);
        } else {
          migratedApps++;
        }
      }
    }
    console.log(`✅ [Applications] Migrated ${migratedApps} new applications (duplicates skipped).`);
  }

  // 4. Create / Ensure Administrator Account in Supabase Auth & profiles
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@villagehub.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@VillageHub2024';

  console.log(`\n[Admin Auth] Ensuring administrator account exists for ${adminEmail}...`);

  try {
    // List users to see if admin already exists
    const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
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
      console.log(`✅ [Admin Auth] Admin user created in Supabase Auth (ID: ${adminUser.id})`);
    } else {
      console.log(`ℹ️ [Admin Auth] Admin user already exists in Supabase Auth (ID: ${adminUser.id})`);
    }

    if (adminUser) {
      // Upsert into profiles table with role: 'admin'
      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({
          id: adminUser.id,
          name: 'Village Hub Admin',
          email: adminEmail,
          role: 'admin'
        }, { onConflict: 'id' });

      if (profileErr) {
        console.error('❌ Error linking admin profile:', profileErr.message);
      } else {
        console.log(`✅ [Admin Profile] Admin verified with role = 'admin' in profiles table.`);
      }
    }
  } catch (err) {
    console.error('❌ Admin creation error:', err.message);
  }

  console.log('\n======================================================================');
  console.log('  Supabase Data Migration Completed Successfully!');
  console.log('======================================================================\n');
}

migrate().catch(console.error);
