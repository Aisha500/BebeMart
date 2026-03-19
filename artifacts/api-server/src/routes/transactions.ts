import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { transactionsTable, listingsTable, usersTable } from "@workspace/db/schema";
import { eq, or, and } from "drizzle-orm";

const router: IRouter = Router();

async function formatTransaction(tx: typeof transactionsTable.$inferSelect) {
  const [listing] = await db.select().from(listingsTable).where(eq(listingsTable.id, tx.listingId)).limit(1);
  const [buyer] = await db.select().from(usersTable).where(eq(usersTable.id, tx.buyerId)).limit(1);
  const [seller] = await db.select().from(usersTable).where(eq(usersTable.id, tx.sellerId)).limit(1);

  return {
    ...tx,
    listingTitle: listing?.title || "Unknown",
    listingImages: (listing?.images as string[]) || [],
    buyerName: buyer?.name || "Unknown",
    sellerName: seller?.name || "Unknown",
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const txs = await db
    .select()
    .from(transactionsTable)
    .where(or(eq(transactionsTable.buyerId, userId), eq(transactionsTable.sellerId, userId)));

  const formatted = await Promise.all(txs.map(formatTransaction));
  return res.json(formatted);
});

router.get("/:transactionId", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const txId = parseInt(req.params.transactionId);
  const [tx] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, txId)).limit(1);
  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  if (tx.buyerId !== userId && tx.sellerId !== userId) {
    return res.status(403).json({ error: "Not your transaction" });
  }

  return res.json(await formatTransaction(tx));
});

router.post("/", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { listingId, deliveryAddress } = req.body;
  if (!listingId || !deliveryAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const [listing] = await db.select().from(listingsTable).where(eq(listingsTable.id, listingId)).limit(1);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  if (listing.status !== "available") {
    return res.status(409).json({ error: "Listing is not available" });
  }
  if (listing.sellerId === userId) {
    return res.status(400).json({ error: "Cannot buy your own listing" });
  }

  const platformFee = listing.giftItForward ? 500 : 0;

  const [tx] = await db.insert(transactionsTable).values({
    listingId,
    buyerId: userId,
    sellerId: listing.sellerId,
    amount: listing.price,
    platformFee,
    escrowStatus: "paid_escrow",
    deliveryAddress,
  }).returning();

  await db.update(listingsTable).set({ status: "reserved" }).where(eq(listingsTable.id, listingId));

  return res.status(201).json(await formatTransaction(tx));
});

router.patch("/:transactionId/status", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const txId = parseInt(req.params.transactionId);
  const { status } = req.body;

  const [tx] = await db.select().from(transactionsTable).where(eq(transactionsTable.id, txId)).limit(1);
  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const allowedTransitions: Record<string, { allowedBy: "buyer" | "seller" | "both"; next: string[] }> = {
    paid_escrow: { allowedBy: "seller", next: ["shipped", "cancelled"] },
    shipped: { allowedBy: "buyer", next: ["received"] },
    received: { allowedBy: "buyer", next: ["completed"] },
    completed: { allowedBy: "both", next: [] },
    cancelled: { allowedBy: "both", next: [] },
  };

  const current = allowedTransitions[tx.escrowStatus];
  if (!current || !current.next.includes(status)) {
    return res.status(400).json({ error: `Cannot transition from ${tx.escrowStatus} to ${status}` });
  }

  const isBuyer = tx.buyerId === userId;
  const isSeller = tx.sellerId === userId;

  if (current.allowedBy === "seller" && !isSeller) {
    return res.status(403).json({ error: "Only the seller can perform this action" });
  }
  if (current.allowedBy === "buyer" && !isBuyer) {
    return res.status(403).json({ error: "Only the buyer can perform this action" });
  }
  if (!isBuyer && !isSeller) {
    return res.status(403).json({ error: "Not your transaction" });
  }

  const [updated] = await db
    .update(transactionsTable)
    .set({ escrowStatus: status, updatedAt: new Date() })
    .where(eq(transactionsTable.id, txId))
    .returning();

  if (status === "completed") {
    await db.update(listingsTable).set({ status: "sold" }).where(eq(listingsTable.id, tx.listingId));
  }
  if (status === "cancelled") {
    await db.update(listingsTable).set({ status: "available" }).where(eq(listingsTable.id, tx.listingId));
  }

  return res.json(await formatTransaction(updated));
});

export default router;
