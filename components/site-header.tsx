"use client"

import { useState } from "react"
import { NanLogo } from "./nan-logo"

const NAV = [
  { label: "CONCEPT", jp: "コンセプト", href: "/#concept" },
  { label: "ORIGIN", jp: "由来", href: "/#origin" },
  { label: "WORKS", jp: "実績", href: "/works" },
  { label: "PROCESS", jp: "プロセス", href: "/#process" },
  { label: "CONTACT", jp: "お問い合わせ", href: "/#contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" aria-label="NaN — ホーム" className="text-foreground">
          <NanLogo className="h-5" />
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="メニューを開く"
          className="flex h-10 w-10 flex-col items-end justify-center gap-[6px]"
        >
          <span
            className={`h-px w-7 bg-foreground transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-7 bg-foreground transition-all duration-300 ${
              open ? "translate-y-[-1px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-8">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-5 border-b border-border/40 py-5"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-3xl tracking-wide text-foreground transition-opacity group-hover:opacity-60 sm:text-4xl">
                {item.label}
              </span>
              <span className="ml-auto self-center text-xs text-muted-foreground">{item.jp}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
