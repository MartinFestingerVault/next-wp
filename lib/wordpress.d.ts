// WordPress REST API type definitions

export interface WPEntity {
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

export interface RenderedContent {
  rendered: string;
  protected?: boolean;
}

export interface RenderedTitle {
  rendered: string;
}

export interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent?: number;
  meta?: Record<string, any>;
}

export interface Term {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta?: Record<string, any>;
}

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
  format: string;
  categories: number[];
  tags: number[];
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
}

export interface Category extends Taxonomy {
  parent: number;
}

export interface Tag extends Term {}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
  meta?: Record<string, any>;
}

export interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
  image_meta: Record<string, any>;
}

export interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface FeaturedMedia extends WPEntity {
  title: RenderedTitle;
  author: number;
  caption: RenderedContent;
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

// Festinger Vault Custom Post Types and Taxonomies

export interface FVPlugin extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  featured_media: number;
  // Custom fields from meta boxes
  meta: {
    is_fork?: string;
    is_done?: string;
    version?: string;
    old_item_id?: string;
    // Custom fields
    custom_product_name?: string;
    custom_slug?: string;
    custom_product_url?: string;
    custom_short_description?: string;
    custom_author?: string;
    custom_author_url?: string;
    custom_text_domain?: string;
    custom_domain_path?: string;
    custom_license?: string;
    custom_license_url?: string;
    custom_license_text?: string;
    custom_requires_at_least?: string;
    custom_required_php_version?: string;
    custom_tested_up_to?: string;
    custom_stable_tag?: string;
    custom_wc_requires_at_least?: string;
    custom_wc_tested_up_to?: string;
    custom_wc_stable_tag?: string;
    custom_contributors?: string;
    custom_donate_link?: string;
    custom_long_description?: string;
    custom_installation?: string;
    custom_faq?: string;
    custom_screenshots?: string;
    custom_copyright?: string;
    custom_Third_Party_Resources?: string;
    custom_changelog?: string;
    // Original fields
    original_product_name?: string;
    original_slug?: string;
    original_product_url?: string;
    original_author?: string;
    original_author_url?: string;
    original_text_domain?: string;
    original_domain_path?: string;
    original_license?: string;
    original_license_url?: string;
    original_license_text?: string;
    original_requires_at_least?: string;
    original_required_php_version?: string;
    original_tested_up_to?: string;
    original_stable_tag?: string;
    original_wc_requires_at_least?: string;
    original_wc_tested_up_to?: string;
    original_wc_stable_tag?: string;
    original_contributors?: string;
    original_donate_link?: string;
    original_long_description?: string;
    original_installation?: string;
    original_faq?: string;
    original_screenshots?: string;
    original_copyright?: string;
    original_Third_Party_Resources?: string;
    original_changelog?: string;
  };
  // Taxonomies
  fv_access_level?: number[];
  fv_category?: number[];
  original_author_tax?: number[];
  fv_tag?: number[];
}

// Add taxonomy interfaces
export interface FVAccessLevel extends Taxonomy {
  // Additional properties specific to access levels if any
}

export interface FVCategory extends Taxonomy {
  // Additional properties specific to categories if any
}

export interface FVOriginalAuthor extends Taxonomy {
  // Additional properties specific to original authors if any
}

export interface FVTag extends Term {
  // Additional properties specific to tags if any
}
