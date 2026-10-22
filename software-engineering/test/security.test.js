const test = require('node:test');
const assert = require('node:assert/strict');
const { authenticate, requireRole } = require('../app_api/middleware');
const { validateCode, validateTrip } = require('../app_api/validation');
const call = (middleware, req) => new Promise(resolve => middleware(req, { set() {} }, error => resolve(error || null)));
const trip = { code:'ABC', name:'Beach', length:'7 nights', start:'2026-10-20', resort:'Bay', perPerson:'1200', image:'bay.jpg', description:'Trip' };
test('write authorization rejects missing and incorrect credentials', async () => {
  process.env.ADMIN_USER='admin'; process.env.ADMIN_PASSWORD='test-password';
  const req = { get: () => '' };
  assert.equal((await call(authenticate,req)).status,401);
  req.get=()=>`Basic ${Buffer.from('admin:wrong').toString('base64')}`;
  assert.equal((await call(authenticate,req)).status,401);
  req.get=()=>`Basic ${Buffer.from('admin:test-password').toString('base64')}`;
  assert.equal(await call(authenticate,req),null);
  assert.equal(await call(requireRole('admin'),req),null);
  assert.equal((await call(requireRole('editor'),req)).status,403);
});
test('trip validation rejects operators, extra fields, bad dates and code mismatch', async () => {
  for (const body of [{...trip,name:{$gt:''}}, {...trip,extra:'x'}, {...trip,start:'2026-02-30'}])
    assert.equal((await call(validateTrip,{body,params:{}})).status,400);
  assert.equal((await call(validateTrip,{body:trip,params:{tripCode:'XYZ'}})).status,400);
  assert.equal((await call(validateCode,{params:{tripCode:'{$ne:null}'}})).status,400);
  const req={body:trip,params:{tripCode:'ABC'}};
  assert.equal(await call(validateTrip,req),null);
  assert.deepEqual(req.trip,trip);
});
