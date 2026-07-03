import fs from 'fs'
import path from 'path'

export type GuideLanguage = 'zh' | 'en'

export type GuideSummary = {
  slug: string
  title: string
  description: string
  date: string
  lastModified: string
}

export type Guide = GuideSummary & {
  content: string
}

const guideRoot = path.join(process.cwd(), 'src', 'content', 'guides')

function getGuideDir(lang: GuideLanguage) {
  return path.join(guideRoot, lang)
}

function stripQuotes(value: string) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {} as Record<string, string>, content: raw.trim() }
  }

  const data: Record<string, string> = {}
  match[1].split(/\r?\n/).forEach(line => {
    const index = line.indexOf(':')
    if (index === -1) return
    const key = line.slice(0, index).trim()
    const value = stripQuotes(line.slice(index + 1))
    if (key) data[key] = value
  })

  return { data, content: match[2].trim() }
}

function fallbackTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseGuideFile(filePath: string): Guide {
  const raw = fs.readFileSync(filePath, 'utf8')
  const stat = fs.statSync(filePath)
  const { data, content } = parseFrontmatter(raw)
  const slug = path.basename(filePath, '.md')

  return {
    slug,
    title: data.title || fallbackTitle(slug),
    description:
      data.description ||
      content.split(/\r?\n\r?\n/)[0]?.replace(/[#*_>`]/g, '').trim() ||
      fallbackTitle(slug),
    date: data.date || stat.mtime.toISOString().slice(0, 10),
    lastModified: stat.mtime.toISOString(),
    content,
  }
}

export function getGuides(lang: GuideLanguage): GuideSummary[] {
  const dirPath = getGuideDir(lang)
  if (!fs.existsSync(dirPath)) return []

  return fs
    .readdirSync(dirPath)
    .filter(name => name.endsWith('.md'))
    .map(name => parseGuideFile(path.join(dirPath, name)))
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    .map(guide => ({
      slug: guide.slug,
      title: guide.title,
      description: guide.description,
      date: guide.date,
      lastModified: guide.lastModified,
    }))
}

export function getGuideBySlug(lang: GuideLanguage, slug: string): Guide | null {
  const filePath = path.join(getGuideDir(lang), `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parseGuideFile(filePath)
}
