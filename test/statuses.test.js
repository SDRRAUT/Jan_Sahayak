import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CANONICAL_STATUSES,
  normalizeStatus,
  isValidTransition,
  getRoleStatusLabel
} from '../server/constants/statuses.js';

test('Canonical Statuses - Normalization', () => {
  assert.equal(normalizeStatus('submitted'), CANONICAL_STATUSES.REPORTED);
  assert.equal(normalizeStatus('INGESTED'), CANONICAL_STATUSES.REPORTED);
  assert.equal(normalizeStatus('AI_ANALYSED'), CANONICAL_STATUSES.ANALYZING);
  assert.equal(normalizeStatus('CLUSTERED'), CANONICAL_STATUSES.CONNECTED);
  assert.equal(normalizeStatus('ASSIGNED'), CANONICAL_STATUSES.AUTHORITY_ASSIGNED);
  assert.equal(normalizeStatus('INVESTIGATING'), CANONICAL_STATUSES.INVESTIGATION);
  assert.equal(normalizeStatus('IN_PROGRESS'), CANONICAL_STATUSES.ACTION_IN_PROGRESS);
  assert.equal(normalizeStatus('ACTION_COMPLETED'), CANONICAL_STATUSES.ACTION_COMPLETED);
  assert.equal(normalizeStatus('RESOLVED'), CANONICAL_STATUSES.RESOLVED);
  assert.equal(normalizeStatus('DISPUTE_REOPENED'), CANONICAL_STATUSES.REOPENED);
});

test('Canonical Statuses - Valid Transitions', () => {
  // Reported -> Analyzing -> Authority Assigned -> Investigation -> Action -> Completed -> Verification -> Resolved
  assert.equal(isValidTransition('REPORTED', 'ANALYZING'), true);
  assert.equal(isValidTransition('ANALYZING', 'CONNECTED'), true);
  assert.equal(isValidTransition('CONNECTED', 'INCIDENT_CREATED'), true);
  assert.equal(isValidTransition('INCIDENT_CREATED', 'AUTHORITY_ASSIGNED'), true);
  assert.equal(isValidTransition('AUTHORITY_ASSIGNED', 'INVESTIGATION'), true);
  assert.equal(isValidTransition('INVESTIGATION', 'ACTION_IN_PROGRESS'), true);
  assert.equal(isValidTransition('ACTION_IN_PROGRESS', 'ACTION_COMPLETED'), true);
  assert.equal(isValidTransition('ACTION_COMPLETED', 'VERIFICATION_PENDING'), true);
  assert.equal(isValidTransition('VERIFICATION_PENDING', 'RESOLVED'), true);

  // Dispute Reopen
  assert.equal(isValidTransition('ACTION_COMPLETED', 'REOPENED'), true);
  assert.equal(isValidTransition('VERIFICATION_PENDING', 'REOPENED'), true);
  assert.equal(isValidTransition('REOPENED', 'INVESTIGATION'), true);

  // Self-transition
  assert.equal(isValidTransition('ACTION_IN_PROGRESS', 'ACTION_IN_PROGRESS'), true);
});

test('Canonical Statuses - Role-Specific Labels', () => {
  assert.equal(
    getRoleStatusLabel(CANONICAL_STATUSES.ACTION_IN_PROGRESS, 'citizen'),
    'Work in Progress on Site'
  );
  assert.equal(
    getRoleStatusLabel(CANONICAL_STATUSES.ACTION_IN_PROGRESS, 'officer'),
    'Field Action — In Progress'
  );
  assert.equal(
    getRoleStatusLabel(CANONICAL_STATUSES.ACTION_IN_PROGRESS, 'super_admin'),
    'Remediation In Progress'
  );

  assert.equal(
    getRoleStatusLabel(CANONICAL_STATUSES.ACTION_COMPLETED, 'citizen'),
    'Action Completed — Ready to Verify'
  );
  assert.equal(
    getRoleStatusLabel(CANONICAL_STATUSES.ACTION_COMPLETED, 'officer'),
    'Work Completed — Evidence Uploaded'
  );
});
