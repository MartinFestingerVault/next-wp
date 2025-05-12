// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
  FVPlugin,
  FVAccessLevel,
  FVCategory,
  FVOriginalAuthor,
  FVTag
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

// Default fetch options for all WordPress API calls
const defaultFetchOptions = {
  next: {
    tags: ["wordpress"],
    revalidate: 3600, // 1 hour cache
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? querystring.stringify(query) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

export class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

async function wordpressFetch<T>(url: string): Promise<T> {
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  const url = getUrl("/wp-json/wp/v2/posts", query);
  return wordpressFetch<Post[]>(url);
}

export async function getPostById(id: number): Promise<Post> {
  const url = getUrl(`/wp-json/wp/v2/posts/${id}`);
  return wordpressFetch<Post>(url);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}

export async function getAllCategories(): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories");
  return wordpressFetch<Category[]>(url);
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = getUrl(`/wp-json/wp/v2/categories/${id}`);
  return wordpressFetch<Category>(url);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const url = getUrl("/wp-json/wp/v2/categories", { slug });
  const response = await wordpressFetch<Category[]>(url);
  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { categories: categoryId });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
  return wordpressFetch<Post[]>(url);
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", { post: postId });
  return wordpressFetch<Tag[]>(url);
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags");
  return wordpressFetch<Tag[]>(url);
}

export async function getTagById(id: number): Promise<Tag> {
  const url = getUrl(`/wp-json/wp/v2/tags/${id}`);
  return wordpressFetch<Tag>(url);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const url = getUrl("/wp-json/wp/v2/tags", { slug });
  const response = await wordpressFetch<Tag[]>(url);
  return response[0];
}

export async function getAllPages(): Promise<Page[]> {
  const url = getUrl("/wp-json/wp/v2/pages");
  return wordpressFetch<Page[]>(url);
}

export async function getPageById(id: number): Promise<Page> {
  const url = getUrl(`/wp-json/wp/v2/pages/${id}`);
  return wordpressFetch<Page>(url);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const url = getUrl("/wp-json/wp/v2/pages", { slug });
  const response = await wordpressFetch<Page[]>(url);
  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users");
  return wordpressFetch<Author[]>(url);
}

export async function getAuthorById(id: number): Promise<Author> {
  const url = getUrl(`/wp-json/wp/v2/users/${id}`);
  return wordpressFetch<Author>(url);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const url = getUrl("/wp-json/wp/v2/users", { slug });
  const response = await wordpressFetch<Author[]>(url);
  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { author: authorId });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { author: author.id });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  const url = getUrl("/wp-json/wp/v2/posts", { categories: category.id });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id });
  return wordpressFetch<Post[]>(url);
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  const url = getUrl(`/wp-json/wp/v2/media/${id}`);
  return wordpressFetch<FeaturedMedia>(url);
}

export async function searchCategories(query: string): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Category[]>(url);
}

export async function searchTags(query: string): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Tag[]>(url);
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Author[]>(url);
}

// Festinger Vault Custom Post Types and Taxonomies

// Fetch all plugins with optional filtering
export async function getAllFVPlugins(filterParams?: { 
  access_level?: string; 
  category?: string; 
  original_author?: string;
  tag?: string;
  search?: string;
}): Promise<FVPlugin[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
  }
  if (filterParams?.access_level) {
    query.fv_access_level = filterParams.access_level;
  }
  if (filterParams?.category) {
    query.fv_category = filterParams.category;
  }
  if (filterParams?.original_author) {
    query.original_author_tax = filterParams.original_author;
  }
  if (filterParams?.tag) {
    query.fv_tag = filterParams.tag;
  }

  const url = getUrl("/wp-json/wp/v2/fv_plugin", query);
  return wordpressFetch<FVPlugin[]>(url);
}

// Get a single plugin by ID
export async function getFVPluginById(id: number): Promise<FVPlugin> {
  const url = getUrl(`/wp-json/wp/v2/fv_plugin/${id}`);
  return wordpressFetch<FVPlugin>(url);
}

// Get a plugin by slug
export async function getFVPluginBySlug(slug: string): Promise<FVPlugin> {
  const url = getUrl("/wp-json/wp/v2/fv_plugin", { slug });
  const response = await wordpressFetch<FVPlugin[]>(url);
  
  if (response.length === 0) {
    throw new WordPressAPIError(
      `No plugin found with slug: ${slug}`,
      404,
      url
    );
  }
  
  return response[0];
}

// Get plugins by access level
export async function getFVPluginsByAccessLevel(accessLevelId: number): Promise<FVPlugin[]> {
  const url = getUrl("/wp-json/wp/v2/fv_plugin", { fv_access_level: accessLevelId });
  return wordpressFetch<FVPlugin[]>(url);
}

// Get plugins by category
export async function getFVPluginsByCategory(categoryId: number): Promise<FVPlugin[]> {
  const url = getUrl("/wp-json/wp/v2/fv_plugin", { fv_category: categoryId });
  return wordpressFetch<FVPlugin[]>(url);
}

// Get all access levels
export async function getFVAccessLevels(): Promise<FVAccessLevel[]> {
  const url = getUrl("/wp-json/wp/v2/fv_access_level");
  return wordpressFetch<FVAccessLevel[]>(url);
}

// Get access level by ID
export async function getFVAccessLevelById(id: number): Promise<FVAccessLevel> {
  const url = getUrl(`/wp-json/wp/v2/fv_access_level/${id}`);
  return wordpressFetch<FVAccessLevel>(url);
}

// Get all original authors
export async function getFVOriginalAuthors(): Promise<FVOriginalAuthor[]> {
  const url = getUrl("/wp-json/wp/v2/original_author_tax");
  return wordpressFetch<FVOriginalAuthor[]>(url);
}

// Get original author by ID
export async function getFVOriginalAuthorById(id: number): Promise<FVOriginalAuthor> {
  const url = getUrl(`/wp-json/wp/v2/original_author_tax/${id}`);
  return wordpressFetch<FVOriginalAuthor>(url);
}

// Get FV categories
export async function getFVCategories(): Promise<FVCategory[]> {
  const url = getUrl("/wp-json/wp/v2/fv_category");
  return wordpressFetch<FVCategory[]>(url);
}

// Get FV category by ID
export async function getFVCategoryById(id: number): Promise<FVCategory> {
  const url = getUrl(`/wp-json/wp/v2/fv_category/${id}`);
  return wordpressFetch<FVCategory>(url);
}

// Get FV tags
export async function getFVTags(): Promise<FVTag[]> {
  const url = getUrl("/wp-json/wp/v2/fv_tag");
  return wordpressFetch<FVTag[]>(url);
}

// Get FV tag by ID
export async function getFVTagById(id: number): Promise<FVTag> {
  const url = getUrl(`/wp-json/wp/v2/fv_tag/${id}`);
  return wordpressFetch<FVTag>(url);
}
