export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background sculpture */}
      <img
        src="/images/hero-sculpture.png"
        alt="ダークストーンで造形された NaN のロゴと、その背後で輝く三日月状の光"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.45] contrast-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

      {/* Copy */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pt-24">
        <h1 className="font-serif text-5xl font-light leading-[1.25] tracking-tight text-foreground text-balance sm:text-6xl md:text-7xl">
          測れないものを、
          <br />
          形にする。
        </h1>
        <p className="mt-8 font-mono text-sm tracking-[0.3em] text-muted-foreground">
          Na &nbsp;+&nbsp; N &nbsp;=&nbsp; NaN
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
          SCROLL
        </span>
        <span className="h-12 w-px animate-pulse bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  )
}
