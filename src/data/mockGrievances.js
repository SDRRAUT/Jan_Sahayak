export const INITIAL_GRIEVANCES = [
  {
    id: "PN-2026-WAG-0101",
    title: "Massive Overflowing Garbage Pile & Foul Smell at Baif Road Junction",
    descriptionRaw: "Baif Road junction near Wagholi market mein kachra 5 din se pada hai. Overflowing dump yard, stray animals spreading trash, foul smell reaching nearby shops.",
    languageDetected: "Hinglish / Marathi (Confidence 99%)",
    category: "Sanitation & Solid Waste",
    department: "Pune Municipal Corporation (PMC)",
    officerName: "Er. Ramesh Shinde",
    officerDesignation: "PMC Sanitation Inspector (Wagholi Zone)",
    location: {
      ward: "Wagholi Ward 28 (Baif Road Market)",
      area: "Baif Road Junction, Near Vegetable Market",
      city: "Pune",
      pincode: "412207",
      lat: 18.5815,
      lng: 73.9840
    },
    urgency: "CRITICAL",
    urgencyScore: 95,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 07:45 AM",
    slaDeadline: "2026-10-01 06:00 PM",
    slaHoursLeft: 6,
    clusterId: "CL-WAG-GARBAGE-01",
    clusterTitle: "Wagholi Baif Road Sanitation & Illegal Dumping Cluster",
    clusterCount: 18,
    upvotes: 62,
    citizenName: "Santosh Gawade",
    citizenPhone: "+91 98220-44102",
    evidence: {
      photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
      confidenceScore: 0.97,
      detectedIssue: "Overflowing Solid Waste & Uncollected Trash Dump"
    },
    photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-01",
      departmentConfidence: 98.6,
      urgencyScore: 95,
      sentimentScore: -0.92,
      sentimentLabel: "Severe Sanitation Hazard & Odor Nuisance",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "PMC Garbage Feeder Ramp" },
        { label: "Landmark", val: "Baif Road Vegetable Market Junction" },
        { label: "Waste Volume", val: "~4.2 Tons Uncollected Solid Waste" },
        { label: "Affected Residents", val: "850+ Households & Market Vendors" }
      ],
      ragMatches: [
        {
          caseId: "PMC-SWM-2025-441",
          summary: "Compactor truck deployment & lime disinfectant spray.",
          similarity: 0.95,
          resolutionTime: "3 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Accumulated waste blocking 1 lane of Baif Road near vegetable market.",
      "PMC compactor truck vehicle route missed for 5 consecutive days.",
      "High disease risk; immediate compactor dispatch & disinfectant spray required."
    ],
    recommendedResolution: {
      primaryAction: "Dispatch Heavy PMC Compactor Truck & Sanitize Yard",
      standardOperatingProcedure: "PMC-SOP-SWM-CLEARANCE-V2",
      estimatedFixTime: "3 Hours",
      equipmentRequired: ["PMC Compactor Van", "JCB Front Loader", "Bleaching Powder Spray Unit"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली बैफ रोड कचरा समस्या (PN-2026-WAG-0101) पर पीएमसी टीम रवाना हो चुकी है। शाम तक कचरा उठाकर जगह सैनिटाइज कर दी जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PMC sanitation team is en route to Baif Road, Wagholi to clear the uncollected waste and disinfect the market junction."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 07:45 AM", detail: "Citizen logged waste dump report with photo", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Oct 1, 07:46 AM", detail: "Classified as CRITICAL Solid Waste Hazard (Score 95)", status: "completed" },
      { stage: "Cluster Linked", time: "Oct 1, 07:50 AM", detail: "Merged with 18 complaints along Baif Road", status: "completed" },
      { stage: "Officer Assigned", time: "Oct 1, 08:30 AM", detail: "Assigned to Er. Ramesh Shinde; crew dispatched", status: "completed" },
      { stage: "Field Repair Active", time: "Oct 1, 09:15 AM", detail: "PMC JCB loader active at site", status: "in_progress" }
    ]
  },
  {
    id: "PN-2026-WAG-0102",
    title: "Major Water Pipe Leakage & Pressure Collapse on Kesnand Road",
    descriptionRaw: "Ivy Estate and Kesnand Road water supply pipeline underground rupture. Clean drinking water wasting on road while 400 households rely on private tankers.",
    languageDetected: "Hinglish / English (Confidence 98%)",
    category: "Water Supply & Contamination",
    department: "PMC Water Supply Department",
    officerName: "Er. Sachin Patil",
    officerDesignation: "PMC Water Executive Engineer",
    location: {
      ward: "Wagholi Ward 29 (Ivy Estate & Kesnand Rd)",
      area: "Kesnand Road, Near Ivy Estate Entrance",
      city: "Pune",
      pincode: "412207",
      lat: 18.5760,
      lng: 73.9810
    },
    urgency: "CRITICAL",
    urgencyScore: 94,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 08:10 AM",
    slaDeadline: "2026-10-01 05:00 PM",
    slaHoursLeft: 5,
    clusterId: "CL-WAG-WATER-02",
    clusterTitle: "Wagholi Kesnand Road Water Main Fracture",
    clusterCount: 24,
    upvotes: 78,
    citizenName: "Priyanka Jadhav",
    citizenPhone: "+91 97631-11029",
    evidence: {
      photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
      confidenceScore: 0.98,
      detectedIssue: "Feeder Line Rupture & Potable Water Leakage"
    },
    photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-02",
      departmentConfidence: 99.1,
      urgencyScore: 94,
      sentimentScore: -0.88,
      sentimentLabel: "Severe Water Shortage & Tanker Dependency",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "200mm HDPE Water Distribution Feeder" },
        { label: "Landmark", val: "Ivy Estate Gate 2, Kesnand Road" },
        { label: "Wastage Rate", val: "~4,500 Litres/Hour Potable Water" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Feeder line ruptured under road base; gushing clean water into storm channel.",
      "400+ society flats facing zero municipal water pressure.",
      "Valve isolation required at Wagholi ESR (Elevated Storage Reservoir)."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Wagholi ESR Gate Valve & Fit Electrofusion Sleeve",
      standardOperatingProcedure: "PMC-SOP-WATER-REPAIR-V4",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["Electrofusion Welding Machine", "Submersible Pump", "JCB Excavator"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली केसनंद रोड पानी पाइपलाइन मरम्मत कार्य (PN-2026-WAG-0102) जारी है। शाम 5 बजे तक पानी आपूर्ति बहाल हो जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PMC water works team is repairing the ruptured pipeline near Ivy Estate, Wagholi. Supply will be restored by 5:00 PM."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 08:10 AM", detail: "Citizen logged water leakage report", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Oct 1, 08:11 AM", detail: "Classified as CRITICAL Water Supply Hazard (Score 94)", status: "completed" },
      { stage: "Officer Assigned", time: "Oct 1, 08:45 AM", detail: "Assigned to Er. Sachin Patil", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0103",
    title: "Deep Asphalt Cratering & Road Sinking on Nagar Road Highway",
    descriptionRaw: "Pune-Ahmednagar Highway stretch near Lexicon School mein 3 bade potholes ban gaye hain. Gaadiyan fisal rahi hain aur continuous traffic jam lag raha hai.",
    languageDetected: "Hinglish / Marathi (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD Pune)",
    officerName: "Er. Amit Deshmukh",
    officerDesignation: "PWD Executive Engineer (Roads)",
    location: {
      ward: "Wagholi Ward 27 (Nagar Road Corridor)",
      area: "Nagar Road Highway, Opp. Lexicon School",
      city: "Pune",
      pincode: "412207",
      lat: 18.5780,
      lng: 73.9790
    },
    urgency: "CRITICAL",
    urgencyScore: 96,
    status: "INGESTED",
    createdAt: "2026-10-01 09:30 AM",
    slaDeadline: "2026-10-01 08:00 PM",
    slaHoursLeft: 8,
    clusterId: "CL-WAG-ROADS-03",
    clusterTitle: "Wagholi Nagar Road Highway Cratering & Potholes",
    clusterCount: 16,
    upvotes: 89,
    citizenName: "Rahul Shirole",
    citizenPhone: "+91 98223-55910",
    evidence: {
      photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Highway Asphalt Failure & Pothole Cluster"
    },
    photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-03",
      departmentConfidence: 99.4,
      urgencyScore: 96,
      sentimentScore: -0.91,
      sentimentLabel: "Highway Accident Risk & Severe Traffic Stoppage",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "Bituminous Highway Subgrade" },
        { label: "Landmark", val: "Lexicon International School Entrance" },
        { label: "Pothole Count", val: "3 Deep Sinking Cavities (> 18cm depth)" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Highway cavity causing vehicular slowdown and two-wheeler skid hazards.",
      "Emergency cold-mix asphalt patch squad required before evening rush hour."
    ],
    recommendedResolution: {
      primaryAction: "Deploy Emergency PWD Asphalt Resurfacing Squad",
      standardOperatingProcedure: "PWD-SOP-ROAD-PATCH-V2",
      estimatedFixTime: "3.5 Hours",
      equipmentRequired: ["Vibratory Roller", "Cold Mix Bitumen", "Safety Barricades"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली नगर रोड गड्ढे ठीक करने के लिए पीडब्ल्यूडी टीम काम शुरू कर रही है। शाम तक सड़क समतल कर दी जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PWD road squad is patching the Nagar Road highway craters. Expected completion by 7 PM."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 09:30 AM", detail: "Citizen uploaded highway crater photo", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Oct 1, 09:31 AM", detail: "Classified as CRITICAL Highway Risk (Score 96)", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0104",
    title: "Open Stormwater Drain Overflow & Black Water Stagnation in Ubale Nagar",
    descriptionRaw: "Ubale Nagar Lane 3 mein drainage line block ho chuki hai. Ganda kala paani raste par jama hai aur bimari ka khatra ho raha hai.",
    languageDetected: "Hinglish / Hindi (Confidence 97%)",
    category: "Drainage & Waterlogging",
    department: "PMC Drainage Department",
    officerName: "Er. Sunita Kulkarni",
    officerDesignation: "PMC Drainage Inspector",
    location: {
      ward: "Wagholi Ward 30 (Ubale Nagar)",
      area: "Ubale Nagar Lane 3, Near Primary School",
      city: "Pune",
      pincode: "412207",
      lat: 18.5830,
      lng: 73.9860
    },
    urgency: "HIGH",
    urgencyScore: 89,
    status: "INGESTED",
    createdAt: "2026-10-01 10:15 AM",
    slaDeadline: "2026-10-02 02:00 PM",
    slaHoursLeft: 16,
    clusterId: "CL-WAG-DRAIN-04",
    clusterTitle: "Ubale Nagar Storm Drain Siltation Cluster",
    clusterCount: 11,
    upvotes: 43,
    citizenName: "Mahesh Ubale",
    citizenPhone: "+91 98901-22441",
    evidence: {
      photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
      confidenceScore: 0.96,
      detectedIssue: "Drain Siltation & Black Water Overflow"
    },
    photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-04",
      departmentConfidence: 98.2,
      urgencyScore: 89,
      sentimentScore: -0.85,
      sentimentLabel: "Sanitation Hazard & School Inundation",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "Covered Stormwater Masonry Drain" },
        { label: "Location", val: "Ubale Nagar School Approach Road" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Drain blocked by plastic debris; backflow onto school lane.",
      "Suction jetting machine required to clear 25m blockage."
    ],
    recommendedResolution: {
      primaryAction: "Deploy PMC High-Pressure Suction Jetting Van",
      standardOperatingProcedure: "PMC-SOP-DRAINAGE-DESILT",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["Suction Jetting Tanker", "Silt Dredger"],
      citizenDraftHindi: "प्रिय नागरिक, उबाले नगर नाली की सफाई के लिए जेटिंग मशीन भेजी जा रही है।",
      citizenDraftEnglish: "Dear Citizen, suction machine dispatched to clear drainage line in Ubale Nagar."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 10:15 AM", detail: "Citizen logged drainage overflow report", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Oct 1, 10:16 AM", detail: "Classified as HIGH Priority Drain Hazard", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0105",
    title: "Dangling 11kV Power Cable & Transformer Sparking at Wagholi Chowk",
    descriptionRaw: "Wagholi main bus stop ke paas transformer se aag ki chingariyan nikal rahi hain aur 11kV taar niche latak raha hai.",
    languageDetected: "Hinglish / Marathi (Confidence 99%)",
    category: "Electricity & Power Grid",
    department: "Maharashtra State Electricity Board (MSEB)",
    officerName: "Er. Nitin Chavan",
    officerDesignation: "MSEB Sub-Station Engineer",
    location: {
      ward: "Wagholi Ward 28 (Wagholi Main Chowk)",
      area: "Wagholi Main Chowk, Near Bus Terminal",
      city: "Pune",
      pincode: "412207",
      lat: 18.5805,
      lng: 73.9825
    },
    urgency: "CRITICAL",
    urgencyScore: 98,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 07:15 AM",
    slaDeadline: "2026-10-01 01:00 PM",
    slaHoursLeft: 2,
    clusterId: "CL-WAG-POWER-05",
    clusterTitle: "Wagholi Chowk High-Tension Cable Spark Hazard",
    clusterCount: 22,
    upvotes: 95,
    citizenName: "Deepak More",
    citizenPhone: "+91 97654-33210",
    evidence: {
      photoUrl: "/civic-problems/ai_dangling_power_cables.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Live 11kV Overhead Cable Sagging & Sparking"
    },
    photoUrl: "/civic-problems/ai_dangling_power_cables.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-05",
      departmentConfidence: 99.8,
      urgencyScore: 98,
      sentimentScore: -0.96,
      sentimentLabel: "Immediate Electrocution & Public Market Hazard",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Asset", val: "11kV Overhead Feeder & Transformer" },
        { label: "Clearance", val: "< 2.1m above pedestrian road" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Immediate electrocution threat over crowded market crossing.",
      "MSEB line squad on site isolating power and re-tensioning cable conductors."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Feeder & Elevate Aerial Bundle Conductors",
      standardOperatingProcedure: "MSEB-EMERGENCY-ELECTRICAL-SOP",
      estimatedFixTime: "1.5 Hours",
      equipmentRequired: ["Cherry Picker Lift", "Insulated Rods"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली चौक बिजली के लटकते तारों को ठीक करने का काम जारी है।",
      citizenDraftEnglish: "Dear Citizen, MSEB squad is securing the power line at Wagholi Chowk."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 07:15 AM", detail: "Emergency spark report logged", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Oct 1, 07:16 AM", detail: "CRITICAL Safety Alert (Score 98)", status: "completed" },
      { stage: "Field Repair Active", time: "Oct 1, 07:45 AM", detail: "Line squad elevating cables", status: "in_progress" }
    ]
  },
  {
    id: "PN-2026-WAG-0106",
    title: "Illegal Construction Dust & Cement Debris Dumping along Bakori Road",
    descriptionRaw: "Bakori Road par bina cover ke cement aur construction debris feka ja raha tha jisse hawa mein dhool fail rahi thi.",
    languageDetected: "Hinglish (Confidence 96%)",
    category: "Sanitation & Solid Waste",
    department: "Pune Municipal Corporation (PMC)",
    officerName: "Er. Ramesh Shinde",
    officerDesignation: "PMC Sanitation Inspector",
    location: {
      ward: "Wagholi Ward 30 (Bakori Road Corridor)",
      area: "Bakori Road Extension, Near Society Gate",
      city: "Pune",
      pincode: "412207",
      lat: 18.5850,
      lng: 73.9870
    },
    urgency: "MEDIUM",
    urgencyScore: 72,
    status: "RESOLVED",
    createdAt: "2026-09-29 11:00 AM",
    slaDeadline: "2026-09-30 05:00 PM",
    slaHoursLeft: 0,
    clusterId: "CL-WAG-DUST-06",
    clusterTitle: "Bakori Road Construction Dust Control",
    clusterCount: 9,
    upvotes: 36,
    citizenName: "Anil Kapse",
    citizenPhone: "+91 98224-99881",
    evidence: {
      photoUrl: "/civic-problems/construction_dust_pollution.jpg",
      confidenceScore: 0.95,
      detectedIssue: "Uncovered Construction Debris & Dust Pollution"
    },
    photoUrl: "/civic-problems/construction_dust_pollution.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-06",
      departmentConfidence: 97.5,
      urgencyScore: 72,
      sentimentScore: -0.70,
      sentimentLabel: "Air Quality Nuisance",
      healthRiskLevel: "MEDIUM",
      extractedEntities: [],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Debris cleared by PMC dumper and water sprinkler unit deployed."
    ],
    recommendedResolution: {
      primaryAction: "Clear Debris & Issue Fine to Builder",
      standardOperatingProcedure: "PMC-SOP-DUST-MITIGATION",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["Water Sprinkler", "JCB Dumper"],
      citizenDraftHindi: "प्रिय नागरिक, बकोरी रोड का मलबा हटा दिया गया है और पानी छिड़क कर धूल साफ कर दी गई है।",
      citizenDraftEnglish: "Dear Citizen, the construction debris on Bakori Road has been cleared and area washed."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 29, 11:00 AM", detail: "Report logged with photo", status: "completed" },
      { stage: "Resolved & Verified", time: "Sep 30, 03:30 PM", detail: "Debris cleared & citizen verified", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0107",
    title: "Broken Streetlight Poles & Dangerous Dark Blindspot near Wagheshwar Temple",
    descriptionRaw: "Wagheshwar Temple approach lane mein 4 streetlights band the, raat mein andhera rehta tha.",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Electricity & Power Grid",
    department: "PMC Electrical Works",
    officerName: "Er. Nitin Chavan",
    officerDesignation: "PMC Electrical Engineer",
    location: {
      ward: "Wagholi Ward 27 (Wagheshwar Temple Area)",
      area: "Wagheshwar Temple Lane, Near Main Gate",
      city: "Pune",
      pincode: "412207",
      lat: 18.5775,
      lng: 73.9785
    },
    urgency: "LOW",
    urgencyScore: 60,
    status: "RESOLVED",
    createdAt: "2026-09-28 06:00 PM",
    slaDeadline: "2026-09-29 06:00 PM",
    slaHoursLeft: 0,
    clusterId: "CL-WAG-LIGHT-07",
    clusterTitle: "Wagheshwar Temple Streetlight Maintenance",
    clusterCount: 7,
    upvotes: 28,
    citizenName: "Ganesh Kulkarni",
    citizenPhone: "+91 97632-88190",
    evidence: {
      photoUrl: "/civic-problems/broken_street_light.jpg",
      confidenceScore: 0.98,
      detectedIssue: "LED Driver Replacement for Streetlight Array"
    },
    photoUrl: "/civic-problems/broken_street_light.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-07",
      departmentConfidence: 99.0,
      urgencyScore: 60,
      sentimentScore: -0.65,
      sentimentLabel: "Pedestrian Safety at Night",
      healthRiskLevel: "LOW",
      extractedEntities: [],
      ragMatches: []
    },
    aiOfficerBrief: [
      "LED bulbs and circuit drivers replaced; full lane illuminated."
    ],
    recommendedResolution: {
      primaryAction: "Replace 72W LED Fixtures",
      standardOperatingProcedure: "PMC-SOP-STREETLIGHT",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["Hydraulic Ladder Van", "72W LED Drivers"],
      citizenDraftHindi: "प्रिय नागरिक, वाघेश्वर मंदिर मार्ग की सभी स्ट्रीटलाइट्स चालू कर दी गई हैं।",
      citizenDraftEnglish: "Dear Citizen, all streetlights near Wagheshwar Temple have been replaced and tested."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 28, 06:00 PM", detail: "Logged report", status: "completed" },
      { stage: "Resolved", time: "Sep 29, 02:00 PM", detail: "New LED lights installed & verified", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0108",
    title: "Broken Manhole Cover & Open Drain Chamber at Raisoni College Chowk",
    descriptionRaw: "Raisoni College main chowk pe open manhole chamber hai, concrete slab toot gayi hai. Night me two wheelers ke girne ka extreme accident risk hai.",
    languageDetected: "Hinglish / Hindi (Confidence 98%)",
    category: "Drainage & Waterlogging",
    department: "PMC Drainage Department",
    officerName: "Er. Sunita Kulkarni",
    officerDesignation: "PMC Drainage Inspector",
    location: {
      ward: "Wagholi Ward 28 (Raisoni Sub-District)",
      area: "Raisoni College Road, Domkhel Phata",
      city: "Pune",
      pincode: "412207",
      lat: 18.5842,
      lng: 73.9815
    },
    urgency: "CRITICAL",
    urgencyScore: 97,
    status: "INGESTED",
    createdAt: "2026-10-01 11:20 AM",
    slaDeadline: "2026-10-01 05:00 PM",
    slaHoursLeft: 4,
    clusterId: "CL-WAG-DRAIN-04",
    clusterTitle: "Raisoni Chowk Manhole & Drain Hazards",
    clusterCount: 14,
    upvotes: 62,
    citizenName: "Sanket Shinde",
    citizenPhone: "+91 98812-44321",
    evidence: {
      photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Shattered Heavy RCC Manhole Slab"
    },
    photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-08",
      departmentConfidence: 99.2,
      urgencyScore: 97,
      sentimentScore: -0.95,
      sentimentLabel: "Severe Pedestrian & Two-Wheeler Hazard",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Chamber Depth", val: "1.8 Meters Deep Open Shaft" },
        { label: "Traffic Volume", val: "High (College Transit Corridor)" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Open drainage shaft poses immediate falling hazard.",
      "Emergency squad dispatched with heavy-duty ductile iron cover and warning cones."
    ],
    recommendedResolution: {
      primaryAction: "Install Heavy Duty Reinforced Concrete / Ductile Iron Manhole Cover",
      standardOperatingProcedure: "PMC-SOP-DRAIN-SAFETY-01",
      estimatedFixTime: "2.5 Hours",
      equipmentRequired: ["Hydraulic Loader", "Ductile Iron Manhole Lid (600mm)", "Reflective Safety Barricades"],
      citizenDraftHindi: "प्रिय नागरिक, रायसोनी कॉलेज चौक के खुले मैनहोल पर तुरंत नया ढक्कन लगाने के लिए आपातकालीन टीम भेजी गई है।",
      citizenDraftEnglish: "Dear Citizen, emergency PMC squad dispatched with replacement heavy-duty manhole cover at Raisoni Chowk."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 11:20 AM", detail: "Citizen uploaded live photo of broken manhole slab", status: "completed" },
      { stage: "AI Triage & Urgency Flag", time: "Oct 1, 11:21 AM", detail: "Classified as CRITICAL accident hazard", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0109",
    title: "Dead Animal Carcass & Unhygienic Biohazard at Domkhel Road Corner",
    descriptionRaw: "Domkhel road corner pe animal carcass pichle 2 din se pada hai, foul smell aur flies se residential area me bimari fail rahi hai.",
    languageDetected: "Hinglish / Marathi (Confidence 96%)",
    category: "Solid Waste Management",
    department: "PMC Solid Waste Management",
    officerName: "Er. Amit Deshmukh",
    officerDesignation: "PMC Sanitation Superintendent",
    location: {
      ward: "Wagholi Ward 28 (Domkhel)",
      area: "Domkhel Road, Near Oxy Valley Society",
      city: "Pune",
      pincode: "412207",
      lat: 18.5875,
      lng: 73.9850
    },
    urgency: "CRITICAL",
    urgencyScore: 95,
    status: "INGESTED",
    createdAt: "2026-10-01 10:45 AM",
    slaDeadline: "2026-10-01 04:00 PM",
    slaHoursLeft: 3,
    clusterId: "CL-WAG-GARBAGE-01",
    clusterTitle: "Domkhel Sanitation & Health Biohazards",
    clusterCount: 9,
    upvotes: 48,
    citizenName: "Pradeep More",
    citizenPhone: "+91 97654-11892",
    evidence: {
      photoUrl: "/civic-problems/roadside_garbage_heap.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Animal Carcass & Unsanitary Waste Deposit"
    },
    photoUrl: "/civic-problems/roadside_garbage_heap.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-09",
      departmentConfidence: 98.8,
      urgencyScore: 95,
      sentimentScore: -0.92,
      sentimentLabel: "Public Health Threat & Biohazard",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Zone", val: "Residential Society Entrance" },
        { label: "Odor Dispersion", val: "Severe within 150m radius" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Bio-waste carcass causing health hazards and stray dog pack aggregation.",
      "Requires rapid sanitized burial van and bleaching powder disinfection."
    ],
    recommendedResolution: {
      primaryAction: "Dispatch Special Animal Carcass Sanitization Van & Disinfect Area",
      standardOperatingProcedure: "PMC-SOP-BIO-CLEAN-V3",
      estimatedFixTime: "1.5 Hours",
      equipmentRequired: ["Sanitized Bio-Disposal Van", "Calcium Hypochlorite Bleach (20kg)", "Protective PPE Kits"],
      citizenDraftHindi: "प्रिय नागरिक, डोमखेल रोड पर मृत पशु उठाने और क्षेत्र में कीटनाशक छिड़काव के लिए विशेष वाहन भेजा जा रहा है।",
      citizenDraftEnglish: "Dear Citizen, animal carcass removal squad with disinfection chemical sprayer has been mobilized for Domkhel Road."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 10:45 AM", detail: "Citizen logged urgent biohazard photo", status: "completed" },
      { stage: "AI Priority Escalated", time: "Oct 1, 10:46 AM", detail: "Prioritized as Priority Red bio-sanitation incident", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0110",
    title: "Turbid Brown Drinking Water & Chemical Odor in Majestique City Society Line",
    descriptionRaw: "Society main inlet tap se muddy contaminated brown water aa raha hai with strong chemical foul smell. Drinking water unsafe for 400+ flats.",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Water Supply & Contamination",
    department: "PMC Water Supply Department",
    officerName: "Er. Rajesh Patil",
    officerDesignation: "PMC Water Works Engineer",
    location: {
      ward: "Wagholi Ward 29 (Kesnand Corridor)",
      area: "Majestique City Main Gate, Kesnand Road",
      city: "Pune",
      pincode: "412207",
      lat: 18.5795,
      lng: 73.9880
    },
    urgency: "HIGH",
    urgencyScore: 88,
    status: "INGESTED",
    createdAt: "2026-10-01 08:50 AM",
    slaDeadline: "2026-10-02 12:00 PM",
    slaHoursLeft: 14,
    clusterId: "CL-WAG-WATER-02",
    clusterTitle: "Kesnand Corridor Water Purity Crisis",
    clusterCount: 18,
    upvotes: 77,
    citizenName: "Vandana Joshi",
    citizenPhone: "+91 98230-77123",
    evidence: {
      photoUrl: "/civic-problems/water_pipe_leak.jpg",
      confidenceScore: 0.97,
      detectedIssue: "Water Line Infiltration & High Turbidity"
    },
    photoUrl: "/civic-problems/water_pipe_leak.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-10",
      departmentConfidence: 99.1,
      urgencyScore: 88,
      sentimentScore: -0.84,
      sentimentLabel: "Contaminated Domestic Drinking Water Supply",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Population Impacted", val: "400+ Residential Families" },
        { label: "Turbidity (NTU)", val: "18.5 (Standard < 1.0)" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Inlet pipeline ingress detected near stormwater culvert.",
      "Valves need isolation, suction flush, and water sample testing before restoring supply."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Feeder Valve, High-Pressure Pipeline Flush & Chlorine Shock",
      standardOperatingProcedure: "PMC-SOP-WATER-PURITY",
      estimatedFixTime: "4 Hours",
      equipmentRequired: ["Water Sample Testing Kit", "High Pressure Flushing Pump", "Chlorine Dosing Unit"],
      citizenDraftHindi: "प्रिय नागरिक, मेजेस्टिक सिटी की पानी पाइपलाइन की जांच शुरू हो गई है। पाइपलाइन फ्लश कर शुद्ध पानी की आपूर्ति बहाल की जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PMC water department has begun pipeline flushing and chlorination for Majestique City line."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 08:50 AM", detail: "Report submitted with water color photo", status: "completed" },
      { stage: "AI Triage", time: "Oct 1, 08:52 AM", detail: "Flagged as high-risk domestic water contamination", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0111",
    title: "Continuous Open Garbage Burning & Dense Toxic Smoke at Soygaon Phata",
    descriptionRaw: "Illegal plastic and solid waste burning happening daily in open plot near canal road. Dense toxic smoke entering nearby apartments.",
    languageDetected: "Hinglish / Marathi (Confidence 97%)",
    category: "Solid Waste Management",
    department: "PMC Solid Waste Management",
    officerName: "Er. Amit Deshmukh",
    officerDesignation: "PMC Sanitation Superintendent",
    location: {
      ward: "Wagholi Ward 31 (Soygaon)",
      area: "Soygaon Phata, Near Canal Road",
      city: "Pune",
      pincode: "412207",
      lat: 18.5860,
      lng: 73.9920
    },
    urgency: "HIGH",
    urgencyScore: 85,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 07:15 AM",
    slaDeadline: "2026-10-01 07:00 PM",
    slaHoursLeft: 8,
    clusterId: "CL-WAG-GARBAGE-01",
    clusterTitle: "Wagholi East Waste Dumping & Open Burning",
    clusterCount: 12,
    upvotes: 55,
    citizenName: "Tanaji Shinde",
    citizenPhone: "+91 99214-33810",
    evidence: {
      photoUrl: "/civic-problems/garbage_dumping_market.jpg",
      confidenceScore: 0.98,
      detectedIssue: "Open Plastic Combustive Smoldering"
    },
    photoUrl: "/civic-problems/garbage_dumping_market.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-11",
      departmentConfidence: 98.6,
      urgencyScore: 85,
      sentimentScore: -0.87,
      sentimentLabel: "Severe Air Quality Deterioration & Respiratory Risk",
      healthRiskLevel: "MEDIUM",
      extractedEntities: [
        { label: "AQI Local Spike", val: "340 PM2.5 in plume" },
        { label: "Plot Status", val: "Vacant Private Layout (Plot #44)" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Open smoldering garbage fire causing PM2.5 haze over Soygaon residential complexes.",
      "Water mist tanker deployed; penalty notice generated under NGT municipal bylaws."
    ],
    recommendedResolution: {
      primaryAction: "Extinguish Smoldering Pile, Apply Soil Capping & Issue Section 133 NGT Notice",
      standardOperatingProcedure: "PMC-SOP-FIRE-AIR-02",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["PMC Water Bowser Tanker", "JCB Backhoe Loader", "Fine Notice Protocol"],
      citizenDraftHindi: "प्रिय नागरिक, सोयगांव फाटा पर कचरा जलाने वाले स्थान पर पानी का टैंकर भेजकर आग बुझा दी गई है और प्लॉट मालिक को नोटिस जारी किया गया है।",
      citizenDraftEnglish: "Dear Citizen, PMC fire water bowser has quenched the smoldering dump at Soygaon Phata and penalty notice has been served."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 07:15 AM", detail: "Citizen submitted morning smoke photo", status: "completed" },
      { stage: "Squad Mobilized", time: "Oct 1, 08:30 AM", detail: "PMC Bowser Squad reached location", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0112",
    title: "Dangling Low-Tension Power Wire & Sparking Pole near Oasis Breeze",
    descriptionRaw: "Overhead service line pole wire is hanging loose at 6 feet height. Sparks seen during evening wind.",
    languageDetected: "Hinglish (Confidence 98%)",
    category: "Electricity & Power Grid",
    department: "MSEDCL Wagholi Sub-Division",
    officerName: "Er. Nitin Chavan",
    officerDesignation: "MSEDCL Junior Engineer (Wagholi)",
    location: {
      ward: "Wagholi Ward 29 (Bakori Road)",
      area: "Oasis Breeze Society Lane, Bakori Phata",
      city: "Pune",
      pincode: "412207",
      lat: 18.5810,
      lng: 73.9830
    },
    urgency: "HIGH",
    urgencyScore: 82,
    status: "ACTION_DISPATCHED",
    createdAt: "2026-10-01 09:10 AM",
    slaDeadline: "2026-10-01 06:00 PM",
    slaHoursLeft: 6,
    clusterId: "CL-WAG-POWER-05",
    clusterTitle: "Bakori Road Overhead Power Line Sags",
    clusterCount: 8,
    upvotes: 39,
    citizenName: "Sameer Kulkarni",
    citizenPhone: "+91 98229-44012",
    evidence: {
      photoUrl: "/civic-problems/ai_dangling_power_cables.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Overhead 440V Conductor Sag & Insulation Damage"
    },
    photoUrl: "/civic-problems/ai_dangling_power_cables.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-12",
      departmentConfidence: 99.4,
      urgencyScore: 82,
      sentimentScore: -0.89,
      sentimentLabel: "Electrocution Hazard for Pedestrians",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Voltage", val: "440V 3-Phase LT Line" },
        { label: "Sag Clearance", val: "1.9m (Mandatory > 5.5m)" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Low hanging wire poses electrocution risk to pedestrians and delivery vans.",
      "Lineman emergency team assigned with cable tensioner."
    ],
    recommendedResolution: {
      primaryAction: "Re-tension Overhead Conductor, Install Aerial Bundled Cable (ABC) Spacer",
      standardOperatingProcedure: "MSEDCL-SOP-LT-LINE-FIX",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["Hydraulic Bucket Truck", "Insulated Tension Puller", "Aerial Cable Ties"],
      citizenDraftHindi: "प्रिय नागरिक, ओएसिस ब्रीज के पास ढीले बिजली तार को खींचकर सुरक्षित ऊंचाई पर बांधने के लिए महावितरण टीम मौके पर पहुंच रही है।",
      citizenDraftEnglish: "Dear Citizen, MSEDCL lineman team is en route to re-tension and secure the dangling overhead power cable."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 09:10 AM", detail: "Citizen submitted hazard report", status: "completed" },
      { stage: "Work Order Issued", time: "Oct 1, 09:25 AM", detail: "Squad WO-WAG-ELEC-44 dispatched", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0113",
    title: "Illegal Encroachment & Blocked Pedestrian Walkway on Wagholi Weekly Mandi Road",
    descriptionRaw: "Temporary iron stalls and crates placed on footpath forcing school children and pedestrians onto heavy traffic road.",
    languageDetected: "Hinglish (Confidence 96%)",
    category: "Roads & Infrastructure",
    department: "PMC Encroachment Department",
    officerName: "Er. Ramesh Gaikwad",
    officerDesignation: "PMC Encroachment Inspector",
    location: {
      ward: "Wagholi Ward 27 (Central Market)",
      area: "Wagholi Mandi Ground Road, Opp Bus Stand",
      city: "Pune",
      pincode: "412207",
      lat: 18.5760,
      lng: 73.9770
    },
    urgency: "MEDIUM",
    urgencyScore: 72,
    status: "INGESTED",
    createdAt: "2026-10-01 10:00 AM",
    slaDeadline: "2026-10-02 06:00 PM",
    slaHoursLeft: 22,
    clusterId: "CL-WAG-MARKET-08",
    clusterTitle: "Central Wagholi Market Encroachments",
    clusterCount: 6,
    upvotes: 31,
    citizenName: "Anita Thorat",
    citizenPhone: "+91 97633-99011",
    evidence: {
      photoUrl: "/civic-problems/roadside_garbage_heap.jpg",
      confidenceScore: 0.95,
      detectedIssue: "Footpath Obstruction & Commercial Encroachment"
    },
    photoUrl: "/civic-problems/roadside_garbage_heap.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-13",
      departmentConfidence: 97.5,
      urgencyScore: 72,
      sentimentScore: -0.71,
      sentimentLabel: "Pedestrian Blockade & Traffic Congestion",
      healthRiskLevel: "LOW",
      extractedEntities: [
        { label: "Footpath Width Blocked", val: "100% of 2.2m walkway" },
        { label: "Target Area", val: "Bus Stand Entrance corridor" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Unauthorized wooden stalls encroaching main school transit walkway.",
      "Notice and anti-encroachment removal drive planned for afternoon."
    ],
    recommendedResolution: {
      primaryAction: "Execute Anti-Encroachment Footpath Clearance & Erect Pedestrian Guardrails",
      standardOperatingProcedure: "PMC-SOP-ENCROACH-03",
      estimatedFixTime: "3 Hours",
      equipmentRequired: ["Encroachment Recovery Truck", "PMC Security Squad", "Bilingual Notice Seals"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली बस स्टैंड के पास फुटपाथ पर अवैध अतिक्रमण हटाने की कार्रवाई पीएमसी दस्ते द्वारा की जा रही है।",
      citizenDraftEnglish: "Dear Citizen, PMC anti-encroachment squad has scheduled footpath clearance at Wagholi Mandi road."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 10:00 AM", detail: "Citizen logged pedestrian obstruction", status: "completed" },
      { stage: "Assigned", time: "Oct 1, 10:15 AM", detail: "Forwarded to PMC Encroachment Ward 27 Officer", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0114",
    title: "Unmarked Speed Breaker & Dangerous Bump on Kesnand Phata Bridge Approach",
    descriptionRaw: "Speed breaker without thermoplastic retroreflective paint or warning signboard causing sudden vehicle braking and minor accidents.",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD Pune)",
    officerName: "Er. Amit Deshmukh",
    officerDesignation: "PWD Executive Engineer (Roads)",
    location: {
      ward: "Wagholi Ward 29 (Kesnand Corridor)",
      area: "Kesnand Phata Flyover Descent",
      city: "Pune",
      pincode: "412207",
      lat: 18.5788,
      lng: 73.9845
    },
    urgency: "MEDIUM",
    urgencyScore: 68,
    status: "IN_PROGRESS",
    createdAt: "2026-09-30 04:30 PM",
    slaDeadline: "2026-10-02 04:30 PM",
    slaHoursLeft: 20,
    clusterId: "CL-WAG-ROADS-03",
    clusterTitle: "Wagholi Highway Road Safety & Markings",
    clusterCount: 5,
    upvotes: 35,
    citizenName: "Deepak Choudhary",
    citizenPhone: "+91 98811-00234",
    evidence: {
      photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
      confidenceScore: 0.96,
      detectedIssue: "Unmarked Speed Breaker Surface Hazard"
    },
    photoUrl: "/civic-problems/pothole_broken_drain_grate.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-14",
      departmentConfidence: 98.0,
      urgencyScore: 68,
      sentimentScore: -0.68,
      sentimentLabel: "Vehicular Safety & Unmarked Road Hazard",
      healthRiskLevel: "LOW",
      extractedEntities: [
        { label: "Location", val: "Bridge Flyover Ramp Downhill" },
        { label: "Night Visibility", val: "Poor (Zero Reflective Paint)" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Unmarked speed bump causing heavy braking and rear-end crash risks.",
      "Thermoplastic paint crew deployed for zebra striping."
    ],
    recommendedResolution: {
      primaryAction: "Apply Thermoplastic Retroreflective Yellow/White Stripes & Install IRC Standard Signboard",
      standardOperatingProcedure: "IRC-SOP-SPEEDBREAKER-2023",
      estimatedFixTime: "2.5 Hours",
      equipmentRequired: ["Thermoplastic Road Marking Applicator", "Retroreflective Glass Beads", "IRC Caution Signboard"],
      citizenDraftHindi: "प्रिय नागरिक, केसनंद फाटा ब्रिज के स्पीड ब्रेकर पर पीले रिफ्लेक्टिव पट्टे और चेतावनी बोर्ड लगाने का कार्य प्रगति पर है।",
      citizenDraftEnglish: "Dear Citizen, PWD road safety squad is painting thermoplastic reflective stripes on the Kesnand flyover speed breaker."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 30, 04:30 PM", detail: "Citizen uploaded unmarked speed bump photo", status: "completed" },
      { stage: "Work Initiated", time: "Oct 1, 09:00 AM", detail: "Road painting crew reached site", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0115",
    title: "Wild Bush Overgrowth & Broken Benches at Wagheshwar Lake Public Garden",
    descriptionRaw: "Overgrown weed shrubs and broken walking track wooden benches repaired and landscaped.",
    languageDetected: "English / Hinglish (Confidence 99%)",
    category: "Public Parks & Horticulture",
    department: "PMC Garden & Tree Authority",
    officerName: "Er. Ramesh Gaikwad",
    officerDesignation: "PMC Garden Superintendent",
    location: {
      ward: "Wagholi Ward 27 (Wagheshwar Temple Area)",
      area: "Wagheshwar Lakefront Promenade",
      city: "Pune",
      pincode: "412207",
      lat: 18.5770,
      lng: 73.9792
    },
    urgency: "LOW",
    urgencyScore: 45,
    status: "RESOLVED",
    createdAt: "2026-09-29 10:00 AM",
    slaDeadline: "2026-09-30 06:00 PM",
    slaHoursLeft: 0,
    clusterId: "CL-WAG-PARK-09",
    clusterTitle: "Wagheshwar Lake Promenade Upkeep",
    clusterCount: 4,
    upvotes: 22,
    citizenName: "Meenakshi Kulkarni",
    citizenPhone: "+91 97645-33219",
    evidence: {
      photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
      confidenceScore: 0.97,
      detectedIssue: "Lakefront Garden Landscaping & Maintenance"
    },
    photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-15",
      departmentConfidence: 98.4,
      urgencyScore: 45,
      sentimentScore: 0.45,
      sentimentLabel: "Civic Amenity Restoration",
      healthRiskLevel: "LOW",
      extractedEntities: [
        { label: "Park Zone", val: "Lake Walking Track Section C" },
        { label: "Benches Installed", val: "4 Cast Iron & Concrete Benches" }
      ],
      ragMatches: []
    },
    aiOfficerBrief: [
      "Horticulture pruning completed; 4 new pre-cast concrete benches installed.",
      "Resident senior citizens verified restoration."
    ],
    recommendedResolution: {
      primaryAction: "Horticulture Trimming & Concrete Bench Replacement",
      standardOperatingProcedure: "PMC-SOP-PARKS-MAINT",
      estimatedFixTime: "3 Hours",
      equipmentRequired: ["Horticulture Hedge Trimmer", "4x Precast Reinforced Benches", "Lawn Mower"],
      citizenDraftHindi: "प्रिय नागरिक, वाघेश्वर झील उद्यान की झाड़ियों की छंटाई और नई बेंच लगाने का कार्य सफलतापूर्वक पूरा हो चुका है।",
      citizenDraftEnglish: "Dear Citizen, Wagheshwar Lake promenade bushes have been pruned and new concrete benches installed."
    },
    timeline: [
      { stage: "Submitted", time: "Sep 29, 10:00 AM", detail: "Citizen logged garden upkeep request", status: "completed" },
      { stage: "Resolved", time: "Sep 30, 04:30 PM", detail: "Maintenance completed & citizen verified", status: "completed" }
    ]
  },
  {
    id: "PN-2026-WAG-0116",
    title: "Main Drinking Water Pipeline Rupture & Gushing on Baif Road Bazaar",
    descriptionRaw: "Wagholi Baif Road main market ke samne drinking water pipeline phat gayi hai. Sadak par paani beh raha hai aur 400 se zyada gharon mein drinking water supply band ho gayi hai.",
    languageDetected: "Hinglish / Marathi (Confidence 98%)",
    category: "Water Supply & Contamination",
    department: "PMC Water Supply Department",
    officerName: "Er. Rajesh Patil",
    officerDesignation: "PMC Water Works Executive Engineer",
    location: {
      ward: "Wagholi Ward 27 (Baif Road Corridor)",
      area: "Baif Road Market, Near Shree Ganesh Medicals",
      city: "Pune",
      pincode: "412207",
      lat: 18.5789,
      lng: 73.9775
    },
    urgency: "CRITICAL",
    urgencyScore: 96,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 08:30 AM",
    slaDeadline: "2026-10-01 04:00 PM",
    slaHoursLeft: 4,
    clusterId: "CL-WAG-WATER-02",
    clusterTitle: "Wagholi Baif Road & Kesnand Feeder Pipe Rupture Cluster",
    clusterCount: 18,
    upvotes: 68,
    citizenName: "Aditya Verma",
    citizenPhone: "+91 98712-88491",
    evidence: {
      photoUrl: "/civic-problems/water_pipe_leak.jpg",
      confidenceScore: 0.98,
      detectedIssue: "High Pressure Potable Pipeline Fracture"
    },
    photoUrl: "/civic-problems/water_pipe_leak.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-16",
      departmentConfidence: 99.2,
      urgencyScore: 96,
      sentimentScore: -0.89,
      sentimentLabel: "Severe Water Wastage & Public Disruption",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Infrastructure", val: "150mm High-Pressure Cast Iron Main" },
        { label: "Landmark", val: "Baif Road Market Corridor" },
        { label: "Wastage Rate", val: "~3,200 Litres/Hour Potable Water" },
        { label: "Affected Population", val: "450+ Households & 30 Retail Shops" }
      ],
      ragMatches: [
        {
          caseId: "PMC-WATER-2025-119",
          summary: "Emergency shutoff valve isolation and carbon steel clamp fitting.",
          similarity: 0.96,
          resolutionTime: "4 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "High-pressure pipeline burst visible on road surface; wasting clean drinking water at 3,200 L/hr.",
      "Road traffic stalled; market approach lane partially flooded.",
      "Feeder valve upstream at Wagholi Zone 4 needs immediate shutoff to begin pipe sleeve clamp installation."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Baif Road Gate Valve & Install 150mm Sleeve Clamp",
      standardOperatingProcedure: "PMC-SOP-WATER-RUPTURE-V3",
      estimatedFixTime: "3.5 Hours",
      equipmentRequired: ["150mm Heavy Duty Pipe Clamp", "Submersible Dewatering Pump", "Asphalt Excavator"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली बैफ रोड पानी पाइपलाइन मरम्मत के लिए पीएमसी जल विभाग की टीम मौके पर काम कर रही है। शाम 4 बजे तक आपूर्ति बहाल हो जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PMC rapid response team is on site repairing the ruptured water pipeline near Baif Road Market. Water supply will be restored by 4:00 PM."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 08:30 AM", detail: "Citizen logged complaint with photo of water fountain burst", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Oct 1, 08:31 AM", detail: "Classified as CRITICAL Water Wastage Hazard (Score 96)", status: "completed" },
      { stage: "Cluster Linked", time: "Oct 1, 08:35 AM", detail: "Merged with 18 related reports in Wagholi Ward 27", status: "completed" },
      { stage: "Officer Assigned", time: "Oct 1, 09:00 AM", detail: "Assigned to Er. Rajesh Patil; emergency crew dispatched", status: "completed" },
      { stage: "Field Repair Active", time: "Oct 1, 10:15 AM", detail: "Gate valve isolated; clamp installation in progress", status: "in_progress" }
    ]
  },
  {
    id: "PN-2026-WAG-0117",
    title: "Commercial Plastic & Solid Waste Backlog on Ivy Estate Commercial Plaza",
    descriptionRaw: "Ivy Estate commercial market road ke paas kude ka dher jama hai. 4 din se garbage dumper nahi aaya, kutte kachra raste par bikhra rahe hain.",
    languageDetected: "Hinglish / Marathi (Confidence 99%)",
    category: "Sanitation & Solid Waste",
    department: "PMC Solid Waste Management",
    officerName: "Er. Amit Deshmukh",
    officerDesignation: "PMC Sanitation Superintendent",
    location: {
      ward: "Wagholi Ward 29 (Kesnand Corridor)",
      area: "Ivy Estate Commercial Complex Road",
      city: "Pune",
      pincode: "412207",
      lat: 18.5798,
      lng: 73.9875
    },
    urgency: "HIGH",
    urgencyScore: 88,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 07:45 AM",
    slaDeadline: "2026-10-01 06:00 PM",
    slaHoursLeft: 4,
    clusterId: "CL-WAG-GARBAGE-01",
    clusterTitle: "Wagholi East Commercial Waste Backlog",
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
      dnaId: "DNA-WAG-412207-17",
      departmentConfidence: 99.4,
      urgencyScore: 88,
      sentimentScore: -0.84,
      sentimentLabel: "Severe Sanitation & Air Quality Degradation",
      healthRiskLevel: "HIGH",
      extractedEntities: [
        { label: "Waste Classification", val: "Municipal Solid Waste (Commercial + Household)" },
        { label: "Volume Estimate", val: "~8.5 Metric Tonnes Uncollected Waste" },
        { label: "Road Impact", val: "50% Carriageway Blocked" }
      ],
      ragMatches: [
        {
          caseId: "PMC-SAN-2025-667",
          summary: "Double-trip hydraulic compactor clearance & sodium hypochlorite wash.",
          similarity: 0.95,
          resolutionTime: "4 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Large overflow of commercial plastic bags extending 15 meters along Ivy Estate complex.",
      "12MT compactor truck and sweeping gang dispatched."
    ],
    recommendedResolution: {
      primaryAction: "Deploy 12MT Hydraulic Compactor & Disinfectant Lime Wash",
      standardOperatingProcedure: "PMC-SOP-MSW-MARKET-CLEAN",
      estimatedFixTime: "3.5 Hours",
      equipmentRequired: ["12MT Compactor Dumper", "Front Loader Backhoe", "Bleaching Powder & Lime Sanitizer"],
      citizenDraftHindi: "प्रिय नागरिक, आइवी एस्टेट मार्केट क्षेत्र से कचरा हटाने के लिए 12 टन कॉम्पेक्टर वाहन भेज दिया गया है। शाम तक सफाई पूरी हो जाएगी।",
      citizenDraftEnglish: "Dear Citizen, PMC 12MT compactor unit and sanitation crew have arrived at Ivy Estate. Complete clearance will finish by 6:00 PM."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 07:45 AM", detail: "Citizen uploaded complaint with geo-tagged photograph", status: "completed" },
      { stage: "Vehicle Dispatched", time: "Oct 1, 09:00 AM", detail: "Compactor vehicle en route from Wagholi PMC Depot", status: "completed" },
      { stage: "Clearance in Progress", time: "Oct 1, 10:30 AM", detail: "7 metric tonnes loaded; road sweeping active", status: "in_progress" }
    ]
  },
  {
    id: "PN-2026-WAG-0118",
    title: "Severe Monsoon Road Waterlogging & Submerged Open Drain at Ubale Nagar Junction",
    descriptionRaw: "Halki barish mein bhi Ubale Nagar chowk doob gaya hai. Scooter aur gaadiyan band ho rahi hain, paani ghutno tak bhara hai aur naali ka dhakkan khula hone se bohot bada accident risk hai.",
    languageDetected: "Hinglish / Marathi (Confidence 99%)",
    category: "Drainage & Waterlogging",
    department: "PMC Drainage Department",
    officerName: "Er. Sunita Kulkarni",
    officerDesignation: "PMC Drainage Inspector",
    location: {
      ward: "Wagholi Ward 30 (Ubale Nagar)",
      area: "Ubale Nagar Crossroad, Nagar Road Junction",
      city: "Pune",
      pincode: "412207",
      lat: 18.5835,
      lng: 73.9855
    },
    urgency: "CRITICAL",
    urgencyScore: 97,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 07:15 AM",
    slaDeadline: "2026-10-01 01:00 PM",
    slaHoursLeft: 2,
    clusterId: "CL-WAG-DRAIN-04",
    clusterTitle: "Ubale Nagar & Underpass Monsoon Inundation Cluster",
    clusterCount: 19,
    upvotes: 74,
    citizenName: "Harsh Vardhan",
    citizenPhone: "+91 98103-99120",
    evidence: {
      photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
      confidenceScore: 0.99,
      detectedIssue: "Severe Urban Waterlogging & Open Manhole Submergence"
    },
    photoUrl: "/civic-problems/open_sewage_nullah_garbage.jpg",
    grievanceDna: {
      dnaId: "DNA-WAG-412207-18",
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
          caseId: "PMC-FLOOD-2025-014",
          summary: "Super-sucker suction pump deployment and culvert unclogging.",
          similarity: 0.99,
          resolutionTime: "2 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Dangerous waterlogging at busy Ubale Nagar intersection with submerged open manhole.",
      "Deploy mobile high-capacity dewatering pump and place red warning barricade around manhole."
    ],
    recommendedResolution: {
      primaryAction: "Deploy 50HP Super-Sucker Dewatering Pump & Install High-Visibility Manhole Cone",
      standardOperatingProcedure: "PMC-MONSOON-CRITICAL-SOP",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["50HP Mobile Dewatering Pump", "Suction Hose (100m)", "Safety Cones & Cordon Tape"],
      citizenDraftHindi: "प्रिय नागरिक, उबाले नगर चौराहे पर जलभराव निकालने के लिए 50HP का भारी पंप तैनात कर दिया गया है।",
      citizenDraftEnglish: "Dear Citizen, heavy 50HP dewatering pumps are clearing waterlogging at Ubale Nagar junction."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 07:15 AM", detail: "Citizen reported submerged vehicles and invisible open drain", status: "completed" },
      { stage: "AI Triage", time: "Oct 1, 07:16 AM", detail: "Flagged as CRITICAL Safety Hazard (Score 97)", status: "completed" },
      { stage: "Dewatering Active", time: "Oct 1, 08:15 AM", detail: "Water pumped down by 25cm; caution barricade placed", status: "in_progress" }
    ]
  },
  {
    id: "PN-2026-WAG-0119",
    title: "Dangerous Deep Asphalt Crater & Broken Storm Drain Grate on Nagar Road Highway",
    descriptionRaw: "Pune-Nagar Highway stretch near Lexicon entrance pe bohot bada gaddha ban gaya hai jisme barish ka ganda paani bhara hai. Naali ki lohe ki jaali toot chuki hai jisse two-wheelers roz gir rahe hain.",
    languageDetected: "Hinglish / Marathi (Confidence 98%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD Pune)",
    officerName: "Er. Amit Deshmukh",
    officerDesignation: "PWD Executive Engineer (Roads)",
    location: {
      ward: "Wagholi Ward 28 (Nagar Road Corridor)",
      area: "Nagar Road Highway, Opp. Lexicon School",
      city: "Pune",
      pincode: "412207",
      lat: 18.5782,
      lng: 73.9795
    },
    urgency: "CRITICAL",
    urgencyScore: 92,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 08:20 AM",
    slaDeadline: "2026-10-01 06:00 PM",
    slaHoursLeft: 5,
    clusterId: "CL-WAG-ROADS-03",
    clusterTitle: "Wagholi Highway Arterial Pothole & Broken Grate Cluster",
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
      dnaId: "DNA-WAG-412207-19",
      departmentConfidence: 99.3,
      urgencyScore: 92,
      sentimentScore: -0.87,
      sentimentLabel: "Acute Road Accident Hazard",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Cavity Dimensions", val: "0.9m x 0.7m, Depth 0.25m" },
        { label: "Hardware Failure", val: "Cast Iron Storm Drain Grate Fractured" }
      ],
      ragMatches: [
        {
          caseId: "PWD-ROAD-2025-112",
          summary: "Cold-mix asphalt rapid patchwork and cast-iron frame replacement.",
          similarity: 0.97,
          resolutionTime: "3 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Dual hazard: Deep asphalt pothole filled with water plus collapsed drain grate.",
      "Dispatch rapid patching truck with cast iron grate replacement and cold asphalt mix."
    ],
    recommendedResolution: {
      primaryAction: "Replace Heavy-Duty Cast Iron Grate & Patch Pothole with Cold Bitumen",
      standardOperatingProcedure: "PWD-FASTPATCH-ROAD-SOP",
      estimatedFixTime: "3 Hours",
      equipmentRequired: ["Cast Iron Grate (600x600mm)", "Cold Asphalt Mix (6 Bags)", "Compaction Plate Tamper"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली नगर रोड पर गड्ढा भरने और टूटी जाली बदलने का कार्य PWD टीम द्वारा शुरू कर दिया गया है।",
      citizenDraftEnglish: "Dear Citizen, PWD maintenance crew is on site replacing the broken drain grate and filling the pothole on Nagar Road."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 08:20 AM", detail: "Citizen submitted photo of crater and broken drain grate", status: "completed" },
      { stage: "On-Site Repair", time: "Oct 1, 10:30 AM", detail: "Grate frame anchored; pothole compaction underway", status: "in_progress" }
    ]
  },
  {
    id: "PN-2026-WAG-0120",
    title: "Dangerous Dangling Overhead Power Cables & Sparking Transformer at Wagholi Chowk",
    descriptionRaw: "Wagholi main chowk ke pole par 11kV transformer se chingaariyan nikal rahi hain aur LT wire bohot neeche latak rahi hai. Niche bazaar me dukan wale aur pedestrians dar rahe hain.",
    languageDetected: "Hinglish / Marathi (Confidence 98%)",
    category: "Electricity & Power Grid",
    department: "MSEDCL Wagholi Sub-Division",
    officerName: "Er. Nitin Chavan",
    officerDesignation: "MSEDCL Junior Engineer (Wagholi)",
    location: {
      ward: "Wagholi Ward 27 (Central Market)",
      area: "Wagholi Main Chowk, Near Bus Stop Post #4B",
      city: "Pune",
      pincode: "412207",
      lat: 18.5775,
      lng: 73.9780
    },
    urgency: "CRITICAL",
    urgencyScore: 98,
    status: "IN_PROGRESS",
    createdAt: "2026-10-01 07:00 AM",
    slaDeadline: "2026-10-01 01:00 PM",
    slaHoursLeft: 2,
    clusterId: "CL-WAG-POWER-05",
    clusterTitle: "Wagholi Chowk Dangling Power Cables & Sparking Hazard",
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
      dnaId: "DNA-WAG-412207-20",
      departmentConfidence: 99.8,
      urgencyScore: 98,
      sentimentScore: -0.94,
      sentimentLabel: "Immediate Electrocution & Fire Threat",
      healthRiskLevel: "CRITICAL",
      extractedEntities: [
        { label: "Asset Type", val: "11kV Distribution Transformer & Low Tension Overhead Lines" },
        { label: "Defect", val: "Sagging Uninsulated Lines (< 2.2m clearance), Arcing Spark Jumps" }
      ],
      ragMatches: [
        {
          caseId: "MSEDCL-CABLE-2025-003",
          summary: "Substation feeder trip, line re-tensioning and bundle cabling upgrade.",
          similarity: 0.99,
          resolutionTime: "2 hours"
        }
      ]
    },
    aiOfficerBrief: [
      "Severe electrocution hazard with low-hanging electrical cables over market walkway.",
      "Emergency lineman gang dispatched for power isolation and aerial bundle re-tensioning."
    ],
    recommendedResolution: {
      primaryAction: "Isolate Feeder & Re-tension Overhead Cables into Aerial Bundle Conductors (ABC)",
      standardOperatingProcedure: "MSEDCL-EMERGENCY-ELECTRICAL-SOP",
      estimatedFixTime: "2 Hours",
      equipmentRequired: ["Hydraulic Cherry Picker Lift", "Insulated Hot Stick (33kV)", "Aerial Bundle Cable Clamps"],
      citizenDraftHindi: "प्रिय नागरिक, वाघोली चौक पर लटकते बिजली के तारों और ट्रांसफार्मर की मरम्मत के लिए महावितरण की आपातकालीन टीम मौके पर पहुंच चुकी है।",
      citizenDraftEnglish: "Dear Citizen, MSEDCL emergency electrical line squad is on site isolating the feed, re-tensioning loose cables, and securing the transformer at Wagholi Chowk."
    },
    timeline: [
      { stage: "Submitted", time: "Oct 1, 07:00 AM", detail: "Citizen logged emergency complaint of sagging wires and sparks", status: "completed" },
      { stage: "Line Gang Dispatched", time: "Oct 1, 07:20 AM", detail: "Hydraulic lift bucket truck en route to Wagholi Chowk", status: "completed" },
      { stage: "Cable Re-tensioning Active", time: "Oct 1, 08:00 AM", detail: "Power temporarily isolated; cables being elevated", status: "in_progress" }
    ]
  }
];

export const MOCK_CLUSTERS = [
  {
    id: "CL-WAG-WATER-02",
    title: "Wagholi Baif Road & Kesnand Feeder Pipe Rupture Cluster",
    department: "PMC Water Supply Department",
    ward: "Wagholi Ward 27 (Baif Road Corridor)",
    complaintCount: 18,
    severity: "CRITICAL",
    rootCause: "150mm High-pressure cast-iron main joint rupture near Baif Road Market",
    impactRadius: "450 Households across Baif Road & Kesnand Corridor",
    status: "ACTIVE_INVESTIGATION",
    firstReported: "Oct 1, 2026",
    estimatedResolution: "Today, 04:00 PM"
  },
  {
    id: "CL-WAG-GARBAGE-01",
    title: "Wagholi Baif Road & Ivy Estate Commercial Waste Backlog",
    department: "PMC Solid Waste Management",
    ward: "Wagholi Ward 29 (Kesnand Corridor)",
    complaintCount: 16,
    severity: "HIGH",
    rootCause: "Dumper collection backlog leading to commercial plastic trash pile up on carriageway",
    impactRadius: "Market visitors & 80 retail shops",
    status: "IN_PROGRESS",
    firstReported: "Oct 1, 2026",
    estimatedResolution: "Today, 06:00 PM"
  },
  {
    id: "CL-WAG-DRAIN-04",
    title: "Ubale Nagar & Underpass Monsoon Inundation Cluster",
    department: "PMC Drainage Department",
    ward: "Wagholi Ward 30 (Ubale Nagar)",
    complaintCount: 19,
    severity: "CRITICAL",
    rootCause: "Blocked underground culvert combined with uncovered open storm manhole chamber",
    impactRadius: "Arterial Ubale Nagar Crossing",
    status: "CREW_DISPATCHED",
    firstReported: "Oct 1, 2026",
    estimatedResolution: "Today, 01:00 PM"
  },
  {
    id: "CL-WAG-ROADS-03",
    title: "Pune-Nagar Highway Arterial Pothole & Broken Grate Cluster",
    department: "Public Works Department (PWD Pune)",
    ward: "Wagholi Ward 28 (Nagar Road Corridor)",
    complaintCount: 15,
    severity: "CRITICAL",
    rootCause: "Heavy monsoon runoff subgrade subsidence and damaged iron storm drain grating",
    impactRadius: "Arterial Highway Junction & Lexicon School Entrance",
    status: "CREW_DISPATCHED",
    firstReported: "Oct 1, 2026",
    estimatedResolution: "Today, 06:00 PM"
  },
  {
    id: "CL-WAG-POWER-05",
    title: "Wagholi Chowk Dangling Power Cables & Sparking Hazard",
    department: "MSEDCL Wagholi Sub-Division",
    ward: "Wagholi Ward 27 (Central Market)",
    complaintCount: 16,
    severity: "CRITICAL",
    rootCause: "Low-tension distribution cable slackening and arcing transformer terminals over market street",
    impactRadius: "Commercial shopping market corridor & 1,200 pedestrians",
    status: "ACTIVE_INVESTIGATION",
    firstReported: "Oct 1, 2026",
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
    message: 'PMC Quick-Response Team is actively repairing the 200mm pipe burst near Ivy Estate Gate 2 (Ticket PN-2026-WAG-0102).',
    grievanceId: 'PN-2026-WAG-0102',
    link: '/citizen/PN-2026-WAG-0102',
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
    message: 'PMC 12MT compactor unit deployed to Baif Road Market Yard for ticket PN-2026-WAG-0101.',
    grievanceId: 'PN-2026-WAG-0101',
    link: '/citizen/PN-2026-WAG-0101',
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
    message: 'New grievance PN-2026-WAG-0103 (Domkhel Road Stormwater Drainage Blockage) assigned with 3h SLA.',
    grievanceId: 'PN-2026-WAG-0103',
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
    message: 'Ticket PN-2026-WAG-0104 (Raisoni College Chowk Transformer Sparking) approaching SLA deadline.',
    grievanceId: 'PN-2026-WAG-0104',
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
    message: 'Ticket PN-2026-WAG-0105 (Pune-Nagar Highway Deep Crater near Lexicon) prioritized for emergency compaction.',
    grievanceId: 'PN-2026-WAG-0105',
    link: '/admin',
    type: 'SYSTEMIC_HOTSPOT',
    read: false,
    createdAt: '2 hours ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

