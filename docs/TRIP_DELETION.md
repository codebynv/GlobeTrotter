# Trip Deletion Checklist

Before implementing trip deletion:

- Confirm the user has permission.
- Define how related activities and expenses are handled.
- Ask for confirmation when the operation is destructive.
- Keep database relationships consistent.
- Handle failure without leaving partial, confusing state.
- Test owner and unauthorized-user behavior.

Document whether deletion is permanent or recoverable.
