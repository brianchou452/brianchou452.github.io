import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		published: z.date(),
		draft: z.boolean().optional(),
		description: z.string().optional(),
		cover: z.string().optional(),
		tags: z.array(z.string()).optional(),
		category: z.string().optional(),
		author: z.string().optional(),
		sourceLink: z.string().optional(),
		licenseName: z.string().optional(),
		licenseUrl: z.string().optional(),
	}),
});

const works = defineCollection({
	loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		started: z.date(),
		ended: z.date().optional(),
		description: z.string().optional(),
		cover: z.string().optional(),
		sourceLink: z.string().optional(),
		demoLink: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { 'blog': blog, 'works': works };
