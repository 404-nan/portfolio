"use client"

import { useEffect, useState } from "react"
import { NanLogo } from "@/components/nan-logo"

/**
 * Opening animation. On first load a full-screen black overlay fades the white
 * NaN logo in, holds it briefly, then fades both the logo and the overlay out
 * to reveal the site. The overlay is removed from the DOM once finished.
 */
export function IntroOverlay() {
  // "in" -> logo fading in, "out" -> overlay fading away, "done" -> unmounted
  const [phase, setPhase] = useState<"in" | "out" | "done">("in")
  // Drives the initial 0 -> 1 fade once the component has mounted.
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Prevent scrolling while the intro plays.
    document.body.style.overflow = "hidden"

    const toShow = requestAnimationFrame(() => setShown(true))
    const toOut = setTimeout(() => setPhase("out"), 1900)
    const toDone = setTimeout(() => {
      setPhase("done")
      document.body.style.overflow = ""
    }, 3100)

    return () => {
      cancelAnimationFrame(toShow)
      clearTimeout(toOut)
      clearTimeout(toDone)
      document.body.style.overflow = ""
    }
  }, [])

  if (phase === "done") return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-[1200ms] ease-in-out ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <NanLogo
        className={`h-10 transition-opacity duration-[1100ms] ease-in-out sm:h-12 ${
          shown && phase === "in" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
