import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable, usersTable, transactionsTable } from "@workspace/db/schema";
import { eq, avg } from "drizzle-orm";

const router: IRouter = Router();

router.get("/:sellerId", async (req, res) => {
  const sellerId = parseInt(req.params.sellerId);
  if (isNaN(sellerId)) {
    return res.status(400).json({ error: "Invalid seller ID" });
  }

  const reviews = await db
    .select({
      review: reviewsTable,
      buyerName: usersTable.name,
    })
    .from(reviewsTable)
    .leftJoin(usersTable, eq(reviewsTable.buyerId, usersTable.id))
    .where(eq(reviewsTable.sellerId, sellerId));

  return res.json(
    reviews.map(({ review, buyerName }) => ({
      ...review,
      buyerName: buyerName || "Anonymous",
      createdAt: review.createdAt.toISOString(),
    }))
  );
});

router.post("/", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { sellerId, transactionId, rating, comment } = req.body;
  if (!sellerId || !transactionId || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const [tx] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, transactionId)).limit(1);
  if (!tx || tx.buyerId !== userId || tx.sellerId !== sellerId) {
    return res.status(403).json({ error: "Not authorized to review this transaction" });
  }

  const [review] = await db.insert(reviewsTable).values({
    buyerId: userId,
    sellerId,
    transactionId,
    rating,
    comment: comment || null,
  }).returning();

  const ratingResult = await db
    .select({ avg: avg(reviewsTable.rating) })
    .from(reviewsTable)
    .where(eq(reviewsTable.sellerId, sellerId));

  const newRating = ratingResult[0]?.avg ? parseFloat(String(ratingResult[0].avg)) : null;
  const countResult = await db.select().from(reviewsTable).where(eq(reviewsTable.sellerId, sellerId));

  await db.update(usersTable).set({
    rating: newRating,
    reviewCount: countResult.length,
  }).where(eq(usersTable.id, sellerId));

  const [buyer] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  return res.status(201).json({
    ...review,
    buyerName: buyer?.name || "Anonymous",
    createdAt: review.createdAt.toISOString(),
  });
});

export default router;
