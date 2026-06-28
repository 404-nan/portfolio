export function Contact() {
  return (
    <section id="contact" className="border-t border-border/40">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-24 md:py-32 lg:px-16">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-muted-foreground">05</span>
            <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
              CONTACT
            </span>
          </div>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
            プロジェクトのご相談やご質問など、
            <br />
            お気軽にお問い合わせください。
          </p>
          <a
            href="mailto:hello@nan.studio"
            className="group mt-10 inline-flex w-fit items-center gap-4 border-b border-foreground/60 pb-2 font-mono text-sm tracking-[0.2em] text-foreground"
          >
            CONTACT FORM
            <svg
              viewBox="0 0 40 16"
              className="h-3 w-10 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 8h38M32 2l6 6-6 6" stroke="currentColor" strokeWidth="1" />
            </svg>
          </a>
        </div>

        <div className="min-h-[280px] md:min-h-full">
          <img
            src="/images/packaging.png"
            alt="NaN のブランドパッケージとビジネスカード"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
