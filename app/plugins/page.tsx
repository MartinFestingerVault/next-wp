import { getAllFvPlugins } from "@/lib/wordpress";
import Link from "next/link";

export default async function PluginsPage() {
  const plugins = await getAllFvPlugins();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Plugins</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <Link
            href={`/plugins/${plugin.slug}`}
            key={plugin.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{plugin.title.rendered}</h2>
            <div 
              className="mt-2 text-gray-600" 
              dangerouslySetInnerHTML={{ __html: plugin.excerpt.rendered }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
