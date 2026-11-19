# convex/outbound

Every call that leaves the server: email, the stats sources, the model API.

- `email.ts`: one email to the admin through Resend; its key and addresses are deployment settings.
- `liveFeed.ts`: one read of Riot's live feed for a game, handed to `convex/feeds/live.ts`.
