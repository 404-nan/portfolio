import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  client TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]',
  "order" INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`

export async function GET() {
  try {
    await pool.query(CREATE_TABLE_SQL)
    return NextResponse.json({ ok: true, message: "works table created" })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
