import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local one-off maintenance scripts, not application/runtime code.
    "clean_logo.js",
    "fix_fonts.js",
    "fix_ordernames.js",
    "force_crop.js",
    "pangu.js",
    "patch_api_links.js",
    "patch_en_json.js",
    "patch_json.js",
    "validate_products.js",
    "scratch/**",
    "ops/**",
  ]),
]);

export default eslintConfig;
