// app/plugins/page.tsx
import { Metadata } from "next";
import { PluginSearch } from "@/components/plugins/plugin-search";
import { FilterPlugins } from "@/components/plugins/plugin-filter";
import { PluginCard } from "@/components/plugins/plugin-card";
import { 
  getAllPlugins, 
  getAllAccessLevels, 
  getAllCategories,
  getAllOriginalAuthors,
  getAllTags 
} from "@/lib/wordpress";

// Update the props interface to match Next.js expectations
interface PageProps {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const metadata: Metadata = {
  title: "WordPress Plugins | Festinger Vault",
  description: "Browse our collection of premium WordPress plugins",
};

export default async function PluginsPage({ searchParams }: PageProps) {
  // Convert searchParams to the expected format
  const search = searchParams.search as string | undefined;
  const access_level = searchParams.access_level as string | undefined;
  const category = searchParams.category as string | undefined;
  const original_author = searchParams.original_author as string | undefined;
  const tag = searchParams.tag as string | undefined;
  
  // Fetch data in parallel
  const [plugins, accessLevels, categories, originalAuthors, tags] = await Promise.all([
    getAllPlugins({ 
      search, 
      access_level, 
      category, 
      original_author, 
      tag 
    }),
    getAllAccessLevels(),
    getAllCategories(),
    getAllOriginalAuthors(),
    getAllTags()
  ]);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">WordPress Plugins</h1>
      
      <div className="mb-8 space-y-6">
        {/* Search */}
        <div className="w-full md:max-w-md">
          <PluginSearch defaultValue={search} />
        </div>
        
        {/* Filters */}
        <FilterPlugins
          accessLevels={accessLevels}
          categories={categories}
          originalAuthors={originalAuthors}
          tags={tags}
          selectedAccessLevel={access_level}
          selectedCategory={category}
          selectedOriginalAuthor={original_author}
          selectedTag={tag}
        />
      </div>
      
      {/* Results */}
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
            <Suspense key={plugin.id} fallback={<div className="h-80 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
              <PluginCard plugin={plugin} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
}
