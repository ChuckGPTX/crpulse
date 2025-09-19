import Image from "next/image";

export default function Home() {
  const resources = [
    {
      title: "Tiny Prompters Blog",
      description: "Fresh ideas to spark AI curiosity at home and in class.",
      action: "Read more",
    },
    {
      title: "Classroom Toolkit",
      description: "Download printable prompts and discussion guides.",
      action: "Download",
    },
    {
      title: "Book a Demo",
      description: "Schedule a live walkthrough for your school or library.",
      action: "Schedule",
    },
  ];

  const controls = [
    { label: "Chat", icon: "💬" },
    { label: "Questions", icon: "❓" },
    { label: "Resources", icon: "📎" },
    { label: "Notes", icon: "📝" },
    { label: "Help", icon: "⚙️" },
  ];

  return (
    <main className="min-h-screen bg-[#efe5d6] text-[#2f2519]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c7ab3] text-xl font-semibold text-white">
              TP
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#9f8360]">
                TinyPrompters.com
              </p>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Adventure Lab Live: Raising Creative Prompt Engineers
              </h1>
            </div>
          </div>
          <div className="flex gap-3 text-sm text-[#705b44]">
            <div className="flex flex-col text-right">
              <span className="font-semibold text-[#2f2519]">December 12</span>
              <span>11:00 AM PST</span>
            </div>
            <div className="h-12 w-px bg-[#d9c8ae]" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-semibold text-[#2f2519]">Live Webinar</span>
              <span>Duration: 60 minutes</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl bg-[#f7efe0] p-6 shadow-[0_40px_120px_rgba(164,134,96,0.18)] sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-[#ffe5b4] via-[#f9d8b5] to-[#f2c8a0] p-8 shadow-inner">
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.4em] text-[#b0753d]">
              <span className="h-2 w-2 rounded-full bg-[#b0753d]" />
              Learning Path Spotlight
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-semibold leading-tight text-[#2f2519] sm:text-5xl">
                Give your kid-sized prompt engineers superpowers
              </h2>
              <p className="max-w-xl text-lg text-[#5a4733]">
                Discover playful strategies that help children ask better questions, prototype responsibly, and build confidence with AI.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#f0d8b9] bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#b0753d]">
                  Challenge
                </p>
                <p className="mt-2 text-[#453524]">
                  Kids need age-appropriate guardrails while experimenting with AI tools.
                </p>
              </div>
              <div className="rounded-2xl border border-[#f0d8b9] bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#b0753d]">
                  Tiny Prompters Solution
                </p>
                <p className="mt-2 text-[#453524]">
                  Guided adventures encourage curiosity while reinforcing safe, inclusive prompt habits.
                </p>
              </div>
              <div className="rounded-2xl border border-[#f0d8b9] bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#b0753d]">
                  Takeaway
                </p>
                <p className="mt-2 text-[#453524]">
                  Provide frameworks children can rely on when working with AI in and out of class.
                </p>
              </div>
              <div className="rounded-2xl border border-[#f0d8b9] bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#b0753d]">
                  Bonus
                </p>
                <p className="mt-2 text-[#453524]">
                  Download the activity pack for prompts, reflection cards, and family challenges.
                </p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-[#1c7ab3] shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
              <Image
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80"
                alt="Presenter leading the Tiny Prompters webinar"
                width={800}
                height={512}
                className="h-56 w-full object-cover sm:h-64"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-4 py-3 text-sm text-white">
                <div>
                  <p className="font-semibold">Asha Patel</p>
                  <p className="text-white/80">Curriculum Director, Tiny Prompters</p>
                </div>
                <button className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
                  Live
                </button>
              </div>
              <button className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1c7ab3] shadow-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            <div className="rounded-3xl border border-[#e9d5bb] bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b0753d]">
                Quick Links
              </p>
              <ul className="mt-4 space-y-3">
                {resources.map((resource) => (
                  <li key={resource.title} className="flex items-start justify-between rounded-2xl bg-[#f8f1e5] p-4 transition hover:bg-[#f1e6d7]">
                    <div>
                      <p className="text-base font-semibold text-[#2f2519]">{resource.title}</p>
                      <p className="text-sm text-[#705b44]">{resource.description}</p>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wide text-[#1c7ab3]">
                      {resource.action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <footer className="flex flex-col gap-4 rounded-3xl bg-[#e6d6be] p-6 text-sm text-[#5a4733] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {controls.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 font-medium text-[#2f2519] shadow-sm transition hover:bg-white"
              >
                <span className="text-base" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9f8360]">
            <span className="h-2 w-2 rounded-full bg-[#b0753d]" />
            Powered by Tiny Prompters Studio
          </div>
        </footer>
      </div>
    </main>
  );
}
