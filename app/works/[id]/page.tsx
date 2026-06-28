import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Reveal } from "@/components/reveal"
import { getWorkById, getPublishedWorks } from "@/lib/works"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const work = await getWorkById(id)
  if (!work) return { title: "Not Found — NaN" }
  return {
    title: `${work.title} — NaN`,
    description: work.overview || work.subtitle,
  }
}

function Meta({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="border-t border-border/40 py-4">
      <dt className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">{label}</dt>
      <dd className="mt-2 font-serif text-sm leading-relaxed text-foreground">{value}</dd>
    </div>
  )
}

export default async function WorkDetailPage({ params }: Params) {
  const { id } = await params
  const work = await getWorkById(id)
  if (!work || !work.published) notFound()

  const all = await getPublishedWorks()
  const idx = all.findIndex((w) => w.id === work.id)
  const next = all[(idx + 1) % all.length]
  const gallery = Array.isArray(work.gallery) ? work.gallery : []

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Cinematic cover */}
      <section className="relative h-[80svh] min-h-[480px] w-full overflow-hidden">
        <img
          src={work.coverImage || "/placeholder.svg"}
          alt={`${work.title} のカバービジュアル`}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.5] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-16">
          <Reveal from="up">
            <Link
              href="/works"
              className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              ← WORKS
            </Link>
            <p className="mt-6 font-mono text-xs tracking-[0.3em] text-muted-foreground">
              {work.year} {work.tags ? `· ${work.tags}` : ""}
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-[1.15] text-foreground text-balance sm:text-5xl md:text-6xl">
              {work.title}
            </h1>
            {work.subtitle && (
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                {work.subtitle}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Body + meta */}
      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_280px] md:gap-16">
          <Reveal from="up" className="order-2 md:order-1">
            {work.overview && (
              <p className="font-serif text-xl font-light leading-relaxed text-foreground text-pretty md:text-2xl">
                {work.overview}
              </p>
            )}
            {work.body && (
              <div className="mt-10 space-y-6">
                {work.body.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground text-pretty">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal from="up" delay={120} className="order-1 md:order-2">
            <dl className="md:sticky md:top-28">
              <Meta label="CLIENT" value={work.client} />
              <Meta label="ROLE" value={work.role} />
              <Meta label="YEAR" value={work.year} />
              <Meta label="DISCIPLINE" value={work.tags} />
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
          <div className="grid gap-4 sm:gap-6">
            {gallery.map((src, i) => (
              <Reveal key={`${src}-${i}`} from="up" delay={(i % 2) * 80}>
                <div className="overflow-hidden rounded-sm border border-border/40">
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`${work.title} のギャラリー画像 ${i + 1}`}
                    className="w-full object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Next project */}
      {next && next.id !== work.id && (
        <section className="border-t border-border/40">
          <Link
            href={`/works/${next.id}`}
            className="group relative block overflow-hidden"
          >
            <img
              src={next.coverImage || "/placeholder.svg"}
              alt={`${next.title} へ`}
              className="absolute inset-0 h-full w-full object-cover brightness-[0.3] transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.4]"
            />
            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center md:py-32">
              <span className="font-mono text-[11px] tracking-[0.3em] text-muted-foreground">
                NEXT PROJECT
              </span>
              <span className="mt-4 font-serif text-3xl font-light text-foreground text-balance md:text-4xl">
                {next.title}
              </span>
            </div>
          </Link>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
