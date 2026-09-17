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
      photoUrl: "/civic-problems/ai_dirty_tap_water.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Biological / Sediment Contamination"
    },
    photoUrl: "/civic-problems/ai_dirty_tap_water.jpg",
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
      photoUrl: "/civic-problems/choked_nullah_mumbai.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Extreme Channel Choking with Solid Municipal Waste"
    },
    photoUrl: "/civic-problems/choked_nullah_mumbai.jpg",
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
    title: "Broken & Unhygienic Community Public Toilet Needing Urgent Repairs",
    descriptionRaw: "Mahanagar Palika ke public toilet complex mein darwaze toote hain, paani ki pipe phati hai aur safai bilkul nahi ho rahi. Durgandh aur gandagi se aaspas ke log pareshan hain.",
    languageDetected: "Hinglish / Marathi-Hindi (Confidence 96%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Sanitation Department",
    officerName: "Er. Ramesh Shinde",
    officerDesignation: "Sub-Divisional Sanitation Engineer",
    location: {
      ward: "Ward 4 (Shivaji Nagar)",
      area: "Near PMC Bus Depot, Main Community Complex",
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
    clusterId: "CL-P04-SAN-01",
    clusterTitle: "Shivaji Nagar Public Toilet Maintenance",
    clusterCount: 8,
    upvotes: 31,
    citizenName: "Sachin Kulkarni",
    citizenPhone: "+91 97640-11823",
    evidence: {
      photoUrl: "/civic-problems/ai_unhygienic_public_toilet.jpg",
      confidenceScore: 0.97,
      detectedIssue: "Public Restroom Facility Structural Damage & Unsanitary Condition"
    },
    photoUrl: "/civic-problems/ai_unhygienic_public_toilet.jpg",
    grievanceDna: {
      dnaId: "DNA-05518-P04",
      departmentConfidence: 98.8,
      urgencyScore: 84,
      sentimentScore: -0.79,
      sentimentLabel: "Public Amenity Degradation & Health Risk",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Facility Type", val: "Swachh Bharat Public Community Toilet" },
        { label: "Issue", val: "Damaged Doors, Choked Fixtures & Lack of Water" },
        { label: "Community Impact", val: "400+ Daily Commuters & Market Visitors" }
      ],
      ragMatches: [
        {
          caseId: "PMC-TOILET-2025-054",
          summary: "Deep sanitization wash, plumbing fixture overhaul and door latch replacement.",
          similarity: 0.94,
          resolutionTime: "4 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Community public toilet in severe disrepair and poor sanitary state.",
      "Plumbing lines need reconnecting and high-pressure chemical wash required.",
      "Sanitation maintenance team deployed for deep cleaning and door restoration."
    ],
    recommendedResolution: {
      primaryAction: "Deep Chemical Pressure Wash & Plumbing Overhaul",
      standardOperatingProcedure: "TOILET-SWACHH-SOP",
      estimatedFixTime: "3.5 Hours",
      equipmentRequired: ["High Pressure Water Jet", "Disinfectant Chemicals", "Plumbing Tool Kit"],
      citizenDraftHindi: "प्रिय नागरिक, शौचालय की मरम्मत और गहरी सफाई के लिए स्वच्छता दल को तैनात कर दिया गया है। आज दोपहर तक कार्य पूरा कर लिया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, sanitation crew has been deployed to deep-clean and repair the community toilet complex."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 07:45 AM", detail: "Citizen reported unhygienic public toilet with photos", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 07:46 AM", detail: "Classified under Public Sanitation Facility", status: "completed" },
      { stage: "Sanitation Crew Dispatched", time: "Sep 17, 08:30 AM", detail: "Cleaning squad en route with high-pressure jet", status: "in_progress" },
      { stage: "Restoration & Verification", time: "Pending", detail: "Hygiene audit and photo signoff", status: "pending" }
    ]
  },
  {
    id: "MH-2026-W11-0912",
    title: "Broken Pavement Footpath Tiles & Pedestrian Tripping Hazard",
    descriptionRaw: "Commercial building ke samne footpath ke saare paver tiles toot kar bikhre hue hain. Bachhe aur buzug roz thokar khakar gir rahe hain. Footpath chalne layak bilkul nahi bacha hai.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Roads Division)",
    location: {
      ward: "Ward 11 (Viman Nagar)",
      area: "Commercial Arcade, Main Avenue Footpath",
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
    clusterTitle: "Viman Nagar Commercial Corridor Footpath Tiles",
    clusterCount: 11,
    upvotes: 37,
    citizenName: "Deepak Joshi",
    citizenPhone: "+91 98901-22941",
    evidence: {
      photoUrl: "/civic-problems/ai_broken_footpath.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Cracked & Dislodged Interlocking Paver Blocks"
    },
    photoUrl: "/civic-problems/ai_broken_footpath.jpg",
    grievanceDna: {
      dnaId: "DNA-09122-P11",
      departmentConfidence: 99.1,
      urgencyScore: 86,
      sentimentScore: -0.78,
      sentimentLabel: "Pedestrian Hazard & Tripping Risk",
      healthRiskLevel: "MEDIUM_HIGH",
      extractedEntities: [
        { label: "Corridor", val: "High-Traffic Commercial Access Footpath" },
        { label: "Surface Condition", val: "Broken Interlocking Tiles, Uneven Gaps" },
        { label: "Safety Risk", val: "Elderly & Child Fall Hazard" }
      ],
      ragMatches: [
        {
          caseId: "PWD-PAVER-2025-072",
          summary: "Sand bedding levelling and interlocking paver block replacement.",
          similarity: 0.93,
          resolutionTime: "6 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Damaged pedestrian footpath with loose, broken tiles creating serious trip hazard.",
      "Footpath pavers require leveling, sand bedding and replacement with fresh tiles.",
      "PWD maintenance squad scheduled for paver resetting."
    ],
    recommendedResolution: {
      primaryAction: "Sand Bedding Compaction & Fresh Interlocking Tile Relaying",
      standardOperatingProcedure: "PWD-FOOTPATH-RESTORATION-SOP",
      estimatedFixTime: "5 Hours",
      equipmentRequired: ["Plate Compactor", "River Sand (1 Truck)", "Interlocking Tiles (200 Units)"],
      citizenDraftHindi: "प्रिय नागरिक, टूटे हुए फुटपाथ की मरम्मत के लिए PWD ठेकेदार को कार्य आदेश जारी कर दिया गया है। टाइल्स बदलने का कार्य शीघ्र पूर्ण किया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, PWD road maintenance team is replacing the damaged footpath pavers and leveling the walking path."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 04:10 PM", detail: "Citizen logged complaint showing broken footpath tiles", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 04:11 PM", detail: "Confirmed Pedestrian Infrastructure Hazard", status: "completed" },
      { stage: "Assigned to PWD Roads", time: "Sep 16, 05:30 PM", detail: "Assigned to Executive Engineer Rajesh Meena", status: "completed" },
      { stage: "Field Relaying", time: "Pending", detail: "Truck with replacement tiles scheduled for morning deployment", status: "pending" }
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
      photoUrl: "/civic-problems/landfill_mountain_jcb.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Massive Solid Waste Mound & Methane Outgassing"
    },
    photoUrl: "/civic-problems/landfill_mountain_jcb.jpg",
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
    id: "DL-2026-W16-0239",
    title: "Dangerous Open Manhole on Busy Street Roadway",
    descriptionRaw: "Sadak ke beech mein sewer ka manhole khula pada hai jisme koi dhakkan nahi hai. Sirf ek lakdi daal ke chhod diya hai, raat ko koi bhi bike ya gaadi gir kar mar sakti hai.",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Drainage & Waterlogging",
    department: "Delhi Jal Board (DJB) / MCD",
    officerName: "Er. Sanjay Sharma",
    officerDesignation: "Executive Engineer (Sewerage)",
    location: {
      ward: "Ward 16 (Dwarka Sector 16)",
      area: "Main Road Intersection, Near Metro Pillar 122",
      city: "New Delhi",
      pincode: "110078",
      lat: 28.5921,
      lng: 77.0215
    },
    urgency: "CRITICAL",
    urgencyScore: 97,
    status: "TRIAGED",
    createdAt: "2026-09-17 06:30 AM",
    slaDeadline: "2026-09-17 02:00 PM",
    slaHoursLeft: 3,
    clusterId: "CL-W16-MANHOLE-01",
    clusterTitle: "Dwarka Sector 16 Open Manhole Life Threat",
    clusterCount: 7,
    upvotes: 42,
    citizenName: "Ananya Roy",
    citizenPhone: "+91 98188-44912",
    evidence: {
      photoUrl: "/civic-problems/ai_open_manhole_danger.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Uncovered Deep Sewer Manhole Shaft on Carriageway"
    },
    photoUrl: "/civic-problems/ai_open_manhole_danger.jpg",
    grievanceDna: {
      dnaId: "DNA-02391-W16",
      departmentConfidence: 99.8,
      urgencyScore: 97,
      sentimentScore: -0.95,
      sentimentLabel: "Direct Fatal Hazard to Motorists & Pedestrians",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Hazard Type", val: "Open Sewer Chamber, Depth > 2.5m" },
        { label: "Warning Measure", val: "Improvised Tree Branch with Cloth (Inadequate)" },
        { label: "Traffic Risk", val: "Extreme Two-Wheeler Plunge Hazard" }
      ],
      ragMatches: [
        {
          caseId: "DJB-MANHOLE-2025-031",
          summary: "Emergency SFRC concrete cover installation and safety cone perimeter.",
          similarity: 0.99,
          resolutionTime: "2 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Open sewer manhole in the middle of active traffic lane.",
      "High probability of fatal plunging accident; immediate barricading required.",
      "Dispatch crew with heavy-duty SFRC circular cover to seat and seal immediately."
    ],
    recommendedResolution: {
      primaryAction: "Install Heavy Duty Concrete Cover & Barricade Shaft",
      standardOperatingProcedure: "DJB-EMERGENCY-MANHOLE-SOP",
      estimatedFixTime: "1.5 Hours",
      equipmentRequired: ["SFRC Heavy Duty Manhole Cover", "Hydraulic Crane Truck", "Traffic Barricades (4x)"],
      citizenDraftHindi: "प्रिय नागरिक, खुले मैनहोल की शिकायत पर त्वरित कार्रवाई करते हुए नया ढक्कन लगाने के लिए आपातकालीन टीम भेज दी गई है।",
      citizenDraftEnglish: "Dear Citizen, DJB emergency squad has been dispatched with a replacement heavy-duty concrete cover to seal the open manhole."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 17, 06:30 AM", detail: "Citizen uploaded photo of open manhole on active street", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 17, 06:31 AM", detail: "Triggered LEVEL 1 Life Safety Emergency Alert (Score 97)", status: "completed" },
      { stage: "Emergency Unit Mobilized", time: "Sep 17, 07:00 AM", detail: "Crew loaded with concrete lid dispatched", status: "in_progress" },
      { stage: "Cover Installed & Verified", time: "Pending", detail: "Leveling and safety confirmation", status: "pending" }
    ]
  },
  {
    id: "DL-2026-W07-0348",
    title: "Illegal Construction Debris & Rubble Dumped on Highway Service Plot",
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
      photoUrl: "/civic-problems/illegal_debris_rubble.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Illegal Construction & Demolition (C&D) Debris Dumping"
    },
    photoUrl: "/civic-problems/illegal_debris_rubble.jpg",
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
      photoUrl: "/civic-problems/flyover_dust_pollution.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Construction Particulate Matter (PM10/PM2.5) Pollution"
    },
    photoUrl: "/civic-problems/flyover_dust_pollution.jpg",
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
    title: "Heavy Storm Fallen Banyan Tree Blocking Main Arterial Roadway",
    descriptionRaw: "Tez toofan aur barish ke baad bohot bada bargad ka ped sadak par gir gaya hai. Dono taraf ka traffic pura band ho gaya hai aur electric wire bhi toot ke latak rahi hai. Turant hatwayein.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Tree Authority / Disaster Response (NDRF/MCD)",
    officerName: "Er. Rajesh K. Meena",
    officerDesignation: "Executive Engineer (Emergency Clearance)",
    location: {
      ward: "Ward 12 (Pimpri / Chinchwad)",
      area: "Main Arterial Avenue Road",
      city: "Pune",
      pincode: "411057",
      lat: 18.5912,
      lng: 73.7428
    },
    urgency: "CRITICAL",
    urgencyScore: 94,
    status: "TRIAGED",
    createdAt: "2026-09-16 03:00 PM",
    slaDeadline: "2026-09-17 07:00 PM",
    slaHoursLeft: 4,
    clusterId: "CL-P12-TREE-01",
    clusterTitle: "Pimpri Arterial Fallen Tree Road Blockage",
    clusterCount: 8,
    upvotes: 51,
    citizenName: "Prashant Patil",
    citizenPhone: "+91 97631-00293",
    evidence: {
      photoUrl: "/civic-problems/ai_storm_fallen_tree.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Heavy Fallen Trunk Obstruction on Multi-Lane Road"
    },
    photoUrl: "/civic-problems/ai_storm_fallen_tree.jpg",
    grievanceDna: {
      dnaId: "DNA-04429-P12",
      departmentConfidence: 99.6,
      urgencyScore: 94,
      sentimentScore: -0.89,
      sentimentLabel: "Total Road Paralysis & Emergency Gridlock",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Obstacle", val: "Uprooted 40-Year Banyan Tree Trunk" },
        { label: "Impact", val: "Both Carriageways Blocked, 100% Traffic Diverted" },
        { label: "Secondary Hazard", val: "Snapped Low-Tension Power Conductor" }
      ],
      ragMatches: [
        {
          caseId: "TREE-DISASTER-2025-014",
          summary: "Chainsaw branch sectioning, crane extraction and road sweeping.",
          similarity: 0.98,
          resolutionTime: "2.5 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Large fallen tree completely blocking 4-lane arterial road.",
      "Emergency response squad with motorized wood cutters and hydraulic crane dispatched.",
      "Target opening at least one lane within 90 minutes."
    ],
    recommendedResolution: {
      primaryAction: "Motorized Chainsaw Cutting & Hydra Crane Extraction",
      standardOperatingProcedure: "DISASTER-FALLEN-TREE-SOP",
      estimatedFixTime: "2.5 Hours",
      equipmentRequired: ["Motorized Chainsaws (3x)", "14T Hydra Crane", "2x Flatbed Trucks"],
      citizenDraftHindi: "प्रिय नागरिक, सड़क पर गिरे पेड़ को हटाने के लिए क्रेन और कटर मशीनों के साथ आपदा प्रबंधन दल मौके पर पहुंच रहा है। जल्द ही रास्ता साफ कर दिया जाएगा।",
      citizenDraftEnglish: "Dear Citizen, emergency tree clearance crew equipped with industrial chainsaws and hydra cranes is en route to clear the fallen tree."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 16, 03:00 PM", detail: "Citizen uploaded photo of uprooted tree blocking road", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 03:01 PM", detail: "Triggered Emergency Transit Blockage Alert (Score 94)", status: "completed" },
      { stage: "Disaster Squad Dispatched", time: "Sep 16, 03:20 PM", detail: "Chainsaw crew and crane mobilized", status: "in_progress" },
      { stage: "Road Clearance Verification", time: "Pending", detail: "Debris hauling and traffic resumption", status: "pending" }
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
      photoUrl: "/civic-problems/road_pothole_patching.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Active Cold Asphalt Pothole Repair in Progress"
    },
    photoUrl: "/civic-problems/road_pothole_patching.jpg",
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


