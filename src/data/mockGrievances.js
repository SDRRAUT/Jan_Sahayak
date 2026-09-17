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
      photoUrl: "/civic-problems/water_pipe_leak.jpg",
      confidenceScore: 0.98,
      detectedIssue: "High Pressure Potable Pipeline Fracture"
    },
    photoUrl: "/civic-problems/water_pipe_leak.jpg",
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
    id: "DL-2026-W14-0331",
    title: "Contaminated Dark Muddy Drinking Water from Household Taps",
    descriptionRaw: "Hamare ghar ke kitchen ke tap se kala-bhoora ganda mitti jaisa paani nikal raha hai. Badbu bohot aa rahi hai aur peene layak bilkul nahi hai. Bacche bimaar ho rahe hain please urgent check karein.",
    languageDetected: "Hinglish / Hindi (Confidence 97%)",
    category: "Water Supply & Contamination",
    department: "Delhi Jal Board (DJB)",
    officerName: "Er. Sanjay Sharma",
    officerDesignation: "Assistant Executive Engineer (Water Quality)",
    location: {
      ward: "Ward 14 (Rohini Sector 14)",
      area: "Pocket 4, Residential Block C",
      city: "New Delhi",
      pincode: "110085",
      lat: 28.7165,
      lng: 77.1242
    },
    urgency: "CRITICAL",
    urgencyScore: 95,
    status: "TRIAGED",
    createdAt: "2026-09-17 09:15 AM",
    slaDeadline: "2026-09-18 01:00 PM",
    slaHoursLeft: 12,
    clusterId: "CL-W14-WATER-02",
    clusterTitle: "Rohini Block C Supply Contamination Incident",
    clusterCount: 9,
    upvotes: 39,
    citizenName: "Sunita Devi",
    citizenPhone: "+91 98110-44219",
    evidence: {
      photoUrl: "/civic-problems/dirty_tap_water.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Biological / Sediment Contamination"
    },
    photoUrl: "/civic-problems/dirty_tap_water.jpg",
    grievanceDna: {
      dnaId: "DNA-03319-W14",
      departmentConfidence: 99.4,
      urgencyScore: 95,
      sentimentScore: -0.91,
      sentimentLabel: "Acute Public Health Hazard",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Contaminant", val: "Mud / Sewage Infiltration Runoff" },
        { label: "Target System", val: "Domestic Kitchen Supply Line" },
        { label: "Health Risk", val: "Waterborne Gastroenteritis / Cholera Risk" },
        { label: "Sample Turbidity", val: "> 85 NTU (Severe Breach)" }
      ],
      ragMatches: [
        {
          caseId: "DJB-CONTAM-2025-402",
          summary: "Super-chlorination flush and suction leak seal in feeder branch.",
          similarity: 0.97,
          resolutionTime: "8 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Dark brown turbid tap water confirmed via computer vision analysis.",
      "High probability of underground suction cross-contamination near drainage culvert.",
      "Water testing squad must collect sample for turbidity and pathogen test immediately."
    ],
    recommendedResolution: {
      primaryAction: "Dispatch Water Testing Van & Chlorine Dosing Flushing Unit",
      standardOperatingProcedure: "DJB-SOP-CONTAM-BIOHAZARD",
      estimatedFixTime: "6 Hours",
      equipmentRequired: ["Water Quality Sampling Kit", "Chlorine Dosing Pump", "Hydraulic Line Pressure Gauge"],
      citizenDraftHindi: "प्रिय नागरिक, दूषित पानी की शिकायत पर जल बोर्ड की मोबाइल टेस्टिंग लैब और रिपेयर टीम रवाना हो चुकी है। पाइपलाइन फ्लशिंग के बाद शुद्ध पानी की आपूर्ति की जाएगी।",
      citizenDraftEnglish: "Dear Citizen, DJB water testing mobile squad is dispatched. Pipeline flushing and chlorination will be carried out today."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 09:15 AM", detail: "Citizen uploaded image of brown contaminated water from tap", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 09:16 AM", detail: "Auto-classified as CRITICAL Biohazard (Score 95)", status: "completed" },
      { stage: "Water Lab Alerted", time: "Sep 17, 09:30 AM", detail: "Mobile testing van assigned to collect street sample", status: "completed" },
      { stage: "Flushing Squad", time: "Pending", detail: "Main line scouring and chlorine sanitization", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W09-0744",
    title: "Open Sewage Nullah Blocked by Massive Plastic & Solid Waste",
    descriptionRaw: "Hamare area mein main drainage nullah pura plastic bottles aur kachre se block ho chuka hai. Paani aage nahi ja raha hai, pura sad raha hai aur machhar bohot badh gaye hain.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Drainage & Waterlogging",
    department: "Municipal Corporation (MCD / BMC)",
    officerName: "Dr. K. S. Tyagi",
    officerDesignation: "Chief Sanitation & Drainage Inspector",
    location: {
      ward: "Ward 9 (Dharavi / Kurla Nullah)",
      area: "Pipeline Bridge Crossing, Central Drainage Nullah",
      city: "Mumbai",
      pincode: "400017",
      lat: 19.0422,
      lng: 72.8584
    },
    urgency: "CRITICAL",
    urgencyScore: 94,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 02:40 PM",
    slaDeadline: "2026-09-17 08:00 PM",
    slaHoursLeft: 6,
    clusterId: "CL-M09-DRAIN-03",
    clusterTitle: "Central Nullah Solid Waste Choking Cluster",
    clusterCount: 22,
    upvotes: 63,
    citizenName: "Imran Sheikh",
    citizenPhone: "+91 98200-51920",
    evidence: {
      photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Extreme Channel Choking with Solid Municipal Waste"
    },
    photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
    grievanceDna: {
      dnaId: "DNA-07441-M09",
      departmentConfidence: 99.6,
      urgencyScore: 94,
      sentimentScore: -0.88,
      sentimentLabel: "Critical Flood Risk & Disease Vector Threat",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Waterway", val: "Central 12-Meter Open Storm Nullah" },
        { label: "Obstruction Material", val: "Dense Non-Biodegradable Single-Use Plastics" },
        { label: "Vector Hazard", val: "Dengue & Malaria Mosquito Breeding" },
        { label: "Infrastructure Impact", val: "Suspended 24-inch Water Pipe Corridor" }
      ],
      ragMatches: [
        {
          caseId: "BMC-DRAIN-2025-088",
          summary: "Hydraulic excavator de-silting and trash boom net installation.",
          similarity: 0.98,
          resolutionTime: "12 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Total blockage of 12-meter storm water nullah by dense carpet of plastic and municipal trash.",
      "High flood risk if rain intensifies; water backing up towards adjacent slum dwellings.",
      "Requires long-boom hydraulic excavator and 4 dumper trucks to desilt the waterway."
    ],
    recommendedResolution: {
      primaryAction: "Mobilize Long-Boom Excavator & Continuous Dumper Shuttle",
      standardOperatingProcedure: "MCD-BMC-NULLAH-DESILT-SOP",
      estimatedFixTime: "10 Hours",
      equipmentRequired: ["Long-Reach Poclain Excavator", "3x 16MT Dumper Trucks", "Larvicide Fogger"],
      citizenDraftHindi: "प्रिय नागरिक, नाले में कचरा साफ करने के लिए पोकलेन मशीन और डंपर टीम को तैनात कर दिया गया है। नाले की सफाई तेजी से चल रही है।",
      citizenDraftEnglish: "Dear Citizen, long-reach hydraulic excavators and dumper trucks have been deployed to clear the choked nullah channel."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 02:40 PM", detail: "Citizen reported choked nullah with photographic evidence", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 02:41 PM", detail: "Identified Critical Monsoon Drainage Hazard", status: "completed" },
      { stage: "Excavation Team Dispatched", time: "Sep 16, 04:00 PM", detail: "Heavy machinery mobilized on site", status: "completed" },
      { stage: "Channel De-silting", time: "Sep 17, 07:00 AM", detail: "22 metric tonnes of plastic waste removed so far", status: "in_progress" },
      { stage: "Sanitization & Closure", time: "Pending", detail: "Larvicidal spray along banks", status: "pending" }
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
      photoUrl: "/civic-problems/roadside_garbage_heap.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Commercial & Domestic Solid Waste Overflow"
    },
    photoUrl: "/civic-problems/roadside_garbage_heap.jpg",
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
      estimatedFixTime: "3.5 Hours",
      equipmentRequired: ["Compactor Truck DL-1M-4890", "Lime Powder 50kg", "Sanitation Squad (6 workers)"],
      citizenDraftHindi: "प्रिय नागरिक, आपकी शिकायत पर कार्रवाई करते हुए MCD का कंपैक्टर ट्रक कचरा उठाने के लिए भेज दिया गया है। आज दोपहर तक सड़क पूरी तरह साफ कर दी जाएगी।",
      citizenDraftEnglish: "Dear Citizen, MCD compactor truck and sanitary crew have been dispatched to clear the market garbage pile."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 11:15 AM", detail: "Citizen uploaded photo of uncollected garbage mountain", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 11:16 AM", detail: "Classified as High Urgency Sanitation Issue (Score 88)", status: "completed" },
      { stage: "Compactor Assigned", time: "Sep 16, 12:30 PM", detail: "Vehicle DL-1M-4890 routed to Mayur Vihar", status: "completed" },
      { stage: "Waste Lifting Active", time: "Sep 17, 08:30 AM", detail: "6 tonnes loaded; final sweep in progress", status: "in_progress" },
      { stage: "Area Sanitization", time: "Pending", detail: "Lime powder wash and photo verification", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W04-0551",
    title: "Low Water Pressure & Dry Public Taps Outside Municipal Office",
    descriptionRaw: "Mahanagar Palika office ke samne aur aaspas ke public taps mein paani bilkul nahi aa raha hai. Subah se log line laga ke khade hain par tap se sirf hawa nikal rahi hai.",
    languageDetected: "Hinglish / Marathi-Hindi (Confidence 96%)",
    category: "Water Supply & Contamination",
    department: "Municipal Water Supply Department",
    officerName: "Er. Ramesh Shinde",
    officerDesignation: "Sub-Divisional Water Engineer",
    location: {
      ward: "Ward 4 (Shivaji Nagar)",
      area: "Near PMC Zonal Office, Main Road",
      city: "Pune",
      pincode: "411005",
      lat: 18.5314,
      lng: 73.8446
    },
    urgency: "HIGH",
    urgencyScore: 84,
    status: "TRIAGED",
    createdAt: "2026-09-17 07:45 AM",
    slaDeadline: "2026-09-17 05:00 PM",
    slaHoursLeft: 7,
    clusterId: "CL-P04-WATER-01",
    clusterTitle: "Shivaji Nagar Feeder Line Pressure Drop",
    clusterCount: 8,
    upvotes: 31,
    citizenName: "Sachin Kulkarni",
    citizenPhone: "+91 97640-11823",
    evidence: {
      photoUrl: "/civic-problems/water_shortage_tap.jpg",
      confidenceScore: 0.97,
      detectedIssue: "Public Water Standpost Pressure Failure"
    },
    photoUrl: "/civic-problems/water_shortage_tap.jpg",
    grievanceDna: {
      dnaId: "DNA-05518-P04",
      departmentConfidence: 98.8,
      urgencyScore: 84,
      sentimentScore: -0.79,
      sentimentLabel: "Public Amenity Failure & Scarcity",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Facility Type", val: "Municipal Public Tap Standpost" },
        { label: "Issue", val: "Low Pressure / Air Lock in Distribution Branch" },
        { label: "Community Impact", val: "200+ Daily Morning Commuters & Residents" }
      ],
      ragMatches: [
        {
          caseId: "PMC-WATER-2025-054",
          summary: "Air-release valve calibration and booster pump reactivation.",
          similarity: 0.94,
          resolutionTime: "3 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Public water standpost dry during peak morning distribution window.",
      "Likely airlock in distribution grid line or tripped booster pump at zonal reservoir.",
      "Valve operator must check head pressure and purge airlock from branch line."
    ],
    recommendedResolution: {
      primaryAction: "Inspect Zonal Booster Pump & Purge Air-Release Valve",
      standardOperatingProcedure: "WATER-GRID-AIRLOCK-SOP",
      estimatedFixTime: "2.5 Hours",
      equipmentRequired: ["Pressure Differential Gauge", "Valve Key Set", "Emergency Water Tanker (1x 5000L)"],
      citizenDraftHindi: "प्रिय नागरिक, मुख्य पाइपलाइन में एयरलॉक की जांच की जा रही है। 2 घंटे में सामान्य पानी का दबाव बहाल कर दिया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, line pressure check is underway. Normal water flow will be restored to public taps within 2 hours."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 07:45 AM", detail: "Citizen reported dry public standpost outside PMC office", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 07:46 AM", detail: "Identified Water Supply Disruption", status: "completed" },
      { stage: "Technician Dispatched", time: "Sep 17, 08:30 AM", detail: "Water supply valve technician en route", status: "in_progress" },
      { stage: "Restoration & Verification", time: "Pending", detail: "Pressure verification at standpost", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W11-0912",
    title: "Unpaved Road Digging Trench & Potholes Outside Commercial Complex",
    descriptionRaw: "Commercial building ke samne rasta khod kar chhod diya hai. Potholes aur mitti ka dher laga hua hai, barish ke baad pura ganda paani jama hai aur dukanon ke samne chalna mushkil ho gaya hai.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Roads Division)",
    location: {
      ward: "Ward 11 (Viman Nagar)",
      area: "Commercial Arcade, Main Avenue Road",
      city: "Pune",
      pincode: "411014",
      lat: 18.5679,
      lng: 73.9143
    },
    urgency: "HIGH",
    urgencyScore: 86,
    status: "ASSIGNED",
    createdAt: "2026-09-16 04:10 PM",
    slaDeadline: "2026-09-18 12:00 PM",
    slaHoursLeft: 22,
    clusterId: "CL-P11-ROAD-04",
    clusterTitle: "Viman Nagar Commercial Corridor Trench Issue",
    clusterCount: 11,
    upvotes: 37,
    citizenName: "Deepak Joshi",
    citizenPhone: "+91 98901-22941",
    evidence: {
      photoUrl: "/civic-problems/road_digging_potholes.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Unfilled Utility Trench & Surface Deterioration"
    },
    photoUrl: "/civic-problems/road_digging_potholes.jpg",
    grievanceDna: {
      dnaId: "DNA-09122-P11",
      departmentConfidence: 99.1,
      urgencyScore: 86,
      sentimentScore: -0.78,
      sentimentLabel: "Traffic Congestion & Pedestrian Obstacle",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Corridor", val: "High-Traffic Commercial Access Road" },
        { label: "Surface Condition", val: "Dug Up Gravel, Mud Puddles, Potholes" },
        { label: "Safety Risk", val: "Two-Wheeler Slippage & Water Stagnation" }
      ],
      ragMatches: [
        {
          caseId: "PWD-TRENCH-2025-072",
          summary: "Gravel backfill followed by roller compaction and bituminous tack coat.",
          similarity: 0.93,
          resolutionTime: "8 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Incomplete utility ducting left open with loose aggregates and water-filled hollows.",
      "Vendors and pedestrians facing acute difficulty navigating the mud and potholes.",
      "Requires immediate gravel backfilling and static roller compaction."
    ],
    recommendedResolution: {
      primaryAction: "Grading, Wet Mix Macadam (WMM) Base & Asphalt Overlay",
      standardOperatingProcedure: "PWD-ROAD-RESTORATION-SOP",
      estimatedFixTime: "6 Hours",
      equipmentRequired: ["Mini Road Roller (3T)", "WMM Gravel (2 Trucks)", "Cold Bituminous Mix"],
      citizenDraftHindi: "प्रिय नागरिक, खोदी गई सड़क की मरम्मत के लिए PWD ठेकेदार को कार्य आदेश जारी कर दिया गया है। सड़क समतलीकरण का कार्य शीघ्र पूर्ण किया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, PWD road contractor has been directed to backfill the trench and complete surface levelling."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 04:10 PM", detail: "Citizen logged complaint showing water puddles in dug road", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 04:11 PM", detail: "Confirmed Roadway Defect & Safety Hazard", status: "completed" },
      { stage: "Assigned to PWD Roads", time: "Sep 16, 05:30 PM", detail: "Assigned to Executive Engineer Rajesh Meena", status: "completed" },
      { stage: "Field Levelling", time: "Pending", detail: "Truck with gravel scheduled for morning deployment", status: "pending" }
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
      photoUrl: "/civic-problems/monsoon_waterlogging_flood.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Urban Waterlogging & Open Manhole Submergence"
    },
    photoUrl: "/civic-problems/monsoon_waterlogging_flood.jpg",
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
      { stage: "Submitted", time: "Sep 17, 07:15 AM", detail: "Citizen submitted video and photo of submerged vehicles", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 07:16 AM", detail: "Autoclassified as LEVEL 1 Emergency Monsoon Threat (Score 97)", status: "completed" },
      { stage: "Quick Response Mobilized", time: "Sep 17, 07:35 AM", detail: "Dewatering truck #7 reached the spot", status: "completed" },
      { stage: "Pumping Active", time: "Sep 17, 08:00 AM", detail: "Water level receding; drain grating being unblocked", status: "in_progress" },
      { stage: "Clearance Signoff", time: "Pending", detail: "Manhole concrete lid replacement", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W18-0881",
    title: "Mountainous Landfill Waste Accumulation & Methane Fire Danger",
    descriptionRaw: "Landfill dump yard pe kachre ka vishaal pahad ban chuka hai. JCB machine lagi hai par smell aur toxic gas pure residential area mein phail rahi hai. Aag lagne ka bohot darr hai.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Corporation of Delhi (MCD)",
    officerName: "Dr. K. S. Tyagi",
    officerDesignation: "Chief Sanitation Officer (Solid Waste Management)",
    location: {
      ward: "Ward 18 (Ghazipur / Bhalswa)",
      area: "Sanitary Landfill Perimeter Road",
      city: "New Delhi",
      pincode: "110096",
      lat: 28.6258,
      lng: 77.3298
    },
    urgency: "HIGH",
    urgencyScore: 89,
    status: "IN_PROGRESS",
    createdAt: "2026-09-15 10:20 AM",
    slaDeadline: "2026-09-18 06:00 PM",
    slaHoursLeft: 28,
    clusterId: "CL-W18-LANDFILL-01",
    clusterTitle: "Ghazipur Legacy Waste Biomining Operations",
    clusterCount: 25,
    upvotes: 88,
    citizenName: "Vikram Malhotra",
    citizenPhone: "+91 98118-77441",
    evidence: {
      photoUrl: "/civic-problems/landfill_waste_jcb.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Massive Solid Waste Mound & Methane Outgassing"
    },
    photoUrl: "/civic-problems/landfill_waste_jcb.jpg",
    grievanceDna: {
      dnaId: "DNA-08819-W18",
      departmentConfidence: 99.7,
      urgencyScore: 89,
      sentimentScore: -0.86,
      sentimentLabel: "Chronic Environmental & Air Hazard",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Site Type", val: "Municipal Solid Waste Landfill Mound" },
        { label: "Operation Type", val: "Bio-mining & Trommel Segregation" },
        { label: "Pollutant", val: "Methane Gas Emissions & Leachate Seepage" }
      ],
      ragMatches: [
        {
          caseId: "MCD-LANDFILL-2025-019",
          summary: "Trommel machine speedup and bio-inert soil capping to suppress odor.",
          similarity: 0.96,
          resolutionTime: "48 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Massive legacy waste pile under heavy bio-mining processing with hydraulic excavators.",
      "Local complaints of foul gas smell and fear of spontaneous combustible fire.",
      "Ensure continuous water spray mist cannons and bio-inert layer capping."
    ],
    recommendedResolution: {
      primaryAction: "Deploy Anti-Smog Mist Cannons & Accelerated Trommel Screening",
      standardOperatingProcedure: "MCD-SOP-LANDFILL-BIOMINING",
      estimatedFixTime: "24 Hours",
      equipmentRequired: ["Trommel Separator Units (2x)", "Mist Dust Suppression Cannons", "Thermal Infrared Drone Monitor"],
      citizenDraftHindi: "प्रिय नागरिक, लैंडफिल पर बायो-माइनिंग प्रक्रिया में तेजी लाई गई है। गंध और धूल रोकने के लिए एंटी-स्मॉग गन से लगातार छिड़काव किया जा रहा है।",
      citizenDraftEnglish: "Dear Citizen, biomining operations accelerated at Ghazipur. Mist cannons and bio-enzymes deployed to mitigate odor and dust."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 15, 10:20 AM", detail: "Citizen logged grievance regarding landfill odor and safety", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 15, 10:21 AM", detail: "Analyzed Environmental and Biomining parameters", status: "completed" },
      { stage: "Thermal Inspection", time: "Sep 16, 02:00 PM", detail: "Drone survey confirmed no active subterranean fire", status: "completed" },
      { stage: "Dust & Odor Spray", time: "Sep 17, 09:00 AM", detail: "3 mist cannons actively dampening dust", status: "in_progress" },
      { stage: "Weekly Metric Audit", time: "Pending", detail: "Tonnage processing report", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W08-0419",
    title: "Dangerous Deep Asphalt Crater & Broken Storm Drain Grate",
    descriptionRaw: "Main road pe bohot bada gaddha ban gaya hai jisme barish ka ganda paani bhara hai. Saath hi naali ki lohe ki jaali toot chuki hai jisse do-wheelers ke pahiye phans rahe hain aur roz log gir rahe hain.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Roads Division)",
    location: {
      ward: "Ward 8 (Kothrud / Paud Road)",
      area: "Paud Road, Near City Bus Stop",
      city: "Pune",
      pincode: "411038",
      lat: 18.5074,
      lng: 73.8077
    },
    urgency: "CRITICAL",
    urgencyScore: 92,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 01:20 PM",
    slaDeadline: "2026-09-17 06:00 PM",
    slaHoursLeft: 5,
    clusterId: "CL-P08-ROAD-02",
    clusterTitle: "Paud Road Arterial Pothole & Broken Grate Cluster",
    clusterCount: 15,
    upvotes: 59,
    citizenName: "Pooja Malhotra",
    citizenPhone: "+91 98101-55829",
    evidence: {
      photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Road Pothole Cavity & Damaged Iron Drain Grating"
    },
    photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
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
    id: "DL-2026-W16-0239",
    title: "Unregulated Plastic Waste Dumping & Open Ground Contamination",
    descriptionRaw: "Khali zameen par pure mohalle ka kachra aur single use plastic feka ja raha hai. Ragpickers aag laga dete hain aur dhuan gharon ke andar aata hai. MC ko turant safai karwani chahiye.",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Corporation of Delhi (MCD)",
    officerName: "Dr. K. S. Tyagi",
    officerDesignation: "Chief Sanitation Inspector",
    location: {
      ward: "Ward 16 (Dwarka Sector 16)",
      area: "Vacant DDA Plot Perimeter, Near Metro Pillar 122",
      city: "New Delhi",
      pincode: "110078",
      lat: 28.5921,
      lng: 77.0215
    },
    urgency: "HIGH",
    urgencyScore: 82,
    status: "TRIAGED",
    createdAt: "2026-09-17 06:30 AM",
    slaDeadline: "2026-09-18 04:00 PM",
    slaHoursLeft: 18,
    clusterId: "CL-W16-SAN-02",
    clusterTitle: "Dwarka Sector 16 Open Dumping Hotspot",
    clusterCount: 7,
    upvotes: 28,
    citizenName: "Ananya Roy",
    citizenPhone: "+91 98188-44912",
    evidence: {
      photoUrl: "/civic-problems/dumping_ground_plastic_waste.jpg",
      confidenceScore: 0.97,
      detectedIssue: "Uncontrolled Open Ground Plastic Waste Dumping"
    },
    photoUrl: "/civic-problems/dumping_ground_plastic_waste.jpg",
    grievanceDna: {
      dnaId: "DNA-02391-W16",
      departmentConfidence: 99.0,
      urgencyScore: 82,
      sentimentScore: -0.76,
      sentimentLabel: "Environmental Neglect & Open Fire Threat",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Site", val: "Vacant DDA Community Land" },
        { label: "Waste Nature", val: "Scattered Plastics, Bottles, Dry Leaves" },
        { label: "Nuisance", val: "Open Burning & Airborne Toxic Smoke" }
      ],
      ragMatches: [
        {
          caseId: "MCD-PLOT-2025-031",
          summary: "Tractor-loader debris clearance and installation of 'No Dumping' signpost.",
          similarity: 0.94,
          resolutionTime: "6 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Open ground converted into informal garbage dumping point.",
      "Plastic waste scattering onto nearby footpaths and drainage gutters.",
      "Schedule JCB clearing trip and erect barbed wire or warning signage."
    ],
    recommendedResolution: {
      primaryAction: "Clear Open Ground with JCB & Install 'No Dumping' Warning Board",
      standardOperatingProcedure: "MCD-VACANT-PLOT-CLEAN-SOP",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["JCB Backhoe Loader", "2x 10MT Dumper Trucks", "Metal Caution Signboard"],
      citizenDraftHindi: "प्रिय नागरिक, खाली प्लॉट से कचरा हटाने के लिए जेसीबी और डंपर की ड्यूटी लगा दी गई है। आज दोपहर तक कचरा साफ करवा दिया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, MCD backhoe loader has been deployed to clear the scattered waste from the vacant plot."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 06:30 AM", detail: "Citizen uploaded picture of scattered plastic dumping ground", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 06:31 AM", detail: "Classified under Sanitation & Open Waste Management", status: "completed" },
      { stage: "Sanitary Squad Alerted", time: "Sep 17, 08:00 AM", detail: "Added to morning waste clearing roster", status: "in_progress" },
      { stage: "Plot Cleaned & Fenced", time: "Pending", detail: "Signboard installation and final verification", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W07-0348",
    title: "Illegal Construction Debris & Mixed Waste Dumping on Highway Plot",
    descriptionRaw: "Service road ke kinare khali plot par raat ko kisi ne truck se building ka malba aur plastic bori kachra dump kar diya hai. Pure raste par gandagi phail rahi hai.",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Corporation of Delhi (MCD)",
    officerName: "Dr. K. S. Tyagi",
    officerDesignation: "Chief Sanitation Inspector",
    location: {
      ward: "Ward 7 (Janakpuri)",
      area: "Outer Ring Road Service Lane, Near Large Billboard",
      city: "New Delhi",
      pincode: "110058",
      lat: 28.6219,
      lng: 77.0872
    },
    urgency: "HIGH",
    urgencyScore: 79,
    status: "ASSIGNED",
    createdAt: "2026-09-16 05:40 PM",
    slaDeadline: "2026-09-18 05:00 PM",
    slaHoursLeft: 20,
    clusterId: "CL-W07-DEBRIS-01",
    clusterTitle: "Janakpuri Service Lane Illegal C&D Dumping",
    clusterCount: 6,
    upvotes: 24,
    citizenName: "Manish Chawla",
    citizenPhone: "+91 98112-90184",
    evidence: {
      photoUrl: "/civic-problems/illegal_debris_dump_plot.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Illegal Construction & Demolition (C&D) Debris Dumping"
    },
    photoUrl: "/civic-problems/illegal_debris_dump_plot.jpg",
    grievanceDna: {
      dnaId: "DNA-03489-W07",
      departmentConfidence: 99.2,
      urgencyScore: 79,
      sentimentScore: -0.73,
      sentimentLabel: "Civic Encroachment & Illegal Dumping",
      healthRiskLevel: "MEDIUM",
      extractedEntities: [
        { label: "Waste Type", val: "C&D Demolition Rubble + Packed Gunny Sacks" },
        { label: "Location", val: "Highway Service Lane Verge" },
        { label: "Quantity", val: "~4 Metric Tonnes Illegal Dump" }
      ],
      ragMatches: [
        {
          caseId: "MCD-CD-2025-081",
          summary: "C&D processing plant dispatch and night patrolling CCTV check.",
          similarity: 0.95,
          resolutionTime: "5 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Commercial construction waste dumped illegally next to highway service lane.",
      "Causes visual blight and narrows vehicle turning radius.",
      "Transfer to authorized Burari C&D recycling plant and issue challan if vehicle traced."
    ],
    recommendedResolution: {
      primaryAction: "Lift C&D Rubble to Burari Recycling Facility",
      standardOperatingProcedure: "MCD-CD-WASTE-LIFT-SOP",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["Hydraulic Tipper Truck", "Front-End Loader", "Warning Signpost"],
      citizenDraftHindi: "प्रिय नागरिक, अवैध रूप से डाले गए मलबे को उठाने के लिए MCD का डंपर ट्रक भेज दिया गया है। मलबा C&D प्रोसेसिंग प्लांट में भेजा जाएगा।",
      citizenDraftEnglish: "Dear Citizen, MCD tipper truck is dispatched to clear the construction debris and transport it to the recycling facility."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 05:40 PM", detail: "Citizen logged complaint of illegal debris dumping", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 05:41 PM", detail: "Identified Construction & Demolition Waste", status: "completed" },
      { stage: "Assigned to Ward Inspector", time: "Sep 17, 08:00 AM", detail: "Assigned to C&D clearance wing", status: "completed" },
      { stage: "Debris Removal", time: "Pending", detail: "Loader loading debris into tipper", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W01-0995",
    title: "Severe Construction Dust & Uncontrolled Flyover Air Pollution",
    descriptionRaw: "Metro aur flyover construction ki wajah se hawa mein itni mitti aur dhool udd rahi hai ki saans lena mushkil ho gaya hai. Log rumaal baandh kar chal rahe hain. Pani ka koi chhidkaw nahi ho raha hai.",
    languageDetected: "Hinglish (Confidence 99%)",
    category: "Other Civic Issue",
    department: "DMRC / PWD Environmental Wing",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Environmental Compliance)",
    location: {
      ward: "Ward 1 (Civil Lines / Metro Corridor)",
      area: "Metro Pillar 42 to 48 Construction Zone",
      city: "New Delhi",
      pincode: "110054",
      lat: 28.6812,
      lng: 77.2224
    },
    urgency: "HIGH",
    urgencyScore: 87,
    status: "IN_PROGRESS",
    createdAt: "2026-09-17 08:00 AM",
    slaDeadline: "2026-09-17 04:00 PM",
    slaHoursLeft: 5,
    clusterId: "CL-W01-DUST-01",
    clusterTitle: "Metro Corridor Unsprayed Dust Pollution Hotspot",
    clusterCount: 18,
    upvotes: 66,
    citizenName: "Kavita Singhal",
    citizenPhone: "+91 98105-88301",
    evidence: {
      photoUrl: "/civic-problems/construction_dust_pollution.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Construction Particulate Matter (PM10/PM2.5) Pollution"
    },
    photoUrl: "/civic-problems/construction_dust_pollution.jpg",
    grievanceDna: {
      dnaId: "DNA-09951-W01",
      departmentConfidence: 99.5,
      urgencyScore: 87,
      sentimentScore: -0.88,
      sentimentLabel: "Severe Respiratory Distress & Air Quality Violation",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Pollution Type", val: "Fugitive Airborne Dust & Silica Particles" },
        { label: "Source", val: "Dry Flyover Construction Excavation" },
        { label: "AQI Impact", val: "Localized PM10 Spike > 450 ug/m3" },
        { label: "Affected Citizens", val: "Daily Commuters & School Students" }
      ],
      ragMatches: [
        {
          caseId: "PWD-DUST-2025-012",
          summary: "Mandatory water sprinkling truck deployment and green netting enclosure.",
          similarity: 0.97,
          resolutionTime: "2 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Severe airborne dust pollution from active flyover piling work.",
      "Commuters forced to cover mouths; clear violation of municipal GRAP anti-dust guidelines.",
      "Enforce mandatory water mist spraying every 2 hours and install green agro-netting barriers."
    ],
    recommendedResolution: {
      primaryAction: "Deploy 2x Water Sprinkler Tankers & Install Green Dust Barrier Sheets",
      standardOperatingProcedure: "GRAP-DUST-CONTROL-SOP-V2",
      estimatedFixTime: "2.5 Hours",
      equipmentRequired: ["Mobile Water Sprinkling Tanker (9,000L)", "High-Pressure Mist Cannon", "Green Agro Shade Netting (200m)"],
      citizenDraftHindi: "प्रिय नागरिक, निर्माण स्थल पर धूल रोकने के लिए पानी के छिड़काव वाले टैंकर और एंटी-स्मॉग गन तुरंत तैनात कर दिए गए हैं।",
      citizenDraftEnglish: "Dear Citizen, water sprinkler tankers and misting cannons have been deployed at the metro corridor to suppress construction dust."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 08:00 AM", detail: "Citizen logged complaint showing commuters choking in construction dust", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 08:01 AM", detail: "Detected High Environmental & Health Violation", status: "completed" },
      { stage: "Water Tanker Mobilized", time: "Sep 17, 08:45 AM", detail: "Sprinkling tanker arrived on corridor", status: "in_progress" },
      { stage: "Netting Enclosure", time: "Pending", detail: "Green barrier netting installation", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W12-0442",
    title: "Abandoned Concrete Drainage Pipes & Broken Pavement Blocks",
    descriptionRaw: "Underpass ke pass footpath tod ke cement ke bade bade pipe aur tooti hui concrete blocks sadak par chhod di hain. 2 hafte se koi kaam nahi hua, chalne ki jagah nahi bachi hai.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Infrastructure)",
    location: {
      ward: "Ward 12 (Pimpri / Chinchwad)",
      area: "Maan Road Underpass & Commercial Corridor",
      city: "Pune",
      pincode: "411057",
      lat: 18.5912,
      lng: 73.7428
    },
    urgency: "HIGH",
    urgencyScore: 81,
    status: "TRIAGED",
    createdAt: "2026-09-16 03:00 PM",
    slaDeadline: "2026-09-18 06:00 PM",
    slaHoursLeft: 26,
    clusterId: "CL-P12-INFRA-01",
    clusterTitle: "Maan Underpass Drainage Pipe Abandonment",
    clusterCount: 8,
    upvotes: 33,
    citizenName: "Prashant Patil",
    citizenPhone: "+91 97631-00293",
    evidence: {
      photoUrl: "/civic-problems/underpass_excavation_pipes.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Obstruction from Unlaid Concrete Culvert Pipes & Debris"
    },
    photoUrl: "/civic-problems/underpass_excavation_pipes.jpg",
    grievanceDna: {
      dnaId: "DNA-04429-P12",
      departmentConfidence: 99.1,
      urgencyScore: 81,
      sentimentScore: -0.77,
      sentimentLabel: "Pedestrian Hazard & Civic Disarray",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Obstacle Material", val: "900mm Reinforced Concrete Pipes + Dismantled Paver Bricks" },
        { label: "Location", val: "Underpass Pedestrian Footpath & Road Verge" },
        { label: "Hazard", val: "Pedestrians Forced into High-Speed Traffic" }
      ],
      ragMatches: [
        {
          caseId: "PWD-PIPE-2025-064",
          summary: "Crane lifting of uninstalled pipes and paver block relaying.",
          similarity: 0.95,
          resolutionTime: "6 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Large storm water concrete pipes left lying unattended on footpath and road margin.",
      "Piles of loose interlocking paver blocks blocking commercial building access.",
      "Instruct drainage contractor to lay pipes immediately and clear footpath."
    ],
    recommendedResolution: {
      primaryAction: "Hydra Crane Shifting of Pipes & Footpath Paver Re-alignment",
      standardOperatingProcedure: "PWD-UTILITY-CLEARANCE-SOP",
      estimatedFixTime: "5 Hours",
      equipmentRequired: ["12T Hydra Mobile Crane", "Paver Block Compactor", "Tractor-Trolley"],
      citizenDraftHindi: "प्रिय नागरिक, अंडरपास के पास छोड़े गए पाइपों को हटाने और फुटपाथ को दुरुस्त करने के लिए हाइड्रा क्रेन और टीम को निर्देश दे दिया गया है।",
      citizenDraftEnglish: "Dear Citizen, PWD crane and construction gang have been mobilized to install the drainage pipes and restore the footpath."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 03:00 PM", detail: "Citizen uploaded composite image of abandoned pipes and broken pavers", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 03:01 PM", detail: "Classified under Roads & Infrastructure Encroachment", status: "completed" },
      { stage: "Contractor Notice", time: "Sep 17, 08:30 AM", detail: "Notice issued to contractor to complete laying", status: "in_progress" },
      { stage: "Footpath Restoration", time: "Pending", detail: "Relaying of interlocking paver blocks", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W10-0188",
    title: "Urgent Pothole Patchwork & Bituminous Surface Levelling Required",
    descriptionRaw: "Baner road par jagah jagah bade potholes ho gaye hain. Barish ke baad sadak toot chuki hai, gadiyan dheere chalne se traffic jam ho raha hai aur accidents ka khatra hai. PWD team ne thoda kaam shuru kiya tha par adha chhod diya.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Road Maintenance)",
    location: {
      ward: "Ward 10 (Baner / Pashan)",
      area: "Baner Gaon Road, Near Shanti Apartment",
      city: "Pune",
      pincode: "411045",
      lat: 18.5601,
      lng: 73.7880
    },
    urgency: "HIGH",
    urgencyScore: 85,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 11:45 AM",
    slaDeadline: "2026-09-17 07:00 PM",
    slaHoursLeft: 6,
    clusterId: "CL-P10-ROAD-01",
    clusterTitle: "Baner Road Monsoon Pothole Patchwork Cluster",
    clusterCount: 12,
    upvotes: 45,
    citizenName: "Abhijeet Deshmukh",
    citizenPhone: "+91 98220-44910",
    evidence: {
      photoUrl: "/civic-problems/pothole_repair_patchwork.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Active Cold Asphalt Pothole Repair in Progress"
    },
    photoUrl: "/civic-problems/pothole_repair_patchwork.jpg",
    grievanceDna: {
      dnaId: "DNA-01882-P10",
      departmentConfidence: 99.4,
      urgencyScore: 85,
      sentimentScore: -0.74,
      sentimentLabel: "Moderate Traffic Delay & Surface Roughness",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Roadway", val: "Baner Main Arterial Route" },
        { label: "Repair Method", val: "Cold Bituminous Mix Patching + Hand Tamping" },
        { label: "Status", val: "Active Road Crew Working on Site" }
      ],
      ragMatches: [
        {
          caseId: "PWD-PATCH-2025-091",
          summary: "Complete bitumen overlay with thermal sealant edges.",
          similarity: 0.98,
          resolutionTime: "4 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Active patching gang on site filling potholes with cold bituminous premix.",
      "Ensure proper edge cutting and mechanical roller compaction to prevent washouts.",
      "Target completion before evening traffic peak at 6 PM."
    ],
    recommendedResolution: {
      primaryAction: "Complete Asphalt Patching & Roller Level Compaction",
      standardOperatingProcedure: "PWD-FASTPATCH-SOP-V3",
      estimatedFixTime: "3.5 Hours",
      equipmentRequired: ["Bituminous Patch Truck", "Vibratory Plate Compactor", "Safety Cones"],
      citizenDraftHindi: "प्रिय नागरिक, बानेर रोड पर गड्ढों की मरम्मत का कार्य PWD की टीम द्वारा तेजी से किया जा रहा है। शाम तक सड़क पूरी तरह समतल कर दी जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PWD road maintenance crew is actively filling and leveling the potholes on Baner road."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 11:45 AM", detail: "Citizen logged complaint regarding dangerous potholes", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 11:46 AM", detail: "Assigned to Ward Road Maintenance Crew", status: "completed" },
      { stage: "Field Squad Deployed", time: "Sep 16, 02:30 PM", detail: "Crew with asphalt premix reached Baner Gaon", status: "completed" },
      { stage: "Active Compaction", time: "Sep 17, 09:15 AM", detail: "3 main potholes filled; levelling fourth patch", status: "in_progress" },
      { stage: "Verification & Signoff", time: "Pending", detail: "Geo-tagged post-repair photograph upload", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W05-0298",
    title: "Untreated Toxic Industrial & Dark Sewer Discharge into Open River Nullah",
    descriptionRaw: "Bade cement ke naale se kala jhaagdaar chemical paani seedhe naddi aur aabadi ke paas gir raha hai. Asahy badboo aa rahi hai aur paani mein phool aur plastic tair rahe hain. Jaldi band karwao.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Drainage & Waterlogging",
    department: "Delhi Pollution Control Committee & DJB",
    officerName: "Er. Neeraj Bansal",
    officerDesignation: "Divisional Environmental & Drainage Engineer",
    location: {
      ward: "Ward 5 (Kalkaji / Okhla Canal)",
      area: "Main Industrial Drainage Culvert, Near Yamuna Outfall",
      city: "New Delhi",
      pincode: "110020",
      lat: 28.5389,
      lng: 77.2798
    },
    urgency: "CRITICAL",
    urgencyScore: 98,
    status: "IN_PROGRESS",
    createdAt: "2026-09-17 07:00 AM",
    slaDeadline: "2026-09-17 04:00 PM",
    slaHoursLeft: 4,
    clusterId: "CL-W05-ENV-01",
    clusterTitle: "Okhla Outfall Toxic Industrial Effluent Cluster",
    clusterCount: 28,
    upvotes: 91,
    citizenName: "Rakesh Gupta",
    citizenPhone: "+91 98114-66320",
    evidence: {
      photoUrl: "/civic-problems/toxic_sewer_discharge_canal.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Untreated Toxic Industrial Effluent & Heavy Foam Discharge"
    },
    photoUrl: "/civic-problems/toxic_sewer_discharge_canal.jpg",
    grievanceDna: {
      dnaId: "DNA-05298-W05",
      departmentConfidence: 99.8,
      urgencyScore: 98,
      sentimentScore: -0.94,
      sentimentLabel: "Severe Environmental Crime & Ecological Hazard",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Outfall Type", val: "Dual 1500mm Reinforced Concrete Culverts" },
        { label: "Discharge Nature", val: "Untreated Chemical Effluent + Heavy Surfactant Foam" },
        { label: "Receiving Water", val: "Yamuna Canal Basin / Sensitive Ecosystem" },
        { label: "Population Impact", val: "10,000+ Downstream Community Residents" }
      ],
      ragMatches: [
        {
          caseId: "DPCC-ENV-2025-003",
          summary: "Immediate upstream industrial sluice gate sealing and effluent sample seizure.",
          similarity: 0.99,
          resolutionTime: "3 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Heavy frothing toxic effluent discharging unchecked from twin 1500mm drainage culverts.",
      "Clear breach of Central Pollution Control Board (CPCB) industrial discharge standards.",
      "Environmental enforcement team must seize chemical samples and seal illegal upstream inlet points."
    ],
    recommendedResolution: {
      primaryAction: "Deploy Mobile Water Sampling Lab & Seal Illegal Industrial Inlets",
      standardOperatingProcedure: "DPCC-CRITICAL-EFFLUENT-SOP",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["Chemical Water Sampling Rig", "Sluice Gate Sealing Clamp", "Real-Time Dissolved Oxygen / pH Probe"],
      citizenDraftHindi: "प्रिय नागरिक, नाले में अवैध केमिकल डिस्चार्ज की जांच के लिए प्रदूषण नियंत्रण बोर्ड और DJB की संयुक्त टीम मौके पर पहुंच चुकी है। अवैध आउटलेट को सील किया जा रहा है।",
      citizenDraftEnglish: "Dear Citizen, joint DPCC and DJB enforcement squad is on site collecting water samples and sealing illegal industrial discharge conduits."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 07:00 AM", detail: "Citizen logged emergency complaint of black foaming toxic water discharge", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 07:01 AM", detail: "Triggered CRITICAL Environmental Biohazard Alert (Score 98)", status: "completed" },
      { stage: "Enforcement Squad Mobilized", time: "Sep 17, 07:45 AM", detail: "DPCC Scientific Officers en route with sampling apparatus", status: "completed" },
      { stage: "Field Inspection Active", time: "Sep 17, 08:30 AM", detail: "Upstream industrial area inspection & gate sealing underway", status: "in_progress" },
      { stage: "Lab Report & Sluice Lock", time: "Pending", detail: "Environmental fine & permanent seal", status: "pending" }
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
    id: "CL-M09-DRAIN-03",
    title: "Dharavi-Kurla Central Nullah Solid Waste Choking Cluster",
    department: "Municipal Corporation (MCD / BMC)",
    ward: "Ward 9 (Dharavi / Kurla)",
    complaintCount: 22,
    severity: "CRITICAL",
    rootCause: "Accumulation of plastic bottles and garbage bags creating 100% blockage under pipeline bridge",
    impactRadius: "5,000+ residents along drainage corridor",
    status: "CREW_DISPATCHED",
    firstReported: "Sep 16, 2026",
    estimatedResolution: "Today, 08:00 PM"
  },
  {
    id: "CL-W22-SAN-09",
    title: "Mayur Vihar Phase 1 Commercial Waste Overflow",
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
    id: "CL-W05-ENV-01",
    title: "Okhla Outfall Toxic Industrial Effluent Cluster",
    department: "Delhi Pollution Control Committee & DJB",
    ward: "Ward 5 (Kalkaji / Okhla)",
    complaintCount: 28,
    severity: "CRITICAL",
    rootCause: "Illegal industrial discharge of foaming chemical effluent directly into Yamuna canal basin",
    impactRadius: "10,000+ downstream residents & sensitive aquatic zone",
    status: "ACTIVE_INVESTIGATION",
    firstReported: "Sep 17, 2026",
    estimatedResolution: "Today, 04:00 PM"
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
    title: 'Critical Biohazard Triage Confirmed',
    message: 'Your tap water contamination report DL-2026-W14-0331 classified as CRITICAL and mobile testing van dispatched.',
    grievanceId: 'DL-2026-W14-0331',
    link: '/citizen/DL-2026-W14-0331',
    type: 'AI_ANALYSIS',
    read: true,
    createdAt: '35 mins ago',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-03',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'Emergency Case Assigned',
    message: 'New grievance DL-2026-W03-0667 (Severe Monsoon Inundation & Submerged Drain) assigned with 3h SLA.',
    grievanceId: 'DL-2026-W03-0667',
    link: '/officer',
    type: 'ASSIGNMENT',
    read: false,
    createdAt: '25 mins ago',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-04',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'SLA Risk Alert (3h Remaining)',
    message: 'Ticket DL-2026-W05-0298 (Toxic Industrial Effluent Outfall) approaching SLA deadline.',
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
    title: 'High-Density Drainage Cluster Detected',
    message: 'AI Cluster Engine identified 22 linked complaints along Central Nullah in Ward 9.',
    grievanceId: 'MH-2026-W09-0744',
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
    message: '2 overdue civic grievances in MCD Shahdara Zone escalated to Chief Sanitary Engineer.',
    grievanceId: 'DL-2026-W22-0112',
    link: '/admin/super',
    type: 'ESCALATION',
    read: false,
    createdAt: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  }
];


