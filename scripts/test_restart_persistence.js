import http from 'http';

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

async function testFetch(id) {
  const res = await request('GET', `/api/grievances/${id}`);
  console.log(`Fetch status for ${id}:`, res.status);
  if (res.status === 200 && res.data?.grievance?.id === id) {
    console.log('✅ RESTART PERSISTENCE VERIFIED: Record retrieved intact after server restart!');
    process.exit(0);
  } else {
    console.error('❌ FAILED TO FETCH RECORD AFTER RESTART');
    process.exit(1);
  }
}

const targetId = process.argv[2];
if (targetId) {
  testFetch(targetId);
} else {
  console.log('Usage: node scripts/test_restart_persistence.js <COMPLAINT_ID>');
}
