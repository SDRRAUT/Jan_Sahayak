import { aiProvider } from './aiProvider.js';

/**
 * AGENT 1: COMPLAINT ANALYZER AGENT
 * Triggered automatically when a new complaint is submitted.
 * Extracts structured entities, severity, urgency, infrastructure, and location signals.
 */
export class ComplaintAnalyzerAgent {
  static async analyze(complaintInput) {
    const text = (complaintInput.text || complaintInput.description || complaintInput.descriptionRaw || '').trim();
    const transcript = complaintInput.audioTranscript || complaintInput.transcript || '';
    const fullText = `${text} ${transcript}`.trim();
    const location = complaintInput.location || {};
    const ward = location.ward || complaintInput.ward || 'Delhi NCT';

    const systemPrompt = `You are a Municipal Grievance Analyzer for JanSahayak Delhi NCT. Analyze the citizen report and output strictly structured JSON.`;
    const prompt = `Analyze this citizen complaint:
Text: "${fullText}"
Ward/Area: "${ward}"
Latitude: ${location.lat || 'Unknown'}, Longitude: ${location.lng || 'Unknown'}

Return JSON schema:
{
  "summary": "Short 1-sentence technical summary",
  "problem_type": "water_contamination | drainage_waterlogging | road_cavity | garbage_dump | power_outage | general",
  "category": "Water Supply | Roads & Infrastructure | Sanitation | Electricity",
  "subcategory": "Specific subcategory",
  "severity": <integer 1 to 10>,
  "urgency": <integer 1 to 10>,
  "affected_groups": ["list of affected groups like School Children, Commuters, Residents"],
  "infrastructure": ["list of physical assets like Storm Drain, Arterial Road, Water Main"],
  "entities": ["landmarks or institutions mentioned like Mother Dairy, School, Market"],
  "keywords": ["key technical words"],
  "temporal_signals": ["e.g. after rain, past 3 days, morning hours"],
  "location_context": "Location summary"
}`;

    const fallback = () => {
      const lower = fullText.toLowerCase();
      let problem_type = 'general';
      let category = 'General Civic Infrastructure';
      let subcategory = 'Civil Maintenance Deficit';
      let severity = 5;
      let urgency = 5;
      const affected_groups = ['General Public'];
      const infrastructure = ['Public Corridor'];
      const entities = [];
      const keywords = [];
      const temporal_signals = [];

      // Waterlogging / drainage
      if (lower.includes('water') || lower.includes('flooded') || lower.includes('drain') || lower.includes('paani') || lower.includes('rainfall') || lower.includes('rain')) {
        if (lower.includes('school') || lower.includes('student') || lower.includes('walk')) {
          affected_groups.push('School Students', 'Pedestrians', 'Parents');
        }
        if (lower.includes('auto') || lower.includes('driver') || lower.includes('traffic') || lower.includes('road')) {
          affected_groups.push('Auto Rickshaw Drivers', 'Vehicular Commuters');
        }

        if (lower.includes('drain') || lower.includes('overflow') || lower.includes('naali')) {
          problem_type = 'drainage_waterlogging';
          category = 'Water & Drainage Infrastructure';
          subcategory = 'Stormwater Drain Overflow & Backwash';
          infrastructure.push('Stormwater Drain', 'Roadside Culvert');
          keywords.push('drain', 'overflow', 'backwash', 'silt');
        } else if (lower.includes('road') || lower.includes('standing water') || lower.includes('flooded')) {
          problem_type = 'drainage_waterlogging';
          category = 'Water & Drainage Infrastructure';
          subcategory = 'Surface Waterlogging & Road Inundation';
          infrastructure.push('Carriageway Subgrade', 'Stormwater Drain');
          keywords.push('waterlogging', 'flooding', 'standing water');
        } else if (lower.includes('contamination') || lower.includes('ganda') || lower.includes('smell') || lower.includes('badbu')) {
          problem_type = 'water_contamination';
          category = 'Water Supply & Contamination';
          subcategory = 'Pipeline Infiltration & Biological Contamination';
          infrastructure.push('Potable Water Feeder Main', 'Distribution Valve');
          keywords.push('contamination', 'pipeline', 'leakage');
          severity = 9;
          urgency = 9;
        }

        if (lower.includes('rain') || lower.includes('rainfall')) temporal_signals.push('Post-rainfall storm surge');
        if (lower.includes('hours') || lower.includes('days')) temporal_signals.push('Persistent multi-hour stagnation');

        severity = Math.max(severity, 7);
        urgency = Math.max(urgency, 8);
      } 
      // Road damage
      else if (lower.includes('pothole') || lower.includes('gaddha') || lower.includes('road') || lower.includes('cavity') || lower.includes('accident')) {
        problem_type = 'road_cavity';
        category = 'Roads & Infrastructure';
        subcategory = 'Bituminous Carriageway Deformation';
        infrastructure.push('Asphalt Carriageway', 'Road Sub-base');
        keywords.push('pothole', 'cavity', 'carriageway', 'skid hazard');
        severity = 8;
        urgency = 8;
      }
      // Power
      else if (lower.includes('bijli') || lower.includes('power') || lower.includes('spark') || lower.includes('transformer')) {
        problem_type = 'power_outage';
        category = 'Electricity & Power Grid';
        subcategory = 'Transformer Thermal Overload & Arc Fault';
        infrastructure.push('Distribution Transformer', 'Feeder Line');
        keywords.push('transformer', 'voltage', 'spark');
        severity = 9;
        urgency = 9;
      }

      if (lower.includes('school')) entities.push('Government / Public School Corridor');
      if (lower.includes('mother dairy')) entities.push('Mother Dairy Booth');
      if (lower.includes('market')) entities.push('Local Commercial Market');

      return {
        summary: fullText.slice(0, 120),
        problem_type,
        category,
        subcategory,
        severity,
        urgency,
        affected_groups,
        infrastructure,
        entities,
        keywords,
        temporal_signals,
        location_context: `${ward} - Corridor observation`
      };
    };

    return await aiProvider.generateStructuredJSON(prompt, systemPrompt, fallback);
  }
}
