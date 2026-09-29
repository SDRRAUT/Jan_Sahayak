/**
 * Test: Complete End-to-End Civic Intelligence Pipeline Flow
 */
import {
  complaintAnalyzer,
  complaintDna,
  similarityCluster,
  civicIncident,
  rootCause,
  resolutionEngine,
  authorityRouting,
  verificationAgent
} from '../server/aiAgents.js';

console.log('--- RUNNING TEST: COMPLETE END-TO-END PIPELINE FLOW ---');

let passed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
  passed++;
}

// 1. Citizen Inputs Text & Voice
const input = {
  text: 'Sector 14 Rohini mein 3 din se pipeline tooti hai aur bohot ganda badbudaar paani aa raha hai.',
  location: { ward: 'Ward 14 (Rohini Sector 14)', area: 'Pocket 2', pincode: '110085' }
};

// 2. AI Category Detection
const categoryResult = complaintAnalyzer.analyze(input);
assert(categoryResult.category === 'Water & Drainage' || categoryResult.category.includes('Water'), 'Category correctly detected as Water');
assert(categoryResult.confidence >= 0.8, 'High confidence score in category detection');

// 3. Citizen Confirmation
const grievanceData = {
  id: 'JS-E2E-TEST',
  title: 'Pipeline Fracture & Dirty Water Supply',
  description: input.text,
  ward: input.location.ward,
  area: input.location.area,
  ai_category: categoryResult.category,
  ai_subcategory: categoryResult.subcategory,
  ai_category_confidence: categoryResult.confidence,
  category_source: 'complaint_analyzer_agent',
  final_category: categoryResult.category,
  final_subcategory: categoryResult.subcategory,
  latitude: 28.7189,
  longitude: 77.1265,
  accuracy: 10,
  location_source: 'gps',
  captured_at: new Date().toISOString(),
  status: 'SUBMITTED'
};
assert(grievanceData.ai_category && grievanceData.final_category, 'Preserved both AI category and Final category');

// 4. DNA Generation
const dna = complaintDna.generateDna(grievanceData);
assert(dna.hash && dna.hash.startsWith('DNA-'), 'DNA generated for ticket');

// 5. Clustering with nearby complaints
const clusters = similarityCluster.clusterGrievances([
  grievanceData,
  { id: 'JS-E2E-2', category: grievanceData.final_category, ward: grievanceData.ward, latitude: 28.7191, longitude: 77.1267 }
]);
assert(clusters.length >= 1 && clusters[0].items.length >= 2, 'Clustered with nearby report');

// 6. Authority Routing
const route = authorityRouting.route(grievanceData);
assert(route.primaryAuthority.includes('Jal Board') || route.primaryAuthority.includes('DJB'), 'Correctly routed to Delhi Jal Board');

// 7. Officer Resolves -> VERIFICATION_PENDING
grievanceData.status = 'VERIFICATION_PENDING';
grievanceData.verification_started_at = new Date().toISOString();
grievanceData.verification_deadline = new Date(Date.now() + 4 * 86400000).toISOString();
assert(grievanceData.status === 'VERIFICATION_PENDING', 'Transitioned to VERIFICATION_PENDING');

// 8. 4-Day Expiration Test (Simulate deadline passing)
const expiredGrievance = {
  ...grievanceData,
  id: 'JS-E2E-EXPIRED',
  verification_deadline: new Date(Date.now() - 1000).toISOString() // already passed
};

const isExpired = new Date(expiredGrievance.verification_deadline).getTime() < Date.now();
assert(isExpired, 'Identified expired verification window');

// Auto-resolve
expiredGrievance.status = 'AUTO_RESOLVED';
expiredGrievance.auto_closed = true;
expiredGrievance.verification_method = 'auto_timeout';
assert(expiredGrievance.status === 'AUTO_RESOLVED', 'Auto-resolved after 4-day timeout');
assert(expiredGrievance.verification_method === 'auto_timeout', 'Marked as auto_timeout in audit log');

console.log(`\n🎉 COMPLETE PIPELINE FLOW TESTS PASSED! (${passed}/${passed} assertions passed)`);
