# Travlr Getaways Milestone Two

The `original` directory in the submission contains the supplied CS 465 source. The `enhanced` directory contains the CS 499 software design and engineering enhancement. Both exclude dependency folders and generated caches.

## Run

Use Node.js and MongoDB. In `enhanced`, run `npm ci`, then set `ADMIN_USER` and `ADMIN_PASSWORD` to private nonempty values and optionally `MONGODB_URI` (default `mongodb://127.0.0.1:27017/travlr`). Run `npm start`. Seed sample data, if needed, with `node app_api/models/seed.js` (this deletes existing trips). For the Angular client, run `npm ci` and `npm start` inside `app_admin`, then open `http://localhost:4200`. The API expects that origin during local development.

The public GET routes are `/api/trips` and `/api/trips/:tripCode`. POST, PUT and DELETE use HTTP Basic authentication and require the configured administrator. The Angular client prompts for credentials on its first write request and holds them in memory until reload. Use HTTPS when deploying Basic authentication; local HTTP is suitable only for local development. No credentials are shipped in the submission. To clear credentials, reload the page.

## Verification

Run `node --test test/security.test.js`. This checks rejected/accepted credentials, role checks, operator-shaped input, extra fields, invalid dates and mismatched trip codes. JavaScript syntax was checked with `node --check`. Full database and Angular browser integration require a local MongoDB instance and installed Angular dependencies and have not been run in this environment.

## Design notes

Shared route middleware enforces access on the server. Validation accepts only the eight defined string fields, rejects extra properties and malformed codes/dates, and prevents changing a trip code via the update route. API errors use consistent JSON responses and hide unexpected server details. The trip-by-code response remains an array for compatibility with the existing Angular edit screen. Database schema and filtering are left for the separate database milestone.
