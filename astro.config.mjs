// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
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
  integrations: [
    mdx(),
    sitemap(),
    svelte(),
    icon(),
    pagefind(),
    swup({
      theme: false,
      containers: ["main", "footer"],
      ignore: [/.+\/$/gm, /.+\/works$/gm],
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
    locales: ["en", "zh-tw", "zh-cn", "zh-hk", "zh-hant", "zh-sg", "zh"],
    defaultLocale: "zh-tw",
    fallback: {
      "zh-cn": "zh-tw",
      "zh-hk": "zh-tw",
      "zh-hant": "zh-tw",
      "zh-sg": "zh-tw",
      zh: "zh-tw",
    },
    routing: {
      prefixDefaultLocale: true,
      fallbackType: "rewrite",
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
  },
});
