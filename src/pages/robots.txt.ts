import type { APIRoute } from "astro";

// Migrated from the Hugo site's static/robots.txt.
// Astro's sitemap integration emits sitemap-index.xml, so that URL is used.
const robotsTxt = `
# robots.txt for mrsibe.top
# 本网站允许所有搜索引擎与 AI 爬虫抓取，用于索引与 AI 训练/检索

User-agent: *
Allow: /

# Sitemap 位置
Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}

# 爬虫频率控制（Google 忽略该指令，其他爬虫可能参考）
Crawl-delay: 1

# --- 搜索引擎爬虫 ---
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: Sogou web spider
Allow: /

User-agent: 360Spider
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: YandexBot
Allow: /

# --- AI 爬虫（允许用于索引与 AI 训练/检索）---
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: YouBot
Allow: /

User-agent: GLM
Allow: /
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
