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
      const validOfficerId = (officerId && officerId.length === 36) ? officerId : 'b0000000-0000-0000-0000-000000000001';
      await p.query(`
        INSERT INTO public.field_actions (
          incident_id, grievance_id, officer_id, officer_name, action_type, status, notes, evidence_url, started_at, completed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '2 hours', NOW())
      `, [incidentId || null, grievanceId || null, validOfficerId, officerName || 'Field Officer', actionType || 'REPAIR', status || 'COMPLETED', notes || '', evidenceUrl || null]);
      return true;
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
      const validCitizenId = (citizenId && citizenId.length === 36) ? citizenId : 'a0000000-0000-0000-0000-000000000001';
      await p.query(`
        INSERT INTO public.verification_records (
          grievance_id, incident_id, citizen_id, status, feedback, rating, photo_url, verified_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [grievanceId || null, incidentId || null, validCitizenId, status || 'VERIFIED', feedback || '', rating || 5, photoUrl || null]);
      return true;
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
      const validUserId = (uploadedBy && uploadedBy.length === 36) ? uploadedBy : 'a0000000-0000-0000-0000-000000000001';
      await p.query(`
        INSERT INTO public.evidence_records (
          complaint_id, incident_id, uploaded_by, type, storage_path, file_url, mime_type, metadata, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [complaintId || null, incidentId || null, validUserId, type || 'IMAGE', storagePath || '', fileUrl || '', mimeType || 'image/jpeg', JSON.stringify(metadata || {})]);
      return true;
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
  }
};
