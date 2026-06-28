const STEPS = [
  { no: "01", title: "課題の探索", sub: "本質を見極める" },
  { no: "02", title: "構造化と設計", sub: "価値の骨格をつくる" },
  { no: "03", title: "体験のデザイン", sub: "感情に届くカタチにする" },
  { no: "04", title: "実装と最適化", sub: "届け、育て、進化させる" },
]

export function Process() {
  return (
    <section
      id="process"
      className="border-t border-border/40 bg-card/30"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-muted-foreground">04</span>
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
            PROCESS
          </span>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-8">
          {STEPS.map((step) => (
            <div key={step.no} className="text-center">
              <p className="font-serif text-4xl font-light text-foreground sm:text-5xl">
                {step.no}
              </p>
              <p className="mt-4 text-sm text-foreground">{step.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
