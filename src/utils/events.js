/**
 * JAN_SAHAYAK — CANONICAL REAL-TIME EVENT MODEL (FRONTEND)
 * Single source of truth for all real-time events on client.
 */

export const CANONICAL_EVENTS = {
  COMPLAINT_CREATED: 'complaint_created',
  COMPLAINT_UPDATED: 'complaint_updated',
  COMPLAINT_ANALYZED: 'complaint_analyzed',
  DNA_GENERATED: 'dna_generated',
  EMBEDDING_GENERATED: 'embedding_generated',
  SIMILAR_COMPLAINTS_FOUND: 'similar_complaints_found',
  
  INCIDENT_CREATED: 'incident_created',
  INCIDENT_UPDATED: 'incident_updated',
  INCIDENT_ESCALATED: 'incident_escalated',
  ROOT_CAUSE_READY: 'root_cause_ready',
  RECOMMENDATION_READY: 'recommendation_ready',
  AUTHORITY_ASSIGNED: 'authority_assigned',
  OFFICER_ASSIGNED: 'officer_assigned',
  
  INVESTIGATION_STARTED: 'investigation_started',
  FIELD_ACTION_STARTED: 'field_action_started',
  FIELD_ACTION_UPDATED: 'field_action_updated',
  FIELD_ACTION_COMPLETED: 'field_action_completed',
  EVIDENCE_UPLOADED: 'evidence_uploaded',
  
  VERIFICATION_REQUESTED: 'verification_requested',
  VERIFICATION_SUBMITTED: 'verification_submitted',
  INCIDENT_RESOLVED: 'incident_resolved',
  INCIDENT_REOPENED: 'incident_reopened',
  
  NOTIFICATION_CREATED: 'notification_created'
};
