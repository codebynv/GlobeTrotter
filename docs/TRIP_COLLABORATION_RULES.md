# Trip Collaboration Rules

When implementing shared trips, define the following behavior before changing the data model:

- Who can view a trip.
- Who can edit trip details.
- Whether invited members can invite others.
- How an invitation is accepted, declined, or revoked.
- What happens when a member is removed.
- How ownership transfer is authorized and recorded.

Enforce permissions in the server-side operation, not only in the interface. Test owner, invited member, unrelated user, and unauthenticated access separately.