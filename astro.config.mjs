// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://about.seaotter.cc",
  image: {
    // 僅處理儲存在專案內、來源可信任的 SVG 資產。
    dangerouslyProcessSVG: true,
  },
  integrations: [
    mdx(),
    sitemap(),
    svelte(),
    icon(),
    pagefind(),
    swup({
      theme: false,
      containers: ["main", "footer"],
      smoothScrolling: true,
      progress: true,
      cache: true,
      preload: true,
      updateHead: true,
      updateBodyClass: false,
      globalInstance: true,
      debug: false,
      reloadScripts: true,
    }),
  ],
  i18n: {
    locales: ["en", "zh-tw"],
    defaultLocale: "zh-tw",
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
    processor: unified({
      remarkPlugins: [remarkReadingTime, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        rehypeKatex,
        [
          rehypeAutolinkHeadings,
          {
            // Use a small anchor before the heading text to retain original styles.
            // Provide an aria-label so the icon-only link has an accessible name.
            behavior: "prepend",
            properties: {
              className: ["heading-anchor"],
              "aria-label": "連結到本段落",
            },
          },
        ],
      ],
    }),
  },
});
