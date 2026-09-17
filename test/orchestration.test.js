import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CANONICAL_EVENTS, ALL_CANONICAL_EVENTS } from '../server/constants/events.js';
import { orchestrator } from '../server/agents/orchestrator.js';

test('Canonical Events - Completeness', () => {
  assert.equal(ALL_CANONICAL_EVENTS.length, 23);
  assert.ok(ALL_CANONICAL_EVENTS.includes('complaint_created'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('complaint_analyzed'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('incident_created'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('authority_assigned'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('investigation_started'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('field_action_started'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('field_action_completed'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('verification_requested'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('verification_submitted'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('incident_resolved'));
  assert.ok(ALL_CANONICAL_EVENTS.includes('incident_reopened'));
});

test('Orchestrator - Ingests and processes complaint into Incident entity', async () => {
  const mockComplaint = {
    id: `TEST-${Date.now()}`,
    title: 'Water pipe leak near primary school',
    descriptionRaw: 'Pani ka pipe toot gaya hai school ke paas, sadak pe paani bhar gaya.',
    category: 'Water Supply & Contamination',
    department: 'Delhi Jal Board (DJB)',
    location: {
      ward: 'Ward 14 (Rohini Sector 14)',
      area: 'School Corridor',
      city: 'New Delhi',
      pincode: '110085',
      lat: 28.7189,
      lng: 77.1265
    },
    citizenName: 'Test Citizen',
    citizenId: 'USR-TEST-01'
  };

  const result = await orchestrator.processComplaint(mockComplaint);
  assert.equal(result.success, true);
  assert.ok(result.complaint.id);
  assert.ok(result.cluster);
  assert.ok(result.incident);
  assert.equal(result.complaint.incidentId, result.incident.id);
  assert.ok(result.incident.leadDepartment);
});

test.after(() => {
  setTimeout(() => process.exit(0), 500);
});
