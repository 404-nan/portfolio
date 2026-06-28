const WORK = [
  {
    title: "BRAND EXPERIENCE",
    tags: "Identity / Art Direction / Web",
    image: "/images/hero-sculpture.png",
  },
  {
    title: "DIGITAL PRODUCT",
    tags: "UI/UX / Frontend & System",
    image: "/images/material-study.png",
  },
  {
    title: "SPACE & EXPERIENCE",
    tags: "Concept / Spatial Design / Direction",
    image: "/images/packaging.png",
  },
]

function Arrow() {
  return (
    <svg viewBox="0 0 40 16" className="h-3 w-10" fill="none" aria-hidden="true">
      <path d="M0 8h38M32 2l6 6-6 6" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function FeaturedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-muted-foreground">03</span>
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
            FEATURED WORK
          </span>
        </div>
        <a
          href="#contact"
          className="group flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
        >
          VIEW ALL WORK <Arrow />
        </a>
      </div>

      <ul className="mt-12 border-t border-border/40">
        {WORK.map((item) => (
          <li key={item.title}>
            <a
              href="#contact"
              className="group grid grid-cols-1 items-center gap-6 border-b border-border/40 py-6 sm:grid-cols-[200px_1fr_auto] sm:gap-8"
            >
              <div className="overflow-hidden rounded-sm">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={`${item.title} の事例ビジュアル`}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-mono text-lg tracking-wide text-foreground">{item.title}</h3>
                <p className="mt-2 font-serif text-sm text-muted-foreground">{item.tags}</p>
              </div>
              <span className="hidden text-muted-foreground transition-transform duration-300 group-hover:translate-x-2 group-hover:text-foreground sm:block">
                <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
