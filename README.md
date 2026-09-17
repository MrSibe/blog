# 西贝的代码宇宙

个人博客。记录后端、分布式系统、AI 与开源项目，也写天文和业余无线电。

站点：<https://mrsibe.top> · 友链申请：[Issue #1](https://github.com/MrSibe/blog/issues/1)

## 技术栈

[Astro](https://astro.build) + [Fuwari](https://github.com/saicaca/fuwari)，搜索由 Pagefind 提供。

## 本地开发

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # 构建到 dist/ 并生成搜索索引
pnpm preview
```

## 写文章

文章放在 `src/content/posts/`，**文件路径即 URL**：`godis/1-resp-protocol.md` → `/posts/godis/1-resp-protocol/`。

```bash
pnpm new-post <filename>
```

frontmatter 必填 `title`、`published`，可选 `description`、`tags`、`category`、`draft`。
站点配置在 `src/config.ts`（标题、导航、侧栏资料）。

## 许可

博客内容版权归作者所有；站点基于 MIT 许可的 [Fuwari](https://github.com/saicaca/fuwari) 构建。
