# 关于

你好，我是西贝，一名计算机专业学生，平时主要写 Java 和 Go。

我正在学习后端与分布式系统，也会动手做 AI、开源软件和天文数据处理相关的项目。这个博客不是一套从头到尾的教程，更像是我的公开笔记：把遇到的问题、做过的尝试和最后的取舍留下来。

除了代码，我也喜欢看星星、折腾望远镜和业余无线电。“写代码，也看星星”大概就是这里最简单的介绍。

- [GitHub](https://github.com/MrSibe)
- [文章](/archive/)
- [项目](#项目)
- [友链](/friends/)
- [邮箱](mailto:mrsibe@qq.com)

## 项目

这里放的是我真正动手做过、仍在继续完善的项目。只记录它们解决什么问题、目前做到哪里，以及代码和后续复盘从哪里看。

### KnowNote

一个本地优先的 AI 知识库，也是我对 NotebookLM 工作流的一次开源实现。它支持导入多种文档，在本地保存知识资产，并通过 RAG、可切换的模型提供商和来源引用辅助阅读与整理。

::github{repo="MrSibe/KnowNote"}

- **当前状态：** 已发布可安装版本，仍在持续迭代
- **技术栈：** Electron、React、TypeScript、SQLite、sqlite-vec
- **相关文章：** 整理中

### Sky Eye

面向小行星和彗星观测数据处理的桌面软件。项目围绕 FITS 图像、天体测量、图像闪烁对比和 MPC 报告生成等工作流展开，希望减少观测数据处理中重复而分散的操作。

::github{repo="MrSibe/sky-eye"}

- **当前状态：** 正在开发，功能和工作流仍在调整
- **技术栈：** Tauri、Rust、React、FITS
- **相关文章：** 整理中

### godis

用 Go 编写的 Redis-compatible 内存键值数据库。我通过这个项目理解 RESP 协议、命令执行、过期策略和并发控制，而不是把它包装成可以直接替代 Redis 的生产系统。

::github{repo="MrSibe/godis"}

- **当前状态：** 学习与实验项目
- **技术栈：** Go、RESP
- **相关文章：** 整理中

### goding

一个用 Go 编写的轻量级 Coding Agent。我用它探索模型调用、工具执行、上下文管理和 Agent 循环怎样组合成一个可恢复的编码助手。

::github{repo="MrSibe/goding"}

- **当前状态：** 早期开发阶段
- **技术栈：** Go、LLM、Tool Calling
- **相关文章：** [从 OpenClaw 到 Hermes Agent：我对记忆、Skill 和 Agent 架构的理解](/posts/agent/openclaw/)
