import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "ファイルがありません" }, { status: 400 })
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "png"
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const path = `uploads/${name}`

    const arrayBuffer = await file.arrayBuffer()
    const { error } = await supabase.storage
      .from("works")
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from("works")
      .getPublicUrl(path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "アップロードに失敗しました" },
      { status: 500 }
    )
  }
}
