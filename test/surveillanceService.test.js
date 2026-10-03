import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  escalateSurveillanceIncident, 
  generateOfficialMunicipalReport, 
  updateIncidentStatus,
  getSurveillanceIncidents
} from '../src/services/surveillanceService.js';

describe('Jan_Sahayak Surveillance & Evidence Pipeline Services', () => {
  it('should generate official municipal report with non-judgmental language and legal citation', () => {
    const mockIncident = {
      id: 'INC-2026-PUNE-0042',
      violation: 'Restricted Area Entry (Unauthorized Heavy Vehicle)',
      location: 'Wagholi Restricted Zone (CAM-WAG-04)',
      camera: 'CAM-WAG-04',
      vehicleDetails: 'Heavy Dumper Truck (MH-12-Q-4029)',
      aiConfidence: 94
    };

    const report = generateOfficialMunicipalReport(mockIncident);
    assert.strictEqual(report.incidentId, 'INC-2026-PUNE-0042');
    assert.strictEqual(report.reportNumber, 'PMC-SURV-2026-0042');
    assert.strictEqual(report.confidenceScore, '94%');
    assert.ok(report.legalNoticeClause.includes('Motor Vehicles Act'));
    assert.strictEqual(
      report.disclaimer,
      'Potential restricted-area entry detected by AI surveillance. Awaiting official human verification.'
    );
  });

  it('should escalate surveillance incident and return official reference REF-2026-0042', async () => {
    const authority = '👮 Police Station (Wagholi Traffic & Law Enforcement)';
    const notes = 'AI surveillance detected unauthorized heavy commercial vehicle breach during peak hours. Requesting on-ground patrol verification.';

    const result = await escalateSurveillanceIncident('INC-2026-PUNE-0042', authority, notes);
    
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.officialReference, 'REF-2026-0042');
    assert.strictEqual(result.status, 'Forwarded to Authority');
    assert.strictEqual(result.selectedAuthority, authority);
    assert.ok(result.timestamp);
  });

  it('should update incident workflow status across the 7-stage lifecycle', () => {
    const updated = updateIncidentStatus('INC-2026-PUNE-0042', 'Under Human Review', 'Assigned to duty officer');
    assert.ok(updated);
    assert.strictEqual(updated.status, 'Under Human Review');
  });
});
