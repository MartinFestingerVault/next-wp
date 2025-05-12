import { getFvPluginBySlug, getAllFvPlugins } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Section, Container, Article, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import Balancer from "react-wrap-balancer";
import type { Metadata } from "next";

// Define FvPlugin interface to match the type returned by getAllFvPlugins
interface FvPlugin {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  meta?: {
    version?: string;
    custom_product_name?: string;
    custom_product_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export async function generateStaticParams() {
  const plugins = await getAllFvPlugins();
  // Add explicit type to the plugin parameter
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
  // Strip HTML tags for description
  const description = plugin.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || "";
  ogUrl.searchParams.append("description", description);
  
  return {
    title: plugin.title.rendered,
    description: description,
    openGraph: {
      title: plugin.title.rendered,
      description: description,
      type: "article",
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plugin = await getFvPluginBySlug(slug);
  
  if (!plugin) {
    return notFound();
  }

  return (
    <Section>
      <Container>
        <Prose>
          <h1>
            <Balancer>
              <span
                dangerouslySetInnerHTML={{ __html: plugin.title.rendered }}
              ></span>
            </Balancer>
          </h1>
        </Prose>
        <Article dangerouslySetInnerHTML={{ __html: plugin.content.rendered }} />
        
        {/* Plugin Meta Information */}
        {plugin.meta && (
          <div className="mt-8 p-6 bg-accent/10 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Plugin Details</h2>
            <ul className="space-y-3">
              {plugin.meta.custom_product_name && (
                <li><strong>Product Name:</strong> {plugin.meta.custom_product_name}</li>
              )}
              {plugin.meta.version && (
                <li><strong>Version:</strong> {plugin.meta.version}</li>
              )}
              {plugin.meta.custom_product_url && (
                <li>
                  <strong>Product URL:</strong> 
                  <a 
                    href={plugin.meta.custom_product_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline"
                  >
                    {plugin.meta.custom_product_url}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}
