import { supabase } from "@/lib/supabase"
import { rowToWork, type Work, type WorkRow } from "@/lib/db/schema"

export type { Work }

export async function getWorks(): Promise<Work[]> {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("getWorks error:", error.message)
    return []
  }
  return (data as WorkRow[]).map(rowToWork)
}

export async function getPublishedWorks(): Promise<Work[]> {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("published", true)
    .order("order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("getPublishedWorks error:", error.message)
    return []
  }
  return (data as WorkRow[]).map(rowToWork)
}

export async function getWorkById(id: string): Promise<Work | null> {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null // not found
    console.error("getWorkById error:", error.message)
    return null
  }
  return rowToWork(data as WorkRow)
}
