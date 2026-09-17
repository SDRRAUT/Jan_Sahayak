import { aiProvider } from './aiProvider.js';

/**
 * AGENT 2: COMPLAINT DNA AGENT
 * Creates a normalized fingerprint and dense 768-dim feature embedding for pgvector similarity.
 */
export class ComplaintDNAAgent {
  static async generateDNA(analysisResult, complaintInput) {
    const location = complaintInput.location || {};
    const lat = Number(location.lat) || 28.7180;
    const lng = Number(location.lng) || 77.1260;
    const ward = location.ward || complaintInput.ward || 'Delhi Ward 14';

    // Build dense semantic feature representation
    const textFeatures = [
      analysisResult.problem_type,
      analysisResult.category,
      analysisResult.subcategory,
      analysisResult.summary,
      complaintInput.descriptionRaw || complaintInput.description || '',
      ...(analysisResult.infrastructure || []),
      ...(analysisResult.keywords || []),
      ...(analysisResult.entities || [])
    ].filter(Boolean).join(' ');

    // Generate 768-dimensional pgvector semantic embedding
    const embedding = await aiProvider.generateEmbedding(textFeatures);

    // Feature buckets for categorical alignment
    const semanticEmbedding = this.generateFeatureEmbedding(textFeatures.toLowerCase());

    const cleanWard = ward.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
    const dnaId = `DNA-${String(complaintInput.id || Date.now()).slice(-6)}-${cleanWard}`;

    return {
      dnaId,
      problem: analysisResult.problem_type || 'General Civic Infrastructure',
      infrastructure: (analysisResult.infrastructure && analysisResult.infrastructure[0]) || 'Municipal Public Corridor',
      location: { lat, lng, ward },
      landmarks: analysisResult.entities || [],
      affected_groups: analysisResult.affected_groups || ['Local Residents', 'Commuters'],
      severity: analysisResult.severity || 'HIGH',
      urgency: analysisResult.urgency || 8,
      time_pattern: (analysisResult.temporal_signals && analysisResult.temporal_signals[0]) || 'Recurring periodic',
      embedding,
      semantic_embedding: semanticEmbedding,
      normalized_description: `${analysisResult.category}: ${analysisResult.subcategory || analysisResult.problem_type} (${analysisResult.summary || 'Civic report'})`,
      rawText: complaintInput.descriptionRaw || complaintInput.description || ''
    };
  }

  /**
   * Generates a 16-dimensional semantic vector based on civic issue categories
   */
  static generateFeatureEmbedding(text) {
    const buckets = [
      ['water', 'pipeline', 'leak', 'potable', 'supply'],
      ['drain', 'drainage', 'sewer', 'naali', 'clog', 'silt'],
      ['flood', 'flooded', 'waterlogging', 'standing', 'rain', 'rainfall'],
      ['road', 'cavity', 'pothole', 'gaddha', 'asphalt', 'bitumen'],
      ['school', 'students', 'children', 'education', 'pedestrians'],
      ['traffic', 'auto', 'driver', 'vehicles', 'commute', 'corridor'],
      ['electric', 'power', 'transformer', 'wire', 'spark', 'bijli'],
      ['sanitation', 'garbage', 'dump', 'waste', 'kooda', 'smell'],
      ['hospital', 'health', 'clinic', 'emergency', 'biohazard'],
      ['market', 'commercial', 'shop', 'vendor', 'bazaar'],
      ['subgrade', 'structural', 'collapse', 'subsidence', 'erosion'],
      ['pump', 'valve', 'meter', 'feeder', 'substation'],
      ['urgent', 'hazard', 'severe', 'accident', 'danger'],
      ['morning', 'hours', 'peak', 'regular', 'daily'],
      ['residential', 'colony', 'pocket', 'sector', 'block'],
      ['municipal', 'djb', 'pwd', 'mcd', 'bses']
    ];

    return buckets.map(keywords => {
      let count = 0;
      for (const kw of keywords) {
        if (text.includes(kw)) count += 1;
      }
      return count > 0 ? Math.min(1, count / 2) : 0;
    });
  }
}
