// lib/revalidate.ts (or where your revalidation logic exists)

export async function revalidateWordPressData(tags?: string[]): Promise<void> {
  // Add 'plugins' to the existing list of content types
  const contentTypes = ["wordpress", "posts", "pages", "categories", "tags", "authors", "media", "plugins"];
  
  if (!tags || tags.length === 0) {
    // Revalidate all content types
    await Promise.all(contentTypes.map(tag => revalidateTag(tag)));
  } else {
    // Revalidate specific tags
    await Promise.all(tags.map(tag => revalidateTag(tag)));
  }
}
