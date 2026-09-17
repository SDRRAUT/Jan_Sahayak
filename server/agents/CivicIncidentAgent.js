import { aiProvider } from './aiProvider.js';

/**
 * AGENT 4: CIVIC INCIDENT AGENT & THRESHOLD ENGINE
 * Aggregates complaints in a cluster into a systemic Civic Incident.
 * Dynamically determines lifecycle stage and velocity based on real data.
 */
export class CivicIncidentAgent {
  // Configurable thresholds
  static THRESHOLDS = {
    emerging: { minComplaints: 2, minUniqueCitizens: 1, minSeverity: 5 },
    growing: { minComplaints: 4, minUniqueCitizens: 2, minSeverity: 6, maxRadiusMeters: 500 },
    critical: { minComplaints: 7, minUniqueCitizens: 4, minSeverity: 8 }
  };

  static synthesizeIncident(cluster, clusterComplaints = [], existingIncident = null) {
    const complaintCount = clusterComplaints.length;
    const uniqueCitizens = new Set(clusterComplaints.map(c => c.citizenId || c.citizenPhone || c.citizenName)).size;
    const avgSeverity = Math.round(
      clusterComplaints.reduce((acc, c) => acc + (c.dna?.severity || c.urgencyScore / 10 || 5), 0) / Math.max(1, complaintCount)
    );
    const avgUrgency = Math.round(
      clusterComplaints.reduce((acc, c) => acc + (c.dna?.urgency || c.urgencyScore / 10 || 5), 0) / Math.max(1, complaintCount)
    );

    // Compute actual geographic radius & spread velocity from observations
    const { radiusMeters, velocityData } = this.calculateGeospatialMetrics(clusterComplaints);

    // Determine lifecycle stage based on configurable threshold engine
    let stage = 'EMERGING';
    if (existingIncident && existingIncident.verificationStatus === 'VERIFIED') {
      stage = 'RESOLVED';
    } else if (existingIncident && (existingIncident.status === 'Action Planned' || existingIncident.status === 'IN_PROGRESS')) {
      stage = 'RESOLVING';
    } else if (
      complaintCount >= this.THRESHOLDS.critical.minComplaints ||
      avgSeverity >= this.THRESHOLDS.critical.minSeverity
    ) {
      stage = 'CRITICAL';
    } else if (
      complaintCount >= this.THRESHOLDS.growing.minComplaints ||
      uniqueCitizens >= this.THRESHOLDS.growing.minUniqueCitizens
    ) {
      stage = 'GROWING';
    }

    // Extract consolidated evidence from actual reports
    const evidence = clusterComplaints.map(c => {
      const citizen = c.citizenName || 'Citizen';
      const text = c.descriptionRaw || c.title || '';
      return `${citizen}: "${text.slice(0, 95)}..."`;
    });

    const primaryCategory = clusterComplaints[0]?.category || 'Civic Infrastructure';
    const ward = clusterComplaints[0]?.location?.ward || 'Delhi NCT';
    const incidentId = existingIncident?.id || `INC-2026-DEL-${Math.floor(10 + Math.random() * 89)}`;

    // Build synthesized title and problem statement
    const title = existingIncident?.title || `${ward} — Systemic ${primaryCategory} Disruption`;
    const problemStatement = `${complaintCount} citizen signal(s) clustered across a ${radiusMeters}m corridor in ${ward}. Primary impact: ${primaryCategory}.`;

    const estimatedHouseholds = Math.min(2500, Math.max(120, complaintCount * 75));

    return {
      id: incidentId,
      title,
      problemStatement,
      stage,
      severity: avgSeverity >= 8 ? 'CRITICAL' : avgSeverity >= 6 ? 'HIGH' : 'MEDIUM',
      urgency: avgUrgency >= 8 ? 'CRITICAL' : avgUrgency >= 6 ? 'HIGH' : 'MEDIUM',
      summary: problemStatement,
      affectedArea: ward,
      affectedPopulation: `~${estimatedHouseholds.toLocaleString()} Citizens / ~${Math.round(estimatedHouseholds / 4)} Households`,
      complaintCount,
      uniqueCitizens,
      clusterIds: [cluster.id],
      complaintIds: clusterComplaints.map(c => c.id),
      stageVelocity: velocityData.rateMetersPerHour !== null 
        ? `+${velocityData.rateMetersPerHour} m/hr corridor spread` 
        : 'Velocity: Not enough observations',
      velocityData,
      evidence,
      pattern: `${complaintCount} related complaints within ${radiusMeters}m radius over observed window`,
      status: stage === 'RESOLVED' ? 'RESOLVED' : stage === 'RESOLVING' ? 'IN_PROGRESS' : 'UNDER_INVESTIGATION',
      verificationStatus: existingIncident?.verificationStatus || 'PENDING_FIELD_WORK',
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculates actual physical radius and velocity change rate
   */
  static calculateGeospatialMetrics(complaints) {
    if (complaints.length < 2) {
      return {
        radiusMeters: 120,
        velocityData: {
          rateMetersPerHour: null,
          isSufficientData: false,
          observationCount: complaints.length,
          label: 'Velocity: Not enough observations'
        }
      };
    }

    const coords = complaints
      .map(c => ({
        lat: Number(c.location?.lat),
        lng: Number(c.location?.lng),
        time: new Date(c.timestamp || c.createdAt || Date.now()).getTime()
      }))
      .filter(c => !isNaN(c.lat) && !isNaN(c.lng));

    if (coords.length < 2) {
      return {
        radiusMeters: 150,
        velocityData: {
          rateMetersPerHour: null,
          isSufficientData: false,
          observationCount: coords.length,
          label: 'Velocity: Not enough observations'
        }
      };
    }

    // Sort by timestamp
    coords.sort((a, b) => a.time - b.time);

    const first = coords[0];
    const last = coords[coords.length - 1];
    const totalDistMeters = aiProvider.constructor.calculateDistanceMeters(first.lat, first.lng, last.lat, last.lng);
    const timeDeltaHours = Math.max(0.25, (last.time - first.time) / (1000 * 60 * 60));

    const rateMetersPerHour = Number((totalDistMeters / timeDeltaHours).toFixed(1));

    return {
      radiusMeters: Math.max(100, Math.min(1200, totalDistMeters)),
      velocityData: {
        rateMetersPerHour: Math.min(150, Math.max(2.5, rateMetersPerHour)),
        isSufficientData: true,
        observationCount: coords.length,
        label: 'Calculated from timestamped observations'
      }
    };
  }
}
