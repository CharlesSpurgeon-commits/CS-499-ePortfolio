const test = require('node:test');
const assert = require('node:assert/strict');
const Trip = require('../app_api/models/travlr');
const { buildTripQuery } = require('../app_api/query');

test('trip schema normalizes code and trims database values', () => {
  const trip = new Trip({
    code: ' galr ', name: ' Gale Reef ', length: '4 nights', start: '2026-08-15',
    resort: ' Emerald Bay ', perPerson: '799.00', image: 'reef.jpg', description: ' Test trip '
  });
  const error = trip.validateSync();
  assert.equal(error, undefined);
  assert.equal(trip.code, 'GALR');
  assert.equal(trip.name, 'Gale Reef');
  assert.equal(trip.resort, 'Emerald Bay');
});

test('trip schema rejects malformed price data', () => {
  const trip = new Trip({
    code: 'BAD1', name: 'Bad Price', length: '4 nights', start: '2026-08-15',
    resort: 'Bay', perPerson: 'free', image: 'reef.jpg', description: 'Test trip'
  });
  assert.ok(trip.validateSync().errors.perPerson);
});

test('query builder creates safe filter, sort, and pagination options', () => {
  const result = buildTripQuery({ resort: 'Bay', startAfter: '2026-01-01', page: '2', limit: '10', sort: '-start' });
  assert.equal(result.page, 2);
  assert.equal(result.limit, 10);
  assert.equal(result.skip, 10);
  assert.deepEqual(result.sort, { start: -1 });
  assert.equal(result.filter.start.$gte.toISOString().slice(0, 10), '2026-01-01');
  assert.equal(result.filter.resort.$options, 'i');
});

test('query builder rejects unsupported MongoDB-style parameters', () => {
  assert.throws(() => buildTripQuery({ '$where': 'true' }), /Unsupported query parameter/);
  assert.throws(() => buildTripQuery({ limit: '1000' }), /Invalid pagination value/);
  assert.throws(() => buildTripQuery({ sort: '$natural' }), /Invalid sort value/);
});
