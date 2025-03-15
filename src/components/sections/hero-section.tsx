import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-0">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">
          Leave it to Chuck
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Chuck is a general AI agent that bridges minds and actions: it doesn't just think, it delivers results.
          Chuck excels at various tasks in work and life, getting everything done while you rest.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/try">Try Chuck</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/use-cases">Explore Use Cases</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
