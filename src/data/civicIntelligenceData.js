/**
 * CIVIC INTELLIGENCE SEED DATA & ENTERPRISE CONTRACTS
 * 
 * Implements:
 * 1. Civic Signals (Lightweight citizen observations)
 * 2. Civic Incidents (100 Complaints -> 1 Civic Incident)
 * 3. Complaint DNA (Semantic fingerprinting across 18 dimensions)
 * 4. Problem Spread Geographic Intelligence (Progression over time)
 * 5. Cross-Department Correlation & Shared Problem Graph
 * 6. Civic Memory (Institutional long-term resolution history)
 * 7. Root-Cause Hypotheses (Evidence-traceable reasoning)
 * 8. Action Simulations (Multi-scenario comparative decision support)
 * 9. Problem Escalation Engine Stages (NORMAL -> GROWING -> EMERGING -> CRITICAL)
 */

export const CIVIC_SIGNALS = [
  {
    id: "SIG-2026-001",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Pooja Malhotra",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "VOICE_NOTE",
    rawInput: "Road ke side se paani aa raha hai continuous pichle 2 din se.",
    translatedText: "Water is continuously leaking from the roadside since the last 2 days.",
    category: "Water Supply & Contamination",
    inferredAsset: "Roadside Water Pipeline Seam",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    lat: 28.7170,
    lng: 77.1250,
    timestamp: "2026-09-12 08:15 AM",
    status: "CLUSTERED",
    confidence: "High (94%)"
  },
  {
    id: "SIG-2026-002",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Vikram Sethi",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "QUICK_TEXT",
    rawInput: "Morning municipal tap water smells foul like sewer in Pocket 2.",
    translatedText: "Morning municipal tap water smells foul like sewer in Pocket 2.",
    category: "Water Supply & Contamination",
    inferredAsset: "Drinking Water Supply Feeder",
    hasPhoto: false,
    lat: 28.7180,
    lng: 77.1258,
    timestamp: "2026-09-12 09:40 AM",
    status: "CLUSTERED",
    confidence: "High (91%)"
  },
  {
    id: "SIG-2026-003",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Anand Rathi",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "QUICK_TEXT",
    rawInput: "Low water pressure on 1st and 2nd floors since yesterday.",
    translatedText: "Low water pressure on 1st and 2nd floors since yesterday.",
    category: "Water Supply & Contamination",
    inferredAsset: "Distribution Pressure Feeder",
    hasPhoto: false,
    lat: 28.7192,
    lng: 77.1264,
    timestamp: "2026-09-13 07:15 AM",
    status: "CLUSTERED",
    confidence: "Medium (85%)"
  },
  {
    id: "SIG-2026-004",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Ritu Sharma",
    ward: "Ward 12 (Pitampura Border)",
    channel: "PHOTO_UPLOAD",
    rawInput: "Road asphalt has become soft and wavy near Mother Dairy lane.",
    translatedText: "Road asphalt has become soft and wavy near Mother Dairy lane.",
    category: "Roads & Infrastructure",
    inferredAsset: "Arterial Road Subgrade",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    lat: 28.7155,
    lng: 77.1235,
    timestamp: "2026-09-13 04:30 PM",
    status: "CLUSTERED",
    confidence: "High (96%)"
  },
  {
    id: "SIG-2026-005",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Suresh Narang",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "VOICE_NOTE",
    rawInput: "Water pooling near school boundary wall even though no rain today.",
    translatedText: "Water pooling near school boundary wall even though no rain today.",
    category: "Water Supply & Contamination",
    inferredAsset: "Underground Supply Valve",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    lat: 28.7188,
    lng: 77.1269,
    timestamp: "2026-09-14 11:20 AM",
    status: "CLUSTERED",
    confidence: "High (92%)"
  },
  {
    id: "SIG-2026-006",
    incidentId: "INC-2026-DEL-02",
    citizenName: "Karan Johar",
    ward: "Ward 8 (Lajpat Nagar)",
    channel: "PHOTO_UPLOAD",
    rawInput: "Underpass drain grate completely blocked with construction debris.",
    translatedText: "Underpass drain grate completely blocked with construction debris.",
    category: "Roads & Infrastructure",
    inferredAsset: "Stormwater Drainage Grate",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    lat: 28.5684,
    lng: 77.2341,
    timestamp: "2026-09-15 08:30 AM",
    status: "CLUSTERED",
    confidence: "High (95%)"
  },
  {
    id: "SIG-2026-007",
    incidentId: "INC-2026-DEL-03",
    citizenName: "Deepak Chawla",
    ward: "Ward 5 (Kalkaji)",
    channel: "VOICE_NOTE",
    rawInput: "Pole transformer making loud buzzing spark sounds intermittently.",
    translatedText: "Pole transformer making loud buzzing spark sounds intermittently.",
    category: "Electricity & Power Grid",
    inferredAsset: "400kVA Distribution Transformer",
    hasPhoto: false,
    lat: 28.5442,
    lng: 77.2589,
    timestamp: "2026-09-16 11:45 AM",
    status: "CLUSTERED",
    confidence: "Critical (98%)"
  }
];

export const CIVIC_INCIDENTS = [
  {
    id: "INC-2026-DEL-01",
    title: "Water Pipeline Joint Rupture & Cross-Subsoil Infiltration",
    summary: "Subsurface joint fracture in 1988 cast-iron distribution feeder. Continuous water leakage has saturated road subgrade across Ward 12 & 14, causing negative pressure sewer infiltration into potable lines and softening arterial pavement.",
    incidentType: "INFRASTRUCTURE_FAILURE",
    status: "Investigating", // Detected | Investigating | Verified | Action Planned | Action In Progress | Contained | Resolved | Monitoring | Closed
    stage: "GROWING", // NORMAL | GROWING | EMERGING | CRITICAL
    stageVelocity: "+240% increase over 5 days",
    severity: "CRITICAL",
    confidence: "High (89% signal correlation)",
    signalCount: 37,
    formalComplaintsCount: 18,
    citizenObservationsCount: 19,
    affectedArea: "Ward 12 → Ward 14 (Rohini Sector 14 Corridor)",
    affectedPopulation: "~2,800 Citizens (650 Households)",
    firstDetectedAt: "2026-09-12 08:15 AM",
    lastUpdatedAt: "10 mins ago",
    departments: [
      { name: "Delhi Jal Board (DJB)", lead: true, cases: 24, role: "Main potable carrier isolation, trench excavation & clamp replacement" },
      { name: "Public Works Department (PWD)", lead: false, cases: 9, role: "Road pavement stabilizing & subsoil drainage rehabilitation" },
      { name: "Municipal Corporation of Delhi (MCD)", lead: false, cases: 4, role: "Adjacent storm drain blockage clearing & sanitization" }
    ],
    complaintDna: {
      issueType: "Water Infrastructure",
      subIssue: "Pipeline Rupture & Negative Pressure Contamination",
      service: "Potable Municipal Water Distribution",
      asset: "100mm Cast-Iron Feeder Main (Line-14C)",
      locationContext: "Underground roadside utility corridor (Depth 1.4m)",
      department: "Delhi Jal Board (DJB)",
      subDepartment: "North-West Maintenance Division",
      severity: "CRITICAL",
      urgency: "HIGH",
      symptoms: [
        "Intermittent pressure deficit in morning hours",
        "Sewage backflow odor in drinking taps",
        "Road sub-base waterlogging and asphalt wave",
        "Foul yellowish water discharge in Pocket 2"
      ],
      entities: [
        "Mother Dairy Booth #441",
        "Pocket 2 Feeder Valve #7",
        "Sector 14 Arterial Road",
        "Govt Primary School #2"
      ],
      possibleCauses: [
        "Aging 1988 cast-iron joint degradation exceeding 35-year design life",
        "Loss of soil compaction due to heavy municipal truck traffic",
        "Negative pressure cross-siphoning from adjacent masonry storm drain"
      ],
      affectedPopulation: [
        "650 residential households in Pocket 1 & 2",
        "Sector 14 DDA Commercial Complex (42 shops)",
        "Govt Primary School #2 (~420 students)"
      ],
      temporalPattern: "Severe during 07:00–10:00 AM municipal pumping cycle",
      environmentalContext: "Post-monsoon saturated subsoil accelerating joint cavitation"
    },
    timeline: [
      {
        date: "12 Sept",
        time: "08:15 AM",
        stage: "First Weak Signal Detected",
        desc: "Citizen voice note SIG-2026-001 logged water trickling out from road seam near Mother Dairy booth.",
        count: 1,
        source: "Citizen Signal"
      },
      {
        date: "13 Sept",
        time: "09:30 AM",
        stage: "Signal Cluster Formation",
        desc: "5 related citizen observations logged within 250m radius describing pressure loss and damp asphalt.",
        count: 6,
        source: "AI Clustering"
      },
      {
        date: "14 Sept",
        time: "11:00 AM",
        stage: "Formal Complaint Wave",
        desc: "12 formal citizen grievances submitted. AI Incident Engine aggregates signals into Civic Incident INC-2026-DEL-01.",
        count: 18,
        source: "Incident Engine"
      },
      {
        date: "15 Sept",
        time: "02:20 PM",
        stage: "Geographic Spread Detected",
        desc: "Seepage crossed jurisdictional ward boundary from Ward 12 into Ward 14 Pocket 2.",
        count: 26,
        source: "Geographic Engine"
      },
      {
        date: "16 Sept",
        time: "04:45 PM",
        stage: "Cross-Department Linkage",
        desc: "PWD received 3 road depression reports along the identical pipeline corridor. MCD reported drain backflow.",
        count: 32,
        source: "Cross-Dept Detector"
      },
      {
        date: "17 Sept",
        time: "09:00 AM",
        stage: "Escalation to GROWING Stage",
        desc: "Signal velocity reached +240%. High public distress triggers multi-department supervisory alert.",
        count: 37,
        source: "Escalation Engine"
      }
    ],
    spreadGeo: [
      {
        step: "Day 1 (Sep 12)",
        ward: "Ward 12 (Origin)",
        lat: 28.7160,
        lng: 77.1230,
        radiusMeters: 140,
        signalCount: 2,
        label: "Initial weak signal at pipeline valve pit",
        color: "#10B981"
      },
      {
        step: "Day 3 (Sep 14)",
        ward: "Ward 12 & Ward 14 (Pocket 1)",
        lat: 28.7175,
        lng: 77.1248,
        radiusMeters: 420,
        signalCount: 18,
        label: "Subsurface spread to Pocket 1 residential loop",
        color: "#F59E0B"
      },
      {
        step: "Day 5 (Sep 16-17)",
        ward: "Ward 12, 13 & 14 (Arterial Corridor)",
        lat: 28.7190,
        lng: 77.1270,
        radiusMeters: 920,
        signalCount: 37,
        label: "Full corridor impact: drinking water + road dip + drain backflow",
        color: "#EF4444"
      }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-01",
        title: "Corrosion & Joint Dislodgement in 1988 Cast-Iron Main Line",
        confidence: "HIGH",
        confidenceScore: 88,
        evidence: [
          "37 correlated citizen signals & complaints clustered along the same 400m utility corridor",
          "DJB GIS asset register marks line vintage as Year 1988 (exceeded 35-year design lifespan)",
          "SCADA telemetry confirms local line pressure drop from 3.2 bar to 0.8 bar at 08:15 AM pump start",
          "Historical precedent: Case DJB-HIST-2025-081 occurred 120m away under identical joint failure symptoms"
        ],
        verificationRequired: true,
        recommendedVerification: "Deploy acoustic leak correlator & ultrasonic pipe thickness sensor at Mother Dairy junction"
      },
      {
        id: "RCH-02",
        title: "Cross-Siphoning from Damaged Stormwater Masonry Drain",
        confidence: "MEDIUM",
        confidenceScore: 68,
        evidence: [
          "4 citizen complaints report foul sewer odor specifically during non-supply low-pressure hours",
          "MCD sanitation log #MCD-SN-8902 notes cracked masonry wall in storm drain line #14 on Sep 10"
        ],
        verificationRequired: true,
        recommendedVerification: "Conduct non-toxic fluorometric dye test at upstream storm drain inlet"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "Delhi Jal Board (DJB)",
      sharedProblemSummary: "Underground water main rupture is softening road base and causing drain overflow — affecting 3 separate civic authorities.",
      departments: [
        {
          dept: "Delhi Jal Board (DJB)",
          cases: 24,
          icon: "Droplet",
          badgeColor: "#0E5E3A",
          impactSummary: "Main potable water pressure loss & contamination risk across 650 households."
        },
        {
          dept: "Public Works Department (PWD)",
          cases: 9,
          icon: "Wrench",
          badgeColor: "#D97706",
          impactSummary: "Road subgrade saturation causing 35cm asphalt depression. Acute accident risk for two-wheelers."
        },
        {
          dept: "Municipal Corporation of Delhi (MCD)",
          cases: 4,
          icon: "Building2",
          badgeColor: "#7C3AED",
          impactSummary: "Storm drain blockage and standing water pools near Mother Dairy market boundary."
        }
      ],
      coordinationRecommendation: "Initiate Unified Joint Action: DJB isolates feeder at 11:00 AM; PWD inspects road sub-base concurrently before asphalt re-bedding; MCD flushes storm drain barriers."
    },
    civicMemory: [
      {
        year: "2025",
        date: "14 June 2025",
        incidentId: "DJB-HIST-2025-081",
        title: "100mm Cast-Iron Main Joint Failure (Pocket 1)",
        actionTaken: "Emergency split-sleeve repair clamp + sodium hypochlorite flush",
        outcome: "Resolved immediate pressure deficit for 7 months, but thermal expansion stressed adjacent pipe segment.",
        lessonsLearned: "Clamping older cast iron without cathodic protection creates galvanic stress 40-50m downstream within 12 months."
      },
      {
        year: "2024",
        date: "22 March 2024",
        incidentId: "DJB-HIST-2024-412",
        title: "Sewer Cross-Infiltration at Mother Dairy Crossing",
        actionTaken: "Temporary bitumen patch over road surface without underground pipe realignment",
        outcome: "Pavement recaved after 8 weeks following heavy monsoon runoff.",
        lessonsLearned: "Patching road surface without replacing defective pipe guarantees structural pavement collapse."
      }
    ],
    simulations: [
      {
        id: "SIM-A",
        title: "Option A: Rapid Temporary Clamping (Split-Sleeve)",
        description: "Excavate single 1.5m pit at Mother Dairy booth and install emergency stainless steel split-sleeve clamp.",
        timeToIntervention: "4–6 Hours",
        expectedResolutionTime: "Same Day (6 Hours)",
        affectedPopulationReduction: "80% immediate relief",
        recurrenceRisk: "HIGH (65% probability of recurrence within 6 months)",
        resourceRequirement: "Low (1 Repair Squad + 4 Technicians)",
        costScore: "₹18,000 (Low Budget Impact)",
        coordinationRequired: "DJB only",
        confidence: "High",
        recommendationVerdict: "SUB-OPTIMAL: High risk of repeated pavement collapse and secondary contamination."
      },
      {
        id: "SIM-B",
        title: "Option B: Full 24-Meter Ductile Iron Segment Replacement & PWD Road Re-bedding",
        description: "Comprehensive replacement of aged 1988 line with modern polyurethane-lined ductile iron + PWD granular sub-base reconstruction.",
        timeToIntervention: "18–24 Hours",
        expectedResolutionTime: "36 Hours (Temporary water tankers provided)",
        affectedPopulationReduction: "98% permanent fix",
        recurrenceRisk: "LOW (< 5% recurrence over 15 years)",
        resourceRequirement: "High (DJB Trenching Unit + PWD Roller Squad)",
        costScore: "₹1,45,000 (Capital Infrastructure Allocation)",
        coordinationRequired: "DJB + PWD + Delhi Traffic Police",
        confidence: "High",
        recommendationVerdict: "RECOMMENDED: Eliminates long-term civic disruption and complies with Zero Dead-End mandate."
      },
      {
        id: "SIM-C",
        title: "Option C: Multi-Department Joint Field Inspection & Pressure Testing",
        description: "Before mechanical excavation, run acoustic leak correlation and dye testing across DJB and MCD assets.",
        timeToIntervention: "2–3 Hours",
        expectedResolutionTime: "8 Hours (Diagnostic phase only)",
        affectedPopulationReduction: "0% (Diagnostic only)",
        recurrenceRisk: "N/A",
        resourceRequirement: "Medium (Diagnostic Engineers from DJB & PWD)",
        costScore: "₹6,500",
        coordinationRequired: "DJB + MCD",
        confidence: "Very High",
        recommendationVerdict: "Essential first step before executing Option B."
      },
      {
        id: "SIM-D",
        title: "Option D: Passive 7-Day Sensor Monitoring & Water Rationing",
        description: "Ration line pressure and monitor acoustic logger signals without active excavation.",
        timeToIntervention: "Immediate",
        expectedResolutionTime: "Unresolved (7+ Days)",
        affectedPopulationReduction: "10% (Reduced pressure only)",
        recurrenceRisk: "CRITICAL (100% road cave-in hazard)",
        resourceRequirement: "Low",
        costScore: "₹2,000",
        coordinationRequired: "None",
        confidence: "Low",
        recommendationVerdict: "REJECTED: Poses unacceptable public health and vehicular accident hazards."
      }
    ],
    relatedGrievanceIds: [
      "DL-2026-W14-0892",
      "DL-2026-W14-0895",
      "DL-2026-W14-0901",
      "DL-2026-W14-0912"
    ],
    humanDecisions: [
      {
        id: "DEC-01",
        decision: "ACCEPT_RECOMMENDATION",
        actionSelected: "Option B: Full 24-Meter Ductile Iron Segment Replacement & PWD Road Re-bedding",
        officer: "Er. Sanjay Sharma (AEE)",
        timestamp: "Sep 16, 2026 10:30 AM",
        notes: "Field inspection confirmed 1988 cast iron pipe is brittle. Authorizing trench squad with PWD coordination."
      }
    ]
  },
  {
    id: "INC-2026-DEL-02",
    title: "Moolchand Underpass Storm Drain Inversion & Asphalt Erosion",
    summary: "Heavy monsoon drain backflow at Moolchand arterial junction. Underground masonry drain collapse has washed away subsoil under asphalt, creating an acute 40cm cavity and flooding outer ring lanes.",
    incidentType: "HAZARD_STRUCTURAL",
    status: "Action Planned",
    stage: "EMERGING",
    stageVelocity: "+180% increase over 4 days",
    severity: "HIGH",
    confidence: "Medium-High (84% signal correlation)",
    signalCount: 21,
    formalComplaintsCount: 11,
    citizenObservationsCount: 10,
    affectedArea: "Ward 8 → Ward 9 (Lajpat Nagar / Moolchand Ring Road)",
    affectedPopulation: "Major Commuter Corridor (~35,000 vehicles/day)",
    firstDetectedAt: "2026-09-14 07:45 AM",
    lastUpdatedAt: "25 mins ago",
    departments: [
      { name: "Public Works Department (PWD)", lead: true, cases: 15, role: "Structural cavity filling, bitumen cold-patching & traffic cordoning" },
      { name: "Municipal Corporation of Delhi (MCD)", lead: false, cases: 6, role: "Heavy silt extraction from underpass culvert drain" }
    ],
    complaintDna: {
      issueType: "Roads & Structural Infrastructure",
      subIssue: "Underpass Silt Inversion & Asphalt Cavitation",
      service: "Arterial Road Network",
      asset: "Outer Ring Road Moolchand Underpass Slip Way",
      locationContext: "Arterial Ring Road Junction (Below Moolchand Flyover)",
      department: "Public Works Department (PWD)",
      subDepartment: "South-East Road Division",
      severity: "HIGH",
      urgency: "CRITICAL",
      symptoms: ["40cm deep road cavity", "Two-wheeler skidding", "Standing storm runoff puddle", "Traffic bottleneck"],
      entities: ["Moolchand Underpass Entry", "Flyover Pillar #12", "Lajpat Nagar Central Market Turn"],
      possibleCauses: ["Stormwater pipe rupture eroding asphalt base", "Heavy monsoon silt accumulation"],
      affectedPopulation: ["Daily ring road commuters", "Lajpat Nagar local merchants"],
      temporalPattern: "Severe peak hour congestion (08:30–11:00 AM, 05:30–08:30 PM)",
      environmentalContext: "Recent heavy rainfall causing localized subsoil liquefaction"
    },
    timeline: [
      { date: "14 Sept", time: "07:45 AM", stage: "First Weak Signal", desc: "Citizen photo uploaded showing pothole water pooling under flyover.", count: 2, source: "Citizen Signal" },
      { date: "15 Sept", time: "09:00 AM", stage: "Cluster Detected", desc: "8 reports logged; 2 scooter skidding accidents noted.", count: 10, source: "AI Clustering" },
      { date: "16 Sept", time: "02:00 PM", stage: "Cross-Dept Escalation", desc: "MCD drain silt identified as primary cause of underpass pooling.", count: 18, source: "Cross-Dept Detector" },
      { date: "17 Sept", time: "08:30 AM", stage: "Emerging Stage Triggered", desc: "Arterial ring road traffic delay reached 45 mins; emergency cordon deployed.", count: 21, source: "Escalation Engine" }
    ],
    spreadGeo: [
      { step: "Day 1 (Sep 14)", ward: "Ward 8", lat: 28.5680, lng: 77.2335, radiusMeters: 100, signalCount: 2, label: "Slip road puddle", color: "#10B981" },
      { step: "Day 3 (Sep 16)", ward: "Ward 8 & 9", lat: 28.5690, lng: 77.2350, radiusMeters: 350, signalCount: 14, label: "Ring road lane obstruction", color: "#F59E0B" },
      { step: "Day 4 (Sep 17)", ward: "Ward 8 & 9", lat: 28.5700, lng: 77.2365, radiusMeters: 700, signalCount: 21, label: "Arterial junction congestion", color: "#EF4444" }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-02-1",
        title: "Stormwater Culvert Rupture & Subsoil Cavity Formation",
        confidence: "HIGH",
        confidenceScore: 85,
        evidence: [
          "Photographic evidence shows 40cm void underneath asphalt layer",
          "MCD drain maintenance records show culvert silt cleaning overdue by 4 months"
        ],
        verificationRequired: true,
        recommendedVerification: "Endoscopic camera inspection through culvert manhole #3"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "Public Works Department (PWD)",
      sharedProblemSummary: "MCD drain silt backup is breaking PWD road subgrade.",
      departments: [
        { dept: "Public Works Department (PWD)", cases: 15, icon: "Wrench", badgeColor: "#0E5E3A", impactSummary: "Carriageway structural cavity." },
        { dept: "Municipal Corporation of Delhi (MCD)", cases: 6, icon: "Building2", badgeColor: "#7C3AED", impactSummary: "Culvert silt blockage." }
      ],
      coordinationRecommendation: "Joint Night Operation: MCD deploys super-sucker truck at 11:00 PM; PWD lays rapid-hardening bituminous cold-mix."
    },
    civicMemory: [
      {
        year: "2024",
        date: "18 August 2024",
        incidentId: "PWD-HIST-2024-112",
        title: "Moolchand Slip Road Subsidence",
        actionTaken: "Cold-mix asphalt patch without culvert desilting",
        outcome: "Cavity reappeared after 3 weeks.",
        lessonsLearned: "Subgrade cavities cannot hold asphalt if underlying storm culvert is obstructed."
      }
    ],
    simulations: [
      {
        id: "SIM-02-A",
        title: "Option A: Emergency Bituminous Cold-Patch",
        description: "Direct bitumen fill of 40cm cavity without drain clearance.",
        timeToIntervention: "2 Hours",
        expectedResolutionTime: "3 Hours",
        affectedPopulationReduction: "60%",
        recurrenceRisk: "HIGH (80% failure upon next downpour)",
        resourceRequirement: "Low",
        costScore: "₹12,000",
        coordinationRequired: "PWD only",
        confidence: "Medium",
        recommendationVerdict: "Temporary emergency measure only."
      },
      {
        id: "SIM-02-B",
        title: "Option B: Culvert Silt Extraction + Reinforced Concrete Sub-base Re-bedding",
        description: "MCD super-sucker clears culvert; PWD constructs reinforced concrete apron with mastic asphalt.",
        timeToIntervention: "8 Hours",
        expectedResolutionTime: "18 Hours",
        affectedPopulationReduction: "95%",
        recurrenceRisk: "LOW (< 8%)",
        resourceRequirement: "Medium-High",
        costScore: "₹85,000",
        coordinationRequired: "PWD + MCD",
        confidence: "High",
        recommendationVerdict: "RECOMMENDED ACTION"
      }
    ],
    relatedGrievanceIds: ["DL-2026-W08-0419"],
    humanDecisions: []
  },
  {
    id: "INC-2026-DEL-03",
    title: "Kalkaji Market 11kV Feeder Transformer Overheating & Arc Hazard",
    summary: "Thermal degradation of 400kVA transformer bushings in high-density market pocket. Frequent voltage surges and visible electric arc flashes creating acute public safety hazard.",
    incidentType: "ELECTRICAL_FIRE",
    status: "Investigating",
    stage: "GROWING",
    stageVelocity: "+120% in 48 hours",
    severity: "CRITICAL",
    confidence: "High (92% signal correlation)",
    signalCount: 9,
    formalComplaintsCount: 5,
    citizenObservationsCount: 4,
    affectedArea: "Ward 5 (Kalkaji Main Market Pocket)",
    affectedPopulation: "120 Retail Outlets + ~350 Residential Units",
    firstDetectedAt: "2026-09-15 03:30 PM",
    lastUpdatedAt: "1 hour ago",
    departments: [
      { name: "BSES Rajdhani Power Limited", lead: true, cases: 9, role: "Transformer isolation, HT bushing replacement & load rebalancing" }
    ],
    complaintDna: {
      issueType: "Electricity & Power Grid",
      subIssue: "Distribution Transformer Arc Flash & Thermal Overload",
      service: "Urban Low-Voltage Power Grid",
      asset: "400 kVA Pole-Mounted Step-Down Transformer (TR-05-4)",
      locationContext: "Dense commercial market alleyway (Gali No. 3)",
      department: "BSES Rajdhani Power Limited",
      subDepartment: "Kalkaji Division",
      severity: "CRITICAL",
      urgency: "CRITICAL",
      symptoms: ["Loud buzzing arc sparks", "Transformer oil leak", "Voltage drops to 140V", "Complete street blackout"],
      entities: ["Main Market Kalkaji Gol Chakkar", "Gali No. 3", "Kalkaji 11kV Substation"],
      possibleCauses: ["Dielectric oil degradation", "Unbalanced commercial air conditioning load"],
      affectedPopulation: ["120 retail shops", "350 residential flats above shops"],
      temporalPattern: "Peak spark discharges during afternoon peak cooling load (01:00–04:00 PM)",
      environmentalContext: "Ambient heat wave elevating transformer core temperature above 85°C"
    },
    timeline: [
      { date: "15 Sept", time: "03:30 PM", stage: "First Weak Signal", desc: "Shopkeeper reported unusual buzzing hum and burning smell.", count: 1, source: "Citizen Signal" },
      { date: "16 Sept", time: "01:10 PM", stage: "Active Arc Flash Reported", desc: "Citizen video submitted showing sparks flying from transformer.", count: 6, source: "Formal Complaint" },
      { date: "16 Sept", time: "01:12 PM", stage: "SCADA Telemetry Confirmation", desc: "Remote feeder load spike recorded; auto-tripping alert triggered.", count: 9, source: "Grid Telemetry" }
    ],
    spreadGeo: [
      { step: "Initial (Sep 15)", ward: "Ward 5", lat: 28.5440, lng: 77.2585, radiusMeters: 80, signalCount: 2, label: "Transformer pole hotspot", color: "#F59E0B" },
      { step: "Current (Sep 16-17)", ward: "Ward 5", lat: 28.5445, lng: 77.2592, radiusMeters: 220, signalCount: 9, label: "Feeder blackout zone", color: "#EF4444" }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-03-1",
        title: "Bushing Seal Breakdown & Low Dielectric Oil Level",
        confidence: "HIGH",
        confidenceScore: 92,
        evidence: [
          "Video shows oil seepage along low-voltage ceramic bushings",
          "Thermal scan camera telemetry indicates 92°C spot temperature on Phase B"
        ],
        verificationRequired: true,
        recommendedVerification: "Breakdown voltage test on oil sample by Mobile Testing Lab"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "BSES Rajdhani Power Limited",
      sharedProblemSummary: "Electrical fire hazard in congested market requiring local municipal cordon.",
      departments: [
        { dept: "BSES Rajdhani Power Limited", cases: 9, icon: "Zap", badgeColor: "#DC2626", impactSummary: "11kV arc flash and oil explosion hazard." }
      ],
      coordinationRecommendation: "Remote trip Feeder 4; mobilize mobile transformer van DL-1L-9022."
    },
    civicMemory: [
      {
        year: "2025",
        date: "05 July 2025",
        incidentId: "BSES-HIST-2025-044",
        title: "Kalkaji Transformer Thermal Failure",
        actionTaken: "Emergency bushing swap & nitrogen cooling flush",
        outcome: "Full restoration within 3 hours; zero collateral damage.",
        lessonsLearned: "Early oil breakdown detection prevents explosive arc flash."
      }
    ],
    simulations: [
      {
        id: "SIM-03-A",
        title: "Option A: Remote Feeder Trip + Mobile Substation Bypass",
        description: "Safely isolate feeder and plug in 500kVA truck-mounted transformer while repairing primary unit.",
        timeToIntervention: "45 Mins",
        expectedResolutionTime: "2.5 Hours",
        affectedPopulationReduction: "100%",
        recurrenceRisk: "LOW (< 5%)",
        resourceRequirement: "High (Mobile Substation Van)",
        costScore: "₹35,000",
        coordinationRequired: "BSES Grid Control",
        confidence: "Very High",
        recommendationVerdict: "RECOMMENDED ACTION"
      }
    ],
    relatedGrievanceIds: ["DL-2026-W05-0298"],
    humanDecisions: []
  }
];

export const CIVIC_INTELLIGENCE_METRICS = {
  activeIncidents: 3,
  emergingProblemsCount: 8,
  criticalProblemsCount: 2,
  growingProblemsCount: 5,
  signalsDetectedLast24h: 48,
  crossDepartmentIncidentsCount: 2,
  avgProblemDetectionHours: "6.2 Hours (vs 96h legacy)",
  avgEscalationTimeHours: "14.5 Hours",
  recurrencePreventedRate: "78.4%",
  actionSimulationUsageRate: "92.1%",
  citizenSignalContribution: "41.6% of all early discoveries"
};
