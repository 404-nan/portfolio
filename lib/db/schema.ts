import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const works = pgTable("works", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  tags: text("tags").notNull().default(""),
  year: text("year").notNull().default(""),
  client: text("client").notNull().default(""),
  role: text("role").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  overview: text("overview").notNull().default(""),
  body: text("body").notNull().default(""),
  gallery: jsonb("gallery").notNull().default([]).$type<string[]>(),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Work = typeof works.$inferSelect
export type NewWork = typeof works.$inferInsert
