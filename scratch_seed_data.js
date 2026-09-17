import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../../../OneDrive/Desktop/Jan_Sahayak/.env') });

const { Pool } = pg;
const connectionString = 'postgres://jan_sahayak_app:JanSahayak_Secure_DB_2026!@db.epnfavpqweeybzoyoexq.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000
});

async function main() {
  const client = await pool.connect();
  console.log('Connected to Supabase PostgreSQL!');

  try {
    // 1. Initial Grievances
    const grievances = [
      {
        id: 'DL-2026-W14-0892',
        citizen_id: 'a0000000-0000-0000-0000-000000000001',
        citizen_name: 'Aditya Verma',
        citizen_phone: '+91 98712-88210',
        title: 'Contaminated Drinking Water & Main Supply Pipe Leakage',
        description_raw: 'Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.',
        language_detected: 'Hinglish / Hindi (Confidence 98%)',
        category: 'Water Supply & Contamination',
        department: 'Delhi Jal Board (DJB)',
        officer_name: 'Er. Sanjay Sharma',
        officer_designation: 'Assistant Executive Engineer',
        location_ward: 'Ward 14 (Rohini Sector 14)',
        location_area: 'Pocket 2, Near Mother Dairy Booth',
        location_city: 'New Delhi',
        location_pincode: '110085',
        lng: 77.1265,
        lat: 28.7189,
        urgency: 'CRITICAL',
        urgency_score: 94,
        status: 'IN_PROGRESS',
        sla_deadline: '2026-09-20 18:00:00+00',
        sla_hours_left: 16,
        cluster_id: 'CL-W14-WATER-03',
        cluster_title: 'Ward 14 Sector 14 Main Pipeline Fracture Cluster',
        cluster_count: 18,
        incident_id: 'INC-2026-DEL-01',
        upvotes: 42,
        evidence: {
          hasPhoto: true,
          photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
          hasAudio: true,
          audioTranscript: 'Voice intake: Bhai pichle 3 din se hamare Sector 14 mein ganda paani aa raha hai...'
        },
        analysis: {
          category: 'Water Supply & Contamination',
          department: 'Delhi Jal Board (DJB)',
          urgency: 9,
          summary: 'Potable water supply line fracture with direct sewer cross-contamination near Mother Dairy.'
        },
        dna: {
          dnaId: 'DNA-W14-892',
          problem: 'water_contamination',
          infrastructure: '100mm Cast-Iron Feeder Main',
          affectedPopulation: '5,000 residents & school',
          normalizedDescription: 'Potable water contamination and supply pipeline fracture with odor'
        },
        timeline: [
          { stage: 'Submitted', time: 'Sep 16, 09:30 AM', detail: 'Complaint submitted via Voice-to-Grievance (Hinglish)', status: 'completed' },
          { stage: 'AI Triage & DNA Generated', time: 'Sep 16, 09:31 AM', detail: 'Autoclassified as Critical Biological Hazard, routed to DJB', status: 'completed' },
          { stage: 'Cluster Merged', time: 'Sep 16, 09:35 AM', detail: 'Merged into Cluster CL-W14-WATER-03 (18 citizen complaints linked)', status: 'completed' },
          { stage: 'Officer Assigned', time: 'Sep 16, 10:15 AM', detail: 'Assigned to AEE Sanjay Sharma; Rapid team mobilized', status: 'completed' },
          { stage: 'Field Repair', time: 'Sep 16, 02:40 PM', detail: 'Excavation and clamp installation currently active', status: 'in_progress' }
        ]
      },
      {
        id: 'DL-2026-W08-0419',
        citizen_id: 'a0000000-0000-0000-0000-000000000001',
        citizen_name: 'Pooja Malhotra',
        citizen_phone: '+91 98101-44321',
        title: 'Deep Road Cave-in / Dangerous Pothole Near Traffic Junction',
        description_raw: 'Moolchand flyover ke neeche Lajpat Nagar wali road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah. Accidents ho rahe hain bar bar!',
        language_detected: 'Hinglish (Confidence 97%)',
        category: 'Roads & Infrastructure',
        department: 'Public Works Department (PWD)',
        officer_name: 'Er. Rajesh K. Meena',
        officer_designation: 'Executive Engineer',
        location_ward: 'Ward 8 (Lajpat Nagar / Moolchand)',
        location_area: 'Ring Road, Moolchand Underpass Entry',
        location_city: 'New Delhi',
        location_pincode: '110024',
        lng: 77.2341,
        lat: 28.5684,
        urgency: 'HIGH',
        urgency_score: 88,
        status: 'ASSIGNED',
        sla_deadline: '2026-09-21 11:00:00+00',
        sla_hours_left: 38,
        cluster_id: 'CL-W08-ROAD-01',
        cluster_title: 'Moolchand Underpass Structural Road Surface Cavity',
        cluster_count: 7,
        incident_id: 'INC-2026-DEL-02',
        upvotes: 29,
        evidence: { hasPhoto: true, photoUrl: null, hasAudio: false },
        analysis: {
          category: 'Roads & Infrastructure',
          department: 'Public Works Department (PWD)',
          urgency: 8,
          summary: 'Subgrade washout causing dangerous road cavity at high-traffic intersection.'
        },
        dna: {
          dnaId: 'DNA-W08-419',
          problem: 'road_cave_in',
          infrastructure: 'Arterial Bituminous Carriageway',
          affectedPopulation: 'Daily Commuters & Motorcyclists',
          normalizedDescription: 'Deep road cave-in and hazardous pothole at arterial junction'
        },
        timeline: [
          { stage: 'Submitted', time: 'Sep 16, 11:20 AM', detail: 'Photo + location pin submitted by commuter', status: 'completed' },
          { stage: 'AI Triage & DNA Generated', time: 'Sep 16, 11:21 AM', detail: 'Computer vision confirmed severe cavity on arterial road', status: 'completed' },
          { stage: 'Assigned', time: 'Sep 16, 12:05 PM', detail: 'Assigned to PWD Division South-East', status: 'completed' }
        ]
      },
      {
        id: 'DL-2026-W22-0112',
        citizen_id: 'a0000000-0000-0000-0000-000000000001',
        citizen_name: 'Gurpreet Singh',
        citizen_phone: '+91 99532-88712',
        title: 'Overflowing Garbage Dump & Solid Waste Burning',
        description_raw: 'Sector 6 main market ke saamne open kude ka dher hai, 5 din se MCD ka dumper nahi aaya. Kal raat ko kisi ne aag laga di jisse bohot zyaada toxic smoke ho gaya hai.',
        language_detected: 'Hinglish (Confidence 99%)',
        category: 'Sanitation & Solid Waste',
        department: 'Municipal Corporation of Delhi (MCD)',
        officer_name: 'Dr. K. S. Tyagi',
        officer_designation: 'Sanitary Inspector',
        location_ward: 'Ward 22 (Mayur Vihar Ph-1)',
        location_area: 'Sector 6 DDA Market Complex',
        location_city: 'New Delhi',
        location_pincode: '110091',
        lng: 77.2982,
        lat: 28.6012,
        urgency: 'HIGH',
        urgency_score: 82,
        status: 'RESOLVED',
        sla_deadline: '2026-09-18 20:00:00+00',
        sla_hours_left: 0,
        cluster_id: 'CL-W22-SAN-09',
        cluster_title: 'Mayur Vihar Market Open Dump Site',
        cluster_count: 11,
        incident_id: 'INC-2026-DEL-03',
        upvotes: 35,
        evidence: { hasPhoto: true, photoUrl: null, hasAudio: false },
        analysis: {
          category: 'Sanitation & Solid Waste',
          department: 'Municipal Corporation of Delhi (MCD)',
          urgency: 8,
          summary: 'Open municipal solid waste accumulation and illegal night burning.'
        },
        dna: {
          dnaId: 'DNA-W22-112',
          problem: 'garbage_burning',
          infrastructure: 'Municipal Dhalao / Collection Point',
          affectedPopulation: 'Market Shoppers & Residents',
          normalizedDescription: 'Overflowing solid waste and open burning hazard'
        },
        resolution_notes: 'Two 12MT hydraulic compactor trucks deployed; site sanitized with lime powder.',
        timeline: [
          { stage: 'Submitted', time: 'Sep 15, 08:15 AM', detail: 'Citizen logged complaint with GPS location', status: 'completed' },
          { stage: 'Resolved & Closed', time: 'Sep 15, 03:00 PM', detail: 'Two 12MT trucks loaded; lime powder scrubbed', status: 'completed' }
        ]
      }
    ];

    for (const g of grievances) {
      await client.query(`
        INSERT INTO public.grievances (
          id, citizen_id, citizen_name, citizen_phone, title, description_raw,
          language_detected, category, department, officer_name, officer_designation,
          location_ward, location_area, location_city, location_pincode,
          geom, geog, urgency, urgency_score, status, sla_deadline, sla_hours_left,
          upvotes, cluster_id, cluster_title, cluster_count, incident_id,
          analysis, dna, evidence, timeline, resolution_notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          extensions.ST_SetSRID(extensions.ST_MakePoint($16, $17), 4326),
          extensions.ST_SetSRID(extensions.ST_MakePoint($16, $17), 4326)::extensions.geography,
          $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
          $28, $29, $30, $31, $32, NOW(), NOW()
        ) ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          timeline = EXCLUDED.timeline,
          resolution_notes = EXCLUDED.resolution_notes;
      `, [
        g.id, g.citizen_id, g.citizen_name, g.citizen_phone, g.title, g.description_raw,
        g.language_detected, g.category, g.department, g.officer_name, g.officer_designation,
        g.location_ward, g.location_area, g.location_city, g.location_pincode,
        g.lng, g.lat,
        g.urgency, g.urgency_score, g.status, g.sla_deadline, g.sla_hours_left,
        g.upvotes, g.cluster_id, g.cluster_title, g.cluster_count, g.incident_id,
        JSON.stringify(g.analysis), JSON.stringify(g.dna), JSON.stringify(g.evidence),
        JSON.stringify(g.timeline), g.resolution_notes || null
      ]);
      console.log(`✓ Seeded Grievance: ${g.id}`);
    }

    // 2. Initial Civic Incidents
    const incidents = [
      {
        id: 'INC-2026-DEL-01',
        title: 'Rohini Sector 14 Subsurface Water Line Fracture & Cavity Formation',
        stage: 'GROWING',
        severity: 'CRITICAL',
        urgency: 'HIGH',
        summary: 'Underground 100mm cast-iron supply pipe rupture has led to contaminated water intrusion and subgrade road erosion threatening carriageway stability.',
        lead_department: 'Delhi Jal Board (DJB)',
        participating_departments: ['Public Works Department (PWD)', 'Municipal Corporation of Delhi (MCD)'],
        affected_area: 'Ward 14 (Rohini Sector 14)',
        affected_population: '5,000 residents',
        complaint_count: 18,
        unique_citizens: 14,
        cluster_ids: ['CL-W14-WATER-03'],
        complaint_ids: ['DL-2026-W14-0892'],
        stage_velocity: '2.8x Acceleration',
        velocity_data: { complaintsPerHour: 3.2, riskScore: 88 },
        evidence: [
          { type: 'photo', url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80', description: 'Contaminated brown water flow in domestic tap' }
        ],
        root_cause: {
          likelyRootCause: 'Corrosion-induced shear failure along legacy cast-iron trunk pipe joint under traffic load vibrations.',
          confidence: 0.93,
          contributingFactors: ['High soil salinity', 'Heavy transit vehicles on secondary road', 'Lack of cathodic protection']
        },
        status: 'ACTIVE',
        verification_status: 'PENDING'
      }
    ];

    for (const inc of incidents) {
      await client.query(`
        INSERT INTO public.civic_incidents (
          id, title, stage, severity, urgency, summary, lead_department,
          participating_departments, affected_area, affected_population,
          complaint_count, unique_citizens, cluster_ids, complaint_ids,
          stage_velocity, velocity_data, evidence, root_cause,
          status, verification_status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, NOW(), NOW()
        ) ON CONFLICT (id) DO UPDATE SET
          stage = EXCLUDED.stage,
          complaint_count = EXCLUDED.complaint_count;
      `, [
        inc.id, inc.title, inc.stage, inc.severity, inc.urgency, inc.summary,
        inc.lead_department, JSON.stringify(inc.participating_departments),
        inc.affected_area, inc.affected_population, inc.complaint_count,
        inc.unique_citizens, JSON.stringify(inc.cluster_ids), JSON.stringify(inc.complaint_ids),
        inc.stage_velocity, JSON.stringify(inc.velocity_data), JSON.stringify(inc.evidence),
        JSON.stringify(inc.root_cause), inc.status, inc.verification_status
      ]);
      console.log(`✓ Seeded Incident: ${inc.id}`);
    }

    // 3. Initial Civic Memory
    const memories = [
      {
        incident_title: 'Sector 15 Pipeline Joint Displacement & Water Contamination',
        category: 'Water Supply & Contamination',
        department: 'Delhi Jal Board (DJB)',
        root_cause: 'Thermal contraction caused joint separation on old 150mm cast-iron supply feeder during winter cold snap.',
        resolution_applied: 'Excavated 1.8m trench, fitted stainless steel repair collar with EPDM rubber seal, pressure tested to 4.5 bar.',
        contractor: 'Delhi Jal Board Fast-Track Maintenance Unit 4',
        warranty_period: '24 Months',
        recurrence_rate: '1.2% over 3 years',
        cost_estimate: '₹38,500'
      },
      {
        incident_title: 'Pocket 3 Subgrade Cavity & Pavement Sinkhole Repair',
        category: 'Roads & Infrastructure',
        department: 'Public Works Department (PWD)',
        root_cause: 'Unconsolidated backfill around stormwater culvert washed out after monsoon overflow, eroding road base.',
        resolution_applied: 'Poured lean concrete mix (M15), compacted 250mm crushed stone aggregate base, laid 40mm bituminous concrete wearing coat.',
        contractor: 'National Highway & Urban PWD Division 2',
        warranty_period: '36 Months',
        recurrence_rate: '2.5% over 5 years',
        cost_estimate: '₹1,24,000'
      }
    ];

    for (const mem of memories) {
      await client.query(`
        INSERT INTO public.civic_memory (
          incident_title, category, department, root_cause, resolution_applied,
          contractor, warranty_period, recurrence_rate, cost_estimate, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT DO NOTHING;
      `, [
        mem.incident_title, mem.category, mem.department, mem.root_cause,
        mem.resolution_applied, mem.contractor, mem.warranty_period,
        mem.recurrence_rate, mem.cost_estimate
      ]);
      console.log(`✓ Seeded Civic Memory: ${mem.incident_title}`);
    }

    console.log('Seeding completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
