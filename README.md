# Pathology report

## Context

This implementation does not use a database, opting instead to read from the `diagnostic_groups.csv` file on fetches.
It also uses NextJS API routes as a backend, therefore the only setup required is for NextJS.

When designing the UI, I took some time to ask a doctor what features they would find useful on this application, and what kinds of data they would like to see. 🧑‍⚕️

## Things i'd improve

- More error handling, handling edge cases (e.g bad file upload format etc)
- Loading states
- Cleaner backend code (especially the bit of logic where it is building the response data)
- Better handling of missing data (e.g higher and lower values)
- Tests
- More comments around the more complex areas

## Getting started

1. Ensure that you have `pnpm` installed
2. Run `pnpm i && pnpm run dev` to run this application locally

