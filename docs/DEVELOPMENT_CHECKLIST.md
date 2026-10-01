# Development Checklist

Use this checklist before opening a pull request.

## Local setup

- [ ] Install dependencies with `npm install`.
- [ ] Configure environment variables from `.env.example`.
- [ ] Start the app with `npm run dev`.

## Validation

- [ ] Run `npm run lint`.
- [ ] Run `npm run build` when routing or application behavior changes.
- [ ] Test the affected flow in a browser.
- [ ] Check the responsive layout.

## Supabase changes

- [ ] Review schema or migration changes.
- [ ] Verify affected queries locally.
- [ ] Confirm no credentials or service keys are committed.

## Pull request

- [ ] Explain what changed and why.
- [ ] Mention how the change was tested.
- [ ] Include screenshots for meaningful UI changes.
