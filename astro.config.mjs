// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://about.seaotter.cc",
  integrations: [mdx(), sitemap(), svelte(), icon(), pagefind()],
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
          behavior: "prepend",
        },
      ],
    ],
  },
});
