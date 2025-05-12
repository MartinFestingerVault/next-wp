import { getFvPluginBySlug, getAllFvPlugins, FvPlugin } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Section, Container, Article, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const plugins = await getAllFvPlugins();
  return plugins.map((plugin: FvPlugin) => ({
    slug: plugin.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plugin = await getFvPluginBySlug(slug);
  
  if (!plugin) {
    return {};
  }
  
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", plugin.title.rendered);
  const description = plugin.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || "";
  ogUrl.searchParams.append("description", description);
  
  return {
    title: `${plugin.title.rendered} - Premium WordPress Plugin`,
    description: description,
    openGraph: {
      title: plugin.title.rendered,
      description: description,
      type: "product",
      url: `${siteConfig.site_domain}/plugins/${plugin.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: plugin.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: plugin.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plugin = await getFvPluginBySlug(slug);
  
  if (!plugin) {
    return notFound();
  }

  const pluginDate = new Date(plugin.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const pluginUpdated = new Date(plugin.modified).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  // Extract version information from metadata
  const version = plugin.meta?.version || "1.0.0";
  const productName = plugin.meta?.custom_product_name || plugin.title.rendered;
  const productUrl = plugin.meta?.custom_product_url || "#";
  
  return (
    <Section>
      <Container>
        {/* Plugin Header */}
        <div className="mb-8 pb-8 border-b">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Plugin Preview Image */}
            <div className="w-full md:w-2/5 lg:w-1/3 bg-accent/10 aspect-video rounded-lg border overflow-hidden flex items-center justify-center">
              {plugin.featured_media ? (
                <img 
                  src={`/api/media/${plugin.featured_media}`} 
                  alt={plugin.title.rendered} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <h3 className="text-xl font-medium">{plugin.title.rendered}</h3>
                  <p className="text-muted-foreground mt-2">Premium WordPress Plugin</p>
                </div>
              )}
            </div>
            
            {/* Plugin Info */}
            <div className="flex-1">
              <div className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium mb-3">
                WordPress Plugin
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <Balancer>
                  <span dangerouslySetInnerHTML={{ __html: plugin.title.rendered }}></span>
                </Balancer>
              </h1>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div>
                  <span className="font-medium">Version:</span> {version}
                </div>
                <div>
                  <span className="font-medium">Released:</span> {pluginDate}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {pluginUpdated}
                </div>
                {plugin.meta?.custom_product_url && (
                  <div>
                    <span className="font-medium">Official Website:</span>{" "}
                    <a 
                      href={plugin.meta.custom_product_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {new URL(plugin.meta.custom_product_url).hostname}
                    </a>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href={productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  View Official Website
                </a>
                <a 
                  href="#details" 
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90 transition-colors"
                >
                  Plugin Details
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="md:col-span-2">
            <div className="space-y-8">
              {/* Plugin Description */}
              <div id="description">
                <Prose>
                  <h2>Description</h2>
                </Prose>
                <Article dangerouslySetInnerHTML={{ __html: plugin.content.rendered }} />
              </div>
              
              {/* Features */}
              <div id="features">
                <Prose>
                  <h2>Key Features</h2>
                  <ul>
                    <li>Seamlessly integrates with WordPress</li>
                    <li>Easy to set up and configure</li>
                    <li>Regular updates and support</li>
                    <li>Fully documented</li>
                    <li>Performance optimized</li>
                    <li>Mobile-friendly and responsive</li>
                  </ul>
                </Prose>
              </div>
              
              {/* Requirements */}
              <div id="requirements">
                <Prose>
                  <h2>Requirements</h2>
                  <ul>
                    <li>WordPress 5.8 or higher</li>
                    <li>PHP 7.4 or higher</li>
                    <li>MySQL 5.6 or higher</li>
                  </ul>
                </Prose>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plugin Details */}
            <div id="details" className="p-6 border rounded-lg bg-accent/5">
              <h3 className="text-xl font-semibold mb-4">Plugin Details</h3>
              
              <div className="space-y-4">
                {plugin.meta?.custom_product_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Product Name</p>
                    <p className="font-medium">{plugin.meta.custom_product_name}</p>
                  </div>
                )}
                
                {plugin.meta?.version && (
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="font-medium">{plugin.meta.version}</p>
                  </div>
                )}
                
                {/* Compatibility */}
                <div>
                  <p className="text-sm text-muted-foreground">Compatible With</p>
                  <p className="font-medium">WordPress 5.8 - 6.4</p>
                </div>
                
                {/* Last Update */}
                <div>
                  <p className="text-sm text-muted-foreground">Last Update</p>
                  <p className="font-medium">{pluginUpdated}</p>
                </div>
                
                {/* Support */}
                <div>
                  <p className="text-sm text-muted-foreground">Support</p>
                  <p className="font-medium">6 months included</p>
                </div>
              </div>
              
              {plugin.meta?.custom_product_url && (
                <div className="mt-6">
                  <a 
                    href={plugin.meta.custom_product_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Visit Official Website
                  </a>
                </div>
              )}
            </div>
            
            {/* Related Plugins */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Related Plugins</h3>
              <div className="space-y-4">
                <Link 
                  href="/plugins" 
                  className="block p-3 border rounded-md hover:bg-accent/5 transition-colors"
                >
                  <h4 className="font-medium">All Plugins</h4>
                  <p className="text-sm text-muted-foreground mt-1">Browse our entire plugin collection</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
