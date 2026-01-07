import { defineField, defineType } from "sanity";

export const plp = defineType({
  name: "plp",
  title: "PLP",
  type: "document",
  fields: [
    // TODO: filtering options to add here
    defineField({
      name: "pageSeo",
      type: "pageSeo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "PLP" }),
  },
});
