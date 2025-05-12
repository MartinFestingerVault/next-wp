// components/plugins/plugin-filter.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPluginsProps {
  accessLevels: Array<{ id: number; name: string }>;
  categories: Array<{ id: number; name: string }>;
  originalAuthors: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  selectedAccessLevel?: string;
  selectedCategory?: string;
  selectedOriginalAuthor?: string;
  selectedTag?: string;
}

export function FilterPlugins({
  accessLevels,
  categories,
  originalAuthors,
  tags,
  selectedAccessLevel,
  selectedCategory,
  selectedOriginalAuthor,
  selectedTag,
}: FilterPluginsProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // State to track filter changes
  const [accessLevel, setAccessLevel] = useState<string | undefined>(selectedAccessLevel);
  const [category, setCategory] = useState<string | undefined>(selectedCategory);
  const [originalAuthor, setOriginalAuthor] = useState<string | undefined>(selectedOriginalAuthor);
  const [tag, setTag] = useState<string | undefined>(selectedTag);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string | undefined) => {
    // Update local state
    switch (filterType) {
      case "access_level":
        setAccessLevel(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "original_author":
        setOriginalAuthor(value);
        break;
      case "tag":
        setTag(value);
        break;
    }

    // Build query parameters
    const params = new URLSearchParams();
    
    if (filterType === "access_level") {
      if (value) params.set("access_level", value);
    } else if (accessLevel) {
      params.set("access_level", accessLevel);
    }
    
    if (filterType === "category") {
      if (value) params.set("category", value);
    } else if (category) {
      params.set("category", category);
    }
    
    if (filterType === "original_author") {
      if (value) params.set("original_author", value);
    } else if (originalAuthor) {
      params.set("original_author", originalAuthor);
    }
    
    if (filterType === "tag") {
      if (value) params.set("tag", value);
    } else if (tag) {
      params.set("tag", tag);
    }

    // Update URL
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setAccessLevel(undefined);
    setCategory(undefined);
    setOriginalAuthor(undefined);
    setTag(undefined);
    router.push(pathname);
  };

  // Check if any filters are active
  const hasActiveFilters = !!(selectedAccessLevel || selectedCategory || selectedOriginalAuthor || selectedTag);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Access Level Filter */}
        <Select
          value={accessLevel}
          onValueChange={(value) => handleFilterChange("access_level", value || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Access Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Access Levels</SelectItem>
            {accessLevels.map((level) => (
              <SelectItem key={level.id} value={level.id.toString()}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={category}
          onValueChange={(value) => handleFilterChange("category", value || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Original Author Filter */}
        <Select
          value={originalAuthor}
          onValueChange={(value) => handleFilterChange("original_author", value || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Original Author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Authors</SelectItem>
            {originalAuthors.map((author) => (
              <SelectItem key={author.id} value={author.id.toString()}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <Select
          value={tag}
          onValueChange={(value) => handleFilterChange("tag", value || undefined)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Tags</SelectItem>
            {tags.map((t) => (
              <SelectItem key={t.id} value={t.id.toString()}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
