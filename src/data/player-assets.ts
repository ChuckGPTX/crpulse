export const playerAssets = {
  "MarQwan Morgan": {
    image: "/players/marqwan-morgan.jpg",
    source: "Prep Hoops",
    sourceUrl: "https://prephoops.com/wp-content/uploads/sites/2/2025/10/Screenshot_20251002_190302_Photos.jpg",
  },
} as const;

export type PlayerAssetName = keyof typeof playerAssets;
