import Link from "next/link"
import { getPublishedWorks } from "@/lib/works"
import { Reveal } from "@/components/reveal"

function Arrow() {
  return (
    <svg viewBox="0 0 40 16" className="h-3 w-10" fill="none" aria-hidden="true">
      <path d="M0 8h38M32 2l6 6-6 6" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export async function FeaturedWork() {
  const works = await getPublishedWorks()

  return (
    <section id="work" className="relative z-10 bg-background mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal from="up">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-muted-foreground">03</span>
            <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
              FEATURED WORK
            </span>
          </div>
          <Link
            href="/works"
            className="group flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            VIEW ALL WORK <Arrow />
          </Link>
        </div>
      </Reveal>

      <ul className="mt-12 border-t border-border/40">
        {works.map((item, i) => (
          <Reveal as="li" key={item.id} from="up" delay={i * 80}>
            <Link
              href={`/works/${item.id}`}
              className="group grid grid-cols-1 items-center gap-6 border-b border-border/40 py-6 sm:grid-cols-[200px_1fr_auto] sm:gap-8"
            >
              <div className="overflow-hidden rounded-sm">
                <img
                  src={item.coverImage || "/placeholder.svg"}
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
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
