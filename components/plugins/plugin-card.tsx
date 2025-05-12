// components/plugins/plugin-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getFeaturedMediaById, getCategoryById } from "@/lib/wordpress";

// Simplified component with fewer dependencies
export async function PluginCard({ plugin }: { plugin: any }) {
  // Fetch featured media and one category if available
  const featuredMedia = plugin.featured_media ? 
    await getFeaturedMediaById(plugin.featured_media) : null;
  
  let category = null;
  if (plugin.fv_category && plugin.fv_category.length > 0) {
    category = await getCategoryById(plugin.fv_category[0]);
  }

  // Format the date
  const formattedDate = new Date(plugin.modified).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link 
      href={`/plugins/${plugin.slug}`}
      className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="relative aspect-video overflow-hidden">
        {featuredMedia ? (
          <Image
            src={featuredMedia.source_url}
            alt={plugin.title.rendered}
            width={featuredMedia.media_details.width}
            height={featuredMedia.media_details.height}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Version Badge - only show if it exists */}
        {plugin.meta?.version && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            v{plugin.meta.version}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {category.name}
            </Badge>
          </div>
        )}
        
        <h3 
          className="mb-2 text-xl font-semibold"
          dangerouslySetInnerHTML={{ __html: plugin.title.rendered }}
        />
        
        <div 
          className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: plugin.excerpt.rendered }}
        />
        
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{plugin.meta?.custom_author || "Unknown Author"}</span>
          <span>Updated: {formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
