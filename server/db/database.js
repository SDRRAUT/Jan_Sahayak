import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkPostgresConnection, postgresDB, isPostgresActive } from './postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Silent fallback in read-only / serverless container
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
    },
    {
      id: 'USR-CIVICOFFICER-01',
      name: 'Er. Sanjay Sharma',
      email: 'civic.officer@djb.gov.in',
      password: 'civicofficer123',
      role: 'civic_officer',
      department: 'Delhi Jal Board (DJB)',
      designation: 'Executive Engineer & Department Administrator',
      zone: 'Zone North-West (Rohini)',
      phone: '+91 98111-90021'
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
      title: 'Main Drinking Water Pipeline Burst & Gushing on Market Street',
      descriptionRaw: 'Bhai pichle 3 din se hamare Sector 14, Main Market ke samne drinking water pipe phat gaya hai aur bohot tez paani bah raha hai. Sadak par paani bhar gaya hai aur pure area mein drinking water ki supply band hai.',
      languageDetected: 'Hinglish / Hindi (Confidence 98%)',
      category: 'Water Supply & Contamination',
      department: 'Delhi Jal Board (DJB)',
      officerName: 'Er. Sanjay Sharma',
      officerDesignation: 'Assistant Executive Engineer',
      location: {
        ward: 'Ward 14 (Rohini Sector 14)',
        area: 'Main Market Road, Near Shree Ganesh Medicals',
        city: 'New Delhi',
        pincode: '110085',
        lat: 28.7189,
        lng: 77.1265
      },
      urgency: 'CRITICAL',
      urgencyScore: 96,
      status: 'IN_PROGRESS',
      createdAt: '2026-09-17 08:30 AM',
      timestamp: '2026-09-17T03:00:00.000Z',
      slaDeadline: '2026-09-18 04:00 PM',
      slaHoursLeft: 8,
      clusterId: 'CL-W14-WATER-01',
      clusterTitle: 'Rohini Sector 14 Main Feeder Pipe Fracture Cluster',
      clusterCount: 14,
      upvotes: 48,
      citizenId: 'USR-CITIZEN-01',
      citizenName: 'Aditya Verma',
      citizenPhone: '+91 98712-88491',
      evidence: {
        hasPhoto: true,
        photoUrl: '/civic-problems/ai_water_pipe_leak.jpg',
        confidenceScore: 0.98,
        detectedIssue: 'High Pressure Potable Pipeline Fracture'
      },
      photoUrl: '/civic-problems/ai_water_pipe_leak.jpg',
      dna: {
        dnaId: 'DNA-94820-W14',
        departmentConfidence: 99.2,
        urgencyScore: 96,
        sentimentScore: -0.89,
        sentimentLabel: 'Severe Water Wastage & Public Disruption',
        healthRiskLevel: 'HIGH',
        extractedEntities: [
          { label: 'Infrastructure', val: '150mm High-Pressure Cast Iron Main' },
          { label: 'Landmark', val: 'Shree Ganesh Medicals, Market Gali' },
          { label: 'Wastage Rate', val: '~3,200 Litres/Hour Potable Water' },
          { label: 'Affected Population', val: '450+ Households & 30 Retail Shops' }
        ]
      }
    },
    {
      id: 'DL-2026-W22-0112',
      title: 'Huge Overflowing Garbage Pile & Trash Bags on Market Road',
      descriptionRaw: 'Market road ke beech mein kude ka pahad ban gaya hai. Pura rasta block hai, kaale aur peele trash bags sadak par bikhre pade hain aur kutte-janwar kachra faila rahe hain. Dumper 4 din se nahi aaya.',
      languageDetected: 'Hinglish (Confidence 99%)',
      category: 'Sanitation & Solid Waste',
      department: 'Municipal Corporation of Delhi (MCD)',
      officerName: 'Dr. K. S. Tyagi',
      officerDesignation: 'Chief Sanitation Inspector (Shahdara Zone)',
      location: {
        ward: 'Ward 22 (Mayur Vihar Ph-1)',
        area: 'Main Market Complex Roadway',
        city: 'New Delhi',
        pincode: '110091',
        lat: 28.6012,
        lng: 77.2982
      },
      urgency: 'HIGH',
      urgencyScore: 88,
      status: 'IN_PROGRESS',
      createdAt: '2026-09-16 11:15 AM',
      timestamp: '2026-09-16T05:45:00.000Z',
      slaDeadline: '2026-09-17 06:00 PM',
      slaHoursLeft: 4,
      clusterId: 'CL-W22-SAN-09',
      clusterTitle: 'Mayur Vihar Phase 1 Commercial Waste Backlog',
      clusterCount: 16,
      upvotes: 52,
      citizenId: 'USR-CITIZEN-01',
      citizenName: 'Gurpreet Singh',
      citizenPhone: '+91 99532-77180',
      evidence: {
        hasPhoto: true,
        photoUrl: '/civic-problems/ai_garbage_dump.jpg',
        confidenceScore: 0.98,
        detectedIssue: 'Commercial & Domestic Solid Waste Overflow'
      },
      photoUrl: '/civic-problems/ai_garbage_dump.jpg'
    },
    {
      id: 'DL-2026-W03-0667',
      title: 'Severe Monsoon Road Waterlogging & Submerged Open Drain',
      descriptionRaw: 'Halki barish mein bhi pura chowk doob gaya hai. Scooter aur gaadiyan band ho rahi hain, paani ghutno tak bhara hai aur naali ka dhakkan khula hone se bohot bada accident ho sakta hai.',
      languageDetected: 'Hinglish (Confidence 99%)',
      category: 'Drainage & Waterlogging',
      department: 'Public Works Department (PWD)',
      officerName: 'Er. Rajesh K. Meena',
      officerDesignation: 'Executive Engineer (Monsoon Emergency Control)',
      location: {
        ward: 'Ward 3 (Karol Bagh)',
        area: 'Main Market Crossroad, Pusa Road Junction',
        city: 'New Delhi',
        pincode: '110005',
        lat: 28.6514,
        lng: 77.1907
      },
      urgency: 'CRITICAL',
      urgencyScore: 97,
      status: 'IN_PROGRESS',
      createdAt: '2026-09-17 07:15 AM',
      timestamp: '2026-09-17T01:45:00.000Z',
      slaDeadline: '2026-09-17 01:00 PM',
      slaHoursLeft: 3,
      clusterId: 'CL-W03-DRAIN-01',
      clusterTitle: 'Karol Bagh Junction Monsoon Inundation Cluster',
      clusterCount: 19,
      upvotes: 74,
      citizenId: 'USR-CITIZEN-01',
      citizenName: 'Harsh Vardhan',
      citizenPhone: '+91 98103-99120',
      evidence: {
        hasPhoto: true,
        photoUrl: '/civic-problems/ai_monsoon_waterlogging.jpg',
        confidenceScore: 0.99,
        detectedIssue: 'Severe Urban Waterlogging & Open Manhole Submergence'
      },
      photoUrl: '/civic-problems/ai_monsoon_waterlogging.jpg'
    },
    {
      id: 'DL-2026-W08-0419',
      title: 'Dangerous Deep Asphalt Crater & Broken Storm Drain Grate',
      descriptionRaw: 'Main road pe bohot bada gaddha ban gaya hai jisme barish ka ganda paani bhara hai. Saath hi naali ki lohe ki jaali toot chuki hai jisse do-wheelers ke pahiye phans rahe hain aur roz log gir rahe hain.',
      languageDetected: 'Hinglish (Confidence 98%)',
      category: 'Roads & Infrastructure',
      department: 'Public Works Department (PWD)',
      officerName: 'Er. Rajesh K. Meena',
      officerDesignation: 'Executive Engineer (Roads Division)',
      location: {
        ward: 'Ward 8 (Civil Lines / Ring Road)',
        area: 'Ring Road, Near ISBT Kashmere Gate Junction',
        city: 'New Delhi',
        pincode: '110054',
        lat: 28.6692,
        lng: 77.2285
      },
      urgency: 'CRITICAL',
      urgencyScore: 92,
      status: 'IN_PROGRESS',
      createdAt: '2026-09-16 01:20 PM',
      timestamp: '2026-09-16T07:50:00.000Z',
      slaDeadline: '2026-09-17 06:00 PM',
      slaHoursLeft: 5,
      clusterId: 'CL-W08-ROAD-02',
      clusterTitle: 'Civil Lines Ring Road Arterial Pothole & Broken Grate Cluster',
      clusterCount: 15,
      upvotes: 59,
      citizenId: 'USR-CITIZEN-01',
      citizenName: 'Pooja Malhotra',
      citizenPhone: '+91 98101-55829',
      evidence: {
        hasPhoto: true,
        photoUrl: '/civic-problems/ai_road_pothole.jpg',
        confidenceScore: 0.99,
        detectedIssue: 'Severe Road Pothole Cavity & Damaged Iron Drain Grating'
      },
      photoUrl: '/civic-problems/ai_road_pothole.jpg'
    },
    {
      id: 'DL-2026-W05-0298',
      title: 'Dangerous Dangling Overhead Power Cables & Sparking Transformer',
      descriptionRaw: 'Bazaar ke pole par bijli ke taar bohot neeche latak rahe hain aur transformer se chingaariyan nikal rahi hain. Niche log aur dukan wale dar rahe hain, short circuit se kabhi bhi badi aag lag sakti hai.',
      languageDetected: 'Hinglish (Confidence 98%)',
      category: 'Electricity & Streetlights',
      department: 'BSES / Tata Power Delhi Distribution',
      officerName: 'Er. Neeraj Bansal',
      officerDesignation: 'Assistant Engineer (Electrical Safety & Distribution)',
      location: {
        ward: 'Ward 5 (Kalkaji Market)',
        area: 'Main Market Commercial Electric Post #4B',
        city: 'New Delhi',
        pincode: '110019',
        lat: 28.5389,
        lng: 77.2598
      },
      urgency: 'CRITICAL',
      urgencyScore: 98,
      status: 'IN_PROGRESS',
      createdAt: '2026-09-17 07:00 AM',
      timestamp: '2026-09-17T01:30:00.000Z',
      slaDeadline: '2026-09-17 01:00 PM',
      slaHoursLeft: 2,
      clusterId: 'CL-W05-ELEC-01',
      clusterTitle: 'Kalkaji Market Dangling Power Cables & Sparking Hazard',
      clusterCount: 16,
      upvotes: 79,
      citizenId: 'USR-CITIZEN-01',
      citizenName: 'Rakesh Gupta',
      citizenPhone: '+91 98114-66320',
      evidence: {
        hasPhoto: true,
        photoUrl: '/civic-problems/ai_dangling_power_cables.jpg',
        confidenceScore: 0.99,
        detectedIssue: 'Low Hanging Live Power Lines & Transformer Spark Hazard'
      },
      photoUrl: '/civic-problems/ai_dangling_power_cables.jpg'
    }
  ],
  clusters: [
    {
      id: 'CL-W14-WATER-01',
      title: 'Rohini Sector 14 Main Feeder Pipe Fracture Cluster',
      department: 'Delhi Jal Board (DJB)',
      ward: 'Ward 14 (Rohini Sector 14)',
      complaintCount: 14,
      severity: 'CRITICAL',
      rootCause: '150mm High-pressure cast-iron main joint rupture near Shree Ganesh Medicals',
      impactRadius: '450 Households across Sector 14 Market & Block B',
      status: 'ACTIVE_INVESTIGATION',
      firstReported: 'Sep 16, 2026',
      estimatedResolution: 'Today, 04:00 PM'
    },
    {
      id: 'CL-W22-SAN-09',
      title: 'Mayur Vihar Phase 1 Commercial Waste Backlog',
      department: 'Municipal Corporation of Delhi (MCD)',
      ward: 'Ward 22 (Mayur Vihar)',
      complaintCount: 16,
      severity: 'HIGH',
      rootCause: 'Dumper collection backlog leading to commercial plastic trash pile up on carriageway',
      impactRadius: 'Market visitors & 80 retail shops',
      status: 'IN_PROGRESS',
      firstReported: 'Sep 16, 2026',
      estimatedResolution: 'Today, 06:00 PM'
    },
    {
      id: 'CL-W03-DRAIN-01',
      title: 'Karol Bagh Junction Monsoon Inundation & Submerged Manhole',
      department: 'Public Works Department (PWD)',
      ward: 'Ward 3 (Karol Bagh)',
      complaintCount: 19,
      severity: 'CRITICAL',
      rootCause: 'Blocked underground culvert combined with uncovered open storm manhole chamber',
      impactRadius: 'Arterial Pusa Road Crossing',
      status: 'CREW_DISPATCHED',
      firstReported: 'Sep 17, 2026',
      estimatedResolution: 'Today, 01:00 PM'
    },
    {
      id: 'CL-W08-ROAD-02',
      title: 'Civil Lines Ring Road Arterial Pothole & Broken Grate Cluster',
      department: 'Public Works Department (PWD)',
      ward: 'Ward 8 (Civil Lines / Ring Road)',
      complaintCount: 15,
      severity: 'CRITICAL',
      rootCause: 'Heavy monsoon runoff subgrade subsidence and damaged iron storm drain grating',
      impactRadius: 'Arterial Ring Road Junction & ISBT Flyover Approach',
      status: 'CREW_DISPATCHED',
      firstReported: 'Sep 16, 2026',
      estimatedResolution: 'Today, 06:00 PM'
    },
    {
      id: 'CL-W05-ELEC-01',
      title: 'Kalkaji Market Dangling Power Cables & Sparking Hazard',
      department: 'BSES / Tata Power Delhi Distribution',
      ward: 'Ward 5 (Kalkaji)',
      complaintCount: 16,
      severity: 'CRITICAL',
      rootCause: 'Low-tension distribution cable slackening and arcing transformer terminals over market street',
      impactRadius: 'Commercial shopping market corridor & 1,200 pedestrians',
      status: 'ACTIVE_INVESTIGATION',
      firstReported: 'Sep 17, 2026',
      estimatedResolution: 'Today, 01:00 PM'
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
  ],
  fieldActions: [],
  auditLogs: [
    {
      id: 'LOG-001',
      timestamp: '10:45 AM',
      actor: 'Super Admin',
      action: 'SYSTEM_BOOT',
      targetId: 'SYS',
      details: 'Platform initialized with authoritative schema'
    }
  ]
};

// Thread-safe memory cached file database with auto-flush and PostgreSQL sync
class Database {
  constructor() {
    this.data = null;
    this.load();
    this.initPostgres();
  }

  async initPostgres() {
    try {
      const ready = await checkPostgresConnection();
      if (ready) {
        await this.syncWithPostgres();
      }
    } catch (err) {
      console.warn('Supabase PostgreSQL connection status:', err.message);
    }
  }

  async syncWithPostgres() {
    try {
      const pgComplaints = await postgresDB.getAllGrievances();
      if (pgComplaints && pgComplaints.length > 0) {
        this.data.complaints = pgComplaints;
      }
      const pgIncidents = await postgresDB.getAllIncidents();
      if (pgIncidents && pgIncidents.length > 0) {
        this.data.civicIncidents = pgIncidents;
      }
      const pgSignals = await postgresDB.getAllSignals();
      if (pgSignals && pgSignals.length > 0) {
        this.data.civicSignals = pgSignals;
      }
    } catch (e) {
      console.warn('Sync with PostgreSQL warning:', e.message);
    }
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.fieldActions) this.data.fieldActions = [];
        if (!this.data.auditLogs) this.data.auditLogs = [];
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

  // --- Complaints / Grievances ---
  getComplaints() {
    return this.data.complaints || [];
  }

  getGrievances() {
    return this.getComplaints();
  }

  getComplaintById(id) {
    return (this.data.complaints || []).find(c => c.id === id);
  }

  getGrievanceById(id) {
    return this.getComplaintById(id);
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
    postgresDB.saveGrievance(complaint).catch((err) => {
      // Non-fatal if postgres has transient network hiccup
    });
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
    postgresDB.saveIncident(incident).catch(() => {});
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
    postgresDB.saveSignal(signal).catch(() => {});
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
    postgresDB.logAuditEvent(
      event.actorId || event.actorType || 'System AI Engine',
      event.eventType || 'PIPELINE_EVENT',
      event.incidentId || record.id,
      typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload || {})
    ).catch(() => {});
    return record;
  }

  // --- Field Actions ---
  getFieldActions({ incidentId, grievanceId, officerId } = {}) {
    const list = this.data.fieldActions || [];
    return list.filter(fa => {
      if (incidentId && fa.incidentId !== incidentId) return false;
      if (grievanceId && fa.grievanceId !== grievanceId) return false;
      if (officerId && fa.officerId !== officerId) return false;
      return true;
    });
  }

  saveFieldAction(action) {
    if (!this.data.fieldActions) this.data.fieldActions = [];
    const item = {
      id: action.id || `FA-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: action.createdAt || new Date().toISOString(),
      ...action
    };
    const idx = this.data.fieldActions.findIndex(f => f.id === item.id);
    if (idx >= 0) {
      this.data.fieldActions[idx] = { ...this.data.fieldActions[idx], ...item };
    } else {
      this.data.fieldActions.unshift(item);
    }
    this.save();
    return item;
  }

  // --- Verifications ---
  getVerifications({ grievanceId, incidentId, citizenId } = {}) {
    const list = this.data.verifications || [];
    return list.filter(v => {
      if (grievanceId && v.grievanceId !== grievanceId) return false;
      if (incidentId && v.incidentId !== incidentId) return false;
      if (citizenId && v.citizenId !== citizenId) return false;
      return true;
    });
  }

  saveVerification(ver) {
    if (!this.data.verifications) this.data.verifications = [];
    const item = {
      id: ver.id || `VR-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      verifiedAt: ver.verifiedAt || new Date().toISOString(),
      createdAt: ver.createdAt || new Date().toISOString(),
      ...ver
    };
    const idx = this.data.verifications.findIndex(v => v.id === item.id);
    if (idx >= 0) {
      this.data.verifications[idx] = { ...this.data.verifications[idx], ...item };
    } else {
      this.data.verifications.unshift(item);
    }
    this.save();
    return item;
  }

  // --- Audit Logs ---
  getAuditLogs(limit = 100) {
    const logs = this.data.auditLogs || [];
    return logs.slice(0, limit);
  }

  saveAuditLog(log) {
    if (!this.data.auditLogs) this.data.auditLogs = [];
    const item = {
      id: log.id || `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: log.timestamp || new Date().toLocaleString(),
      createdAt: new Date().toISOString(),
      ...log
    };
    this.data.auditLogs.unshift(item);
    this.save();
    return item;
  }

  // --- Notifications ---
  getNotifications(userId, userRole) {
    const notifs = this.data.notifications || [];
    if (!userId && !userRole) return notifs;
    return notifs.filter(n => {
      if (userRole === 'super_admin') return true;
      if (userId && n.userId === userId) return true;
      if (userRole && (n.userRole === userRole || n.userRole === 'all')) return true;
      return false;
    });
  }

  saveNotification(n) {
    if (!this.data.notifications) this.data.notifications = [];
    const item = {
      id: n.id || `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: n.createdAt || 'Just now',
      timestamp: n.timestamp || new Date().toISOString(),
      read: n.read || false,
      ...n
    };
    this.data.notifications.unshift(item);
    this.save();
    return item;
  }

  markNotificationRead(id) {
    if (!this.data.notifications) return false;
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.save();
      return true;
    }
    return false;
  }

  updateComplaint(idOrItem, updates = {}) {
    if (!this.data.complaints) return null;
    const id = typeof idOrItem === 'object' ? idOrItem.id : idOrItem;
    const upd = typeof idOrItem === 'object' ? idOrItem : updates;
    const idx = this.data.complaints.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.data.complaints[idx] = { ...this.data.complaints[idx], ...upd };
      this.save();
      return this.data.complaints[idx];
    }
    return null;
  }

  updateGrievance(idOrItem, updates = {}) {
    return this.updateComplaint(idOrItem, updates);
  }

  // --- Field Actions ---
  getFieldActions({ incidentId, grievanceId, officerId } = {}) {
    const list = this.data.fieldActions || [];
    return list.filter(fa => {
      if (incidentId && fa.incidentId !== incidentId) return false;
      if (grievanceId && fa.grievanceId !== grievanceId) return false;
      if (officerId && fa.officerId !== officerId) return false;
      return true;
    });
  }

  saveFieldAction(action) {
    if (!this.data.fieldActions) this.data.fieldActions = [];
    const item = {
      id: action.id || `FA-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: action.createdAt || new Date().toISOString(),
      ...action
    };
    this.data.fieldActions.unshift(item);
    this.save();
    return item;
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.data.auditLogs || [];
  }

  saveAuditLog(log) {
    if (!this.data.auditLogs) this.data.auditLogs = [];
    const item = {
      id: log.id || `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: log.timestamp || new Date().toLocaleTimeString(),
      createdAt: log.createdAt || new Date().toISOString(),
      ...log
    };
    this.data.auditLogs.unshift(item);
    this.save();
    return item;
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
