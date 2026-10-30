# Trip API Error Contract

Document the errors that trip-related API operations can return.

- Invalid input: identify fields that need correction.
- Unauthorized: require authentication before accessing private trips.
- Forbidden: explain when an authenticated user lacks access.
- Not found: distinguish a missing trip from an empty result.
- Dependency failure: report unavailable services without claiming success.

Keep response shapes consistent and avoid exposing internal stack traces or sensitive data. Verify this contract against the actual API before treating it as implemented.