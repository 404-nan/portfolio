export function Concept() {
  return (
    <section id="concept" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-muted-foreground">01</span>
            <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
              CONCEPT
            </span>
          </div>
          <h2 className="mt-8 font-serif text-3xl font-light leading-snug text-foreground text-balance sm:text-4xl">
            感性と構造のあいだに、
            <br />
            新しい答えをつくる。
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            NaN は、デザインとテクノロジーの境界を越え、本質的な価値にフォーカスを当てるクリエイティブスタジオです。見えない課題を見つめ、まだ存在しない体験をカタチにします。
          </p>
        </div>

        <div className="overflow-hidden rounded-sm">
          <img
            src="/images/sketch-logo.png"
            alt="NaN ロゴの構成を検討した鉛筆スケッチ"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
