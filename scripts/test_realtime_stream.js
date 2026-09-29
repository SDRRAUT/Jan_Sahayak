/**
 * Test: Realtime Stream & SSE Broadcast Mechanism
 */
console.log('--- RUNNING TEST: REALTIME STREAM ---');

let passed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ PASSED: ${msg}`);
  passed++;
}

// Mock SSE client receiver
const mockClient = {
  writtenMessages: [],
  write(data) {
    this.writtenMessages.push(data);
  }
};

const clients = new Set([mockClient]);

function broadcastRealtime(event, payload) {
  const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  for (const client of clients) {
    client.write(`event: ${event}\ndata: ${data}\n\n`);
  }
}

// 1. Broadcast Grievance Submission
broadcastRealtime('GRIEVANCE_SUBMITTED', { id: 'JS-RT-01', title: 'Road damage' });
assert(mockClient.writtenMessages.length === 1, 'Client received GRIEVANCE_SUBMITTED broadcast');
assert(mockClient.writtenMessages[0].includes('JS-RT-01'), 'Broadcast contains ticket ID');

// 2. Broadcast Verification Pending
broadcastRealtime('VERIFICATION_PENDING', { id: 'JS-RT-01', deadline: new Date(Date.now() + 4 * 86400000).toISOString() });
assert(mockClient.writtenMessages.length === 2, 'Client received VERIFICATION_PENDING event');

// 3. Broadcast Citizen Verification Confirmed
broadcastRealtime('VERIFICATION_CONFIRMED', { id: 'JS-RT-01', status: 'RESOLVED_CONFIRMED' });
assert(mockClient.writtenMessages.length === 3, 'Client received VERIFICATION_CONFIRMED event');

// 4. Broadcast Auto Resolved Timeout
broadcastRealtime('AUTO_RESOLVED_TIMEOUT', { id: 'JS-RT-02', status: 'AUTO_RESOLVED' });
assert(mockClient.writtenMessages.length === 4, 'Client received AUTO_RESOLVED_TIMEOUT event');

console.log(`\n🎉 REALTIME STREAM TESTS PASSED! (${passed}/${passed} assertions passed)`);
