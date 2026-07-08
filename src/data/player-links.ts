export const playerLinks = {
  "Charles Crawley": {
    x: "https://x.com/ChuckCrawley10",
    hudl: "https://www.hudl.com/profile/22960363/Chuck-Crawley",
    highSchool: {
      label: "Cedar Rapids Washington",
      url: "https://www.gobound.com/direct/teams/h20222175363297c10e3ca46248c4b10/PowerIndex",
    },
    snapshot: "2028 combo guard at Cedar Rapids Washington; listed Kingdom Hoops 16U EYCL and a 3.7 GPA.",
  },
  "Traeshon Fields": {
    x: "https://x.com/TraeFields0",
    hudl: "https://www.hudl.com/profile/23209769/Trae-Fields/about",
    highSchool: {
      label: "Cedar Rapids Washington",
      url: "https://www.gobound.com/direct/teams/h20222175363297c10e3ca46248c4b10/PowerIndex",
    },
    snapshot: "2028 point guard at Cedar Rapids Washington; listed All Iowa Attack EYCL with a 39-point high school game.",
  },
  "MarQwan Morgan": {
    x: "https://x.com/qwanvsdawrld",
    highSchool: {
      label: "Davenport North",
      url: "https://www.gobound.com/direct/teams/h202221753632f34e559128c04a7caa5/PowerIndex",
    },
    snapshot: "2028 Davenport North guard; listed 6'3, Mac Irvin Fire, ",
  },
  "Vasaun Wilmington": {
    highSchool: {
      label: "North Scott",
      url: "https://www.gobound.com/direct/teams/h202221753632f6ca22a5aaf34e78826/PowerIndex",
    },
  },
  "Andrew Allen": {
    highSchool: {
      label: "Xavier",
      url: "https://www.gobound.com/direct/teams/h202221753632b5d86065c3a848b3acc/PowerIndex",
    },
  },
  "Chase Goodheart": {
    x: "https://x.com/chasegoodheart",
    hudl: "https://www.hudl.com/video/3/25098191/67bff5902003baa5c9a10384",
    highSchool: {
      label: "Iowa City Liberty",
      url: "https://www.gobound.com/direct/teams/h202221753632fff9d388cc644f67879/PowerIndex",
    },
    snapshot: "2028 Iowa City Liberty guard; listed All Iowa Attack EYCL and a 4.22 GPA.",
  },
  "Tate McCollum": {
    x: "https://x.com/TateMccollum",
    hudl: "https://www.hudl.com/video/3/27648318/69b773924f3aaaf0952a1d35",
    highSchool: {
      label: "Solon",
      url: "https://www.gobound.com/direct/teams/h202221753632b4e03d0f710449c9a5f/PowerIndex",
    },
    snapshot: "2027 Solon point guard; Montana State offer; 19 PPG and 40% from three as a junior.",
  },
  "Zane Rus": {
    x: "https://x.com/rus_zane",
    highSchool: {
      label: "North Scott",
      url: "https://www.gobound.com/direct/teams/h202221753632f6ca22a5aaf34e78826/PowerIndex",
    },
    snapshot: "2027 North Scott forward with All Iowa Attack 17U production; All Iowa Attack 17U forward.",
  },
  "Brayden Tanny": {
    x: "https://x.com/TannyBrayden",
    highSchool: {
      label: "Wahlert Catholic",
      url: "https://www.gobound.com/direct/teams/h2022217536328f4377320671451ab68/PowerIndex",
    },
    snapshot: "2027 6'5 wing at Wahlert Catholic; listed All Iowa Attack Nike EYCL.",
  },
  "Pernell Grover Jr.": {
    highSchool: {
      label: "Waterloo West",
      url: "https://www.gobound.com/direct/teams/h202221753632746382280944409a93b/PowerIndex",
    },
  },
  "Alexander Tanny": {
    highSchool: {
      label: "Wahlert Catholic",
      url: "https://www.gobound.com/direct/teams/h2022217536328f4377320671451ab68/PowerIndex",
    },
  },
} as const;

export type PlayerLinkName = keyof typeof playerLinks;
