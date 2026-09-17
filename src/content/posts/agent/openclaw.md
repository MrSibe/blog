---
title: 从 OpenClaw 到 Hermes Agent：我对记忆、Skill 和 Agent 架构的理解
published: 2026-04-17 06:00:00+08:00
description: 用了 OpenClaw 和 Hermes Agent 一段时间后，我重新整理了记忆、Skill、工具调用与执行环境之间的关系。
tags:
- Agent
- OpenClaw
- AI
category: AI 与 Agent
draft: false
---

> 最后核对日期：2026-08-29。本文包含我的使用感受和架构判断；项目已经实现的能力以各自官方文档为准。

最近 OpenClaw、Hermes Agent 火的一塌糊涂，我也用了几个月，一直想针对这方面写一些自己的见解。

## OpenClaw 为什么火了？

在 OpenClaw 出圈之前，程序员接触最多的 Agent 可能就是 Claude Code 了。大家看到 OpenClaw 可能会想：都是通过聊天来让 Agent 做事，凭什么 OpenClaw 可以这么火？

我认为理由有两点：

- OpenClaw 真正把“高深莫测”的 Agent 放在了**普通大众**面前。
- OpenClaw 把 Agent **模块标准化**了。

### 在哪和 Agent 聊天很重要

OpenClaw 火的重要原因就是它可以接入到各种 IM 聊天工具里，例如 QQ、微信、Telegram、Discord 等等。

想一想，假如是 Claude Code，我们需要打开终端，安装 Claude Code CLI。终端对于不怎么接触计算机的小伙伴本身就是一种很有负担的东西：UI、UX 并不友好。即使是配合 VS Code 使用，计算机小白看到 VS Code 那种“东一块西一块”的界面，估计也会发懵。

因此 OpenClaw 支持 IM 聊天工具接入，对小白更加友好，直接把自己推到了风口浪尖。

但是我们也需要看到，OpenClaw 接入 IM 也有一些妥协：比如我们交给他一些任务，我们肯定很想知道它是怎么做的，在干什么，但是微信、QQ 这些 IM 只会显示“正在输入中...”；放在 Claude Code 上，则会在输入框上显示自己的计划步骤、当前进行到了哪一步骤了等等。可见 OpenClaw 因为接入 IM，天生信息密度不足。

### 我所理解的模块整合

在 OpenClaw 之前，大家聊的是：

 - 你用了什么 MCP？
 - 你用了什么 skill？

这个时候，大家疯狂魔改自己的 Agent，已经出现了基于 RAG 的记忆系统、网络搜索工具和 Deep Research 工作流等工具，或者说 Agent 功能模块、设计思想。但是大家并不明确：如果你要做一个非常像人一样的 Agent，到底需要哪些模块？

我认为 OpenClaw 的价值之一，是把模型、工具、消息渠道、记忆和 Skill 等模块放进了同一套可运行的个人助手框架。这里的“集成度更高”是我的评价，不代表这些模块由 OpenClaw 首创。

比如第一，OpenClaw 使用工作区中的 Markdown 文件保存长期信息和指令，包括 `AGENTS.md`、`USER.md`、`SOUL.md` 和 `MEMORY.md` 等。新会话可以加载其中一部分内容，记忆搜索也可以按需找回相关记录。它提供了跨会话持久化的基础，但实际能否正确回忆仍取决于内容质量、检索和上下文预算。

第二，是 skill。在我看来，其实 **skill 的本质是软件**：程序、数据、文档，软件应有的它都有，只不过使用软件的是人，使用 skill 的是大模型。想一想，如果你拿到自己的新电脑，电脑什么软件都没有，你无法通过浏览器上网获取信息，没有 VS Code 给你拿来编程，也没有 QQ 微信给你用来跟朋友聊天...你是不是就想安装软件，给自己的电脑更多能力，使其更强大？

OpenClaw 支持 Skill，也提供了 ClawHub 这样的分发入口。在我看来，这有点像把软件分发的思路放到 Agent 上：用户不必修改核心循环，也能按需增加一组工具和操作说明。

记忆系统和 Skill 组合起来后，会给人一种“越用越熟悉”的感觉：文档可以保存需要跨会话保留的信息，Skill 可以把重复流程整理成按需加载的操作说明。不过这些机制不会天然保证信息正确或永不遗忘，仍然需要用户检查和维护。

我倾向于认为，记忆和按需加载的 Skill 会继续成为个人 Agent 的常见模块。但这是一种趋势判断，不意味着所有 Agent 都必须采用相同的文件结构或实现方式。

## Hermes Agent 又是什么？

OpenClaw 发布后，基于各种编程语言的模仿项目层出不穷：nanobot、picoclaw 等等。这里强烈推荐一下 nanobot，相对于 OpenClaw，它的代码更干净、功能基本全面、基于 Python 更适合魔改，非常适合个人用户使用。

后来我又开始关注 Hermes Agent。它同样提供 CLI、消息渠道、工具、记忆与 Skill，并提供从 OpenClaw 迁移设置、记忆和用户 Skill 的命令。

Hermes Agent 把自己描述为能够从使用中学习的 Agent。根据官方文档，它可以通过 `skill_manage` 创建和更新 Skill，也把 Skill 定义为按需加载的程序性知识。

这让我感兴趣的地方是：持久化的不只是“用户是谁、发生过什么”，还可以包括“下一次怎样完成这类任务”。不过，自动生成的 Skill 是否可靠，仍然取决于验证、权限边界和后续维护，不能把“能创建”直接等同于“会稳定地自我进化”。

Hermes 还提供持久记忆、消息网关和 OpenClaw 迁移工具。它与 OpenClaw 有不少相似模块，但两者的实现、默认交互方式和安全边界并不完全相同，不能只用“更完善的 OpenClaw”概括。

因此，我更愿意把 Hermes Agent 看作另一套值得对照阅读的 Agent 实现，而不是简单的替代关系。

## 我所认为的 Agent 未来的发展路线

总的来说，OpenClaw 让我更直观地看到，一个面向个人长期使用的 Agent 需要怎样连接消息渠道、执行环境、记忆和扩展能力。

我更愿意把 OpenClaw 类比成连接模型、用户和本机工具的控制层：记忆保存长期信息，Skill 和插件扩展能力，消息渠道负责把它带到日常使用场景中。这个“操作系统”说法只是帮助理解的比喻。

我认为 Agent 未来主要是朝下面几个方向发展：

- 生态圈形成：未来的 ReAct 循环尽可能简单，但是可以任意插入或替换自己想要的模块，形成模块生态；目前已经形成了 skill 生态。
- 节省 Token：少 Token 也可以产生高质量输出。
- Agent + 机器人：让机器人也变得更加智能。

## 总结

对我而言，OpenClaw 最值得关注的两点是：

- 它让更多人通过日常聊天渠道接触可以调用工具的个人 Agent；
- 它提供了一个可以具体讨论的模块组合，而不只是抽象的 ReAct 循环。

至于它是不是 Harness 的“最佳实践”，目前还没有足够统一的评价标准。更准确的说法是：OpenClaw 和 Hermes Agent 都提供了值得研究的公开实现，我会继续观察它们如何处理权限、失败恢复、上下文增长和长期记忆质量。

## 参考资料

- [OpenClaw 官方仓库](https://github.com/openclaw/openclaw)
- [OpenClaw：Memory overview](https://github.com/openclaw/openclaw/blob/main/docs/concepts/memory.md)
- [OpenClaw：Skills](https://github.com/openclaw/openclaw/blob/main/docs/tools/skills.md)
- [Hermes Agent 官方仓库](https://github.com/hermes-agent-org/hermes)
- [Hermes Agent：Working with Skills](https://github.com/hermes-agent-org/hermes/blob/main/website/docs/guides/work-with-skills.md)
