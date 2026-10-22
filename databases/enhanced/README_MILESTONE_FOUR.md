# CS 499 Milestone Four — Database Enhancement

This enhanced Travlr Getaways artifact builds on the Milestone Two version and focuses specifically on database quality, integrity, query capability, reliability, and security.

## Database enhancements

- Enforced unique, normalized trip codes at the Mongoose schema/database index level.
- Added trimming, length constraints, price-format validation, timestamps, and useful indexes.
- Added allow-listed filtering by trip name, resort, and start-date range.
- Added bounded pagination (`page`, `limit`) and allow-listed sorting (`start`, `name`, `resort`).
- Preserved the existing Angular response shape while exposing pagination metadata in response headers.
- Used `lean()` for read-only query results and `countDocuments()` for pagination totals.
- Normalized trip codes consistently for reads, updates, and deletes.
- Improved MongoDB connection configuration and graceful shutdown behavior.
- Reworked database seeding to validate records and use idempotent upserts instead of deleting the collection.
- Added database-focused automated tests for schema validation, normalization, query construction, pagination, sorting, and rejection of unsafe/unsupported query parameters.

## Run tests

```bash
npm test
```

## Seed the database

```bash
npm run seed
```

The application uses `MONGODB_URI` when provided and otherwise defaults to the local `travlr` database.
