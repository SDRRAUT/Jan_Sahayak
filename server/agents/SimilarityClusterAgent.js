import { AIProvider } from './aiProvider.js';

/**
 * AGENT 3: SIMILARITY & CLUSTERING AGENT
 * Searches the database for related complaints.
 * Computes composite relationship score across:
 * - Semantic Similarity (Vector cosine + keyword overlap)
 * - Geographic Proximity (Haversine distance decay)
 * - Infrastructure Match (Asset & service relationship)
 * - Temporal Relationship (Time proximity decay)
 * - Problem-Type Match
 */
export class SimilarityClusterAgent {
  // Configurable weights
  static WEIGHTS = {
    semantic: 0.30,
    geographic: 0.25,
    infrastructure: 0.20,
    temporal: 0.15,
    problemType: 0.10
  };

  static CLUSTER_CONFIDENCE_THRESHOLD = 0.60; // Below this => NO MATCH, create new cluster
  static MAX_CLUSTER_RADIUS_METERS = 800;    // Maximum 800m corridor distance

  /**
   * Evaluates a complaint against existing clusters or complaints in the database
   */
  static clusterComplaint(newComplaint, existingComplaints = [], existingClusters = []) {
    const newDna = newComplaint.dna || {};
    const newLocation = newComplaint.location || newDna.location || {};
    const newLat = Number(newLocation.lat) || 28.7180;
    const newLng = Number(newLocation.lng) || 77.1260;
    const newDesc = `${newComplaint.descriptionRaw || ''} ${newComplaint.title || ''}`;

    let bestMatch = null;
    let highestScore = 0;
    let bestCluster = null;

    // 1. Evaluate against existing clusters first
    for (const cluster of existingClusters) {
      const clusterCentroid = cluster.centroid || { lat: 28.7180, lng: 77.1260 };
      const distMeters = AIProvider.calculateDistanceMeters(newLat, newLng, clusterCentroid.lat, clusterCentroid.lng);

      // Geographic score (decay over 800 meters)
      const geoScore = Math.max(0, 1 - distMeters / this.MAX_CLUSTER_RADIUS_METERS);

      // Find complaints in this cluster to score against
      const clusterComplaints = existingComplaints.filter(c => cluster.complaintIds.includes(c.id));
      let clusterSemanticScore = 0;
      let clusterInfraScore = 0;
      let clusterProblemScore = 0;
      let clusterTemporalScore = 0;

      if (clusterComplaints.length > 0) {
        let sumSem = 0;
        let sumInfra = 0;
        let sumProb = 0;
        let sumTemp = 0;

        for (const cc of clusterComplaints) {
          const ccDesc = `${cc.descriptionRaw || ''} ${cc.title || ''}`;
          sumSem += AIProvider.calculateSemanticSimilarity(newDesc, ccDesc);

          const ccDna = cc.dna || {};
          // Infrastructure relationship: water + road + drainage correlation
          if (newDna.infrastructure && ccDna.infrastructure) {
            const infra1 = newDna.infrastructure.toLowerCase();
            const infra2 = ccDna.infrastructure.toLowerCase();
            if (infra1 === infra2) sumInfra += 1.0;
            else if (
              (infra1.includes('drain') && infra2.includes('road')) ||
              (infra1.includes('road') && infra2.includes('drain')) ||
              (infra1.includes('water') && infra2.includes('drain'))
            ) {
              sumInfra += 0.85; // Strong cross-domain correlation
            } else {
              sumInfra += 0.2;
            }
          }

          // Problem-type match
          if (newDna.problem === ccDna.problem) sumProb += 1.0;
          else if (
            (newDna.problem === 'drainage_waterlogging' && ccDna.problem === 'water_contamination') ||
            (newDna.problem === 'drainage_waterlogging' && ccDna.problem === 'road_cavity')
          ) {
            sumProb += 0.75;
          } else {
            sumProb += 0.1;
          }

          // Temporal relationship (within last 72 hours)
          const t1 = new Date(newComplaint.timestamp || Date.now()).getTime();
          const t2 = new Date(cc.timestamp || Date.now()).getTime();
          const diffHours = Math.abs(t1 - t2) / (1000 * 60 * 60);
          sumTemp += Math.max(0, 1 - diffHours / 72);
        }

        clusterSemanticScore = sumSem / clusterComplaints.length;
        clusterInfraScore = sumInfra / clusterComplaints.length;
        clusterProblemScore = sumProb / clusterComplaints.length;
        clusterTemporalScore = sumTemp / clusterComplaints.length;
      }

      // Compute composite relationship score
      const compositeScore =
        this.WEIGHTS.semantic * clusterSemanticScore +
        this.WEIGHTS.geographic * geoScore +
        this.WEIGHTS.infrastructure * clusterInfraScore +
        this.WEIGHTS.temporal * clusterTemporalScore +
        this.WEIGHTS.problemType * clusterProblemScore;

      if (compositeScore > highestScore) {
        highestScore = compositeScore;
        bestCluster = cluster;
      }
    }

    // 2. Decision: match existing cluster or create a new cluster
    if (bestCluster && highestScore >= this.CLUSTER_CONFIDENCE_THRESHOLD) {
      return {
        action: 'JOIN_CLUSTER',
        clusterId: bestCluster.id,
        confidence: Number(highestScore.toFixed(3)),
        matchReason: `Spatial, temporal, and semantic correlation (${Math.round(highestScore * 100)}% match)`
      };
    }

    // New Cluster Required
    const newClusterId = `CL-${newDna.location?.ward ? newDna.location.ward.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() : 'DEL'}-${Date.now().toString().slice(-4)}`;
    return {
      action: 'CREATE_CLUSTER',
      clusterId: newClusterId,
      confidence: 1.0,
      initialCentroid: { lat: newLat, lng: newLng },
      matchReason: 'Novel civic signal cluster initiated'
    };
  }
}
