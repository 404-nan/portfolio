import { cn } from "@/lib/utils"

/**
 * Official NaN brand mark. The source asset is a white logotype on a
 * transparent background, so it renders as a white mark directly on the dark
 * site without any inversion.
 * Height is controlled via `className` (e.g. "h-5"); width scales automatically.
 */
export function NanLogo({ className }: { className?: string }) {
  return (
    <img
      src="/images/nan-logo.png"
      alt="NaN"
      className={cn("w-auto select-none object-contain", className)}
    />
  )
}
