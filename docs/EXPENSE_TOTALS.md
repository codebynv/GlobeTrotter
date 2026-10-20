# Expense Total Consistency

When calculating trip totals:
- Define which currencies can be combined.
- Use decimal-safe arithmetic for monetary values.
- Specify rounding rules.
- Decide how deleted or refunded expenses affect totals.
- Test empty trips and boundary values.
- Keep display formatting separate from calculation.

Never sum unlike currencies without a documented conversion rule.
