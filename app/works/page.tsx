import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Reveal } from "@/components/reveal"
import { getPublishedWorks } from "@/lib/works"

export const metadata: Metadata = {
  title: "Works — NaN",
  description: "NaN が手がけたプロジェクトの一覧。ブランド、プロダクト、空間まで。",
}

function Arrow() {
  return (
    <svg viewBox="0 0 40 16" className="h-3 w-10" fill="none" aria-hidden="true">
      <path d="M0 8h38M32 2l6 6-6 6" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export default async function WorksPage() {
  const works = await getPublishedWorks()

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-36 md:pt-44">
        <Reveal from="up">
          <span className="font-mono text-xs tracking-[0.4em] text-muted-foreground">WORKS</span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-[1.2] text-foreground text-balance sm:text-5xl md:text-6xl">
            つくったものが、
            <br />
            世界の見え方を変えていく。
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            ブランド、デジタルプロダクト、空間。領域を越えて手がけたプロジェクトの記録です。
          </p>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 pb-32">
        {works.length === 0 ? (
          <p className="py-24 text-center font-mono text-sm text-muted-foreground">
            まだ Work がありません。
          </p>
        ) : (
          <ul className="grid gap-px overflow-hidden rounded-sm border border-border/40 bg-border/40 sm:grid-cols-2">
            {works.map((item, i) => (
              <Reveal as="li" key={item.id} from="up" delay={(i % 2) * 90}>
                <Link
                  href={`/works/${item.id}`}
                  className="group flex h-full flex-col bg-background transition-colors hover:bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={item.coverImage || "/placeholder.svg"}
                      alt={`${item.title} の事例ビジュアル`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:brightness-100"
                    />
                    <span className="absolute left-4 top-4 font-mono text-xs tracking-[0.2em] text-foreground/70">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <h2 className="font-mono text-lg tracking-wide text-foreground">{item.title}</h2>
                    {item.subtitle && (
                      <p className="font-serif text-sm leading-relaxed text-muted-foreground">
                        {item.subtitle}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                        {item.tags}
                      </span>
                      <span className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-foreground">
                        <Arrow />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}
