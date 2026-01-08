import { defineField, defineType } from "sanity";
import { SquareIcon } from "@sanity/icons";

export const featuredProducts = defineType({
  name: "featuredProducts",
  title: "Featured Products",
  type: "object",
  icon: SquareIcon,
  fields: [
    defineField({
      name: "products",
      title: "Products",
      description: "Select up to 6 products to feature",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      validation: (Rule) => Rule.max(6).unique(),
    }),
  ],
  preview: {
    select: {
      products: "products",
    },
    prepare({ products }) {
      const count = products?.length || 0;
      return {
        title: `Featured Products (${count})`,
        media: SquareIcon,
      };
    },
  },
});
