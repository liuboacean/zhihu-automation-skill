<div align="center">

# 🤖 知乎操作辅助 Skill

**通过浏览器操作知乎 — 发文章、写想法、回答问题、看热榜**

[![Version](https://img.shields.io/badge/version-2.0.2-blue)](https://github.com/liuboacean/zhihu-automation-skill)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![CI](https://github.com/liuboacean/zhihu-automation-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/liuboacean/zhihu-automation-skill/actions)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![Playwright](https://img.shields.io/badge/playwright-powered-orange)](https://playwright.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

</div>

---

## ✨ 它能做什么？

| 功能 | 一句话描述 | 通道 |
|:----|-----------|:----:|
| 📝 **发文章** | Markdown → 一键发布知乎专栏（**25ms 批量粘贴**） | 浏览器 |
| 💭 **发想法** | 像发朋友圈一样发想法 | 浏览器 |
| ❓ **答问题** | 搜索并回答知乎上的问题 | 浏览器 |
| 🙋 **提问** | 在知乎上自动提问 | 浏览器 |
| 👍 **互动** | 点赞、评论、关注一条龙 | 浏览器 |
| 🔥 **看热榜** | 获取知乎热榜 Top 20（浏览器兜底） | 浏览器 |
| 🔍 **搜内容** | 搜索知乎上的文章和回答 | 浏览器 |

> ℹ️ 所有操作统一走**浏览器通道**（Cookie 登录），稳定可靠。
> HTTP 签名通道因 API 签名算法分析成本过高已正式放弃（详见 `zhihu-signature.js`）。

---

## 🚀 30 秒上手

```bash
# 1. 装依赖（已装好可跳过）
cd zhihu-skill && npm install

# 2. 生成加密密钥
export ZHIHU_COOKIE_KEY="$(openssl rand -hex 32)"

# 3. 登录知乎（只需一次，Cookie 自动加密保存）
node scripts/zhihu-export-cookie.js

# 4. 开玩 🎉
node scripts/zhihu-extract.js --type hot-list --limit 5      # 看热榜
node scripts/zhihu-publish.js thought --content "Hello 知乎"  # 发想法
```

> 💡 **小贴士**：把 `ZHIHU_COOKIE_KEY` 加到 `~/.zshrc` 里，以后每次打开终端就能直接用。密钥只存在本地，**永远不要提交到代码仓库**。

---

## 🏗️ 架构

```
                  ┌──────────────────┐
                  │  AI Agent / 用户  │
                  └────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌────────────┐  ┌──────────────┐  ┌────────────┐
   │ 浏览器操作  │  │   编辑器     │  │ Cookie 加密 │
   │ 发布/互动/问答│  │ Draft.js 兼容│  │ AES-256-GCM│
   │ 热榜/搜索   │  │ 25ms 批量粘贴│  │ 密钥轮换    │
   └────────────┘  └──────────────┘  └────────────┘
```

| 特性 | 说明 |
|------|------|
| 🔒 **Cookie 安全** | AES-256-GCM 加密存储，权限 0600，支持密钥轮换 |
| 🛡️ **防护机制** | 贝塞尔鼠标轨迹模拟人工操作 |
| 🔄 **Plan B 降级** | 签名失效自动降级到浏览器通道，永不中断 |
| ⏱️ **智能限流** | 浏览器 5-10s / 限流指数退避（30s → 10min） |
| 💥 **崩溃恢复** | 浏览器崩溃自动重建会话，任务不丢失 |
| ⚡ **极速发布** | ClipboardEvent 批量粘贴，800 字文章 25ms 完成 |

---

## 📖 详细用法

### 发布文章
```bash
node scripts/zhihu-publish.js article --title "文章标题" --content-file "article.md"
node scripts/zhihu-publish.js article --title "文章标题" --content "正文内容" --draft  # 存草稿
```

### 发布想法
```bash
node scripts/zhihu-publish.js thought --content "今天天气真好"
node scripts/zhihu-publish.js thought --content "附张图" --image "photo.jpg"
```

### 数据提取
```bash
node scripts/zhihu-extract.js --type hot-list --limit 10       # 热榜 Top 10
node scripts/zhihu-extract.js --type search --query "AI 编程"   # 搜索
node scripts/zhihu-extract.js --type user --id "excited-vczh"  # 用户信息
```

### 互动
```bash
node scripts/zhihu-interact.js like --url "https://www.zhihu.com/question/xxx/answer/xxx"
node scripts/zhihu-interact.js comment --url "..." --content "好文章！"
node scripts/zhihu-interact.js follow --user "url_token"
```

### 问答
```bash
node scripts/zhihu-answer.js --question-id 123456789 --content "这是我的回答"
node scripts/zhihu-ask.js --title "如何学习 AI？" --detail "希望得到一些建议"
```

---

## 📂 项目结构

```
zhihu-skill/
├── SKILL.md                    # AI Agent 入口
├── package.json                # 依赖声明
├── LICENSE                     # MIT License
├── SECURITY.md                 # 安全策略
├── CONTRIBUTING.md             # 贡献指南
├── CHANGELOG.md                # 变更日志
├── .github/
│   ├── workflows/ci.yml        # CI (Node 18/20/22 矩阵)
│   ├── dependabot.yml          # 自动依赖更新
│   └── ISSUE_TEMPLATE/         # Issue/PR 模板
├── config/
│   ├── selectors.json          # 页面选择器（带 fallbacks）
│   └── api-endpoints.json      # HTTP API 端点
├── scripts/ (12 模块)
│   ├── zhihu-core.js           # Cookie/浏览器/日志/重试
│   ├── zhihu-signature.js      # 签名适配器（含放弃决策说明）
│   ├── zhihu-http.js           # HTTP 读通道（公开端点）
│   ├── zhihu-browser.js        # 浏览器操作（防护+CrashRecovery）
│   ├── zhihu-publish.js        # 发布文章+想法
│   ├── zhihu-interact.js       # 点赞+评论+关注
│   ├── zhihu-answer.js / ask.js# 问答
│   ├── zhihu-extract.js        # 数据提取
│   ├── zhihu-bridge.js         # Python 桥接
│   ├── zhihu-export-cookie.js  # Cookie 导出
│   └── python/zhihu_bot.py     # OpenAPI 圈子互动
└── tests/
    ├── smoke-test.js           # 选择器冒烟测试
    ├── e2e-test.js             # 端到端集成测试
    ├── cookie-check.js         # Cookie 到期检测
    └── schema-validator.js     # API 响应校验
```

---

## 🛡️ 安全

| 项目 | 说明 |
|:----|------|
| Cookie 存储 | AES-256-GCM 加密 + 随机 IV + 权限 0600 |
| 密钥管理 | 环境变量 `ZHIHU_COOKIE_KEY`，支持轮换 |
| 漏洞报告 | 通过 [Security Advisory](https://github.com/liuboacean/zhihu-automation-skill/security/advisories) 提交 |
| 依赖安全 | Dependabot 每周检查，`npm audit` |

---

## 📋 依赖

| 工具 | 版本要求 | 用途 |
|:----|:--------:|------|
| Node.js | >= 18 | 核心运行环境 |
| Playwright | 1.52+ | 浏览器操作 |
| Python 3 | >= 3.8 | 仅圈子互动（可选） |

---

## ⚠️ 注意事项

- **Cookie 有效期约 30 天**，到期后重新运行 `node scripts/zhihu-export-cookie.js`
- **知乎前端经常改版**，`config/selectors.json` 可能需更新
- **HTTP 签名通道已放弃**，所有操作走浏览器通道，热榜/搜索等读操作可能略慢
- 建议先在小号上测试，熟悉后再用于主账号

---

## 🤝 贡献

欢迎提交 Issue 或 PR！详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。

- [Bug 报告](.github/ISSUE_TEMPLATE/bug_report.md)
- [功能建议](.github/ISSUE_TEMPLATE/feature_request.md)
- [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)

---

## 📄 License

MIT © liuboacean
