/**
 * Next.js Instrumentation File
 *
 * This runs once when the Next.js server starts (both in dev and production).
 * We use it to eagerly establish the MongoDB connection so it is already warm
 * by the time the first user request hits a page that needs the database.
 *
 * Without this, the first DB-dependent page (e.g. /halaqah) would pay the full
 * cold-connect cost (TCP + TLS + MongoDB auth) on the user's critical path,
 * adding noticeable latency to the initial page render.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Only run in the Node.js runtime (not in the Edge runtime).
  // The "nodejs" runtime is where our Mongoose connection lives.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: connectDB } = await import("@/lib/db/mongoose");

    try {
      await connectDB();
      console.log("🚀 MongoDB pre-warmed on server start");
    } catch (err) {
      // Log but don't crash the server — individual requests will
      // retry the connection via their own connectDB() calls.
      console.error("⚠️  MongoDB pre-warm failed on server start:", err);
    }
  }
}
