import { getFvPluginBySlug, getAllFvPlugins } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Generate static params for all plugins
export async function generateStaticParams() {
  const plugins = await getAllFvPlugins();
  return plugins.map((plugin) => ({ slug: plugin.slug }));
}

// Use the Next.js standard way without custom types
export default async function PluginPage({
  params,
}: {
  params: { slug: string };
}) {
  const plugin = await getFvPluginBySlug(params.slug);

  if (!plugin) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{plugin.title.rendered}</h1>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: plugin.content.rendered }}
      />
      {/* Display meta fields if available */}
      {plugin.meta && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Plugin Details</h2>
          <ul className="space-y-2">
            {plugin.meta.custom_product_name && (
              <li><strong>Product Name:</strong> {plugin.meta.custom_product_name}</li>
            )}
            {plugin.meta.version && (
              <li><strong>Version:</strong> {plugin.meta.version}</li>
            )}
            {/* Add other meta fields as needed */}
          </ul>
        </div>
      )}
    </div>
  );
}

// Optional: Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const plugin = await getFvPluginBySlug(params.slug);
  
  if (!plugin) {
    return {
      title: 'Plugin Not Found',
    };
  }
  
  return {
    title: plugin.title.rendered,
    description: plugin.excerpt?.rendered || '',
  };
}
