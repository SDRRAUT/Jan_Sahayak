/**
 * Test: RBAC Authentication & Authorization Isolation
 */
console.log('--- RUNNING TEST: AUTH & RBAC SECURITY ---');

let passed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
  passed++;
}

// User accounts
const citizenUser = { id: 'CIT-01', role: 'citizen', name: 'Aditya' };
const officerUser = { id: 'OFF-01', role: 'officer', department: 'Delhi Jal Board' };
const deptAdmin = { id: 'ADM-01', role: 'dept_admin', department: 'Delhi Jal Board' };
const superAdmin = { id: 'SUP-01', role: 'super_admin' };

function canResolveGrievance(user, grievance) {
  if (user.role === 'super_admin') return true;
  if (user.role === 'dept_admin' && user.department === grievance.department) return true;
  if (user.role === 'officer' && user.department === grievance.department) return true;
  return false;
}

function canVerifyGrievance(user, grievance) {
  // Only the filing citizen or super_admin can confirm/dispute
  if (user.role === 'super_admin') return true;
  if (user.role === 'citizen' && user.id === grievance.citizenId) return true;
  return false;
}

const sampleTicket = {
  id: 'JS-SEC-01',
  citizenId: 'CIT-01',
  department: 'Delhi Jal Board',
  status: 'VERIFICATION_PENDING'
};

// 1. Citizen cannot resolve an unverified ticket as an officer
assert(!canResolveGrievance(citizenUser, sampleTicket), 'Citizen blocked from performing officer resolution');

// 2. Different citizen cannot verify another citizen\'s ticket
const otherCitizen = { id: 'CIT-99', role: 'citizen', name: 'Other' };
assert(!canVerifyGrievance(otherCitizen, sampleTicket), 'Unauthorized citizen blocked from verifying another citizen ticket');

// 3. Authorized citizen can verify their own ticket
assert(canVerifyGrievance(citizenUser, sampleTicket), 'Original citizen authorized to verify their ticket');

// 4. Officer in Delhi Jal Board can resolve
assert(canResolveGrievance(officerUser, sampleTicket), 'Department officer authorized to resolve department ticket');

// 5. Officer from PWD cannot resolve DJB ticket
const pwdOfficer = { id: 'OFF-PWD-01', role: 'officer', department: 'Public Works Department' };
assert(!canResolveGrievance(pwdOfficer, sampleTicket), 'Cross-department officer blocked from resolving DJB ticket');

console.log(`\n🎉 RBAC SECURITY TESTS PASSED! (${passed}/${passed} assertions passed)`);
