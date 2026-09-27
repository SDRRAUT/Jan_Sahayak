import { AIProvider } from './aiProvider.js';
import { isPostgresActive, postgresDB } from '../db/postgres.js';

/**
 * AGENT 3: SIMILARITY & CLUSTERING AGENT
 * Searches the database for related complaints.
 * Computes composite relationship score across:
 * - Semantic Similarity (Vector cosine + keyword overlap via pgvector / fallback token cosine)
 * - Geographic Proximity (PostGIS ST_DWithin / fallback Haversine distance decay)
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
  static async clusterComplaint(newComplaint, existingComplaints = [], existingClusters = []) {
    const newDna = newComplaint.dna || {};
    const newLocation = newComplaint.location || newDna.location || {};
    const newLat = Number(newLocation.lat) || 28.7180;
    const newLng = Number(newLocation.lng) || 77.1260;
    const newDesc = `${newComplaint.descriptionRaw || ''} ${newComplaint.title || ''}`;

    let postgisDistances = new Map();
    let pgvectorSimilarities = new Map();
    const usingPostgres = isPostgresActive();

    // When PostgreSQL is active, execute real PostGIS and pgvector queries
    if (usingPostgres) {
      try {
        const nearby = await postgresDB.searchNearbyGrievances(newLat, newLng, this.MAX_CLUSTER_RADIUS_METERS);
        if (Array.isArray(nearby)) {
          for (const item of nearby) {
            postgisDistances.set(item.id, Number(item.distance_meters));
          }
        }

        if (newDna.embedding && Array.isArray(newDna.embedding)) {
          const similar = await postgresDB.searchSimilarComplaints(newDna.embedding, 0.60, 10);
          if (Array.isArray(similar)) {
            for (const item of similar) {
              pgvectorSimilarities.set(item.complaint_id, Number(item.similarity));
            }
          }
        }
      } catch (err) {
        console.warn('[SimilarityClusterAgent] PostGIS/pgvector query failed, falling back to in-memory math:', err.message);
      }
    }

    let highestScore = 0;
    let bestCluster = null;
    let bestReason = '';

    // 1. Evaluate against existing clusters first
    for (const cluster of existingClusters) {
      // Find complaints in this cluster to score against
      const clusterComplaints = existingComplaints.filter(c => cluster.complaintIds && cluster.complaintIds.includes(c.id));

      // Domain incompatibility filter: Potholes/roads must NEVER merge into water pipeline/contamination clusters
      const newCategory = (newComplaint.category || newDna.category || '').toLowerCase();
      const isWater = newCategory.includes('water');
      const isRoad = newCategory.includes('road') || newDna.problem_type === 'road_cavity' || newDna.problem === 'road_cavity';

      const clusterCategories = clusterComplaints.map(c => `${c.category || ''} ${c.dna?.category || ''} ${c.title || ''}`).join(' ').toLowerCase();
      const clusterIsWater = clusterCategories.includes('water') || (cluster.title || '').toLowerCase().includes('water') || (cluster.leadDepartment || '').toLowerCase().includes('jal');
      const clusterIsRoad = clusterCategories.includes('road') || clusterCategories.includes('pothole') || (cluster.title || '').toLowerCase().includes('road') || (cluster.leadDepartment || '').toLowerCase().includes('pwd');

      if ((isWater && clusterIsRoad) || (isRoad && clusterIsWater)) {
        continue;
      }

      const clusterCentroid = cluster.centroid || { lat: 28.7180, lng: 77.1260 };
      const distMeters = AIProvider.calculateDistanceMeters(newLat, newLng, clusterCentroid.lat, clusterCentroid.lng);

      // Geographic score (decay over 800 meters)
      const geoScore = Math.max(0, 1 - distMeters / this.MAX_CLUSTER_RADIUS_METERS);

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
          // Use pgvector cosine similarity if available from DB query, otherwise fallback token cosine
          if (pgvectorSimilarities.has(cc.id)) {
            sumSem += pgvectorSimilarities.get(cc.id);
          } else {
            sumSem += AIProvider.calculateSemanticSimilarity(newDesc, ccDesc);
          }

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
            (newDna.problem === 'water_contamination' && ccDna.problem === 'water_supply_disruption') ||
            (newDna.problem === 'water_supply_disruption' && ccDna.problem === 'water_contamination')
          ) {
            sumProb += 0.85; // Strong hydraulic pressure/contamination correlation
          } else if (
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
        bestReason = `Spatial (${Math.round(distMeters)}m), temporal, and semantic correlation (${Math.round(compositeScore * 100)}% match)`;
      }
    }

    // 2. Decision: match existing cluster or create a new cluster
    if (bestCluster && highestScore >= this.CLUSTER_CONFIDENCE_THRESHOLD) {
      return {
        action: 'JOIN_CLUSTER',
        clusterId: bestCluster.id,
        confidence: Number(highestScore.toFixed(3)),
        relationship_score: Number(highestScore.toFixed(3)),
        relationship_reason: bestReason,
        incident_id: bestCluster.incidentId || null,
        source: usingPostgres ? 'postgis_pgvector' : 'haversine_tfidf_fallback',
        matchReason: bestReason
      };
    }

    // New Cluster Required
    const newClusterId = `CL-${newDna.location?.ward ? newDna.location.ward.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() : 'DEL'}-${Date.now().toString().slice(-4)}`;
    return {
      action: 'CREATE_CLUSTER',
      clusterId: newClusterId,
      confidence: 1.0,
      relationship_score: Number(highestScore.toFixed(3)),
      relationship_reason: highestScore > 0 ? `Score (${Math.round(highestScore * 100)}%) below threshold ${Math.round(this.CLUSTER_CONFIDENCE_THRESHOLD * 100)}%` : 'Novel civic signal pattern',
      incident_id: null,
      source: usingPostgres ? 'postgis_pgvector' : 'haversine_tfidf_fallback',
      initialCentroid: { lat: newLat, lng: newLng },
      matchReason: 'Novel civic signal cluster initiated'
    };
  }
}
