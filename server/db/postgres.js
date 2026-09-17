import pg from 'pg';

const { Pool } = pg;

// Support various PostgreSQL connection strings (Vercel Postgres, Supabase, Neon, Railway, Local)
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.PG_CONNECTION_STRING;

let pool = null;
let isConnected = false;

export function getPool() {
  if (!connectionString) return null;
  if (!pool) {
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      console.error('[PostgreSQL] Unexpected idle client error:', err.message);
    });
  }
  return pool;
}

export async function checkPostgresConnection() {
  const p = getPool();
  if (!p) return false;
  try {
    const client = await p.connect();
    client.release();
    isConnected = true;
    console.log('🐘 Connected to PostgreSQL database successfully.');
    return true;
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection failed:', err.message);
    isConnected = false;
    return false;
  }
}

export function isPostgresActive() {
  return Boolean(connectionString && isConnected);
}

/**
 * Auto-initialize tables and migrations in PostgreSQL
 */
export async function initPostgresSchema(initialData = {}) {
  const p = getPool();
  if (!p) return false;

  const connected = await checkPostgresConnection();
  if (!connected) return false;

  const client = await p.connect();
  try {
    await client.query('BEGIN');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(64) NOT NULL,
        department VARCHAR(255),
        designation VARCHAR(255),
        zone VARCHAR(255),
        phone VARCHAR(64),
        ward VARCHAR(255),
        pincode VARCHAR(32),
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Grievances / Complaints Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS grievances (
        id VARCHAR(64) PRIMARY KEY,
        title TEXT NOT NULL,
        description_raw TEXT NOT NULL,
        language_detected VARCHAR(128),
        category VARCHAR(128),
        department VARCHAR(128),
        officer_name VARCHAR(128),
        location JSONB,
        urgency VARCHAR(32),
        urgency_score INT,
        status VARCHAR(64),
        created_at VARCHAR(64),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        sla_deadline VARCHAR(64),
        sla_hours_left INT,
        upvotes INT DEFAULT 1,
        citizen_id VARCHAR(64),
        citizen_name VARCHAR(128),
        citizen_phone VARCHAR(64),
        evidence JSONB,
        dna JSONB,
        analysis JSONB,
        cluster_id VARCHAR(64),
        cluster_title TEXT,
        cluster_count INT DEFAULT 1,
        incident_id VARCHAR(64),
        resolution_notes TEXT,
        resolution_photo_url TEXT,
        citizen_verification JSONB,
        timeline JSONB DEFAULT '[]'::jsonb,
        information_requests JSONB DEFAULT '[]'::jsonb
      );
    `);

    // 3. Clusters Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clusters (
        id VARCHAR(64) PRIMARY KEY,
        title TEXT,
        incident_id VARCHAR(64),
        lead_department VARCHAR(128),
        centroid JSONB,
        radius_meters INT,
        complaint_ids JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Civic Incidents Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS civic_incidents (
        id VARCHAR(64) PRIMARY KEY,
        title TEXT NOT NULL,
        stage VARCHAR(64),
        severity VARCHAR(32),
        urgency VARCHAR(32),
        summary TEXT,
        lead_department VARCHAR(128),
        participating_departments JSONB DEFAULT '[]'::jsonb,
        affected_area TEXT,
        affected_population TEXT,
        complaint_count INT DEFAULT 0,
        unique_citizens INT DEFAULT 0,
        cluster_ids JSONB DEFAULT '[]'::jsonb,
        complaint_ids JSONB DEFAULT '[]'::jsonb,
        stage_velocity VARCHAR(64),
        velocity_data JSONB,
        evidence JSONB DEFAULT '[]'::jsonb,
        root_cause JSONB,
        simulations JSONB DEFAULT '[]'::jsonb,
        cross_dept_coordination JSONB,
        civic_memory JSONB,
        human_decisions JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(64),
        verification_status VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Civic Signals Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS civic_signals (
        id VARCHAR(64) PRIMARY KEY,
        incident_id VARCHAR(64),
        citizen_name VARCHAR(128),
        ward VARCHAR(128),
        channel VARCHAR(64),
        raw_input TEXT,
        translated_text TEXT,
        category VARCHAR(128),
        inferred_asset VARCHAR(128),
        has_photo BOOLEAN DEFAULT FALSE,
        photo_url TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        timestamp VARCHAR(64),
        status VARCHAR(64),
        confidence VARCHAR(64)
      );
    `);

    // 6. Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        user_role VARCHAR(64),
        title TEXT,
        message TEXT,
        grievance_id VARCHAR(64),
        link TEXT,
        type VARCHAR(64),
        read BOOLEAN DEFAULT FALSE,
        created_at VARCHAR(64),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 7. Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        timestamp VARCHAR(64),
        actor VARCHAR(128),
        action VARCHAR(128),
        target_id VARCHAR(64),
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('✅ PostgreSQL schema verified & updated.');

    // Auto-seed if database is freshly created
    await seedPostgresData(client, initialData);

    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing PostgreSQL schema:', err);
    return false;
  } finally {
    client.release();
  }
}

/**
 * Seed initial baseline data into PostgreSQL
 */
async function seedPostgresData(client, data) {
  try {
    // Seed Users
    const userCountRes = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCountRes.rows[0].count, 10) === 0 && data.users?.length) {
      for (const u of data.users) {
        await client.query(`
          INSERT INTO users (id, name, email, password, role, department, designation, zone, phone, ward, pincode, verified)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING
        `, [u.id, u.name, u.email, u.password, u.role, u.department, u.designation, u.zone, u.phone, u.ward, u.pincode, u.verified || false]);
      }
      console.log(`🌱 Seeded ${data.users.length} users to PostgreSQL.`);
    }

    // Seed Grievances
    const gCountRes = await client.query('SELECT COUNT(*) FROM grievances');
    if (parseInt(gCountRes.rows[0].count, 10) === 0 && data.complaints?.length) {
      for (const g of data.complaints) {
        await client.query(`
          INSERT INTO grievances (
            id, title, description_raw, language_detected, category, department, officer_name,
            location, urgency, urgency_score, status, created_at, sla_deadline, sla_hours_left,
            upvotes, citizen_id, citizen_name, citizen_phone, evidence, dna, cluster_id, incident_id
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
          ) ON CONFLICT (id) DO NOTHING
        `, [
          g.id, g.title, g.descriptionRaw, g.languageDetected, g.category, g.department, g.officerName,
          JSON.stringify(g.location || {}), g.urgency, g.urgencyScore, g.status, g.createdAt,
          g.slaDeadline, g.slaHoursLeft, g.upvotes || 1, g.citizenId, g.citizenName, g.citizenPhone,
          JSON.stringify(g.evidence || {}), JSON.stringify(g.dna || {}), g.clusterId, g.incidentId
        ]);
      }
      console.log(`🌱 Seeded ${data.complaints.length} initial complaints to PostgreSQL.`);
    }

    // Seed Civic Incidents
    const incCountRes = await client.query('SELECT COUNT(*) FROM civic_incidents');
    if (parseInt(incCountRes.rows[0].count, 10) === 0 && data.civicIncidents?.length) {
      for (const inc of data.civicIncidents) {
        await client.query(`
          INSERT INTO civic_incidents (
            id, title, stage, severity, urgency, summary, lead_department, participating_departments,
            affected_area, affected_population, complaint_count, unique_citizens, cluster_ids,
            complaint_ids, stage_velocity, velocity_data, evidence, root_cause, simulations,
            cross_dept_coordination, civic_memory, status, verification_status
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
          ) ON CONFLICT (id) DO NOTHING
        `, [
          inc.id, inc.title, inc.stage, inc.severity, inc.urgency, inc.summary, inc.leadDepartment,
          JSON.stringify(inc.participatingDepartments || []), inc.affectedArea, inc.affectedPopulation,
          inc.complaintCount, inc.uniqueCitizens, JSON.stringify(inc.clusterIds || []),
          JSON.stringify(inc.complaintIds || []), inc.stageVelocity, JSON.stringify(inc.velocityData || {}),
          JSON.stringify(inc.evidence || []), JSON.stringify(inc.rootCause || {}),
          JSON.stringify(inc.simulations || []), JSON.stringify(inc.crossDeptCoordination || {}),
          JSON.stringify(inc.civicMemory || {}), inc.status, inc.verificationStatus
        ]);
      }
      console.log(`🌱 Seeded ${data.civicIncidents.length} civic incidents to PostgreSQL.`);
    }
  } catch (err) {
    console.warn('Seed error (non-fatal):', err.message);
  }
}

/**
 * Query Helper Methods
 */
export const postgresDB = {
  async query(text, params) {
    const p = getPool();
    if (!p) return null;
    return p.query(text, params);
  },

  async getAllGrievances() {
    const p = getPool();
    if (!p) return null;
    try {
      const res = await p.query('SELECT * FROM grievances ORDER BY timestamp DESC');
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        descriptionRaw: r.description_raw,
        languageDetected: r.language_detected,
        category: r.category,
        department: r.department,
        officerName: r.officer_name,
        location: r.location,
        urgency: r.urgency,
        urgencyScore: r.urgency_score,
        status: r.status,
        createdAt: r.created_at,
        timestamp: r.timestamp,
        slaDeadline: r.sla_deadline,
        slaHoursLeft: r.sla_hours_left,
        upvotes: r.upvotes,
        citizenId: r.citizen_id,
        citizenName: r.citizen_name,
        citizenPhone: r.citizen_phone,
        evidence: r.evidence,
        dna: r.dna,
        analysis: r.analysis,
        clusterId: r.cluster_id,
        clusterTitle: r.cluster_title,
        clusterCount: r.cluster_count,
        incidentId: r.incident_id,
        resolutionNotes: r.resolution_notes,
        resolutionPhotoUrl: r.resolution_photo_url,
        citizenVerification: r.citizen_verification,
        timeline: r.timeline || [],
        informationRequests: r.information_requests || []
      }));
    } catch (err) {
      console.error('PostgreSQL getAllGrievances error:', err.message);
      return null;
    }
  },

  async saveGrievance(g) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query(`
        INSERT INTO grievances (
          id, title, description_raw, language_detected, category, department, officer_name,
          location, urgency, urgency_score, status, created_at, timestamp, sla_deadline,
          sla_hours_left, upvotes, citizen_id, citizen_name, citizen_phone, evidence,
          dna, analysis, cluster_id, cluster_title, cluster_count, incident_id,
          resolution_notes, resolution_photo_url, citizen_verification, timeline, information_requests
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13,
          $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          status = EXCLUDED.status,
          category = EXCLUDED.category,
          department = EXCLUDED.department,
          officer_name = EXCLUDED.officer_name,
          resolution_notes = EXCLUDED.resolution_notes,
          resolution_photo_url = EXCLUDED.resolution_photo_url,
          citizen_verification = EXCLUDED.citizen_verification,
          timeline = EXCLUDED.timeline,
          information_requests = EXCLUDED.information_requests,
          cluster_id = EXCLUDED.cluster_id,
          incident_id = EXCLUDED.incident_id;
      `, [
        g.id, g.title, g.descriptionRaw || g.description, g.languageDetected, g.category, g.department, g.officerName,
        JSON.stringify(g.location || {}), g.urgency, g.urgencyScore, g.status, g.createdAt,
        g.slaDeadline, g.slaHoursLeft, g.upvotes || 1, g.citizenId, g.citizenName, g.citizenPhone,
        JSON.stringify(g.evidence || {}), JSON.stringify(g.dna || {}), JSON.stringify(g.analysis || {}),
        g.clusterId, g.clusterTitle, g.clusterCount || 1, g.incidentId,
        g.resolutionNotes, g.resolutionPhotoUrl, JSON.stringify(g.citizenVerification || null),
        JSON.stringify(g.timeline || []), JSON.stringify(g.informationRequests || [])
      ]);
      return true;
    } catch (err) {
      console.error('PostgreSQL saveGrievance error:', err.message);
      return false;
    }
  },

  async saveNotification(n) {
    const p = getPool();
    if (!p) return false;
    try {
      await p.query(`
        INSERT INTO notifications (id, user_id, user_role, title, message, grievance_id, link, type, read, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
      `, [n.id, n.userId, n.userRole, n.title, n.message, n.grievanceId, n.link, n.type, n.read || false, n.createdAt]);
      return true;
    } catch (err) {
      console.error('PostgreSQL saveNotification error:', err.message);
      return false;
    }
  },

  async logAuditEvent(actor, action, targetId, details) {
    const p = getPool();
    if (!p) return false;
    try {
      const id = `LOG-${Date.now()}`;
      await p.query(`
        INSERT INTO audit_logs (id, timestamp, actor, action, target_id, details)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [id, new Date().toLocaleTimeString(), actor, action, targetId, details]);
      return true;
    } catch (err) {
      console.error('PostgreSQL logAuditEvent error:', err.message);
      return false;
    }
  }
};
