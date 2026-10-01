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

async function runRbacTests() {
  console.log('======================================================================');
  console.log('🛡️ JAN SAHAYAK — AUTH & RBAC SECURITY VERIFICATION (SECTION 8)');
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

  const citHeaders = { Authorization: 'Bearer demo_token_citizen' };
  const offHeaders = { Authorization: 'Bearer demo_token_civic_officer' }; // DJB Officer
  const deptAdminHeaders = { Authorization: 'Bearer demo_token_dept_admin' }; // DJB Dept Admin
  const superAdminHeaders = { Authorization: 'Bearer demo_token_super_admin' };

  // 1. Citizen -> cannot access admin APIs
  console.log('--- TEST 1: Citizen Access Restrictions ---');
  const citAdminRes = await request('GET', '/api/admin/audit-logs', null, citHeaders);
  assert('1. Citizen cannot access /api/admin/audit-logs (403)', citAdminRes.status === 403);

  const citUsersRes = await request('GET', '/api/admin/users', null, citHeaders);
  assert('1.1 Citizen cannot access /api/admin/users (403)', citUsersRes.status === 403);

  // 2. Citizen -> cannot modify incident status
  const citStatusRes = await request('POST', '/api/grievances/TEST-ID/transition-status', {
    newStatus: 'INVESTIGATION',
    reason: 'Citizen attempting unauthorized override'
  }, citHeaders);
  assert('2. Citizen cannot modify incident status (403)', citStatusRes.status === 403);

  // 3. Citizen -> cannot access or verify another citizen's data
  // First create a complaint owned by citizen B
  const compBRes = await request('POST', '/api/complaints', {
    title: 'Private grievance for citizen B',
    text: 'Water contamination inside private residence sector 14',
    category: 'Water Supply & Contamination',
    citizenName: 'Sunita Sharma',
    citizenId: 'USR-CITIZEN-02',
    ward: 'Ward 14 (Rohini Sector 14)'
  });
  const compBId = compBRes.data?.complaint?.id;

  const citVerifyOtherRes = await request('POST', `/api/grievances/${compBId}/verify`, {
    satisfaction: 'SATISFIED',
    feedbackText: 'Citizen A verifying Citizen B complaint'
  }, citHeaders);
  assert('3. Citizen cannot verify another citizen\'s grievance (403)', citVerifyOtherRes.status === 403);

  // 4. Officer -> cannot modify roles
  console.log('\n--- TEST 2: Officer Role Boundaries ---');
  const offRoleRes = await request('POST', '/api/admin/users/USR-CITIZEN-01/role', {
    role: 'super_admin'
  }, offHeaders);
  assert('4. Officer cannot modify user roles (403/404)', offRoleRes.status === 403 || offRoleRes.status === 404);

  // 5. Officer -> cannot access/modify unauthorized departments
  console.log('\n--- TEST 3: Department Isolation ---');
  // Create a complaint assigned to Public Works Department (PWD)
  const pwdCompRes = await request('POST', '/api/complaints', {
    title: 'Dangerous deep pothole on arterial flyover asphalt road',
    text: 'Large dangerous pothole and asphalt cavity on arterial flyover road causing traffic slowdown and scooter accidents.',
    category: 'Roads & Infrastructure',
    ward: 'Ward 14 (Rohini Sector 14)'
  });
  const pwdCompId = pwdCompRes.data?.complaint?.id;
  const pwdDept = pwdCompRes.data?.complaint?.department;
  console.log(`  Created PWD test complaint ${pwdCompId} assigned to: ${pwdDept}`);

  // DJB Officer tries to resolve PWD ticket
  const unauthDeptRes = await request('POST', `/api/grievances/${pwdCompId}/resolve`, {
    resolutionNotes: 'DJB officer attempting unauthorized sign-off on PWD road project'
  }, offHeaders);
  assert('5. DJB Officer cannot resolve PWD complaint (403)', unauthDeptRes.status === 403);

  // 6. Department Admin -> restricted to authorized scope
  console.log('\n--- TEST 4: Department Admin Scope ---');
  const deptAdminUnauthRes = await request('POST', `/api/grievances/${pwdCompId}/resolve`, {
    resolutionNotes: 'DJB Department Admin attempting unauthorized sign-off on PWD road project'
  }, deptAdminHeaders);
  assert('6. DJB Department Admin cannot resolve PWD complaint (403)', deptAdminUnauthRes.status === 403);

  // 7. Super Admin -> authorized administrative access
  console.log('\n--- TEST 5: Super Admin Authorization ---');
  const superAuditRes = await request('GET', '/api/admin/audit-logs', null, superAdminHeaders);
  assert('7. Super Admin can access /api/admin/audit-logs (200)', superAuditRes.status === 200);

  const superUsersRes = await request('GET', '/api/admin/users', null, superAdminHeaders);
  assert('7.1 Super Admin can access /api/admin/users (200)', superUsersRes.status === 200);

  console.log('\n======================================================================');
  console.log(`🏁 AUTH & RBAC VERIFICATION: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runRbacTests();
