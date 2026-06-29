"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ClipboardPaste,
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { NanLogo } from "@/components/nan-logo"
import { createWork, deleteWork, updateWork, type WorkInput } from "@/app/actions/works"
import type { Work } from "@/lib/db/schema"

type FormState = {
  title: string
  subtitle: string
  tags: string
  year: string
  client: string
  role: string
  coverImage: string
  overview: string
  body: string
  galleryText: string
  order: number
  published: boolean
}

function emptyForm(order: number): FormState {
  return {
    title: "",
    subtitle: "",
    tags: "",
    year: new Date().getFullYear().toString(),
    client: "",
    role: "",
    coverImage: "",
    overview: "",
    body: "",
    galleryText: "",
    order,
    published: true,
  }
}

function workToForm(w: Work): FormState {
  return {
    title: w.title,
    subtitle: w.subtitle,
    tags: w.tags,
    year: w.year,
    client: w.client,
    role: w.role,
    coverImage: w.coverImage,
    overview: w.overview,
    body: w.body,
    galleryText: (Array.isArray(w.gallery) ? w.gallery : []).join("\n"),
    order: w.order,
    published: w.published,
  }
}

function formToInput(f: FormState): WorkInput {
  return {
    title: f.title.trim(),
    subtitle: f.subtitle.trim(),
    tags: f.tags.trim(),
    year: f.year.trim(),
    client: f.client.trim(),
    role: f.role.trim(),
    coverImage: f.coverImage.trim(),
    overview: f.overview.trim(),
    body: f.body,
    gallery: f.galleryText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    order: Number(f.order) || 0,
    published: f.published,
  }
}

/* ============================================================
   JSON Import Format (for GPTs / copy-paste):
   {
     "title": "Project Name",
     "subtitle": "Short description",
     "year": "2025",
     "tags": "Design / Web",
     "client": "Client",
     "role": "Art Direction",
     "coverImage": "https://...",
     "overview": "Lead text",
     "body": "Detailed description...",
     "gallery": ["url1", "url2"],
     "published": true
   }
   ============================================================ */

function parseJsonImport(text: string): Partial<FormState> | null {
  try {
    // Try to extract JSON from the text (handles markdown code blocks)
    let jsonStr = text.trim()
    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/)
    if (fenceMatch) jsonStr = fenceMatch[1].trim()

    const obj = JSON.parse(jsonStr)
    if (!obj || typeof obj !== "object") return null

    return {
      title: String(obj.title || ""),
      subtitle: String(obj.subtitle || ""),
      tags: String(obj.tags || ""),
      year: String(obj.year || new Date().getFullYear()),
      client: String(obj.client || ""),
      role: String(obj.role || ""),
      coverImage: String(obj.coverImage || obj.cover_image || ""),
      overview: String(obj.overview || ""),
      body: String(obj.body || ""),
      galleryText: Array.isArray(obj.gallery) ? obj.gallery.join("\n") : "",
      published: obj.published !== false,
    }
  } catch {
    return null
  }
}

export function WorksManager({ initialWorks }: { initialWorks: Work[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<{ mode: "new" | "edit"; id?: string } | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm(0))
  const [pending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState("")

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function startAdd() {
    setForm(emptyForm(initialWorks.length))
    setEditing({ mode: "new" })
  }

  function startEdit(w: Work) {
    setForm(workToForm(w))
    setEditing({ mode: "edit", id: w.id })
  }

  function close() {
    setEditing(null)
  }

  function submit() {
    if (!form.title.trim()) {
      flash("タイトルを入力してください")
      return
    }
    const input = formToInput(form)
    startTransition(async () => {
      try {
        if (editing?.mode === "edit" && editing.id) {
          await updateWork(editing.id, input)
          flash("更新しました")
        } else {
          await createWork(input)
          flash("追加しました")
        }
        setEditing(null)
        router.refresh()
      } catch {
        flash("保存に失敗しました")
      }
    })
  }

  function remove(id: string) {
    if (!confirm("この Work を削除しますか？この操作は取り消せません。")) return
    startTransition(async () => {
      try {
        await deleteWork(id)
        flash("削除しました")
        router.refresh()
      } catch {
        flash("削除に失敗しました")
      }
    })
  }

  function handleImport() {
    const parsed = parseJsonImport(importText)
    if (!parsed || !parsed.title) {
      flash("JSONの解析に失敗しました")
      return
    }
    setForm({ ...emptyForm(initialWorks.length), ...parsed, order: initialWorks.length })
    setShowImport(false)
    setImportText("")
    setEditing({ mode: "new" })
    flash("JSONを読み込みました — 確認して追加してください")
  }

  function handleDirectImport() {
    const parsed = parseJsonImport(importText)
    if (!parsed || !parsed.title) {
      flash("JSONの解析に失敗しました")
      return
    }
    const filled: FormState = { ...emptyForm(initialWorks.length), ...parsed, order: initialWorks.length }
    const input = formToInput(filled)
    startTransition(async () => {
      try {
        await createWork(input)
        flash("追加しました")
        setShowImport(false)
        setImportText("")
        router.refresh()
      } catch {
        flash("追加に失敗しました")
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-200">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f0f]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-neutral-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <NanLogo className="h-4" />
            <span className="font-mono text-xs tracking-[0.2em] text-neutral-500">ADMIN</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs tracking-wider text-neutral-300 transition-all hover:bg-white/10"
            >
              <ClipboardPaste className="h-3.5 w-3.5" /> JSON
            </button>
            <button
              onClick={startAdd}
              className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs tracking-wider text-neutral-300 transition-all hover:bg-white/10"
            >
              <Plus className="h-3.5 w-3.5" /> 追加
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded border border-white/10 bg-neutral-900 px-5 py-3 font-mono text-sm text-neutral-300 shadow-2xl">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div>
          <h1 className="font-serif text-2xl font-light text-white">Works 管理</h1>
          <p className="mt-1 text-sm text-neutral-500">
            プロジェクトの追加・編集・削除ができます。「JSON」ボタンでGPTsからコピペ追加も可能。
          </p>
        </div>

        {initialWorks.length === 0 ? (
          <div className="mt-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-neutral-700" />
            <p className="mt-4 font-mono text-sm text-neutral-600">まだ Work がありません</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={startAdd}
                className="inline-flex items-center gap-2 font-mono text-sm text-neutral-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" /> 手動で追加
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="inline-flex items-center gap-2 font-mono text-sm text-neutral-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                <ClipboardPaste className="h-3.5 w-3.5" /> JSONで追加
              </button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 space-y-2">
            {initialWorks.map((w) => (
              <li
                key={w.id}
                className="group flex items-center gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-4 transition-all hover:border-white/15 hover:bg-white/[0.04]"
              >
                <span className="w-6 shrink-0 text-center font-mono text-xs text-neutral-600">
                  {w.order}
                </span>
                <div className="h-14 w-24 shrink-0 overflow-hidden rounded-sm bg-neutral-900">
                  <img
                    src={w.coverImage || "/placeholder.svg"}
                    alt={w.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-mono text-sm tracking-wide text-white">
                    {w.title}
                    {!w.published && (
                      <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                        非公開
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate font-serif text-xs text-neutral-500">{w.tags}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href={`/works/${w.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-2 text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
                    title="詳細ページを開く"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </a>
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
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Editor drawer */}
      {editing && (
        <WorkEditor
          mode={editing.mode}
          form={form}
          setForm={setForm}
          onSubmit={submit}
          onClose={close}
          pending={pending}
        />
      )}

      {/* JSON Import modal */}
      {showImport && (
        <JsonImportModal
          value={importText}
          onChange={setImportText}
          onImport={handleImport}
          onDirectImport={handleDirectImport}
          onClose={() => { setShowImport(false); setImportText("") }}
          pending={pending}
        />
      )}
    </div>
  )
}

/* ============ JSON Import Modal ============ */

function JsonImportModal({
  value,
  onChange,
  onImport,
  onDirectImport,
  onClose,
  pending,
}: {
  value: string
  onChange: (v: string) => void
  onImport: () => void
  onDirectImport: () => void
  onClose: () => void
  pending: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-white/10 bg-[#141414] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-400">
            JSON インポート
          </span>
          <button onClick={onClose} className="rounded p-1 text-neutral-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-neutral-400">
            GPTsやChatGPTで生成したJSONを貼り付けてください。
            コードブロック（```json ...```）もそのまま貼れます。
          </p>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`{
  "title": "プロジェクト名",
  "subtitle": "サブタイトル",
  "year": "2025",
  "tags": "Design / Web",
  "client": "クライアント名",
  "role": "Art Direction",
  "coverImage": "https://...",
  "overview": "概要テキスト",
  "body": "本文...",
  "gallery": ["https://...", "https://..."]
}`}
            rows={14}
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs leading-relaxed text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded border border-white/10 px-4 py-2 font-mono text-xs text-neutral-400 transition-colors hover:bg-white/5"
          >
            キャンセル
          </button>
          <button
            onClick={onImport}
            disabled={!value.trim() || pending}
            className="rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-neutral-300 transition-colors hover:bg-white/10 disabled:opacity-30"
          >
            確認して編集
          </button>
          <button
            onClick={onDirectImport}
            disabled={!value.trim() || pending}
            className="rounded border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            {pending ? "追加中…" : "そのまま追加"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============ Image Uploader ============ */

function ImageUploader({
  onUploaded,
  label,
}: {
  onUploaded: (url: string) => void
  label?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.url) {
        onUploaded(data.url)
      } else {
        alert(data.error || "アップロードに失敗しました")
      }
    } catch {
      alert("アップロードに失敗しました")
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) handleFile(file)
  }

  return (
    <div
      className="flex items-center gap-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ""
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 rounded border border-dashed border-white/20 px-3 py-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
      >
        <Upload className="h-3 w-3" />
        {uploading ? "アップロード中…" : label || "画像をアップロード"}
      </button>
    </div>
  )
}

/* ============ Editor Drawer ============ */

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputCls =
  "w-full rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"

function WorkEditor({
  mode,
  form,
  setForm,
  onSubmit,
  onClose,
  pending,
}: {
  mode: "new" | "edit"
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  onSubmit: () => void
  onClose: () => void
  pending: boolean
}) {
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const gallery = form.galleryText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#141414] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#141414]/95 px-6 py-4 backdrop-blur">
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-400">
            {mode === "new" ? "新規 WORK" : "WORK を編集"}
          </span>
          <button onClick={onClose} className="rounded p-1 text-neutral-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <Field label="タイトル">
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="BRAND EXPERIENCE"
              className={inputCls}
            />
          </Field>

          <Field label="サブタイトル">
            <input
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="彫刻のように立ち上がるブランドの象徴"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="年">
              <input
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="2025"
                className={inputCls}
              />
            </Field>
            <Field label="並び順">
              <input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="タグ / 領域（スラッシュ区切り）">
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Identity / Art Direction / Web"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="クライアント">
              <input
                value={form.client}
                onChange={(e) => set("client", e.target.value)}
                placeholder="NaN Studio"
                className={inputCls}
              />
            </Field>
            <Field label="担当領域">
              <input
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Art Direction, Web"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="カバー画像">
            <div className="space-y-2">
              <input
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="URLを入力 or 画像をアップロード"
                className={inputCls}
              />
              <ImageUploader
                label="カバー画像をアップロード"
                onUploaded={(url) => set("coverImage", url)}
              />
            </div>
          </Field>
          {form.coverImage && (
            <div className="h-28 w-full overflow-hidden rounded-sm border border-white/10 bg-neutral-900">
              <img src={form.coverImage} alt="preview" className="h-full w-full object-cover" loading="lazy" />
            </div>
          )}

          <Field label="概要（リード文）">
            <textarea
              value={form.overview}
              onChange={(e) => set("overview", e.target.value)}
              placeholder="プロジェクトを一言で表すリード文"
              rows={3}
              className={inputCls}
            />
          </Field>

          <Field label="本文（改行で段落区切り）">
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"詳細な説明文。\n空行で段落を分けられます。"}
              rows={6}
              className={inputCls}
            />
          </Field>

          <Field label="ギャラリー画像（1行に1つのURL）">
            <div className="space-y-2">
              <textarea
                value={form.galleryText}
                onChange={(e) => set("galleryText", e.target.value)}
                placeholder={"https://example.com/image1.png\nhttps://example.com/image2.png"}
                rows={4}
                className={inputCls}
              />
              <ImageUploader
                label="ギャラリーに画像を追加"
                onUploaded={(url) =>
                  set("galleryText", form.galleryText ? form.galleryText + "\n" + url : url)
                }
              />
            </div>
          </Field>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="aspect-video overflow-hidden rounded-sm border border-white/10 bg-neutral-900"
                >
                  <img src={src || "/placeholder.svg"} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => set("published", !form.published)}
            className="flex w-full items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-sm text-neutral-300 transition-colors hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              {form.published ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {form.published ? "公開中" : "非公開"}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-neutral-500">
              クリックで切替
            </span>
          </button>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-white/10 bg-[#141414]/95 px-6 py-4 backdrop-blur">
          <button
            onClick={onClose}
            className="rounded border border-white/10 px-4 py-2 font-mono text-xs text-neutral-400 transition-colors hover:bg-white/5"
          >
            キャンセル
          </button>
          <button
            onClick={onSubmit}
            disabled={pending || !form.title.trim()}
            className="rounded border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            {pending ? "保存中…" : mode === "new" ? "追加する" : "更新する"}
          </button>
        </div>
      </div>
    </div>
  )
}
