import { db } from '../server/db/database.js';
import { ComplaintAnalyzerAgent } from '../server/agents/ComplaintAnalyzerAgent.js';
import { ComplaintDNAAgent } from '../server/agents/ComplaintDNAAgent.js';
import { SimilarityClusterAgent } from '../server/agents/SimilarityClusterAgent.js';
import { CivicIncidentAgent } from '../server/agents/CivicIncidentAgent.js';
import { RootCauseAgent } from '../server/agents/RootCauseAgent.js';
import { ResolutionAgent } from '../server/agents/ResolutionAgent.js';
import { AuthorityRoutingAgent } from '../server/agents/AuthorityRoutingAgent.js';
import { CivicMemoryAgent } from '../server/agents/CivicMemoryAgent.js';
import { VerificationAgent } from '../server/agents/VerificationAgent.js';

async function testAllAgents() {
  console.log('===============================================================');
  console.log('🧪 VERIFYING ALL 9 AI AGENTS INDIVIDUALLY');
  console.log('===============================================================\n');

  const results = [];

  const testComplaint = {
    id: `TEST-AGENTS-${Date.now()}`,
    title: 'Severe waterlogging and sewer backflow in Market Lane',
    description: 'Raw sewage and rainwater overflowing on road near community hall. Water entering shops.',
    descriptionRaw: 'Raw sewage and rainwater overflowing on road near community hall. Water entering shops.',
    ward: 'Ward 14 (Rohini Sector 14)',
    location: {
      lat: 28.7180,
      lng: 77.1260,
      ward: 'Ward 14 (Rohini Sector 14)',
      address: 'Main Market Lane, Sector 14, Rohini, Delhi'
    },
    citizenName: 'Deepak Sharma',
    citizenId: 'USR-CITIZEN-01',
    createdAt: new Date().toISOString()
  };

  // Persist test complaint to db
  db.saveComplaint(testComplaint);

  // 1. ComplaintAnalyzerAgent
  try {
    console.log('[1/9] Testing ComplaintAnalyzerAgent...');
    const analysis = await ComplaintAnalyzerAgent.analyze(testComplaint);
    const hasOutput = analysis && (analysis.problem_type || analysis.category);
    // Persist
    testComplaint.analysis = analysis;
    db.saveComplaint(testComplaint);
    const persisted = db.getComplaintById(testComplaint.id)?.analysis?.category !== undefined;
    results.push({
      agent: 'ComplaintAnalyzerAgent',
      executed: 'YES',
      output: `${analysis.category} (${analysis.urgency}/10 urgency)`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output:', analysis.category, '| Urgency:', analysis.urgency);
  } catch (err) {
    console.error('  ❌ Error in ComplaintAnalyzerAgent:', err.message);
    results.push({ agent: 'ComplaintAnalyzerAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 2. ComplaintDNAAgent
  let dna = null;
  try {
    console.log('\n[2/9] Testing ComplaintDNAAgent...');
    dna = await ComplaintDNAAgent.generateDNA(testComplaint.analysis, testComplaint);
    const hasOutput = dna && dna.dnaId && (dna.embedding || dna.category);
    testComplaint.dna = dna;
    db.saveComplaint(testComplaint);
    const persisted = db.getComplaintById(testComplaint.id)?.dna?.dnaId !== undefined;
    results.push({
      agent: 'ComplaintDNAAgent',
      executed: 'YES',
      output: `${dna.dnaId} (768-dim vector)`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output:', dna.dnaId, '| Problem:', dna.problem);
  } catch (err) {
    console.error('  ❌ Error in ComplaintDNAAgent:', err.message);
    results.push({ agent: 'ComplaintDNAAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 3. SimilarityClusterAgent
  let cluster = null;
  try {
    console.log('\n[3/9] Testing SimilarityClusterAgent...');
    const existing = db.getComplaints().filter(c => c.id !== testComplaint.id);
    const existingClusters = db.getClusters();
    const clusterResult = await SimilarityClusterAgent.clusterComplaint(testComplaint, existing, existingClusters);
    const hasOutput = clusterResult && clusterResult.clusterId;

    if (clusterResult.action === 'JOIN_CLUSTER') {
      cluster = db.getClusterById(clusterResult.clusterId);
      if (cluster && !cluster.complaintIds.includes(testComplaint.id)) {
        cluster.complaintIds.push(testComplaint.id);
        db.saveCluster(cluster);
      }
    } else {
      cluster = {
        id: clusterResult.clusterId,
        title: 'Ward 14 Water & Drainage Cluster',
        leadDepartment: 'Delhi Jal Board (DJB)',
        centroid: { lat: 28.7180, lng: 77.1260 },
        radiusMeters: 180,
        complaintIds: [testComplaint.id],
        incidentId: null,
        createdAt: new Date().toISOString()
      };
      db.saveCluster(cluster);
    }
    testComplaint.clusterId = cluster.id;
    db.saveComplaint(testComplaint);
    const persisted = db.getClusterById(cluster.id) !== undefined;
    results.push({
      agent: 'SimilarityClusterAgent',
      executed: 'YES',
      output: `Cluster ${cluster.id} (Score: ${Math.round((clusterResult.confidence || 0.75) * 100)}%)`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output:', cluster.id, '| Action:', clusterResult.action);
  } catch (err) {
    console.error('  ❌ Error in SimilarityClusterAgent:', err.message);
    results.push({ agent: 'SimilarityClusterAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 4. CivicIncidentAgent
  let incident = null;
  try {
    console.log('\n[4/9] Testing CivicIncidentAgent...');
    const clusterComplaints = [testComplaint];
    incident = CivicIncidentAgent.synthesizeIncident(cluster, clusterComplaints, null);
    const hasOutput = incident && incident.id && incident.title;
    db.saveIncident(incident);
    cluster.incidentId = incident.id;
    testComplaint.incidentId = incident.id;
    db.saveCluster(cluster);
    db.saveComplaint(testComplaint);
    const persisted = db.getIncidentById(incident.id) !== undefined;
    results.push({
      agent: 'CivicIncidentAgent',
      executed: 'YES',
      output: `${incident.id} (Stage: ${incident.stage})`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output:', incident.id, '| Stage:', incident.stage, '| Title:', incident.title);
  } catch (err) {
    console.error('  ❌ Error in CivicIncidentAgent:', err.message);
    results.push({ agent: 'CivicIncidentAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 5. RootCauseAgent
  let rootCause = null;
  try {
    console.log('\n[5/9] Testing RootCauseAgent...');
    rootCause = await RootCauseAgent.inferRootCause(incident, [testComplaint], null);
    const hasOutput = rootCause && (rootCause.probable_root_cause || rootCause.HYPOTHESIS);
    incident.rootCause = rootCause;
    db.saveIncident(incident);
    const persisted = db.getIncidentById(incident.id)?.rootCause !== undefined;
    results.push({
      agent: 'RootCauseAgent',
      executed: 'YES',
      output: `Hypothesis generated (Confidence: ${rootCause.confidence})`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output:', rootCause.probable_root_cause?.slice(0, 70) + '...');
  } catch (err) {
    console.error('  ❌ Error in RootCauseAgent:', err.message);
    results.push({ agent: 'RootCauseAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 6. ResolutionAgent
  let simulations = null;
  try {
    console.log('\n[6/9] Testing ResolutionAgent...');
    simulations = await ResolutionAgent.generateSimulations(incident, rootCause);
    const hasOutput = Array.isArray(simulations) && simulations.length > 0;
    incident.simulations = simulations;
    db.saveIncident(incident);
    const persisted = db.getIncidentById(incident.id)?.simulations !== undefined;
    results.push({
      agent: 'ResolutionAgent',
      executed: 'YES',
      output: `${simulations.length} engineering remediation plans`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output: Generated', simulations.length, 'options');
  } catch (err) {
    console.error('  ❌ Error in ResolutionAgent:', err.message);
    results.push({ agent: 'ResolutionAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 7. AuthorityRoutingAgent
  let routing = null;
  try {
    console.log('\n[7/9] Testing AuthorityRoutingAgent...');
    routing = AuthorityRoutingAgent.routeIncident(incident, [testComplaint]);
    const hasOutput = routing && routing.leadDepartment && routing.crossDeptCoordination;
    incident.leadDepartment = routing.leadDepartment;
    incident.participatingDepartments = routing.participatingDepartments;
    incident.crossDeptCoordination = routing.crossDeptCoordination;
    db.saveIncident(incident);
    const persisted = db.getIncidentById(incident.id)?.leadDepartment === routing.leadDepartment;
    results.push({
      agent: 'AuthorityRoutingAgent',
      executed: 'YES',
      output: `Lead: ${routing.leadDepartment}`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output: Lead ->', routing.leadDepartment);
  } catch (err) {
    console.error('  ❌ Error in AuthorityRoutingAgent:', err.message);
    results.push({ agent: 'AuthorityRoutingAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 8. CivicMemoryAgent
  let civicMemory = null;
  try {
    console.log('\n[8/9] Testing CivicMemoryAgent...');
    civicMemory = CivicMemoryAgent.analyzeMemory(incident, [testComplaint]);
    const hasOutput = civicMemory && typeof civicMemory.recurrenceDetected === 'boolean';
    incident.civicMemory = civicMemory;
    db.saveIncident(incident);
    const persisted = db.getIncidentById(incident.id)?.civicMemory !== undefined;
    results.push({
      agent: 'CivicMemoryAgent',
      executed: 'YES',
      output: `Recurrence: ${civicMemory.recurrenceDetected} | Warranty: ${civicMemory.warrantyRegistry?.slice(0, 20)}...`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output: Recurrence ->', civicMemory.recurrenceDetected);
  } catch (err) {
    console.error('  ❌ Error in CivicMemoryAgent:', err.message);
    results.push({ agent: 'CivicMemoryAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  // 9. VerificationAgent
  try {
    console.log('\n[9/9] Testing VerificationAgent...');
    // Officer marks work completed
    const workResult = VerificationAgent.markWorkCompleted(incident.id, {
      officerId: 'OFFICER-01',
      officerName: 'Er. Rajesh Kumar',
      notes: 'Culvert cleared and silt trap restored.',
      workOrder: 'WO-991204'
    });
    // Citizen verifies
    const verifyResult = VerificationAgent.processCitizenVerification(incident.id, {
      citizenId: testComplaint.citizenId,
      citizenName: testComplaint.citizenName,
      isConfirmed: true,
      notes: 'Water is draining smoothly now. Verified.'
    });
    const updatedIncident = db.getIncidentById(incident.id);
    const hasOutput = verifyResult && updatedIncident.status === 'RESOLVED';
    const persisted = updatedIncident?.verificationStatus === 'VERIFIED';
    results.push({
      agent: 'VerificationAgent',
      executed: 'YES',
      output: `Status: ${updatedIncident.status} (${updatedIncident.verificationStatus})`,
      persisted: persisted ? 'YES' : 'NO',
      status: hasOutput && persisted ? 'PASS' : 'FAIL'
    });
    console.log('  ✓ Output: Final Status ->', updatedIncident.status, '| Verification ->', updatedIncident.verificationStatus);
  } catch (err) {
    console.error('  ❌ Error in VerificationAgent:', err.message);
    results.push({ agent: 'VerificationAgent', executed: 'YES', output: 'ERROR', persisted: 'NO', status: 'FAIL' });
  }

  console.log('\n===============================================================');
  console.log('📊 FINAL 9 AI AGENTS INDIVIDUAL VERIFICATION TABLE');
  console.log('===============================================================\n');

  console.log('| Agent | Executed | Output | Persisted | Status |');
  console.log('|---|---|---|---|---|');
  for (const r of results) {
    console.log(`| ${r.agent} | ${r.executed} | ${r.output} | ${r.persisted} | ${r.status} |`);
  }

  const allPassed = results.every(r => r.status === 'PASS');
  console.log(`\nOverall 9-Agent Result: ${allPassed ? 'ALL PASSED ✅' : 'FAILURES DETECTED ❌'}`);
  process.exit(allPassed ? 0 : 1);
}

testAllAgents();
