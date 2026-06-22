# AI Code Standards & Style Guidelines

## UI Design Rules
- All new web applications MUST use Vanilla CSS (no Tailwind CSS) and follow the minimalist Vercel-style design system.
- Avoid generic colors. Prioritize a premium feel with subtle borders (#eaeaea), deep grays (#111827), and clean micro-interactions.

## Markdown & SEO Content Generation Rules
When generating or reviewing automated SEO articles or any Markdown content:
1. **No Duplicate H1 Titles**: Never include an H1 (`# Title`) at the top of the Markdown body if the site framework (e.g. Next.js, Hugo, Jekyll) already renders the title from the frontmatter.
2. **Clean Formatting**: Use standard Markdown syntax. Never nest punctuation inside bold tags awkwardly (e.g., `**"Text"**`). Use `**Text**` instead.
3. **No Messy Characters**: Ensure the generated content is clean without erratic characters. 
4. **Self-Check Protocol**: Always review LLM prompts that generate content to ensure they explicitly forbid messy formatting and enforce these high standards.
