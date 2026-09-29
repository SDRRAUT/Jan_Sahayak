/**
 * Verification Script: All 9 AI Agents in Jan Sahayak Architecture
 */
import {
  complaintAnalyzer,
  complaintDna,
  similarityCluster,
  civicIncident,
  rootCause,
  resolutionEngine,
  authorityRouting,
  civicMemory,
  verificationAgent
} from '../server/aiAgents.js';

console.log('--- RUNNING TEST: VERIFY ALL 9 AI AGENTS ---');

let passedCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✓ PASSED: ${message}`);
    passedCount++;
  }
}

// 1. ComplaintAnalyzerAgent
console.log('\nTesting Agent 1: ComplaintAnalyzerAgent...');
const analyzed = complaintAnalyzer.analyze({
  text: 'Paani bahut ganda aa raha hai aur pressure bhi bahut kam hai. Sector 14 Rohini',
  location: { ward: 'Ward 14 (Rohini Sector 14)', area: 'Sector 14' }
});
assert(analyzed.category === 'Water & Drainage' || analyzed.category.includes('Water'), 'Identified water defect');
assert(analyzed.department === 'Delhi Jal Board (DJB)', 'Identified DJB department');
assert(analyzed.confidence >= 0.8, 'High confidence score returned');

// 2. ComplaintDNAAgent
console.log('\nTesting Agent 2: ComplaintDNAAgent...');
const dna = complaintDna.generateDna({
  description: 'Moolchand flyover road cave in and deep pothole causing accidents',
  category: 'Roads & Infrastructure',
  ward: 'Ward 8'
});
assert(dna.hash && dna.hash.startsWith('DNA-'), 'Generated cryptographic DNA hash');
assert(dna.vector && dna.vector.length > 0, 'Generated semantic DNA feature vector');

// 3. SimilarityClusterAgent
console.log('\nTesting Agent 3: SimilarityClusterAgent...');
const clusters = similarityCluster.clusterGrievances([
  { id: 'JS-1', category: 'Water & Drainage', ward: 'Ward 14', latitude: 28.7189, longitude: 77.1265 },
  { id: 'JS-2', category: 'Water & Drainage', ward: 'Ward 14', latitude: 28.7192, longitude: 77.1268 },
  { id: 'JS-3', category: 'Roads & Infrastructure', ward: 'Ward 8', latitude: 28.5678, longitude: 77.2435 }
]);
assert(clusters.length >= 1, 'Grouped complaints into geospatial clusters');
assert(clusters[0].items.length >= 2, 'Clustered 2 water complaints in Ward 14');

// 4. CivicIncidentAgent
console.log('\nTesting Agent 4: CivicIncidentAgent...');
const incident = civicIncident.evaluateIncident(clusters[0]);
assert(incident && incident.incidentId, 'Generated macro incident declaration');
assert(incident.severity, 'Calculated incident severity');

// 5. RootCauseAgent
console.log('\nTesting Agent 5: RootCauseAgent...');
const rc = rootCause.diagnose({
  category: 'Water & Drainage',
  ward: 'Ward 14',
  text: 'Contaminated brown muddy water with low pressure'
});
assert(rc.probableCause && rc.confidence, 'Identified probable root cause defect');

// 6. ResolutionAgent
console.log('\nTesting Agent 6: ResolutionAgent...');
const resAction = resolutionEngine.planResolution({
  category: 'Water & Drainage',
  rootCause: rc.probableCause,
  urgency: 'HIGH'
});
assert(resAction.steps && resAction.steps.length > 0, 'Generated concrete municipal resolution steps');
assert(resAction.estimatedHours > 0, 'Calculated SLA turnaround window');

// 7. AuthorityRoutingAgent
console.log('\nTesting Agent 7: AuthorityRoutingAgent...');
const routed = authorityRouting.route({
  category: 'Roads & Infrastructure',
  ward: 'Ward 8 (Lajpat Nagar)',
  potholeDepth: '40cm'
});
assert(routed.primaryAuthority === 'Public Works Department (PWD)', 'Routed road damage to PWD');
assert(routed.officerDesignation, 'Assigned officer designation');

// 8. CivicMemoryAgent
console.log('\nTesting Agent 8: CivicMemoryAgent...');
civicMemory.store({ id: 'JS-TEST', ward: 'Ward 14', rootCause: rc.probableCause });
const memory = civicMemory.query({ ward: 'Ward 14' });
assert(memory.length >= 1, 'Stored and retrieved civic memory records');

// 9. VerificationAgent
console.log('\nTesting Agent 9: VerificationAgent...');
const verification = verificationAgent.evaluateResolution({
  complaintId: 'JS-TEST',
  citizenConfirmed: true,
  evidencePhotos: ['repair_complete.jpg']
});
assert(verification.status === 'VERIFIED', 'Verification status marked verified');

console.log(`\n🎉 ALL 9 AI AGENTS VERIFIED! (${passedCount}/${passedCount} assertions passed)`);
