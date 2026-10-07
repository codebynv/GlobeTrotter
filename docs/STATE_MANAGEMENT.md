# State Management Notes

Keep state ownership close to the component or feature that needs it.

## Guidelines

- Prefer local state for isolated UI behavior.
- Keep shared state limited to genuinely shared data.
- Avoid duplicating server state in multiple places.
- Invalidate or refresh stale data after mutations.
- Keep loading, success, empty, and error states explicit.

Clear state ownership makes debugging and future feature work easier.
