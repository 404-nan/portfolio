import { NanLogo } from "./nan-logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <NanLogo className="h-4 text-foreground" />
          <span className="font-serif text-xs text-muted-foreground">
            © NaN. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs tracking-[0.2em] text-muted-foreground">
          <a href="#top" className="transition-colors hover:text-foreground">
            INSTAGRAM
          </a>
          <a href="#top" className="transition-colors hover:text-foreground">
            X
          </a>
        </div>
      </div>
    </footer>
  )
}
