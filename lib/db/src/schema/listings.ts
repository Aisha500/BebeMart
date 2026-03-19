import { pgTable, serial, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  ageGroup: varchar("age_group", { length: 20 }).notNull(),
  condition: varchar("condition", { length: 50 }).notNull(),
  images: json("images").$type<string[]>().notNull().default([]),
  videoUrl: text("video_url"),
  sellerId: integer("seller_id").notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  giftItForward: boolean("gift_it_forward").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
