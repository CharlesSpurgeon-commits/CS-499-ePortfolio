const { ApiError } = require('./middleware');

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInt = (value, fallback, max) => {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value))) throw new ApiError(400, 'Invalid pagination value');
  const number = Number(value);
  if (number < 1 || number > max) throw new ApiError(400, 'Invalid pagination value');
  return number;
};

// Converts safe, allow-listed query parameters into a MongoDB filter and
// pagination/sort options. No raw client object is passed into MongoDB.
const buildTripQuery = query => {
  const allowed = new Set(['name', 'resort', 'startAfter', 'startBefore', 'page', 'limit', 'sort']);
  if (Object.keys(query).some(key => !allowed.has(key))) {
    throw new ApiError(400, 'Unsupported query parameter');
  }

  const filter = {};
  if (query.name) filter.name = { $regex: escapeRegex(String(query.name).trim()), $options: 'i' };
  if (query.resort) filter.resort = { $regex: escapeRegex(String(query.resort).trim()), $options: 'i' };

  if (query.startAfter || query.startBefore) {
    filter.start = {};
    if (query.startAfter) {
      const date = new Date(query.startAfter);
      if (Number.isNaN(date.getTime())) throw new ApiError(400, 'Invalid startAfter date');
      filter.start.$gte = date;
    }
    if (query.startBefore) {
      const date = new Date(query.startBefore);
      if (Number.isNaN(date.getTime())) throw new ApiError(400, 'Invalid startBefore date');
      filter.start.$lte = date;
    }
  }

  const page = parsePositiveInt(query.page, 1, 1000000);
  const limit = parsePositiveInt(query.limit, 20, 100);
  const sorts = {
    start: { start: 1 },
    '-start': { start: -1 },
    name: { name: 1 },
    '-name': { name: -1 },
    resort: { resort: 1 },
    '-resort': { resort: -1 }
  };
  const sort = query.sort === undefined ? { start: 1 } : sorts[query.sort];
  if (!sort) throw new ApiError(400, 'Invalid sort value');

  return { filter, page, limit, skip: (page - 1) * limit, sort };
};

module.exports = { buildTripQuery };
