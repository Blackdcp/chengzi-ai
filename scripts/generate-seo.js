const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const API_KEY = 'sk-hQe8X3F1rnujEclYAuRgZEYWEGgZ5B7Gvs9H0Pe964k7nbxg';
const BASE_URL = 'apihub.agnes-ai.com';
const MODEL = 'agnes-2.0-flash';
const BLOG_DIR_ZH = path.join(__dirname, '..', 'src', 'content', 'blog', 'zh', 'seo-batch');

// Ensure directory exists
if (!fs.existsSync(BLOG_DIR_ZH)) {
  fs.mkdirSync(BLOG_DIR_ZH, { recursive: true });
}

// Example list of keywords to target (Focusing on Tools and Marketing)
const TARGET_KEYWORDS = [
  "2026年海外社交媒体爆款涨粉实操指南",
  "如何免费在线将 PPT 转为无损高清 PDF？",
];

async function generateArticleWithAgnes(keyword) {
  const prompt = `
你是一个专业的 SEO 内容营销专家。请为关键词 "${keyword}" 写一篇长度约 800 字的优质博客文章。
要求：
1. 必须使用 Markdown 格式。
2. 包含一个吸引人的主标题 (# ) 和若干副标题 (## )。
3. 内容必须要真实、有价值、逻辑清晰，排版精美（可以使用粗体、列表等）。
4. 不要输出任何开场白或解释语，直接输出 Markdown 源码。
5. 在文章的最后，非常自然地引导用户去使用我们网站提供的无风险服务（如：PPT转PDF免费工具，或者海外社媒真人涨粉服务）。
`;

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error: ${res.statusCode} - ${body}`));
        }
        try {
          const parsed = JSON.parse(body);
          const content = parsed.choices[0].message.content;
          resolve(content);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function generateArticle(keyword) {
  console.log(`Generating SEO article for keyword: ${keyword}...`);
  
  try {
    const content = await generateArticleWithAgnes(keyword);
    
    // Extract a short description
    const description = `${keyword} 的全面实战解析与高效工具推荐，提升您的生产力。`;
    const title = keyword;
    const slug = keyword.replace(/[\s\？\?]/g, '-').toLowerCase();
    const date = new Date().toISOString().split('T')[0];
    
    // Frontmatter format
    const markdownContent = `---
title: "${title}"
description: "${description}"
date: "${date}"
---

${content}
`;

    const filePath = path.join(BLOG_DIR_ZH, `${slug}.md`);
    fs.writeFileSync(filePath, markdownContent, 'utf8');
    console.log(`✅ Successfully generated and saved: ${slug}.md`);
  } catch (error) {
    console.error(`❌ Failed to generate article for "${keyword}":`, error.message);
  }
}

async function main() {
  for (const keyword of TARGET_KEYWORDS) {
    await generateArticle(keyword);
    // Wait 2 seconds to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("All SEO articles generated! Commit and push to Vercel to publish them.");
}

main().catch(console.error);
