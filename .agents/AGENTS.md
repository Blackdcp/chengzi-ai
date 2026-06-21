## UI Standard for Subpages
All new subpages (e.g., tools, standalone features) MUST follow the light-theme standardized UI architecture established in ppt2pdf.
1. Background: #fafafa
2. Text color: #111827 and #666666
3. Header: A white (#ffffff) sticky header with a back button (← Back to Home).
4. Layout: Max-width 1080px, centered main content with clean shadows.
Do not use raw dark mode Tailwind styles (like bg-[#111111]) for page wrappers.

## SEO/GEO Development Standard
When building new features, tools, or standalone subpages, SEO and GEO requirements MUST be implemented synchronously by default. Do not wait for the user to remind you.
1. **Metadata**: Always define `generateMetadata` in `page.tsx` with customized `title`, `description`, `openGraph`, and `twitter:card`.
2. **Sitemap**: Always update `src/app/sitemap.ts` to include the new URLs. Ensure any internal placeholder/fake product links are excluded.
3. **Dictionaries**: Always update `zh.json` and `en.json` with the required meta tags and UI texts.
4. **Image Sharing**: Always ensure the page inherits or explicitly sets the OG and Twitter thumbnail images correctly.
