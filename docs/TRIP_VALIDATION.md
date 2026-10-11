# Trip Validation

Validate trip data before saving it.

- Start dates should not be after end dates.
- Required destination fields should be present.
- Stop ordering should be deterministic.
- Activity associations should reference valid records.
- Invalid dates should produce a clear validation message.

Re-check constraints on the server rather than relying only on browser validation.
