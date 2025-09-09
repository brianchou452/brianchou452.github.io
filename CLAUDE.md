# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

用英文思考，用中文回答我，我可以用中英文回應你。
每次都用審視的目光，仔細看我輸入的潛在問題。你要指出我的問題，並給出明顯在我思考框架之外的建議。

## Development Commands

The project uses `pnpm` as the package manager. Key commands:

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview production build locally
- `pnpm astro ...` - Run Astro CLI commands (add integrations, check, etc.)

## Architecture Overview

This is an **Astro-based multilingual personal blog/portfolio** with the following key characteristics:

### Core Technologies

- **Framework**: Astro 5 with TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: Svelte 5 + Material Web Components
- **Content**: MDX with frontmatter validation using Zod schemas
- **Internationalization**: Built-in Astro i18n with Chinese Traditional as default
- **Search**: Pagefind integration for static site search
- **Page Transitions**: Swup for smooth navigation

### Key Configuration Files

- `website.config.ts` - Main site configuration (title, navigation, social links, etc.)
- `astro.config.mjs` - Astro configuration with integrations and i18n setup
- `src/content.config.ts` - Content collections schema definitions
- `src/i18n/ui.ts` - Translation strings for zh-tw and en locales

### Content Architecture

The site uses Astro's Content Collections with four main collections:

1. **blog** (`src/content/blog/`) - Blog posts with full frontmatter (title, published date, tags, category, etc.)
2. **works** (`src/content/works/`) - Portfolio projects with timeline and demo links
3. **experience** (`src/content/about/experience.json`) - Professional experience data
4. **skills** (`src/content/about/skills.json`) - Technical skills categorization

### Directory Structure

- `src/components/` - Reusable Astro/Svelte components
- `src/layouts/` - Page layout templates (Base, Main, Post, Archive, etc.)
- `src/pages/` - File-based routing with i18n support
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions
- `src/i18n/` - Internationalization configuration
- `src/plugins/` - Custom Astro plugins (reading time calculation)

### Internationalization

- Supports: en, zh-tw, zh-cn, zh-hk, zh-hant, zh-sg, zh
- Default locale: zh-tw with prefix routing enabled
- Fallback strategy for Chinese variants to zh-tw
- Translation keys defined in `src/i18n/ui.ts`

### Content Frontmatter Patterns

**Blog posts** require: `title`, `published` date, optional `draft`, `description`, `cover`, `tags`, `category`
**Works** require: `title`, `started` date, optional `ended`, `description`, `cover`, `sourceLink`, `demoLink`, `tags`

### Path Aliases

- `@/*` maps to `./src/*` for cleaner imports

### Styling Approach

- Uses TailwindCSS 4 with typography plugin
- Global styles in `src/styles/`
- Material Design components via `@material/web`
- Dark/light theme support

## Content Management

When working with content:

- Blog posts go in `src/content/blog/` as .md or .mdx files
- Portfolio items go in `src/content/works/`
- All content must follow the Zod schemas defined in `src/content.config.ts`
- Images should be placed in `src/assets/` or `public/` depending on optimization needs
- The site uses hash-based slugs by default (configurable in `website.config.ts`)
