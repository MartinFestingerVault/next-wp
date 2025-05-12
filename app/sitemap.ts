// app/sitemap.ts

import { MetadataRoute } from "next";
import { site_domain } from "@/site.config";
import { getAllPosts, getAllPages, getAllPlugins } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all content
  const [posts, pages, plugins] = await Promise.all([
    getAllPosts(),
    getAllPages(),
    getAllPlugins(),
  ]);
  
  // Create sitemap entries
  return [
    {
      url: `https://${site_domain}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `https://${site_domain}/posts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `https://${site_domain}/plugins`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Map post URLs
    ...posts.map((post) => ({
      url: `https://${site_domain}/posts/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Map page URLs
    ...pages.map((page) => ({
      url: `https://${site_domain}/pages/${page.slug}`,
      lastModified: new Date(page.modified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Map plugin URLs
    ...plugins.map((plugin) => ({
      url: `https://${site_domain}/plugins/${plugin.slug}`,
      lastModified: new Date(plugin.modified),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
