export const INITIAL_GRIEVANCES = [
  {
    id: "DL-2026-W14-0892",
    title: "Contaminated Drinking Water & Main Supply Pipe Leakage",
    descriptionRaw: "Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.",
    languageDetected: "Hinglish / Hindi (Confidence 98%)",
    category: "Water Supply & Contamination",
    department: "Delhi Jal Board (DJB)",
    officerName: "Er. Sanjay Sharma (AEE)",
    officerDesignation: "Assistant Executive Engineer, Zone Central",
    location: {
      ward: "Ward 14 (Rohini Sector 14)",
      area: "Pocket 2, Near Mother Dairy Booth",
      city: "New Delhi",
      pincode: "110085",
      lat: 28.7189,
      lng: 77.1265
    },
    urgency: "CRITICAL",
    urgencyScore: 94,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 09:30 AM",
    slaDeadline: "2026-09-17 06:00 PM",
    slaHoursLeft: 16,
    clusterId: "CL-W14-WATER-03",
    clusterTitle: "Ward 14 Sector 14 Main Pipeline Fracture Cluster",
    clusterCount: 18,
    upvotes: 42,
    citizenName: "Aditya Verma",
    citizenPhone: "+91 98712-XXXXX",
    grievanceDna: {
      dnaId: "DNA-94820-W14",
      departmentConfidence: 98.4,
      urgencyScore: 94,
      sentimentScore: -0.88,
      sentimentLabel: "High Public Distress",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "100mm Cast Iron Main Valve" },
        { label: "Landmark", val: "Mother Dairy Booth #441" },
        { label: "Issue Type", val: "Sewage Infiltration / Biological Contamination" },
        { label: "Population Impact", val: "~450 Households" }
      ],
      ragMatches: [
        {
          caseId: "DJB-HIST-2025-081",
          summary: "Pocket 1 Valve replacement & chlorination flush resolved in 14 hours.",
          similarity: 0.94,
          resolutionTime: "14 hours"
        },
        {
          caseId: "DJB-HIST-2024-399",
          summary: "Drainage barrier reinforcement prevented storm backflow.",
          similarity: 0.88,
          resolutionTime: "22 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Biological contamination hazard reported; drinking water mixed with sewage line runoff.",
      "Root cause pinpointed: Joint crack at 100mm underground junction 40m south of Mother Dairy.",
      "Linked to Cluster CL-W14-WATER-03 (18 similar reports merged into this single incident)."
    ],
    recommendedResolution: {
      primaryAction: "Dispatch Rapid Emergency Isolator & Chlorination Team",
      standardOperatingProcedure: "SOP-DJB-CONTAM-V4 (Hazard Protocol)",
      estimatedFixTime: "6 Hours",
      equipmentRequired: ["Pipe Clamp (100mm)", "Hydraulic Pump", "Chlorine Dosing Unit"],
      citizenDraftHindi: "प्रिय नागरिक, आपकी शिकायत (DL-2026-W14-0892) पर त्वरित संज्ञान लिया गया है। जल बोर्ड की टीम मदर डेयरी के पास वाल्व सील कर रही है। शाम 6 बजे तक स्वच्छ जलापूर्ति बहाल कर दी जाएगी।",
      citizenDraftEnglish: "Dear Citizen, urgent repair underway near Mother Dairy booth for your grievance (DL-2026-W14-0892). Water supply test scheduled for 6:00 PM today."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 09:30 AM", detail: "Citizen submitted voice-note in Hinglish", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 09:31 AM", detail: "Autoclassified as Critical Biological Hazard, routed to DJB", status: "completed" },
      { stage: "Cluster Merged", time: "Sep 16, 09:35 AM", detail: "Merged into Cluster CL-W14-WATER-03 (18 citizen complaints linked)", status: "completed" },
      { stage: "Officer Assigned", time: "Sep 16, 10:15 AM", detail: "Assigned to AEE Sanjay Sharma; Rapid team mobilized", status: "completed" },
      { stage: "Field Repair", time: "Sep 16, 02:40 PM", detail: "Excavation and clamp installation currently active", status: "in_progress" },
      { stage: "Testing & Signoff", time: "Pending", detail: "Quality test by Junior Chemist required before closure", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W08-0419",
    title: "Deep Road Cave-in / Dangerous Pothole Near Traffic Junction",
    descriptionRaw: "Moolchand flyover ke neeche Lajpat Nagar wali road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah. Accidents ho rahe hain bar bar!",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Roads Central)",
    location: {
      ward: "Ward 8 (Lajpat Nagar / Moolchand)",
      area: "Ring Road, Moolchand Underpass Entry",
      city: "New Delhi",
      pincode: "110024",
      lat: 28.5684,
      lng: 77.2341
    },
    urgency: "HIGH",
    urgencyScore: 88,
    status: "TRIAGED",
    createdAt: "2026-09-16 11:20 AM",
    slaDeadline: "2026-09-18 11:00 AM",
    slaHoursLeft: 38,
    clusterId: "CL-W08-ROAD-01",
    clusterTitle: "Moolchand Junction Monsoon Surface Collapse",
    clusterCount: 7,
    upvotes: 29,
    citizenName: "Pooja Malhotra",
    citizenPhone: "+91 98101-XXXXX",
    grievanceDna: {
      dnaId: "DNA-84192-W08",
      departmentConfidence: 99.1,
      urgencyScore: 88,
      sentimentScore: -0.76,
      sentimentLabel: "Urgent Safety Hazard",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Roadway", val: "Ring Road Westbound Slip" },
        { label: "Obstacle Size", val: "1.2m Diameter, 0.4m Deep" },
        { label: "Incident History", val: "2 two-wheeler skids logged" }
      ],
      ragMatches: [
        {
          caseId: "PWD-ROAD-2025-112",
          summary: "Cold-mix asphalt rapid patchwork completed in 4 hours on arterial corridor.",
          similarity: 0.91,
          resolutionTime: "4 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Physical accident hazard on high-velocity arterial ring road.",
      "Cave-in depth approximately 40cm, risk of fatal rollover for two-wheelers.",
      "Temporary barricade needed immediately before peak evening traffic (5 PM)."
    ],
    recommendedResolution: {
      primaryAction: "Immediate Police Barricading + Rapid Cold-Mix Asphalt Patch",
      standardOperatingProcedure: "PWD-ARTERIAL-FASTPATCH-SOP",
      estimatedFixTime: "3 Hours",
      equipmentRequired: ["Traffic Cones", "Cold Bituminous Mix (4 Bags)", "Mechanical Tamper"],
      citizenDraftHindi: "प्रिय नागरिक, आपकी शिकायत पर त्वरित कार्रवाई करते हुए ट्रैफिक पुलिस को बैरिकेडिंग और PWD टीम को मरम्मत के लिए भेज दिया गया है।",
      citizenDraftEnglish: "Dear Citizen, safety barricading dispatched immediately. PWD rapid patching squad scheduled to complete work before peak hours."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 11:20 AM", detail: "Photo + location pin submitted by commuter", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 11:21 AM", detail: "Computer vision confirmed severe cavity on arterial road", status: "completed" },
      { stage: "Assigned", time: "Sep 16, 11:45 AM", detail: "Transferred to PWD Division South-Central", status: "completed" },
      { stage: "Field Dispatch", time: "Pending", detail: "Contractor truck en route with cold asphalt", status: "in_progress" },
      { stage: "Resolved", time: "Pending", detail: "Surface levelling and photograph upload", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W22-0112",
    title: "Overflowing Garbage Dump & Solid Waste Burning",
    descriptionRaw: "Sector 6 main market ke saamne open kude ka dher hai, 5 din se MCD ka dumper nahi aaya. Kal raat ko kisi ne aag laga di jisse bohot zyaada toxic smoke ho gaya hai.",
    languageDetected: "Hinglish (Confidence 99%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Corporation of Delhi (MCD)",
    officerName: "Dr. K. S. Tyagi (Sanitary Inspector)",
    officerDesignation: "Chief Sanitation Inspector, Shahdara South",
    location: {
      ward: "Ward 22 (Mayur Vihar Ph-1)",
      area: "Sector 6 DDA Market Complex",
      city: "New Delhi",
      pincode: "110091",
      lat: 28.6012,
      lng: 77.2982
    },
    urgency: "HIGH",
    urgencyScore: 82,
    status: "RESOLVED",
    createdAt: "2026-09-15 08:15 AM",
    slaDeadline: "2026-09-16 08:00 PM",
    slaHoursLeft: 0,
    clusterId: "CL-W22-SAN-09",
    clusterTitle: "Mayur Vihar Phase 1 Waste Collection Backlog",
    clusterCount: 11,
    upvotes: 35,
    citizenName: "Gurpreet Singh",
    citizenPhone: "+91 99532-XXXXX",
    grievanceDna: {
      dnaId: "DNA-22112-W22",
      departmentConfidence: 99.4,
      urgencyScore: 82,
      sentimentScore: -0.81,
      sentimentLabel: "Environmental & Respiratory Hazard",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Waste Type", val: "Municipal Solid Waste + Open Combustion" },
        { label: "Zone", val: "Market Frontage / Public Walkway" },
        { label: "Pollution Indicator", val: "AQI Spike Localized" }
      ],
      ragMatches: [
        {
          caseId: "MCD-SAN-2025-667",
          summary: "Double-trip hydraulic compactor clearance & sodium hypochlorite wash.",
          similarity: 0.95,
          resolutionTime: "5 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Biohazard and active air quality violation from uncollected commercial waste.",
      "Fire doused by fire tenders; residual embers cleared.",
      "Mechanical compactors dispatched; lime powder sprayed across 300 sq.m."
    ],
    recommendedResolution: {
      primaryAction: "Deploy 12MT Hydraulic Compactor + Disinfectant Spray",
      standardOperatingProcedure: "MCD-SOP-MSW-MARKET-CLEAN",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["Compactor Truck DL-1M-4890", "Lime Powder 50kg", "Sweeper Gang (6 pax)"],
      citizenDraftHindi: "प्रिय नागरिक, आपकी शिकायत का समाधान कर दिया गया है। कचरा पूरी तरह हटा दिया गया है और कीटाणुनाशक पाउडर का छिड़काव किया गया है।",
      citizenDraftEnglish: "Resolved: Municipal compactor has cleared the entire waste volume. Sanitization spray completed."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 15, 08:15 AM", detail: "Citizen logged complaint with photographic proof", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 15, 08:16 AM", detail: "Identified open fire smoke risk, classified as High", status: "completed" },
      { stage: "Assigned to MCD", time: "Sep 15, 09:00 AM", detail: "Sanitary Inspector Tyagi assigned field squad", status: "completed" },
      { stage: "On-site Action", time: "Sep 15, 11:30 AM", detail: "Two 12MT trucks loaded; area scrubbed with lime", status: "completed" },
      { stage: "Resolved & Closed", time: "Sep 15, 03:00 PM", detail: "Photographic closure verified; citizen notification sent", status: "completed" }
    ]
  },
  {
    id: "DL-2026-W05-0298",
    title: "High Voltage Transformer Sparking & Localized Blackout",
    descriptionRaw: "Gali no 3, Main Market Kalka Ji, transformer mein se aag ki chingariyan nikal rahi hain aur blast hone ka khatra hai. Poori gali ki light chali gayi hai.",
    languageDetected: "Hindi / Hinglish (Confidence 98%)",
    category: "Electricity & Power Grid",
    department: "BSES Rajdhani Power Limited",
    officerName: "Er. Neeraj Bansal",
    officerDesignation: "Divisional Engineer (Grid Maintenance)",
    location: {
      ward: "Ward 5 (Kalkaji)",
      area: "Gali No. 3, Near Gol Chakkar",
      city: "New Delhi",
      pincode: "110019",
      lat: 28.5442,
      lng: 77.2589
    },
    urgency: "CRITICAL",
    urgencyScore: 97,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 01:10 PM",
    slaDeadline: "2026-09-16 05:00 PM",
    slaHoursLeft: 3,
    clusterId: "CL-W05-ELEC-02",
    clusterTitle: "Kalkaji Feeder Line Sparking Incidents",
    clusterCount: 9,
    upvotes: 51,
    citizenName: "Rakesh Gupta",
    citizenPhone: "+91 98114-XXXXX",
    grievanceDna: {
      dnaId: "DNA-05298-W05",
      departmentConfidence: 99.8,
      urgencyScore: 97,
      sentimentScore: -0.92,
      sentimentLabel: "Extreme Fire / Electrocution Risk",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Grid Component", val: "400kVA Distribution Transformer" },
        { label: "Hazard", val: "Active Arc Flash & Oil Leakage" },
        { label: "Substation", val: "Kalkaji 11kV Feeder 4" }
      ],
      ragMatches: [
        {
          caseId: "BSES-GRID-2025-108",
          summary: "Feeder breaker remote isolation followed by bushing replacement.",
          similarity: 0.98,
          resolutionTime: "2.5 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Active electrical fire hazard with risk of oil tank combustion in dense market.",
      "Feeder remote trip triggered from Central Control Room (SCADA).",
      "Emergency line crew dispatched with replacement circuit breaker."
    ],
    recommendedResolution: {
      primaryAction: "Trip 11kV Feeder 4 + Dispatch Transformer Repair Van",
      standardOperatingProcedure: "BSES-SOP-ARC-FIRE-CRITICAL",
      estimatedFixTime: "2.5 Hours",
      equipmentRequired: ["Dielectric Oil Test Kit", "HT Bushing Set", "Safety Ground Rods"],
      citizenDraftHindi: "प्रिय उपभोक्ता, 11kV फीडर को सुरक्षा कारणों से आइसोलेट कर दिया गया है। BSES की आपातकालीन टीम मौके पर पहुंच चुकी है और 2 घंटे में बिजली बहाल कर दी जाएगी।",
      citizenDraftEnglish: "Emergency squad is at the site. Substation safely isolated; power restoration estimated in 2 hours."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 01:10 PM", detail: "Urgent spark report received with video clip", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 01:11 PM", detail: "Classified as Level 1 Electrocution Hazard (Score 97)", status: "completed" },
      { stage: "SCADA Auto-Signal", time: "Sep 16, 01:12 PM", detail: "Automated alert transmitted to Grid Control Center", status: "completed" },
      { stage: "Crew on Ground", time: "Sep 16, 01:30 PM", detail: "Van DL-1L-9022 arrived; transformer cordoned off", status: "in_progress" },
      { stage: "Power Restoration", time: "Pending", detail: "Re-energization following safety testing", status: "pending" }
    ]
  }
];

export const MOCK_CLUSTERS = [
  {
    id: "CL-W14-WATER-03",
    title: "Sector 14 Main Pipeline Fracture & Cross-Contamination",
    department: "Delhi Jal Board (DJB)",
    ward: "Ward 14 (Rohini Sector 14)",
    complaintCount: 18,
    severity: "CRITICAL",
    rootCause: "100mm Cast-Iron pipe fracture underneath storm-water drain at Mother Dairy Junction",
    impactRadius: "450 Households across Pocket 1 & 2",
    status: "ACTIVE_INVESTIGATION",
    firstReported: "Sep 14, 2026",
    estimatedResolution: "Today, 06:00 PM"
  },
  {
    id: "CL-W08-ROAD-01",
    title: "Moolchand Flyover Slip Road Structural Cavity",
    department: "Public Works Department (PWD)",
    ward: "Ward 8 (Lajpat Nagar)",
    complaintCount: 7,
    severity: "HIGH",
    rootCause: "Underground stormwater drain pipe collapsed causing subsoil erosion under asphalt",
    impactRadius: "Main Traffic Artery Ring Road",
    status: "CREW_DISPATCHED",
    firstReported: "Sep 16, 2026",
    estimatedResolution: "Tomorrow, 11:00 AM"
  },
  {
    id: "CL-W22-SAN-09",
    title: "Mayur Vihar Phase 1 DDA Market Commercial Waste Overflow",
    department: "Municipal Corporation of Delhi (MCD)",
    ward: "Ward 22 (Mayur Vihar)",
    complaintCount: 11,
    severity: "HIGH",
    rootCause: "Compactor route disruption due to festival market volume increase",
    impactRadius: "Market visitors & 80 retail shops",
    status: "RESOLVED_VERIFIED",
    firstReported: "Sep 15, 2026",
    estimatedResolution: "Completed (Sep 15, 03:00 PM)"
  }
];

export const SYSTEM_METRICS = {
  totalProcessed: "148,920",
  routingAccuracy: "94.8%",
  avgSlaDays: "3.2 Days",
  previousLegacySla: "18.4 Days",
  duplicateClusterReduction: "64.2%",
  citizenSatisfactionRate: "91.6%",
  activeOfficersOnline: "1,240",
  languagesSupported: "22 Indian Languages",
  zeroDeadEndGuarantee: "100%"
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    userId: 'USR-CITIZEN-01',
    userRole: 'citizen',
    title: 'Repair Team Dispatched',
    message: 'DJB Quick-Response Squad #4 has been dispatched to Sector 14 Mother Dairy junction for ticket DL-2026-W14-0892.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/citizen/DL-2026-W14-0892',
    type: 'STATUS_UPDATE',
    read: false,
    createdAt: '10 mins ago',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-02',
    userId: 'USR-CITIZEN-01',
    userRole: 'citizen',
    title: 'AI Triage & Verification Completed',
    message: 'Your grievance DL-2026-W14-0892 was classified as CRITICAL (Biological Contamination Hazard) and routed to DJB Rohini Zone.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/citizen/DL-2026-W14-0892',
    type: 'AI_ANALYSIS',
    read: true,
    createdAt: '45 mins ago',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-03',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'High Priority Case Assigned',
    message: 'New grievance DL-2026-W14-0892 assigned with SLA target: 12 Hours. Potential duplicate cluster of 3 tickets detected.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/officer',
    type: 'ASSIGNMENT',
    read: false,
    createdAt: '30 mins ago',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-04',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'SLA Risk Alert (2h Remaining)',
    message: 'Ticket DL-2026-P22-0419 (Pothole & Cave-in at Outer Ring Road) approaching SLA threshold.',
    grievanceId: 'DL-2026-P22-0419',
    link: '/officer',
    type: 'SLA_ALERT',
    read: false,
    createdAt: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-05',
    userId: 'USR-DEPTADMIN-01',
    userRole: 'dept_admin',
    title: 'Systemic Hotspot Detected',
    message: 'AI Hotspot Engine identified 8 recurring water contamination complaints in Rohini Ward 14 within 72 hours.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/admin',
    type: 'SYSTEMIC_HOTSPOT',
    read: false,
    createdAt: '2 hours ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-06',
    userId: 'USR-SUPERADMIN-01',
    userRole: 'super_admin',
    title: 'Automated Escalation Rule Triggered',
    message: '2 overdue civic grievances in MCD East Zone automatically escalated to Superintending Engineer.',
    grievanceId: 'DL-2026-M09-0112',
    link: '/admin/super',
    type: 'ESCALATION',
    read: false,
    createdAt: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  }
];

