import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

interface BlogPostData {
	[key: string]: unknown;
}

interface BlogPost {
	id: string;
	data: BlogPostData;
}

interface Context {
	site: string;
}

export async function GET(context: Context): Promise<Response> {
	const posts: BlogPost[] = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post: BlogPost) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
