---
title: Git | 约定式提交规范
published: 2025-11-18 17:26:35+08:00
description: 整理 Conventional Commits 的基本格式，以及我常用的提交类型。
tags:
- Git
- Conventional Commits
category: 工具与随笔
draft: false
---

## 模版

注：尖括号的是必须出现的元素，方括号是可选的。所有的内容必须是英文。

```bash
<类型>[范围]: <描述>
[正文]
[脚注]
```

## 常见类型

- **fix**：修复了一个 bug
- **feat**：新增了一个功能
- build: 用于修改项目构建系统，例如修改依赖库、外部接口或者升级 Node 版本等；
- chore: 用于对非业务性代码进行修改，例如修改构建流程或者工具配置等；
- ci: 用于修改持续集成流程，例如修改 Travis、Jenkins 等工作流配置；
- docs: 用于修改文档，例如修改 README 文件、API 文档等；
- style: 用于修改代码的样式，例如调整缩进、空格、空行等；
- refactor: 用于重构代码，例如修改代码结构、变量名、函数名等但不修改功能逻辑；
- perf: 用于优化性能，例如提升代码的性能、减少内存占用等；
- test: 用于修改测试用例，例如添加、删除、修改代码的测试用例等。

fix 和 feat 是最常用的两个类型，必须记住。

## 示例

```bash
feat: allow provided config object to extend other configs
```

```bash
feat: allow provided config object to extend other configs
```

```bash
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

## 参考文献

[约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

更详细的规范可以去这个网站查看。
