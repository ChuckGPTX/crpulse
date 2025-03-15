import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Sample use case data
const useCases = [
  {
    id: "japan-trip",
    title: "Trip to Japan in April",
    description: "Chuck integrates comprehensive travel information to create personalized itineraries and produces a custom travel handbook tailored specifically for your Japanese adventure.",
    category: "Life",
    icon: "/icons/passport-globe.svg"
  },
  {
    id: "tesla-stocks",
    title: "Deeply Analyze Tesla Stocks",
    description: "Chuck delivers in-depth stock analysis with visually compelling dashboards that showcase comprehensive insights into Tesla's market performance and financial outlook.",
    category: "Data Analysis",
    icon: "/icons/analytics-up-date.svg"
  },
  {
    id: "momentum-course",
    title: "Interactive Course on the Momentum Theorem",
    description: "Chuck develops engaging video presentations for middle school educators, clearly explaining the momentum theorem through accessible and educational content.",
    category: "Education",
    icon: "/icons/online-learning-book-open.svg"
  },
  {
    id: "insurance-policies",
    title: "Comparative Analysis of Insurance Policies",
    description: "Looking to compare insurance options? Chuck generates clear, structured comparison tables highlighting key policy information with optimal recommendations tailored to your needs.",
    category: "Productivity",
    icon: "/icons/analytics-down-data.svg"
  },
  {
    id: "b2b-supplier",
    title: "B2B Supplier Sourcing",
    description: "Chuck conducts comprehensive research across extensive networks to identify the most suitable suppliers for your specific requirements. As your dedicated agent, Chuck works exclusively in your best interest.",
    category: "Research",
    icon: "/icons/shopping-cart-check.svg"
  },
  {
    id: "ai-products-clothing",
    title: "Research on AI Products for the Clothing Industry",
    description: "Chuck conducted in-depth research on AI search products in the clothing industry with comprehensive product analysis and competitive positioning.",
    category: "Research",
    icon: "/icons/content-generator-star-file.svg"
  }
];

// Categories for the filter tabs
const categories = [
  "Featured",
  "Research",
  "Life",
  "Data Analysis",
  "Education",
  "Productivity",
  "WTF"
];

export function UseCaseGallery() {
  return (
    <section className="w-full py-16 px-6 md:px-0">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">Use case gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how Chuck handles real-world tasks through step-by-step replays.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm ${
                category === "Featured"
                  ? "bg-accent text-white"
                  : "bg-secondary hover:bg-accent/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Use Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Image
                      src={useCase.icon}
                      alt={useCase.title}
                      width={24}
                      height={24}
                      className="text-accent"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                    {useCase.category}
                  </span>
                </div>
                <h3 className="text-xl font-medium mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {useCase.description}
                </p>
                <Link
                  href={`/use-cases/${useCase.id}`}
                  className="text-accent hover:text-accent/80 text-sm font-medium"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline">
            <Link href="/use-cases">Explore more use cases</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
