# Next.js 到 Vite 重构说明

本文档记录 `sdk-demo-feat` 从 Next.js 模板迁移到 Vite 模板后的主要变更、设计取舍、配置映射和验证方式。

## 1. 重构目标

本次重构的目标是将原 Next.js App Router 项目改造成 Vite + React Router 的单页应用，同时保留原有业务页面、Orderly SDK 集成、语言前缀路由、demo/dmm 多目标构建、CI 发布和 Docker 部署能力。

核心目标：

1. 使用 Vite 作为开发服务器和生产构建工具。
2. 使用 React Router 替代 Next.js App Router。
3. 保留原有业务页面、布局、i18n、Orderly provider、wallet adapter 配置。
4. 将 `NEXT_PUBLIC_APP_TARGET` 迁移为 `VITE_APP_TARGET`。
5. 将 Next.js standalone Docker 运行方式迁移为静态资源 + Nginx 运行方式。
6. 清理 Next.js 专属配置，并重建 Vite/React/TypeScript 适用的 ESLint 配置。

## 2. 技术栈变化

| 项目 | 重构前 | 重构后 |
| --- | --- | --- |
| 构建工具 | Next.js | Vite |
| 路由 | Next.js App Router | React Router |
| 应用入口 | `src/app/layout.tsx` | `index.html` + `src/index.tsx` |
| 页面目录 | `src/app/[lang]/**` | `src/pages/**` |
| 环境变量 | `NEXT_PUBLIC_APP_TARGET` | `VITE_APP_TARGET` |
| 运行产物 | `.next/standalone` | `dist/` |
| 容器运行 | Node.js server | Nginx 静态服务 |
| ESLint | `eslint-config-next` | ESLint flat config |

## 3. 入口和路由改造

### 3.1 应用入口

新增 Vite 入口：

- `index.html`
- `src/index.tsx`

`src/index.tsx` 挂载 React 应用，并引入全局样式。

### 3.2 路由集中管理

新增 `src/routes.tsx`，用 `createBrowserRouter` 明确定义所有页面路由。

主要路由结构：

- `/health`
- `/`
- `/:lang`
- `/:lang/perp`
- `/:lang/perp/:symbol`
- `/:lang/markets`
- `/:lang/leaderboard`
- `/:lang/portfolio`
- `/:lang/portfolio/positions`
- `/:lang/portfolio/orders`
- `/:lang/portfolio/assets`
- `/:lang/portfolio/fee`
- `/:lang/portfolio/api-key`
- `/:lang/portfolio/setting`
- `/:lang/portfolio/history`
- `/:lang/rewards`
- `/:lang/rewards/affiliate`
- `/:lang/rewards/trading`

### 3.3 语言前缀处理

Next.js middleware 被移除后，语言前缀补全逻辑迁移到 `src/routes.tsx`。

当前行为：

- `/health` 不补语言前缀。
- `/` 跳转到 `/{lang}/perp/{symbol}`。
- 无语言前缀的业务路径会自动补为 `/{currentLocale}{pathname}`。
- 补语言前缀时保留 `search` 和 `hash`。
- URL 中语言与 i18n 当前语言不一致时，会同步调用 `i18n.changeLanguage`。

### 3.4 页面组件迁移

原 Next.js 页面组件被迁移到 `src/pages/**`。App Router 的 `page.tsx`、`layout.tsx` 语义被替换成普通 React 组件和 React Router layout route。

示例映射：

| 重构前 | 重构后 |
| --- | --- |
| `src/app/[lang]/perp/[symbol]/view.tsx` | `src/pages/perp/view.tsx` |
| `src/app/[lang]/markets/view.tsx` | `src/pages/markets/view.tsx` |
| `src/app/[lang]/portfolio/layout.tsx` | `src/components/layout/portfolioLayout.tsx` |
| `src/app/[lang]/rewards/layout.tsx` | `src/components/layout/tradingRewardsLayout.tsx` |
| `src/app/globals.css` | `src/styles/index.css` |

## 4. 配置迁移

### 4.1 package scripts

`package.json` 的核心脚本已切换为 Vite：

```json
{
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "start": "vite preview",
  "preview": "vite preview",
  "lint": "eslint . && tsc --noEmit"
}
```

保留的框架无关脚本：

- `format`
- `prepare`
- `release`
- `release:*`
- `updateSdkVersion`

### 4.2 Vite 配置

新增 `vite.config.ts`。

主要配置：

- React SWC 插件：`@vitejs/plugin-react-swc`
- Node polyfill：`vite-plugin-node-polyfills`
- 路径别名：`@ -> ./src`
- JSON named export
- 多语言资源通过 `AsyncResources` 和 `import.meta.glob` 从 SDK 与 `src/locales` 按需加载
- `ENABLE_SOURCEMAP=true` 控制 sourcemap
- `console.log`、`console.debug` 和 `debugger` 在生产构建中移除
- sourcemap 中默认忽略大部分 `node_modules`，保留 `@orderly.network` 包映射

### 4.3 TypeScript 配置

`tsconfig.json` 移除了 Next.js 专属项：

- `next-env.d.ts`
- `.next/types/**/*.ts`
- `plugins: [{ "name": "next" }]`

保留并适配的配置：

- `moduleResolution: "bundler"`
- `paths: { "@/*": ["./src/*"] }`
- `strictNullChecks: true`
- `incremental: true`
- `jsx: "react-jsx"`
- `types: ["vite/client"]`

新增 `src/vite-env.d.ts`，声明 `VITE_APP_TARGET` 类型。

### 4.4 ESLint 配置

删除 Next.js 专属 `.eslintrc.json`，新增 `eslint.config.mjs`。

当前 ESLint 覆盖范围：

- `src/**/*.{ts,tsx}`
- `vite.config.ts`

当前忽略范围：

- `.next/**`
- `dist/**`
- `build/**`
- `out/**`
- `node_modules/**`
- `public/tradingview/**`
- `coverage/**`

使用的规则来源：

- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

## 5. 环境变量与 App Target

### 5.1 前端环境变量

重构前：

```text
NEXT_PUBLIC_APP_TARGET=demo
NEXT_PUBLIC_APP_TARGET=dmm
```

重构后：

```text
VITE_APP_TARGET=demo
VITE_APP_TARGET=dmm
```

业务读取位置：

- `src/components/orderlyConfig/appTargetConfig.ts`

读取方式：

```ts
import.meta.env.VITE_APP_TARGET
```

### 5.2 发布脚本环境变量

release 相关脚本统一使用 `VITE_APP_TARGET`：

- `release-tag.config.mjs`
- `scripts/release.js`

示例：

```bash
VITE_APP_TARGET=demo pnpm release
VITE_APP_TARGET=dmm pnpm release
```

## 6. Provider 与导航调整

### 6.1 OrderlyProvider

`src/components/orderlyProvider/index.tsx` 继续作为全局 provider 入口，并通过 React Router 的 `Outlet` 渲染子页面。

### 6.2 语言切换

语言切换从直接调用 `window.history.replaceState` 改为 React Router 的 `navigate`：

```ts
navigate(`/${lang}${path}${location.search}${location.hash}`, {
  replace: true,
});
```

这样可以同时保证：

- 地址栏更新。
- React Router 状态同步。
- `query` 和 `hash` 不丢失。

## 7. 交易页路由参数同步

React Router 在同一路由组件复用时不会自动重建组件实例。为避免从一个交易对切换到另一个交易对后页面仍保留旧 symbol，`src/pages/perp/view.tsx` 增加了路由参数同步逻辑。

当前行为：

- URL symbol 改变时，本地 `symbol` state 同步更新。
- `updateSymbol(symbol)` 继续负责同步存储中的交易对。
- 浏览器前进后退时，页面交易对应与 URL 保持一致。

## 8. Docker 与部署

### 8.1 Dockerfile

重构前使用 Next.js standalone 输出，由 Node.js server 运行。

重构后流程：

1. Node 阶段安装依赖并执行 `pnpm build`。
2. 产出 `dist/`。
3. Nginx 阶段复制 `dist/` 到 `/usr/share/nginx/html`。
4. 容器暴露 80 端口。

支持 build arg：

```dockerfile
ARG VITE_APP_TARGET=demo
ENV VITE_APP_TARGET=${VITE_APP_TARGET}
```

### 8.2 Nginx SPA fallback

新增 `nginx.conf`：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

该配置保证直接访问深层路由时不会 404。

`/assets/` 增加长期缓存：

```nginx
add_header Cache-Control "public, max-age=31536000, immutable";
```

### 8.3 GitLab CI

`.gitlab-ci.yml` 中的前端构建变量已从 `NEXT_PUBLIC_APP_TARGET` 改为 `VITE_APP_TARGET`。

新增：

```yaml
BUILD_ARG_NAMES: "VITE_APP_TARGET"
```

用于让 CI Docker 构建阶段正确传入 Vite build arg。

## 9. 保留的框架无关配置

以下配置已保留：

- `.npmrc` 中的 Orderly 私有 registry
- Prettier 配置与 import sort 规则
- Husky pre-commit
- `lint-staged`
- release tag 规则
- demo/dmm 多目标发布脚本
- `strictNullChecks`
- `incremental`
- `@/*` 路径别名

## 10. 清理的 Next.js 配置

以下 Next.js 专属文件或配置已删除：

- `next.config.ts`
- `next-env.d.ts`
- `src/middleware.ts`
- `src/app/**`
- `.eslintrc.json` 中的 `next/core-web-vitals` 和 `next/typescript`
- `eslint-config-next`
- `next`

说明：`.gitignore` 和 ESLint ignore 中保留 `.next/**` 是为了忽略本地旧构建产物，不代表仍依赖 Next.js。

## 11. 验证结果

已执行：

```bash
pnpm lint
pnpm build
```

结果：

- `pnpm lint` 通过。
- `pnpm build` 通过。

已知 warning：

- `src/pages/leaderboard/view.tsx` 存在 1 个历史 `react-hooks/exhaustive-deps` warning。
- Vite build 中存在第三方依赖 PURE 注释 warning。
- Vite build 中存在部分 Node core module externalized warning。
- 主 chunk 体积超过 500 kB warning。

这些 warning 当前不阻塞构建。

## 12. 后续建议

建议后续按优先级处理：

1. 处理 `leaderboard/view.tsx` 的 hooks dependency warning。
2. 评估是否为大体积依赖增加 `manualChunks`。
3. 对 demo/dmm 分别跑 Docker 构建与容器访问测试。
4. 如果生产环境需要 sourcemap 上传，补齐对应的 sourcemap 发布流程。
5. 将 `TESTING.md` 中的手工场景逐步自动化为 e2e 测试。
