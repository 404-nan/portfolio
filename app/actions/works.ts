"use server"

import { revalidatePath } from "next/cache"
import { asc, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { works, type Work } from "@/lib/db/schema"

export type WorkInput = {
  id?: string
  title: string
  subtitle: string
  tags: string
  year: string
  client: string
  role: string
  coverImage: string
  overview: string
  body: string
  gallery: string[]
  order: number
  published: boolean
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function generateId(title: string) {
  const base = slugify(title) || "work"
  const existing = await db.select({ id: works.id }).from(works)
  const ids = new Set(existing.map((r) => r.id))
  if (!ids.has(base)) return base
  let i = 2
  while (ids.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}

function revalidate(id?: string) {
  revalidatePath("/")
  revalidatePath("/works")
  revalidatePath("/admin")
  if (id) revalidatePath(`/works/${id}`)
}

export async function listWorks(): Promise<Work[]> {
  try {
    return await db.select().from(works).orderBy(asc(works.order), desc(works.createdAt))
  } catch {
    console.warn("[works] Query failed — table may not exist yet. Visit /api/init to create it.")
    return []
  }
}

export async function createWork(input: WorkInput) {
  const id = input.id?.trim() || (await generateId(input.title))
  await db.insert(works).values({
    id,
    title: input.title,
    subtitle: input.subtitle,
    tags: input.tags,
    year: input.year,
    client: input.client,
    role: input.role,
    coverImage: input.coverImage,
    overview: input.overview,
    body: input.body,
    gallery: input.gallery,
    order: input.order,
    published: input.published,
  })
  revalidate(id)
  return { id }
}

export async function updateWork(id: string, input: WorkInput) {
  await db
    .update(works)
    .set({
      title: input.title,
      subtitle: input.subtitle,
      tags: input.tags,
      year: input.year,
      client: input.client,
      role: input.role,
      coverImage: input.coverImage,
      overview: input.overview,
      body: input.body,
      gallery: input.gallery,
      order: input.order,
      published: input.published,
      updatedAt: new Date(),
    })
    .where(eq(works.id, id))
  revalidate(id)
  return { id }
}

export async function deleteWork(id: string) {
  await db.delete(works).where(eq(works.id, id))
  revalidate(id)
}
