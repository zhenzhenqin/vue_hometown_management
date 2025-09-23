# vue-hometown-mjc

这是一个基于 Vue 3 和 Vite 构建的家乡介绍网站项目。

## 项目简介

vue-hometown-mjc 是一个用于展示和介绍家乡特色、文化、风景和历史的前端项目。通过现代化的 Vue 3 技术栈，为用户提供流畅的交互体验和美观的界面展示。

## 功能特性

- 🏠 家乡概览展示
- 🗺️ 地理位置和特色景点介绍
- 🍜 本地美食文化展示
- 📚 历史文化介绍
- 🎉 响应式设计，支持多设备访问

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: JavaScript
- **样式**: CSS3/SCSS
- **组件库**: element-plus

## 推荐的开发环境设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 项目配置

更多配置信息请参考 [Vite 配置参考](https://vitejs.dev/config/).

## 项目设置

```sh
npm install

开发环境编译和热重载
npm run dev

生产环境编译和压缩
npm run build

项目结构
vue-hometown-mjc/
├── public/                 # 静态资源文件
├── src/                    # 源代码目录
│   ├── assets/             # 项目资源文件
│   ├── components/         # 公共组件
│   ├── views/              # 页面视图
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html              # 主页面模板
├── vite.config.js          # Vite 配置文件
├── package.json            # 项目依赖和脚本
└── README.md               # 项目说明文档

贡献指南
Fork 本项目
  创建功能分支 (git checkout -b feature/YourFeature)
  提交更改 (git commit -m 'Add some feature')
  推送到分支 (git push origin feature/YourFeature)
  提交 Pull Request
  
许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。