# Expense Access

Expense data should follow the access rules of its associated trip.

- Verify trip membership before listing expenses.
- Check permissions before edits and deletes.
- Validate amounts and currency fields.
- Avoid leaking expense details through error messages.
- Test access for owners, collaborators, and users without access.

Frontend visibility is not a substitute for backend authorization.
