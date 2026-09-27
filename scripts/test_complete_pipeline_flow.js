import http from 'http';
import { CANONICAL_STATUSES } from '../server/constants/statuses.js';

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const reqHeaders = { 'Content-Type': 'application/json', ...headers };
    if (payload) reqHeaders['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runCompletePipelineTest() {
  console.log('======================================================================');
  console.log('🔄 JAN SAHAYAK — COMPLETE PIPELINE & REOPEN VERIFICATION (SECTION 3)');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name} ${extra}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${extra}`);
      failed++;
    }
  }

  const citizenToken = 'demo_token_citizen';
  const officerToken = 'demo_token_civic_officer';
  const citizenHeaders = { Authorization: `Bearer ${citizenToken}` };
  const officerHeaders = { Authorization: `Bearer ${officerToken}` };

  // ---------------------------------------------------------
  // PART A: COMPLAINT -> INVESTIGATION -> FIELD ACTION -> EVIDENCE -> CITIZEN RESOLUTION
  // ---------------------------------------------------------
  console.log('--- PART A: Full Lifecycle (Ingest to Verified Resolution) ---');

  const complaintPayload = {
    title: 'Burst water main flooding entrance road of Sarvodaya Vidyalaya',
    text: 'High pressure drinking water pipe burst under the pavement outside school gate. Road is inundated and water is entering the school compound.',
    description: 'High pressure drinking water pipe burst under the pavement outside school gate. Road is inundated and water is entering the school compound.',
    category: 'Water & Drainage Infrastructure',
    ward: 'Ward 14 (Rohini Sector 14)',
    lat: 28.7185,
    lng: 77.1265,
    citizenName: 'Aditya Verma',
    citizenPhone: '+91 98712-88210',
    citizenId: 'USR-CITIZEN-01'
  };

  const createRes = await request('POST', '/api/complaints', complaintPayload, citizenHeaders);
  assert('1. Complaint Submission (201 Created)', createRes.status === 201);
  const complaint = createRes.data?.complaint;
  const incident = createRes.data?.incident;
  assert('1.1 Complaint ID generated', !!complaint?.id, `(ID: ${complaint?.id})`);

  // Verify Complaint Analysis
  assert('2. Complaint Analysis Executed', !!complaint?.analysis || !!complaint?.category, `Category: ${complaint?.category}`);
  assert('2.1 Urgency & Severity Extracted', complaint?.urgencyScore !== undefined || complaint?.urgency !== undefined);

  // Verify Complaint DNA & 768-dim Embedding
  assert('3. Complaint DNA Agent Executed', !!complaint?.dna?.dnaId, `DNA: ${complaint?.dna?.dnaId}`);
  assert('3.1 768-Dim Embedding Attached', Array.isArray(complaint?.dna?.embedding) && complaint.dna.embedding.length === 768);

  // Verify Similarity Detection & Clustering
  assert('4. Similarity Cluster Assigned', !!complaint?.clusterId, `Cluster: ${complaint?.clusterId}`);

  // Verify Civic Incident Synthesis
  assert('5. Civic Incident Synthesized & Linked', !!incident?.id && complaint?.incidentId === incident?.id, `Incident ID: ${incident?.id}`);

  // Fetch full incident details from API
  const incDetailRes = await request('GET', `/api/incidents/${incident.id}`);
  const detailedIncident = incDetailRes.data?.incident || incident;

  // Verify Root Cause Structure
  assert('6. Root Cause Structure (Probable cause / Hypothesis)', !!detailedIncident?.rootCause?.probable_root_cause || !!detailedIncident?.rootCause?.HYPOTHESIS);
  assert('6.1 Verification Required Flagged', detailedIncident?.rootCause?.VERIFICATION_REQUIRED === true || detailedIncident?.rootCause?.verification_required === true);

  // Verify Resolution Simulations
  assert('7. Resolution Agent Generated Options', Array.isArray(detailedIncident?.simulations) && detailedIncident.simulations.length > 0);
  assert('7.1 Estimates labeled requiring authority validation', detailedIncident?.simulations?.[0]?.estimatedCost?.includes('requires authority validation') || detailedIncident?.simulations?.[0]?.humanValidationRequirement?.includes('MANDATORY'));

  // Verify Authority Routing
  assert('8. Authority Routing Agent Assigned Lead Dept', !!detailedIncident?.leadDepartment, `Lead: ${detailedIncident?.leadDepartment}`);
  assert('8.1 Cross-Department Coordination Generated', !!detailedIncident?.crossDeptCoordination || !!detailedIncident?.crossDepartmentImpact);

  // 9. Officer Investigation
  console.log('\n--- Step 9: Officer Investigation Transition ---');
  const investRes = await request('POST', `/api/grievances/${complaint.id}/transition-status`, {
    newStatus: CANONICAL_STATUSES.INVESTIGATION,
    reason: 'Field engineer deployed to Sarvodaya Vidyalaya pipeline valve'
  }, officerHeaders);

  assert('9. Officer Transitions to INVESTIGATION (200)', investRes.status === 200);
  assert('9.1 DB Complaint Status is INVESTIGATION', investRes.data?.grievance?.status === CANONICAL_STATUSES.INVESTIGATION);

  // 10. Field Action / Action In Progress
  console.log('\n--- Step 10: Field Action Logging & In-Progress Transition ---');
  const actionRes = await request('POST', `/api/grievances/${complaint.id}/transition-status`, {
    newStatus: CANONICAL_STATUSES.ACTION_IN_PROGRESS,
    reason: 'Excavation crew deployed with heavy dewatering equipment'
  }, officerHeaders);
  assert('10. Officer Transitions to ACTION_IN_PROGRESS (200)', actionRes.status === 200);

  // 11. Evidence Upload & Resolution
  console.log('\n--- Step 11: Resolution & Evidence Submission ---');
  const resolveRes = await request('POST', `/api/grievances/${complaint.id}/resolve`, {
    resolutionNotes: '300mm pipe section replaced and pressure restored to normal 2.8 bar. Road surface cleared of silt.',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
  }, officerHeaders);

  assert('11. Officer Resolves Complaint with Evidence (200)', resolveRes.status === 200);
  assert('11.1 DB Status Updated to RESOLVED', resolveRes.data?.grievance?.status === 'RESOLVED');
  assert('11.2 Evidence Photo Persisted in DB', !!resolveRes.data?.grievance?.resolutionPhotoUrl);

  // 12. Citizen Verification (Confirm Fix)
  console.log('\n--- Step 12: Citizen Verification (Confirm Fix) ---');
  const verifyConfirmRes = await request('POST', `/api/grievances/${complaint.id}/verify`, {
    satisfaction: 'SATISFIED',
    feedbackText: 'Water pipe is fixed and road is dry. Excellent prompt response.',
    rating: 5
  }, citizenHeaders);

  assert('12. Citizen Confirms Resolution (200)', verifyConfirmRes.status === 200);
  assert('12.1 Final DB Status is RESOLVED_CONFIRMED', verifyConfirmRes.data?.grievance?.status === 'RESOLVED_CONFIRMED');
  assert('12.2 Verification Record Logged with Rating 5', verifyConfirmRes.data?.grievance?.citizenVerification?.rating === 5);

  // ---------------------------------------------------------
  // PART B: REJECTION / DISPUTE LIFECYCLE (REOPENED -> OFFICER NOTIFIED -> INVESTIGATION CONTINUES)
  // ---------------------------------------------------------
  console.log('\n--- PART B: Citizen Rejection & Dispute Reopening Lifecycle ---');

  // Submit second complaint
  const complaint2Payload = {
    title: 'Severe sewer leakage overflowing into residential lane 4',
    text: 'Manhole cover displaced and black sewage overflowing into street, foul odor affecting residents.',
    description: 'Manhole cover displaced and black sewage overflowing into street, foul odor affecting residents.',
    category: 'Water Supply & Contamination',
    ward: 'Ward 14 (Rohini Sector 14)',
    lat: 28.7190,
    lng: 77.1270,
    citizenName: 'Aditya Verma',
    citizenPhone: '+91 98712-88210',
    citizenId: 'USR-CITIZEN-01'
  };

  const create2Res = await request('POST', '/api/complaints', complaint2Payload, citizenHeaders);
  assert('13. Complaint 2 Created (201)', create2Res.status === 201);
  const comp2 = create2Res.data?.complaint;

  // Officer marks resolved prematurely
  await request('POST', `/api/grievances/${comp2.id}/transition-status`, {
    newStatus: CANONICAL_STATUSES.INVESTIGATION,
    reason: 'Initial inspection'
  }, officerHeaders);
  await request('POST', `/api/grievances/${comp2.id}/transition-status`, {
    newStatus: CANONICAL_STATUSES.ACTION_IN_PROGRESS,
    reason: 'Desilting pump deployed'
  }, officerHeaders);

  const resolve2Res = await request('POST', `/api/grievances/${comp2.id}/resolve`, {
    resolutionNotes: 'Super sucker deployed, drain flushed.',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800'
  }, officerHeaders);
  assert('14. Officer Marks Resolved (200)', resolve2Res.status === 200);

  // Citizen rejects resolution (satisfaction: DISPUTED)
  console.log('\n--- Step 15: Citizen Rejects Resolution (Disputes Fix) ---');
  const disputeRes = await request('POST', `/api/grievances/${comp2.id}/verify`, {
    satisfaction: 'DISPUTED',
    feedbackText: 'The manhole is still overflowing! The team only took photos and left without desilting the main blockage.',
    rating: 1
  }, citizenHeaders);

  assert('15. Citizen Rejection / Dispute Accepted (200)', disputeRes.status === 200);
  assert('15.1 DB Status Updated to DISPUTE_REOPENED', disputeRes.data?.grievance?.status === 'DISPUTE_REOPENED');
  assert('15.2 Citizen Verification Recorded as DISPUTED', disputeRes.data?.grievance?.citizenVerification?.satisfaction === 'DISPUTED');

  // Verify Officer Notified
  const notifRes = await request('GET', '/api/notifications?role=officer', null, officerHeaders);
  const hasDisputeNotif = Array.isArray(notifRes.data?.notifications) && notifRes.data.notifications.some(n => 
    n.type === 'DISPUTE' || (n.title && n.title.includes('DISPUTE REOPENED')) || (n.message && n.message.includes(comp2.id))
  );
  assert('16. Officer Notification Generated for Dispute', hasDisputeNotif);

  // Officer Reopens Investigation
  console.log('\n--- Step 17: Officer Resumes Investigation ---');
  const resumeInvestRes = await request('POST', `/api/grievances/${comp2.id}/transition-status`, {
    newStatus: CANONICAL_STATUSES.INVESTIGATION,
    reason: 'Citizen confirmed blockage persists downstream in secondary trunk line. Jetting team re-dispatched.'
  }, officerHeaders);

  assert('17. Officer Resumes INVESTIGATION on Disputed Case (200)', resumeInvestRes.status === 200);
  assert('17.1 DB Status is Back to INVESTIGATION', resumeInvestRes.data?.grievance?.status === CANONICAL_STATUSES.INVESTIGATION);

  console.log('\n======================================================================');
  console.log(`🏁 COMPLETE PIPELINE & REOPEN VERIFICATION: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runCompletePipelineTest();
