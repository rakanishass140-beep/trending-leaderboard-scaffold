# Trending Posts Leaderboard

A Redis-backed trending posts leaderboard using a sorted set for ranking and hashes for post metadata.

## Features

- **Atomic upvotes:** `ZINCRBY` increments a post's score in one Redis command.
- **Top-N ranking:** `ZREVRANGE ... WITHSCORES` returns posts from highest to lowest score.
- **Pipelined metadata:** `HGETALL` commands are batched in one ioredis pipeline to avoid an N+1 network round trip.
- **Seed data:** Creates 100 sample posts and their metadata with a single pipeline.
- **Test:** Upvotes `post:50` 50 times and checks that it reaches the top 10.

## Redis data model

- Sorted set: `trending:posts` — member is the post ID and score is its engagement score.
- Hash: `post:<id>:meta` — stores `title` and `author`.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start a local Redis server (for example, with Docker):

   ```bash
   docker run --name redis-leaderboard -p 6379:6379 -d redis
   ```

3. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

   Set `REDIS_URL=redis://127.0.0.1:6379` in `.env`. Do not commit `.env`.

## Run

Seed 100 posts:

```bash
npm run seed
```

Run the test:

```bash
npm test
```

The test reports the top 10 and passes when `post:50` appears in the leaderboard after 50 upvotes.
