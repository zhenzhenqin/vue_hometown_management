<script setup>
import { ref } from 'vue'
import { Link, Picture, Trophy, School, Star, Cpu } from '@element-plus/icons-vue'

// 本地图片路径 (保持不变)
const carouselImages = ref([
  { url: '/image/yifu.png', desc: '逸夫图书馆' },
  { url: '/image/qiming.jpg', desc: '启明广场' },
  { url: '/image/riyuehu.jpg', desc: '日月湖' },
])

const highlights = ref([
  { title: '高性能缓存', desc: '集成 Redis 缓存热点数据，有效降低 MySQL 数据库 I/O 压力。' },
  { title: '云端存储', desc: '接入阿里云 OSS 对象存储服务，实现海量图片资源的高效分发。' },
  { title: '安全认证', desc: '采用 JWT 实现无状态单点登录，结合拦截器实现细粒度权限控制。' },
  { title: '规范接口', desc: '引入 Knife4j + Swagger3 自动生成在线接口文档，开发规范化。' }
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
          <span>开发环境与全栈技术</span>
        </div>
      </template>
      <el-descriptions border :column="4" direction="vertical" class="tech-descriptions">
        <el-descriptions-item label="前端框架"><el-tag>Vue 3</el-tag></el-descriptions-item>
        <el-descriptions-item label="UI 组件库">Element Plus</el-descriptions-item>
        <el-descriptions-item label="后端核心"><el-tag type="success">Spring Boot 3</el-tag></el-descriptions-item>
        <el-descriptions-item label="数据库">MySQL 8.0</el-descriptions-item>
        <el-descriptions-item label="持久层">MyBatis + PageHelper</el-descriptions-item>
        <el-descriptions-item label="缓存中间件"><el-tag type="danger" effect="dark">Redis</el-tag></el-descriptions-item>
        <el-descriptions-item label="对象存储">阿里云 OSS</el-descriptions-item>
        <el-descriptions-item label="接口文档">Knife4j</el-descriptions-item>
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
        <el-col :span="6" v-for="(item, index) in highlights" :key="index">
          <div class="highlight-item">
            <el-icon class="highlight-icon" :size="30" color="#1a5e38"><Cpu /></el-icon>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<style scoped>
.school-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 30px; /* 全局板块间距，防止重叠 */
}

/* =========================================
   核心修复：左右等高对齐布局
   ========================================= */
.intro-section {
  display: flex;
  gap: 20px;
  align-items: stretch; /* 关键：强制子元素高度拉伸一致 */
}

/* 包装器 */
.intro-left-wrapper {
  flex: 1; /* 左侧占 1 份宽度 */
  display: flex; /* 让内部卡片也能通过 flex 撑开 */
  flex-direction: column;
}

.intro-right-wrapper {
  flex: 2; /* 右侧占 2 份宽度 */
  display: flex;
  flex-direction: column;
}

/* 卡片样式重置 */
.intro-card, .carousel-card {
  flex: 1; /* 关键：卡片自身撑满包装器的高度 */
  display: flex;
  flex-direction: column;
}

/* 穿透修改 el-card 内部 body 样式，让内容区也能撑开 */
:deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

/* 简介内容区布局 */
.intro-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 上下分散对齐 */
}

.intro-text {
  color: #444;
  line-height: 1.8;
  font-size: 15px;
  text-indent: 2em;
}

.intro-footer {
  margin-top: 20px;
  text-align: center;
}

/* =========================================
   其他美化样式
   ========================================= */
.hero-card {
  background: linear-gradient(135deg, #f0f9eb 0%, #ffffff 100%);
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
.project-title { font-size: 26px; color: #1a5e38; margin: 0 0 10px 0; font-weight: 800; font-family: "KaiTi", serif; }
.school-name { font-size: 16px; color: #555; margin: 0 0 10px 0; font-weight: 500; }

.hover-effect {
  border-left: 5px solid transparent;
  transition: all 0.3s ease;
}
.hover-effect:hover {
  border-left: 5px solid #1a5e38;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #1a5e38;
  font-size: 16px;
}

.carousel-img { width: 100%; height: 100%; object-fit: cover; }
.carousel-item-wrapper { position: relative; width: 100%; height: 100%; }
.carousel-desc { 
  position: absolute; bottom: 0; left: 0; width: 100%; 
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); 
  color: white; padding: 12px 20px; font-size: 16px; font-weight: bold;
}

:deep(.el-descriptions__label) {
  font-weight: bold;
  background-color: #f9fbf8;
  color: #1a5e38;
}

.highlight-item {
  background-color: #fcfdfc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eef2ed;
  height: 100%;
  transition: all 0.3s;
}
.highlight-item:hover {
  transform: translateY(-5px);
  border-color: #1a5e38;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0,0,0,0.08);
}
.highlight-item h4 { margin: 15px 0 10px 0; color: #333; font-size: 16px; font-weight: bold; }
.highlight-item p { font-size: 13px; color: #666; line-height: 1.6; margin: 0; text-align: justify; }
.highlight-icon {
  background-color: #eaf5e6; padding: 10px; border-radius: 50%;
  width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
}

/* 响应式 */
@media (max-width: 900px) {
  .intro-section { flex-direction: column; }
}
</style>