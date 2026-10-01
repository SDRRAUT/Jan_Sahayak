import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_GRIEVANCES, MOCK_CLUSTERS } from '../src/data/mockGrievances.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.resolve(__dirname, '../server/data/store.json');
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://epnfavpqweeybzoyoexq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbmZhdnBxd2VleWJ6b3lvZXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTcxOTMsImV4cCI6MjEwMzk5MzE5M30.PIvlGuiavqRRnb1zTFIwdmizMh9AeSLxc5nW8YdhYHQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🔄 Starting Curated Complaints Synchronization...');
  console.log(`📋 Retaining exactly ${INITIAL_GRIEVANCES.length} realistic complaints:`);
  INITIAL_GRIEVANCES.forEach((g, i) => {
    console.log(`   ${i + 1}. [${g.id}] ${g.department} — ${g.title}`);
  });

  // 1. Update server/data/store.json
  if (fs.existsSync(STORE_PATH)) {
    try {
      const storeData = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      const oldCount = storeData.complaints?.length || 0;
      
      // Transform INITIAL_GRIEVANCES into backend store format
      const formattedComplaints = INITIAL_GRIEVANCES.map(g => ({
        id: g.id,
        title: g.title,
        descriptionRaw: g.descriptionRaw,
        languageDetected: g.languageDetected,
        category: g.category,
        department: g.department,
        officerName: g.officerName,
        officerDesignation: g.officerDesignation,
        location: g.location,
        urgency: g.urgency,
        urgencyScore: g.urgencyScore,
        status: g.status,
        createdAt: g.createdAt,
        timestamp: new Date().toISOString(),
        slaDeadline: g.slaDeadline,
        slaHoursLeft: g.slaHoursLeft,
        clusterId: g.clusterId,
        clusterTitle: g.clusterTitle,
        clusterCount: g.clusterCount,
        upvotes: g.upvotes,
        citizenName: g.citizenName,
        citizenPhone: g.citizenPhone,
        citizenId: 'USR-CITIZEN-01',
        evidence: g.evidence || { photoUrl: g.photoUrl },
        photoUrl: g.photoUrl,
        dna: g.grievanceDna,
        grievanceDna: g.grievanceDna,
        aiOfficerBrief: g.aiOfficerBrief,
        recommendedResolution: g.recommendedResolution,
        timeline: g.timeline
      }));

      storeData.complaints = formattedComplaints;

      // Update clusters
      storeData.clusters = MOCK_CLUSTERS.map(c => ({
        id: c.id,
        title: c.title,
        department: c.department,
        leadDepartment: c.department,
        ward: c.ward,
        complaintCount: c.complaintCount,
        severity: c.severity,
        rootCause: c.rootCause,
        impactRadius: c.impactRadius,
        status: c.status,
        firstReported: c.firstReported,
        estimatedResolution: c.estimatedResolution,
        complaintIds: [INITIAL_GRIEVANCES.find(g => g.clusterId === c.id)?.id].filter(Boolean),
        centroid: INITIAL_GRIEVANCES.find(g => g.clusterId === c.id)?.location || { lat: 28.7185, lng: 77.1255 }
      }));

      fs.writeFileSync(STORE_PATH, JSON.stringify(storeData, null, 2), 'utf8');
      console.log(`✅ Updated server/data/store.json (Replaced ${oldCount} entries with ${formattedComplaints.length} curated complaints)`);
    } catch (err) {
      console.error('❌ Failed to update store.json:', err.message);
    }
  }

  // 2. Synchronize Supabase Database
  try {
    console.log('📡 Connecting to Supabase public.grievances table...');
    const { data: existingGrievances, error: fetchErr } = await supabase
      .from('grievances')
      .select('id, title');

    if (fetchErr) {
      console.warn('⚠️ Could not fetch existing Supabase grievances:', fetchErr.message);
    } else {
      console.log(`Found ${existingGrievances?.length || 0} existing grievances in Supabase.`);
      
      const curatedIds = new Set(INITIAL_GRIEVANCES.map(g => g.id));
      const obsoleteIds = (existingGrievances || [])
        .map(g => g.id)
        .filter(id => !curatedIds.has(id));

      if (obsoleteIds.length > 0) {
        console.log(`🗑️ Deleting ${obsoleteIds.length} obsolete / test complaints from Supabase:`, obsoleteIds);
        for (const badId of obsoleteIds) {
          const { error: delErr } = await supabase
            .from('grievances')
            .delete()
            .eq('id', badId);
          if (delErr) {
            console.warn(`   Warning deleting ${badId}:`, delErr.message);
          } else {
            console.log(`   Deleted: ${badId}`);
          }
        }
      } else {
        console.log('✨ No obsolete complaints found to delete in Supabase.');
      }
    }

    // 3. Upsert the 5 curated grievances into Supabase
    console.log('📤 Upserting 5 curated realistic complaints into Supabase...');
    for (const g of INITIAL_GRIEVANCES) {
      const row = {
        id: g.id,
        citizen_id: 'a0000000-0000-0000-0000-000000000001',
        citizen_name: g.citizenName,
        citizen_phone: g.citizenPhone,
        title: g.title,
        description_raw: g.descriptionRaw,
        language_detected: g.languageDetected,
        category: g.category,
        department: g.department,
        officer_name: g.officerName,
        officer_designation: g.officerDesignation,
        location_ward: g.location.ward,
        location_area: g.location.area,
        location_city: g.location.city,
        location_pincode: g.location.pincode,
        urgency: g.urgency,
        urgency_score: g.urgencyScore,
        status: g.status,
        sla_hours_left: g.slaHoursLeft,
        upvotes: g.upvotes,
        cluster_id: g.clusterId,
        cluster_title: g.clusterTitle,
        cluster_count: g.clusterCount,
        dna: g.grievanceDna,
        evidence: g.evidence || { photoUrl: g.photoUrl },
        timeline: g.timeline
      };

      const { error: upsertErr } = await supabase
        .from('grievances')
        .upsert(row, { onConflict: 'id' });

      if (upsertErr) {
        console.warn(`⚠️ Error upserting ${g.id}:`, upsertErr.message);
      } else {
        console.log(`✅ Upserted ${g.id} (${g.title})`);
      }
    }

    // Verify current count in Supabase
    const { data: finalRows } = await supabase
      .from('grievances')
      .select('id, title, department');
    console.log(`\n🎉 Verification complete. Supabase now has ${finalRows?.length} authoritative grievances:`);
    finalRows?.forEach((r, idx) => {
      console.log(`   ${idx + 1}. [${r.id}] ${r.department} — ${r.title}`);
    });

  } catch (err) {
    console.error('❌ Supabase sync error:', err.message);
  }

  console.log('\n🏁 Synchronization finished successfully.');
}

main().catch(console.error);
