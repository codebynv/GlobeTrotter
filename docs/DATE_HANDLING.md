# Date Handling

## Rules to verify
- Store date-only trip values as date-only values; do not shift them through UTC unnecessarily.
- Store timestamps with a clear timezone convention.
- Format dates for display at the UI boundary.
- Test trips crossing midnight and daylight-saving boundaries.
- Validate invalid or missing dates before persistence.

Keep these rules aligned with the database schema and form controls.
