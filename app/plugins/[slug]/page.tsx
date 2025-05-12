import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFVPluginBySlug, getFeaturedMediaById } from "@/lib/wordpress";

// Basic type for params
type PageParams = {
  params: {
    slug: string;
  };
};

// Generate metadata for the page with basic types
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  try {
    const plugin = await getFVPluginBySlug(params.slug);
    
    return {
      title: `${plugin.title.rendered} | Festinger Vault`,
      description: plugin.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
      openGraph: {
        title: plugin.title.rendered,
        description: plugin.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: 'Plugin Not Found',
      description: 'The requested plugin could not be found.',
    };
  }
}

// Default export with typed params
export default async function Page({ params }: PageParams) {
  try {
    const plugin = await getFVPluginBySlug(params.slug);
    
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
      <div className="container mx-auto py-8">
        <div className="mb-8 space-y-2">
          <Link href="/plugins" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            ← Back to all plugins
          </Link>
          
          <h1 
            className="text-3xl font-bold sm:text-4xl"
            dangerouslySetInnerHTML={{ __html: plugin.title.rendered }}
          />
          
          <div className="flex flex-wrap gap-2">
            {plugin.meta?.version && (
              <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Version {plugin.meta.version}
              </div>
            )}
            {plugin.meta?.custom_requires_at_least && (
              <div className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Requires WP {plugin.meta.custom_requires_at_least}+
              </div>
            )}
            {plugin.meta?.is_fork === "1" && (
              <div className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                Fork
              </div>
            )}
          </div>
          
          {plugin.meta?.custom_author && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              By: {plugin.meta.custom_author_url ? (
                <a 
                  href={plugin.meta.custom_author_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {plugin.meta.custom_author}
                </a>
              ) : (
                plugin.meta.custom_author
              )}
              {' • '}Updated: {formattedDate}
            </div>
          )}
        </div>
        
        {/* Featured Image */}
        {featuredMedia && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <Image
              src={featuredMedia.source_url}
              alt={plugin.title.rendered}
              width={featuredMedia.media_details.width || 1200}
              height={featuredMedia.media_details.height || 800}
              className="h-auto w-full"
            />
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Description */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none dark:prose-invert">
              <h2>Description</h2>
              <div dangerouslySetInnerHTML={{ __html: plugin.content.rendered }} />
              
              {plugin.meta?.custom_long_description && (
                <>
                  <h3>Detailed Description</h3>
                  <div dangerouslySetInnerHTML={{ __html: plugin.meta.custom_long_description }} />
                </>
              )}
              
              {plugin.meta?.custom_installation && (
                <>
                  <h3>Installation</h3>
                  <div dangerouslySetInnerHTML={{ __html: plugin.meta.custom_installation }} />
                </>
              )}
              
              {plugin.meta?.custom_faq && (
                <>
                  <h3>Frequently Asked Questions</h3>
                  <div dangerouslySetInnerHTML={{ __html: plugin.meta.custom_faq }} />
                </>
              )}
              
              {plugin.meta?.custom_changelog && (
                <>
                  <h3>Changelog</h3>
                  <div dangerouslySetInnerHTML={{ __html: plugin.meta.custom_changelog }} />
                </>
              )}
            </div>
          </div>
          
          {/* Right Column: Plugin Information */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h3 className="mb-4 text-xl font-semibold">Plugin Information</h3>
              
              <div className="space-y-3">
                {plugin.meta?.custom_product_url && (
                  <div>
                    <span className="font-medium">Official Website:</span>{" "}
                    <a 
                      href={plugin.meta.custom_product_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                
                {plugin.meta?.custom_license && (
                  <div>
                    <span className="font-medium">License:</span>{" "}
                    {plugin.meta.custom_license_url ? (
                      <a 
                        href={plugin.meta.custom_license_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {plugin.meta.custom_license}
                      </a>
                    ) : (
                      plugin.meta.custom_license
                    )}
                  </div>
                )}
                
                {plugin.meta?.custom_text_domain && (
                  <div>
                    <span className="font-medium">Text Domain:</span>{" "}
                    {plugin.meta.custom_text_domain}
                  </div>
                )}
                
                {plugin.meta?.custom_requires_at_least && (
                  <div>
                    <span className="font-medium">Requires WordPress:</span>{" "}
                    {plugin.meta.custom_requires_at_least}+
                  </div>
                )}
                
                {plugin.meta?.custom_tested_up_to && (
                  <div>
                    <span className="font-medium">Tested up to:</span>{" "}
                    WordPress {plugin.meta.custom_tested_up_to}
                  </div>
                )}
                
                {plugin.meta?.custom_required_php_version && (
                  <div>
                    <span className="font-medium">Requires PHP:</span>{" "}
                    {plugin.meta.custom_required_php_version}+
                  </div>
                )}
                
                {/* WooCommerce Compatibility */}
                {(plugin.meta?.custom_wc_requires_at_least || plugin.meta?.custom_wc_tested_up_to) && (
                  <div>
                    <span className="font-medium">WooCommerce Compatibility:</span>{" "}
                    {plugin.meta.custom_wc_requires_at_least && `${plugin.meta.custom_wc_requires_at_least}+`}
                    {plugin.meta.custom_wc_requires_at_least && plugin.meta.custom_wc_tested_up_to && " to "}
                    {plugin.meta.custom_wc_tested_up_to && plugin.meta.custom_wc_tested_up_to}
                  </div>
                )}
              </div>
            </div>
            
            {/* Original Author Information */}
            {plugin.meta?.original_product_name && (
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                <h3 className="mb-4 text-xl font-semibold">Original Plugin</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {plugin.meta.original_product_name}
                  </div>
                  
                  {plugin.meta.original_product_url && (
                    <div>
                      <span className="font-medium">Official Website:</span>{" "}
                      <a 
                        href={plugin.meta.original_product_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Visit Original
                      </a>
                    </div>
                  )}
                  
                  {plugin.meta.original_author && (
                    <div>
                      <span className="font-medium">Author:</span>{" "}
                      {plugin.meta.original_author_url ? (
                        <a 
                          href={plugin.meta.original_author_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {plugin.meta.original_author}
                        </a>
                      ) : (
                        plugin.meta.original_author
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching plugin:", error);
    notFound();
  }
}
