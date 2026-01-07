import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: "settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The title of your storefront.",
    }),
    defineField({
      name: "header",
      type: "header",
    }),
    defineField({
      name: "footer",
      type: "footer",
    }),
    defineField({
      name: "metadataBase",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Settings",
      };
    },
  },
});
