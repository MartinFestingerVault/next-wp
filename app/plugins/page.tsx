import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  getAllFVPlugins, 
  getFVAccessLevels, 
  getFVCategories,
  getFVOriginalAuthors,
  getFVTags,
  getFeaturedMediaById
} from "@/lib/wordpress";
import { Badge } from "@/components/ui/badge";

// Fix: Update the PageProps interface to align with Next.js app router expectations
interface PageProps {
  // Remove the params property from PageProps since it's not needed in the component signature
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: "WordPress Plugins | Festinger Vault",
  description: "Browse our collection of premium WordPress plugins",
};

// Fix: Change the function signature to match the expected type by Next.js
export default async function PluginsPage({ searchParams }: PageProps) {
  const search = searchParams.search as string | undefined;
  const access_level = searchParams.access_level as string | undefined;
  const category = searchParams.category as string | undefined;
  const original_author = searchParams.original_author as string | undefined;
  const tag = searchParams.tag as string | undefined;
  
  // Fetch plugins with any provided filters
  const plugins = await getAllFVPlugins({ 
    search, 
    access_level, 
    category, 
    original_author, 
    tag 
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">WordPress Plugins</h1>
      
      {/* Add search and filter UI components here when ready */}
      
      {plugins.length === 0 ? (
        <div className="py-12 text-center">
          <h2 className="text-xl font-semibold">No plugins found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      )}
    </div>
  );
}

// Simple plugin card component
async function PluginCard({ plugin }: { plugin: any }) {
  // Fetch featured media if available
  let featuredMedia = null;
  if (plugin.featured_media) {
    try {
      featuredMedia = await getFeaturedMediaById(plugin.featured_media);
    } catch (error) {
      console.error(`Error fetching media for plugin ${plugin.id}:`, error);
    }
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
            width={featuredMedia.media_details.width || 300}
            height={featuredMedia.media_details.height || 200}
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
        
        {/* Version Badge */}
        {plugin.meta?.version && (
          <Badge variant="secondary" className="absolute right-2 top-2">
            v{plugin.meta.version}
          </Badge>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
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
