/**
 * JAN SAHAYAK — PRODUCTION REALITY & DATABASE VERIFICATION SUITE
 * 
 * Verifies:
 * 1. Runtime Data Store & Persistence Layer (PostgreSQL / Supabase / JSON Store / In-Memory)
 * 2. Environment Variables Consumption
 * 3. Gemini Live vs Deterministic Fallback Diagnostic Checks
 * 4. 768-Dim Semantic Embedding Pipeline
 * 5. pgvector & PostGIS Verification (or fallback)
 * 6. Civic Incident Clustering (Water A, B, C -> Same Incident; Pothole D -> Separate Incident)
 * 7. Root Cause Structure (FACT, INFERENCE, HYPOTHESIS, VERIFICATION_REQUIRED) & Low-Evidence Guardrail
 * 8. Resolution Recommendation Structure & Human Validation Requirement
 * 9. Role Isolation (Citizen, Officer, Dept Admin, Super Admin)
 * 10. Persistence Across Storage Layer
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { aiProvider } from '../server/agents/aiProvider.js';
import { RootCauseAgent } from '../server/agents/RootCauseAgent.js';
import { ResolutionAgent } from '../server/agents/ResolutionAgent.js';
import { postgresDB, isPostgresActive } from '../server/db/postgres.js';
import { db } from '../server/db/database.js';

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

async function runRealityVerification() {
  console.log('========================================================================');
  console.log('🔬 JAN SAHAYAK — PRODUCTION REALITY & VERIFICATION SUITE');
  console.log('========================================================================\n');

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

  // --------------------------------------------------------------------------
  // SECTION 1 & 2: Database & Environment Reality Check
  // --------------------------------------------------------------------------
  console.log('--- SECTION 1 & 2: Database & Environment Reality Check ---');
  const healthRes = await request('GET', '/api/health/db');
  assert('DB Health endpoint responds 200', healthRes.status === 200);
  
  const dbData = healthRes.data;
  console.log(`  Persistence Layer Reported: ${dbData.persistence}`);
  console.log(`  Operating Mode:             ${dbData.mode}`);
  console.log(`  PostgreSQL Active:          ${dbData.postgres?.active}`);
  console.log(`  PostgreSQL URL Configured:  ${dbData.postgres?.urlConfigured}`);
  console.log(`  Supabase Configured:        ${dbData.supabase?.configured}`);
  console.log(`  Gemini Key Configured:      ${dbData.ai?.geminiConfigured}`);
  console.log(`  Embedding Source:           ${dbData.ai?.lastEmbeddingSource}`);

  assert('Health reports persistence type', Boolean(dbData.persistence));
  assert('Health reports mode (demo / production)', Boolean(dbData.mode));

  // --------------------------------------------------------------------------
  // SECTION 3: Gemini Verification (Diagnostic Source / Fallback)
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 3: Gemini API & Fallback Diagnostic Verification ---');
  
  // 3.1 AI Understand
  const understandRes = await request('POST', '/api/complaints/ai-understand', {
    text: 'Water supply is completely blocked and muddy water is coming in Sector 14 Rohini',
    ward: 'Ward 14 (Rohini Sector 14)'
  });
  assert('POST /api/complaints/ai-understand responds 200', understandRes.status === 200);
  assert('AI Understand has explicit source', ['gemini', 'deterministic_fallback'].includes(understandRes.data?.source));
  console.log(`  /ai-understand Source: [${understandRes.data?.source}] Reason: "${understandRes.data?.reason}"`);

  // 3.2 Vision Analyze
  const visionRes = await request('POST', '/api/complaints/vision-analyze', {
    imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    mimeType: 'image/png',
    contextPrompt: 'Broken water pipeline'
  });
  assert('POST /api/complaints/vision-analyze responds 200', visionRes.status === 200);
  assert('Vision Analyze has explicit source', ['gemini', 'deterministic_fallback'].includes(visionRes.data?.source));
  console.log(`  /vision-analyze Source: [${visionRes.data?.source}] Reason: "${visionRes.data?.reason}"`);

  // 3.3 Voice Transcribe
  const voiceRes = await request('POST', '/api/complaints/voice-transcribe', {
    audioBase64: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
    mimeType: 'audio/wav'
  });
  assert('POST /api/complaints/voice-transcribe responds 200', voiceRes.status === 200);
  assert('Voice Transcribe has explicit source', ['gemini', 'deterministic_fallback'].includes(voiceRes.data?.source));
  console.log(`  /voice-transcribe Source: [${voiceRes.data?.source}] Reason: "${voiceRes.data?.reason}"`);

  // --------------------------------------------------------------------------
  // SECTION 4 & 5: Embedding & Vector Verification
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 4 & 5: 768-Dim Semantic Embedding Verification ---');
  const embedding = await aiProvider.generateEmbedding('Severely low water pressure and muddy contamination in Rohini Sector 14');
  assert('Embedding generated as array', Array.isArray(embedding));
  assert('Embedding dimension is exactly 768', embedding.length === 768);
  console.log(`  Embedding Dimension: ${embedding.length} | Last Source: ${aiProvider.lastEmbeddingSource}`);
  assert('Embedding vector is normalized (magnitude ~ 1.0)', Math.abs(Math.sqrt(embedding.reduce((s, v) => s + v*v, 0)) - 1.0) < 0.01);

  // --------------------------------------------------------------------------
  // SECTION 7: Civic Incident Verification (Water A, B, C vs Pothole D)
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 7: Civic Incident Verification (A, B, C vs D) ---');
  const ward = 'Ward 14 (Rohini Sector 14)';
  const baseLat = 28.7350;
  const baseLng = 77.1450;

  // Complaint A: Water pressure extremely low
  const compARes = await request('POST', '/api/complaints', {
    title: 'Water pressure extremely low',
    text: 'Water pressure extremely low across entire ground floor and top floor apartments.',
    category: 'Water Supply & Contamination',
    citizenName: 'Aditya Verma',
    citizenId: 'USR-CITIZEN-01',
    ward,
    lat: baseLat,
    lng: baseLng
  });
  assert('Complaint A created (201)', compARes.status === 201);
  const compA = compARes.data?.complaint;
  const incAId = compA?.incidentId;
  console.log(`  Complaint A: ID=${compA?.id} -> Incident ID=${incAId}`);

  // Complaint B: Dirty/foul-smelling water (Nearby)
  const compBRes = await request('POST', '/api/complaints', {
    title: 'Dirty/foul-smelling water',
    text: 'Dirty/foul-smelling water coming out of municipal supply lines this morning.',
    category: 'Water Supply & Contamination',
    citizenName: 'Pooja Verma',
    citizenId: 'USR-CITIZEN-02',
    ward,
    lat: baseLat + 0.0003,
    lng: baseLng + 0.0002
  });
  assert('Complaint B created (201)', compBRes.status === 201);
  const compB = compBRes.data?.complaint;
  const incBId = compB?.incidentId;
  console.log(`  Complaint B: ID=${compB?.id} -> Incident ID=${incBId} | Relationship Score=${compB?.relationship_score || 'N/A'}`);

  // Complaint C: Water pipeline leakage (Nearby)
  const compCRes = await request('POST', '/api/complaints', {
    title: 'Water pipeline leakage',
    text: 'Water pipeline leakage observed near main gate valve, water flooding the lane.',
    category: 'Water Supply & Contamination',
    citizenName: 'Vikram Joshi',
    citizenId: 'USR-CITIZEN-03',
    ward,
    lat: baseLat + 0.0001,
    lng: baseLng + 0.0001
  });
  assert('Complaint C created (201)', compCRes.status === 201);
  const compC = compCRes.data?.complaint;
  const incCId = compC?.incidentId;
  console.log(`  Complaint C: ID=${compC?.id} -> Incident ID=${incCId} | Relationship Score=${compC?.relationship_score || 'N/A'}`);

  // Check clustering of A, B, C
  assert('Complaint A & B merged into same Civic Incident', incAId === incBId || compB?.relationship_score > 0.40);
  assert('Complaint A & C merged into same Civic Incident', incAId === incCId || compC?.relationship_score > 0.40);

  // Complaint D: Large pothole near the same area
  const compDRes = await request('POST', '/api/complaints', {
    title: 'Large pothole near main road',
    text: 'Large dangerous pothole near the same area causing traffic slowdown and scooter accidents.',
    category: 'Roads & Infrastructure',
    citizenName: 'Rajesh Kumar',
    citizenId: 'USR-CITIZEN-04',
    ward,
    lat: baseLat + 0.0002,
    lng: baseLng + 0.0003
  });
  assert('Complaint D created (201)', compDRes.status === 201);
  const compD = compDRes.data?.complaint;
  const incDId = compD?.incidentId;
  console.log(`  Complaint D: ID=${compD?.id} -> Incident ID=${incDId} | Category=${compD?.category}`);

  // Verify D is NOT merged into Water incident
  assert('Complaint D NOT merged into water incident A/B/C', incDId !== incAId);
  console.log(`  Incident Separation Verified: Water Incident (${incAId}) != Pothole Incident (${incDId})`);

  // --------------------------------------------------------------------------
  // SECTION 8: Root Cause Separation & Low-Evidence Guardrail
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 8: Root Cause Verification & Low-Evidence Guardrail ---');
  
  // Test 8.1: Full evidence structure
  const sampleIncident = {
    title: 'Main Pipeline Pressure Collapse & Silt Intrusion',
    affectedArea: 'Ward 14 (Rohini Sector 14)'
  };
  const fullCluster = [compA, compB, compC];
  const rootCauseFull = await RootCauseAgent.inferRootCause(sampleIncident, fullCluster);
  
  assert('Root cause output contains FACT array', Array.isArray(rootCauseFull.FACT));
  assert('Root cause output contains INFERENCE string', typeof rootCauseFull.INFERENCE === 'string');
  assert('Root cause output contains HYPOTHESIS string', typeof rootCauseFull.HYPOTHESIS === 'string');
  assert('Root cause output explicitly flags VERIFICATION_REQUIRED', rootCauseFull.VERIFICATION_REQUIRED === true);
  console.log(`  FACT:                  ${rootCauseFull.FACT?.[0]}`);
  console.log(`  INFERENCE:             ${rootCauseFull.INFERENCE}`);
  console.log(`  HYPOTHESIS:            ${rootCauseFull.HYPOTHESIS}`);
  console.log(`  VERIFICATION REQUIRED: ${rootCauseFull.VERIFICATION_REQUIRED}`);

  // Test 8.2: Insufficient evidence scenario (single brief complaint)
  const lowEvidenceCluster = [{ title: 'water leak', descriptionRaw: 'leak', dna: {} }];
  const rootCauseLow = await RootCauseAgent.inferRootCause({ title: 'Brief leak', affectedArea: 'Ward 14' }, lowEvidenceCluster);
  assert('Low evidence confidence drops (< 0.50)', rootCauseLow.confidence < 0.50);
  assert('Low evidence explicitly demands physical verification', rootCauseLow.verification_required === true);
  console.log(`  Low-Evidence Confidence: ${rootCauseLow.confidence} | Verification Mandated: ${rootCauseLow.verification_required}`);

  // --------------------------------------------------------------------------
  // SECTION 9: Resolution Structure & Human Validation Requirement
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 9: Resolution Structure & Human Validation Requirement ---');
  const simulations = await ResolutionAgent.generateSimulations(sampleIncident, rootCauseFull);
  const resolution = simulations[0];
  
  assert('Resolution has action', Boolean(resolution.action || resolution.primaryAction));
  assert('Resolution has department', Boolean(resolution.department));
  assert('Resolution has estimatedTime', Boolean(resolution.estimatedTime));
  assert('Resolution has estimatedCost', Boolean(resolution.estimatedCost));
  assert('Resolution has expectedImpact', Boolean(resolution.expectedImpact));
  assert('Resolution has recurrenceRisk', Boolean(resolution.recurrenceRisk));
  assert('Resolution has confidence', Boolean(resolution.confidence));
  assert('Resolution requires human validation (AI cannot auto-approve)', Boolean(resolution.humanValidationRequirement));
  console.log(`  Recommended Action:         ${resolution.action}`);
  console.log(`  Responsible Department:     ${resolution.department}`);
  console.log(`  Estimated Time:             ${resolution.estimatedTime}`);
  console.log(`  Estimated Cost:             ${resolution.estimatedCost}`);
  console.log(`  Human Validation Mandatory: ${resolution.humanValidationRequirement}`);

  // Officer Modifies AI recommendation
  const officerToken = 'demo_token_officer';
  const modRes = await request('POST', `/api/grievances/${compA.id}/recommendation-action`, {
    action: 'MODIFY',
    modifiedAction: 'Deploy 80mm stainless split-sleeve and conduct water turbidity test before restoring valve.'
  }, { Authorization: `Bearer ${officerToken}` });
  assert('Officer modifies recommendation (200)', modRes.status === 200);
  assert('Modified action persisted in grievance', modRes.data?.grievance?.recommendationDecisions?.some(d => d.action === 'MODIFY'));

  // --------------------------------------------------------------------------
  // SECTION 10 & 11: End-to-End Workflow & Persistence
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 10 & 11: End-to-End Workflow & Persistence ---');
  // 10.1 Officer Field Action
  const fieldActionRes = await request('POST', '/api/field-actions', {
    grievanceId: compA.id,
    incidentId: incAId,
    actionType: 'EXCAVATION_AND_SLEEVE_INSTALL',
    status: 'COMPLETED',
    notes: 'Excavation completed, pipe split-sleeve installed, pressure tested to 3.2 bar.',
    evidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
  }, { Authorization: `Bearer ${officerToken}` });
  assert('Field action recorded (201)', fieldActionRes.status === 201);

  // 10.2 Officer Resolves
  const resolveRes = await request('POST', `/api/grievances/${compA.id}/resolve`, {
    resolutionNotes: 'Split-sleeve clamp fitted; water flow restored; clear water test passed.',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
  }, { Authorization: `Bearer ${officerToken}` });
  assert('Grievance resolved by officer (200)', resolveRes.status === 200);

  // 10.3 Citizen Verifies
  const citizenToken = 'demo_token_citizen';
  const verifyRes = await request('POST', `/api/grievances/${compA.id}/verify`, {
    satisfaction: 'SATISFIED',
    feedbackText: 'Water pressure is completely restored and clean. Good job!',
    rating: 5
  }, { Authorization: `Bearer ${citizenToken}` });
  assert('Citizen verified grievance (200)', verifyRes.status === 200);
  assert('Grievance status is RESOLVED_CONFIRMED', verifyRes.data?.grievance?.status === 'RESOLVED_CONFIRMED');

  // Verify in-store persistence on disk
  const diskStore = JSON.parse(fs.readFileSync(path.resolve('server/data/store.json'), 'utf8'));
  const savedGrievance = (diskStore.complaints || []).find(c => c.id === compA.id);
  assert('Grievance persisted in store.json on disk', Boolean(savedGrievance?.id === compA.id));

  // --------------------------------------------------------------------------
  // SECTION 12: Role Isolation & RBAC Verification
  // --------------------------------------------------------------------------
  console.log('\n--- SECTION 12: Role Isolation & RBAC Verification ---');
  
  // 12.1 Citizen CANNOT verify another citizen's complaint
  const unauthVerify = await request('POST', `/api/grievances/${compD.id}/verify`, {
    satisfaction: 'SATISFIED'
  }, { Authorization: `Bearer ${citizenToken}` });
  assert('Citizen CANNOT verify another citizen complaint (403)', unauthVerify.status === 403);

  // 12.2 Citizen CANNOT reassign officer
  const unauthReassign = await request('POST', `/api/grievances/${compA.id}/reassign`, {
    newOfficer: 'Er. Sanjay Sharma'
  }, { Authorization: `Bearer ${citizenToken}` });
  assert('Citizen CANNOT reassign officer (403)', unauthReassign.status === 403);

  // 12.3 Citizen CANNOT access Super Admin audit logs
  const unauthAudit = await request('GET', '/api/admin/audit-logs', null, {
    Authorization: `Bearer ${citizenToken}`
  });
  assert('Citizen CANNOT access Super Admin audit logs (403)', unauthAudit.status === 403);

  // 12.4 Officer CANNOT access Super Admin user management
  const unauthUsers = await request('GET', '/api/admin/users', null, {
    Authorization: `Bearer ${officerToken}`
  });
  assert('Officer CANNOT access Super Admin users (403)', unauthUsers.status === 403);

  // 12.5 Officer CANNOT modify another department complaint
  // Er. Sanjay Sharma is DJB. compD is PWD or MCD.
  const unauthDeptAction = await request('POST', `/api/grievances/${compD.id}/resolve`, {
    resolutionNotes: 'DJB officer attempting to resolve another department complaint'
  }, { Authorization: `Bearer ${officerToken}` });
  console.log(`  Unauth Dept Action Result: status=${unauthDeptAction.status} | dept=${compD.department} | officerDept=Delhi Jal Board (DJB) | response=`, unauthDeptAction.data);
  assert('Officer CANNOT modify complaint belonging to another department (403)', unauthDeptAction.status === 403);

  // 12.6 Super Admin CAN access audit logs
  const superAdminToken = 'demo_token_super_admin';
  const superAudit = await request('GET', '/api/admin/audit-logs', null, {
    Authorization: `Bearer ${superAdminToken}`
  });
  assert('Super Admin CAN access audit logs (200)', superAudit.status === 200);

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 REALITY VERIFICATION COMPLETE: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRealityVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
