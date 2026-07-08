export const playerAssets = {
  "Charles Crawley": {
    image: "/players/charles-crawley.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDbwZSdJW7ixUmXvjh74224KMgK7LZVbXnFXcidPc2Rg&s=10",
  },
  "Traeshon Fields": {
    image: "/players/traeshon-fields.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN7_V0S01zjOs5vnuUuNtbukWMSvKEZiq4AV8zmyaviA&s=10",
  },
  "MarQwan Morgan": {
    image: "/players/marqwan-morgan.jpg",
    source: "Prep Hoops",
    sourceUrl: "https://prephoops.com/wp-content/uploads/sites/2/2025/10/Screenshot_20251002_190302_Photos.jpg",
  },
  "Vasaun Wilmington": {
    image: "/players/vasaun-wilmington.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIRHs3RSyC1SBSi5lUXukFgDDnjptGJSuSbhRg2Z1mmQ&s=10",
  },
  "Andrew Allen": {
    image: "/players/andrew-allen.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFKzqDMV0SYB_AvK7dmBTxTZqotBfMTftFCpPHZv1CPQ&s=10",
  },
  "Zane Rus": {
    image: "/players/zane-rus.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXo8AxrcR8UroPFPjPETAnshn0mGN4eLmhzBGMng7TqA&s=10",
  },
  "Tate McCollum": {
    image: "/players/tate-mccollum.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkQLePpKQhhcCpgn_UG5ED2DvHZvC-h-p6GCKqQwbhOw&s=10",
  },
  "Pernell Grover Jr.": {
    image: "/players/pernell-grover-jr.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl3vJ18i-TaaQ8yUZCv3hkO2E1JvMaNbvvrsjqxOBbLg&s=10",
  },
  "Alexander Tanny": {
    image: "/players/alexander-tanny.jpg",
    source: "User-provided image URL",
    sourceUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLWLWz8LfypAYc9Yks7TGCyBGY7CMKeA_t9aKNwiCgQ&s=10",
  },
} as const;

export type PlayerAssetName = keyof typeof playerAssets;
