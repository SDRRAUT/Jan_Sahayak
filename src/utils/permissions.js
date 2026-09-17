/**
 * JanSahayk (जनसहायक) — Unified Role & Permission Governance Model
 * 
 * Supports exactly 3 primary roles:
 * 1. CITIZEN ('citizen')
 * 2. CIVIC_OFFICER ('civic_officer') — Unified Field Officer + Department Admin
 * 3. SUPER_ADMIN ('super_admin')
 * 
 * Backward compatibility:
 * - 'officer' and 'dept_admin' automatically inherit all CIVIC_OFFICER permissions.
 */

export const ROLES = {
  CITIZEN: 'citizen',
  CIVIC_OFFICER: 'civic_officer',
  SUPER_ADMIN: 'super_admin',
  // Legacy aliases for backward compatibility
  FIELD_OFFICER: 'officer',
  DEPARTMENT_ADMIN: 'dept_admin'
};

export const PERMISSIONS = {
  // Field Investigation & Incident Permissions
  VIEW_ASSIGNED_CASES: 'view_assigned_cases',
  VIEW_DEPARTMENT_CASES: 'view_department_cases',
  UPDATE_CASE: 'update_case',
  UPLOAD_EVIDENCE: 'upload_evidence',
  SUBMIT_VERIFICATION: 'submit_verification',
  REQUEST_VERIFICATION: 'request_verification',
  ADD_INSPECTION_NOTES: 'add_inspection_notes',

  // Incident Cluster & Linkage Permissions
  MERGE_INCIDENTS: 'merge_incidents',
  SPLIT_INCIDENTS: 'split_incidents',

  // Department Operations & Workload Permissions
  ASSIGN_CASE: 'assign_case',
  REASSIGN_CASE: 'reassign_case',
  MANAGE_OFFICER_WORKLOAD: 'manage_officer_workload',
  VIEW_OFFICER_ROSTER: 'view_officer_roster',
  VIEW_SLA: 'view_sla',
  MANAGE_ESCALATION: 'manage_escalation',

  // Action Approval Permissions
  APPROVE_ACTION: 'approve_action',
  MODIFY_ACTION: 'modify_action',
  REJECT_ACTION: 'reject_action',

  // AI & Intelligence Permissions
  VIEW_AI_ANALYSIS: 'view_ai_analysis',
  VIEW_ROOT_CAUSE: 'view_root_cause',
  VIEW_CIVIC_MEMORY: 'view_civic_memory',
  VIEW_GEO_INTELLIGENCE: 'view_geo_intelligence',
  SIMULATE_ACTIONS: 'simulate_actions',

  // Reporting & Analytics Permissions
  EXPORT_REPORTS: 'export_reports',
  VIEW_DEPARTMENT_ANALYTICS: 'view_department_analytics',
  VIEW_CITIZEN_FEEDBACK: 'view_citizen_feedback',

  // Citizen Specific Permissions
  SUBMIT_GRIEVANCE: 'submit_grievance',
  VIEW_OWN_GRIEVANCES: 'view_own_grievances',
  RATE_RESOLUTION: 'rate_resolution',
  REOPEN_DISPUTE: 'reopen_dispute',
  RESPOND_CLARIFICATION: 'respond_clarification',

  // Super Admin Governance Permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_SLA_RULES: 'manage_sla_rules',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  CONFIGURE_AI_WEIGHTS: 'configure_ai_weights'
};

// Permission assignments per role
export const ROLE_PERMISSIONS = {
  [ROLES.CITIZEN]: [
    PERMISSIONS.SUBMIT_GRIEVANCE,
    PERMISSIONS.VIEW_OWN_GRIEVANCES,
    PERMISSIONS.RATE_RESOLUTION,
    PERMISSIONS.REOPEN_DISPUTE,
    PERMISSIONS.RESPOND_CLARIFICATION
  ],

  [ROLES.CIVIC_OFFICER]: [
    // Field Investigation
    PERMISSIONS.VIEW_ASSIGNED_CASES,
    PERMISSIONS.VIEW_DEPARTMENT_CASES,
    PERMISSIONS.UPDATE_CASE,
    PERMISSIONS.UPLOAD_EVIDENCE,
    PERMISSIONS.SUBMIT_VERIFICATION,
    PERMISSIONS.REQUEST_VERIFICATION,
    PERMISSIONS.ADD_INSPECTION_NOTES,

    // Cluster & Duplicate Management
    PERMISSIONS.MERGE_INCIDENTS,
    PERMISSIONS.SPLIT_INCIDENTS,

    // Department Operations
    PERMISSIONS.ASSIGN_CASE,
    PERMISSIONS.REASSIGN_CASE,
    PERMISSIONS.MANAGE_OFFICER_WORKLOAD,
    PERMISSIONS.VIEW_OFFICER_ROSTER,
    PERMISSIONS.VIEW_SLA,
    PERMISSIONS.MANAGE_ESCALATION,

    // Approvals
    PERMISSIONS.APPROVE_ACTION,
    PERMISSIONS.MODIFY_ACTION,
    PERMISSIONS.REJECT_ACTION,

    // AI Intelligence Suite
    PERMISSIONS.VIEW_AI_ANALYSIS,
    PERMISSIONS.VIEW_ROOT_CAUSE,
    PERMISSIONS.VIEW_CIVIC_MEMORY,
    PERMISSIONS.VIEW_GEO_INTELLIGENCE,
    PERMISSIONS.SIMULATE_ACTIONS,

    // Reports & Analytics
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_DEPARTMENT_ANALYTICS,
    PERMISSIONS.VIEW_CITIZEN_FEEDBACK
  ],

  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS)
};

// Aliases inherit all Civic Officer permissions
ROLE_PERMISSIONS[ROLES.FIELD_OFFICER] = ROLE_PERMISSIONS[ROLES.CIVIC_OFFICER];
ROLE_PERMISSIONS[ROLES.DEPARTMENT_ADMIN] = ROLE_PERMISSIONS[ROLES.CIVIC_OFFICER];

/**
 * Check if a user possesses a specific permission.
 */
export function hasPermission(user, permissionKey) {
  if (!user || !user.role) return false;
  const userRole = user.role.toLowerCase();
  
  // Normalize legacy roles
  const effectiveRole = 
    (userRole === 'officer' || userRole === 'dept_admin') ? ROLES.CIVIC_OFFICER : userRole;

  const permissions = ROLE_PERMISSIONS[effectiveRole] || [];
  return permissions.includes(permissionKey);
}

/**
 * Returns human-readable label for a role.
 */
export function getRoleLabel(role) {
  switch (role?.toLowerCase()) {
    case 'citizen':
      return 'Citizen';
    case 'civic_officer':
    case 'officer':
    case 'dept_admin':
      return 'Government Officer';
    case 'super_admin':
      return 'Administrator / Admin';
    default:
      return 'Guest';
  }
}
