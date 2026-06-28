import { cn } from "@/lib/utils"

/**
 * Official NaN brand mark. The source asset is a black logotype on a white
 * background, so on the dark site we invert it to render as a white mark while
 * the (now black) background blends into the near-black surface.
 * Height is controlled via `className` (e.g. "h-5"); width scales automatically.
 */
export function NanLogo({ className }: { className?: string }) {
  return (
    <img
      src="/images/nan-logo.png"
      alt="NaN"
      className={cn(
        "w-auto select-none object-contain mix-blend-screen invert",
        className,
      )}
    />
  )
}
