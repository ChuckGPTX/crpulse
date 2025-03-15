import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BenchmarksSection() {
  return (
    <section className="w-full py-20 px-6 md:px-0 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">Benchmarks</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            <Link href="https://openreview.net/forum?id=fibxvahvs3" className="underline hover:text-accent" target="_blank">
              GAIA
            </Link> is a benchmark for evaluating General AI Assistants on solving real-world problems.
            Chuck has achieved new state-of-the-art (SOTA) performance across all three difficulty levels.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-medium mb-4">GAIA Benchmark</h3>

              <div className="space-y-6">
                {/* Level 1 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level 1</span>
                    <span className="text-sm font-medium">94.5%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full"
                      style={{ width: "94.5%" }}
                    ></div>
                  </div>
                </div>

                {/* Level 2 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level 2</span>
                    <span className="text-sm font-medium">82.1%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full"
                      style={{ width: "82.1%" }}
                    ></div>
                  </div>
                </div>

                {/* Level 3 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level 3</span>
                    <span className="text-sm font-medium">57.8%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full"
                      style={{ width: "57.8%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-xs text-muted-foreground">
                * Chuck was evaluated in standard mode using the same configuration as its production version for reproducibility.
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                * Comparative data from OpenAI Deep Research and other systems were sourced from OpenAI's <Link href="https://openai.com/index/introducing-deep-research/" className="underline hover:text-accent" target="_blank">release blog</Link>.
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <p className="text-center italic text-lg mb-4">
                "Chuck outperforms all previous models on complex reasoning tasks, especially those requiring multi-step planning and specialized domain knowledge."
              </p>
              <div className="flex justify-center mt-4">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/benchmarks">View detailed results</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
