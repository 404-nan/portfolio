"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { rowToWork, type Work, type WorkRow } from "@/lib/db/schema"

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
  const { data } = await supabase.from("works").select("id")
  const ids = new Set((data ?? []).map((r: { id: string }) => r.id))
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
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("listWorks error:", error.message)
    return []
  }
  return (data as WorkRow[]).map(rowToWork)
}

export async function createWork(input: WorkInput) {
  const id = input.id?.trim() || (await generateId(input.title))
  const { error } = await supabase.from("works").insert({
    id,
    title: input.title,
    subtitle: input.subtitle,
    tags: input.tags,
    year: input.year,
    client: input.client,
    role: input.role,
    cover_image: input.coverImage,
    overview: input.overview,
    body: input.body,
    gallery: input.gallery,
    order: input.order,
    published: input.published,
  })
  if (error) throw new Error(error.message)
  revalidate(id)
  return { id }
}

export async function updateWork(id: string, input: WorkInput) {
  const { error } = await supabase
    .from("works")
    .update({
      title: input.title,
      subtitle: input.subtitle,
      tags: input.tags,
      year: input.year,
      client: input.client,
      role: input.role,
      cover_image: input.coverImage,
      overview: input.overview,
      body: input.body,
      gallery: input.gallery,
      order: input.order,
      published: input.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidate(id)
  return { id }
}

export async function deleteWork(id: string) {
  const { error } = await supabase.from("works").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidate(id)
}
