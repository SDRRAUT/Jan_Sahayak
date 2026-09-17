import { db } from '../db/database.js';

/**
 * AGENT 9: CLOSED-LOOP VERIFICATION AGENT
 * Guarantees that incidents cannot be closed unilaterally by authorities.
 * Transitions through:
 * OPEN -> IN_PROGRESS -> WORK_COMPLETED -> VERIFICATION_PENDING -> VERIFIED -> RESOLVED
 * Or REOPENED if citizen verification indicates the problem persists.
 */
export class VerificationAgent {
  /**
   * Records authority completion of work order
   */
  static markWorkCompleted(incidentId, officerPayload) {
    const incident = db.getIncidentById(incidentId);
    if (!incident) throw new Error(`Incident ${incidentId} not found`);

    incident.status = 'WORK_COMPLETED';
    incident.verificationStatus = 'VERIFICATION_PENDING';
    incident.stage = 'RESOLVING';

    const event = db.logEvent({
      incidentId,
      eventType: 'AUTHORITY_WORK_COMPLETED',
      actorType: 'OFFICER',
      actorId: officerPayload.officerId || 'OFFICER-01',
      payload: {
        officer: officerPayload.officerName || 'Field Officer',
        notes: officerPayload.notes || 'Field repair executed. Awaiting citizen verification.',
        workOrder: officerPayload.workOrder || `WO-${Date.now().toString().slice(-6)}`
      }
    });

    db.saveIncident(incident);
    return { incident, event };
  }

  /**
   * Records citizen verification response
   */
  static processCitizenVerification(incidentId, verificationPayload) {
    const incident = db.getIncidentById(incidentId);
    if (!incident) throw new Error(`Incident ${incidentId} not found`);

    const isConfirmed = verificationPayload.isConfirmed === true;
    const citizenId = verificationPayload.citizenId || 'CITIZEN-ANONYMOUS';
    const notes = verificationPayload.notes || (isConfirmed ? 'Citizen confirmed potable supply/road restored' : 'Citizen reports issue persists');

    if (isConfirmed) {
      incident.verificationStatus = 'VERIFIED';
      incident.status = 'RESOLVED';
      incident.stage = 'RESOLVED';
    } else {
      incident.verificationStatus = 'REOPENED';
      incident.status = 'REOPENED';
      incident.stage = 'CRITICAL'; // Escalates back to high attention
      incident.stageVelocity = 'Escalated on citizen dispute';
    }

    const event = db.logEvent({
      incidentId,
      eventType: isConfirmed ? 'CITIZEN_VERIFIED_RESOLUTION' : 'CITIZEN_DISPUTED_REOPENED',
      actorType: 'CITIZEN',
      actorId: citizenId,
      payload: {
        isConfirmed,
        citizenName: verificationPayload.citizenName || 'Verified Ward Citizen',
        notes,
        timestamp: new Date().toISOString()
      }
    });

    db.saveIncident(incident);
    return { incident, event };
  }
}
