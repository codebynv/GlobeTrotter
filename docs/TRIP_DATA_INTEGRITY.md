# Trip Data Integrity

When changing trip persistence, verify:

- Required fields are present before saving.
- Date values are parsed and stored consistently.
- Updates do not unintentionally overwrite unrelated fields.
- Failed writes are reported accurately.
- Reopening a trip shows the saved values.

Use a small known dataset and compare expected values with the persisted result. Document any behavior that has not been verified.