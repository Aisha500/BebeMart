import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { listingsTable, usersTable } from "@workspace/db/schema";
import { eq, and, like, or, sql, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const listings = await db
    .select({
      listing: listingsTable,
      sellerName: usersTable.name,
      sellerRating: usersTable.rating,
    })
    .from(listingsTable)
    .leftJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
    .where(eq(listingsTable.sellerId, userId))
    .orderBy(desc(listingsTable.createdAt));

  return res.json({
    listings: listings.map(({ listing, sellerName, sellerRating }) => ({
      ...listing,
      sellerName: sellerName || "Unknown",
      sellerRating: sellerRating || null,
      images: listing.images as string[],
      createdAt: listing.createdAt.toISOString(),
    })),
    total: listings.length,
    page: 1,
    totalPages: 1,
  });
});

router.get("/", async (req, res) => {
  const { category, ageGroup, state, city, giftItForward, search, page = "1", limit = "20" } = req.query;
  const pageNum = parseInt(page as string) || 1;
  const limitNum = Math.min(parseInt(limit as string) || 20, 50);
  const offset = (pageNum - 1) * limitNum;

  const conditions: any[] = [eq(listingsTable.status, "available")];

  if (category) conditions.push(eq(listingsTable.category, category as string));
  if (ageGroup) conditions.push(eq(listingsTable.ageGroup, ageGroup as string));
  if (state) conditions.push(eq(listingsTable.state, state as string));
  if (city) conditions.push(eq(listingsTable.city, city as string));
  if (giftItForward === "true") conditions.push(eq(listingsTable.giftItForward, true));
  if (search) {
    conditions.push(
      or(
        like(listingsTable.title, `%${search}%`),
        like(listingsTable.description, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countResult] = await Promise.all([
    db
      .select({
        listing: listingsTable,
        sellerName: usersTable.name,
        sellerRating: usersTable.rating,
      })
      .from(listingsTable)
      .leftJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(listingsTable.createdAt))
      .limit(limitNum)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(listingsTable)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count || 0;

  return res.json({
    listings: rows.map(({ listing, sellerName, sellerRating }) => ({
      ...listing,
      sellerName: sellerName || "Unknown",
      sellerRating: sellerRating || null,
      images: listing.images as string[],
      createdAt: listing.createdAt.toISOString(),
    })),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.get("/:listingId", async (req, res) => {
  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    return res.status(400).json({ error: "Invalid listing ID" });
  }

  const [row] = await db
    .select({
      listing: listingsTable,
      seller: usersTable,
    })
    .from(listingsTable)
    .leftJoin(usersTable, eq(listingsTable.sellerId, usersTable.id))
    .where(eq(listingsTable.id, listingId))
    .limit(1);

  if (!row) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const { listing, seller } = row;

  return res.json({
    ...listing,
    sellerName: seller?.name || "Unknown",
    sellerRating: seller?.rating || null,
    images: listing.images as string[],
    createdAt: listing.createdAt.toISOString(),
    seller: seller
      ? {
          id: seller.id,
          name: seller.name,
          state: seller.state,
          city: seller.city,
          rating: seller.rating,
          reviewCount: seller.reviewCount,
          createdAt: seller.createdAt.toISOString(),
        }
      : null,
  });
});

router.post("/", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { title, description, price, category, ageGroup, condition, images, videoUrl, state, city, giftItForward } = req.body;

  if (!title || !description || price === undefined || !category || !ageGroup || !condition || !images?.length || !state || !city) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (price > 5000) {
    return res.status(400).json({ error: "Price cannot exceed 5,000 NGN" });
  }

  if (giftItForward && price !== 0) {
    return res.status(400).json({ error: "Gift-It-Forward items must be priced at 0" });
  }

  const [listing] = await db.insert(listingsTable).values({
    title,
    description,
    price,
    category,
    ageGroup,
    condition,
    images,
    videoUrl: videoUrl || null,
    sellerId: userId,
    state,
    city,
    giftItForward: giftItForward || false,
    status: "available",
  }).returning();

  const [seller] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  return res.status(201).json({
    ...listing,
    sellerName: seller?.name || "Unknown",
    sellerRating: seller?.rating || null,
    images: listing.images as string[],
    createdAt: listing.createdAt.toISOString(),
  });
});

router.put("/:listingId", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    return res.status(400).json({ error: "Invalid listing ID" });
  }

  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, listingId)).limit(1);
  if (!existing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  if (existing.sellerId !== userId) {
    return res.status(403).json({ error: "Not your listing" });
  }

  const updates: Partial<typeof existing> = {};
  const { title, description, price, category, ageGroup, condition, images, videoUrl, state, city, status } = req.body;

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) {
    if (price > 5000) return res.status(400).json({ error: "Price cannot exceed 5,000 NGN" });
    updates.price = price;
  }
  if (category !== undefined) updates.category = category;
  if (ageGroup !== undefined) updates.ageGroup = ageGroup;
  if (condition !== undefined) updates.condition = condition;
  if (images !== undefined) updates.images = images;
  if (videoUrl !== undefined) updates.videoUrl = videoUrl;
  if (state !== undefined) updates.state = state;
  if (city !== undefined) updates.city = city;
  if (status !== undefined) updates.status = status;

  const [updated] = await db.update(listingsTable).set(updates).where(eq(listingsTable.id, listingId)).returning();
  const [seller] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  return res.json({
    ...updated,
    sellerName: seller?.name || "Unknown",
    sellerRating: seller?.rating || null,
    images: updated.images as string[],
    createdAt: updated.createdAt.toISOString(),
  });
});

router.delete("/:listingId", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const listingId = parseInt(req.params.listingId);
  const [existing] = await db.select().from(listingsTable).where(eq(listingsTable.id, listingId)).limit(1);
  if (!existing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  if (existing.sellerId !== userId) {
    return res.status(403).json({ error: "Not your listing" });
  }

  await db.delete(listingsTable).where(eq(listingsTable.id, listingId));
  return res.status(204).send();
});

export default router;
