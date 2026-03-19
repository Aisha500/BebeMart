import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db/schema";
import { eq, or, and, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/conversations", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const allMessages = await db
    .select()
    .from(messagesTable)
    .where(or(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, userId)))
    .orderBy(desc(messagesTable.createdAt));

  const conversationMap = new Map<number, typeof allMessages[number]>();
  for (const msg of allMessages) {
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, msg);
    }
  }

  const conversations = await Promise.all(
    Array.from(conversationMap.entries()).map(async ([otherId, lastMsg]) => {
      const [otherUser] = await db.select().from(usersTable).where(eq(usersTable.id, otherId)).limit(1);
      const unreadCount = allMessages.filter(
        m => m.senderId === otherId && m.receiverId === userId && !m.read
      ).length;

      return {
        otherUser: {
          id: otherUser?.id || otherId,
          name: otherUser?.name || "Unknown",
          state: otherUser?.state || null,
          city: otherUser?.city || null,
          rating: otherUser?.rating || null,
          reviewCount: otherUser?.reviewCount || 0,
          createdAt: otherUser?.createdAt.toISOString() || new Date().toISOString(),
        },
        lastMessage: {
          ...lastMsg,
          createdAt: lastMsg.createdAt.toISOString(),
        },
        unreadCount,
      };
    })
  );

  return res.json(conversations);
});

router.get("/:otherUserId", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const otherUserId = parseInt(req.params.otherUserId);
  if (isNaN(otherUserId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const messages = await db
    .select()
    .from(messagesTable)
    .where(
      or(
        and(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, otherUserId)),
        and(eq(messagesTable.senderId, otherUserId), eq(messagesTable.receiverId, userId))
      )
    )
    .orderBy(messagesTable.createdAt);

  await db
    .update(messagesTable)
    .set({ read: true })
    .where(and(eq(messagesTable.senderId, otherUserId), eq(messagesTable.receiverId, userId)));

  return res.json(messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

router.post("/:otherUserId", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const otherUserId = parseInt(req.params.otherUserId);
  if (isNaN(otherUserId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const { content, listingId } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ error: "Message content is required" });
  }

  const [msg] = await db.insert(messagesTable).values({
    senderId: userId,
    receiverId: otherUserId,
    content: content.trim(),
    listingId: listingId || null,
  }).returning();

  return res.status(201).json({ ...msg, createdAt: msg.createdAt.toISOString() });
});

export default router;
