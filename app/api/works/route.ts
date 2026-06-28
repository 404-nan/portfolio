import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "works.json")

export async function GET() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8")
    const works = JSON.parse(raw)
    return NextResponse.json(works)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const works = await request.json()
    fs.writeFileSync(DATA_PATH, JSON.stringify(works, null, 2), "utf-8")
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
