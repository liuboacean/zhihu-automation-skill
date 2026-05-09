# 知乎自动化 Skill v2.0

双通道知乎自动化工具 — HTTP API 读 + 浏览器写，支持 Cookie 加密持久化。

## 功能

- 📝 发布专栏文章（Markdown 转知乎富文本）
- 💭 发布想法
- ❓ 回答问题 / 提问
- 👍 点赞 / 评论 / 关注
- 📊 热榜 / 搜索 / 数据提取
- 🔒 Cookie AES-256-GCM 加密存储
- 🔄 签名失效自动降级 Plan B

## 快速开始

```bash
# 1. 配置 Cookie 密钥
export ZHIHU_COOKIE_KEY="$(openssl rand -hex 32)"

# 2. 导出 Cookie（交互式登录）
node scripts/zhihu-export-cookie.js

# 3. 查看热榜
node scripts/zhihu-extract.js --type hot-list

# 4. 发布想法
node scripts/zhihu-publish.js thought --content "第一条自动化想法！"
```

## 目录结构

```
scripts/
├── zhihu-core.js               # 核心：Cookie/浏览器/日志
├── zhihu-http.js                # HTTP 读通道
├── zhihu-signature.js           # 签名头（适配器架构）
├── zhihu-browser.js             # 浏览器自动化
├── zhihu-publish.js / zhihu-interact.js / zhihu-answer.js / zhihu-ask.js
├── zhihu-extract.js             # 数据提取入口
├── zhihu-bridge.js              # Python 子进程桥接
├── zhihu-export-cookie.js       # Cookie 导出
├── zhihu-ratelimiter.js         # 速率控制
└── python/zhihu_bot.py          # OpenAPI 圈子互动
config/
├── selectors.json               # 页面选择器（带 fallbacks）
└── api-endpoints.json           # HTTP API 端点
tests/
├── smoke-test.js / cookie-check.js / schema-validator.js / e2e-test.js
```

## 依赖

- Node.js >= 18
- Playwright + Chromium
- Python 3（仅圈子互动功能）

## License

MIT
