import Link from "next/link";
import { Button } from "@/components/ui/button";

// Sample user submissions
const userSubmissions = [
  {
    id: "books-media-linguistics",
    title: "Best Books on Media and Linguistics in France 2019-2025",
    description: "Please help me to create a table of the best books about medias and linguistics (separated topics) published in France between 2019 and 2025. With a summary of why they are the best. At least 15 books in each category, covering the dewey notation 070 to 099 and 400 to 409).",
    userEmail: "jo****th@gmail.com"
  },
  {
    id: "real-estate-brokerages",
    title: "Largest Real Estate Brokerages in Major Metro Areas",
    description: "Find the largest real estate brokerages in each of the top 10 major metro areas and break them down by number of agents, total number of transactions, total revenue, average commission per side.",
    userEmail: "wa****ch@gmail.com"
  },
  {
    id: "fire-control-technologies",
    title: "Impact of Fire Control Technologies on U.S. Victory in WWII",
    description: "Please do a research on how damage control, specifically fire control technologies, helped the U.S. Pacific Fleet withstand air strikes and ultimately defeat Japan during World War II. Please focus on the Pearl Harbor attack, the Battle of Midway, and the Battle of the Coral Sea.",
    userEmail: "mi****23@gmail.com"
  },
  {
    id: "seo-blog-google-ai",
    title: "Generate SEO-Friendly Blog That Passes Google AI Test",
    description: "How to generate blog that pass Google AI content test and with good SEO",
    userEmail: "zh****rk@gmail.com"
  },
  {
    id: "climate-change-impact",
    title: "Impact of Climate Change on Earth and Society Next Century",
    description: "Create a detailed report on the impact of climate change on earth and human society during the next century.",
    userEmail: "da****sa@gmail.com"
  },
  {
    id: "hiking-swiss-alps",
    title: "Best Hiking Trails in the Swiss Alps",
    description: "Best Hiking Trails in the Swiss Alps",
    userEmail: "li****gn@gmail.com"
  },
  {
    id: "scriptwriting-tools",
    title: "Scriptwriting Tools for Video Production and Narrative Design",
    description: "As a self-media creator (3+ years) specializing in video production (shooting/editing) and narrative design, I need you to access tools to streamline scriptwriting and plot development. Key Needs: - Scriptwriting tools for dialogue/storyboarding",
    userEmail: "sa****es@gmail.com"
  },
  {
    id: "family-trip-itinerary",
    title: "Two-Month Family Trip Itinerary and Guide",
    description: "Can you help me plan a two-month family trip for three people during the upcoming summer break(July to September), including one month in Australia, then New Zealand, Argentina (and other parts of South America), and Antarctica? Please include itinerary arrangements, accommodation recommendations, budget estimates, and a food guide, and then generate a detailed travel handbook. Thank you.",
    userEmail: "ch****ro@gmail.com"
  }
];

export function UserSubmissionsSection() {
  return (
    <section className="w-full py-20 px-6 md:px-0 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif mb-4">See how others use Chuck</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got a task? Let Chuck take care of it! Submit yours and see the best results featured here.
          </p>

          <div className="mt-8">
            <Button size="lg" className="rounded-full">
              Let Chuck try my task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userSubmissions.map((submission) => (
            <Link
              key={submission.id}
              href={`/share/${submission.id}`}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium mb-3 line-clamp-2">{submission.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {submission.description}
              </p>
              <p className="text-xs text-muted-foreground">
                From {submission.userEmail}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline">
            <Link href="/submissions">Explore more submissions</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
