# Trip Validation Rules

Document and verify the rules enforced when a trip is created or edited.

- Required fields are validated consistently in the UI and API.
- Start and end dates follow the same timezone convention.
- Invalid date ranges are rejected before saving.
- Errors identify the field that needs correction.
- Failed requests do not leave partially updated records.

Update this guide when the actual validation behavior changes.