# 静态导出配置说明

本项目已配置支持 Next.js 静态导出功能。

## 构建静态文件

```bash
# 构建静态文件
npm run build:static

# 或者
pnpm build:static
```

构建完成后，静态文件将生成在 `out/` 目录中。

## 部署静态文件

### 使用 nginx 部署

1. 将 `out/` 目录中的所有文件复制到 nginx 的静态文件目录
2. 配置 nginx 支持 SPA 路由：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/static/files;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 使用 GitHub Pages 部署

1. 将 `out/` 目录重命名为 `docs/`
2. 在 GitHub 仓库设置中启用 GitHub Pages，选择 `docs` 目录作为源

### 使用 Vercel 部署

1. 将 `out/` 目录重命名为 `public/`
2. 在 Vercel 中配置静态文件部署

## 注意事项

1. **中间件限制**: 静态导出不支持服务端中间件，已通过客户端路由处理替代
2. **API 路由**: 静态导出不支持 API 路由，需要将 API 功能移到外部服务
3. **动态路由**: 所有动态路由都需要在构建时预生成
4. **图片优化**: 已禁用 Next.js 图片优化，使用 `unoptimized: true`
5. **资源路径**: 生产环境使用相对路径 `assetPrefix: '.'`

## 环境变量

- `NEXT_EXPORT=true`: 启用静态导出模式
- `NODE_ENV=production`: 生产环境模式

## 路由处理

静态导出时，路由重定向通过客户端 JavaScript 处理，而不是服务端中间件。这确保了在静态文件服务器上也能正常工作。
