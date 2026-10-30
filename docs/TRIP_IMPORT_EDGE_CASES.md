# Trip Import Edge Cases

When reviewing trip import behavior, consider:

- empty files,
- missing required columns,
- malformed dates,
- unsupported currency values,
- duplicate records,
- partially invalid rows,
- repeated import attempts.

Define whether imports are atomic or allow partial success. Report row-level errors clearly and avoid creating duplicate trips when a request is retried. Verify behavior against the current importer.