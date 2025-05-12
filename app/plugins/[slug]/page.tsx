import { getFvPluginBySlug, getAllFvPlugins, FvPlugin } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Section, Container, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Download, 
  Star, 
  Calendar, 
  RefreshCw, 
  FileCode, 
  Info, 
  CheckCircle,
  ShoppingCart
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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

  // Sample demo data (replace with actual plugin data when available)
  const demoUrl = plugin.meta?.custom_product_url || "#";
  const documentationUrl = plugin.meta?.documentation_url || "#";
  const version = plugin.meta?.version || "1.0.0";
  const price = "$49";
  const sales = "1,234";
  const rating = 4.8;
  
  // Extract features from the content or use default features
  const features = [
    "Seamless WordPress Integration",
    "Easy Setup and Configuration",
    "Regular Updates and Support",
    "Extensive Documentation",
    "Performance Optimized",
    "Mobile Responsive"
  ];
  
  return (
    <>
      {/* Hero Section with Preview Image */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background border-b">
        <Container className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Plugin Preview */}
            <div className="rounded-lg overflow-hidden border bg-card shadow-lg aspect-video flex items-center justify-center">
              {plugin.featured_media ? (
                <img 
                  src={`/api/media/${plugin.featured_media}`} 
                  alt={plugin.title.rendered} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent/10 flex items-center justify-center p-8">
                  <div className="text-center">
                    <FileCode className="w-16 h-16 mx-auto mb-4 text-primary/60" />
                    <h3 className="text-xl font-semibold">{plugin.title.rendered}</h3>
                    <p className="text-muted-foreground mt-2">Premium WordPress Plugin</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Plugin Info */}
            <div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary">WordPress Plugin</Badge>
                  {plugin.meta?.is_fork === "1" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Forked</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold">
                  <span dangerouslySetInnerHTML={{ __html: plugin.title.rendered }}></span>
                </h1>
                
                <div className="flex items-center text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{rating}</span>
                    <span className="mx-2 text-gray-400">•</span>
                  </div>
                  <span>{sales} sales</span>
                </div>
                
                <div className="text-muted-foreground text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Released: {pluginDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Last Update: {pluginUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Version: {version}</span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button size="lg" className="w-full md:w-auto">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Purchase - {price}
                    </Button>
                    <Button variant="outline" size="lg" className="w-full md:w-auto" asChild>
                      <Link href={demoUrl} target="_blank">
                        Live Preview <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Main Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-6 pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: plugin.content.rendered }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-6 pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h2>Key Features</h2>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plugin.meta?.custom_product_url && (
                      <div className="mt-8">
                        <Button asChild>
                          <Link href={plugin.meta.custom_product_url} target="_blank">
                            Visit Official Website <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-6 pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h2>Documentation</h2>
                    <p>
                      Complete documentation is available with your purchase. Below is a summary of what's included:
                    </p>
                    <ul>
                      <li>Installation guide</li>
                      <li>Configuration settings</li>
                      <li>Troubleshooting tips</li>
                      <li>Frequently asked questions</li>
                      <li>API documentation</li>
                    </ul>
                    
                    <div className="mt-8">
                      <Button variant="outline" asChild>
                        <Link href={documentationUrl} target="_blank">
                          View Documentation <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="support" className="space-y-6 pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h2>Support Policy</h2>
                    <p>
                      We offer full support for all our plugin customers. Our support team is available to help you with:
                    </p>
                    <ul>
                      <li>Installation assistance</li>
                      <li>Configuration help</li>
                      <li>Troubleshooting common issues</li>
                      <li>Guidance on using plugin features</li>
                    </ul>
                    
                    <h3>Support Channels</h3>
                    <p>
                      Support is available through our dedicated support portal and email system. Premium customers receive priority support with faster response times.
                    </p>
                    
                    <div className="mt-8">
                      <Button variant="outline">
                        Contact Support <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Requirements Card */}
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="font-semibold text-lg mb-4">Requirements</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>WordPress 5.8 or higher</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>PHP 7.4 or higher</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span>MySQL 5.6 or higher</span>
                  </li>
                </ul>
              </div>
              
              {/* Plugin Meta Information */}
              {plugin.meta && (
                <div className="border rounded-lg p-6 bg-card">
                  <h3 className="font-semibold text-lg mb-4">Plugin Details</h3>
                  <ul className="space-y-3 text-sm">
                    {plugin.meta.custom_product_name && (
                      <li className="flex flex-col">
                        <span className="text-muted-foreground">Product Name</span>
                        <span className="font-medium">{plugin.meta.custom_product_name}</span>
                      </li>
                    )}
                    {plugin.meta.version && (
                      <li className="flex flex-col">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-medium">{plugin.meta.version}</span>
                      </li>
                    )}
                    {plugin.meta.custom_product_url && (
                      <li className="flex flex-col">
                        <span className="text-muted-foreground">Official Website</span>
                        <a 
                          href={plugin.meta.custom_product_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          Visit Site
                        </a>
                      </li>
                    )}
                    {/* Add other meta fields as needed */}
                  </ul>
                </div>
              )}
              
              {/* Download/Purchase Call to Action */}
              <div className="border rounded-lg p-6 bg-primary/5 text-center">
                <h3 className="font-semibold text-lg mb-2">Ready to Purchase?</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Get instant access to this premium plugin with one year of updates and support.
                </p>
                <Button className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Purchase - {price}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Secure payment via Credit Card, PayPal or other methods
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      {/* Related Plugins Section */}
      <Section className="bg-muted/50">
        <Container>
          <h2 className="text-2xl font-bold mb-8">Related Plugins You May Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link 
                href="#" 
                key={i} 
                className="group block bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] bg-accent/10 flex items-center justify-center">
                  <FileCode className="w-10 h-10 text-muted-foreground/60" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Related Plugin Example {i}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>4.{i+5}</span>
                    <span className="mx-2">•</span>
                    <span>${30 + (i * 10)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
