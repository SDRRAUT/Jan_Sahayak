/**
 * AGENT 2: COMPLAINT DNA AGENT
 * Creates a normalized fingerprint and dense feature embedding for vector similarity.
 */
export class ComplaintDNAAgent {
  static generateDNA(analysisResult, complaintInput) {
    const location = complaintInput.location || {};
    const lat = Number(location.lat) || 28.7180;
    const lng = Number(location.lng) || 77.1260;
    const ward = location.ward || complaintInput.ward || 'Delhi Ward 14';

    // Build dense semantic feature representation
    const textFeatures = [
      analysisResult.problem_type,
      analysisResult.category,
      analysisResult.subcategory,
      ...(analysisResult.infrastructure || []),
      ...(analysisResult.keywords || []),
      ...(analysisResult.entities || [])
    ].join(' ').toLowerCase();

    // Generate normalized semantic embedding hash/vector for clustering
    const embedding = this.generateFeatureEmbedding(textFeatures);

    const dnaId = `DNA-${Math.floor(10000 + Math.random() * 90000)}-${ward.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()}`;

    return {
      dnaId,
      problem: analysisResult.problem_type || 'general_civic',
      infrastructure: (analysisResult.infrastructure && analysisResult.infrastructure[0]) || 'Municipal Public Corridor',
      location: { lat, lng, ward },
      landmarks: analysisResult.entities || [],
      affected_groups: analysisResult.affected_groups || ['Citizens'],
      severity: analysisResult.severity || 5,
      urgency: analysisResult.urgency || 5,
      time_pattern: (analysisResult.temporal_signals && analysisResult.temporal_signals[0]) || 'Recurring periodic',
      semantic_embedding: embedding,
      normalized_description: `${analysisResult.category}: ${analysisResult.subcategory} (${analysisResult.summary})`,
      rawText: complaintInput.text || complaintInput.description || ''
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
