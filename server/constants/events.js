/**
 * JAN_SAHAYAK — CANONICAL REAL-TIME EVENT MODEL
 * Authoritative set of all system event types propagated across roles.
 */

export const CANONICAL_EVENTS = {
  // Complaint Ingestion & AI Pipeline
  COMPLAINT_CREATED: 'complaint_created',
  COMPLAINT_UPDATED: 'complaint_updated',
  COMPLAINT_ANALYZED: 'complaint_analyzed',
  DNA_GENERATED: 'dna_generated',
  EMBEDDING_GENERATED: 'embedding_generated',
  SIMILAR_COMPLAINTS_FOUND: 'similar_complaints_found',
  
  // Incident Syntheses & Routing
  INCIDENT_CREATED: 'incident_created',
  INCIDENT_UPDATED: 'incident_updated',
  INCIDENT_ESCALATED: 'incident_escalated',
  ROOT_CAUSE_READY: 'root_cause_ready',
  RECOMMENDATION_READY: 'recommendation_ready',
  AUTHORITY_ASSIGNED: 'authority_assigned',
  OFFICER_ASSIGNED: 'officer_assigned',
  
  // Field Operations
  INVESTIGATION_STARTED: 'investigation_started',
  FIELD_ACTION_STARTED: 'field_action_started',
  FIELD_ACTION_UPDATED: 'field_action_updated',
  FIELD_ACTION_COMPLETED: 'field_action_completed',
  EVIDENCE_UPLOADED: 'evidence_uploaded',
  
  // Verification & Resolution
  VERIFICATION_REQUESTED: 'verification_requested',
  VERIFICATION_SUBMITTED: 'verification_submitted',
  INCIDENT_RESOLVED: 'incident_resolved',
  INCIDENT_REOPENED: 'incident_reopened',
  
  // Cross-Role Notifications
  NOTIFICATION_CREATED: 'notification_created'
};

export const ALL_CANONICAL_EVENTS = Object.values(CANONICAL_EVENTS);
