"use client"

import { useEffect, useRef, useState } from "react"
import { GlitchText } from "@/components/glitch-text"

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
        {/* ENTRY LAYER — slow zoom-out + brighten on load (transition only depends on `entered`) */}
        <div
          className="absolute inset-0 transition-[transform,filter] duration-[2400ms] ease-out will-change-transform"
          style={{
            transform: entered ? "scale(1.05)" : "scale(1.25)",
            filter: entered ? "brightness(0.5)" : "brightness(0)",
          }}
        >
          {/* SCROLL LAYER — parallax + fade, driven directly by scroll (no transition = no lag) */}
          <img
            src="/images/hero-sculpture.png"
            alt="ダークストーンで造形された NaN のロゴと、その背後で輝く三日月状の光"
            className="absolute inset-0 h-full w-full object-cover contrast-110 will-change-transform"
            style={{
              transform: `scale(${1 + progress * 0.12}) translateY(${progress * 8}%)`,
              opacity: 1 - progress * 0.7,
            }}
          />
        </div>

        {/* Vignette + readability gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 bg-background"
          style={{ opacity: progress * 0.6 }}
        />

        {/* Copy */}
        <div className="relative z-10 mx-auto flex h-[100svh] max-w-6xl flex-col justify-center px-6 pt-24">
          {/* Each line: entry fade on the outer wrapper (transition), scroll motion on the inner (no transition). */}
          <div
            className="mb-8 transition-all duration-[1400ms] ease-out"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "200ms",
            }}
          >
            <p
              className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground"
              style={{ opacity: 1 - progress * 1.5 }}
            >
              CREATIVE STUDIO — NaN
            </p>
          </div>

          <div
            className="transition-all duration-[1600ms] ease-out"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(40px)",
              transitionDelay: "400ms",
            }}
          >
            <h1
              className="font-serif text-5xl font-light leading-[1.25] tracking-tight text-foreground text-balance sm:text-6xl md:text-7xl"
              style={{
                opacity: 1 - progress * 1.4,
                transform: `translateY(${-progress * 40}px)`,
              }}
            >
              測れないものを、
              <br />
              <GlitchText text="形にする。" />
            </h1>
          </div>

          <div
            className="mt-8 transition-all duration-[1600ms] ease-out"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "700ms",
            }}
          >
            <p
              className="font-mono text-sm tracking-[0.3em] text-muted-foreground"
              style={{
                opacity: 1 - progress * 1.5,
                transform: `translateY(${-progress * 24}px)`,
              }}
            >
              Na &nbsp;+&nbsp; N &nbsp;=&nbsp; NaN
            </p>
          </div>
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
