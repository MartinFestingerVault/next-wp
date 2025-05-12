import { getAllFvPlugins } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plugins",
  description: "Browse all available plugins",
};

export default async function PluginsPage() {
  const plugins = await getAllFvPlugins();

  return (
    <Section>
      <Container>
        <Prose>
          <h1>Plugins</h1>
          <p>Browse our collection of premium plugins.</p>
        </Prose>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {plugins.map((plugin) => (
            <Link
              href={`/plugins/${plugin.slug}`}
              key={plugin.id}
              className="block p-6 border rounded-lg hover:shadow-md transition-shadow bg-card"
            >
              <h2 className="text-xl font-semibold mb-2">{plugin.title.rendered}</h2>
              <div 
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: plugin.excerpt?.rendered || '' }}
              />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
