import pluralize from "pluralize-esm";
import { defineField, defineType } from "sanity";
import { ShopifyIcon } from "../../components/shopify-icon";
import { ShopifyDocumentStatus } from "../../components/shopify/shopify-document-status";
import { getPriceRange } from "../../utils/get-price-range";

const GROUPS = [
  {
    default: true,
    name: "editorial",
    title: "Editorial",
  },
  {
    name: "shopifySync",
    title: "Shopify sync",
    icon: ShopifyIcon,
  },
];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: GROUPS,
  fields: [
    defineField({
      name: "titleProxy",
      title: "Title",
      type: "proxyString",
      options: { field: "store.title" },
    }),
    defineField({
      name: "slugProxy",
      title: "Slug",
      type: "proxyString",
      options: { field: "store.slug.current" },
    }),
    defineField({
      name: "customName",
      title: "Product Name",
      type: "string",
      group: "editorial",
      description: "Custom name for this product (optional - overrides Shopify name)",
    }),
    defineField({
      name: "customDescription",
      title: "Product Description",
      type: "array",
      group: "editorial",
      description: "Your custom product description for marketing",
      of: [
        {
          type: "block",
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "editorial",
      description: "SEO meta title (for search engines)",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "editorial",
      description: "SEO meta description (for search engines)",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "editorial",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "designStory",
      title: "Design Story",
      type: "array",
      group: "editorial",
      description: "Tell the story behind this design",
      of: [
        {
          type: "block",
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Link", value: "link" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "material",
      title: "Material & Care",
      type: "array",
      group: "editorial",
      description: "Material composition and care instructions",
      of: [
        {
          type: "block",
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "sizeGuide",
      title: "Size Guide",
      type: "text",
      group: "editorial",
      description: "Sizing information and fit tips",
    }),
    defineField({
      name: "isFeatured",
      title: "Feature this product?",
      type: "boolean",
      group: "editorial",
      description: "Show on homepage or in featured section",
      initialValue: false,
    }),
    defineField({
      name: "isLimitedEdition",
      title: "Limited Edition?",
      type: "boolean",
      group: "editorial",
      initialValue: false,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "editorial",
      description: "Custom tags for filtering/organization",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      group: "editorial",
      description: "Suggest other products",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    }),
    defineField({
      name: "pageBuilder",
      title: "Page Builder",
      group: "editorial",
      type: "array",
      readOnly: false,
      of: [{ type: "editorialSection" }],
      options: {
        insertMenu: {
          views: [
            {
              name: "grid",
            },
          ],
        },
      },
    }),
    defineField({
      name: "store",
      title: "Shopify",
      type: "shopifyProduct",
      description: "Product data from Shopify (read-only)",
      group: "shopifySync",
    }),
    // Legacy fields from Shopify sync - keeping for existing documents
    defineField({
      name: "name",
      title: "Name (Legacy)",
      type: "string",
      group: "shopifySync",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "description",
      title: "Description (Legacy)",
      type: "text",
      group: "shopifySync",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "price",
      title: "Price (Legacy)",
      type: "number",
      group: "shopifySync",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "slug",
      title: "Slug (Legacy)",
      type: "slug",
      group: "shopifySync",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      isDeleted: "store.isDeleted",
      options: "store.options",
      previewImageUrl: "store.previewImageUrl",
      priceRange: "store.priceRange",
      status: "store.status",
      title: "store.title",
      variants: "store.variants",
      customName: "customName",
    },
    prepare(selection) {
      const {
        isDeleted,
        options,
        previewImageUrl,
        priceRange,
        status,
        title,
        variants,
        customName,
      } = selection;

      const optionCount = options?.length;
      const variantCount = variants?.length;

      const description = [
        variantCount ? pluralize("variant", variantCount, true) : "No variants",
        optionCount ? pluralize("option", optionCount, true) : "No options",
      ];

      let subtitle = getPriceRange(priceRange);

      if (status !== "active") {
        subtitle = "(Unavailable in Shopify)";
      }
      if (isDeleted) {
        subtitle = "(Deleted from Shopify)";
      }

      return {
        description: description.join(" / "),
        subtitle,
        title: customName || title,
        media: (
          <ShopifyDocumentStatus
            isActive={status === "active"}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={customName || title}
          />
        ),
      };
    },
  },
});