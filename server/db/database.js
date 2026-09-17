import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed template if store.json does not exist
const INITIAL_STORE = {
  users: [
    {
      id: 'USR-CITIZEN-01',
      name: 'Aditya Verma',
      email: 'aditya@citizen.in',
      password: 'citizen123',
      role: 'citizen',
      phone: '+91 98712-88210',
      ward: 'Ward 14 (Rohini Sector 14)',
      pincode: '110085',
      verified: true
    },
    {
      id: 'USR-OFFICER-01',
      name: 'Er. Sanjay Sharma',
      email: 'sanjay.sharma@djb.gov.in',
      password: 'officer123',
      role: 'officer',
      department: 'Delhi Jal Board (DJB)',
      designation: 'Assistant Executive Engineer',
      zone: 'Zone North-West (Rohini)',
      phone: '+91 98111-90021'
    },
    {
      id: 'USR-DEPTADMIN-01',
      name: 'Er. Rajiv Malhotra',
      email: 'admin.djb@delhi.gov.in',
      password: 'deptadmin123',
      role: 'dept_admin',
      department: 'Delhi Jal Board (DJB)',
      designation: 'Chief Engineer & Department Administrator',
      phone: '+91 99100-11223'
    },
    {
      id: 'USR-SUPERADMIN-01',
      name: 'Dr. Meenakshi Sundaram, IAS',
      email: 'superadmin@delhi.gov.in',
      password: 'superadmin123',
      role: 'super_admin',
      designation: 'Principal Secretary (IT & Public Grievance)',
      phone: '+91 11-2339-2000'
    }
  ],
  departments: [
    {
      id: 'DJB',
      name: 'Delhi Jal Board (DJB)',
      head: 'Er. Rajiv Malhotra',
      activeOfficers: 280,
      openCases: 142,
      slaCompliance: '94.8%',
      domains: ['water', 'sewage', 'pipeline', 'contamination', 'waterlogging']
    },
    {
      id: 'PWD',
      name: 'Public Works Department (PWD)',
      head: 'Er. Rajesh K. Meena',
      activeOfficers: 340,
      openCases: 189,
      slaCompliance: '88.2%',
      domains: ['road', 'cavity', 'flyover', 'underpass', 'asphalt', 'pothole']
    },
    {
      id: 'MCD',
      name: 'Municipal Corporation of Delhi (MCD)',
      head: 'Dr. K. S. Tyagi',
      activeOfficers: 520,
      openCases: 310,
      slaCompliance: '91.4%',
      domains: ['drainage', 'sanitation', 'garbage', 'solid waste', 'encroachment']
    },
    {
      id: 'BSES',
      name: 'BSES Rajdhani Power Limited',
      head: 'Er. Neeraj Bansal',
      activeOfficers: 190,
      openCases: 64,
      slaCompliance: '99.1%',
      domains: ['electricity', 'transformer', 'power', 'spark', 'blackout', 'wire']
    }
  ],
  contractorWarranties: [
    {
      id: 'WAR-DJB-2024-09',
      asset: '100mm Cast-Iron Feeder Line (Sector 14 Rohini)',
      contractor: 'Apex Pipe Tech Infra Ltd.',
      workOrder: 'WO-DEL-2024-8891',
      completionDate: '2024-04-12',
      warrantyStart: '2024-04-12',
      warrantyEnd: '2027-04-11',
      department: 'Delhi Jal Board (DJB)',
      status: 'ACTIVE_WARRANTY',
      coverageNotes: 'Full repair of pipe fracture and joint seal failure under contractor liability'
    },
    {
      id: 'WAR-PWD-2025-01',
      asset: 'Sector 14 Arterial Road Carriageway Bituminous Layer',
      contractor: 'Shree Balaji Roadworks Corp.',
      workOrder: 'WO-PWD-2025-1044',
      completionDate: '2025-01-20',
      warrantyStart: '2025-01-20',
      warrantyEnd: '2026-01-19',
      department: 'Public Works Department (PWD)',
      status: 'EXPIRED',
      coverageNotes: '1-year defect liability expired on Jan 19, 2026'
    }
  ],
  complaints: [
    {
      id: 'DL-2026-W14-0892',
      title: 'Contaminated Drinking Water & Main Supply Pipe Leakage',
      descriptionRaw: 'Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.',
      languageDetected: 'Hinglish / Hindi (Confidence 98%)',
      category: 'Water Supply & Contamination',
      department: 'Delhi Jal Board (DJB)',
      officerName: 'Er. Sanjay Sharma (AEE)',
      location: {
        ward: 'Ward 14 (Rohini Sector 14)',
        area: 'Pocket 2, Near Mother Dairy Booth',
        city: 'New Delhi',
        pincode: '110085',
        lat: 28.7189,
        lng: 77.1265
      },
      urgency: 'CRITICAL',
      urgencyScore: 94,
      status: 'IN_PROGRESS',
      createdAt: '2026-09-16 09:30 AM',
      timestamp: '2026-09-16T04:00:00.000Z',
      clusterId: 'CL-W14-WATER-01',
      incidentId: 'INC-2026-DEL-01',
      citizenId: 'USR-CITIZEN-01',
      citizenName: 'Aditya Verma',
      citizenPhone: '+91 98712-88210',
      evidence: {
        hasPhoto: true,
        photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
        hasAudio: true,
        audioTranscript: 'Voice intake: Bhai pichle 3 din se hamare Sector 14 mein ganda paani aa raha hai...'
      },
      dna: {
        dnaId: 'DNA-W14-892',
        problem: 'water_contamination',
        infrastructure: '100mm Cast-Iron Feeder Main',
        location: { lat: 28.7189, lng: 77.1265 },
        landmarks: ['Mother Dairy Booth #441', 'Pocket 2'],
        affected_groups: ['Residential Households', 'School Children'],
        severity: 9,
        urgency: 9,
        time_pattern: 'continuous during morning supply (07:00-10:00 AM)',
        normalized_description: 'Potable water contamination and supply pipeline fracture with odor'
      }
    }
  ],
  clusters: [
    {
      id: 'CL-W14-WATER-01',
      title: 'Rohini Sector 14 Water Supply & Carriageway Collapse Cluster',
      incidentId: 'INC-2026-DEL-01',
      leadDepartment: 'Delhi Jal Board (DJB)',
      centroid: { lat: 28.7185, lng: 77.1255 },
      radiusMeters: 450,
      complaintIds: ['DL-2026-W14-0892'],
      createdAt: '2026-09-16T04:05:00.000Z',
      updatedAt: new Date().toISOString()
    }
  ],
  civicIncidents: [
    {
      id: 'INC-2026-DEL-01',
      title: 'Rohini Sector 14 Subsurface Water Line Fracture & Cavity Formation',
      stage: 'GROWING',
      severity: 'CRITICAL',
      urgency: 'HIGH',
      summary: 'Deep subsurface water main rupture in Sector 14 is softening road subgrade, leading to asphalt cavity and cross-contamination with adjacent stormwater line.',
      leadDepartment: 'Delhi Jal Board (DJB)',
      participatingDepartments: [
        'Delhi Jal Board (DJB)',
        'Public Works Department (PWD)',
        'Municipal Corporation of Delhi (MCD)'
      ],
      affectedArea: 'Ward 14 (Rohini Sector 14 - Pocket 1 & 2)',
      affectedPopulation: '~2,400 Citizens / 550 Households',
      complaintCount: 1,
      uniqueCitizens: 1,
      clusterIds: ['CL-W14-WATER-01'],
      complaintIds: ['DL-2026-W14-0892'],
      stageVelocity: '+18.4 m/hr corridor spread',
      velocityData: {
        rateMetersPerHour: 18.4,
        isSufficientData: true,
        observationCount: 8,
        label: 'Calculated from timestamped observations'
      },
      evidence: [
        'Reported foul odor and brown discoloration in tap water',
        '35cm depression in road asphalt outside Mother Dairy booth',
        'Stagnant water pools near storm drain culvert'
      ],
      rootCause: {
        probableRootCause: 'Negative-pressure siphonage in 1988 cast-iron feeder line due to sub-surface joint fracture adjacent to storm drain culvert.',
        contributingFactors: [
          'Aged cast-iron pipe installed in 1988 exceeding 30-year design life',
          'Heavy monsoon drainage backwash eroding sub-base soil compaction',
          'Heavy commercial goods traffic on Sector 14 arterial road causing vibrational shear'
        ],
        supportingEvidence: [
          'Water quality chlorine residual dropped to 0.02 ppm',
          'Ground-penetrating radar / acoustic leak signature confirmed at valve box #12',
          'Road depression aligned with primary water distribution utility alignment'
        ],
        confidence: 0.91,
        verificationRequired: true,
        aiInferenceNotes: 'AI inference: Subsoil saturation from pipe breach is the primary driver of both road depression and water discoloration. Verification required by field acoustic probe.'
      },
      simulations: [
        {
          id: 'SIM-A',
          title: 'Option A: Rapid External Clamping (Emergency Split-Sleeve)',
          description: 'Excavate single 1.5m pit at Mother Dairy booth and install emergency stainless steel split-sleeve clamp.',
          estimatedCost: '₹18,000 (Estimated / requires authority validation)',
          estimatedDuration: '6 Hours',
          expectedEffectiveness: '80% immediate relief',
          recurrenceRisk: 'HIGH (65% probability of recurrence within 6 months)',
          risks: ['Galvanic corrosion at adjacent joint', 'Recurrent pavement collapse'],
          coordinationRequired: 'DJB only',
          recommendationVerdict: 'SUB-OPTIMAL: High risk of repeated pavement collapse and secondary contamination.'
        },
        {
          id: 'SIM-B',
          title: 'Option B: Full 24-Meter Ductile Iron Segment Replacement & PWD Road Re-bedding',
          description: 'Comprehensive replacement of aged line with modern polyurethane-lined ductile iron + PWD granular sub-base reconstruction.',
          estimatedCost: '₹1,45,000 (Estimated / requires authority validation)',
          estimatedDuration: '36 Hours',
          expectedEffectiveness: '98% permanent fix',
          recurrenceRisk: 'LOW (< 5% recurrence over 15 years)',
          risks: ['Requires temporary 8-hour water supply shutdown (tankers mobilized)', 'Single lane traffic diversion'],
          coordinationRequired: 'DJB + PWD + Traffic Police',
          recommendationVerdict: 'RECOMMENDED: Eliminates long-term civic disruption and complies with Zero Dead-End mandate.'
        }
      ],
      crossDeptCoordination: {
        primaryDepartment: 'Delhi Jal Board (DJB)',
        sharedProblemSummary: 'Underground water main rupture is softening road base and causing drain overflow — affecting 3 separate civic authorities.',
        departments: [
          {
            dept: 'Delhi Jal Board (DJB)',
            cases: 1,
            impactSummary: 'Main potable water pressure loss & contamination risk across households.',
            requiredAction: 'Isolate feeder valve and replace fractured pipe section',
            dependency: 'NONE',
            status: 'IN_PROGRESS'
          },
          {
            dept: 'Public Works Department (PWD)',
            cases: 1,
            impactSummary: 'Road subgrade saturation causing asphalt depression. Skid hazard.',
            requiredAction: 'Compact sub-base and lay bituminous wearing course after DJB completion',
            dependency: 'DJB pipe repair must be certified',
            status: 'PENDING_DEPENDENCY'
          },
          {
            dept: 'Municipal Corporation of Delhi (MCD)',
            cases: 1,
            impactSummary: 'Storm drain blockage and standing water pools near market boundary.',
            requiredAction: 'De-silt culvert and clear silt trap barriers',
            dependency: 'NONE',
            status: 'IN_PROGRESS'
          }
        ],
        coordinationRecommendation: 'Initiate Unified Joint Action: DJB isolates feeder at 11:00 AM; PWD inspects road sub-base concurrently before asphalt re-bedding; MCD flushes storm drain barriers.'
      },
      civicMemory: {
        previousIncidents: [
          {
            year: '2025',
            date: '14 June 2025',
            incidentId: 'DJB-HIST-2025-081',
            title: '100mm Cast-Iron Main Joint Failure (Pocket 1)',
            actionTaken: 'Emergency split-sleeve repair clamp + sodium hypochlorite flush',
            outcome: 'Resolved immediate pressure deficit for 7 months, but thermal expansion stressed adjacent pipe segment.',
            lessonsLearned: 'Clamping older cast iron without cathodic protection creates galvanic stress 40-50m downstream within 12 months.'
          }
        ],
        recurrenceDetected: true,
        similarity: 0.88,
        lastOccurrence: '14 June 2025',
        previousResolution: 'Temporary clamp'
      },
      humanDecisions: [],
      status: 'UNDER_INVESTIGATION',
      verificationStatus: 'PENDING_FIELD_WORK',
      createdAt: '2026-09-16T04:00:00.000Z',
      updatedAt: new Date().toISOString()
    }
  ],
  civicSignals: [
    {
      id: 'SIG-2026-001',
      time: '16 Sept 08:15',
      citizen: 'Sunita Mehra (Pocket 2)',
      channel: '🎙 Voice Note',
      type: 'water',
      icon: '💧',
      text: 'Water pressure very low this morning, slight brown tint in kitchen tap.',
      ward: 'Ward 14',
      lat: 28.7185,
      lng: 77.1245,
      matchScore: 98,
      linkedTo: 'INC-2026-DEL-01'
    }
  ],
  incidentEvents: [
    {
      id: 'EVT-1001',
      incidentId: 'INC-2026-DEL-01',
      eventType: 'COMPLAINT_INGESTED',
      actorType: 'CITIZEN',
      actorId: 'USR-CITIZEN-01',
      payload: { complaintId: 'DL-2026-W14-0892', channel: 'Voice-to-Grievance' },
      createdAt: '2026-09-16T04:00:00.000Z'
    },
    {
      id: 'EVT-1002',
      incidentId: 'INC-2026-DEL-01',
      eventType: 'AI_DNA_GENERATED',
      actorType: 'AGENT_DNA',
      actorId: 'ComplaintDNAAgent',
      payload: { dnaId: 'DNA-W14-892', confidence: 0.98 },
      createdAt: '2026-09-16T04:01:00.000Z'
    },
    {
      id: 'EVT-1003',
      incidentId: 'INC-2026-DEL-01',
      eventType: 'INCIDENT_CREATED',
      actorType: 'AGENT_INCIDENT',
      actorId: 'CivicIncidentAgent',
      payload: { stage: 'GROWING', severity: 'CRITICAL' },
      createdAt: '2026-09-16T04:05:00.000Z'
    }
  ]
};

// Thread-safe memory cached file database with auto-flush
class Database {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = JSON.parse(JSON.stringify(INITIAL_STORE));
        this.save();
      }
    } catch (err) {
      console.error('Error loading DB, resetting to initial seed:', err.message);
      this.data = JSON.parse(JSON.stringify(INITIAL_STORE));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing DB to disk:', err.message);
    }
  }

  // --- Complaints ---
  getComplaints() {
    return this.data.complaints || [];
  }

  getComplaintById(id) {
    return (this.data.complaints || []).find(c => c.id === id);
  }

  saveComplaint(complaint) {
    if (!this.data.complaints) this.data.complaints = [];
    const idx = this.data.complaints.findIndex(c => c.id === complaint.id);
    if (idx >= 0) {
      this.data.complaints[idx] = { ...this.data.complaints[idx], ...complaint };
    } else {
      this.data.complaints.unshift(complaint);
    }
    this.save();
    return complaint;
  }

  // --- Clusters ---
  getClusters() {
    return this.data.clusters || [];
  }

  getClusterById(id) {
    return (this.data.clusters || []).find(cl => cl.id === id);
  }

  saveCluster(cluster) {
    if (!this.data.clusters) this.data.clusters = [];
    const idx = this.data.clusters.findIndex(c => c.id === cluster.id);
    if (idx >= 0) {
      this.data.clusters[idx] = { ...this.data.clusters[idx], ...cluster };
    } else {
      this.data.clusters.unshift(cluster);
    }
    this.save();
    return cluster;
  }

  // --- Civic Incidents ---
  getIncidents() {
    return this.data.civicIncidents || [];
  }

  getIncidentById(id) {
    return (this.data.civicIncidents || []).find(inc => inc.id === id);
  }

  saveIncident(incident) {
    if (!this.data.civicIncidents) this.data.civicIncidents = [];
    const idx = this.data.civicIncidents.findIndex(i => i.id === incident.id);
    if (idx >= 0) {
      this.data.civicIncidents[idx] = { ...this.data.civicIncidents[idx], ...incident };
    } else {
      this.data.civicIncidents.unshift(incident);
    }
    this.save();
    return incident;
  }

  // --- Civic Signals ---
  getSignals() {
    return this.data.civicSignals || [];
  }

  saveSignal(signal) {
    if (!this.data.civicSignals) this.data.civicSignals = [];
    this.data.civicSignals.unshift(signal);
    this.save();
    return signal;
  }

  // --- Events & Audit Trail ---
  getEvents(incidentId = null) {
    const events = this.data.incidentEvents || [];
    if (!incidentId) return events;
    return events.filter(e => e.incidentId === incidentId);
  }

  logEvent(event) {
    if (!this.data.incidentEvents) this.data.incidentEvents = [];
    const record = {
      id: `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      ...event
    };
    this.data.incidentEvents.unshift(record);
    this.save();
    return record;
  }

  // --- Registry & Warranties ---
  getDepartmentRegistry() {
    return this.data.departments || [];
  }

  getContractorWarranties(assetQuery = '') {
    const warranties = this.data.contractorWarranties || [];
    if (!assetQuery) return warranties;
    return warranties.filter(w => 
      w.asset.toLowerCase().includes(assetQuery.toLowerCase()) || 
      w.department.toLowerCase().includes(assetQuery.toLowerCase())
    );
  }

  getUsers() {
    return this.data.users || [];
  }
}

export const db = new Database();
