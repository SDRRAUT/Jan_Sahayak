/**
 * JAN_SAHAYAK — CANONICAL STATUS SYSTEM
 * Authoritative single source of truth for all grievance & incident states.
 */

export const CANONICAL_STATUSES = {
  REPORTED: 'REPORTED',
  ANALYZING: 'ANALYZING',
  CONNECTED: 'CONNECTED',
  INCIDENT_CREATED: 'INCIDENT_CREATED',
  AUTHORITY_ASSIGNED: 'AUTHORITY_ASSIGNED',
  INVESTIGATION: 'INVESTIGATION',
  ACTION_IN_PROGRESS: 'ACTION_IN_PROGRESS',
  ACTION_COMPLETED: 'ACTION_COMPLETED',
  VERIFICATION_PENDING: 'VERIFICATION_PENDING',
  RESOLVED: 'RESOLVED',
  REOPENED: 'REOPENED'
};

export const STATUS_ORDER = [
  CANONICAL_STATUSES.REPORTED,
  CANONICAL_STATUSES.ANALYZING,
  CANONICAL_STATUSES.CONNECTED,
  CANONICAL_STATUSES.INCIDENT_CREATED,
  CANONICAL_STATUSES.AUTHORITY_ASSIGNED,
  CANONICAL_STATUSES.INVESTIGATION,
  CANONICAL_STATUSES.ACTION_IN_PROGRESS,
  CANONICAL_STATUSES.ACTION_COMPLETED,
  CANONICAL_STATUSES.VERIFICATION_PENDING,
  CANONICAL_STATUSES.RESOLVED
];

// Valid state transitions graph
export const ALLOWED_STATUS_TRANSITIONS = {
  [CANONICAL_STATUSES.REPORTED]: [
    CANONICAL_STATUSES.ANALYZING,
    CANONICAL_STATUSES.AUTHORITY_ASSIGNED,
    CANONICAL_STATUSES.INVESTIGATION
  ],
  [CANONICAL_STATUSES.ANALYZING]: [
    CANONICAL_STATUSES.CONNECTED,
    CANONICAL_STATUSES.INCIDENT_CREATED,
    CANONICAL_STATUSES.AUTHORITY_ASSIGNED
  ],
  [CANONICAL_STATUSES.CONNECTED]: [
    CANONICAL_STATUSES.INCIDENT_CREATED,
    CANONICAL_STATUSES.AUTHORITY_ASSIGNED
  ],
  [CANONICAL_STATUSES.INCIDENT_CREATED]: [
    CANONICAL_STATUSES.AUTHORITY_ASSIGNED,
    CANONICAL_STATUSES.INVESTIGATION
  ],
  [CANONICAL_STATUSES.AUTHORITY_ASSIGNED]: [
    CANONICAL_STATUSES.INVESTIGATION,
    CANONICAL_STATUSES.ACTION_IN_PROGRESS
  ],
  [CANONICAL_STATUSES.INVESTIGATION]: [
    CANONICAL_STATUSES.ACTION_IN_PROGRESS,
    CANONICAL_STATUSES.ACTION_COMPLETED,
    CANONICAL_STATUSES.AUTHORITY_ASSIGNED
  ],
  [CANONICAL_STATUSES.ACTION_IN_PROGRESS]: [
    CANONICAL_STATUSES.ACTION_COMPLETED,
    CANONICAL_STATUSES.INVESTIGATION
  ],
  [CANONICAL_STATUSES.ACTION_COMPLETED]: [
    CANONICAL_STATUSES.VERIFICATION_PENDING,
    CANONICAL_STATUSES.RESOLVED,
    CANONICAL_STATUSES.REOPENED
  ],
  [CANONICAL_STATUSES.VERIFICATION_PENDING]: [
    CANONICAL_STATUSES.RESOLVED,
    CANONICAL_STATUSES.REOPENED
  ],
  [CANONICAL_STATUSES.RESOLVED]: [
    CANONICAL_STATUSES.REOPENED
  ],
  [CANONICAL_STATUSES.REOPENED]: [
    CANONICAL_STATUSES.INVESTIGATION,
    CANONICAL_STATUSES.ACTION_IN_PROGRESS,
    CANONICAL_STATUSES.AUTHORITY_ASSIGNED
  ]
};

// Role-specific display representations
export const ROLE_STATUS_MAPPINGS = {
  [CANONICAL_STATUSES.REPORTED]: {
    citizen: 'Report Received',
    officer: 'New Intake',
    super_admin: 'Logged — Pending Triage'
  },
  [CANONICAL_STATUSES.ANALYZING]: {
    citizen: 'AI Analyzing Problem',
    officer: 'AI Triage in Progress',
    super_admin: 'Pipeline: Analyzing'
  },
  [CANONICAL_STATUSES.CONNECTED]: {
    citizen: 'Connected with Ward Reports',
    officer: 'Signal Clustered',
    super_admin: 'Cluster Formed'
  },
  [CANONICAL_STATUSES.INCIDENT_CREATED]: {
    citizen: 'Civic Incident Formed',
    officer: 'Civic Incident Active',
    super_admin: 'Active Civic Incident'
  },
  [CANONICAL_STATUSES.AUTHORITY_ASSIGNED]: {
    citizen: 'Assigned to Department Team',
    officer: 'Assigned to Division',
    super_admin: 'Authority Assigned'
  },
  [CANONICAL_STATUSES.INVESTIGATION]: {
    citizen: 'Field Inspection Started',
    officer: 'Field Investigation Active',
    super_admin: 'Under Investigation'
  },
  [CANONICAL_STATUSES.ACTION_IN_PROGRESS]: {
    citizen: 'Work in Progress on Site',
    officer: 'Field Action — In Progress',
    super_admin: 'Remediation In Progress'
  },
  [CANONICAL_STATUSES.ACTION_COMPLETED]: {
    citizen: 'Action Completed — Ready to Verify',
    officer: 'Work Completed — Evidence Uploaded',
    super_admin: 'Action Completed'
  },
  [CANONICAL_STATUSES.VERIFICATION_PENDING]: {
    citizen: 'Awaiting Your Confirmation',
    officer: 'Awaiting Citizen Verification',
    super_admin: 'Verification Pending'
  },
  [CANONICAL_STATUSES.RESOLVED]: {
    citizen: 'Resolved & Verified',
    officer: 'Case Closed & Confirmed',
    super_admin: 'Resolved (Civic Memory Logged)'
  },
  [CANONICAL_STATUSES.REOPENED]: {
    citizen: 'Dispute Reopened by You',
    officer: 'Dispute Reopened — Review Required',
    super_admin: 'Escalated Dispute Reopened'
  }
};

/**
 * Normalizes legacy or informal status strings into Canonical Status
 */
export function normalizeStatus(rawStatus) {
  if (!rawStatus) return CANONICAL_STATUSES.REPORTED;
  const s = String(rawStatus).toUpperCase().trim();

  switch (s) {
    case 'SUBMITTED':
    case 'INGESTED':
    case 'NEW':
    case 'REPORTED':
      return CANONICAL_STATUSES.REPORTED;
    case 'ANALYZED':
    case 'DNA_GENERATED':
    case 'AI_ANALYSED':
    case 'ANALYZING':
      return CANONICAL_STATUSES.ANALYZING;
    case 'CLUSTERED':
    case 'CONNECTED':
      return CANONICAL_STATUSES.CONNECTED;
    case 'INCIDENT_CREATED':
      return CANONICAL_STATUSES.INCIDENT_CREATED;
    case 'ASSIGNED':
    case 'AUTHORITY_ASSIGNED':
      return CANONICAL_STATUSES.AUTHORITY_ASSIGNED;
    case 'INVESTIGATING':
    case 'INVESTIGATION':
    case 'UNDER_REVIEW':
    case 'UNDER_INVESTIGATION':
      return CANONICAL_STATUSES.INVESTIGATION;
    case 'IN_PROGRESS':
    case 'ACTION_IN_PROGRESS':
    case 'DISPATCHED':
      return CANONICAL_STATUSES.ACTION_IN_PROGRESS;
    case 'ACTION_COMPLETED':
      return CANONICAL_STATUSES.ACTION_COMPLETED;
    case 'VERIFICATION_PENDING':
    case 'AWAITING_VERIFICATION':
      return CANONICAL_STATUSES.VERIFICATION_PENDING;
    case 'RESOLVED':
    case 'RESOLVED_CONFIRMED':
    case 'CLOSED':
      return CANONICAL_STATUSES.RESOLVED;
    case 'DISPUTE_REOPENED':
    case 'REOPENED':
    case 'ESCALATED':
      return CANONICAL_STATUSES.REOPENED;
    default:
      return CANONICAL_STATUSES.REPORTED;
  }
}

/**
 * Validates whether a status transition is permitted
 */
export function isValidTransition(fromStatus, toStatus) {
  const normFrom = normalizeStatus(fromStatus);
  const normTo = normalizeStatus(toStatus);
  if (normFrom === normTo) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[normFrom] || [];
  return allowed.includes(normTo);
}

/**
 * Returns role-appropriate status text
 */
export function getRoleStatusLabel(status, role = 'citizen') {
  const norm = normalizeStatus(status);
  const mapping = ROLE_STATUS_MAPPINGS[norm];
  if (!mapping) return norm;
  const r = (role || 'citizen').toLowerCase();
  if (r === 'super_admin') return mapping.super_admin;
  if (r === 'officer' || r === 'civic_officer' || r === 'dept_admin') return mapping.officer;
  return mapping.citizen;
}
