import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { works, type Work } from "@/lib/db/schema"

export type { Work }

export async function getWorks(): Promise<Work[]> {
  return db.select().from(works).orderBy(asc(works.order), asc(works.createdAt))
}

export async function getPublishedWorks(): Promise<Work[]> {
  const rows = await getWorks()
  return rows.filter((w) => w.published)
}

export async function getWorkById(id: string): Promise<Work | null> {
  const rows = await db.select().from(works).where(eq(works.id, id)).limit(1)
  return rows[0] ?? null
}
