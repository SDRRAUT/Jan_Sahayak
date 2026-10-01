export const INITIAL_GRIEVANCES = [
  {
    id: "DL-2026-W14-0892",
    title: "Main Drinking Water Pipeline Burst & Gushing on Market Street",
    descriptionRaw: "Bhai pichle 3 din se hamare Sector 14, Main Market ke samne drinking water pipe phat gaya hai aur bohot tez paani bah raha hai. Sadak par paani bhar gaya hai aur pure area mein drinking water ki supply band hai.",
    languageDetected: "Hinglish / Hindi (Confidence 98%)",
    category: "Water Supply & Contamination",
    department: "Delhi Jal Board (DJB)",
    officerName: "Er. Sanjay Sharma",
    officerDesignation: "Assistant Executive Engineer (Water Distribution)",
    location: {
      ward: "Ward 14 (Rohini Sector 14)",
      area: "Main Market Road, Near Shree Ganesh Medicals",
      city: "New Delhi",
      pincode: "110085",
      lat: 28.7189,
      lng: 77.1265
    },
    urgency: "CRITICAL",
    urgencyScore: 96,
    status: "IN_PROGRESS",
    createdAt: "2026-09-17 08:30 AM",
    slaDeadline: "2026-09-18 04:00 PM",
    slaHoursLeft: 8,
    clusterId: "CL-W14-WATER-01",
    clusterTitle: "Rohini Sector 14 Main Feeder Pipe Fracture Cluster",
    clusterCount: 14,
    upvotes: 48,
    citizenName: "Aditya Verma",
    citizenPhone: "+91 98712-88491",
    evidence: {
      photoUrl: "/civic-problems/ai_water_pipe_leak.jpg",
      confidenceScore: 0.98,
      detectedIssue: "High Pressure Potable Pipeline Fracture"
    },
    photoUrl: "/civic-problems/ai_water_pipe_leak.jpg",
    grievanceDna: {
      dnaId: "DNA-94820-W14",
      departmentConfidence: 99.2,
      urgencyScore: 96,
      sentimentScore: -0.89,
      sentimentLabel: "Severe Water Wastage & Public Disruption",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "150mm High-Pressure Cast Iron Main" },
        { label: "Landmark", val: "Shree Ganesh Medicals, Market Gali" },
        { label: "Wastage Rate", val: "~3,200 Litres/Hour Potable Water" },
        { label: "Affected Population", val: "450+ Households & 30 Retail Shops" }
      ],
      ragMatches: [
        {
          caseId: "DJB-WATER-2025-119",
          summary: "Emergency shutoff valve isolation and carbon steel clamp fitting.",
          similarity: 0.96,
          resolutionTime: "5 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "High-pressure pipeline burst visible on road surface; wasting clean drinking water at 3,200 L/hr.",
      "Road traffic stalled; auto-rickshaw lane partially flooded.",
      "Feeder valve upstream at Rohini Zone 4 needs immediate shutoff to begin pipe sleeve clamp installation."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Sector 14 Gate Valve & Install 150mm Sleeve Clamp",
      standardOperatingProcedure: "DJB-SOP-WATER-RUPTURE-V3",
      estimatedFixTime: "4.5 Hours",
      equipmentRequired: ["150mm Heavy Duty Pipe Clamp", "Submersible Dewatering Pump", "Asphalt Excavator"],
      citizenDraftHindi: "प्रिय नागरिक, आपकी शिकायत (DL-2026-W14-0892) पर त्वरित संज्ञान लेते हुए जल बोर्ड की टीम मौके पर पहुंच चुकी है। वाल्व ठीक कर पानी की सप्लाई शाम 4 बजे तक शुरू कर दी जाएगी।",
      citizenDraftEnglish: "Dear Citizen, DJB rapid response team is on site repairing the ruptured water pipeline near Shree Ganesh Medicals. Water supply will be restored by 4:00 PM."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 08:30 AM", detail: "Citizen logged complaint with photo of water fountain burst", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 08:31 AM", detail: "Classified as CRITICAL Water Wastage Hazard (Score 96)", status: "completed" },
      { stage: "Cluster Linked", time: "Sep 17, 08:35 AM", detail: "Merged with 14 related reports in Rohini Ward 14", status: "completed" },
      { stage: "Officer Assigned", time: "Sep 17, 09:00 AM", detail: "Assigned to Er. Sanjay Sharma; emergency crew dispatched", status: "completed" },
      { stage: "Field Repair Active", time: "Sep 17, 10:15 AM", detail: "Gate valve isolated; clamp installation in progress", status: "in_progress" },
      { stage: "Quality Testing & Closure", time: "Pending", detail: "Pressure test & asphalt resurfacing", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W22-0112",
    title: "Huge Overflowing Garbage Pile & Trash Bags on Market Road",
    descriptionRaw: "Market road ke beech mein kude ka pahad ban gaya hai. Pura rasta block hai, kaale aur peele trash bags sadak par bikhre pade hain aur kutte-janwar kachra faila rahe hain. Dumper 4 din se nahi aaya.",
    languageDetected: "Hinglish (Confidence 99%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Corporation of Delhi (MCD)",
    officerName: "Dr. K. S. Tyagi",
    officerDesignation: "Chief Sanitation Inspector (Shahdara Zone)",
    location: {
      ward: "Ward 22 (Mayur Vihar Ph-1)",
      area: "Main Market Complex Roadway",
      city: "New Delhi",
      pincode: "110091",
      lat: 28.6012,
      lng: 77.2982
    },
    urgency: "HIGH",
    urgencyScore: 88,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 11:15 AM",
    slaDeadline: "2026-09-17 06:00 PM",
    slaHoursLeft: 4,
    clusterId: "CL-W22-SAN-09",
    clusterTitle: "Mayur Vihar Phase 1 Commercial Waste Backlog",
    clusterCount: 16,
    upvotes: 52,
    citizenName: "Gurpreet Singh",
    citizenPhone: "+91 99532-77180",
    evidence: {
      photoUrl: "/civic-problems/ai_garbage_dump.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Commercial & Domestic Solid Waste Overflow"
    },
    photoUrl: "/civic-problems/ai_garbage_dump.jpg",
    grievanceDna: {
      dnaId: "DNA-22112-W22",
      departmentConfidence: 99.4,
      urgencyScore: 88,
      sentimentScore: -0.84,
      sentimentLabel: "Severe Sanitation & Air Quality Degradation",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Waste Classification", val: "Municipal Solid Waste (Commercial + Household)" },
        { label: "Volume Estimate", val: "~8.5 Metric Tonnes Uncollected Waste" },
        { label: "Road Impact", val: "50% Carriageway Blocked" },
        { label: "Sanitary Risk", val: "Stray Animal Foraging & Odour Plume" }
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
      "Large overflow of commercial plastic bags extending 15 meters along the market street.",
      "Road narrowed by half, pedestrians forced to walk in oncoming vehicular traffic.",
      "12MT compactor truck and sweeping gang required immediately."
    ],
    recommendedResolution: {
      primaryAction: "Deploy 12MT Hydraulic Compactor & Disinfectant Lime Wash",
      standardOperatingProcedure: "MCD-SOP-MSW-MARKET-CLEAN",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["12MT Compactor Dumper", "Front Loader Backhoe", "Bleaching Powder & Lime Sanitizer"],
      citizenDraftHindi: "प्रिय नागरिक, मयूर विहार मार्केट में कचरा हटाने के लिए 12 टन का कॉम्पेक्टर वाहन और सफाई कर्मचारियों की टीम तैनात कर दी गई है। आज शाम 6 बजे तक पूरा क्षेत्र साफ कर कीटाणुरहित कर दिया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, MCD 12MT compactor unit and sanitation crew have arrived at Mayur Vihar Market road. Complete clearance and lime sanitization will finish by 6:00 PM."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 11:15 AM", detail: "Citizen uploaded complaint with geo-tagged photograph of garbage pile", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 11:16 AM", detail: "Assigned HIGH Urgency score (88); routed to Shahdara Sanitation Zone", status: "completed" },
      { stage: "Cluster Linked", time: "Sep 16, 11:25 AM", detail: "Consolidated with 16 citizen alerts from Phase 1 commercial block", status: "completed" },
      { stage: "Vehicle Dispatched", time: "Sep 16, 01:00 PM", detail: "Compactor vehicle #DL-1M-4421 en route from Ghazipur Depot", status: "completed" },
      { stage: "Clearance in Progress", time: "Sep 17, 09:30 AM", detail: "7 metric tonnes loaded; road sweeping & disinfectant wash active", status: "in_progress" },
      { stage: "Sanitary Verification", time: "Pending", detail: "Supervisory signoff and odor level audit", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W03-0667",
    title: "Severe Monsoon Road Waterlogging & Submerged Open Drain",
    descriptionRaw: "Halki barish mein bhi pura chowk doob gaya hai. Scooter aur gaadiyan band ho rahi hain, paani ghutno tak bhara hai aur naali ka dhakkan khula hone se bohot bada accident ho sakta hai.",
    languageDetected: "Hinglish (Confidence 99%)",
    category: "Drainage & Waterlogging",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Monsoon Emergency Control)",
    location: {
      ward: "Ward 3 (Karol Bagh)",
      area: "Main Market Crossroad, Pusa Road Junction",
      city: "New Delhi",
      pincode: "110005",
      lat: 28.6514,
      lng: 77.1907
    },
    urgency: "CRITICAL",
    urgencyScore: 97,
    status: "IN_PROGRESS",
    createdAt: "2026-09-17 07:15 AM",
    slaDeadline: "2026-09-17 01:00 PM",
    slaHoursLeft: 3,
    clusterId: "CL-W03-DRAIN-01",
    clusterTitle: "Karol Bagh Junction Monsoon Inundation Cluster",
    clusterCount: 19,
    upvotes: 74,
    citizenName: "Harsh Vardhan",
    citizenPhone: "+91 98103-99120",
    evidence: {
      photoUrl: "/civic-problems/ai_monsoon_waterlogging.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Urban Waterlogging & Open Manhole Submergence"
    },
    photoUrl: "/civic-problems/ai_monsoon_waterlogging.jpg",
    grievanceDna: {
      dnaId: "DNA-06671-W03",
      departmentConfidence: 99.8,
      urgencyScore: 97,
      sentimentScore: -0.93,
      sentimentLabel: "Extreme Public Inconvenience & Life Safety Risk",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Water Level", val: "0.45m (Knee-Deep Flood Water)" },
        { label: "Vulnerability", val: "Submerged Uncovered Manhole in Center Lane" },
        { label: "Transit Disruption", val: "Key Arterial Intersection Paralyzed" }
      ],
      ragMatches: [
        {
          caseId: "PWD-FLOOD-2025-014",
          summary: "Super-sucker suction pump deployment and gravity drain culvert unclogging.",
          similarity: 0.99,
          resolutionTime: "2 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Dangerous waterlogging at busy market intersection with submerged open manhole.",
      "High probability of fatal two-wheeler falls into open drain chamber.",
      "Deploy mobile high-capacity dewatering pump and place red warning barricade around manhole."
    ],
    recommendedResolution: {
      primaryAction: "Deploy 50HP Super-Sucker Dewatering Pump & Install High-Visibility Manhole Cone",
      standardOperatingProcedure: "PWD-MONSOON-CRITICAL-SOP",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["50HP Mobile Dewatering Pump", "Suction Hose (100m)", "Safety Cones & Cordon Tape"],
      citizenDraftHindi: "प्रिय नागरिक, करोल बाग चौराहे पर पानी निकालने के लिए 50HP का भारी पंप तैनात कर दिया गया है। नाले के खुले चैंबर पर सुरक्षा बैरिकेड लगा दिया गया है।",
      citizenDraftEnglish: "Dear Citizen, heavy 50HP dewatering pumps are clearing the waterlogging at Karol Bagh junction. Safety barricades placed over open drains."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 07:15 AM", detail: "Citizen reported submerged vehicles and invisible open drain", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 07:16 AM", detail: "Flagged as CRITICAL Safety Hazard (Score 97)", status: "completed" },
      { stage: "Emergency Unit Dispatched", time: "Sep 17, 07:35 AM", detail: "50HP Mobile Dewatering Pump en route to Pusa Road", status: "completed" },
      { stage: "Dewatering & Cordon Active", time: "Sep 17, 08:15 AM", detail: "Water pumped down by 25cm; caution barricade placed around open chamber", status: "in_progress" },
      { stage: "Culvert Unblocking", time: "Pending", detail: "Super-sucker silt removal from drainage bridge", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W08-0419",
    title: "Dangerous Deep Asphalt Crater & Broken Storm Drain Grate",
    descriptionRaw: "Main road pe bohot bada gaddha ban gaya hai jisme barish ka ganda paani bhara hai. Saath hi naali ki lohe ki jaali toot chuki hai jisse do-wheelers ke pahiye phans rahe hain aur roz log gir rahe hain.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Roads Division)",
    location: {
      ward: "Ward 8 (Civil Lines / Ring Road)",
      area: "Ring Road, Near ISBT Kashmere Gate Junction",
      city: "New Delhi",
      pincode: "110054",
      lat: 28.6692,
      lng: 77.2285
    },
    urgency: "CRITICAL",
    urgencyScore: 92,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 01:20 PM",
    slaDeadline: "2026-09-17 06:00 PM",
    slaHoursLeft: 5,
    clusterId: "CL-W08-ROAD-02",
    clusterTitle: "Civil Lines Ring Road Arterial Pothole & Broken Grate Cluster",
    clusterCount: 15,
    upvotes: 59,
    citizenName: "Pooja Malhotra",
    citizenPhone: "+91 98101-55829",
    evidence: {
      photoUrl: "/civic-problems/ai_road_pothole.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Road Pothole Cavity & Damaged Iron Drain Grating"
    },
    photoUrl: "/civic-problems/ai_road_pothole.jpg",
    grievanceDna: {
      dnaId: "DNA-84192-W08",
      departmentConfidence: 99.3,
      urgencyScore: 92,
      sentimentScore: -0.87,
      sentimentLabel: "Acute Road Accident Hazard",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Cavity Dimensions", val: "0.9m x 0.7m, Depth 0.25m" },
        { label: "Hardware Failure", val: "Cast Iron Storm Drain Grate Fractured" },
        { label: "Accident History", val: "3 Two-Wheeler Skids Logged in 48 Hours" }
      ],
      ragMatches: [
        {
          caseId: "PWD-ROAD-2025-112",
          summary: "Cold-mix asphalt rapid patchwork and cast-iron frame replacement.",
          similarity: 0.97,
          resolutionTime: "3.5 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Dual hazard: Deep asphalt pothole filled with water plus collapsed drain grate.",
      "High danger of wheel-trap and severe rollover injuries for two-wheelers.",
      "Dispatch rapid patching truck with cast iron grate replacement and cold asphalt mix."
    ],
    recommendedResolution: {
      primaryAction: "Replace Heavy-Duty Cast Iron Grate & Patch Pothole with Cold Bitumen",
      standardOperatingProcedure: "PWD-FASTPATCH-ROAD-SOP",
      estimatedFixTime: "3 Hours",
      equipmentRequired: ["Cast Iron Grate (600x600mm)", "Cold Asphalt Mix (6 Bags)", "Compaction Plate Tamper"],
      citizenDraftHindi: "प्रिय नागरिक, आपकी शिकायत पर PWD की टीम ने टूटी हुई जाली को बदलने और गड्ढे को डामर से भरने का काम शुरू कर दिया है। आज शाम तक सड़क पूरी तरह ठीक हो जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PWD maintenance crew is on site replacing the broken drain grate and filling the pothole with bituminous mix."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 01:20 PM", detail: "Citizen submitted dual photo of crater and broken drain grate", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 01:21 PM", detail: "Identified Critical Road Accident Hazard (Score 92)", status: "completed" },
      { stage: "Contractor Dispatched", time: "Sep 16, 02:45 PM", detail: "Truck DL-2C-1090 loaded with replacement grate & asphalt", status: "completed" },
      { stage: "On-Site Repair", time: "Sep 17, 09:30 AM", detail: "Grate frame anchored in concrete; pothole compaction underway", status: "in_progress" },
      { stage: "Traffic Reopened", time: "Pending", detail: "Surface levelling verification", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W05-0298",
    title: "Dangerous Dangling Overhead Power Cables & Sparking Transformer",
    descriptionRaw: "Bazaar ke pole par bijli ke taar bohot neeche latak rahe hain aur transformer se chingaariyan nikal rahi hain. Niche log aur dukan wale dar rahe hain, short circuit se kabhi bhi badi aag lag sakti hai.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Electricity & Streetlights",
    department: "BSES / Tata Power Delhi Distribution",
    officerName: "Er. Neeraj Bansal",
    officerDesignation: "Assistant Engineer (Electrical Safety & Distribution)",
    location: {
      ward: "Ward 5 (Kalkaji Market)",
      area: "Main Market Commercial Electric Post #4B",
      city: "New Delhi",
      pincode: "110019",
      lat: 28.5389,
      lng: 77.2598
    },
    urgency: "CRITICAL",
    urgencyScore: 98,
    status: "IN_PROGRESS",
    createdAt: "2026-09-17 07:00 AM",
    slaDeadline: "2026-09-17 01:00 PM",
    slaHoursLeft: 2,
    clusterId: "CL-W05-ELEC-01",
    clusterTitle: "Kalkaji Market Dangling Power Cables & Sparking Hazard",
    clusterCount: 16,
    upvotes: 79,
    citizenName: "Rakesh Gupta",
    citizenPhone: "+91 98114-66320",
    evidence: {
      photoUrl: "/civic-problems/ai_dangling_power_cables.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Low Hanging Live Power Lines & Transformer Spark Hazard"
    },
    photoUrl: "/civic-problems/ai_dangling_power_cables.jpg",
    grievanceDna: {
      dnaId: "DNA-05298-W05",
      departmentConfidence: 99.8,
      urgencyScore: 98,
      sentimentScore: -0.94,
      sentimentLabel: "Immediate Electrocution & Fire Threat",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Asset Type", val: "11kV Distribution Transformer & Low Tension Overhead Lines" },
        { label: "Defect", val: "Sagging Uninsulated Lines (< 2.2m clearance), Arcing Spark Jumps" },
        { label: "Surrounding Hazard", val: "Cloth Shop Awnings & Pedestrian Crowds" }
      ],
      ragMatches: [
        {
          caseId: "BSES-CABLE-2025-003",
          summary: "Substation feeder trip, line re-tensioning and bundle cabling upgrade.",
          similarity: 0.99,
          resolutionTime: "2 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Severe electrocution hazard with low-hanging loose electrical cables over market walkway.",
      "Sparks detected near transformer terminal; high fire risk to surrounding shop awnings.",
      "Emergency line gang dispatched for immediate power isolation and aerial bundle re-tensioning."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Feeder & Re-tension Overhead Cables into Aerial Bundle Conductors (ABC)",
      standardOperatingProcedure: "BSES-EMERGENCY-ELECTRICAL-SOP",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["Hydraulic Cherry Picker Lift", "Insulated Hot Stick (33kV)", "Aerial Bundle Cable Clamps"],
      citizenDraftHindi: "प्रिय नागरिक, लटकते बिजली के तारों और ट्रांसफार्मर की जांच के लिए बिजली विभाग की आपातकालीन टीम मौके पर पहुंच चुकी है। तारों को कसकर सुरक्षित किया जा रहा है।",
      citizenDraftEnglish: "Dear Citizen, emergency electrical line squad is on site isolating the feed, re-tensioning loose cables, and securing the transformer."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 07:00 AM", detail: "Citizen logged emergency complaint of sagging live wires and sparks", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 07:01 AM", detail: "Triggered CRITICAL Electrocution & Fire Risk Alert (Score 98)", status: "completed" },
      { stage: "Line Gang Dispatched", time: "Sep 17, 07:20 AM", detail: "Hydraulic lift bucket truck en route to market", status: "completed" },
      { stage: "Cable Re-tensioning Active", time: "Sep 17, 08:00 AM", detail: "Power temporarily isolated; cables being elevated", status: "in_progress" },
      { stage: "Final Safety Inspection", time: "Pending", detail: "Transformer insulation testing & signoff", status: "pending" }
    ]
  }
];

export const MOCK_CLUSTERS = [
  {
    id: "CL-W14-WATER-01",
    title: "Rohini Sector 14 Main Feeder Pipe Fracture Cluster",
    department: "Delhi Jal Board (DJB)",
    ward: "Ward 14 (Rohini Sector 14)",
    complaintCount: 14,
    severity: "CRITICAL",
    rootCause: "150mm High-pressure cast-iron main joint rupture near Shree Ganesh Medicals",
    impactRadius: "450 Households across Sector 14 Market & Block B",
    status: "ACTIVE_INVESTIGATION",
    firstReported: "Sep 16, 2026",
    estimatedResolution: "Today, 04:00 PM"
  },
  {
    id: "CL-W22-SAN-09",
    title: "Mayur Vihar Phase 1 Commercial Waste Backlog",
    department: "Municipal Corporation of Delhi (MCD)",
    ward: "Ward 22 (Mayur Vihar)",
    complaintCount: 16,
    severity: "HIGH",
    rootCause: "Dumper collection backlog leading to commercial plastic trash pile up on carriageway",
    impactRadius: "Market visitors & 80 retail shops",
    status: "IN_PROGRESS",
    firstReported: "Sep 16, 2026",
    estimatedResolution: "Today, 06:00 PM"
  },
  {
    id: "CL-W03-DRAIN-01",
    title: "Karol Bagh Junction Monsoon Inundation & Submerged Manhole",
    department: "Public Works Department (PWD)",
    ward: "Ward 3 (Karol Bagh)",
    complaintCount: 19,
    severity: "CRITICAL",
    rootCause: "Blocked underground culvert combined with uncovered open storm manhole chamber",
    impactRadius: "Arterial Pusa Road Crossing",
    status: "CREW_DISPATCHED",
    firstReported: "Sep 17, 2026",
    estimatedResolution: "Today, 01:00 PM"
  },
  {
    id: "CL-W08-ROAD-02",
    title: "Civil Lines Ring Road Arterial Pothole & Broken Grate Cluster",
    department: "Public Works Department (PWD)",
    ward: "Ward 8 (Civil Lines / Ring Road)",
    complaintCount: 15,
    severity: "CRITICAL",
    rootCause: "Heavy monsoon runoff subgrade subsidence and damaged iron storm drain grating",
    impactRadius: "Arterial Ring Road Junction & ISBT Flyover Approach",
    status: "CREW_DISPATCHED",
    firstReported: "Sep 16, 2026",
    estimatedResolution: "Today, 06:00 PM"
  },
  {
    id: "CL-W05-ELEC-01",
    title: "Kalkaji Market Dangling Power Cables & Sparking Hazard",
    department: "BSES / Tata Power Delhi Distribution",
    ward: "Ward 5 (Kalkaji)",
    complaintCount: 16,
    severity: "CRITICAL",
    rootCause: "Low-tension distribution cable slackening and arcing transformer terminals over market street",
    impactRadius: "Commercial shopping market corridor & 1,200 pedestrians",
    status: "ACTIVE_INVESTIGATION",
    firstReported: "Sep 17, 2026",
    estimatedResolution: "Today, 01:00 PM"
  }
];

export const SYSTEM_METRICS = {
  totalProcessed: "148,920",
  routingAccuracy: "96.4%",
  avgSlaDays: "2.8 Days",
  previousLegacySla: "18.4 Days",
  duplicateClusterReduction: "68.5%",
  citizenSatisfactionRate: "93.2%",
  activeOfficersOnline: "1,480",
  languagesSupported: "22 Indian Languages",
  zeroDeadEndGuarantee: "100%"
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    userId: 'USR-CITIZEN-01',
    userRole: 'citizen',
    title: 'Water Pipe Burst Squad on Site',
    message: 'DJB Quick-Response Team is actively repairing the 150mm pipe burst near Shree Ganesh Medicals (Ticket DL-2026-W14-0892).',
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
    title: 'Sanitation Dumper Dispatched',
    message: 'MCD 12MT compactor unit deployed to Mayur Vihar Market road for ticket DL-2026-W22-0112.',
    grievanceId: 'DL-2026-W22-0112',
    link: '/citizen/DL-2026-W22-0112',
    type: 'STATUS_UPDATE',
    read: true,
    createdAt: '25 mins ago',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-03',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'Emergency Drainage Case Assigned',
    message: 'New grievance DL-2026-W03-0667 (Severe Monsoon Inundation & Submerged Drain) assigned with 3h SLA.',
    grievanceId: 'DL-2026-W03-0667',
    link: '/officer',
    type: 'ASSIGNMENT',
    read: false,
    createdAt: '35 mins ago',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-04',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'Electrical Hazard SLA Alert',
    message: 'Ticket DL-2026-W05-0298 (Dangling Power Cables & Sparking Transformer) approaching SLA deadline.',
    grievanceId: 'DL-2026-W05-0298',
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
    title: 'Arterial Road Cavity Alert',
    message: 'Ticket DL-2026-W08-0419 (Civil Lines Ring Road Pothole & Broken Grate) prioritized for emergency compaction.',
    grievanceId: 'DL-2026-W08-0419',
    link: '/admin',
    type: 'SYSTEMIC_HOTSPOT',
    read: false,
    createdAt: '2 hours ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];
