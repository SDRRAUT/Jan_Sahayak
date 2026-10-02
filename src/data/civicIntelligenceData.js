/**
 * CIVIC INTELLIGENCE SEED DATA & ENTERPRISE CONTRACTS (WAGHOLI, PUNE)
 * 
 * Implements:
 * 1. Civic Signals (Lightweight citizen observations)
 * 2. Civic Incidents (Clustered & Correlated Civic Incidents)
 * 3. Complaint DNA (Semantic fingerprinting across 18 dimensions)
 * 4. Problem Spread Geographic Intelligence (Progression over time in Wagholi)
 * 5. Cross-Department Correlation & Shared Problem Graph (PMC Water, PWD Pune, PMC SWM, MSEDCL)
 * 6. Civic Memory (Institutional long-term resolution history)
 * 7. Root-Cause Hypotheses (Evidence-traceable reasoning)
 * 8. Action Simulations (Multi-scenario comparative decision support)
 * 9. Problem Escalation Engine Stages (NORMAL -> GROWING -> EMERGING -> CRITICAL)
 */

export const CIVIC_SIGNALS = [
  {
    id: "SIG-WAG-001",
    incidentId: "INC-2026-PUNE-WAG-01",
    citizenName: "Santosh Gawade",
    ward: "Wagholi Ward 29 (Ivy Estate & Kesnand Road)",
    channel: "VOICE_NOTE",
    rawInput: "Ivy Estate main gate samne roadside pipeline leak hot ahe, paani rastyavar vahat ahe.",
    translatedText: "Continuous potable water leakage from roadside pipeline in front of Ivy Estate main gate since last 2 days.",
    category: "Water Supply & Contamination",
    inferredAsset: "200mm HDPE Supply Feeder Main",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    lat: 18.5760,
    lng: 73.9810,
    timestamp: "2026-10-01 07:45 AM",
    status: "CLUSTERED",
    confidence: "High (98%)"
  },
  {
    id: "SIG-WAG-002",
    incidentId: "INC-2026-PUNE-WAG-01",
    citizenName: "Priyanka Jadhav",
    ward: "Wagholi Ward 29 (Ivy Estate & Kesnand Road)",
    channel: "QUICK_TEXT",
    rawInput: "Morning municipal tap water smells foul like drainage in Tower B & C.",
    translatedText: "Morning municipal tap water smells foul like drainage in Tower B & C.",
    category: "Water Supply & Contamination",
    inferredAsset: "Drinking Water Supply Feeder",
    hasPhoto: false,
    lat: 18.5765,
    lng: 73.9818,
    timestamp: "2026-10-01 08:30 AM",
    status: "CLUSTERED",
    confidence: "High (94%)"
  },
  {
    id: "SIG-WAG-003",
    incidentId: "INC-2026-PUNE-WAG-01",
    citizenName: "Anand Rathi",
    ward: "Wagholi Ward 29 (Ivy Estate & Kesnand Road)",
    channel: "QUICK_TEXT",
    rawInput: "Low water pressure on 1st and 2nd floors along Kesnand road since yesterday.",
    translatedText: "Low water pressure on 1st and 2nd floors along Kesnand road since yesterday.",
    category: "Water Supply & Contamination",
    inferredAsset: "Distribution Pressure Feeder",
    hasPhoto: false,
    lat: 18.5772,
    lng: 73.9825,
    timestamp: "2026-10-01 09:15 AM",
    status: "CLUSTERED",
    confidence: "Medium (88%)"
  },
  {
    id: "SIG-WAG-004",
    incidentId: "INC-2026-PUNE-WAG-01",
    citizenName: "Ritu Sharma",
    ward: "Wagholi Ward 28 (Baif Road & Market Yard)",
    channel: "PHOTO_UPLOAD",
    rawInput: "Road asphalt has sunken and softened near Baif Road entry junction due to water seepage.",
    translatedText: "Road asphalt has sunken and softened near Baif Road entry junction due to water seepage.",
    category: "Roads & Infrastructure",
    inferredAsset: "Arterial Road Subgrade",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    lat: 18.5810,
    lng: 73.9835,
    timestamp: "2026-10-01 10:30 AM",
    status: "CLUSTERED",
    confidence: "High (96%)"
  },
  {
    id: "SIG-WAG-005",
    incidentId: "INC-2026-PUNE-WAG-01",
    citizenName: "Suresh Narang",
    ward: "Wagholi Ward 29 (Ivy Estate & Kesnand Road)",
    channel: "VOICE_NOTE",
    rawInput: "Water pooling near Lexicon Kids school boundary wall even though no rain today.",
    translatedText: "Water pooling near Lexicon Kids school boundary wall even though no rain today.",
    category: "Water Supply & Contamination",
    inferredAsset: "Underground Supply Valve",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
    lat: 18.5755,
    lng: 73.9805,
    timestamp: "2026-10-01 11:20 AM",
    status: "CLUSTERED",
    confidence: "High (92%)"
  },
  {
    id: "SIG-WAG-006",
    incidentId: "INC-2026-PUNE-WAG-02",
    citizenName: "Karan Johar",
    ward: "Wagholi Ward 28 (Baif Road & Market Yard)",
    channel: "PHOTO_UPLOAD",
    rawInput: "Baif Road vegetable market corner has massive open garbage dump spilling into storm drain.",
    translatedText: "Baif Road vegetable market corner has massive open garbage dump spilling into storm drain.",
    category: "Sanitation & Solid Waste",
    inferredAsset: "PMC Waste Collection Point & Storm Drain",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
    lat: 18.5818,
    lng: 73.9845,
    timestamp: "2026-10-01 08:30 AM",
    status: "CLUSTERED",
    confidence: "High (95%)"
  },
  {
    id: "SIG-WAG-007",
    incidentId: "INC-2026-PUNE-WAG-03",
    citizenName: "Deepak Chawla",
    ward: "Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)",
    channel: "VOICE_NOTE",
    rawInput: "Transformer near Raisoni College gate making loud buzzing spark sounds intermittently.",
    translatedText: "Transformer near Raisoni College gate making loud buzzing spark sounds intermittently.",
    category: "Electricity & Power Grid",
    inferredAsset: "400kVA Distribution Transformer (TR-WAG-04)",
    hasPhoto: false,
    lat: 18.5802,
    lng: 73.9780,
    timestamp: "2026-10-01 11:45 AM",
    status: "CLUSTERED",
    confidence: "Critical (98%)"
  }
];

export const CIVIC_INCIDENTS = [
  {
    id: "INC-2026-PUNE-WAG-01",
    title: "Potable Water Pipeline Joint Rupture & Cross-Subsoil Infiltration (Kesnand-Ivy Corridor)",
    summary: "Subsurface joint fracture in 200mm feeder line along Kesnand Road. Continuous potable water leakage has saturated road subgrade across Wagholi Wards 28 & 29, causing negative pressure sewer infiltration into residential lines and softening arterial pavement.",
    incidentType: "INFRASTRUCTURE_FAILURE",
    status: "Investigating", // Detected | Investigating | Verified | Action Planned | Action In Progress | Contained | Resolved | Monitoring | Closed
    stage: "GROWING", // NORMAL | GROWING | EMERGING | CRITICAL
    stageVelocity: "+240% increase over 5 days",
    severity: "CRITICAL",
    confidence: "High (91% signal correlation)",
    signalCount: 37,
    formalComplaintsCount: 18,
    citizenObservationsCount: 19,
    affectedArea: "Wagholi Ward 29 → Ward 28 (Ivy Estate & Kesnand Road Corridor)",
    affectedPopulation: "~4,500 Citizens (1,100 Households)",
    firstDetectedAt: "2026-09-28 08:15 AM",
    lastUpdatedAt: "10 mins ago",
    departments: [
      { name: "PMC Water Supply Department", lead: true, cases: 24, role: "Main potable carrier isolation, trench excavation & HDPE pipe coupling" },
      { name: "PWD Pune / PMRDA", lead: false, cases: 9, role: "Road pavement stabilizing & subsoil drainage rehabilitation" },
      { name: "PMC Solid Waste Management", lead: false, cases: 4, role: "Adjacent storm drain blockage clearing & sanitization" }
    ],
    complaintDna: {
      issueType: "Water Infrastructure",
      subIssue: "Pipeline Rupture & Negative Pressure Contamination",
      service: "Potable Municipal Water Distribution",
      asset: "200mm HDPE Feeder Main (Line-WAG-29)",
      locationContext: "Underground roadside utility corridor along Kesnand Road (Depth 1.6m)",
      department: "PMC Water Supply Department",
      subDepartment: "Wagholi Sub-Division Maintenance",
      severity: "CRITICAL",
      urgency: "HIGH",
      symptoms: [
        "Intermittent pressure deficit during morning pumping hours",
        "Sewage backflow odor in drinking taps at Ivy Estate",
        "Road sub-base waterlogging and asphalt wave near gate",
        "Foul yellowish water discharge in Kesnand Road societies"
      ],
      entities: [
        "Ivy Estate Main Commercial Gate",
        "Kesnand Road Feeder Valve #4",
        "Wagholi-Kesnand Arterial Road",
        "Lexicon Kids School"
      ],
      possibleCauses: [
        "HDPE joint flange seal failure from high surge pressure",
        "Loss of soil compaction due to heavy dumper truck traffic",
        "Negative pressure cross-siphoning from adjacent unlined storm drain"
      ],
      affectedPopulation: [
        "1,100 residential apartments in Ivy Estate & Kesnand Rd",
        "Wagholi Commercial Market (48 shops)",
        "Lexicon Kids School (~350 students)"
      ],
      temporalPattern: "Severe during 06:30–10:00 AM municipal pumping cycle",
      environmentalContext: "Saturated subsoil accelerating joint cavity expansion"
    },
    timeline: [
      {
        date: "28 Sept",
        time: "08:15 AM",
        stage: "First Weak Signal Detected",
        desc: "Citizen voice note SIG-WAG-001 logged water trickling out from road seam near Ivy Estate gate.",
        count: 1,
        source: "Citizen Signal"
      },
      {
        date: "29 Sept",
        time: "09:30 AM",
        stage: "Signal Cluster Formation",
        desc: "6 related citizen observations logged within 250m radius describing pressure loss and damp asphalt.",
        count: 7,
        source: "AI Clustering"
      },
      {
        date: "30 Sept",
        time: "11:00 AM",
        stage: "Formal Complaint Wave",
        desc: "14 formal citizen grievances submitted. AI Incident Engine aggregates signals into Civic Incident INC-2026-PUNE-WAG-01.",
        count: 21,
        source: "Incident Engine"
      },
      {
        date: "01 Oct",
        time: "08:00 AM",
        stage: "Geographic Spread Detected",
        desc: "Seepage crossed jurisdictional boundary along Kesnand Road into Baif Road junction.",
        count: 29,
        source: "Geographic Engine"
      },
      {
        date: "01 Oct",
        time: "11:30 AM",
        stage: "Cross-Department Linkage",
        desc: "PWD Pune received 3 road depression reports along the identical pipeline corridor. PMC SWM reported drain backflow.",
        count: 34,
        source: "Cross-Dept Detector"
      },
      {
        date: "01 Oct",
        time: "02:00 PM",
        stage: "Escalation to GROWING Stage",
        desc: "Signal velocity reached +240%. High public distress triggers multi-department supervisory alert.",
        count: 37,
        source: "Escalation Engine"
      }
    ],
    spreadGeo: [
      {
        step: "Day 1 (Sep 28)",
        ward: "Wagholi Ward 29 (Origin)",
        lat: 18.5760,
        lng: 73.9810,
        radiusMeters: 120,
        signalCount: 2,
        label: "Initial weak signal at Kesnand Rd valve pit",
        color: "#10B981"
      },
      {
        step: "Day 3 (Sep 30)",
        ward: "Wagholi Ward 29 (Ivy Estate Loop)",
        lat: 18.5768,
        lng: 73.9818,
        radiusMeters: 380,
        signalCount: 18,
        label: "Subsurface spread to Ivy Estate residential loop",
        color: "#F59E0B"
      },
      {
        step: "Day 5 (Oct 01)",
        ward: "Wagholi Wards 28 & 29 (Arterial Corridor)",
        lat: 18.5785,
        lng: 73.9830,
        radiusMeters: 850,
        signalCount: 37,
        label: "Full corridor impact: drinking water + road dip + drain backflow",
        color: "#EF4444"
      }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-WAG-01",
        title: "Flange Joint Separation in 200mm HDPE Main Feeder Line",
        confidence: "HIGH",
        confidenceScore: 91,
        evidence: [
          "37 correlated citizen signals & complaints clustered along the same 450m Kesnand utility corridor",
          "PMC GIS asset register marks line installation vintage under heavy construction traffic stress",
          "SCADA telemetry confirms local line pressure drop from 3.4 bar to 0.9 bar during morning pumping",
          "Historical precedent: Case PMC-HIST-2025-081 occurred 150m away under identical joint failure symptoms"
        ],
        verificationRequired: true,
        recommendedVerification: "Deploy acoustic leak correlator & ultrasonic pipe sensor near Ivy Estate Gate #1"
      },
      {
        id: "RCH-WAG-02",
        title: "Cross-Siphoning from Damaged Stormwater Masonry Drain",
        confidence: "MEDIUM",
        confidenceScore: 72,
        evidence: [
          "5 citizen complaints report foul drainage odor specifically during non-supply low-pressure hours",
          "PMC SWM inspection note #PMC-SN-4102 notes cracked masonry wall in storm drain along Kesnand Road"
        ],
        verificationRequired: true,
        recommendedVerification: "Conduct non-toxic fluorometric dye test at upstream storm drain inlet"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "PMC Water Supply Department",
      sharedProblemSummary: "Underground water main rupture is softening road base and causing drain overflow — affecting 3 civic departments.",
      departments: [
        {
          dept: "PMC Water Supply Department",
          cases: 24,
          icon: "Droplet",
          badgeColor: "#0E5E3A",
          impactSummary: "Main potable water pressure loss & contamination risk across 1,100 households."
        },
        {
          dept: "PWD Pune / PMRDA",
          cases: 9,
          icon: "Wrench",
          badgeColor: "#D97706",
          impactSummary: "Road subgrade saturation causing 30cm asphalt depression. Acute hazard for two-wheelers."
        },
        {
          dept: "PMC Solid Waste Management",
          cases: 4,
          icon: "Building2",
          badgeColor: "#7C3AED",
          impactSummary: "Storm drain blockage and standing water pools near commercial market shops."
        }
      ],
      coordinationRecommendation: "Initiate Unified Joint Action: PMC Water isolates feeder at 11:00 AM; PWD inspects road sub-base concurrently before asphalt re-bedding; PMC SWM flushes drain barriers."
    },
    civicMemory: [
      {
        year: "2025",
        date: "14 June 2025",
        incidentId: "PMC-HIST-2025-081",
        title: "200mm HDPE Main Joint Failure (Kesnand Road)",
        actionTaken: "Emergency split-sleeve repair clamp + sodium hypochlorite flush",
        outcome: "Resolved immediate pressure deficit for 6 months, but ground settlement stressed adjacent joint.",
        lessonsLearned: "Clamping HDPE without proper electrofusion coupling causes secondary joint stress 50m downstream."
      },
      {
        year: "2024",
        date: "22 March 2024",
        incidentId: "PWD-HIST-2024-412",
        title: "Road Sinking at Baif Road Junction",
        actionTaken: "Temporary bitumen patch over road surface without underground pipe realignment",
        outcome: "Pavement recaved after 8 weeks following heavy monsoon runoff.",
        lessonsLearned: "Patching road surface without replacing defective pipe guarantees structural pavement collapse."
      }
    ],
    simulations: [
      {
        id: "SIM-WAG-A",
        title: "Option A: Rapid Temporary Clamping (Split-Sleeve)",
        description: "Excavate single 1.5m pit at Ivy Estate gate and install emergency stainless steel split-sleeve clamp.",
        timeToIntervention: "4–6 Hours",
        expectedResolutionTime: "Same Day (6 Hours)",
        affectedPopulationReduction: "80% immediate relief",
        recurrenceRisk: "HIGH (60% probability of recurrence within 6 months)",
        resourceRequirement: "Low (1 Repair Squad + 4 Technicians)",
        costScore: "₹22,000 (Low Budget Impact)",
        coordinationRequired: "PMC Water only",
        confidence: "High",
        recommendationVerdict: "SUB-OPTIMAL: High risk of repeated pavement collapse and secondary contamination."
      },
      {
        id: "SIM-WAG-B",
        title: "Option B: Full 24-Meter Electrofusion HDPE Replacement & PWD Road Re-bedding",
        description: "Comprehensive replacement with heavy-duty PE100 PN16 HDPE pipe + PWD granular sub-base reconstruction.",
        timeToIntervention: "18–24 Hours",
        expectedResolutionTime: "36 Hours (Temporary water tankers provided)",
        affectedPopulationReduction: "98% permanent fix",
        recurrenceRisk: "LOW (< 4% recurrence over 15 years)",
        resourceRequirement: "High (PMC Trenching Unit + PWD Roller Squad)",
        costScore: "₹1,65,000 (Capital Infrastructure Allocation)",
        coordinationRequired: "PMC Water + PWD Pune + Pune Traffic Police",
        confidence: "High",
        recommendationVerdict: "RECOMMENDED: Eliminates long-term civic disruption and complies with Zero Dead-End mandate."
      },
      {
        id: "SIM-WAG-C",
        title: "Option C: Multi-Department Joint Field Inspection & Pressure Testing",
        description: "Before mechanical excavation, run acoustic leak correlation and dye testing across PMC and PWD assets.",
        timeToIntervention: "2–3 Hours",
        expectedResolutionTime: "8 Hours (Diagnostic phase only)",
        affectedPopulationReduction: "0% (Diagnostic only)",
        recurrenceRisk: "N/A",
        resourceRequirement: "Medium (Diagnostic Engineers from PMC & PWD)",
        costScore: "₹8,500",
        coordinationRequired: "PMC + PWD",
        confidence: "Very High",
        recommendationVerdict: "Essential first step before executing Option B."
      },
      {
        id: "SIM-WAG-D",
        title: "Option D: Passive 7-Day Sensor Monitoring & Water Rationing",
        description: "Ration line pressure and monitor acoustic logger signals without active excavation.",
        timeToIntervention: "Immediate",
        expectedResolutionTime: "Unresolved (7+ Days)",
        affectedPopulationReduction: "10% (Reduced pressure only)",
        recurrenceRisk: "CRITICAL (100% road cave-in hazard)",
        resourceRequirement: "Low",
        costScore: "₹2,500",
        coordinationRequired: "None",
        confidence: "Low",
        recommendationVerdict: "REJECTED: Poses unacceptable public health and vehicular accident hazards."
      }
    ],
    relatedGrievanceIds: [
      "PN-2026-WAG-0101",
      "PN-2026-WAG-0105",
      "PN-2026-WAG-0114",
      "PN-2026-WAG-0118"
    ],
    humanDecisions: [
      {
        id: "DEC-WAG-01",
        decision: "ACCEPT_RECOMMENDATION",
        actionSelected: "Option B: Full 24-Meter Electrofusion HDPE Replacement & PWD Road Re-bedding",
        officer: "Er. Sanjay Sharma (EE Wagholi)",
        timestamp: "Oct 01, 2026 10:30 AM",
        notes: "Field inspection confirmed HDPE flange joint damaged. Authorizing trench squad with PWD coordination."
      }
    ]
  },
  {
    id: "INC-2026-PUNE-WAG-02",
    title: "Baif Road Market Solid Waste Dump Spill & Storm Drain Clogging",
    summary: "Massive solid waste accumulation at Baif Road vegetable market junction overflowing into adjacent stormwater culvert. Organic waste decay creating toxic leachate and blocking monsoon runoff.",
    incidentType: "HAZARD_ENVIRONMENTAL",
    status: "Action Planned",
    stage: "EMERGING",
    stageVelocity: "+180% increase over 4 days",
    severity: "HIGH",
    confidence: "Medium-High (86% signal correlation)",
    signalCount: 22,
    formalComplaintsCount: 12,
    citizenObservationsCount: 10,
    affectedArea: "Wagholi Ward 28 (Baif Road & Market Yard)",
    affectedPopulation: "Major Market Corridor (~15,000 daily visitors)",
    firstDetectedAt: "2026-09-29 07:45 AM",
    lastUpdatedAt: "25 mins ago",
    departments: [
      { name: "PMC Solid Waste Management", lead: true, cases: 16, role: "Heavy dumper compaction, leachate neutralizer & daily collection bin deployment" },
      { name: "PMC Drainage & Sewerage Department", lead: false, cases: 6, role: "Super-sucker desilting of culvert drain beneath market road" }
    ],
    complaintDna: {
      issueType: "Sanitation & Solid Waste",
      subIssue: "Commercial Market Garbage Spill & Drain Blockage",
      service: "Municipal Solid Waste Management",
      asset: "Baif Road Secondary Waste Transfer Node",
      locationContext: "Commercial market junction (Baif Road & Wagheshwar road connector)",
      department: "PMC Solid Waste Management",
      subDepartment: "Wagholi Sanitation Zone",
      severity: "HIGH",
      urgency: "CRITICAL",
      symptoms: ["Severe foul odor", "Stray animal menace", "Blocked stormwater drain", "Pedestrian walkway obstructed"],
      entities: ["Baif Road Market Yard", "Wagheshwar Temple Chowk", "PMC Feeder Bin #12"],
      possibleCauses: ["Missed 3-day dumper cycle during festival rush", "Direct commercial dumping by vegetable vendors"],
      affectedPopulation: ["Daily market shoppers", "Baif Road commercial shop owners"],
      temporalPattern: "Severe peak morning and evening market hours (07:30–11:00 AM, 05:30–09:00 PM)",
      environmentalContext: "Warm weather accelerating decomposition and fly breeding"
    },
    timeline: [
      { date: "29 Sept", time: "07:45 AM", stage: "First Weak Signal", desc: "Citizen photo uploaded showing garbage spill across pavement.", count: 2, source: "Citizen Signal" },
      { date: "30 Sept", time: "09:00 AM", stage: "Cluster Detected", desc: "8 reports logged; pedestrian obstruction and foul smell noted.", count: 10, source: "AI Clustering" },
      { date: "30 Sept", time: "02:00 PM", stage: "Cross-Dept Escalation", desc: "Waste spill blocked stormwater drain culvert, causing dirty water backup.", count: 18, source: "Cross-Dept Detector" },
      { date: "01 Oct", time: "08:30 AM", stage: "Emerging Stage Triggered", desc: "Market association submitted emergency escalation notice.", count: 22, source: "Escalation Engine" }
    ],
    spreadGeo: [
      { step: "Day 1 (Sep 29)", ward: "Wagholi Ward 28", lat: 18.5815, lng: 73.9840, radiusMeters: 90, signalCount: 2, label: "Market corner spill", color: "#10B981" },
      { step: "Day 2 (Sep 30)", ward: "Wagholi Ward 28", lat: 18.5820, lng: 73.9845, radiusMeters: 300, signalCount: 12, label: "Drain culvert blockage zone", color: "#F59E0B" },
      { step: "Day 3 (Oct 01)", ward: "Wagholi Ward 28", lat: 18.5825, lng: 73.9850, radiusMeters: 650, signalCount: 22, label: "Market commercial corridor impact", color: "#EF4444" }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-WAG-02-1",
        title: "Inadequate Collection Frequency & Culvert Grate Obstruction",
        confidence: "HIGH",
        confidenceScore: 88,
        evidence: [
          "Photographic evidence shows ~6 metric tons of uncollected solid waste",
          "PMC SWM fleet log shows 12MT hydraulic compactor missed 2 scheduled visits due to vehicle breakdown"
        ],
        verificationRequired: true,
        recommendedVerification: "Deploy drone survey & inspect culvert silt depth with sanitary supervisor"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "PMC Solid Waste Management",
      sharedProblemSummary: "Garbage overflow is blocking drainage department storm culvert.",
      departments: [
        { dept: "PMC Solid Waste Management", cases: 16, icon: "Trash2", badgeColor: "#0E5E3A", impactSummary: "6MT garbage accumulation." },
        { dept: "PMC Drainage & Sewerage Department", cases: 6, icon: "Droplet", badgeColor: "#7C3AED", impactSummary: "Culvert drain silt & plastic blockage." }
      ],
      coordinationRecommendation: "Joint Clean-Up Operation: PMC SWM deploys two 12MT hydraulic dumpers at 10:00 PM; Drainage team desilts culvert grate."
    },
    civicMemory: [
      {
        year: "2024",
        date: "18 August 2024",
        incidentId: "PMC-SWM-2024-112",
        title: "Baif Road Market Waste Overflow",
        actionTaken: "Manual cleaning without placing enclosed compactor bin",
        outcome: "Waste accumulated again within 5 days.",
        lessonsLearned: "Open waste points at high-density markets require permanent 4.5MT closed hook-loader bins."
      }
    ],
    simulations: [
      {
        id: "SIM-WAG-02-A",
        title: "Option A: Manual Shovel Clearance + Open Dumper Dispatch",
        description: "Deploy 8 sanitation workers to manually clear waste into open truck.",
        timeToIntervention: "3 Hours",
        expectedResolutionTime: "6 Hours",
        affectedPopulationReduction: "70%",
        recurrenceRisk: "HIGH (75% re-accumulation within 48h)",
        resourceRequirement: "Low-Medium",
        costScore: "₹15,000",
        coordinationRequired: "PMC SWM only",
        confidence: "Medium",
        recommendationVerdict: "Temporary cleanup only."
      },
      {
        id: "SIM-WAG-02-B",
        title: "Option B: Heavy Compactor Extraction + Permanent Hook-Loader Bin & Culvert Desilting",
        description: "Two 12MT compactors clear backlog, super-sucker cleans culvert, install 4.5MT enclosed container.",
        timeToIntervention: "6 Hours",
        expectedResolutionTime: "12 Hours",
        affectedPopulationReduction: "96%",
        recurrenceRisk: "LOW (< 10%)",
        resourceRequirement: "Medium-High",
        costScore: "₹95,000",
        coordinationRequired: "PMC SWM + Drainage Dept",
        confidence: "High",
        recommendationVerdict: "RECOMMENDED ACTION"
      }
    ],
    relatedGrievanceIds: ["PN-2026-WAG-0102", "PN-2026-WAG-0112", "PN-2026-WAG-0117"],
    humanDecisions: []
  },
  {
    id: "INC-2026-PUNE-WAG-03",
    title: "Nagar Road Highway (Raisoni Chowk) 11kV Feeder Transformer Overheating & Arc Hazard",
    summary: "Thermal degradation of 400kVA transformer bushings in high-load commercial zone along Pune-Nagar Highway. Frequent voltage surges and visible electric arc flashes creating acute public safety hazard.",
    incidentType: "ELECTRICAL_FIRE",
    status: "Investigating",
    stage: "GROWING",
    stageVelocity: "+120% in 48 hours",
    severity: "CRITICAL",
    confidence: "High (93% signal correlation)",
    signalCount: 11,
    formalComplaintsCount: 6,
    citizenObservationsCount: 5,
    affectedArea: "Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)",
    affectedPopulation: "140 Commercial Outlets + ~450 Residential Flats",
    firstDetectedAt: "2026-09-30 03:30 PM",
    lastUpdatedAt: "1 hour ago",
    departments: [
      { name: "MSEDCL Wagholi Sub-Division", lead: true, cases: 11, role: "Transformer isolation, HT bushing replacement & phase load rebalancing" }
    ],
    complaintDna: {
      issueType: "Electricity & Power Grid",
      subIssue: "Distribution Transformer Arc Flash & Thermal Overload",
      service: "Urban Low-Voltage Power Grid",
      asset: "400 kVA Pole-Mounted Step-Down Transformer (TR-WAG-04)",
      locationContext: "Commercial frontage along Pune-Nagar Highway near Raisoni College",
      department: "MSEDCL Wagholi Sub-Division",
      subDepartment: "Wagholi Feeder Operations",
      severity: "CRITICAL",
      urgency: "CRITICAL",
      symptoms: ["Loud buzzing arc sparks", "Transformer oil leak", "Voltage drops to 150V", "Commercial complex power tripping"],
      entities: ["Raisoni College Chowk", "Nagar Road Highway Commercial Complex", "Wagholi 22/11kV Substation"],
      possibleCauses: ["Dielectric oil degradation", "Unbalanced commercial AC load during peak hours"],
      affectedPopulation: ["140 retail shops & showrooms", "450 residential flats in surrounding towers"],
      temporalPattern: "Peak spark discharges during afternoon peak cooling load (01:00–04:30 PM)",
      environmentalContext: "Ambient heat elevating transformer core temperature above 88°C"
    },
    timeline: [
      { date: "30 Sept", time: "03:30 PM", stage: "First Weak Signal", desc: "Shopkeeper reported unusual buzzing hum and burning smell near transformer.", count: 1, source: "Citizen Signal" },
      { date: "01 Oct", time: "01:10 PM", stage: "Active Arc Flash Reported", desc: "Citizen video submitted showing sparks flying from HT transformer bushing.", count: 7, source: "Formal Complaint" },
      { date: "01 Oct", time: "01:15 PM", stage: "SCADA Telemetry Confirmation", desc: "Remote feeder load spike recorded; auto-tripping alert triggered.", count: 11, source: "Grid Telemetry" }
    ],
    spreadGeo: [
      { step: "Initial (Sep 30)", ward: "Wagholi Ward 27", lat: 18.5800, lng: 73.9778, radiusMeters: 75, signalCount: 2, label: "Transformer pole hotspot", color: "#F59E0B" },
      { step: "Current (Oct 01)", ward: "Wagholi Ward 27", lat: 18.5805, lng: 73.9785, radiusMeters: 240, signalCount: 11, label: "Feeder blackout zone", color: "#EF4444" }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-WAG-03-1",
        title: "Bushing Seal Breakdown & Low Dielectric Oil Level",
        confidence: "HIGH",
        confidenceScore: 94,
        evidence: [
          "Citizen video shows oil seepage along HT ceramic bushings",
          "Thermal scan camera telemetry indicates 94°C spot temperature on Phase B"
        ],
        verificationRequired: true,
        recommendedVerification: "Breakdown voltage test on transformer oil sample by MSEDCL Mobile Testing Lab"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "MSEDCL Wagholi Sub-Division",
      sharedProblemSummary: "Electrical fire hazard in busy highway junction requiring immediate power isolation.",
      departments: [
        { dept: "MSEDCL Wagholi Sub-Division", cases: 11, icon: "Zap", badgeColor: "#DC2626", impactSummary: "11kV arc flash and oil explosion hazard." }
      ],
      coordinationRecommendation: "Remote trip Feeder 4; mobilize mobile transformer van MH-12-PQ-8812."
    },
    civicMemory: [
      {
        year: "2025",
        date: "05 July 2025",
        incidentId: "MSEDCL-HIST-2025-044",
        title: "Wagholi Substation Feeder 2 Thermal Failure",
        actionTaken: "Emergency bushing swap & nitrogen cooling flush",
        outcome: "Full restoration within 3 hours; zero collateral damage.",
        lessonsLearned: "Early oil breakdown detection prevents explosive arc flash."
      }
    ],
    simulations: [
      {
        id: "SIM-WAG-03-A",
        title: "Option A: Remote Feeder Trip + Mobile Substation Bypass",
        description: "Safely isolate feeder and connect 500kVA truck-mounted transformer while repairing primary unit.",
        timeToIntervention: "45 Mins",
        expectedResolutionTime: "2.5 Hours",
        affectedPopulationReduction: "100%",
        recurrenceRisk: "LOW (< 5%)",
        resourceRequirement: "High (Mobile Substation Van)",
        costScore: "₹38,000",
        coordinationRequired: "MSEDCL Grid Control",
        confidence: "Very High",
        recommendationVerdict: "RECOMMENDED ACTION"
      }
    ],
    relatedGrievanceIds: ["PN-2026-WAG-0104", "PN-2026-WAG-0113", "PN-2026-WAG-0119"],
    humanDecisions: []
  },
  {
    id: "INC-2026-DEL-43",
    title: "Rohini Sector 14 Subsurface Water Line Fracture & Cavity Formation",
    summary: "Deep subsurface water main rupture in Sector 14 is softening road subgrade, leading to asphalt cavity and cross-contamination with adjacent stormwater line.",
    incidentType: "INFRASTRUCTURE_FAILURE",
    status: "Investigating",
    stage: "GROWING",
    stageVelocity: "+18.4 m/hr corridor spread",
    severity: "CRITICAL",
    confidence: "High (91% signal correlation)",
    signalCount: 26,
    formalComplaintsCount: 14,
    citizenObservationsCount: 12,
    affectedArea: "Ward 14 (Rohini Sector 14 - Pocket 1 & 2 Corridor)",
    affectedPopulation: "~2,400 Citizens (550 Households)",
    firstDetectedAt: "2026-09-28 09:15 AM",
    lastUpdatedAt: "8 mins ago",
    departments: [
      { name: "Delhi Jal Board (DJB)", lead: true, cases: 14, role: "Main potable carrier isolation, trench excavation & cast-iron replacement" },
      { name: "Public Works Department (PWD Delhi)", lead: false, cases: 8, role: "Road pavement stabilizing & subsoil drainage rehabilitation" },
      { name: "Municipal Corporation of Delhi (MCD)", lead: false, cases: 4, role: "Adjacent storm drain culvert de-silting & sanitization" }
    ],
    complaintDna: {
      issueType: "Water Infrastructure & Road Cavity",
      subIssue: "Negative-Pressure Siphonage & Subgrade Cavity",
      service: "Municipal Potable Water Distribution",
      asset: "1988 Cast-Iron Feeder Main (Sector 14 Alignment)",
      locationContext: "Roadside utility corridor near Mother Dairy Booth #14, Sector 14 (Depth 1.8m)",
      department: "Delhi Jal Board (DJB)",
      subDepartment: "Rohini Zone North-West Maintenance",
      severity: "CRITICAL",
      urgency: "HIGH",
      symptoms: [
        "Severe water discoloration (brownish tap discharge)",
        "Foul odor during low-pressure evening hours",
        "35cm structural road depression outside Mother Dairy",
        "Loss of drinking water pressure across Pocket 1 & 2"
      ],
      entities: [
        "Mother Dairy Booth #14",
        "Pocket 1 Market Chowk",
        "Sector 14 Arterial Ring Road",
        "DAV Public School Rohini"
      ],
      possibleCauses: [
        "Aged cast-iron pipe installed in 1988 exceeding design life",
        "Monsoon drainage backwash eroding sub-base soil compaction",
        "Heavy commercial goods traffic causing vibrational shear"
      ],
      affectedPopulation: [
        "550 residential households in Pocket 1 & 2",
        "24 shops in Sector 14 Market",
        "DAV Public School (~420 students)"
      ],
      temporalPattern: "Severe during 06:00–09:30 AM DJB pumping cycle",
      environmentalContext: "Subsoil saturation from pipe breach accelerating pavement cavitation."
    },
    timeline: [
      { date: "28 Sept", time: "09:15 AM", stage: "First Weak Signal Detected", desc: "Citizen reported damp asphalt and minor pressure dip near Mother Dairy booth #14.", count: 1, source: "Citizen Signal" },
      { date: "29 Sept", time: "10:30 AM", stage: "Signal Cluster Formation", desc: "5 related citizen reports logged in Sector 14 Pocket 1 reporting brown tap water.", count: 6, source: "AI Clustering" },
      { date: "30 Sept", time: "11:45 AM", stage: "Formal Complaint Wave", desc: "14 formal citizen grievances aggregated into Incident INC-2026-DEL-43.", count: 18, source: "Incident Engine" },
      { date: "01 Oct", time: "08:15 AM", stage: "Geographic Spread Detected", desc: "Road depression deepened to 35cm outside market; puddle spreading toward school.", count: 22, source: "Geographic Engine" },
      { date: "01 Oct", time: "12:00 PM", stage: "Cross-Department Linkage", desc: "PWD alerted for road cave-in hazard; MCD alerted for storm culvert overflow.", count: 24, source: "Cross-Dept Detector" },
      { date: "01 Oct", time: "02:30 PM", stage: "Escalation to GROWING Stage", desc: "Corridor spread velocity reached +18.4 m/hr. Critical supervisory alert sent.", count: 26, source: "Escalation Engine" }
    ],
    spreadGeo: [
      { step: "Day 1 (Sep 28)", ward: "Rohini Sector 14 (Origin)", lat: 28.7180, lng: 77.1280, radiusMeters: 110, signalCount: 2, label: "Initial fissure at Mother Dairy booth", color: "#10B981" },
      { step: "Day 3 (Sep 30)", ward: "Rohini Sector 14 (Pocket 1)", lat: 28.7192, lng: 77.1295, radiusMeters: 320, signalCount: 14, label: "Subsurface spread into Pocket 1 residential loop", color: "#F59E0B" },
      { step: "Day 5 (Oct 01)", ward: "Rohini Sector 14 (Arterial Corridor)", lat: 28.7210, lng: 77.1320, radiusMeters: 750, signalCount: 26, label: "Full corridor impact: tap contamination + 35cm road depression", color: "#EF4444" }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-DEL-01",
        title: "Negative-Pressure Siphonage in 1988 Cast-Iron Feeder Line",
        confidence: "HIGH",
        confidenceScore: 91,
        evidence: [
          "26 correlated citizen signals & complaints clustered along Sector 14 utility alignment",
          "DJB asset register confirms 1988 installation vintage exceeding 30-year design life",
          "Water quality testing showed chlorine residual dropped to 0.02 ppm",
          "Acoustic leak signature confirmed near Mother Dairy valve pit #12"
        ],
        verificationRequired: true,
        recommendedVerification: "Deploy acoustic leak correlator & ultrasonic pipe sensor at Sector 14 Gate #2"
      },
      {
        id: "RCH-DEL-02",
        title: "Sub-Base Soil Compaction Loss from Storm Drain Backwash",
        confidence: "MEDIUM",
        confidenceScore: 74,
        evidence: [
          "MCD storm culvert inspection reported cracked masonry and silt backing",
          "Road depression aligns directly with adjacent stormwater culvert line"
        ],
        verificationRequired: true,
        recommendedVerification: "Inspect stormwater culvert wall using CCTV crawler camera"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "Delhi Jal Board (DJB)",
      sharedProblemSummary: "Underground water main rupture is softening road base and causing drain overflow — affecting 3 separate civic authorities.",
      departments: [
        { dept: "Delhi Jal Board (DJB)", cases: 14, icon: "Droplet", badgeColor: "#0E5E3A", impactSummary: "Main potable water pressure loss & contamination risk across 550 households." },
        { dept: "Public Works Department (PWD Delhi)", cases: 8, icon: "Wrench", badgeColor: "#D97706", impactSummary: "Road subgrade saturation causing 35cm asphalt depression outside market." },
        { dept: "Municipal Corporation of Delhi (MCD)", cases: 4, icon: "Building2", badgeColor: "#7C3AED", impactSummary: "Storm drain blockage and standing water pools near market boundary." }
      ],
      coordinationRecommendation: "Initiate Unified Joint Action: DJB isolates feeder at 11:00 AM; PWD inspects road sub-base concurrently before asphalt re-bedding; MCD flushes storm drain barriers."
    },
    simulations: [
      {
        id: "SIM-DEL-A",
        optionKey: "A",
        title: "A. External Emergency Clamping",
        shortTitle: "External Emergency Clamping",
        time: "4–6h",
        risk: "High (65%)",
        riskLevel: "high",
        cost: "₹18,000",
        verdict: "Sub-optimal",
        verdictType: "suboptimal"
      },
      {
        id: "SIM-DEL-B",
        optionKey: "B",
        title: "B. Ductile Iron Replacement & PWD Road Re-bedding",
        shortTitle: "Ductile Iron Replacement",
        time: "24–36h",
        risk: "Very Low (<5%)",
        riskLevel: "low",
        cost: "₹1.45L",
        verdict: "Recommended",
        verdictType: "recommended"
      },
      {
        id: "SIM-DEL-C",
        optionKey: "C",
        title: "C. Acoustic & Ground Radar Probe",
        shortTitle: "Acoustic & Ground Radar Probe",
        time: "2–3h",
        risk: "N/A",
        riskLevel: "neutral",
        cost: "₹8,000",
        verdict: "Essential (1st step)",
        verdictType: "essential"
      },
      {
        id: "SIM-DEL-D",
        optionKey: "D",
        title: "D. Valve Rationing Only",
        shortTitle: "Valve Rationing Only",
        time: "Immediate",
        risk: "Critical (100%)",
        riskLevel: "critical",
        cost: "₹3,000",
        verdict: "Rejected",
        verdictType: "rejected"
      }
    ],
    relatedGrievanceIds: ["DL-2026-W14-0892"],
    humanDecisions: []
  }
];

export const CIVIC_INTELLIGENCE_METRICS = {
  activeIncidents: 3,
  emergingProblemsCount: 8,
  criticalProblemsCount: 2,
  growingProblemsCount: 5,
  signalsDetectedLast24h: 52,
  crossDepartmentIncidentsCount: 2,
  avgProblemDetectionHours: "5.8 Hours (vs 96h legacy)",
  avgEscalationTimeHours: "12.5 Hours",
  recurrencePreventedRate: "81.2%",
  actionSimulationUsageRate: "94.0%",
  citizenSignalContribution: "44.5% of all early discoveries"
};
