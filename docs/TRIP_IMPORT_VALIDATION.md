# Trip Import Validation

Before importing trip data:
- Validate the file format and required columns.
- Reject malformed dates and unsupported currencies.
- Preview changes before saving when feasible.
- Report row-level errors without exposing private data.
- Avoid duplicate imports on retries.
- Keep partial-import behavior explicit.

Test empty files, invalid rows, and large but supported inputs.