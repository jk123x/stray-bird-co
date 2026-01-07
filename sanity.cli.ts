/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * and customizes the Vite bundler configuration.
 * Learn more: https://www.sanity.io/docs/cli
 */

import { defineCliConfig } from "sanity/cli";

const projectId = process.env.PUBLIC_SANITY_STUDIO_PROJECT_ID || "kvufnd7b";
const dataset = process.env.PUBLIC_SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "hats-studio",
  deployment: {
    autoUpdates: true,
  },
  reactStrictMode: true,
  reactCompiler: { target: "19" },
});
