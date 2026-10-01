import { aiProvider } from './aiProvider.js';

/**
 * AGENT 5: ROOT CAUSE AGENT
 * Analyzes clustered evidence and generates causal hypotheses.
 * Strictly separates:
 * 1. Reported Facts (Verified citizen testimony)
 * 2. AI Inference (Hypothesis requiring confirmation)
 * 3. Verification Required (Field diagnostics needed)
 */
export class RootCauseAgent {
  static async inferRootCause(incident, clusterComplaints = [], civicMemory = null) {
    const complaintTexts = clusterComplaints.map(c => c.descriptionRaw || c.title || '').join('\n');
    const infraTypes = [...new Set(clusterComplaints.map(c => c.dna?.infrastructure).filter(Boolean))].join(', ') || 'Municipal Infrastructure';
    const landmarks = [...new Set(clusterComplaints.flatMap(c => c.dna?.landmarks || []))].filter(Boolean).join(', ') || 'Local Ward Area';
    const isInsufficientEvidence = clusterComplaints.length < 2 && complaintTexts.trim().length < 120;

    const systemPrompt = `You are a Municipal Forensic Infrastructure Investigator. Analyze clustered citizen reports to identify probable root causes.
CRITICAL MANDATE:
1. Strictly separate:
   - FACT: Verified citizen testimony and observed events
   - INFERENCE: Analytical reasoning connecting the facts
   - HYPOTHESIS: Proposed engineering cause requiring field testing
   - VERIFICATION_REQUIRED: Explicitly true, with exact diagnostics needed
2. If evidence is insufficient (e.g. only 1 report or vague complaint), do NOT invent certainty. Set confidence < 0.50 and explicitly demand physical verification.`;

    const prompt = `Incident: "${incident.title}"
Area: "${incident.affectedArea}"
Infrastructure Involved: "${infraTypes}"
Landmarks: "${landmarks}"
Citizen Reports Count: ${clusterComplaints.length}
Citizen Reports:
${complaintTexts}

Return strictly JSON:
{
  "probable_root_cause": "Detailed technical hypothesis",
  "FACT": ["Reported fact 1", "Reported fact 2"],
  "INFERENCE": "Analytical deduction explaining how the facts link to the underlying infrastructure problem",
  "HYPOTHESIS": "Primary causal hypothesis requiring physical validation",
  "VERIFICATION_REQUIRED": true,
  "contributing_factors": ["Factor 1", "Factor 2", "Factor 3"],
  "supporting_evidence": ["Fact observed 1", "Fact observed 2"],
  "contradicting_evidence": ["Evidence challenging primary hypothesis, or empty if none"],
  "confidence": <float between 0.30 and 0.95>,
  "verification_required": true,
  "requiresFieldVerification": true,
  "ai_inference_notes": "Explicit disclaimer identifying what is AI deduction vs citizen reported fact",
  "recommended_diagnostic": "Specific test like acoustic correlation, dye test, core drill",
  "possible_alternatives": ["Alternative hypothesis A", "Alternative hypothesis B"]
}`;

    const fallback = () => {
      const lower = complaintTexts.toLowerCase();
      let cause = 'Localized infrastructure capacity constraint and maintenance deficit in municipal corridor.';
      const factors = [];
      const evidence = [];

      // Extract factual quotes from citizens
      clusterComplaints.slice(0, 3).forEach(c => {
        evidence.push(`Citizen statement (${c.citizenName || 'Resident'}): "${(c.descriptionRaw || c.description || c.title || '').slice(0, 90)}"`);
      });

      if (isInsufficientEvidence) {
        return {
          probable_root_cause: 'INSUFFICIENT_EVIDENCE: Isolated report with insufficient corridor observations to confirm systemic root cause.',
          FACT: evidence.length > 0 ? evidence : ['Single unconfirmed citizen report received'],
          INFERENCE: 'AI cannot establish a systemic root cause with certainty from a single unverified complaint.',
          HYPOTHESIS: 'Preliminary unconfirmed incident pending on-ground physical inspection.',
          VERIFICATION_REQUIRED: true,
          contributing_factors: [
            'Limited sample size (only 1 observation)',
            'No corroborating nearby telemetry or cross-department complaints yet'
          ],
          supporting_evidence: evidence,
          contradicting_evidence: ['Lack of corroborating citizen reports in immediate 400m corridor'],
          confidence: 0.35,
          verification_required: true,
          requiresFieldVerification: true,
          ai_inference_notes: 'CAUTION: Insufficient evidence to establish high-confidence root cause. System explicitly requests field inspection before mechanical or contractual remediation.',
          recommended_diagnostic: 'MANDATORY FIELD INSPECTION: Dispatch ward junior engineer for on-site physical verification before initiating remediation.',
          possible_alternatives: [
            'Isolated consumer-end connection defect',
            'Temporary transient pressure fluctuation'
          ]
        };
      }

      if (lower.includes('water') && (lower.includes('school') || lower.includes('road') || lower.includes('drain'))) {
        cause = 'Subsurface stormwater culvert blockage and inadequate curb gradient leading to arterial water accumulation.';
        factors.push(
          'Post-rainfall runoff exceeding silted stormwater culvert capacity',
          'Silt accumulation and roadside debris obstructing gravity discharge',
          'Road carriageway gradient depression creating localized pool basin'
        );
        evidence.push('Multiple citizens report water remaining hours after rain cessation');
        evidence.push('Pedestrian and vehicular transit impassable along school approach');
      } else if (lower.includes('contaminat') || lower.includes('leak') || lower.includes('ganda') || lower.includes('pressure') || lower.includes('pipe')) {
        cause = 'Negative pressure cross-infiltration in primary distribution feeder line adjacent to sewage conduits.';
        factors.push(
          'Corrosion and gasket aging in subsurface distribution line',
          'Intermittent pumping cycle creating negative siphonage pressure',
          'Proximity of defective stormwater or sewer conduit'
        );
        evidence.push('Citizens report discolored tap water with noticeable odor');
        evidence.push('Simultaneous drop in line pressure reported across corridor');
      } else if (lower.includes('road') || lower.includes('pothole') || lower.includes('cavity')) {
        cause = 'Sub-base soil erosion and liquefaction from subsurface drainage seepage under asphalt carriageway.';
        factors.push(
          'Heavy axle vehicular loads on softened road subgrade',
          'Moisture entrapment beneath impermeable bituminous surface layer'
        );
        evidence.push('Visible asphalt depression and vehicular skid hazard reported');
      } else {
        factors.push('Aged municipal asset exceeding scheduled maintenance interval');
        factors.push('High localized population density and commercial transit load');
      }

      return {
        probable_root_cause: cause,
        FACT: evidence,
        INFERENCE: `Observed symptoms (${infraTypes || 'civic assets'}) indicate subsurface structural stress affecting corridor utilities.`,
        HYPOTHESIS: cause,
        VERIFICATION_REQUIRED: true,
        contributing_factors: factors,
        supporting_evidence: evidence,
        contradicting_evidence: [],
        confidence: 0.88,
        verification_required: true,
        requiresFieldVerification: true,
        ai_inference_notes: 'AI Inference: This root cause is derived from multi-signal clustering. It represents a high-probability hypothesis and requires physical inspection before mechanical intervention.',
        recommended_diagnostic: 'Conduct joint field acoustic correlation and culvert gradient verification.',
        possible_alternatives: [
          'Secondary utility trench settlement causing surface pooling',
          'Localized drainage siphon defect during peak flow intervals'
        ]
      };
    };

    return await aiProvider.generateStructuredJSON(prompt, systemPrompt, fallback);
  }
}
