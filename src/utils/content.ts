import { defaultLang } from "@/i18n/ui";
import { getCollection, render } from "astro:content";
import { IdToSlug } from "./hash";

/**
 * Represents an archive item with a title, slug, date, and optional tags.
 */
export interface Archive {
  title: string;
  id: string;
  date: Date;
  tags?: string[];
}

/**
 * Represents a tag used to categorize content.
 */
export interface Tag {
  name: string;
  slug: string;
  posts: Archive[];
}

/**
 * Represents a category of content.
 */
export interface Category {
  name: string;
  slug: string;
  posts: Archive[];
}

/**
 * Retrieves and sorts blog posts by their published date.
 *
 * This function fetches all blog posts from the "posts" collection, filters out drafts if in production mode,
 * and sorts them in descending order by their published date. It also adds `nextSlug`, `nextTitle`, `prevSlug`,
 * and `prevTitle` properties to each post for navigation purposes.
 * 
 * For non-default languages, if a post doesn't exist in the requested language, 
 * it will fallback to the default language (zh-tw).
 *
 * @returns A promise that resolves to an array of sorted blog posts with navigation properties.
 */
export async function GetSortedPosts(lang?: string) {
  const allBlogPosts = await getCollection("blog", (post) => {
    if (import.meta.env.PROD && post.data.draft) {
      return false;
    }
    return true;
  });

  // Render all posts to trigger remark plugins (including reading time calculation)
  const postsWithReadingTime = await Promise.all(
    allBlogPosts.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post);
      return {
        ...post,
        data: {
          ...post.data,
          readingMetadata: remarkPluginFrontmatter.readingMetadata,
        },
      };
    })
  );

  let filteredPosts = postsWithReadingTime;

  if (lang) {
    // Get posts for the requested language
    const langPosts = postsWithReadingTime.filter(post => post.id.startsWith(`${lang}/`));

    if (lang !== defaultLang) {
      // For non-default languages, get fallback posts from default language
      const defaultPosts = postsWithReadingTime.filter(post => post.id.startsWith(`${defaultLang}/`));

      // Create a map of post slugs for the requested language
      const langPostSlugs = new Set(
        langPosts.map(post => post.id.split('/').pop())
      );

      // Add fallback posts that don't exist in the requested language
      const fallbackPosts = defaultPosts.filter(post => {
        const slug = post.id.split('/').pop();
        return !langPostSlugs.has(slug);
      });

      filteredPosts = [...langPosts, ...fallbackPosts];
    } else {
      filteredPosts = langPosts;
    }
  }

  const sorted = filteredPosts.toSorted((a, b) => {
    const dateA = new Date(a.data.published);
    const dateB = new Date(b.data.published);
    return dateA > dateB ? -1 : 1;
  });

  for (let i = 1; i < sorted.length; i++) {
    (sorted[i].data as any).nextSlug = (sorted[i - 1] as any).slug;
    (sorted[i].data as any).nextTitle = sorted[i - 1].data.title;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    (sorted[i].data as any).prevSlug = (sorted[i + 1] as any).slug;
    (sorted[i].data as any).prevTitle = sorted[i + 1].data.title;
  }

  return sorted;
}

/**
 * Retrieves and organizes blog post archives.
 *
 * This function fetches all blog posts from the "posts" collection, filters them based on the environment
 * (excluding drafts in production), and organizes them into a map of archives grouped by year.
 * Each archive entry contains the post's title, slug, publication date, and tags.
 * The archives are sorted in descending order by year and by date within each year.
 * 
 * For non-default languages, if a post doesn't exist in the requested language, 
 * it will fallback to the default language (zh-tw) but ensure no duplicate posts.
 *
 * @returns A promise that resolves to a map of archives grouped by year.
 */
export async function GetArchives(lang?: string) {
  const allBlogPosts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  let filteredPosts = allBlogPosts;

  if (lang) {
    // Get posts for the requested language
    const langPosts = allBlogPosts.filter(post => post.id.startsWith(`${lang}/`));

    if (lang !== defaultLang) {
      // For non-default languages, get fallback posts from default language
      const defaultPosts = allBlogPosts.filter(post => post.id.startsWith(`${defaultLang}/`));

      // Create a map of post slugs for the requested language
      const langPostSlugs = new Set(
        langPosts.map(post => post.id.split('/').pop())
      );

      // Add fallback posts that don't exist in the requested language
      const fallbackPosts = defaultPosts.filter(post => {
        const slug = post.id.split('/').pop();
        return !langPostSlugs.has(slug);
      });

      filteredPosts = [...langPosts, ...fallbackPosts];
    } else {
      filteredPosts = langPosts;
    }
  }

  const archives = new Map<number, Archive[]>();

  for (const post of filteredPosts) {
    const date = new Date(post.data.published);
    const year = date.getFullYear();
    if (!archives.has(year)) {
      archives.set(year, []);
    }
    // Remove language prefix from ID if present
    const cleanId = post.id.includes('/') ? post.id.split('/').pop() ?? post.id : post.id;
    archives.get(year)!.push({
      title: post.data.title,
      id: `/${lang ?? defaultLang}/posts/${IdToSlug(cleanId)}`,
      date: date,
      tags: post.data.tags,
    });
  }

  const sortedArchives = new Map(
    [...archives.entries()].sort((a, b) => b[0] - a[0]),
  );
  sortedArchives.forEach((value) => {
    value.sort((a, b) => (a.date > b.date ? -1 : 1));
  });

  return sortedArchives;
}

/**
 * Retrieves all tags from blog posts.
 *
 * This function fetches all blog posts from the "posts" collection and extracts tags from each post.
 * It then organizes the tags into a map where each tag is associated with its metadata and the posts that have that tag.
 * 
 * For non-default languages, if a post doesn't exist in the requested language, 
 * it will fallback to the default language (zh-tw) but ensure no duplicate posts.
 *
 * @returns A promise that resolves to a map of tags. Each key is a tag slug, and the value is an object containing the tag's name, slug, and associated posts.
 */
export async function GetTags(lang?: string) {
  const allBlogPosts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  let filteredPosts = allBlogPosts;

  if (lang) {
    // Get posts for the requested language
    const langPosts = allBlogPosts.filter(post => post.id.startsWith(`${lang}/`));

    if (lang !== defaultLang) {
      // For non-default languages, get fallback posts from default language
      const defaultPosts = allBlogPosts.filter(post => post.id.startsWith(`${defaultLang}/`));

      // Create a map of post slugs for the requested language
      const langPostSlugs = new Set(
        langPosts.map(post => post.id.split('/').pop())
      );

      // Add fallback posts that don't exist in the requested language
      const fallbackPosts = defaultPosts.filter(post => {
        const slug = post.id.split('/').pop();
        return !langPostSlugs.has(slug);
      });

      filteredPosts = [...langPosts, ...fallbackPosts];
    } else {
      filteredPosts = langPosts;
    }
  }

  const tags = new Map<string, Tag>();
  filteredPosts.forEach((post) => {
    post.data.tags?.forEach((tag: string) => {
      const tagSlug = IdToSlug(tag);
      if (!tags.has(tagSlug)) {
        tags.set(tagSlug, {
          name: tag,
          slug: `/${lang ?? defaultLang}/tags/${tagSlug}`,
          posts: [],
        });
      }
      // Remove language prefix from ID if present
      const cleanId = post.id.includes('/') ? post.id.split('/').pop() ?? post.id : post.id;
      tags.get(tagSlug)!.posts.push({
        title: post.data.title,
        id: `/${lang ?? defaultLang}/posts/${IdToSlug(cleanId)}`,
        date: new Date(post.data.published),
        tags: post.data.tags,
      });
    });
  });

  return tags;
}

/**
 * Retrieves all blog post categories and their associated posts.
 *
 * This function fetches all blog posts from the "posts" collection and filters them based on the environment.
 * In production, it excludes drafts. It then organizes the posts into categories and returns a map of categories.
 * 
 * For non-default languages, if a post doesn't exist in the requested language, 
 * it will fallback to the default language (zh-tw) but ensure no duplicate posts.
 *
 * @returns A promise that resolves to a map of categories, where each category contains its name, slug, and associated posts.
 */
export async function GetCategories(lang?: string) {
  const allBlogPosts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  let filteredPosts = allBlogPosts;

  if (lang) {
    // Get posts for the requested language
    const langPosts = allBlogPosts.filter(post => post.id.startsWith(`${lang}/`));

    if (lang !== defaultLang) {
      // For non-default languages, get fallback posts from default language
      const defaultPosts = allBlogPosts.filter(post => post.id.startsWith(`${defaultLang}/`));

      // Create a map of post slugs for the requested language
      const langPostSlugs = new Set(
        langPosts.map(post => post.id.split('/').pop())
      );

      // Add fallback posts that don't exist in the requested language
      const fallbackPosts = defaultPosts.filter(post => {
        const slug = post.id.split('/').pop();
        return !langPostSlugs.has(slug);
      });

      filteredPosts = [...langPosts, ...fallbackPosts];
    } else {
      filteredPosts = langPosts;
    }
  }

  const categories = new Map<string, Category>();

  filteredPosts.forEach((post) => {
    if (!post.data.category) return;
    const categorySlug = IdToSlug(post.data.category);

    if (!categories.has(categorySlug)) {
      categories.set(categorySlug, {
        name: post.data.category,
        slug: `/${lang ?? defaultLang}/categories/${categorySlug}`,
        posts: [],
      });
    }
    // Remove language prefix from ID if present
    const cleanId = post.id.includes('/') ? post.id.split('/').pop() ?? post.id : post.id;
    categories.get(categorySlug)!.posts.push({
      title: post.data.title,
      id: `/${lang ?? defaultLang}/posts/${IdToSlug(cleanId)}`,
      date: new Date(post.data.published),
      tags: post.data.tags,
    });
  });

  return categories;
}

/**
 * Retrieves and sorts works by their start date.
 *
 * This function fetches all works from the "works" collection and sorts them
 * in descending order by their start date.
 * 
 * For non-default languages, if a work doesn't exist in the requested language, 
 * it will fallback to the default language (zh-tw).
 *
 * @param lang - The language code (optional)
 * @returns A promise that resolves to an array of sorted works.
 */
export async function GetSortedWorks(lang?: string) {
  const allWorks = await getCollection("works");

  let filteredWorks = allWorks;

  if (lang) {
    // Get works for the requested language
    const langWorks = allWorks.filter(work => work.id.startsWith(`${lang}/`));

    if (lang !== defaultLang) {
      // For non-default languages, get fallback works from default language
      const defaultWorks = allWorks.filter(work => work.id.startsWith(`${defaultLang}/`));

      // Create a map of work slugs for the requested language
      const langWorkSlugs = new Set(
        langWorks.map(work => work.id.split('/').slice(1).join('/'))
      );

      // Add fallback works that don't exist in the requested language
      const fallbackWorks = defaultWorks.filter(work => {
        const slug = work.id.split('/').slice(1).join('/');
        return !langWorkSlugs.has(slug);
      });

      filteredWorks = [...langWorks, ...fallbackWorks];
    } else {
      filteredWorks = langWorks;
    }
  }

  const sorted = filteredWorks.toSorted((a, b) => {
    const dateA = new Date(a.data.started);
    const dateB = new Date(b.data.started);
    return dateA > dateB ? -1 : 1;
  });

  return sorted;
}
