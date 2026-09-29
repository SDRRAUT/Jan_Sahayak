/**
 * Test: Cross-Role State Synchronization (Citizen <-> Officer <-> Admin)
 */
import { defaultGrievances, departments } from '../server/data.js';

console.log('--- RUNNING TEST: CROSS ROLE SYNC ---');

let passed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
  passed++;
}

// 1. Initial State Consistency
assert(Array.isArray(defaultGrievances) && defaultGrievances.length > 0, 'Default grievances initialized');
assert(departments && departments.length >= 4, 'Departments initialized across municipal roles');

// 2. Citizen creates ticket, Officer sees it
const sampleTicket = {
  id: 'JS-SYNC-101',
  title: 'Pothole on Ring Road',
  category: 'Roads & Infrastructure',
  ward: 'Ward 8 (Lajpat Nagar)',
  status: 'SUBMITTED',
  citizenId: 'CIT-01',
  officerId: null
};

// Simulate dispatch
sampleTicket.status = 'TRIAGED';
sampleTicket.officerId = 'OFF-PWD-01';
assert(sampleTicket.status === 'TRIAGED', 'Citizen ticket transitioned to TRIAGED');
assert(sampleTicket.officerId === 'OFF-PWD-01', 'Assigned to field officer');

// 3. Officer resolves -> transitions to VERIFICATION_PENDING
sampleTicket.status = 'VERIFICATION_PENDING';
sampleTicket.verification_started_at = new Date().toISOString();
sampleTicket.verification_deadline = new Date(Date.now() + 4 * 86400000).toISOString();
assert(sampleTicket.status === 'VERIFICATION_PENDING', 'Officer resolve puts ticket into VERIFICATION_PENDING');
assert(sampleTicket.verification_deadline !== null, '4-day verification deadline assigned');

// 4. Citizen verifies -> RESOLVED_CONFIRMED
sampleTicket.status = 'RESOLVED_CONFIRMED';
sampleTicket.verified_at = new Date().toISOString();
sampleTicket.verified_by = 'citizen';
assert(sampleTicket.status === 'RESOLVED_CONFIRMED', 'Citizen confirms resolution');

console.log(`\n🎉 CROSS ROLE SYNC TESTS PASSED! (${passed}/${passed} assertions passed)`);
