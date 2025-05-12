import { getFvPluginBySlug, getAllFvPlugins, FvPlugin } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Section, Container, Article, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import Image from "next/image";
// Removed date-fns dependency
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
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const plugin = await getFvPluginBySlug(slug);
  
  if (!plugin) {
    return {};
  }
  
  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", plugin.title.rendered);
  const description = plugin.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || "";
  ogUrl.searchParams.append("description", description);
  
  return {
    title: `${plugin.title.rendered} - Premium WordPress Plugin | Festinger Vault`,
    description: description,
    openGraph: {
      title: plugin.title.rendered,
      description: description,
      type: "website",
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
  params: { slug: string };
}) {
  const { slug } = params;
  const plugin = await getFvPluginBySlug(slug);
  
  if (!plugin) {
    return notFound();
  }

  // Format dates
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

  // Format relative time without date-fns
  const getRelativeTimeString = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    
    if (diffInMonths > 0) {
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    } else if (diffInDays > 0) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    } else if (diffInMins > 0) {
      return diffInMins === 1 ? "1 minute ago" : `${diffInMins} minutes ago`;
    } else {
      return "just now";
    }
  };
  
  const updatedTimeAgo = getRelativeTimeString(plugin.modified);
  
  // Extract meta information
  const version = plugin.meta?.version || "1.0.0";
  const productName = plugin.meta?.custom_product_name || plugin.title.rendered;
  const productUrl = plugin.meta?.custom_product_url || "#";
  const isFork = plugin.meta?.is_fork === "1";
  const price = plugin.meta?.price || "$49";
  
  // Plugin features
  const features = [
    "Quick and easy setup with intuitive admin interface",
    "Seamless WordPress integration with one-click installation",
    "Optimized for performance and speed",
    "Mobile responsive and works across all devices",
    "Regular updates and dedicated support",
    "Comprehensive documentation and video tutorials",
    "Compatible with major WordPress plugins and themes",
    "Translation-ready with multilingual support"
  ];
  
  // Plugin benefits
  const benefits = [
    {
      title: "Lightning Fast Performance",
      description: "Optimized code and intelligent resource loading ensure your site runs at peak speed without sacrificing functionality.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgClass: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Intuitive Interface",
      description: "User-friendly dashboard with drag-and-drop capabilities make configuration simple for users of all skill levels.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      bgClass: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security features protect your WordPress site from common vulnerabilities and threats.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bgClass: "bg-amber-100 dark:bg-amber-900",
    },
    {
      title: "Priority Support",
      description: "Our dedicated support team ensures your questions are answered quickly and issues resolved promptly.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      bgClass: "bg-green-100 dark:bg-green-900",
    }
  ];

  // System requirements
  const requirements = [
    {
      title: "WordPress",
      version: "5.8 or higher",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bgClass: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "PHP",
      version: "7.4 or higher",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      bgClass: "bg-indigo-100 dark:bg-indigo-900",
    },
    {
      title: "MySQL",
      version: "5.6 or higher",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      bgClass: "bg-cyan-100 dark:bg-cyan-900",
    }
  ];
  
  // FAQ items
  const faqItems = [
    {
      question: "Does this plugin work with the latest WordPress version?",
      answer: "Yes, this plugin is regularly updated and fully tested with WordPress 6.4. We maintain compatibility with all major WordPress versions, ensuring seamless functionality with updates."
    },
    {
      question: "Can I use this plugin on multiple websites?",
      answer: "The standard license allows usage on a single website. For multiple sites, you'll need to purchase additional licenses or consider our developer license option, which allows usage on multiple projects."
    },
    {
      question: "How do I get support if I have questions?",
      answer: "Every purchase includes 6 months of premium support. Simply visit our support portal, submit a ticket, and our dedicated team will assist you with your questions or issues, typically responding within 24 hours."
    },
    {
      question: "Will this plugin slow down my website?",
      answer: "No, this plugin is optimized for performance. We've carefully developed it with efficiency in mind, using best coding practices to ensure minimal impact on your site's loading speed and server resources."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee. If you're not satisfied with the plugin for any reason, contact our support team within 14 days of purchase for a full refund."
    }
  ];

  // Mock values for display purposes
  const mockDownloads = 1234;
  const mockRating = 4.8;
  
  return (
    <>
      {/* Hero Banner - Full Width Gradient Background */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white">
        <Container className="py-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-2/3">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Premium WordPress Plugin
                {isFork && <span className="ml-2 px-2 py-0.5 bg-amber-500/20 rounded-full text-amber-300 text-xs">Forked</span>}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <Balancer>
                  <span dangerouslySetInnerHTML={{ __html: plugin.title.rendered }}></span>
                </Balancer>
              </h1>
              
              <p className="text-lg text-white/80 mb-6 max-w-2xl">
                {plugin.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() || 
                  "Transform your WordPress site with this premium plugin from Festinger Vault, delivering powerful features and seamless integration."}
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>
                    <strong className="text-white">{mockRating}</strong> rating
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                  <span>{mockDownloads} downloads</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Updated {updatedTimeAgo}</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>Version {version}</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              {plugin.featured_media ? (
                <div 
                  className="w-full aspect-square rounded-xl shadow-2xl overflow-hidden border-4 border-white/10 transform rotate-3 transition-transform hover:rotate-0"
                  style={{ 
                    backgroundImage: `url('/api/media/${plugin.featured_media}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
              ) : (
                <div className="w-full aspect-square rounded-xl shadow-2xl overflow-hidden border-4 border-white/10 bg-gradient-to-br from-blue-600 to-indigo-800 transform rotate-3 transition-transform hover:rotate-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold">{plugin.title.rendered}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-12">
            {productUrl && (
              <a 
                href={productUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Get the Plugin
              </a>
            )}
            
            <a
              href="#overview"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg shadow-lg backdrop-blur-sm transform hover:-translate-y-1 transition-all"
            >
              Learn More
            </a>
          </div>
        </Container>
      </div>
      
      {/* Feature Highlights - Alternating Layout with Colorful Icons */}
      <Section className="py-16 bg-gray-50 dark:bg-gray-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" id="overview">Feature Highlights</h2>
            <p className="text-muted-foreground">
              Discover what makes {plugin.title.rendered} the premium choice for WordPress users worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 items-start">
                <div className={`w-16 h-16 rounded-2xl ${benefit.bgClass} flex items-center justify-center flex-shrink-0`}>
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      
      {/* Main Content Section with Tabs Styling */}
      <Section className="py-16">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content Area (2/3 width) */}
            <div className="lg:w-2/3">
              {/* Custom Tab Navigation */}
              <div className="flex flex-wrap border-b mb-8 overflow-x-auto scrollbar-hide">
                <a href="#description" className="px-6 py-3 font-medium border-b-2 border-primary -mb-px">Description</a>
                <a href="#features" className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#requirements" className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors">Requirements</a>
                <a href="#documentation" className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                <a href="#support" className="px-6 py-3 font-medium text-muted-foreground hover:text-foreground transition-colors">Support</a>
              </div>
              
              {/* Description Tab Content */}
              <div id="description" className="space-y-8">
                <Prose>
                  <h2>Plugin Description</h2>
                </Prose>
                <Article dangerouslySetInnerHTML={{ __html: plugin.content.rendered }} />
              </div>
              
              {/* Features Tab Content */}
              <div id="features" className="mt-16 space-y-8">
                <Prose>
                  <h2>All Features</h2>
                  <p>Discover the full range of capabilities included in this premium plugin:</p>
                </Prose>
                
                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start p-4 border rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{feature}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Requirements Tab Content */}
              <div id="requirements" className="mt-16 space-y-8">
                <Prose>
                  <h2>System Requirements</h2>
                  <p>Make sure your WordPress installation meets these requirements:</p>
                </Prose>
                
                <div className="not-prose mt-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {requirements.map((req, index) => (
                      <div key={index} className="border rounded-lg p-6 bg-card">
                        <div className={`w-12 h-12 rounded-full ${req.bgClass} flex items-center justify-center mb-4`}>
                          {req.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{req.title}</h3>
                        <p className="text-muted-foreground text-sm">{req.version}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Documentation Tab Content */}
              <div id="documentation" className="mt-16 space-y-8">
                <Prose>
                  <h2>Documentation</h2>
                  <p>
                    Comprehensive documentation is provided with your purchase. Get up and running quickly with our detailed guides and tutorials.
                  </p>
                  
                  <h3>Documentation Includes:</h3>
                  <ul>
                    <li>Getting Started Guide</li>
                    <li>Installation Instructions</li>
                    <li>Configuration Options</li>
                    <li>Advanced Customization</li>
                    <li>Troubleshooting</li>
                    <li>FAQs</li>
                  </ul>
                </Prose>
                
                {productUrl && (
                  <div className="mt-6">
                    <a 
                      href={productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      Visit Documentation
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              
              {/* Support Tab Content */}
              <div id="support" className="mt-16 space-y-8">
                <Prose>
                  <h2>Premium Support</h2>
                  <p>
                    Every purchase includes 6 months of premium support. Our dedicated team is ready to help you with any questions or issues you may have.
                  </p>
                  
                  <h3>Support Includes:</h3>
                  <ul>
                    <li>Installation assistance</li>
                    <li>Configuration help</li>
                    <li>Troubleshooting</li>
                    <li>Bug fixes</li>
                    <li>Regular updates</li>
                  </ul>
                  
                  <h3>How to Get Support</h3>
                  <p>
                    Once you've purchased the plugin, you'll receive access to our dedicated support portal where you can submit tickets and get assistance.
                  </p>
                </Prose>
                
                {productUrl && (
                  <div className="mt-6">
                    <a 
                      href={productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      Contact Support
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar (1/3 width) */}
            <div className="lg:w-1/3 space-y-8">
              {/* Plugin Action Card */}
              <div className="border rounded-xl overflow-hidden bg-card sticky top-24">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">Premium Plugin</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-muted-foreground">{mockRating} rating</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-500">{price}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>6 months support included</span>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Future updates</span>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Premium documentation</span>
                    </div>
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Quality checked by Festinger Vault</span>
                    </div>
                  </div>
                  
                  {productUrl ? (
                    <a 
                      href={productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg flex items-center justify-center text-center shadow-lg transform hover:-translate-y-1 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Purchase Now
                    </a>
                  ) : (
                    <div className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg flex items-center justify-center text-center shadow-lg transform hover:-translate-y-1 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Purchase Now
                    </div>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Secure payment via Credit Card, PayPal or other methods
                  </p>
                </div>
              </div>
              
              {/* Plugin Details Card */}
              <div className="border rounded-xl overflow-hidden bg-card">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">Plugin Details</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {productName && (
                      <div className="flex items-start">
                        <div className="w-1/3 text-muted-foreground">Product</div>
                        <div className="w-2/3 font-medium">{productName}</div>
                      </div>
                    )}
                    
                    {version && (
                      <div className="flex items-start">
                        <div className="w-1/3 text-muted-foreground">Version</div>
                        <div className="w-2/3 font-medium">{version}</div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <div className="w-1/3 text-muted-foreground">Released</div>
                      <div className="w-2/3 font-medium">{pluginDate}</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-1/3 text-muted-foreground">Updated</div>
                      <div className="w-2/3 font-medium">{pluginUpdated}</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-1/3 text-muted-foreground">Works with</div>
                      <div className="w-2/3 font-medium">WordPress 5.8 - 6.4</div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-1/3 text-muted-foreground">Support</div>
                      <div className="w-2/3 font-medium">6 months included</div>
                    </div>
                    
                    {isFork && (
                      <div className="flex items-start">
                        <div className="w-1/3 text-muted-foreground">Type</div>
                        <div className="w-2/3 font-medium">Forked Plugin</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Author Card */}
              <div className="border rounded-xl overflow-hidden bg-card">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold">About the Author</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      FV
                    </div>
                    <div>
                      <h4 className="font-bold">Festinger Vault</h4>
                      <p className="text-sm text-muted-foreground">Premium WordPress Plugins</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    Festinger Vault provides high-quality premium WordPress plugins and themes for developers and site owners looking for exceptional functionality and design.
                  </p>
                  
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary hover:underline text-sm">
                      View Portfolio
                    </a>
                    <a href="#" className="text-primary hover:underline text-sm">
                      Contact Author
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Related Plugins */}
              <div className="border rounded-xl overflow-hidden bg-card">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-bold">Related Plugins</h3>
                  <Link href="/plugins" className="text-primary hover:underline text-sm">
                    View All
                  </Link>
                </div>
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Link key={i} href={`/plugins/related-plugin-${i}`} className="flex border-b pb-4 last:border-b-0 last:pb-0 group">
                      <div className="w-16 h-16 bg-accent/10 rounded overflow-hidden flex-shrink-0 mr-4">
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">Related Plugin {i}</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">(32)</span>
                        </div>
                        <div className="text-amber-500 text-sm font-medium mt-1">$39</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      {/* FAQ Section with Accordion-style Appearance */}
      <Section className="py-16 bg-gray-50 dark:bg-gray-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about {plugin.title.rendered}
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y">
            {faqItems.map((faq, index) => (
              <div key={index} className="py-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">{faq.question}</h3>
                  <button className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      
      {/* Call to Action Section */}
      <Section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your WordPress Site?</h2>
            <p className="text-lg text-white/80 mb-8">
              Join thousands of satisfied users who have enhanced their WordPress experience with {plugin.title.rendered}.
            </p>
            
            {productUrl ? (
              <a 
                href={productUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg shadow-xl transform hover:-translate-y-1 transition-all text-lg"
              >
                Get Started Today
              </a>
            ) : (
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-lg shadow-xl transform hover:-translate-y-1 transition-all text-lg">
                Get Started Today
              </div>
            )}
            
            <p className="text-sm text-white/60 mt-6">
              6 months support included with your purchase
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
