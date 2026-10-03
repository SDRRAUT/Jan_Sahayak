/**
 * Jan Sahayak - Autonomous Two-Agent Surveillance & Evidence Pipeline Data Model
 * Primary Hotspot: Wagholi Main Road Restricted Corridor (Ward 29, Pune)
 */

export const SURVEILLANCE_STATUSES = [
  'Detected',
  'Evidence Captured',
  'Report Generated',
  'Forwarded',
  'Under Human Review',
  'Action Taken',
  'Resolved'
];

export const SURVEILLANCE_AUTHORITIES = [
  { id: 'AUTH-TRAFFIC', name: 'Police Station (Wagholi Traffic & Law Enforcement)', department: 'Pune Traffic Police', phone: '020-27051100' },
  { id: 'AUTH-PMC-ENC', name: 'PMC Encroachment & Heavy Transport Control', department: 'Pune Municipal Corporation', phone: '020-25501000' },
  { id: 'AUTH-WARD-29', name: 'Ward 29 Flying Squad & Civic Enforcement Unit', department: 'Wagholi Ward Office', phone: '020-27052200' }
];

export const SURVEILLANCE_HOTSPOTS = [
  {
    id: 'HOTSPOT-WAG-01',
    name: 'Wagholi Main Road Restricted Zone',
    ward: 'Wagholi Ward 29 (Kesnand & Main Road Corridor)',
    category: 'Restricted-area entry / illegal heavy vehicle movement',
    citizenComplaintsCount: 12,
    similarIncidentsCount: 7,
    patternDetected: 'HIGH',
    monitoringStatus: 'ACTIVE',
    activeCamerasCount: 3,
    cameras: [
      {
        id: 'CAM-WAG-04',
        name: 'Arterial Road North Lane (Entry Geofence)',
        status: 'ONLINE',
        location: 'Wagholi Corridor North Entry Point',
        streamUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        fov: '110° Wide Angle 4K'
      },
      {
        id: 'CAM-WAG-02',
        name: 'Ivy Estate Main Junction West',
        status: 'ONLINE',
        location: 'Kesnand Road & Ivy Estate Junction',
        streamUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
        fov: '90° PTZ HD'
      },
      {
        id: 'CAM-WAG-07',
        name: 'Lexicon School Perimeter',
        status: 'ONLINE',
        location: 'School Zone Buffer West',
        streamUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        fov: '90° Optical Zoom'
      }
    ],
    ruleConfig: {
      ruleId: 'RULE-WAG-RESTRICTED-09',
      description: 'No commercial heavy vehicles (dumpers/trucks >3.5T) allowed between 08:00 - 20:00 without municipal permit',
      zonePolygon: 'Wagholi Corridor Sector B',
      confidenceThreshold: 85,
      vehicleCategoriesRestricted: ['Dumper Truck', 'Heavy Multi-Axle', 'Ready-Mix Concrete Transit'],
      operatingHours: '08:00 - 20:00 IST'
    }
  }
];

export const INITIAL_SURVEILLANCE_INCIDENTS = [
  {
    id: 'INC-2026-PUNE-0042',
    hotspotId: 'HOTSPOT-WAG-01',
    violation: 'Restricted Area Entry (Unauthorized Heavy Vehicle)',
    location: 'Wagholi Restricted Zone (CAM-WAG-04)',
    timestamp: 'Today, 14:32',
    camera: 'CAM-WAG-04',
    vehicleDetails: 'Heavy Dumper Truck (MH-12-Q-4029)',
    aiConfidence: 94,
    status: 'Detected', // Detected | Evidence Captured | Report Generated | Forwarded | Under Human Review | Action Taken | Resolved
    evidenceFiles: [
      {
        id: 'EV-01',
        type: 'CCTV_FULL_FRAME',
        label: 'Wide Angle Corridor Breach',
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
        timestamp: '14:31:08',
        capturedBy: 'Evidence Agent (Dual-Frame Module)'
      },
      {
        id: 'EV-02',
        type: 'VEHICLE_CROP',
        label: 'License & Vehicle Frontal Crop',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        timestamp: '14:31:10',
        capturedBy: 'Evidence Agent (OCR & Crop Pipeline)'
      }
    ],
    auditLog: [
      { time: '14:31:08', message: 'Vehicle entered restricted geofence polygon' },
      { time: '14:31:10', message: 'Surveillance Agent identified 94% rule violation match' },
      { time: '14:31:11', message: 'Evidence Agent captured dual-frame snapshot package' },
      { time: '14:31:12', message: 'Incident Ticket INC-2026-PUNE-0042 automatically generated' }
    ],
    authorityRecipient: null,
    officialReference: null,
    humanVerificationNotes: ''
  },
  {
    id: 'INC-2026-PUNE-0041',
    hotspotId: 'HOTSPOT-WAG-01',
    violation: 'Restricted Area Entry (Commercial Transport)',
    location: 'Wagholi Restricted Zone (CAM-WAG-02)',
    timestamp: 'Today, 11:15',
    camera: 'CAM-WAG-02',
    vehicleDetails: 'Medium Carrier (MH-14-BT-8821)',
    aiConfidence: 91,
    status: 'Under Human Review',
    authorityRecipient: 'Police Station (Wagholi Traffic & Law Enforcement)',
    officialReference: 'REF-2026-0041',
    evidenceFiles: [
      {
        id: 'EV-03',
        type: 'CCTV_FULL_FRAME',
        label: 'Junction Entry Frame',
        url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
        timestamp: '11:14:02',
        capturedBy: 'Evidence Agent (Dual-Frame Module)'
      }
    ],
    auditLog: [
      { time: '11:14:02', message: 'Vehicle entered restricted geofence polygon' },
      { time: '11:14:05', message: 'Surveillance Agent identified 91% rule violation match' },
      { time: '11:14:06', message: 'Evidence Agent captured frame snapshot package' },
      { time: '11:14:07', message: 'Incident Ticket INC-2026-PUNE-0041 generated and escalated' }
    ],
    humanVerificationNotes: 'Assigned to duty officer for license verification.'
  },
  {
    id: 'INC-2026-PUNE-0045',
    hotspotId: 'HOTSPOT-WAG-01',
    violation: 'Chemical Drum Waste Dumping on Public Street',
    location: 'Wagholi Commercial Market & Auto Stand (Ward 29)',
    timestamp: 'Today, 14:15',
    camera: 'CAM-WAG-04 (Arterial Main)',
    vehicleDetails: 'Commercial Transit & Auto-Rickshaw',
    offenderDetails: 'Male in yellow shirt unloading and dumping industrial sludge from blue barrel',
    aiConfidence: 98,
    status: 'Evidence Captured',
    authorityRecipient: null,
    officialReference: null,
    evidenceFiles: [
      {
        id: 'EV-04',
        type: 'OFFENDER_ACTION_FRAME',
        label: 'Blue Drum Sludge Waste Dump beside Auto',
        url: '/surveillance/violation_drum_dumping.jpg',
        timestamp: '14:14:22',
        capturedBy: 'CCTV-WAG-04 High-Definition PTZ Camera'
      }
    ],
    auditLog: [
      { time: '14:13:50', message: 'Unauthorized chemical transport parked in transit corridor' },
      { time: '14:14:12', message: 'Surveillance AI flagged hazardous chemical drum unloading' },
      { time: '14:14:22', message: 'Photographic evidence captured showing offender emptying blue drum' },
      { time: '14:14:30', message: 'Incident Ticket INC-2026-PUNE-0045 compiled by Evidence Agent' }
    ],
    humanVerificationNotes: 'Forwarded for urgent pollution control inspection.'
  },
  {
    id: 'INC-2026-PUNE-0044',
    hotspotId: 'HOTSPOT-WAG-01',
    violation: 'Unauthorized Dumping of Commercial Garbage on Public Roadway',
    location: 'Baif Road Commercial Market & Highway Corridor (Ward 29)',
    timestamp: 'Today, 09:20',
    camera: 'CAM-WAG-02 (Junction)',
    vehicleDetails: 'Commercial Waste Handcart & Auto-Rickshaw',
    offenderDetails: 'Individual dumping red plastic waste bucket directly onto pedestrian corridor',
    aiConfidence: 97,
    status: 'Detected',
    authorityRecipient: null,
    officialReference: null,
    evidenceFiles: [
      {
        id: 'EV-05',
        type: 'OFFENDER_ACTION_FRAME',
        label: 'Individual Dumping Red Bucket Garbage onto Public Road',
        url: '/surveillance/violation_bucket_dumping.jpg',
        timestamp: '09:19:15',
        capturedBy: 'CCTV-WAG-02 Market Perimeter Camera'
      }
    ],
    auditLog: [
      { time: '09:18:50', message: 'Commercial garbage accumulation threshold exceeded' },
      { time: '09:19:15', message: 'Individual detected discarding red bucket contents into public corridor' },
      { time: '09:19:20', message: 'Incident Ticket INC-2026-PUNE-0044 compiled by Evidence Agent' }
    ],
    humanVerificationNotes: 'Ready for dispatch to Ward 29 Sanitary Inspector.'
  },
  {
    id: 'INC-2026-PUNE-0046',
    hotspotId: 'HOTSPOT-WAG-01',
    violation: 'Open Littering of Disposable Plastic Plates on Road Shoulder',
    location: 'Wagholi Main Arterial Road (Near Laxmi Chowk)',
    timestamp: 'Today, 12:40',
    camera: 'CAM-WAG-07 (Perimeter)',
    vehicleDetails: 'White Honda Activa (MH-12-P-3318)',
    offenderDetails: 'Scooter riders and food vendors discarding bulk single-use plastic plates',
    aiConfidence: 95,
    status: 'Evidence Captured',
    authorityRecipient: null,
    officialReference: null,
    evidenceFiles: [
      {
        id: 'EV-06',
        type: 'OFFENDER_ACTION_FRAME',
        label: 'Scooter Transit beside Disposable Plastic Plate Roadside Heap',
        url: '/surveillance/violation_scooter_litter.jpg',
        timestamp: '12:39:40',
        capturedBy: 'CCTV-WAG-07 Perimeter AI Optical Camera'
      }
    ],
    auditLog: [
      { time: '12:38:10', message: 'Plastic plate pile accumulation detected on road shoulder' },
      { time: '12:39:40', message: 'AI classified non-biodegradable food service waste violation' },
      { time: '12:39:50', message: 'Incident Ticket INC-2026-PUNE-0046 generated' }
    ],
    humanVerificationNotes: 'Awaiting sanitary squad notification.'
  },
  {
    id: 'INC-2026-PUNE-0047',
    hotspotId: 'HOTSPOT-WAG-01',
    violation: 'Chronic Roadside Garbage Heap Obstructing Highway Lane',
    location: 'Wagholi Commercial Market Entry (Ward 29)',
    timestamp: 'Today, 11:30',
    camera: 'CAM-WAG-02 (Junction)',
    vehicleDetails: 'Multiple Commercial Carriers & Auto Transit',
    offenderDetails: 'Persistent roadside illegal waste accumulation & commercial garbage dumping',
    aiConfidence: 94,
    status: 'Detected',
    authorityRecipient: null,
    officialReference: null,
    evidenceFiles: [
      {
        id: 'EV-07',
        type: 'OFFENDER_ACTION_FRAME',
        label: 'Market Roadway Obstructed by Severe Garbage Heap',
        url: '/surveillance/violation_market_road_dump.jpg',
        timestamp: '11:29:10',
        capturedBy: 'CCTV-WAG-02 Junction Traffic Camera'
      }
    ],
    auditLog: [
      { time: '11:25:00', message: 'Roadway lane obstruction flagged by geometric flow detector' },
      { time: '11:29:10', message: 'Photographic evidence captured showing major public nuisance' },
      { time: '11:29:25', message: 'Incident Ticket INC-2026-PUNE-0047 registered' }
    ],
    humanVerificationNotes: 'Notice issued for immediate municipal clean-up and squad patrol.'
  }
];
