<script setup>
import { ref } from 'vue'
import { 
  Link, Picture, Trophy, School, Star, 
  // 新增技术栈相关图标
  Monitor, DataLine, Files, Connection, Odometer,
  // 新增亮点相关图标
  Lightning, Cloudy, Lock, Document
} from '@element-plus/icons-vue'

// 本地图片路径 (保持不变)
const carouselImages = ref([
  { url: '/image/yifu.png', desc: '逸夫图书馆' },
  { url: '/image/qiming.jpg', desc: '启明广场' },
  { url: '/image/riyuehu.jpg', desc: '日月湖' },
])

// 升级亮点数据，加入对应的图标组件
const highlights = ref([
  { 
    icon: Lightning, 
    title: '高性能缓存', 
    desc: '集成 Redis 缓存热点数据，有效降低 MySQL 数据库 I/O 压力，提升响应速度。',
    color: '#e6a23c' // 橙色系
  },
  { 
    icon: Cloudy, 
    title: '云端对象存储', 
    desc: '接入阿里云 OSS 对象存储服务，实现海量图片资源的高效上传与CDN分发。',
    color: '#409eff' // 蓝色系
  },
  { 
    icon: Lock, 
    title: 'JWT 安全认证', 
    desc: '采用 JWT 实现无状态单点登录，结合自定义拦截器实现细粒度权限控制。',
    color: '#67c23a' // 绿色系
  },
  { 
    icon: Document, 
    title: '接口规范化', 
    desc: '引入 Knife4j + Swagger3 自动生成在线接口文档，实现前后端开发规范化。',
    color: '#f56c6c' // 红色系
  }
])
</script>

<template>
  <div class="school-container">
    
    <el-card class="hero-card section-gap" shadow="hover">
      <div class="hero-content">
        <div class="logo-wrapper">
          <img src="/image/logo.png" alt="CJLU Logo" class="school-logo" />
        </div>
        <div class="text-wrapper">
          <h1 class="project-title">基于Java的Web开发期末大作业</h1>
          <p class="school-name">中国计量大学 · China Jiliang University</p>
          <div class="tags-group">
            <el-tag type="success" effect="dark" round>2025-2026学年 第一学期</el-tag>
            <el-tag type="warning" effect="plain" round style="margin-left: 10px">SpringBoot 3 + Vue 3</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <div class="intro-section section-gap">
      <div class="intro-left-wrapper">
        <el-card class="intro-card hover-effect" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><School /></el-icon>
              <span>学校概况</span>
            </div>
          </template>
          
          <div class="intro-content">
            <div class="intro-text">
              <p>中国计量大学是一所以计量、标准、质量、市场监管和检验检疫为办学特色的本科院校。</p>
              <p>学校坐落于风景秀丽的浙江省杭州市，秉承“精思国计、细量民生”的校训。</p>
              <p>学校现有硕士学位授权一级学科15个、硕士专业学位授权点10个。工程学、化学、材料科学、环境/生态学等4个学科进入ESI全球排名前1%。</p>
            </div>
            <div class="intro-footer">
              <el-divider border-style="dashed" />
              <el-link type="primary" href="https://www.cjlu.edu.cn/" target="_blank" :icon="Link">
                访问学校官网
              </el-link>
            </div>
          </div>
        </el-card>
      </div>

      <div class="intro-right-wrapper">
        <el-card class="carousel-card hover-effect" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Picture /></el-icon>
              <span>校园风光</span>
            </div>
          </template>
          <el-carousel trigger="click" height="340px" :interval="4000">
            <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
              <div class="carousel-item-wrapper">
                <img :src="item.url" class="carousel-img" />
                <div class="carousel-desc">{{ item.desc }}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </div>
    </div>

    <el-card class="dev-info-card section-gap hover-effect" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Trophy /></el-icon>
          <span>全栈技术架构</span>
        </div>
      </template>
      
      <el-descriptions border :column="4" direction="vertical" class="tech-descriptions">
        
        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Monitor /></el-icon> 前端框架</div>
          </template>
          <el-tag effect="plain" type="success" size="large">Vue 3.x</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Files /></el-icon> UI 组件库</div>
          </template>
          <el-tag effect="plain" type="" size="large">Element Plus</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Connection /></el-icon> 后端核心</div>
          </template>
          <el-tag effect="dark" type="success" size="large">Spring Boot 3</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><DataLine /></el-icon> 数据库</div>
          </template>
          <div class="tech-group">
            <el-tag effect="plain" type="info">MySQL 8.0</el-tag>
            <el-tag effect="plain" type="info" class="ml-1">MyBatis-Plus</el-tag>
          </div>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Odometer /></el-icon> 缓存中间件</div>
          </template>
          <el-tag effect="light" type="danger">Redis 7.x</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Cloudy /></el-icon> 对象存储</div>
          </template>
          <el-tag effect="light" type="warning">Aliyun OSS</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Document /></el-icon> 接口文档</div>
          </template>
          <el-tag effect="light" color="#f4f4f5" style="color: #909399">Knife4j</el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item>
          <template #label>
            <div class="tech-label"><el-icon><Lock /></el-icon> 安全框架</div>
          </template>
           <el-tag effect="light" type="success">JWT + Interceptor</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="highlight-card hover-effect" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Star /></el-icon>
          <span>项目核心亮点</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" :xs="24" :sm="12" :md="6" v-for="(item, index) in highlights" :key="index" class="mb-col">
          <div class="highlight-item" :style="{ '--hover-color': item.color }">
            <div class="icon-box" :style="{ color: item.color, backgroundColor: item.color + '15' }">
              <el-icon :size="28"><component :is="item.icon" /></el-icon>
            </div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<style scoped>
/* 全局容器与基础设置 */
.school-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 响应式辅助类 */
.ml-1 { margin-left: 5px; }
@media (max-width: 768px) {
  .mb-col { margin-bottom: 20px; }
}

/* =========================================
   Intro Section (原有布局逻辑保持不变)
   ========================================= */
.intro-section {
  display: flex;
  gap: 20px;
  align-items: stretch;
}
.intro-left-wrapper { flex: 1; display: flex; flex-direction: column; }
.intro-right-wrapper { flex: 2; display: flex; flex-direction: column; }
.intro-card, .carousel-card { flex: 1; display: flex; flex-direction: column; }

:deep(.el-card__body) {
  flex: 1; display: flex; flex-direction: column; padding: 20px;
}
.intro-content { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.intro-text { color: #444; line-height: 1.8; font-size: 15px; text-indent: 2em; }
.intro-footer { margin-top: 20px; text-align: center; }

/* =========================================
   Hero Card Style
   ========================================= */
.hero-card {
  background: linear-gradient(135deg, #f0f9eb 0%, #ffffff 80%, #e1f3d8 100%);
  border: none;
  border-left: 6px solid #1a5e38;
}
.hero-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}
.school-logo { width: 90px; height: 90px; object-fit: contain; margin-right: 30px; }
.project-title { font-size: 26px; color: #1a5e38; margin: 0 0 10px 0; font-weight: 800; font-family: "KaiTi", serif; letter-spacing: 1px;}
.school-name { font-size: 16px; color: #555; margin: 0 0 10px 0; font-weight: 500; }

/* =========================================
   Tech Stack Style (美化 Descriptions)
   ========================================= */
.tech-descriptions {
  /* 给descriptions添加一点阴影效果 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-descriptions__label) {
  background-color: #fafbfc !important;
  color: #606266;
  font-weight: 600;
  width: 120px; /* 固定标签宽度 */
  vertical-align: middle;
}
:deep(.el-descriptions__content) {
  vertical-align: middle;
  background-color: #fff;
}

.tech-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.tech-group {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

/* =========================================
   Highlights Style (卡片悬浮特效)
   ========================================= */
.highlight-item {
  background-color: #fff;
  padding: 25px 20px;
  border-radius: 12px;
  border: 1px solid #eef2ed;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

/* 顶部彩色线条装饰 */
.highlight-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--hover-color);
  transform: scaleX(0);
  transition: transform 0.4s ease;
  transform-origin: left;
}

.highlight-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  border-color: transparent;
}

.highlight-item:hover::before {
  transform: scaleX(1);
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.highlight-item:hover .icon-box {
  transform: rotate(15deg) scale(1.1);
}

.highlight-item h4 {
  margin: 10px 0;
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.highlight-item p {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

/* =========================================
   Common Card Style
   ========================================= */
.hover-effect {
  border-left: 5px solid transparent;
  transition: all 0.3s ease;
}
.hover-effect:hover {
  border-left: 5px solid #1a5e38;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #1a5e38;
  font-size: 17px;
}

/* Carousel */
.carousel-img { width: 100%; height: 100%; object-fit: cover; }
.carousel-item-wrapper { position: relative; width: 100%; height: 100%; }
.carousel-desc { 
  position: absolute; bottom: 0; left: 0; width: 100%; 
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); 
  color: white; padding: 15px 20px; font-size: 16px; font-weight: bold;
  letter-spacing: 1px;
}

/* Mobile Responsive */
@media (max-width: 900px) {
  .intro-section { flex-direction: column; }
  .intro-left-wrapper, .intro-right-wrapper { width: 100%; flex: auto; }
  .project-title { font-size: 20px; }
  .school-logo { width: 60px; height: 60px; margin-right: 15px;}
}
</style>