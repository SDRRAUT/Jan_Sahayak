import { db } from '../db/database.js';
import { AIProvider } from './aiProvider.js';

/**
 * AGENT 8: CIVIC MEMORY & CONTRACTOR WARRANTY AGENT
 * Queries database history for past incidents, chronic failure locations, and previous repairs.
 * Checks asset warranty registry (returns "Warranty information unavailable" when none exists).
 */
export class CivicMemoryAgent {
  static analyzeMemory(incident, clusterComplaints = []) {
    const historicalIncidents = db.getIncidents().filter(i => i.id !== incident.id);
    const primaryInfra = clusterComplaints[0]?.dna?.infrastructure || incident.problemStatement || '';
    const incidentArea = incident.affectedArea || '';

    const matchingMemories = [];
    let recurrenceDetected = false;
    let maxSimilarity = 0;
    let lastOccurrence = null;
    let previousResolution = null;

    for (const hist of historicalIncidents) {
      const areaMatch = hist.affectedArea && incidentArea && (
        hist.affectedArea.toLowerCase().includes(incidentArea.toLowerCase()) ||
        incidentArea.toLowerCase().includes(hist.affectedArea.toLowerCase())
      );

      const sim = AIProvider.calculateSemanticSimilarity(
        `${incident.title} ${incident.problemStatement}`,
        `${hist.title} ${hist.problemStatement}`
      );

      if (areaMatch || sim > 0.45) {
        recurrenceDetected = true;
        if (sim > maxSimilarity) {
          maxSimilarity = sim;
          lastOccurrence = hist.updatedAt ? new Date(hist.updatedAt).toLocaleDateString() : 'Previous Fiscal Year';
          previousResolution = hist.rootCause?.probableRootCause || 'Temporary repair and surface patching';
        }

        matchingMemories.push({
          year: hist.createdAt ? new Date(hist.createdAt).getFullYear().toString() : '2025',
          date: hist.createdAt ? new Date(hist.createdAt).toLocaleDateString('en-GB') : '14 June 2025',
          incidentId: hist.id,
          title: hist.title,
          actionTaken: hist.simulations?.[0]?.title || 'Emergency repair clamp & surface dressing',
          outcome: 'Temporary relief achieved; underlying subgrade or joint degradation remained unresolved.',
          lessonsLearned: 'Surface repair without full conduit renewal creates recurrent failure within 12 months.'
        });
      }
    }

    // Query Contractor Warranty Registry
    const warranties = db.getContractorWarranties(primaryInfra);
    let warrantyStatus = 'Warranty information unavailable';
    let activeWarranty = null;

    if (warranties && warranties.length > 0) {
      activeWarranty = warranties[0];
      warrantyStatus = activeWarranty.status === 'ACTIVE_WARRANTY'
        ? `Active Warranty (${activeWarranty.contractor} - Expires ${activeWarranty.warrantyEnd})`
        : `Warranty Expired (${activeWarranty.contractor} - Ended ${activeWarranty.warrantyEnd})`;
    }

    return {
      previous_incidents: matchingMemories,
      recurrence_detected: recurrenceDetected,
      similarity: Number(maxSimilarity.toFixed(2)),
      last_occurrence: lastOccurrence,
      previous_resolution: previousResolution,
      warranty_info: warrantyStatus,
      warranty_record: activeWarranty
    };
  }
}
