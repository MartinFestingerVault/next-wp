// Common types that are reused across multiple entities
interface WPEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  link: string;
  guid: {
    rendered: string;
  };
}

interface RenderedContent {
  rendered: string;
  protected: boolean;
}

interface RenderedTitle {
  rendered: string;
}

// Media types
interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
}

export interface FeaturedMedia extends WPEntity {
  title: RenderedTitle;
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

// Content types
export interface Post extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "chat"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio";
  categories: number[];
  tags: number[];
  meta: Record<string, unknown>;
}

export interface Page extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: Record<string, unknown>;
}

// Taxonomy types
interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  meta: Record<string, unknown>;
}

export interface Category extends Taxonomy {
  taxonomy: "category";
  parent: number;
}

export interface Tag extends Taxonomy {
  taxonomy: "post_tag";
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
  meta: Record<string, unknown>;
}

// Block types
interface BlockSupports {
  align?: boolean | string[];
  anchor?: boolean;
  className?: boolean;
  color?: {
    background?: boolean;
    gradients?: boolean;
    text?: boolean;
  };
  spacing?: {
    margin?: boolean;
    padding?: boolean;
  };
  typography?: {
    fontSize?: boolean;
    lineHeight?: boolean;
  };
  [key: string]: unknown;
}

interface BlockStyle {
  name: string;
  label: string;
  isDefault: boolean;
}

export interface BlockType {
  api_version: number;
  title: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  keywords: string[];
  parent: string[];
  supports: BlockSupports;
  styles: BlockStyle[];
  textdomain: string;
  example: Record<string, unknown>;
  attributes: Record<string, unknown>;
  provides_context: Record<string, string>;
  uses_context: string[];
  editor_script: string;
  script: string;
  editor_style: string;
  style: string;
}

export interface EditorBlock {
  id: string;
  name: string;
  attributes: Record<string, unknown>;
  innerBlocks: EditorBlock[];
  innerHTML: string;
  innerContent: string[];
}

export interface TemplatePart {
  id: string;
  slug: string;
  theme: string;
  type: string;
  source: string;
  origin: string;
  content: string | EditorBlock[];
  title: {
    raw: string;
    rendered: string;
  };
  description: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  wp_id: number;
  has_theme_file: boolean;
  author: number;
  area: string;
}

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _links: {
    self: Array<{
      embeddable: boolean;
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
  };
}

// Component Props Types
export interface FilterBarProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: Author["id"];
  selectedTag?: Tag["id"];
  selectedCategory?: Category["id"];
  onAuthorChange?: (authorId: Author["id"] | undefined) => void;
  onTagChange?: (tagId: Tag["id"] | undefined) => void;
  onCategoryChange?: (categoryId: Category["id"] | undefined) => void;
}

interface FVPlugin extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  featured_media: number;
  // Custom fields from meta boxes
  meta: {
    is_fork: string;
    is_done: string;
    version: string;
    old_item_id: string;
    // Custom fields
    custom_product_name: string;
    custom_slug: string;
    custom_product_url: string;
    custom_short_description: string;
    custom_author: string;
    custom_author_url: string;
    custom_text_domain: string;
    custom_domain_path: string;
    custom_license: string;
    custom_license_url: string;
    custom_license_text: string;
    custom_requires_at_least: string;
    custom_required_php_version: string;
    custom_tested_up_to: string;
    custom_stable_tag: string;
    custom_wc_requires_at_least: string;
    custom_wc_tested_up_to: string;
    custom_wc_stable_tag: string;
    custom_contributors: string;
    custom_donate_link: string;
    custom_long_description: string;
    custom_installation: string;
    custom_faq: string;
    custom_screenshots: string;
    custom_copyright: string;
    custom_Third_Party_Resources: string;
    custom_changelog: string;
    // Original fields
    original_product_name: string;
    original_slug: string;
    original_product_url: string;
    // ...etc. (similar to custom fields)
  };
  // Taxonomies
  fv_access_level: number[];
  fv_category: number[];
  original_author_tax: number[];
  fv_tag: number[];
}

// Add taxonomy interfaces
interface FVAccessLevel extends Taxonomy {
  // Additional properties specific to access levels if any
}

interface FVCategory extends Taxonomy {
  // Additional properties specific to categories if any
}

interface FVOriginalAuthor extends Taxonomy {
  // Additional properties specific to original authors if any
}

interface FVTag extends Term {
  // Additional properties specific to tags if any
}
