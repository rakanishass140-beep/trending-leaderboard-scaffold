// Trending leaderboard backed by a Redis sorted set and post metadata hashes.
// trending:posts is the ranking; post:<id>:meta stores title and author.

import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_URL);

/** Atomically add one engagement point to a post. */
export async function upvote(postId) {
  return redis.zincrby("trending:posts", 1, postId);
}

/** Return the top N posts with metadata, batching HGETALL calls in one pipeline. */
export async function getTop(n) {
  const flat = await redis.zrevrange("trending:posts", 0, n - 1, "WITHSCORES");
  const rows = [];
  const pipeline = redis.pipeline();

  for (let i = 0; i < flat.length; i += 2) {
    rows.push({ id: flat[i], score: Number(flat[i + 1]) });
    pipeline.hgetall(flat[i] + ":meta");
  }

  const results = await pipeline.exec();
  return rows.map((row, index) => ({ ...row, ...results[index][1] }));
}

export { redis };
