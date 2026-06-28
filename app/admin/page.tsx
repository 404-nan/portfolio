"use client"

import { useCallback, useEffect, useState } from "react"
import { NanLogo } from "@/components/nan-logo"
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  Pencil,
  X,
  ImageIcon,
} from "lucide-react"

/* ---------- types ---------- */
type Work = {
  id: string
  title: string
  tags: string
  image: string
  order: number
}

/* ---------- helpers ---------- */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

/* ================================================================== */
/*  Admin page                                                         */
/* ================================================================== */
export default function AdminPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  /* editing */
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", tags: "", image: "" })

  /* drag‑and‑drop */
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  /* ---- fetch ---- */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/works")
      const data: Work[] = await res.json()
      setWorks(data.sort((a, b) => a.order - b.order))
    } catch {
      setWorks([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  /* ---- save ---- */
  async function save() {
    setSaving(true)
    try {
      const ordered = works.map((w, i) => ({ ...w, order: i }))
      const res = await fetch("/api/works", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordered),
      })
      if (!res.ok) throw new Error("Save failed")
      setWorks(ordered)
      setDirty(false)
      flash("保存しました ✓")
    } catch {
      flash("保存に失敗しました")
    }
    setSaving(false)
  }

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  /* ---- CRUD ---- */
  function startAdd() {
    setEditId("__new__")
    setForm({ title: "", tags: "", image: "" })
  }

  function startEdit(w: Work) {
    setEditId(w.id)
    setForm({ title: w.title, tags: w.tags, image: w.image })
  }

  function cancelEdit() {
    setEditId(null)
    setForm({ title: "", tags: "", image: "" })
  }

  function confirmEdit() {
    if (!form.title.trim()) return
    if (editId === "__new__") {
      const newWork: Work = {
        id: uid(),
        title: form.title,
        tags: form.tags,
        image: form.image || "/placeholder.svg",
        order: works.length,
      }
      setWorks((prev) => [...prev, newWork])
    } else {
      setWorks((prev) =>
        prev.map((w) =>
          w.id === editId ? { ...w, title: form.title, tags: form.tags, image: form.image } : w,
        ),
      )
    }
    setDirty(true)
    cancelEdit()
  }

  function remove(id: string) {
    setWorks((prev) => prev.filter((w) => w.id !== id))
    setDirty(true)
  }

  /* ---- drag ---- */
  function onDragStart(i: number) {
    setDragIdx(i)
  }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    setWorks((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx, 1)
      next.splice(i, 0, moved)
      return next
    })
    setDragIdx(i)
    setDirty(true)
  }

  /* ================================================================ */
  return (
    <div className="min-h-screen bg-[#111] text-neutral-200">
      {/* ---- header ---- */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-neutral-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <NanLogo className="h-4" />
            <span className="font-mono text-xs tracking-[0.2em] text-neutral-500">
              ADMIN
            </span>
          </div>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs tracking-wider text-neutral-300 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </header>

      {/* ---- toast ---- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 rounded border border-white/10 bg-neutral-900 px-5 py-3 font-mono text-sm text-neutral-300 shadow-2xl">
          {toast}
        </div>
      )}

      {/* ---- content ---- */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-light text-white">Works 管理</h1>
            <p className="mt-1 text-sm text-neutral-500">
              ドラッグで並び替え・追加・編集・削除ができます
            </p>
          </div>
          <button
            onClick={startAdd}
            className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs tracking-wider text-neutral-300 transition-all hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" /> 追加
          </button>
        </div>

        {/* ---- list ---- */}
        {loading ? (
          <div className="mt-20 text-center font-mono text-sm text-neutral-600">読み込み中…</div>
        ) : works.length === 0 && editId !== "__new__" ? (
          <div className="mt-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-neutral-700" />
            <p className="mt-4 font-mono text-sm text-neutral-600">
              まだ Work がありません
            </p>
            <button
              onClick={startAdd}
              className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-neutral-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> 最初の Work を追加
            </button>
          </div>
        ) : (
          <ul className="mt-8 space-y-2">
            {works.map((w, i) => (
              <li
                key={w.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={() => setDragIdx(null)}
                className={`group rounded-lg border transition-all ${
                  dragIdx === i
                    ? "border-white/30 bg-white/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                {editId === w.id ? (
                  /* inline edit */
                  <EditRow
                    form={form}
                    setForm={setForm}
                    onConfirm={confirmEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  <div className="flex items-center gap-4 px-4 py-4">
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-neutral-600 active:cursor-grabbing" />
                    <div className="h-14 w-24 shrink-0 overflow-hidden rounded-sm bg-neutral-900">
                      <img
                        src={w.image || "/placeholder.svg"}
                        alt={w.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-sm tracking-wide text-white">
                        {w.title}
                      </p>
                      <p className="mt-0.5 truncate font-serif text-xs text-neutral-500">
                        {w.tags}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => startEdit(w)}
                        className="rounded p-2 text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(w.id)}
                        className="rounded p-2 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}

            {/* new-item row */}
            {editId === "__new__" && (
              <li className="rounded-lg border border-white/20 bg-white/[0.04]">
                <EditRow
                  form={form}
                  setForm={setForm}
                  onConfirm={confirmEdit}
                  onCancel={cancelEdit}
                  isNew
                />
              </li>
            )}
          </ul>
        )}

        {dirty && (
          <p className="mt-6 text-center font-mono text-xs text-amber-500/80">
            未保存の変更があります — 上の「保存」ボタンを押してください
          </p>
        )}
      </main>
    </div>
  )
}

/* ================================================================== */
/*  Inline edit row                                                    */
/* ================================================================== */
function EditRow({
  form,
  setForm,
  onConfirm,
  onCancel,
  isNew = false,
}: {
  form: { title: string; tags: string; image: string }
  setForm: React.Dispatch<React.SetStateAction<{ title: string; tags: string; image: string }>>
  onConfirm: () => void
  onCancel: () => void
  isNew?: boolean
}) {
  return (
    <div className="space-y-3 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-wider text-neutral-500">
          {isNew ? "新規 WORK" : "編集"}
        </span>
        <button onClick={onCancel} className="rounded p-1 text-neutral-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <input
        autoFocus
        placeholder="タイトル（例: BRAND EXPERIENCE）"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
      />
      <input
        placeholder="タグ（例: Identity / Art Direction / Web）"
        value={form.tags}
        onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
      />
      <input
        placeholder="画像パス（例: /images/hero-sculpture.png）"
        value={form.image}
        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
        className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
      />
      {form.image && (
        <div className="h-20 w-36 overflow-hidden rounded-sm bg-neutral-900">
          <img
            src={form.image}
            alt="preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="rounded border border-white/10 px-4 py-1.5 font-mono text-xs text-neutral-400 transition-colors hover:bg-white/5"
        >
          キャンセル
        </button>
        <button
          onClick={onConfirm}
          disabled={!form.title.trim()}
          className="rounded border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          {isNew ? "追加" : "更新"}
        </button>
      </div>
    </div>
  )
}
