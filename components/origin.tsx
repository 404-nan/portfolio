export function Origin() {
  return (
    <section
      id="origin"
      className="border-t border-border/40 bg-card/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-muted-foreground">02</span>
              <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
                ORIGIN
              </span>
            </div>
            <p className="mt-8 font-serif text-xl text-foreground">NaN という名前の由来</p>
            <p className="mt-4 font-serif text-4xl font-light tracking-wide text-foreground sm:text-5xl">
              Na &nbsp;+&nbsp; N &nbsp;=&nbsp; NaN
            </p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              「数にならない値 (NaN)」は、数字の世界では意味をなさない
              <span className="text-foreground">&quot;ものを示す記号&quot;</span>。
              私たちは、その可能性に美しさを見出し、まだ名前のない価値を生み出しています。
            </p>
          </div>

          <div className="overflow-hidden rounded-sm">
            <img
              src="/images/crystal-macro.png"
              alt="光を反射する鉱物結晶のマクロ撮影"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
