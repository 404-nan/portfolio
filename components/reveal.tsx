"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Animation distance/direction */
  from?: "up" | "down" | "left" | "right" | "none"
  /** Delay in ms before the reveal starts once in view */
  delay?: number
  /** Render as a specific element */
  as?: "div" | "section" | "li" | "span"
}

/**
 * Reveals its children with a fade + slide once they scroll into view.
 * Uses IntersectionObserver so it animates only on first entry.
 */
export function Reveal({ children, className, from = "up", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => setShown(true), delay)
            observer.unobserve(entry.target)
            return () => clearTimeout(t)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const offset =
    from === "up"
      ? "translate-y-10"
      : from === "down"
        ? "-translate-y-10"
        : from === "left"
          ? "translate-x-10"
          : from === "right"
            ? "-translate-x-10"
            : ""

  const Tag = as as keyof JSX.IntrinsicElements

  return (
    <Tag
      // @ts-expect-error ref typing across polymorphic tag
      ref={ref}
      className={cn(
        "transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        shown ? "translate-x-0 translate-y-0 opacity-100 blur-0" : `${offset} opacity-0 blur-[6px]`,
        className,
      )}
    >
      {children}
    </Tag>
  )
}
