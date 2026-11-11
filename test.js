// Upvote post:50 fifty times and verify it appears in the top 10.
import { upvote, getTop, redis } from "./leaderboard.js";

async function run() {
  const target = "post:50";
  for (let i = 0; i < 50; i++) await upvote(target);

  const top = await getTop(10);
  console.log("Top 10:");
  top.forEach((post, index) => {
    console.log(`  #${index + 1}  ${post.id}  score=${post.score}  ${post.title} (${post.author})`);
  });

  const madeIt = top.some((post) => post.id === target);
  console.log(madeIt ? `\\nPASS ✅  ${target} reached the top 10` : `\\nFAIL ❌  ${target} is NOT in the top 10`);
  redis.disconnect();
  process.exit(madeIt ? 0 : 1);
}

run().catch((error) => {
  console.error(error);
  redis.disconnect();
  process.exit(1);
});
