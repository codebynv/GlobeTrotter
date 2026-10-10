# Expenses Guide

Expense-related changes should preserve clear ownership and trip association.

- Validate amount and currency fields.
- Check that an expense belongs to the intended trip.
- Apply access checks before reading or editing expense records.
- Handle empty expense lists explicitly.
- Test totals with multiple entries and boundary values.

Use persisted data for calculations rather than display-only constants.
