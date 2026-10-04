# Database Notes

Keep database changes explicit and reviewable.

## Checklist

- Review schema changes before applying them.
- Add migrations for structural changes.
- Verify affected queries after schema updates.
- Keep row-level security and access rules aligned with the data model.
- Never commit database credentials or service-role secrets.

## Data integrity

Validate relationships and required fields before writing data. Prefer database constraints for rules that must always hold.
