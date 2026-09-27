import http from 'http';

function connectSSE(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const events = [];
    let isClosed = false;

    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        ...headers
      }
    }, (res) => {
      let buffer = '';
      res.on('data', chunk => {
        buffer += chunk.toString();
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep remainder
        for (const block of lines) {
          if (block.trim()) {
            events.push(block.trim());
          }
        }
      });

      res.on('close', () => {
        isClosed = true;
      });

      resolve({
        statusCode: res.statusCode,
        req,
        res,
        getEvents: () => events,
        isClosed: () => isClosed,
        close: () => {
          try { req.destroy(); } catch (e) {}
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function postJSON(path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, raw: body }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testRealtime() {
  console.log('======================================================================');
  console.log('⚡ JAN SAHAYAK — REALTIME SSE & SUBSCRIPTION VERIFICATION (SECTION 7)');
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

  // 1. Connect Citizen SSE client
  console.log('--- Step 1: Connecting Citizen SSE Stream ---');
  const citizenClient = await connectSSE('/api/events?token=demo_token_citizen&clientId=citizen-session-01');
  assert('1. Citizen SSE Connected (200 OK)', citizenClient.statusCode === 200);

  // Wait for initial connected event
  await new Promise(r => setTimeout(r, 200));
  const citEvents = citizenClient.getEvents();
  assert('1.1 Handshake Event Received by Citizen', citEvents.some(e => e.includes('event: connected') || e.includes('"role":"citizen"')));

  // 2. Connect Officer SSE client
  console.log('\n--- Step 2: Connecting Officer SSE Stream ---');
  const officerClient1 = await connectSSE('/api/events?token=demo_token_civic_officer&clientId=officer-session-01');
  assert('2. Officer SSE Connected (200 OK)', officerClient1.statusCode === 200);

  // 3. Test Duplicate Connection Superseding
  console.log('\n--- Step 3: Testing Duplicate Connection Handling ---');
  const officerClient2 = await connectSSE('/api/events?token=demo_token_civic_officer&clientId=officer-session-01');
  await new Promise(r => setTimeout(r, 200));
  assert('3. Duplicate Connection Superseded & First Closed', officerClient1.isClosed() === true);
  assert('3.1 Second Connection Active', officerClient2.isClosed() === false);

  // 4. Trigger Cross-Role Mutation: Create Grievance and Transition Status
  console.log('\n--- Step 4: Cross-Role Event Propagation ---');
  const submitRes = await postJSON('/api/complaints', {
    title: 'Water contamination test for realtime sync',
    text: 'Contaminated brown water coming from taps in Sector 14 Rohini',
    category: 'Water Supply & Contamination',
    ward: 'Ward 14 (Rohini Sector 14)',
    lat: 28.7180,
    lng: 77.1260,
    citizenName: 'Aditya Verma',
    citizenId: 'USR-CITIZEN-01'
  }, { Authorization: 'Bearer demo_token_citizen' });

  const complaintId = submitRes.data?.complaint?.id;
  assert('4.1 Grievance Created for Realtime Test', !!complaintId);

  // Officer transitions status
  await postJSON(`/api/grievances/${complaintId}/transition-status`, {
    newStatus: 'INVESTIGATION',
    reason: 'Testing realtime sync dispatch'
  }, { Authorization: 'Bearer demo_token_civic_officer' });

  // Wait for SSE broadcast
  await new Promise(r => setTimeout(r, 500));

  // Check Citizen received status update
  const latestCitEvents = citizenClient.getEvents();
  const receivedStatusUpdate = latestCitEvents.some(e => 
    e.includes('status_changed') || e.includes('INVESTIGATION') || e.includes(complaintId)
  );
  assert('4.2 Citizen Receives Officer Status Update via SSE', receivedStatusUpdate);

  // Cleanup
  citizenClient.close();
  officerClient2.close();

  console.log('\n======================================================================');
  console.log(`🏁 REALTIME VERIFICATION: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

testRealtime();
