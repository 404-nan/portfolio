"use client"

import { useEffect, useRef, useState } from "react"

// Display font CSS variables registered in app/layout.tsx. These are the
// fonts the roulette cycles through. The serif is included so it can also
// land back on the "normal" look.
const FONTS = [
  "var(--font-noto-serif)",
  "var(--font-dela)",
  "var(--font-reggae)",
  "var(--font-rocknroll)",
  "var(--font-rampart)",
  "var(--font-dot)",
  "var(--font-yuji)",
  "var(--font-hachi)",
  "var(--font-train)",
  "var(--font-stick)",
]

/**
 * Slot-machine / roulette font effect. The text rapidly cycles through random
 * fonts (the "spin"), then lands on a random font and holds for ~3s, then
 * spins again — with a glitchy, broken feel during the spin.
 */
export function GlitchText({ text, className }: { text: string; className?: string }) {
  const [fontIndex, setFontIndex] = useState(0)
  // "spin" while cycling, "settle" right after landing, "hold" while resting.
  const [phase, setPhase] = useState<"spin" | "settle" | "hold">("hold")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    let cancelled = false
    const track = (t: ReturnType<typeof setTimeout>) => {
      timers.current.push(t)
      return t
    }

    // Constant cadence for every font swap — no acceleration / deceleration.
    const SWAP_INTERVAL = 90

    const spin = () => {
      if (cancelled) return
      setPhase("spin")
      // Number of rapid font swaps before it locks in.
      const totalSwaps = 12 + Math.floor(Math.random() * 10)
      let swaps = 0

      const step = () => {
        if (cancelled) return
        setFontIndex(Math.floor(Math.random() * FONTS.length))
        swaps += 1
        if (swaps >= totalSwaps) {
          // Land on a random font and settle.
          setPhase("settle")
          // Hold ~3s (slightly randomized) before spinning again.
          track(setTimeout(spin, 2800 + Math.random() * 900))
          track(setTimeout(() => !cancelled && setPhase("hold"), 460))
          return
        }
        // Same delay every step for a steady, constant-speed roulette.
        track(setTimeout(step, SWAP_INTERVAL))
      }
      step()
    }

    // Initial pause so the headline reads normally first, then start spinning.
    track(setTimeout(spin, 1600))

    return () => {
      cancelled = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  return (
    <span
      className={`${className ?? ""} ${
        phase === "spin" ? "glitch-spin" : phase === "settle" ? "glitch-settle" : ""
      }`}
      style={{ fontFamily: FONTS[fontIndex], display: "inline-block" }}
    >
      {text}
    </span>
  )
}
