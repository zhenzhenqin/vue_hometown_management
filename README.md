# 🌏 衢州地区信息管理系统 (Quzhou Hometown System)

> **南孔圣地 · 衢州有礼**
> 基于 Spring Boot 3 + Vue 3 的全栈前后端分离项目。旨在通过数字化手段展示衢州文化、旅游与特产资源，并提供基于 ECharts 的数据驾驶舱、**百度地图全域导览**与完善的后台管理功能。

![Java](https://img.shields.io/badge/Java-17%2B-green) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green) ![Vue](https://img.shields.io/badge/Vue-3.x-42b883) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue) ![Redis](https://img.shields.io/badge/Redis-Latest-red)

---

## 🔗 代码仓库 (Repositories)

本项目采用微服务思想划分工程，前后端独立维护，以下是各模块的源码仓库地址：

| 模块 | 说明 | GitHub 仓库地址 |
| :--- | :--- | :--- |
| **后端服务** | 核心业务逻辑 (Spring Boot 3) | [hometown-backend](https://github.com/zhenzhenqin/hometown) |
| **后台管理端** | 管理员控制台 (Vue 3 + Element Plus) | [vue-hometown-management](https://github.com/zhenzhenqin/vue_hometown_management) |
| **用户展示端** | 游客沉浸式前台 (Vue 3 + Baidu Map) | [vue-showhometown](https://github.com/zhenzhenqin/vue_showhometown) |

---

## 📖 项目简介

本项目是一个集**前台沉浸式展示**与**后台高效管理**于一体的高性能全栈系统。采用业界主流的 **Spring Boot 3 + Vue 3** 前后端分离架构。

系统不仅在**“读”**层面利用缓存极大提升了页面加载速度，更在**“写”**层面利用 **Redis** 承载了高频的点赞与交互流量。此外，通过引入 **百度地图 API**，实现了景点地理信息的直观可视化，让用户能够“云游”衢州。

### ✨ 核心亮点

* **全栈架构**：采用前沿的 Spring Boot 3 + Vue 3 (Setup) + Vite 技术栈，结构清晰。
* **🗺️ 空间可视化**：集成 **百度地图 API (Baidu Map GL)**，打破传统列表展示，将静态的景点数据转化为动态的地图标记。支持**3D视角**与**平滑飞行**定位，提供沉浸式的地理位置导览服务。
* **Redis 读写双重加速**：
    * **读缓存**：对首页轮播、热门排行进行预热，响应速度提升 **50%+**。
    * **写缓冲**：利用 Redis `Set` 实现点赞秒级去重与计数，配合定时任务异步同步至 MySQL，解决高并发写入瓶颈。
* **数据可视化**：后台集成 **ECharts** 实现数据驾驶舱，实时监控景点热度与用户交互趋势。
* **安全风控体系**：基于 JWT 无状态鉴权 + Kaptcha 验证码防刷 + AOP 全链路日志审计。
* **云端能力**：接入 **阿里云 OSS**，实现海量图片资源的高效存储与 CDN 分发。

---

## 🧩 功能模块详情

### 1. 业务交互模块 (用户端)
* **🌏 全域地图导览**: 基于百度地图，直观展示衢州景点分布，点击地图标记即可查看详情并一键导航。
* **内容展示**: 景点/特产/文化的多维度展示，支持富文本与高清图集。
* **高性能交互**:
    * **点赞/收藏**: Redis 缓存加持，极速响应。
    * **浏览**: 瀑布流布局，支持按热度排序。
* **用户中心**: 个人资料管理、密码修改、历史足迹。

### 2. 后台管理系统 (管理端)
* **📊 数据驾驶舱**:
    * **核心指标**: 用户总量、景点收录数、全站互动量。
    * **图表分析**: 用户增长趋势、特产价格分布、景点人气排行 Top10。
* **🛡️ 系统安全**:
    * **用户管理**: 风险账号封禁/解封。
    * **监控中心**: 实时查看服务器 CPU、内存、JVM 运行状态 (OSHI)。
    * **操作日志**: 记录每一次敏感操作。

---

## 🚀 快速开始 (Quick Start)

### 0. 环境准备
* **Java**: JDK 17+
* **Node.js**: 16.0+
* **MySQL**: 8.0+
* **Redis**: 5.0+
* **Maven**: 3.6+

### 1. 数据库初始化
1.  创建数据库 `hometown_db`。
2.  执行初始化脚本：`hometown/qu-server/src/main/resources/init.sql` (确保脚本中包含 `longitude`/`latitude` 字段)。

### 2. 后端启动
1.  修改 `application.yml` 配置 MySQL、Redis 连接信息。
2.  (可选) 配置阿里云 OSS 和 **百度地图 AK** (在前端代码中配置)。
3.  运行 `HometownApplication.java`。

### 3. 前端启动
分别进入 `vue_hometown_management` 和 `vue_showhometown` 目录：
```bash
npm install
npm run dev