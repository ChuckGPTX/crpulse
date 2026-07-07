export const teamAssets = {
  "Kingdom Hoops": {
    logo: "/logos/kingdom-hoops.svg",
    source: "Official Kingdom Hoops website",
    sourceUrl: "https://www.kingdomhoops.com/",
  },
  "All Iowa Attack": {
    logo: "/logos/all-iowa-attack.png",
    source: "Official All Iowa Attack website",
    sourceUrl: "https://www.alliowaattack.com/",
  },
  "Mac Irvin Fire": {
    logo: "/logos/mac-irvin-fire.jpg",
    source: "Official Mac Irvin Fire ClubCentral portal",
    sourceUrl: "https://macirvinfire.clubcentral.com/",
  },
  "Brad Beal Elite": {
    logo: "/logos/brad-beal-elite.png",
    source: "Official Bradley Beal Elite website",
    sourceUrl: "http://www.bradleybealelite.com/",
  },
  "MOKAN Elite": {
    logo: "/logos/mokan.png",
    source: "Official MOKAN Basketball website",
    sourceUrl: "https://mokanbasketball.com/",
  },
  "MOKAN SPURS": {
    logo: "/logos/mokan.png",
    source: "Official MOKAN Basketball website",
    sourceUrl: "https://mokanbasketball.com/",
  },
} as const;

export type TeamAssetName = keyof typeof teamAssets;
