/**
 * Jan Sahayak - Autonomous Surveillance & Evidence Pipeline Service
 * Handles authority escalation, evidence packaging, report generation, and incident lifecycle updates.
 */

import { INITIAL_SURVEILLANCE_INCIDENTS, SURVEILLANCE_STATUSES } from '../data/surveillanceData.js';

const STORAGE_KEY = 'jansahayk_surveillance_incidents';
const ESCALATIONS_KEY = 'jansahayk_surveillance_escalations';

/**
 * Retrieve current surveillance incidents from storage or fallback to initial dataset
 */
export function getSurveillanceIncidents() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.warn('[SurveillanceService] Failed to parse stored incidents:', err);
  }
  return INITIAL_SURVEILLANCE_INCIDENTS;
}

/**
 * Save incidents to storage
 */
export function saveSurveillanceIncidents(incidents) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    }
  } catch (err) {
    console.error('[SurveillanceService] Failed to save incidents:', err);
  }
}

/**
 * Escalate a surveillance incident to a selected civic/law enforcement authority
 * @param {string} incidentId
 * @param {string} selectedAuthority
 * @param {string} notes
 * @returns {Promise<{success: boolean, officialReference: string, status: string, incident: object}>}
 */
export async function escalateSurveillanceIncident(incidentId, selectedAuthority, notes = '') {
  // Simulate network dispatch with realistic latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const incidents = getSurveillanceIncidents();
  const digits = String(incidentId).replace(/\D/g, '').slice(-4) || '0042';
  const officialReference = `REF-2026-${digits}`;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let updatedIncident = null;
  const nextIncidents = incidents.map((item) => {
    if (item.id === incidentId) {
      const updatedAudit = [
        ...(item.auditLog || []),
        {
          time: timeStr,
          message: `Official Report dispatched to ${selectedAuthority} (Ref: ${officialReference})`
        }
      ];
      updatedIncident = {
        ...item,
        status: 'Forwarded',
        authorityRecipient: selectedAuthority,
        officialReference,
        humanVerificationNotes: notes,
        escalatedAt: now.toISOString(),
        auditLog: updatedAudit
      };
      return updatedIncident;
    }
    return item;
  });

  if (!updatedIncident) {
    // If not found in memory, fabricate the response object matching the id
    updatedIncident = {
      id: incidentId,
      status: 'Forwarded',
      authorityRecipient: selectedAuthority,
      officialReference,
      humanVerificationNotes: notes,
      escalatedAt: now.toISOString()
    };
  }

  saveSurveillanceIncidents(nextIncidents);

  // Also log escalation in audit store
  try {
    if (typeof localStorage !== 'undefined') {
      const rawEsc = localStorage.getItem(ESCALATIONS_KEY);
      const escalations = rawEsc ? JSON.parse(rawEsc) : [];
      escalations.unshift({
        id: `ESC-${Date.now()}`,
        incidentId,
        officialReference,
        authority: selectedAuthority,
        notes,
        timestamp: now.toISOString(),
        status: 'Forwarded to Authority'
      });
      localStorage.setItem(ESCALATIONS_KEY, JSON.stringify(escalations.slice(0, 50)));
    }
  } catch (e) {
    console.warn('[SurveillanceService] Escalations log error:', e);
  }

  return {
    success: true,
    officialReference,
    selectedAuthority,
    status: 'Forwarded to Authority',
    timestamp: timeStr,
    incident: updatedIncident
  };
}

/**
 * Generate official municipal report payload for an incident
 */
export function generateOfficialMunicipalReport(incident) {
  const digits = String(incident?.id || 'INC-2026-PUNE-0042').replace(/\D/g, '').slice(-4) || '0042';
  return {
    reportNumber: `PMC-SURV-2026-${digits}`,
    generatedAt: new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    issuingAuthority: 'Pune Municipal Corporation — Smart Surveillance & Rapid Response Cell',
    wardJurisdiction: incident?.location || 'Wagholi Restricted Zone',
    incidentId: incident?.id || 'INC-2026-PUNE-0042',
    violationType: incident?.violation || 'Restricted Area Entry (Unauthorized Heavy Vehicle)',
    cameraFeed: incident?.camera || 'CAM-WAG-04',
    detectedVehicle: incident?.vehicleDetails || 'Heavy Dumper Truck (MH-12-Q-4029)',
    confidenceScore: `${incident?.aiConfidence || 94}%`,
    evidenceMediaCount: incident?.evidenceFiles?.length || 2,
    legalNoticeClause: 'Under Section 115/177 of The Motor Vehicles Act & PMC Ward Transport Regulations 2024.',
    disclaimer: 'Potential restricted-area entry detected by AI surveillance. Awaiting official human verification.'
  };
}

/**
 * Update incident status workflow
 */
export function updateIncidentStatus(incidentId, newStatus, reason = '') {
  const incidents = getSurveillanceIncidents();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const nextIncidents = incidents.map((item) => {
    if (item.id === incidentId) {
      return {
        ...item,
        status: newStatus,
        auditLog: [
          ...(item.auditLog || []),
          { time: timeStr, message: `Status updated to ${newStatus}${reason ? `: ${reason}` : ''}` }
        ]
      };
    }
    return item;
  });

  saveSurveillanceIncidents(nextIncidents);
  return nextIncidents.find((i) => i.id === incidentId);
}
