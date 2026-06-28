"use client"

import { useEffect, useRef, useState } from "react"

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    // Trigger the opening reveal once mounted.
    const raf = requestAnimationFrame(() => setEntered(true))

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const vh = window.innerHeight || 1
        // 0 at top, 1 once the hero has scrolled one full viewport.
        const p = Math.min(Math.max(window.scrollY / vh, 0), 1)
        setProgress(p)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} id="top" className="relative h-[160svh] w-full">
      {/* Sticky cinematic stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Background sculpture — slow zoom-out on entry, parallax + fade on scroll */}
        <img
          src="/images/hero-sculpture.png"
          alt="ダークストーンで造形された NaN のロゴと、その背後で輝く三日月状の光"
          className="absolute inset-0 h-full w-full object-cover contrast-110 transition-[transform,filter,opacity] duration-[2400ms] ease-out"
          style={{
            transform: `scale(${(entered ? 1.05 : 1.25) + progress * 0.12}) translateY(${progress * 8}%)`,
            filter: `brightness(${(entered ? 0.5 : 0) - progress * 0.25})`,
            opacity: 1 - progress * 0.7,
          }}
        />

        {/* Vignette + readability gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 bg-background"
          style={{ opacity: progress * 0.6 }}
        />

        {/* Copy */}
        <div className="relative z-10 mx-auto flex h-[100svh] max-w-6xl flex-col justify-center px-6 pt-24">
          <p
            className="mb-8 font-mono text-[10px] tracking-[0.5em] text-muted-foreground transition-all duration-[1400ms] ease-out"
            style={{
              opacity: entered ? 1 - progress * 1.5 : 0,
              transform: `translateY(${entered ? 0 : 20}px)`,
              transitionDelay: "200ms",
            }}
          >
            CREATIVE STUDIO — NaN
          </p>
          <h1
            className="font-serif text-5xl font-light leading-[1.25] tracking-tight text-foreground text-balance transition-all duration-[1600ms] ease-out sm:text-6xl md:text-7xl"
            style={{
              opacity: entered ? 1 - progress * 1.4 : 0,
              transform: `translateY(${entered ? -progress * 40 : 40}px)`,
              transitionDelay: "400ms",
            }}
          >
            測れないものを、
            <br />
            形にする。
          </h1>
          <p
            className="mt-8 font-mono text-sm tracking-[0.3em] text-muted-foreground transition-all duration-[1600ms] ease-out"
            style={{
              opacity: entered ? 1 - progress * 1.5 : 0,
              transform: `translateY(${entered ? -progress * 24 : 24}px)`,
              transitionDelay: "700ms",
            }}
          >
            Na &nbsp;+&nbsp; N &nbsp;=&nbsp; NaN
          </p>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 transition-opacity duration-700"
          style={{ opacity: entered ? 1 - progress * 3 : 0 }}
        >
          <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            SCROLL
          </span>
          <span className="h-12 w-px animate-pulse bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  )
}
