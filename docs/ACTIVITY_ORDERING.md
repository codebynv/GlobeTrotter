# Activity Ordering Notes

When a trip contains ordered activities:

- Define how ordering is stored.
- Keep order stable after edits.
- Handle deleted or moved activities.
- Avoid relying on incidental database return order.
- Test trips with zero, one, and multiple activities.

If ordering is user-controlled, verify that the saved order matches the displayed order after refresh.
