# Error State Guide

User-facing errors should explain what happened and what the user can do next.

## Common states

- Network failure
- Invalid form input
- Missing resource
- Authentication failure
- Database or service failure

Avoid exposing raw internal errors directly to users. Keep detailed diagnostics in appropriate logs.
