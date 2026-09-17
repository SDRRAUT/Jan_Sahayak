import pg from 'pg';

const { Pool } = pg;

// PostgreSQL connection string for Supabase
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.PG_CONNECTION_STRING ||
  'postgres://jan_sahayak_app:JanSahayak_Secure_DB_2026!@db.epnfavpqweeybzoyoexq.supabase.co:5432/postgres';

let pool = null;
let isConnected = false;

export function getPool() {
  if (!connectionString) return null;
  if (!pool) {
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });

    pool.on('error', (err) => {
      console.error('[Supabase PostgreSQL] Idle client error:', err.message);
    });
  }
  return pool;
}

export async function checkPostgresConnection() {
  const p = getPool();
  if (!p) return false;
  try {
    const client = await p.connect();
    const res = await client.query('SELECT current_user, current_database(), version();');
    client.release();
    isConnected = true;
    console.log(`🐘 Connected to Supabase PostgreSQL: user=${res.rows[0].current_user}, db=${res.rows[0].current_database}`);
    return true;
  } catch (err) {
    console.warn('⚠️ Supabase PostgreSQL connection failed:', err.message);
    isConnected = false;
    return false;
  }
}

export function isPostgresActive() {
  return Boolean(connectionString && isConnected);
}

/**
 * High-Performance Supabase Data Access Layer
 */
export const postgresDB = {
  async query(text, params) {
    const p = getPool();
    if (!p) return null;
    return p.query(text, params);
  },

  // --- Grievances (Complaints) ---
  async getAllGrievances() {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query(`
        SELECT 
          g.*,
          extensions.ST_Y(g.geom::extensions.geometry) AS lat_val,
          extensions.ST_X(g.geom::extensions.geometry) AS lng_val
        FROM public.grievances g
        ORDER BY g.created_at DESC
      `);

      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        descriptionRaw: r.description_raw,
        languageDetected: r.language_detected,
        category: r.category,
        department: r.department,
        officerName: r.officer_name,
        officerDesignation: r.officer_designation,
        location: {
          ward: r.location_ward,
          area: r.location_area,
          city: r.location_city || 'New Delhi',
          pincode: r.location_pincode,
          lat: r.lat_val || (r.location_ward?.includes('14') ? 28.7189 : 28.6139),
          lng: r.lng_val || (r.location_ward?.includes('14') ? 77.1265 : 77.2090)
        },
        urgency: r.urgency,
        urgencyScore: r.urgency_score,
        status: r.status,
        createdAt: r.created_at ? new Date(r.created_at).toLocaleString() : new Date().toLocaleString(),
        timestamp: r.created_at || new Date().toISOString(),
        slaDeadline: r.sla_deadline ? new Date(r.sla_deadline).toLocaleString() : '24 Hours',
        slaHoursLeft: r.sla_hours_left ?? 24,
        upvotes: r.upvotes || 1,
        citizenId: r.citizen_id,
        citizenName: r.citizen_name,
        citizenPhone: r.citizen_phone,
        evidence: r.evidence || {},
        dna: r.dna || {},
        analysis: r.analysis || {},
        clusterId: r.cluster_id,
        clusterTitle: r.cluster_title,
        clusterCount: r.cluster_count || 1,
        incidentId: r.incident_id,
        resolutionNotes: r.resolution_notes,
        resolutionPhotoUrl: r.resolution_photo_url,
        citizenVerification: r.citizen_verification,
        timeline: r.timeline || []
      }));
    } catch (err) {
      console.error('PostgreSQL getAllGrievances error:', err.message);
      return [];
    }
  },

  async getGrievanceById(id) {
    const p = getPool();
    if (!p) return null;
    try {
      const res = await p.query(`
        SELECT 
          g.*,
          extensions.ST_Y(g.geom::extensions.geometry) AS lat_val,
          extensions.ST_X(g.geom::extensions.geometry) AS lng_val
        FROM public.grievances g
        WHERE g.id = $1
      `, [id]);

      if (!res.rows.length) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        descriptionRaw: r.description_raw,
        languageDetected: r.language_detected,
        category: r.category,
        department: r.department,
        officerName: r.officer_name,
        officerDesignation: r.officer_designation,
        location: {
          ward: r.location_ward,
          area: r.location_area,
          city: r.location_city || 'New Delhi',
          pincode: r.location_pincode,
          lat: r.lat_val,
          lng: r.lng_val
        },
        urgency: r.urgency,
        urgencyScore: r.urgency_score,
        status: r.status,
        createdAt: r.created_at,
        timestamp: r.created_at,
        slaDeadline: r.sla_deadline,
        slaHoursLeft: r.sla_hours_left,
        upvotes: r.upvotes,
        citizenId: r.citizen_id,
        citizenName: r.citizen_name,
        citizenPhone: r.citizen_phone,
        evidence: r.evidence || {},
        dna: r.dna || {},
        analysis: r.analysis || {},
        clusterId: r.cluster_id,
        clusterTitle: r.cluster_title,
        clusterCount: r.cluster_count,
        incidentId: r.incident_id,
        resolutionNotes: r.resolution_notes,
        resolutionPhotoUrl: r.resolution_photo_url,
        citizenVerification: r.citizen_verification,
        timeline: r.timeline || []
      };
    } catch (err) {
      console.error('PostgreSQL getGrievanceById error:', err.message);
      return null;
    }
  },

  async saveGrievance(g) {
    const p = getPool();
    if (!p) return false;
    try {
      const lat = parseFloat(g.location?.lat) || 28.7185;
      const lng = parseFloat(g.location?.lng) || 77.1250;
      const citizenId = g.citizenId && g.citizenId.startsWith('a0000000-') ? g.citizenId : 'a0000000-0000-0000-0000-000000000001';

      await p.query(`
        INSERT INTO public.grievances (
          id, citizen_id, citizen_name, citizen_phone, title, description_raw,
          language_detected, category, department, officer_name, officer_designation,
          location_ward, location_area, location_city, location_pincode,
          geom, geog, urgency, urgency_score, status, sla_deadline, sla_hours_left,
          upvotes, cluster_id, cluster_title, cluster_count, incident_id,
          analysis, dna, evidence, timeline, resolution_notes, resolution_photo_url,
          citizen_verification, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          extensions.ST_SetSRID(extensions.ST_MakePoint($16, $17), 4326),
          extensions.ST_SetSRID(extensions.ST_MakePoint($16, $17), 4326)::extensions.geography,
          $18, $19, $20, NOW() + INTERVAL '24 hours', $21, $22, $23, $24, $25, $26,
          $27, $28, $29, $30, $31, $32, $33, NOW(), NOW()
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          department = EXCLUDED.department,
          officer_name = EXCLUDED.officer_name,
          urgency = EXCLUDED.urgency,
          urgency_score = EXCLUDED.urgency_score,
          status = EXCLUDED.status,
          cluster_id = EXCLUDED.cluster_id,
          cluster_title = EXCLUDED.cluster_title,
          cluster_count = EXCLUDED.cluster_count,
          incident_id = EXCLUDED.incident_id,
          analysis = EXCLUDED.analysis,
          dna = EXCLUDED.dna,
          evidence = EXCLUDED.evidence,
          timeline = EXCLUDED.timeline,
          resolution_notes = EXCLUDED.resolution_notes,
          resolution_photo_url = EXCLUDED.resolution_photo_url,
          citizen_verification = EXCLUDED.citizen_verification,
          updated_at = NOW();
      `, [
        g.id,
        citizenId,
        g.citizenName || 'Aditya Verma',
        g.citizenPhone || '+91 98712-88210',
        g.title,
        g.descriptionRaw || g.description || '',
        g.languageDetected || 'English / Hinglish',
        g.category || 'General Civic Infrastructure',
        g.department || 'Municipal Corporation of Delhi (MCD)',
        g.officerName || 'Er. Sanjay Sharma',
        g.officerDesignation || 'Assistant Executive Engineer',
        g.location?.ward || 'Ward 14 (Rohini Sector 14)',
        g.location?.area || 'Local Area',
        g.location?.city || 'New Delhi',
        g.location?.pincode || '110085',
        lng,
        lat,
        g.urgency || 'HIGH',
        g.urgencyScore || 80,
        g.status || 'SUBMITTED',
        g.slaHoursLeft || 24,
        g.upvotes || 1,
        g.clusterId || null,
        g.clusterTitle || null,
        g.clusterCount || 1,
        g.incidentId || null,
        JSON.stringify(g.analysis || {}),
        JSON.stringify(g.dna || {}),
        JSON.stringify(g.evidence || {}),
        JSON.stringify(g.timeline || []),
        g.resolutionNotes || null,
        g.resolutionPhotoUrl || null,
        JSON.stringify(g.citizenVerification || {})
      ]);

      // If DNA embedding is available, persist to complaint_dna
      if (g.dna?.embedding && Array.isArray(g.dna.embedding)) {
        await p.query(`
          INSERT INTO public.complaint_dna (
            complaint_id, problem_type, category, infrastructure, affected_population,
            severity, urgency_score, normalized_description, embedding
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::extensions.vector(768))
          ON CONFLICT (id) DO NOTHING;
        `, [
          g.id,
          g.dna.problem || g.category,
          g.category,
          g.dna.infrastructure || 'Municipal Infrastructure',
          g.dna.affectedPopulation || 'Local Residents',
          g.urgency,
          g.urgencyScore || 80,
          g.dna.normalizedDescription || g.descriptionRaw,
          JSON.stringify(g.dna.embedding)
        ]);
      }

      return true;
    } catch (err) {
      console.error('PostgreSQL saveGrievance error:', err.message);
      return false;
    }
  },

  // --- Civic Incidents ---
  async getAllIncidents() {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query('SELECT * FROM public.civic_incidents ORDER BY updated_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        stage: r.stage,
        severity: r.severity,
        urgency: r.urgency,
        summary: r.summary,
        leadDepartment: r.lead_department,
        participatingDepartments: r.participating_departments || [],
        affectedArea: r.affected_area,
        affectedPopulation: r.affected_population,
        complaintCount: r.complaint_count || 1,
        uniqueCitizens: r.unique_citizens || 1,
        clusterIds: r.cluster_ids || [],
        complaintIds: r.complaint_ids || [],
        stageVelocity: r.stage_velocity,
        velocityData: r.velocity_data || {},
        evidence: r.evidence || [],
        rootCause: r.root_cause || {},
        simulations: r.simulations || [],
        crossDeptCoordination: r.cross_dept_coordination || {},
        civicMemory: r.civic_memory || {},
        humanDecisions: r.human_decisions || [],
        status: r.status,
        verificationStatus: r.verification_status,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));
    } catch (err) {
      console.error('PostgreSQL getAllIncidents error:', err.message);
      return [];
    }
  },

  async getIncidentById(id) {
    const p = getPool();
    if (!p) return null;
    try {
      const res = await p.query('SELECT * FROM public.civic_incidents WHERE id = $1', [id]);
      if (!res.rows.length) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        stage: r.stage,
        severity: r.severity,
        urgency: r.urgency,
        summary: r.summary,
        leadDepartment: r.lead_department,
        participatingDepartments: r.participating_departments || [],
        affectedArea: r.affected_area,
        affectedPopulation: r.affected_population,
        complaintCount: r.complaint_count,
        uniqueCitizens: r.unique_citizens,
        clusterIds: r.cluster_ids || [],
        complaintIds: r.complaint_ids || [],
        stageVelocity: r.stage_velocity,
        velocityData: r.velocity_data || {},
        evidence: r.evidence || [],
        rootCause: r.root_cause || {},
        simulations: r.simulations || [],
        crossDeptCoordination: r.cross_dept_coordination || {},
        civicMemory: r.civic_memory || {},
        humanDecisions: r.human_decisions || [],
        status: r.status,
        verificationStatus: r.verification_status,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      };
    } catch (err) {
      console.error('PostgreSQL getIncidentById error:', err.message);
      return null;
    }
  },

  async saveIncident(inc) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query(`
        INSERT INTO public.civic_incidents (
          id, title, stage, severity, urgency, summary, lead_department,
          participating_departments, affected_area, affected_population,
          complaint_count, unique_citizens, cluster_ids, complaint_ids,
          stage_velocity, velocity_data, evidence, root_cause, simulations,
          cross_dept_coordination, civic_memory, human_decisions,
          status, verification_status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW(), NOW()
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          stage = EXCLUDED.stage,
          severity = EXCLUDED.severity,
          urgency = EXCLUDED.urgency,
          summary = EXCLUDED.summary,
          lead_department = EXCLUDED.lead_department,
          participating_departments = EXCLUDED.participating_departments,
          affected_area = EXCLUDED.affected_area,
          affected_population = EXCLUDED.affected_population,
          complaint_count = EXCLUDED.complaint_count,
          unique_citizens = EXCLUDED.unique_citizens,
          cluster_ids = EXCLUDED.cluster_ids,
          complaint_ids = EXCLUDED.complaint_ids,
          stage_velocity = EXCLUDED.stage_velocity,
          velocity_data = EXCLUDED.velocity_data,
          evidence = EXCLUDED.evidence,
          root_cause = EXCLUDED.root_cause,
          simulations = EXCLUDED.simulations,
          cross_dept_coordination = EXCLUDED.cross_dept_coordination,
          civic_memory = EXCLUDED.civic_memory,
          human_decisions = EXCLUDED.human_decisions,
          status = EXCLUDED.status,
          verification_status = EXCLUDED.verification_status,
          updated_at = NOW();
      `, [
        inc.id, inc.title, inc.stage || 'EMERGING', inc.severity || 'HIGH', inc.urgency || 'HIGH',
        inc.summary, inc.leadDepartment || 'Delhi Jal Board (DJB)',
        JSON.stringify(inc.participatingDepartments || []),
        inc.affectedArea || 'Ward 14 (Rohini Sector 14)',
        inc.affectedPopulation || '5,000 residents',
        inc.complaintCount || 1, inc.uniqueCitizens || 1,
        JSON.stringify(inc.clusterIds || []),
        JSON.stringify(inc.complaintIds || []),
        inc.stageVelocity || '2.8x Acceleration',
        JSON.stringify(inc.velocityData || {}),
        JSON.stringify(inc.evidence || []),
        JSON.stringify(inc.rootCause || {}),
        JSON.stringify(inc.simulations || []),
        JSON.stringify(inc.crossDeptCoordination || {}),
        JSON.stringify(inc.civicMemory || {}),
        JSON.stringify(inc.humanDecisions || []),
        inc.status || 'ACTIVE',
        inc.verificationStatus || 'PENDING'
      ]);
      return true;
    } catch (err) {
      console.error('PostgreSQL saveIncident error:', err.message);
      return false;
    }
  },

  // --- Civic Signals ---
  async getAllSignals() {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query('SELECT * FROM public.civic_signals ORDER BY created_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        incidentId: r.incident_id,
        citizenName: r.citizen_name,
        ward: r.ward,
        channel: r.channel,
        rawInput: r.raw_input,
        translatedText: r.translated_text,
        category: r.category,
        inferredAsset: r.inferred_asset,
        hasPhoto: r.has_photo,
        photoUrl: r.photo_url,
        status: r.status,
        confidence: r.confidence,
        timestamp: r.created_at
      }));
    } catch (err) {
      console.error('PostgreSQL getAllSignals error:', err.message);
      return [];
    }
  },

  async saveSignal(sig) {
    const p = getPool();
    if (!p) return false;
    try {
      const lat = parseFloat(sig.lat) || 28.7180;
      const lng = parseFloat(sig.lng) || 77.1250;
      await p.query(`
        INSERT INTO public.civic_signals (
          id, incident_id, citizen_name, ward, channel, raw_input,
          translated_text, category, inferred_asset, has_photo, photo_url,
          geom, geog, status, confidence, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          extensions.ST_SetSRID(extensions.ST_MakePoint($12, $13), 4326),
          extensions.ST_SetSRID(extensions.ST_MakePoint($12, $13), 4326)::extensions.geography,
          $14, $15, NOW()
        ) ON CONFLICT (id) DO NOTHING;
      `, [
        sig.id, sig.incidentId, sig.citizenName, sig.ward, sig.channel,
        sig.rawInput, sig.translatedText, sig.category, sig.inferredAsset,
        sig.hasPhoto || false, sig.photoUrl || null, lng, lat,
        sig.status || 'CLUSTERED', sig.confidence || 'HIGH'
      ]);
      return true;
    } catch (err) {
      console.error('PostgreSQL saveSignal error:', err.message);
      return false;
    }
  },

  // --- Notifications ---
  async getNotifications(userId, userRole) {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query(`
        SELECT * FROM public.notifications 
        WHERE user_id = $1 OR user_role = $2 OR user_role = 'all'
        ORDER BY created_at DESC 
        LIMIT 50
      `, [userId, userRole]);

      return res.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        userRole: r.user_role,
        title: r.title,
        message: r.message,
        grievanceId: r.grievance_id,
        link: r.link,
        type: r.type,
        read: r.read,
        createdAt: r.created_at ? new Date(r.created_at).toLocaleTimeString() : 'Just now',
        timestamp: r.created_at
      }));
    } catch (err) {
      console.error('PostgreSQL getNotifications error:', err.message);
      return [];
    }
  },

  async saveNotification(n) {
    const p = getPool();
    if (!p) return false;
    try {
      const targetUserId = (n.userId && n.userId.startsWith('a0000000-')) ? n.userId : 'a0000000-0000-0000-0000-000000000001';
      await p.query(`
        INSERT INTO public.notifications (user_id, user_role, title, message, grievance_id, link, type, read, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [targetUserId, n.userRole, n.title, n.message, n.grievanceId, n.link, n.type || 'GENERAL', n.read || false]);
      return true;
    } catch (err) {
      console.error('PostgreSQL saveNotification error:', err.message);
      return false;
    }
  },

  async markNotificationRead(id) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query('UPDATE public.notifications SET read = true WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error('PostgreSQL markNotificationRead error:', err.message);
      return false;
    }
  },

  // --- Audit Logs ---
  async logAuditEvent(actor, action, targetId, details, metadata = {}) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query(`
        INSERT INTO public.audit_logs (actor_name, actor_role, action, target_id, details, metadata, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [actor || 'System AI Engine', 'SYSTEM', action, targetId, details, JSON.stringify(metadata)]);
      return true;
    } catch (err) {
      console.error('PostgreSQL logAuditEvent error:', err.message);
      return false;
    }
  },

  async getAuditLogs(limit = 100) {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query('SELECT * FROM public.audit_logs ORDER BY created_at DESC LIMIT $1', [limit]);
      return res.rows.map(r => ({
        id: r.id,
        timestamp: new Date(r.created_at).toLocaleString(),
        actor: r.actor_name,
        action: r.action,
        targetId: r.target_id,
        details: r.details,
        metadata: r.metadata
      }));
    } catch (err) {
      console.error('PostgreSQL getAuditLogs error:', err.message);
      return [];
    }
  },

  // --- Field Actions ---
  async recordFieldAction({ incidentId, grievanceId, officerId, officerName, actionType, status, notes, evidenceUrl }) {
    const p = getPool();
    if (!p) return false;
    try {
      let validOfficerId = null;
      if (officerId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(officerId)) {
        validOfficerId = officerId;
      }
      try {
        await p.query(`
          INSERT INTO public.field_actions (
            incident_id, grievance_id, officer_id, officer_name, action_type, status, notes, evidence_url, started_at, completed_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '2 hours', NOW())
        `, [incidentId || null, grievanceId || null, validOfficerId, officerName || 'Field Officer', actionType || 'REPAIR', status || 'COMPLETED', notes || '', evidenceUrl || null]);
        return true;
      } catch (fkErr) {
        if (validOfficerId && fkErr.code === '23503') {
          await p.query(`
            INSERT INTO public.field_actions (
              incident_id, grievance_id, officer_id, officer_name, action_type, status, notes, evidence_url, started_at, completed_at
            ) VALUES ($1, $2, null, $3, $4, $5, $6, $7, NOW() - INTERVAL '2 hours', NOW())
          `, [incidentId || null, grievanceId || null, officerName || 'Field Officer', actionType || 'REPAIR', status || 'COMPLETED', notes || '', evidenceUrl || null]);
          return true;
        }
        throw fkErr;
      }
    } catch (err) {
      console.error('PostgreSQL recordFieldAction error:', err.message);
      return false;
    }
  },

  // --- Status Transitions ---
  async recordStatusTransition({ incidentId, fromStatus, toStatus, reason, trigger, actorId, actorName, actorRole }) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query(`
        INSERT INTO public.incident_status_history (
          incident_id, from_status, to_status, reason, trigger, actor_id, actor_name, actor_role, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [incidentId, fromStatus, toStatus, reason || `Transitioned to ${toStatus}`, trigger || 'OPERATIONAL_ACTION', actorId || null, actorName || 'Authority', actorRole || 'OFFICER']);
      return true;
    } catch (err) {
      console.error('PostgreSQL recordStatusTransition error:', err.message);
      return false;
    }
  },

  // --- Verification Records ---
  async recordVerification({ grievanceId, incidentId, citizenId, status, feedback, rating, photoUrl }) {
    const p = getPool();
    if (!p) return false;
    try {
      let normalizedStatus = 'PENDING';
      const upperStatus = (status || '').toUpperCase();
      if (['CONFIRMED', 'VERIFIED_SATISFIED', 'SATISFIED', 'VERIFIED', 'RESOLVED_CONFIRMED'].includes(upperStatus)) {
        normalizedStatus = 'CONFIRMED';
      } else if (['DISPUTED', 'DISPUTE_REOPENED', 'REOPENED'].includes(upperStatus)) {
        normalizedStatus = 'DISPUTED';
      }

      let validCitizenId = null;
      if (citizenId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(citizenId)) {
        validCitizenId = citizenId;
      }

      try {
        await p.query(`
          INSERT INTO public.verification_records (
            grievance_id, incident_id, citizen_id, status, feedback, rating, photo_url, verified_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `, [grievanceId || null, incidentId || null, validCitizenId, normalizedStatus, feedback || '', rating || 5, photoUrl || null]);
        return true;
      } catch (fkErr) {
        if (validCitizenId && fkErr.code === '23503') {
          await p.query(`
            INSERT INTO public.verification_records (
              grievance_id, incident_id, citizen_id, status, feedback, rating, photo_url, verified_at, created_at
            ) VALUES ($1, $2, null, $3, $4, $5, $6, NOW(), NOW())
          `, [grievanceId || null, incidentId || null, normalizedStatus, feedback || '', rating || 5, photoUrl || null]);
          return true;
        }
        throw fkErr;
      }
    } catch (err) {
      console.error('PostgreSQL recordVerification error:', err.message);
      return false;
    }
  },

  // --- Evidence Records ---
  async saveEvidenceRecord({ complaintId, incidentId, uploadedBy, type, storagePath, fileUrl, mimeType, metadata }) {
    const p = getPool();
    if (!p) return false;
    try {
      let validUserId = null;
      if (uploadedBy && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uploadedBy)) {
        validUserId = uploadedBy;
      }

      let normalizedType = 'PHOTO';
      const upperType = (type || '').toUpperCase();
      if (['PHOTO', 'IMAGE', 'RESOLUTION_PHOTO'].some(t => upperType.includes(t))) normalizedType = 'PHOTO';
      else if (upperType.includes('VIDEO')) normalizedType = 'VIDEO';
      else if (upperType.includes('AUDIO') || upperType.includes('VOICE')) normalizedType = 'AUDIO';
      else if (upperType.includes('DOC') || upperType.includes('PDF')) normalizedType = 'DOCUMENT';

      try {
        await p.query(`
          INSERT INTO public.evidence_records (
            complaint_id, incident_id, uploaded_by, type, storage_path, file_url, mime_type, metadata, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `, [complaintId || null, incidentId || null, validUserId, normalizedType, storagePath || '', fileUrl || '', mimeType || 'image/jpeg', JSON.stringify(metadata || {})]);
        return true;
      } catch (fkErr) {
        if (validUserId && fkErr.code === '23503') {
          await p.query(`
            INSERT INTO public.evidence_records (
              complaint_id, incident_id, uploaded_by, type, storage_path, file_url, mime_type, metadata, created_at
            ) VALUES ($1, $2, null, $3, $4, $5, $6, $7, NOW())
          `, [complaintId || null, incidentId || null, normalizedType, storagePath || '', fileUrl || '', mimeType || 'image/jpeg', JSON.stringify(metadata || {})]);
          return true;
        }
        throw fkErr;
      }
    } catch (err) {
      console.error('PostgreSQL saveEvidenceRecord error:', err.message);
      return false;
    }
  },

  // --- Authority Assignments ---
  async recordAuthorityAssignment({ incidentId, departmentId, officerId, reason, status, assignedBy }) {
    const p = getPool();
    if (!p) return false;
    try {
      const validOfficerId = (officerId && officerId.length === 36) ? officerId : 'b0000000-0000-0000-0000-000000000001';
      await p.query(`
        INSERT INTO public.authority_assignments (
          incident_id, department_id, officer_id, reason, status, assigned_at, assigned_by
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      `, [incidentId || null, departmentId, validOfficerId, reason || 'Department allocation', status || 'ASSIGNED', assignedBy || 'System AI Engine']);
      return true;
    } catch (err) {
      console.error('PostgreSQL recordAuthorityAssignment error:', err.message);
      return false;
    }
  },

  // --- Civic Memory ---
  async saveCivicMemory({ incidentTitle, category, department, rootCause, resolutionApplied, contractor, warrantyPeriod, recurrenceRate, costEstimate, embedding }) {
    const p = getPool();
    if (!p) return false;
    try {
      if (embedding && Array.isArray(embedding)) {
        await p.query(`
          INSERT INTO public.civic_memory (
            incident_title, category, department, root_cause, resolution_applied,
            contractor, warranty_period, recurrence_rate, cost_estimate, embedding, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::extensions.vector(768), NOW())
        `, [incidentTitle, category, department, rootCause, resolutionApplied, contractor, warrantyPeriod, recurrenceRate, costEstimate, JSON.stringify(embedding)]);
      } else {
        await p.query(`
          INSERT INTO public.civic_memory (
            incident_title, category, department, root_cause, resolution_applied,
            contractor, warranty_period, recurrence_rate, cost_estimate, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `, [incidentTitle, category, department, rootCause, resolutionApplied, contractor, warrantyPeriod, recurrenceRate, costEstimate]);
      }
      return true;
    } catch (err) {
      console.error('PostgreSQL saveCivicMemory error:', err.message);
      return false;
    }
  },

  // --- Spatial & Vector Queries ---
  async searchNearbyGrievances(lat, lng, radiusMeters = 1500) {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query(`
        SELECT * FROM public.search_nearby_complaints($1, $2, $3)
      `, [lat, lng, radiusMeters]);
      return res.rows;
    } catch (err) {
      console.error('PostgreSQL searchNearbyGrievances error:', err.message);
      return [];
    }
  },

  async searchSimilarComplaints(embeddingArray, matchThreshold = 0.70, matchCount = 10) {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query(`
        SELECT * FROM public.search_similar_complaints($1::extensions.vector(768), $2, $3)
      `, [JSON.stringify(embeddingArray), matchThreshold, matchCount]);
      return res.rows;
    } catch (err) {
      console.error('PostgreSQL searchSimilarComplaints error:', err.message);
      return [];
    }
  },

  async searchCivicMemory(embeddingArray, matchThreshold = 0.65, matchCount = 5) {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query(`
        SELECT * FROM public.search_civic_memory($1::extensions.vector(768), $2, $3)
      `, [JSON.stringify(embeddingArray), matchThreshold, matchCount]);
      return res.rows;
    } catch (err) {
      console.error('PostgreSQL searchCivicMemory error:', err.message);
      return [];
    }
  },

  // --- Profiles & Departments ---
  async getCivicProfile(userId) {
    const p = getPool();
    if (!p) return null;
    try {
      const res = await p.query('SELECT * FROM public.civic_profiles WHERE id = $1', [userId]);
      return res.rows[0] || null;
    } catch (err) {
      console.error('PostgreSQL getCivicProfile error:', err.message);
      return null;
    }
  },

  async getDepartments() {
    const p = getPool();
    if (!p) return [];
    try {
      const res = await p.query('SELECT * FROM public.civic_departments ORDER BY name ASC');
      return res.rows;
    } catch (err) {
      console.error('PostgreSQL getDepartments error:', err.message);
      return [];
    }
  },

  // --- Audit Logging ---
  async logAuditEvent(actorName, action, targetId, details, metadata = {}) {
    const p = getPool();
    if (!p) return false;
    try {
      const role = metadata?.role || 'SYSTEM';
      await p.query(`
        INSERT INTO public.audit_logs (
          actor_name, actor_role, action, target_id, details, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [actorName || 'System AI Engine', role, action, targetId, details, JSON.stringify(metadata)]);
      return true;
    } catch (err) {
      console.warn('[PostgreSQL] logAuditEvent:', err.message);
      return false;
    }
  },

  // --- Notifications ---
  async saveNotification({ userId, userRole, title, message, grievanceId, link, type }) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query(`
        INSERT INTO public.notifications (
          user_id, user_role, title, message, grievance_id, link, type, read, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW())
      `, [userId || null, userRole, title, message, grievanceId || null, link || null, type]);
      return true;
    } catch (err) {
      console.warn('[PostgreSQL] saveNotification:', err.message);
      return false;
    }
  },

  // --- Update Grievance Status ---
  async updateGrievanceStatus(grievanceId, updates) {
    const p = getPool();
    if (!p) return false;
    try {
      const setClauses = [];
      const values = [];
      let idx = 1;

      if (updates.status !== undefined) {
        setClauses.push(`status = $${idx++}`);
        values.push(updates.status);
      }
      if (updates.resolutionNotes !== undefined) {
        setClauses.push(`resolution_notes = $${idx++}`);
        values.push(updates.resolutionNotes);
      }
      if (updates.resolutionPhotoUrl !== undefined) {
        setClauses.push(`resolution_photo_url = $${idx++}`);
        values.push(updates.resolutionPhotoUrl);
      }
      if (updates.assignedTo !== undefined) {
        // officer_id is the DB column for assigned officer
        setClauses.push(`officer_id = $${idx++}`);
        values.push(updates.assignedTo);
      }

      if (setClauses.length === 0) return false;

      setClauses.push(`updated_at = NOW()`);
      values.push(grievanceId);

      await p.query(
        `UPDATE public.grievances SET ${setClauses.join(', ')} WHERE id = $${idx}`,
        values
      );
      return true;
    } catch (err) {
      console.error('[PostgreSQL] updateGrievanceStatus error:', err.message);
      return false;
    }
  },

  // --- Add Civic Memory from Resolved Complaint ---
  async addCivicMemoryFromResolution({ grievanceId, title, category, department, resolutionNotes, officerName, embedding }) {
    const p = getPool();
    if (!p) return false;
    try {
      if (embedding && Array.isArray(embedding)) {
        await p.query(`
          INSERT INTO public.civic_memory (
            incident_title, category, department, root_cause, resolution_applied,
            contractor, recurrence_rate, cost_estimate, embedding, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::extensions.vector(768), NOW())
        `, [
          title, category, department,
          'Citizen-reported complaint — AI-analyzed root cause',
          resolutionNotes || 'Field resolution completed',
          officerName || 'Municipal Field Officer',
          'LOW', 0,
          JSON.stringify(embedding)
        ]);
      } else {
        await p.query(`
          INSERT INTO public.civic_memory (
            incident_title, category, department, root_cause, resolution_applied,
            contractor, recurrence_rate, cost_estimate, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        `, [
          title, category, department,
          'Citizen-reported complaint — AI-analyzed root cause',
          resolutionNotes || 'Field resolution completed',
          officerName || 'Municipal Field Officer',
          'LOW', 0
        ]);
      }
      console.log(`✅ Civic memory recorded for grievance: ${grievanceId}`);
      return true;
    } catch (err) {
      console.error('[PostgreSQL] addCivicMemoryFromResolution error:', err.message);
      return false;
    }
  },

  // --- Notifications: Fetch from Supabase ---
  async getNotifications(userId, userRole) {
    const p = getPool();
    if (!p) return null;
    try {
      const isUUID = typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      let result;
      if (userRole === 'super_admin') {
        result = await p.query(`
          SELECT * FROM public.notifications
          ORDER BY created_at DESC
          LIMIT 100
        `);
      } else if (userRole === 'civic_officer' || userRole === 'officer' || userRole === 'dept_admin') {
        if (isUUID) {
          result = await p.query(`
            SELECT * FROM public.notifications
            WHERE user_id = $1
               OR user_role IN ('officer', 'dept_admin', 'civic_officer')
            ORDER BY created_at DESC
            LIMIT 50
          `, [userId]);
        } else {
          result = await p.query(`
            SELECT * FROM public.notifications
            WHERE user_role IN ('officer', 'dept_admin', 'civic_officer', 'all')
            ORDER BY created_at DESC
            LIMIT 50
          `);
        }
      } else {
        if (isUUID) {
          result = await p.query(`
            SELECT * FROM public.notifications
            WHERE user_id = $1 OR user_role = 'citizen'
            ORDER BY created_at DESC
            LIMIT 50
          `, [userId]);
        } else {
          result = await p.query(`
            SELECT * FROM public.notifications
            WHERE user_role IN ('citizen', 'all')
            ORDER BY created_at DESC
            LIMIT 50
          `);
        }
      }
      return result.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        userRole: r.user_role,
        title: r.title,
        message: r.message,
        grievanceId: r.grievance_id,
        link: r.link,
        type: r.type,
        read: r.read,
        createdAt: r.created_at,
        timestamp: r.created_at
      }));
    } catch (err) {
      console.error('[PostgreSQL] getNotifications error:', err.message);
      return null;
    }
  },

  // --- Officer Stats: Live counts from Supabase ---
  async getOfficerStats(officerId) {
    const p = getPool();
    if (!p) return null;
    try {
      const result = await p.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status NOT IN ('RESOLVED','CLOSED')) AS active,
          COUNT(*) FILTER (WHERE status IN ('RESOLVED','CLOSED')) AS resolved,
          COUNT(*) FILTER (WHERE urgency = 'CRITICAL' AND status NOT IN ('RESOLVED','CLOSED')) AS critical,
          COUNT(*) FILTER (WHERE status = 'DISPUTE_REOPENED') AS disputed,
          COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') AS in_progress,
          COUNT(*) FILTER (WHERE status = 'ESCALATED') AS escalated,
          COUNT(*) FILTER (WHERE sla_hours_left <= 0 AND status NOT IN ('RESOLVED','CLOSED')) AS sla_overdue,
          COUNT(*) FILTER (WHERE sla_hours_left > 0 AND sla_hours_left <= 6 AND status NOT IN ('RESOLVED','CLOSED')) AS sla_at_risk
        FROM public.grievances
      `);
      const row = result.rows[0] || {};
      return {
        total: parseInt(row.total) || 0,
        active: parseInt(row.active) || 0,
        resolved: parseInt(row.resolved) || 0,
        critical: parseInt(row.critical) || 0,
        disputed: parseInt(row.disputed) || 0,
        inProgress: parseInt(row.in_progress) || 0,
        escalated: parseInt(row.escalated) || 0,
        slaOverdue: parseInt(row.sla_overdue) || 0,
        slaAtRisk: parseInt(row.sla_at_risk) || 0
      };
    } catch (err) {
      console.error('[PostgreSQL] getOfficerStats error:', err.message);
      return null;
    }
  },

  // --- Authoritative Shared Timeline ---
  async getAuthoritativeTimeline(grievanceId, incidentId) {
    const p = getPool();
    if (!p) return [];
    try {
      const timelineEvents = [];

      // 1. Status history transitions
      const statusRes = await p.query(`
        SELECT * FROM public.incident_status_history
        WHERE (incident_id = $1 OR incident_id = $2)
        ORDER BY created_at ASC
      `, [incidentId || grievanceId, grievanceId]);

      statusRes.rows.forEach(r => {
        timelineEvents.push({
          id: `TR-${r.id}`,
          type: 'STATUS_TRANSITION',
          stage: r.to_status ? r.to_status.replace(/_/g, ' ') : 'Status Updated',
          status: r.to_status,
          detail: r.reason || `Status progressed to ${r.to_status} by ${r.actor_name || 'Authority'}`,
          actor: r.actor_name,
          role: r.actor_role,
          trigger: r.trigger,
          timestamp: r.created_at,
          time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
        });
      });

      // 2. Field actions
      const fieldRes = await p.query(`
        SELECT * FROM public.field_actions
        WHERE (grievance_id = $1 OR incident_id = $2)
        ORDER BY started_at ASC
      `, [grievanceId, incidentId || grievanceId]);

      fieldRes.rows.forEach(r => {
        timelineEvents.push({
          id: `FA-${r.id}`,
          type: 'FIELD_ACTION',
          stage: r.action_type ? r.action_type.replace(/_/g, ' ') : 'Field Operation',
          status: r.status,
          detail: r.notes || `Field inspection / remediation executed by ${r.officer_name}`,
          officer: r.officer_name,
          evidenceUrl: r.evidence_url,
          timestamp: r.started_at || r.created_at,
          time: new Date(r.started_at || r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.started_at || r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
        });
      });

      // 3. Citizen verification records
      const verRes = await p.query(`
        SELECT * FROM public.verification_records
        WHERE (grievance_id = $1 OR incident_id = $2)
        ORDER BY created_at ASC
      `, [grievanceId, incidentId || grievanceId]);

      verRes.rows.forEach(r => {
        const isSatisfied = ['CONFIRMED', 'VERIFIED_SATISFIED', 'SATISFIED'].includes(r.status);
        timelineEvents.push({
          id: `VR-${r.id}`,
          type: 'VERIFICATION',
          stage: isSatisfied ? 'Citizen Verified & Closed' : 'Dispute Reopened by Citizen',
          status: r.status,
          detail: r.feedback || (isSatisfied ? 'Problem confirmed resolved by citizen' : 'Citizen disputed resolution'),
          rating: r.rating,
          photoUrl: r.photo_url,
          timestamp: r.created_at,
          time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
        });
      });

      // 4. Relevant Audit logs
      const auditRes = await p.query(`
        SELECT * FROM public.audit_logs
        WHERE (target_id = $1 OR target_id = $2)
        ORDER BY created_at ASC
      `, [grievanceId, incidentId || grievanceId]);

      auditRes.rows.forEach(r => {
        timelineEvents.push({
          id: `AL-${r.id}`,
          type: 'AUDIT',
          stage: r.action ? r.action.replace(/_/g, ' ') : 'System Action',
          detail: r.details,
          actor: r.actor_name,
          role: r.actor_role,
          timestamp: r.created_at,
          time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
        });
      });

      // Sort all events chronologically
      timelineEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // If empty, provide initial ingestion step from grievance record
      if (timelineEvents.length === 0) {
        timelineEvents.push({
          id: 'INIT-1',
          type: 'INTAKE',
          stage: 'Report Submitted',
          status: 'REPORTED',
          detail: 'Grievance submitted via JanSahayak Web Portal',
          timestamp: new Date().toISOString(),
          time: 'Just now',
          date: 'Today'
        });
      }

      return timelineEvents;
    } catch (err) {
      console.error('[PostgreSQL] getAuthoritativeTimeline error:', err.message);
      return [];
    }
  },

  // --- Unified Incident with Linked Complaints ---
  async getIncidentWithLinkedComplaints(incidentId) {
    const inc = await this.getIncidentById(incidentId);
    if (!inc) return null;

    const p = getPool();
    let linkedComplaints = [];
    if (p) {
      try {
        const compRes = await p.query(`
          SELECT 
            g.*,
            extensions.ST_Y(g.geom::extensions.geometry) AS lat_val,
            extensions.ST_X(g.geom::extensions.geometry) AS lng_val
          FROM public.grievances g
          WHERE g.incident_id = $1 OR g.cluster_id = ANY($2::text[])
          ORDER BY g.created_at ASC
        `, [incidentId, inc.clusterIds || []]);

        linkedComplaints = compRes.rows.map(r => ({
          id: r.id,
          title: r.title,
          descriptionRaw: r.description_raw,
          category: r.category,
          department: r.department,
          officerName: r.officer_name,
          urgency: r.urgency,
          status: r.status,
          citizenName: r.citizen_name,
          citizenPhone: r.citizen_phone,
          location: {
            ward: r.location_ward,
            area: r.location_area,
            lat: r.lat_val,
            lng: r.lng_val
          },
          evidence: r.evidence,
          createdAt: r.created_at
        }));
      } catch (e) {
        console.warn('Error fetching linked complaints for incident:', e.message);
      }
    }

    return {
      ...inc,
      linkedComplaints,
      complaintCount: Math.max(inc.complaintCount || 0, linkedComplaints.length)
    };
  }
};
