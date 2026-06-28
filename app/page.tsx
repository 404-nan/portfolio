import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Concept } from "@/components/concept"
import { Origin } from "@/components/origin"
import { FeaturedWork } from "@/components/featured-work"
import { Process } from "@/components/process"
import { Contact } from "@/components/contact"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="bg-background">
      <SiteHeader />
      <Hero />
      <Concept />
      <Origin />
      <FeaturedWork />
      <Process />
      <Contact />
      <SiteFooter />
    </main>
  )
}
