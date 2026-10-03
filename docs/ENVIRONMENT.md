# Environment Configuration

## Required setup

Copy the example environment file before running the application locally.

Keep real credentials in local environment configuration only.

## Rules

- Never commit service-role keys.
- Never commit database passwords.
- Keep environment variable names documented in `.env.example`.
- Restart the development server after changing environment variables.

## Troubleshooting

If a value is undefined, verify the variable name, local environment file, and application restart before changing application code.
