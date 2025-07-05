import type { Configuration } from "./src/types/config";

const Config: Configuration = {
  title: "海獺的家",
  subTitle: "海獺的經歷、生活、學習、工作等的記錄",
  brandTitle: "海獺的家",

  description: "海獺的經歷、生活、學習、工作等的記錄",

  site: "https://about.seaotter.cc",

  locale: "zh-tw", // set for website language and date format

  navigators: [
    {
      nameKey: "nav.about",
      href: "/",
    },
    {
      nameKey: "nav.blog",
      href: "/blog",
    },
    {
      nameKey: "nav.works",
      href: "/works",
    },
    {
      nameKey: "nav.github",
      href: "https://github.com/WhitePaper233/yukina",
    },
  ],

  username: "Brian Chou 海獺",
  sign: "Ad Astra Per Aspera.",
  socialLinks: [
    {
      icon: "line-md:github-loop",
      link: "https://github.com/WhitePaper233",
    },
    {
      icon: "mingcute:bilibili-line",
      link: "https://space.bilibili.com/22433608",
    },
    {
      icon: "mingcute:netease-music-line",
      link: "https://music.163.com/#/user/home?id=125291648",
    },
  ],
  maxSidebarCategoryChip: 6, // It is recommended to set it to a common multiple of 2 and 3
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  banners: [
    "https://s2.loli.net/2025/01/25/PBvHFjr5yDu6t4a.webp",
    "https://s2.loli.net/2025/01/25/6bKcwHZigzlM4mJ.webp",
    "https://s2.loli.net/2025/01/25/H9WgEK6qNTcpFiS.webp",
    "https://s2.loli.net/2025/01/25/njNVtuUMzxs81RI.webp",
    "https://s2.loli.net/2025/01/25/tozsJ8QHAjFN3Mm.webp",
    "https://s2.loli.net/2025/01/25/Pm89OveZq7NWUxF.webp",
    "https://s2.loli.net/2025/01/25/UCYKvc1ZhgPHB9m.webp",
    "https://s2.loli.net/2025/01/25/JjpLOW8VSmufzlA.webp",
  ],

  slugMode: "HASH", // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  // WIP functions
  bannerStyle: "LOOP", // 'loop' | 'static' | 'hidden'
};

export default Config;
