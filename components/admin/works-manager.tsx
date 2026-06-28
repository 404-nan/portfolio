"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
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

export function WorksManager({ initialWorks }: { initialWorks: Work[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<{ mode: "new" | "edit"; id?: string } | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm(0))
  const [pending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)

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
          <button
            onClick={startAdd}
            className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs tracking-wider text-neutral-300 transition-all hover:bg-white/10"
          >
            <Plus className="h-3.5 w-3.5" /> 追加
          </button>
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
            プロジェクトの追加・編集・削除ができます。表示順は「並び順」の数値（小さい順）で決まります。
          </p>
        </div>

        {initialWorks.length === 0 ? (
          <div className="mt-20 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-neutral-700" />
            <p className="mt-4 font-mono text-sm text-neutral-600">まだ Work がありません</p>
            <button
              onClick={startAdd}
              className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-neutral-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> 最初の Work を追加
            </button>
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
    </div>
  )
}

/* ---------------- Editor ---------------- */

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

          <Field label="カバー画像パス">
            <input
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="/images/hero-sculpture.png"
              className={inputCls}
            />
          </Field>
          {form.coverImage && (
            <div className="h-28 w-full overflow-hidden rounded-sm border border-white/10 bg-neutral-900">
              <img src={form.coverImage} alt="preview" className="h-full w-full object-cover" />
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

          <Field label="ギャラリー画像パス（1行に1つ）">
            <textarea
              value={form.galleryText}
              onChange={(e) => set("galleryText", e.target.value)}
              placeholder={"/images/hero-sculpture.png\n/images/nan-logo.png"}
              rows={4}
              className={inputCls}
            />
          </Field>
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="aspect-video overflow-hidden rounded-sm border border-white/10 bg-neutral-900"
                >
                  <img src={src || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
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
