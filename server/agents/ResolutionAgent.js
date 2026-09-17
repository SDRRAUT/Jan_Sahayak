import { aiProvider } from './aiProvider.js';

/**
 * AGENT 6: RESOLUTION AGENT & ACTION SIMULATION SANDBOX
 * Generates practical remediation options customized to the incident's specific problem and context.
 * Clearly labels all cost and duration numbers as:
 * "Estimated / requires authority validation"
 */
export class ResolutionAgent {
  static async generateSimulations(incident, rootCauseData) {
    const title = incident.title || 'Civic Infrastructure Incident';
    const cause = rootCauseData?.probable_root_cause || incident.problemStatement || '';

    const systemPrompt = `You are a Municipal Engineering Decision Analyst for Delhi NCT. Formulate 2 to 3 distinct resolution strategies for a civic infrastructure incident. Cost and time numbers must be clearly noted as preliminary estimates requiring official sanction.`;
    const prompt = `Incident: "${title}"
Root Cause: "${cause}"
Area: "${incident.affectedArea}"
Severity: "${incident.severity}"

Generate 2-3 realistic engineering strategies (e.g. Rapid Temporary vs Comprehensive Long-Term vs Diagnostic Joint Inspection).
Return strictly JSON format:
{
  "simulations": [
    {
      "id": "SIM-A",
      "title": "Option A: Short Descriptive Name",
      "description": "Concrete technical steps",
      "estimatedCost": "₹X,XXX (Estimated / requires authority validation)",
      "estimatedDuration": "X Hours / Days",
      "expectedEffectiveness": "XX% description",
      "recurrenceRisk": "HIGH/MEDIUM/LOW (< XX% recurrence)",
      "risks": ["Risk 1", "Risk 2"],
      "coordinationRequired": "Departments needed",
      "recommendationVerdict": "RECOMMENDED or SUB-OPTIMAL evaluation"
    }
  ]
}`;

    const fallback = () => {
      const lower = `${title} ${cause}`.toLowerCase();

      if (lower.includes('drain') || lower.includes('flooded') || lower.includes('waterlogging')) {
        return {
          simulations: [
            {
              id: 'SIM-A',
              title: 'Option A: High-Capacity Super-Sucker Desilting & Emergency Culvert Flush',
              description: 'Deploy MCD mechanical super-sucker unit to evacuate choked silt traps and high-pressure jet blocked roadside culverts.',
              timeToIntervention: '2–4 Hours',
              expectedResolutionTime: '8 Hours',
              affectedPopulationReduction: '75% immediate water clearance',
              recurrenceRisk: 'MEDIUM (May re-clog upon subsequent heavy precipitation without curb reprofiling)',
              costScore: '₹14,500 (Estimated / requires authority validation)',
              estimatedCost: '₹14,500 (Estimated / requires authority validation)',
              estimatedDuration: '8 Hours',
              coordinationRequired: 'MCD Sanitation Division + Delhi Traffic Police',
              confidence: 'High',
              recommendationVerdict: 'CRITICAL FIRST STEP: Resolves immediate school access emergency within 8 hours.'
            },
            {
              id: 'SIM-B',
              title: 'Option B: Comprehensive Invert Gradient Correction & Box-Culvert Widening',
              description: 'Re-engineer the 45-meter drainage section with precast reinforced concrete box culvert and re-grade carriageway curb slope.',
              timeToIntervention: '18–24 Hours',
              expectedResolutionTime: '48 Hours (Over weekend)',
              affectedPopulationReduction: '98% permanent storm surge drainage',
              recurrenceRisk: 'LOW (< 5% recurrence over 10-year design horizon)',
              costScore: '₹1,20,000 (Estimated / requires authority validation)',
              estimatedCost: '₹1,20,000 (Estimated / requires authority validation)',
              estimatedDuration: '48 Hours',
              coordinationRequired: 'PWD Roads + MCD Drainage Department',
              confidence: 'High',
              recommendationVerdict: 'RECOMMENDED: Eliminates chronic waterlogging permanently and protects school foundation.'
            },
            {
              id: 'SIM-C',
              title: 'Option C: Temporary High-Discharge Diesel Pump Deployment (Interim Relief)',
              description: 'Position trailer-mounted 40hp de-watering pump discharging runoff directly into trunk stormwater drain 200m downstream.',
              timeToIntervention: '1–2 Hours',
              expectedResolutionTime: '2 Hours setup',
              affectedPopulationReduction: '85% active pumping capacity',
              recurrenceRisk: 'HIGH (Operational remedy only, ceases when pump stops)',
              costScore: '₹6,000 (Estimated / requires authority validation)',
              estimatedCost: '₹6,000 (Estimated / requires authority validation)',
              estimatedDuration: '2 Hours',
              coordinationRequired: 'MCD Maintenance Unit',
              confidence: 'Very High',
              recommendationVerdict: 'CONTINGENCY: Temporary bridge while Option B engineering work order is issued.'
            }
          ]
        };
      }

      // Default Water / Road simulations
      return {
        simulations: [
          {
            id: 'SIM-A',
            title: 'Option A: Rapid External Clamping (Emergency Split-Sleeve)',
            description: 'Excavate localized pit and install stainless steel split-sleeve clamp over damaged conduit section.',
            timeToIntervention: '4–6 Hours',
            expectedResolutionTime: '6 Hours',
            affectedPopulationReduction: '80% immediate relief',
            recurrenceRisk: 'HIGH (65% probability of recurrence within 6 months)',
            costScore: '₹18,000 (Estimated / requires authority validation)',
            estimatedCost: '₹18,000 (Estimated / requires authority validation)',
            estimatedDuration: '6 Hours',
            coordinationRequired: 'Primary Department Only',
            confidence: 'High',
            recommendationVerdict: 'SUB-OPTIMAL: High risk of repeated failure.'
          },
          {
            id: 'SIM-B',
            title: 'Option B: Full Segment Replacement & Subgrade Re-bedding',
            description: 'Comprehensive segment renewal with modern polyurethane-lined ductile asset + compacted granular sub-base reconstruction.',
            timeToIntervention: '18–24 Hours',
            expectedResolutionTime: '36 Hours',
            affectedPopulationReduction: '98% permanent fix',
            recurrenceRisk: 'LOW (< 5% recurrence over 15 years)',
            costScore: '₹1,45,000 (Estimated / requires authority validation)',
            estimatedCost: '₹1,45,000 (Estimated / requires authority validation)',
            estimatedDuration: '36 Hours',
            coordinationRequired: 'Joint Inter-Department Coordination',
            confidence: 'High',
            recommendationVerdict: 'RECOMMENDED: Eliminates long-term civic disruption.'
          }
        ]
      };
    };

    const result = await aiProvider.generateStructuredJSON(prompt, systemPrompt, fallback);
    const sims = result.simulations || fallback().simulations;
    return sims.map((s, idx) => ({
      id: s.id || `SIM-${String.fromCharCode(65 + idx)}`,
      title: s.title || `Option ${String.fromCharCode(65 + idx)}: Action Scenario`,
      description: s.description || 'Remediation scenario.',
      timeToIntervention: s.timeToIntervention || s.estimatedDuration || '4-8 Hours',
      expectedResolutionTime: s.expectedResolutionTime || s.estimatedDuration || '24 Hours',
      affectedPopulationReduction: s.affectedPopulationReduction || s.expectedEffectiveness || '85% relief',
      recurrenceRisk: s.recurrenceRisk || 'LOW (< 10% recurrence)',
      costScore: s.costScore || s.estimatedCost || 'Estimated / requires authority validation',
      estimatedCost: s.estimatedCost || s.costScore || 'Estimated / requires authority validation',
      estimatedDuration: s.estimatedDuration || s.expectedResolutionTime || '24 Hours',
      coordinationRequired: s.coordinationRequired || 'Lead Department + Traffic Authority',
      confidence: s.confidence || 'High',
      recommendationVerdict: s.recommendationVerdict || 'Action recommended for field authorization.'
    }));
  }
}
