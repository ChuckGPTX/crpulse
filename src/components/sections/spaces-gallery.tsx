import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Sample spaces data
const spaces = [
  {
    id: "japan-lbo-quest",
    title: "JAPAN LBO QUEST",
    creator: "kavan****rick@gmail.com",
    spaceUrl: "https://zaomhjnv.chuck.space/",
    taskUrl: "/share/KRTwnMwEucXG91cecqe4Xv"
  },
  {
    id: "quantum-computing",
    title: "Quantum Computing Learning Hub",
    creator: "roxa****g@gmail.com",
    spaceUrl: "https://evvqfqoz.chuck.space/",
    taskUrl: "/share/I1HGZeicXgHhRfgI8xxjMM"
  },
  {
    id: "stock-pattern",
    title: "Stock Pattern Matcher",
    creator: "142****@q****com",
    spaceUrl: "https://zhgseaon.chuck.space/",
    taskUrl: "/share/ybdXp40sUYXThj2rtXv7rD"
  },
  {
    id: "physics-wonder",
    title: "Discover the Wonder of Physics",
    creator: "tin****206@gmail.com",
    spaceUrl: "https://rjzmnfyd.chuck.space/",
    taskUrl: "/share/Z3igXPBVK2UAuJZlHZ3PIl"
  },
  {
    id: "ibit-etf",
    title: "IBIT ETF Dashboard",
    creator: "je****001@gmail.com",
    spaceUrl: "https://kwjamaxw.chuck.space/",
    taskUrl: "/share/4vSkXGH8oJKMPE6Fa2FpPd"
  },
  {
    id: "super-mario",
    title: "Super Mario Minecraft Style",
    creator: "eric****@s****com",
    spaceUrl: "https://yogbgfnr.chuck.space/",
    taskUrl: "/share/nrEydgtF8bLZFeDI8mPpUL"
  },
  {
    id: "calm-room",
    title: "Room with Calm Pop Culture Vibe",
    creator: "eric****lab@gmail.com",
    spaceUrl: "https://auhsqsqo.chuck.space/",
    taskUrl: "/share/oto7Omj4Ua8WVHjc8bETIF"
  },
  {
    id: "zinc-oxide",
    title: "Zinc Oxide Growth on Nickel Foam",
    creator: "kate****sci@gmail.com",
    spaceUrl: "https://uhmkyjyl.chuck.space/",
    taskUrl: "/share/YZUEL5S3wipfJozWDoZBJl"
  }
];

// Generate colors for spaces
const colors = [
  "bg-[#BE70AF]",
  "bg-[#C094D9]",
  "bg-[#6B9ACA]",
  "bg-[#8ECAE6]",
  "bg-[#D7A9E3]",
  "bg-[#8CB369]",
  "bg-[#F8BD7F]",
  "bg-[#E76F51]"
];

export function SpacesGallerySection() {
  return (
    <section className="w-full py-20 px-6 md:px-0">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif mb-4">Chuck Spaces gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and explore incredible Spaces created with Chuck.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spaces.map((space, index) => (
            <div
              key={space.id}
              className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`aspect-video relative overflow-hidden ${colors[index % colors.length]} flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">{space.title.charAt(0)}</span>
              </div>

              <div className="p-5">
                <h3 className="font-medium mb-2">{space.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  From {space.creator}
                </p>

                <div className="flex flex-col gap-2">
                  <Button variant="secondary" size="sm" className="w-full" asChild>
                    <Link href={space.spaceUrl}>Visit Space</Link>
                  </Button>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={space.taskUrl}>Watch replay of this task</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline">
            <Link href="/space-gallery">Explore more Spaces</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
