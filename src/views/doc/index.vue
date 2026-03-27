<template>
  <div class="doc-layout">
    <aside class="doc-sidebar">
      <div class="sidebar-brand">
        <el-icon class="brand-icon"><Reading /></el-icon>
        <div class="brand-text">
          <span class="title">HOMETOWN</span>
          <span class="version">v1.0.8 Stable</span>
        </div>
      </div>
      <nav class="toc-wrapper">
        <ul class="toc-list">
          <li 
            v-for="(item, index) in toc" 
            :key="index"
            :class="[
              'toc-item', 
              `level-${item.level}`, 
              { active: activeSection === item.id }
            ]"
            @click="scrollTo(item.id)"
          >
            {{ item.text }}
          </li>
        </ul>
      </nav>
    </aside>

    <main class="doc-main" ref="contentRef" @scroll="handleScroll">
      <header class="content-header">
        <div class="header-breadcrumb">文档中心 / 衢州地区信息管理系统 / 部署与开发手册</div>
      </header>
      
      <div class="markdown-container">
        <article class="markdown-body" v-html="parsedMarkdown"></article>
      </div>
      
      <footer class="doc-footer">
        <div class="footer-line"></div>
        <p>Managed by Aliyun ECS & OSS System &copy; 2025</p>
        <p class="author">Developed & Maintained by mjc</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Reading } from '@element-plus/icons-vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

// --- 📝 项目核心文档 (v1.0.8 Stable) ---
const markdownContent = `
# 衢州地区信息管理系统 (Hometown Management System)

> **版本**: v1.0.8 (Stable Build)
> **开发者**: mjc (23H034160336)  
> **状态**: 🟢 已部署 (Stable)

---

## 1. 项目概述 (Overview)

本项目是一个致力于**弘扬衢州文化、推广地方特色**的全栈信息管理平台。系统集成了**文化遗产展示、特产推广、旅游景点导航**以及**后台数据可视化管理**等功能。

**v1.0.8 核心升级**：在 v1.0.7 数据中心的基础上，本项目迎来了“感性体验”的重大进化。全新上线 **“心情随笔 (Emo Notes)”** 模块，引入 **“流态旋转时间轴”** 与 **“沉浸式写作体验”**，让系统不仅仅是一个冷冰冰的管理工具，更是记录岁月与乡愁的容器。

---

## 2. 技术栈 (Tech Stack)

### 🛠️ 后端 (Backend)
-   **核心框架**: Spring Boot 2.7.x
-   **ORM**: MyBatis / MyBatis-Plus
-   **数据库**: MySQL 8.0
-   **IP解析**: **Ip2Region (离线 IP 库，毫秒级查询)**
-   **缓存**: **Redis** (用于会话管理、UV/PV 统计与热点数据缓存)
-   **安全**: JWT (JSON Web Token) 鉴权
-   **监控**: OSHI (System Hardware Information) 
-   **工具**: Swagger/Knife4j, Lombok, FastJSON
-   **云服务**: 阿里云 OSS (对象存储)

### 💻 前端 (Frontend)
-   **框架**: Vue 3 (Composition API)
-   **构建**: Vite 4.x
-   **UI 组件库**: Element Plus (表格自适应优化)
-   **编辑器**: **Md-Editor-v3** (Markdown 实时渲染与编辑) [NEW]
-   **创意交互**: 
    -   **Pure CSS Animation** (无图水墨渲染)
    -   **CSS3 3D Transform** (流态时间轴视差滚动) [NEW]
    -   **Canvas Confetti** (发布撒花特效) [NEW]
-   **图表**: ECharts 5.x (深度集成地图与雷达图)
-   **地图**: 百度地图 JavaScript API GL + ECharts GeoJson
-   **HTTP**: Axios

---

## 3. 系统架构 (Architecture)

\`\`\`mermaid
graph TD
    User[用户/管理员] -->|登录/阅读| Gateway[Nginx / 反向代理]
    Gateway --> Server(Spring Boot 后端)
    
    subgraph "核心服务层"
    Server -->|解析IP| Ip2Region[IP 属地库]
    Server -->|读写| DB[(MySQL 数据库)]
    Server -->|缓存| Cache[(Redis)]
    Server -->|监控| Hardware[OSHI 硬件监控]
    end
    
    subgraph "数据与创意层"
    Cache -->|UV/PV| ReportService[报表服务]
    Hardware -->|系统状态| LankeView[烂柯棋局可视化]
    Server -->|Markdown存储| ArticleService[随笔服务]
    end

    subgraph "生产安全层"
    Git[Git 仓库] --x|忽略| Sensitive[.yml 配置文件]
    Config[外部 application-prod.yml] --挂载启动--> Server
    end
\`\`\`

---

## 4. 核心功能模块 (Modules)

### 📝 心情随笔 (Mood & Memory) **[NEW]**
-   **流态旋转时间轴 (Liquid Rotary Timeline)**: 
    -   摒弃传统列表，采用 **3D 视差滚动** 技术。
    -   卡片沿中轴线如门扉般优雅旋入，背景伴随流光渐变，营造穿梭时空的视觉体验。
-   **禅模式写作 (Zen Mode)**:
    -   后台集成 Markdown 编辑器，支持 **“心情(Mood)”** 选择（开心/Emo/平静/暴躁）。
    -   发布成功后触发 **Canvas Confetti** 撒花特效，赋予写作仪式感。
-   **灵感胶囊 (Inspiration Capsule)**:
    -   前台右下角悬浮的呼吸态按钮，作为进入记忆世界的时空入口。
-   **沉浸式阅读**: 极简主义排版，根据心情自动适配阅读氛围。

### 📊 数据中心 (Data Center)
-   **流量分析 (Traffic Analysis)**: 
    -   **PV (Page View)**: 基于 Redis 的原子计数器，实时统计页面访问量。
    -   **UV (Unique Visitor)**: 基于 Redis \`Set\` 结构去重，精确统计每日独立访客数。
-   **地域感知 (Region Radar)**:
    -   **分布地图**: 结合 ECharts 地图组件，直观展示用户来源省份与城市。
    -   **Top 榜单**: 自动计算并展示用户量 Top 10 的活跃城市。

### 🎨 创意交互 (Creative Interaction)
-   **烂柯 · 岁月棋局**: 
    -   **设计理念**: 结合衢州“烂柯山”传说，以棋喻时。
    -   **动态对弈**: 前端算法模拟围棋自动落子，每一手棋代表系统稳定运行的一个心跳。
    -   **数据隐喻**: 
        -   *运行时长* -> *棋局进程*。
        -   *CPU 负载* -> *云雾浓度* (纯 CSS 粒子雾气，负载越高雾气越浓)。

### 👮 安全与审计 (Security & Audit)
-   **IP 属地监控**: 自动获取用户客户端 IP，通过 Nginx 透传 X-Real-IP，离线解析出“省份·城市”，并记录在数据库中。
-   **登录追踪**: 管理员和用户登录/注册时，自动更新最后登录 IP 和地点。
-   **配置安全隔离**: 生产环境密钥（DB/OSS）脱离 Jar 包，采用外部挂载模式，防止代码泄露导致 AK/SK 风险。

### 🗺️ 分布地图 (Attraction Map)
-   **全域导览**: 集成百度地图 GL，直观展示衢州所有景点的地理分布。
-   **智能定位**: 支持数据库经纬度直接打点，同时也支持基于地址的自动解析兜底方案。
-   **沉浸体验**: 3D 倾斜视角 + 飞行跳转动画 (FlyTo)。

### 🖥️ 服务监控 (Server Monitor)
-   **实时仪表盘**: 实时监控服务器的 CPU 使用率、内存占用率。
-   **环境信息**: 展示服务器操作系统、IP 地址、Java 版本、项目路径等。

### 🏛️ 文化与特产 (Culture & Food)
-   **非遗展示**: 收录衢州各类非物质文化遗产，支持富文本展示。
-   **特产美食**: 三头一掌、烤饼等特色美食介绍。

---

## 5. 部署指南 (Deployment)

### 🖥️ 5.1 运行配置详解 (Runtime Specification)
- **云服务**: 阿里云香港节点 (47.76.150.187)
- **操作系统**: CentOS 7.9 (内核 3.10)
- **JVM 环境**: OpenJDK 17 (G1 GC 优化)
  - *启动参数参考*: -Xms512m -Xmx1024m -Dfile.encoding=UTF-8
- **MySQL 8.0**: 
  - *配置*: 字符集 utf8mb4, 开启慢查询日志。
  - *连接*: 仅限 localhost (127.0.0.1) 访问，禁止外网连接以保安全。
- **Redis 7.0**: 
  - *存储*: 默认 16 库，项目使用 DB6。
  - *持久化*: AOF 每秒同步一次，保障数据一致性。
- **Nginx 1.22**: 
  - *优化*: 开启 Gzip 压缩，配置 client_max_body_size 10m。
- **目录结构**:
  - \`/www/wwwroot/qu-server-0.0.1-SNAPSHOT.jar\` (后端包)
  - \`/www/wwwroot/application-prod.yml\` (外部私密配置)
  - \`/www/wwwroot/manage/\` (管理端静态资源)

### 5.2 生产环境启动 (External Config)
使用 \`additional-location\` 参数挂载外部配置文件启动，实现“密钥不上云”：

\`\`\`bash
pkill -9 java # 杀掉残留进程并启动
nohup java -jar /www/wwwroot/qu-server-0.0.1-SNAPSHOT.jar \\
--spring.config.additional-location=/www/wwwroot/application-prod.yml \\
> /www/wwwroot/log.txt 2>&1 &
\`\`\`

### 5.3 Nginx 高级配置 (Real IP & Upload)
针对 8081 管理端端口，实装 IP 转发及上传限制：

\`\`\`nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr; # 获取真实用户IP
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    client_max_body_size 10m; # 放行大图上传
}
\`\`\`

### 5.4 阿里云 OSS 防盗链
- **策略**: 开启 Referer 白名单。
- **配置**: 仅允许 \`47.76.150.187\` 发起的请求，有效防止恶意盗刷 OSS 下行流量。

---

## 6. 更新日志 (Changelog)

-   **v1.0.8 (2025-12-30) - The "Soul" Update**:
    -   ✨ **[Mood]** 全新上线 **“心情随笔”** 系统，支持 Markdown 撰写、心情标记与封面上传。
    -   🐛 **[Fix]** 修复了 \`el-upload\` 组件在生产环境下的路径 404 问题，优化了拦截器放行策略。

-   **v1.0.7 (2025-12-30)**:
    -   ✨ **[Creative]** 新增 **“烂柯·岁月棋局”** 运行中枢，采用纯 CSS 构建水墨山水背景与自动对弈围棋，以艺术化的方式展示系统状态。
    -   ✨ **[Data]** 新增 **“数据中心”** 模块，实装基于 Redis 的 **UV (独立访客) / PV (访问量)** 统计功能。
    -   ✨ **[Visual]** 新增 **“地域感知雷达”**，通过 ECharts 实现用户来源地的可视化分布。

-   **v1.0.6 (2025-12-28)**:
    -   ✨ **[Deploy]** 完成从本地打包向**服务器外部配置挂载**的架构转型。
    -   🔒 **[Security]** 实装 **OSS Referer 防盗链**，大幅降低流量被盗风险。
    -   🌐 **[Network]** 优化 Nginx 转发 Header，解决 \`Ip2Region\` 离线库无法识别代理后真实 IP 的问题。
    -   🐛 **[Bugfix]** 修复了外部 YAML 文件中 Redis 配置缩进及阿里云驼峰命名不匹配导致的启动失败。

-   **v1.0.5 (2025-12-28)**: 
    -   ✨ **[Feature]** 全面实装 **IP 属地监控** 功能。
    -   🐛 **[Bugfix]** 修复了 MyBatis \`update\` 语句语法错误。
    -   🔒 **[Security]** 修复了阿里云 AK 泄露风险，重构了 \`.gitignore\`。

-   **v1.0.4 (2025-12-19)**:
    -   ✨ **[Feature]** 新增 **“分布地图”** 模块与 **“服务监控”** 模块。

-   **v1.0.0 (2025-09-15)**: 
    -   🎉 项目初始化。

---

> **Copyright**: 2025 衢州地区信息管理系统 Team. All Rights Reserved.
`

// --- 逻辑处理 ---
const contentRef = ref(null)
const activeSection = ref('')

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  gfm: true,
  breaks: true
})

const parsedMarkdown = computed(() => marked(markdownContent))

const toc = computed(() => {
  const reg = /^#+\s+(.*)$/gm
  const matches = markdownContent.match(reg) || []
  return matches.map((item, index) => {
    const level = item.match(/^#+/)[0].length
    const text = item.replace(/^#+\s+/, '')
    const id = `heading-${index}`
    return { level, text, id }
  })
})

onMounted(async () => {
  await nextTick()
  const headers = contentRef.value.querySelectorAll('h1, h2, h3')
  headers.forEach((header, index) => {
    header.id = `heading-${index}`
  })
})

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

const handleScroll = () => {
  const headers = contentRef.value.querySelectorAll('h1, h2, h3')
  let currentId = ''
  headers.forEach(header => {
    const rect = header.getBoundingClientRect()
    if (rect.top < 150) currentId = header.id
  })
  if (currentId) activeSection.value = currentId
}
</script>

<style scoped>
.doc-layout {
  display: flex;
  height: 100vh;
  background-color: #fdfdfd;
  overflow: hidden;
}

/* 侧边栏整体美化 */
.doc-sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 10;
}

.sidebar-brand {
  padding: 30px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f7fafc;
}

.brand-icon {
  font-size: 24px;
  color: #1a5e38;
}

.brand-text .title {
  display: block;
  font-weight: 800;
  font-size: 16px;
  color: #2d3748;
  letter-spacing: 0.5px;
}

.brand-text .version {
  display: block;
  font-size: 11px;
  color: #718096;
}

.toc-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px 10px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  padding: 10px 15px;
  margin-bottom: 4px;
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-item:hover {
  background-color: #f7fafc;
  color: #1a5e38;
}

.toc-item.active {
  background-color: #f0fff4;
  color: #1a5e38;
  font-weight: 600;
}

.level-1 { font-weight: bold; font-size: 15px; color: #2d3748; }
.level-2 { padding-left: 30px; font-size: 13px; }
.level-3 { padding-left: 45px; font-size: 12px; color: #a0aec0; }

/* 内容区 */
.doc-main {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  background-color: #ffffff;
}

.content-header {
  padding: 20px 50px;
  background-color: #ffffff;
  border-bottom: 1px solid #f7fafc;
  position: sticky;
  top: 0;
  z-index: 5;
}

.header-breadcrumb {
  font-size: 12px;
  color: #a0aec0;
  letter-spacing: 0.5px;
}

.markdown-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 50px;
}

/* Markdown 内容样式重构 */
:deep(.markdown-body) {
  font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
  color: #333;
  line-height: 1.7;
}

:deep(h1) {
  font-size: 32px;
  border-bottom: 2px solid #1a5e38;
  padding-bottom: 10px;
  margin-bottom: 30px;
  color: #1a5e38;
}

:deep(h2) {
  font-size: 22px;
  margin-top: 45px;
  margin-bottom: 20px;
  color: #2d3748;
  display: flex;
  align-items: center;
}

:deep(h2::before) {
  content: "";
  width: 4px;
  height: 20px;
  background-color: #1a5e38;
  margin-right: 12px;
  border-radius: 2px;
}

/* 代码块美化：改用中性柔和背景 */
:deep(pre) {
  background-color: #f1f1f1 !important; /* 适中的灰色背景 */
  padding: 20px;
  border-radius: 10px;
  margin: 25px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  border: 1px solid #e1e1e1; /* 适中边框色 */
}

:deep(code) {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  color: #444; /* 适中的文字颜色 */
}


:deep(blockquote) {
  border-left: 4px solid #1a5e38;
  background-color: #f0fff4;
  padding: 15px 20px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
  color: #276749;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 14px;
}

:deep(th), :deep(td) {
  border: 1px solid #edf2f7;
  padding: 12px 15px;
}

:deep(th) {
  background-color: #f7fafc;
  color: #4a5568;
}

.doc-footer {
  margin-top: 80px;
  padding: 40px 0;
  text-align: center;
  border-top: 1px solid #f7fafc;
}

.footer-line {
  width: 40px;
  height: 2px;
  background-color: #1a5e38;
  margin: 0 auto 20px;
}

.doc-footer p {
  font-size: 13px;
  color: #a0aec0;
  margin: 5px 0;
}

.author {
  font-style: italic;
  color: #718096 !important;
}

/* 滚动条美化 */
.toc-wrapper::-webkit-scrollbar,
.doc-main::-webkit-scrollbar {
  width: 5px;
}
.toc-wrapper::-webkit-scrollbar-thumb,
.doc-main::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
</style>