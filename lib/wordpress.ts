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
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? querystring.stringify(query) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

class WordPressAPIError extends Error {
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

export { WordPressAPIError };

// Add to lib/wordpress.ts

// Fetch all plugins with optional filtering
export async function getAllPlugins(filterParams?: { 
  access_level?: string; 
  category?: string; 
  original_author?: string;
  tag?: string;
  search?: string;
}): Promise<FVPlugin[]> {
  let url = new URL(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/fv_plugin`);
  
  // Add pagination params
  url.searchParams.append("per_page", "100");
  
  // Add filter params if provided
  if (filterParams) {
    if (filterParams.access_level) {
      url.searchParams.append("fv_access_level", filterParams.access_level);
    }
    if (filterParams.category) {
      url.searchParams.append("fv_category", filterParams.category);
    }
    if (filterParams.original_author) {
      url.searchParams.append("original_author_tax", filterParams.original_author);
    }
    if (filterParams.tag) {
      url.searchParams.append("fv_tag", filterParams.tag);
    }
    if (filterParams.search) {
      url.searchParams.append("search", filterParams.search);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      ...defaultFetchOptions,
      next: {
        tags: ["wordpress", "plugins"],
        revalidate: 3600, // 1 hour cache
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `Failed to fetch plugins: ${response.statusText}`,
        response.status,
        url.toString()
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching plugins:", error);
    throw error;
  }
}

// Get a single plugin by ID
export async function getPluginById(id: number): Promise<FVPlugin> {
  const url = `${process.env.WORDPRESS_URL}/wp-json/wp/v2/fv_plugin/${id}`;

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      next: {
        tags: ["wordpress", "plugins", `plugin-${id}`],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `Failed to fetch plugin: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching plugin with ID ${id}:`, error);
    throw error;
  }
}

// Get a plugin by slug
export async function getPluginBySlug(slug: string): Promise<FVPlugin> {
  const url = `${process.env.WORDPRESS_URL}/wp-json/wp/v2/fv_plugin?slug=${slug}`;

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      next: {
        tags: ["wordpress", "plugins", `plugin-slug-${slug}`],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `Failed to fetch plugin: ${response.statusText}`,
        response.status,
        url
      );
    }

    const plugins = await response.json();
    
    if (plugins.length === 0) {
      throw new WordPressAPIError(
        `No plugin found with slug: ${slug}`,
        404,
        url
      );
    }

    return plugins[0];
  } catch (error) {
    console.error(`Error fetching plugin with slug ${slug}:`, error);
    throw error;
  }
}

// Get plugins by access level
export async function getPluginsByAccessLevel(accessLevelId: number): Promise<FVPlugin[]> {
  const url = `${process.env.WORDPRESS_URL}/wp-json/wp/v2/fv_plugin?fv_access_level=${accessLevelId}`;

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      next: {
        tags: ["wordpress", "plugins", "access-levels", `access-level-${accessLevelId}`],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `Failed to fetch plugins by access level: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching plugins with access level ${accessLevelId}:`, error);
    throw error;
  }
}

// Get plugins by category
export async function getPluginsByCategory(categoryId: number): Promise<FVPlugin[]> {
  const url = `${process.env.WORDPRESS_URL}/wp-json/wp/v2/fv_plugin?fv_category=${categoryId}`;

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      next: {
        tags: ["wordpress", "plugins", "categories", `category-${categoryId}`],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `Failed to fetch plugins by category: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching plugins with category ${categoryId}:`, error);
    throw error;
  }
}

// Get all access levels
export async function getAllAccessLevels(): Promise<FVAccessLevel[]> {
  const url = `${process.env.WORDPRESS_URL}/wp-json/wp/v2/fv_access_level`;

  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      next: {
        tags: ["wordpress", "access-levels"],
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `Failed to fetch access levels: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching access levels:", error);
    throw error;
  }
}

// Similar functions for other taxonomies (getAccessLevelById, getCategoryById, etc.)
