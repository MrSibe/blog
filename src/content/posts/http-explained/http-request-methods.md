---
title: HTTP 请求方法：GET、POST、PUT 与幂等性
published: 2026-04-15 17:16:00+08:00
description: 整理常见 HTTP 方法的标准语义，以及安全与幂等这些属性在工程中意味着什么。
tags:
- HTTP
- 后端基础
category: 后端与系统
draft: false
---

## 常见的请求方法

基础教程里经常介绍 GET、HEAD、POST、PUT、DELETE、CONNECT、OPTIONS、TRACE 和 PATCH，但 HTTP 方法并不只有固定的八种或九种。IANA 维护的 [HTTP Method Registry](https://www.iana.org/assignments/http-methods/) 还登记了 WebDAV 等扩展方法。

### GET

GET 请求传输目标资源当前选中的表示。它最常用于读取页面或 API 资源，但“读取”不等于服务器内部完全没有副作用：服务端仍可能记录日志或统计访问量。

### HEAD

HEAD 与 GET 的语义相同，但响应不传输消息内容。它适合在不下载完整内容时获取响应字段，例如检查资源类型、长度或缓存信息。

### POST

POST 让目标资源按照自身语义处理请求内容。创建资源、提交表单、触发操作都可能使用 POST，但“POST 就是新增”只是常见的 API 设计习惯，不是它的完整定义。

### PUT

PUT 请求使用消息内容创建或替换目标 URI 的当前表示。客户端通常已经知道要操作的 URI，这也是它与常见 POST 创建接口的重要区别。

### DELETE、OPTIONS 与 PATCH

- DELETE 请求删除目标资源与其当前功能之间的关联；
- OPTIONS 用于询问目标资源支持的通信选项；
- PATCH 用于对资源做部分修改，其语义由 [RFC 5789](https://www.rfc-editor.org/rfc/rfc5789.html) 定义。

## 安全与幂等

“安全”描述的是方法的既定语义基本只读，客户端没有请求改变服务器状态。RFC 9110 定义的 GET、HEAD、OPTIONS 和 TRACE 是安全方法。日志、计费统计等由服务器自行产生的副作用，不会因此改变方法的安全属性。

“幂等”指多次发送相同请求，对服务器产生的预期效果与发送一次相同。安全方法以及 PUT、DELETE 都是幂等的；POST 通常不是。幂等关注的是客户端请求的预期效果，重复请求的响应内容、日志条数或版本历史仍可能不同。

PATCH 在 IANA 注册表中不是幂等方法，但具体接口可以通过条件请求或业务约束提供额外保证。工程中判断能否自动重试时，不能只看方法名称，还要看接口约定。

## 总结

- HTTP 方法没有“只有八种”这样的固定数量，扩展方法应查询 IANA 注册表；
- POST 是资源特定处理，PUT 是创建或替换目标 URI 的表示；
- 安全和幂等描述的是标准语义与预期效果，不代表服务器内部绝对没有副作用。

## 参考资料

- [RFC 9110：HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [IANA HTTP Method Registry](https://www.iana.org/assignments/http-methods/)
- [RFC 5789：PATCH Method for HTTP](https://www.rfc-editor.org/rfc/rfc5789.html)
