/**
 * JAN_SAHAYAK — FULL CROSS-ROLE END-TO-END VALIDATION SUITE
 * Validates the complete lifecycle across Citizen, Civic Officer, and Super Admin.
 */

import http from 'http';
import { postgresDB } from '../server/db/postgres.js';
import { CANONICAL_STATUSES } from '../server/constants/statuses.js';

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

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

async function runValidation() {
  console.log('======================================================================');
  console.log('🚀 JAN_SAHAYAK: FULL SYSTEM CROSS-ROLE END-TO-END VALIDATION');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function assertCheck(name, condition, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name} ${extra}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${extra}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // TEST 1: System Health & Database Connection
    // ------------------------------------------------------------------------
    console.log('--- TEST 1: Database & System Health ---');
    const health = await request('GET', '/api/health/db');
    assertCheck('API Health check responds 200', health.status === 200);
    assertCheck('Supabase PostgreSQL is active', health.data?.postgres?.active === true);

    // ------------------------------------------------------------------------
    // TEST 2: Citizen Ingestion & AI Pipeline (Test Cases 1 & 2)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: Citizen Report & AI Pipeline Execution ---');
    const uniqueWard = `Ward 14 (Rohini Sector 14)`;
    const complaintPayload = {
      text: 'Heavy contaminated water overflow near Mother Dairy booth sector 14. Potholes also flooded.',
      title: 'Water pipe leak & severe overflow',
      category: 'Water Supply & Contamination',
      citizenName: 'Aditya Verma',
      citizenId: 'USR-CITIZEN-01',
      ward: uniqueWard,
      lat: 28.7189,
      lng: 77.1265
    };

    const submitRes = await request('POST', '/api/complaints', complaintPayload);
    assertCheck('Complaint submission responds 201', submitRes.status === 201);
    const complaint = submitRes.data?.complaint;
    const incident = submitRes.data?.incident;
    assertCheck('Complaint entity created with ID', Boolean(complaint?.id));
    assertCheck('AI Complaint DNA generated', Boolean(complaint?.dna?.problem || complaint?.analysis));
    assertCheck('Civic Incident synthesized', Boolean(incident?.id));
    assertCheck('Complaint linked to Incident ID', complaint?.incidentId === incident?.id);

    // Verify DB persistence
    const dbComplaint = await postgresDB.getGrievanceById(complaint.id);
    assertCheck('Complaint persisted in Supabase grievances table', Boolean(dbComplaint?.id === complaint.id));

    // ------------------------------------------------------------------------
    // TEST 3: Citizen <-> Officer Shared Entity Visibility (Test Case 3)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: Officer Visibility & Investigation ---');
    const officerToken = 'demo_token_civic_officer';
    const officerViewRes = await request('GET', `/api/grievances/${complaint.id}`, null, {
      Authorization: `Bearer ${officerToken}`
    });
    assertCheck('Officer fetches same complaint record', officerViewRes.status === 200);
    assertCheck('Officer views same location coordinates', 
      Math.abs(Number(officerViewRes.data?.grievance?.location?.lat) - 28.7189) < 0.01);

    // Officer transitions to INVESTIGATION
    const investRes = await request('POST', `/api/grievances/${complaint.id}/transition-status`, {
      newStatus: CANONICAL_STATUSES.INVESTIGATION,
      reason: 'Field engineer deployed to Mother Dairy pipeline valve'
    }, {
      Authorization: `Bearer ${officerToken}`
    });
    assertCheck('Officer transitions to INVESTIGATION', investRes.status === 200);
    assertCheck('Canonical status updated to INVESTIGATION', investRes.data?.grievance?.status === CANONICAL_STATUSES.INVESTIGATION);

    // ------------------------------------------------------------------------
    // TEST 4: Officer Action & Completion Evidence (Test Case 4)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: Officer Action & Completion Evidence ---');
    // Officer starts action
    await request('POST', `/api/grievances/${complaint.id}/transition-status`, {
      newStatus: CANONICAL_STATUSES.ACTION_IN_PROGRESS,
      reason: 'Pipe clamp squad active on excavation pit'
    }, {
      Authorization: `Bearer ${officerToken}`
    });

    // Officer resolves & uploads completion photo
    const resolveRes = await request('POST', `/api/grievances/${complaint.id}/resolve`, {
      resolutionNotes: 'Fractured 100mm joint isolated; emergency stainless split-sleeve installed; pressure restored.',
      resolutionPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
    }, {
      Authorization: `Bearer ${officerToken}`
    });
    assertCheck('Officer resolves grievance with completion photo', resolveRes.status === 200);
    assertCheck('Resolution photo persisted', Boolean(resolveRes.data?.grievance?.resolutionPhotoUrl));

    // ------------------------------------------------------------------------
    // TEST 5: Citizen Closed-Loop Verification & Reopen (Test Case 5)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 5: Citizen Verification Cycle (Reopen -> Fixed) ---');
    const citizenToken = 'demo_token_citizen';

    // Step A: Citizen says "Still a problem"
    const disputeRes = await request('POST', `/api/grievances/${complaint.id}/verify`, {
      satisfaction: 'DISPUTED',
      feedbackText: 'Water pressure still low in morning supply. Odor persists.',
      rating: 2
    }, {
      Authorization: `Bearer ${citizenToken}`
    });
    assertCheck('Citizen dispute marks status DISPUTE_REOPENED', disputeRes.data?.grievance?.status === 'DISPUTE_REOPENED');

    // Step B: Officer resolves again
    await request('POST', `/api/grievances/${complaint.id}/resolve`, {
      resolutionNotes: 'Secondary relief valve flushed and calibrated; line flushed with sodium hypochlorite.',
      resolutionPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
    }, {
      Authorization: `Bearer ${officerToken}`
    });

    // Step C: Citizen confirms "Yes, fixed"
    const confirmRes = await request('POST', `/api/grievances/${complaint.id}/verify`, {
      satisfaction: 'SATISFIED',
      feedbackText: 'Clean water supply restored with full pressure. Thank you!',
      rating: 5
    }, {
      Authorization: `Bearer ${citizenToken}`
    });
    assertCheck('Citizen verification confirms fix', confirmRes.status === 200);
    assertCheck('Final status is RESOLVED_CONFIRMED', confirmRes.data?.grievance?.status === 'RESOLVED_CONFIRMED');

    // ------------------------------------------------------------------------
    // TEST 6: Authoritative Shared Timeline
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 6: Authoritative Shared Timeline Verification ---');
    const timelineRes = await request('GET', `/api/grievances/${complaint.id}/timeline`);
    assertCheck('Authoritative timeline endpoint responds 200', timelineRes.status === 200);
    const timeline = timelineRes.data?.timeline || [];
    assertCheck('Timeline contains chronological records', timeline.length >= 3);
    const hasVerificationStep = timeline.some(t => t.stage.toLowerCase().includes('verified') || t.type === 'VERIFICATION');
    assertCheck('Timeline includes citizen verification milestone', hasVerificationStep);

    // ------------------------------------------------------------------------
    // TEST 7: Super Admin Governance & Live DB Audit Trail
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 7: Super Admin Governance Visibility ---');
    const adminToken = 'demo_token_super_admin';
    const auditRes = await request('GET', '/api/admin/audit-logs', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assertCheck('Super Admin fetches audit logs', auditRes.status === 200);
    const logs = auditRes.data?.auditLogs || [];
    assertCheck('Audit log captures recent platform mutations', logs.length > 0);

    const analyticsRes = await request('GET', '/api/admin/analytics', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assertCheck('Super Admin fetches live DB analytics', analyticsRes.status === 200);
    assertCheck('Analytics metrics contain real grievance counts', typeof analyticsRes.data?.metrics?.totalGrievances === 'number');

    // ------------------------------------------------------------------------
    // Summary
    // ------------------------------------------------------------------------
    console.log('\n======================================================================');
    console.log(`🏁 VALIDATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('💥 Validation suite execution error:', err);
    process.exit(1);
  }
}

// Allow server a moment if run standalone
runValidation();
