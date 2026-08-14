# npm 依赖安全审计修复报告

## 基本信息

- 项目包名：`orderly-js-sdk-vite-template`
- 审计命令：`pnpm audit`
- 修复日期：2026-08-11

## 审计结果

修复前审计：1 个 critical、17 个 high、30 个 moderate、3 个 low。当前审计：0 个 critical、3 个 high、2 个 moderate、2 个 low。当前剩余 high 为 bigint-buffer 1 个 advisory，以及 image-size 2 个 advisory；三者均无可用 patched version。bigint-buffer 在当前浏览器构建中使用纯 JS fallback，原生 C addon 路径未启用；image-size 仅存在于 React Native Metro optional peer 路径，当前 Vite 应用无 Metro 执行路径。

涉及的漏洞依赖包：

- `hono`
- `protobufjs`
- `ws`
- `axios`
- `react-router`
- `postcss`
- `js-yaml`
- `brace-expansion`
- `ip-address`
- `socket.io-parser`
- `bigint-buffer`
- `image-size`
- `uuid`
- `elliptic`
- `esbuild`

## 修复方案

采用锁文件更新与精准 pnpm overrides：Hono 4.12.34 通过锁文件更新；protobufjs 锁定到 7.6.5，覆盖 @trezor/protobuf 路径；ws 锁定到 8.21.0，覆盖 @ethersproject/providers@5.8.0、viem@2.23.2、viem@2.31.0、viem@2.52.2 路径；axios 锁定到 1.18.0，仅覆盖 @coinbase/cdp-sdk 路径；同时更新了已确认安全的 js-yaml、brace-expansion、ip-address、socket.io-parser 等传递依赖。保留路径限定 override，避免对无关 ws 6/7 路径做全局替换。当前 lockfile 还包含 Babel、Viem、Reown、Terser 等非目标传递依赖漂移，需按注意事项单独复核。

当前 `package.json` 中的完整 `pnpm.overrides`：

| 覆盖路径 | 强制版本 | 用途/说明 |
| --- | --- | --- |
| `@coinbase/cdp-sdk>axios` | `1.18.0` | 仅修复 Coinbase CDP SDK 路径中的 Axios advisory |
| `@ethersproject/providers>ws` | `8.21.0` | 修复 Ethers provider 路径中的 WebSocket advisory |
| `@solana/wallet-adapter-walletconnect>@walletconnect/solana-adapter` | `0.0.9` | 保留既有 WalletConnect Solana adapter 安全覆盖 |
| `@trezor/protobuf>protobufjs` | `7.6.5` | 修复 Trezor protobuf 路径中的 protobufjs advisory |
| `viem@2.23.2>ws` | `8.21.0` | 精确覆盖 viem 2.23.2 的 ws 依赖 |
| `viem@2.31.0>ws` | `8.21.0` | 精确覆盖 viem 2.31.0 的 ws 依赖 |
| `viem@2.52.2>ws` | `8.21.0` | 精确覆盖 viem 2.52.2 的 ws 依赖 |

上述覆盖均为路径限定 override，不会全局替换其他依赖路径；因此锁文件中仍可能保留 `ws 6.x/7.x` 等版本。

依赖变更：

- `react-router`：`^7.7.1` -> `^7.18.2`
- `postcss`：`^8.5.6` -> `^8.5.26`

## 改动文件

- `package.json`
- `pnpm-lock.yaml`

## 验证结果

- pnpm audit：当前为 0 critical、3 high、2 moderate、2 low；剩余 high 均无可用 patched version。
- pnpm install --frozen-lockfile：通过。
- pnpm build：通过；仅有第三方 Rollup 注释和大 chunk 警告。
- pnpm test：7 个测试套件、68 项测试通过；完整命令因 scripts/release.test.mjs 缺少 zx 依赖失败，该缺失不在本次依赖 diff 中。
- 可达性检查：Vite 构建产物包含 bigint-buffer 的浏览器纯 JS 实现，不包含 Metro/image-size；源码和脚本未发现 Metro 启动或 image-size 直接调用。

## 被忽略的 Advisory / 接受风险

- GHSA-3gc7-fjrx-p6mg（bigint-buffer@1.1.5，High）：审计路径为 @orderly.network/hooks > @orderly.network/default-solana-adapter > @layerzerolabs/lz-solana-sdk-v2 > @solana/spl-token > @solana/buffer-layout-utils > bigint-buffer。Solana 相关代码路径在业务中可能加载 bigint-buffer，但当前 Vite 浏览器构建使用纯 JS fallback，未启用原生 C addon；当前 Node 安装也回退到纯 JS。暂评为“条件可达/接受风险”，若未来启用 SSR、Node Solana 解码并构建原生 addon，需重新评估。
- GHSA-w3rx-r6r6-pgpr（image-size@1.2.1，High）：ICNS 解析器无限循环。仅通过 react-i18next 的 optional react-native peer 引入 Metro；当前项目使用 Vite，无 Metro 配置、启动脚本、源码调用或相关构建产物，暂评为当前不可达。若启用 React Native Metro 或处理不可信图片文件，必须重新评估。
- GHSA-5p2g-fcmc-qvqq（image-size@1.2.1，High）：JXL/HEIF 解析器无限循环。依赖路径和不可达结论同 GHSA-w3rx-r6r6-pgpr，暂评为当前不可达；启用 Metro 或不可信图片解析前需重新评估。
- GHSA-w5hq-g745-h8pq（uuid@8.3.2/9.0.1，Moderate）：patched version 为 >=11.1.1，涉及 major 版本变更，暂延期处理；需结合 @privy-io/react-auth 和 @metamask/sdk 上游兼容版本另行升级。
- GHSA-848j-6mx2-7j84（elliptic@6.6.1，Low）：当前无 patched version，来源为 vite-plugin-node-polyfills 的浏览器 crypto 工具链，暂记录并等待上游修复。
- GHSA-g7r4-m6w7-qqqr（esbuild@0.27.7，Low）：仅影响 Windows 上运行 Vite 开发服务器时的任意文件读取，生产构建不使用该开发服务器；当前延期并要求 Windows 开发环境避免暴露 dev server。

## 注意事项

- 三个剩余 high 不能简单标记为“已修复”：bigint-buffer 是条件不可达，两个 image-size 是当前不可达；应在架构变化（SSR、React Native/Metro、不可信图片处理）时重新审计。
- 当前 package.json 和 pnpm-lock.yaml 仍为未提交修改；报告基于 HEAD 与当前 worktree diff 生成。
- package.json 还将 react-router 和 postcss 的声明范围上调；如果本次目标是纯锁文件修复，应单独确认或恢复这两处 manifest 变更。
- 本次 lockfile diff 较大（约 479 行新增、324 行删除），包含非目标依赖版本漂移；建议在合并前重新生成更小范围的锁文件 diff，或明确将这些升级纳入回归测试范围。
- 锁文件仍保留 ws 6/7 路径，因为本次是精准路径 override，不是全局 ws 强制升级。
- 建议后续补充 Trezor/ Solana 编解码、WebSocket 订阅重连、Coinbase CDP 鉴权请求的集成回归。
