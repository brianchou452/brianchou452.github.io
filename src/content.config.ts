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

const experience = defineCollection({
	loader: glob({ base: './src/content/about', pattern: '**/experience.json' }),
	schema: z.array(
		z.object({
			position: z.string(),
			company: z.string().optional(),
			location: z.string(),
			period: z.string(),
			achievements: z.array(z.string()).optional()
		})
	),
});

const skills = defineCollection({
	loader: glob({ base: './src/content/about', pattern: '**/skills.json' }),
	schema: z.array(
		z.object({
			title: z.string(),
			icon: z.string(),
			skills: z.array(z.string())
		})
	),
});

export const collections = { 'blog': blog, 'works': works, 'experience': experience, 'skills': skills };
