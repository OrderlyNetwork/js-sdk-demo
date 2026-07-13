# Vite 重构测试文档

本文档用于验证项目从 Next.js 重构为 Vite 后的关键功能、配置和部署链路。

## 1. 基础环境检查

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-001 | 依赖安装 | `pnpm install` | 依赖安装完成，无 lockfile 冲突 |
| T-002 | 类型与 lint | `pnpm lint` | 命令通过；允许已知 warning |
| T-003 | 生产构建 | `pnpm build` | 生成 `dist/`，构建退出码为 0 |
| T-004 | 本地预览 | `pnpm preview` | 能访问 Vite preview 服务 |
| T-005 | 开发服务 | `pnpm dev` | Vite dev server 正常启动 |

已知情况：

- `pnpm lint` 当前存在 1 个历史 warning：`src/pages/leaderboard/view.tsx` 的 `react-hooks/exhaustive-deps`。
- `pnpm build` 当前存在依赖包 PURE 注释、Node core module externalized、chunk 体积 warning，不影响构建通过。

## 2. Next.js 残留检查

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-006 | Next 配置文件残留 | 检查 `next.config.*`、`next-env.d.ts`、`src/middleware.ts` | 不存在 |
| T-007 | Next 环境变量残留 | 搜索 `NEXT_PUBLIC_` | 不存在 |
| T-008 | Next ESLint 残留 | 搜索 `next/core-web-vitals`、`next/typescript` | 不存在 |
| T-009 | Next 文案残留 | 搜索 `Next.js`、`nextjs-template` | 不存在业务文案残留 |

说明：`.gitignore` 和 `eslint.config.mjs` 中保留 `.next/**` 忽略规则是为了屏蔽旧构建产物，不属于迁移遗漏。

## 3. 路由回归测试

启动服务后逐项访问以下路径。

| 编号 | 路径 | 期望结果 |
| --- | --- | --- |
| T-010 | `/health` | 健康检查页面可访问，不被语言前缀重定向 |
| T-011 | `/` | 自动跳转到 `/{lang}/perp/{symbol}` |
| T-012 | `/en` | 自动跳转到 `/en/perp/PERP_ETH_USDC` |
| T-013 | `/en/perp/PERP_ETH_USDC` | 交易页正常渲染 ETH 永续 |
| T-014 | `/en/perp/PERP_BTC_USDC` | 交易页正常渲染 BTC 永续 |
| T-015 | `/en/markets` | Markets 页面正常渲染 |
| T-016 | `/en/leaderboard` | Leaderboard 页面正常渲染 |
| T-017 | `/en/portfolio` | Portfolio 首页正常渲染 |
| T-018 | `/en/portfolio/positions` | Positions 页面正常渲染 |
| T-019 | `/en/portfolio/orders` | Orders 页面正常渲染 |
| T-020 | `/en/portfolio/assets` | Assets 页面正常渲染 |
| T-021 | `/en/portfolio/fee` | Fee 页面正常渲染 |
| T-022 | `/en/portfolio/api-key` | API Key 页面正常渲染 |
| T-023 | `/en/portfolio/setting` | Setting 页面正常渲染 |
| T-024 | `/en/portfolio/history` | History 页面正常渲染 |
| T-025 | `/en/rewards` | 自动跳转到 `/en/rewards/affiliate` |
| T-026 | `/en/rewards/affiliate` | Affiliate rewards 页面正常渲染 |
| T-027 | `/en/rewards/trading` | Trading rewards 页面正常渲染 |

## 4. 语言前缀与 URL 保留测试

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-028 | 无语言前缀补全 | 访问 `/markets?foo=bar#section` | 地址变为 `/{currentLocale}/markets?foo=bar#section`，query/hash 保留 |
| T-029 | 语言切换保留 query/hash | 在 `/en/markets?foo=bar#section` 切换语言 | 地址变为 `/{newLang}/markets?foo=bar#section` |
| T-030 | Root query 保留 | 访问 `/?foo=bar` | 跳转到 `/{lang}/perp/{symbol}?foo=bar` |
| T-031 | Perp index query 保留 | 访问 `/en/perp?foo=bar` | 跳转到 `/en/perp/{symbol}?foo=bar` |
| T-032 | Rewards index query 保留 | 访问 `/en/rewards?foo=bar` | 跳转到 `/en/rewards/affiliate?foo=bar` |

## 5. 交易页符号同步测试

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-033 | 交易对路由切换 | 从 `/en/perp/PERP_ETH_USDC` 跳转到 `/en/perp/PERP_BTC_USDC` | 页面交易对同步变为 BTC，不保留旧 ETH 状态 |
| T-034 | 浏览器前进后退 | 在 ETH/BTC 交易对之间使用浏览器前进后退 | 页面交易对与 URL 始终一致 |
| T-035 | 页面刷新 | 在 `/en/perp/PERP_BTC_USDC` 刷新 | 页面仍显示 BTC |

## 6. App Target 测试

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-036 | 默认 target | 不设置环境变量执行 `pnpm build` | 使用 `demo` 配置 |
| T-037 | Demo target | `VITE_APP_TARGET=demo pnpm build` | 使用 `demo` 配置 |
| T-038 | DMM target | `VITE_APP_TARGET=dmm pnpm build` | 使用 `dmm` 配置，包含 DMM widget 配置 |
| T-039 | Release target | `VITE_APP_TARGET=demo pnpm release`、`VITE_APP_TARGET=dmm pnpm release` | release 脚本识别对应 target |

## 7. 静态资源与样式测试

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-040 | 全局样式 | 打开任意页面 | Orderly UI 样式、全局 CSS 正常生效 |
| T-041 | favicon | 查看浏览器 tab 或访问 `/favicon.png` | favicon 正常加载 |
| T-042 | locales | 运行 `pnpm copyLocales` | `public/locales/*.json` 正常生成或更新 |
| T-043 | TradingView 静态资源 | 打开交易页 | 图表相关资源正常加载 |

## 8. Docker 与部署测试

| 编号 | 测试项 | 操作 | 期望结果 |
| --- | --- | --- | --- |
| T-044 | Docker demo 构建 | `docker build --build-arg VITE_APP_TARGET=demo -t orderly-js-sdk-vite-template:demo .` | 镜像构建成功 |
| T-045 | Docker dmm 构建 | `docker build --build-arg VITE_APP_TARGET=dmm -t orderly-js-sdk-vite-template:dmm .` | 镜像构建成功 |
| T-046 | Nginx SPA fallback | 容器启动后访问 `/en/markets` | 返回应用 HTML，不出现 404 |
| T-047 | Assets cache | 访问 `/assets/*` | 静态资源返回成功，并带长期缓存配置 |
| T-048 | CI build arg | 检查 `.gitlab-ci.yml` | `BUILD_ARG_NAMES` 包含 `VITE_APP_TARGET` |

## 9. 验收标准

重构验收至少需要满足：

1. `pnpm lint` 通过。
2. `pnpm build` 通过。
3. T-010 到 T-035 的路由、语言、交易对同步测试通过。
4. demo 和 dmm 两个 `VITE_APP_TARGET` 构建通过。
5. Docker 镜像可启动，并且直接访问深层路由不会 404。
