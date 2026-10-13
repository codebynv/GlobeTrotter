# Trip Empty and Error States

Keep these states distinct:

- **Empty:** the request succeeded, but no records exist.
- **Loading:** the request is still in progress.
- **Error:** the request failed and data may be unavailable.
- **Populated:** records loaded successfully.

Do not show an empty list when a network or authorization error occurred. Give users a useful next step for each state.
