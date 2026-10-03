# Testing Notes

## Before opening a pull request

- Run the linter.
- Build when application behavior or routing changes.
- Test the affected user flow in the browser.
- Check responsive behavior.
- Verify database-dependent flows against the intended environment.

## Regression focus

For trip-related changes, verify:

- trip creation,
- trip editing,
- stop ordering,
- activity association,
- expense handling,
- sharing and access behavior.

Document any known limitation in the pull request description.
