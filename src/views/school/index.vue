<script setup>
import { ref } from 'vue'
import { Link, Picture, Trophy, School, Star, Cpu } from '@element-plus/icons-vue'

// 1. 修改图片路径为本地路径
// Vite 约定：public 目录下的文件可以直接通过 / 访问
const carouselImages = ref([
  { 
    url: '/image/yifu.png',  // 对应 public/image/yifu.png
    desc: '逸夫图书馆' 
  },
  { 
    url: '/image/qiming.jpg', // 对应 public/image/qiming.jpg
    desc: '启明广场' 
  },
  { 
    url: '/image/riyuehu.jpg', // 对应 public/image/riyuehu.jpg
    desc: '日月湖' 
  },
])

// 项目亮点数据
const highlights = ref([
  { title: '高性能缓存', desc: '集成 Redis 缓存热点数据（如JWT令牌、字典数据），有效降低 MySQL 数据库 I/O 压力，提升系统响应速度。' },
  { title: '云端存储', desc: '接入阿里云 OSS 对象存储服务，实现海量图片资源的高效上传与分发，减轻本地服务器负载。' },
  { title: '安全认证', desc: '采用 JWT (JSON Web Token) 实现无状态的单点登录认证，结合拦截器实现细粒度的权限控制。' },
  { title: '规范接口', desc: '引入 Knife4j + Swagger3 自动生成在线接口文档，实现前后端开发规范化、标准化。' }
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

    <el-row :gutter="20" class="main-content section-gap">
      <el-col :span="8">
        <el-card class="intro-card hover-effect" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><School /></el-icon>
              <span>学校概况</span>
            </div>
          </template>
          <div class="intro-text">
            <p>中国计量大学是一所以计量、标准、质量、市场监管和检验检疫为办学特色的本科院校。</p>
            <p>学校坐落于风景秀丽的浙江省杭州市，秉承“精思国计、细量民生”的校训。</p>
            
            <div class="intro-footer">
              <el-divider border-style="dashed" />
              <el-link type="primary" href="https://www.cjlu.edu.cn/" target="_blank" :icon="Link">
                访问学校官网
              </el-link>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="carousel-card hover-effect" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Picture /></el-icon>
              <span>校园风光</span>
            </div>
          </template>
          <el-carousel trigger="click" height="300px" :interval="4000" class="school-carousel">
            <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
              <div class="carousel-item-wrapper">
                <img :src="item.url" class="carousel-img" />
                <div class="carousel-desc">{{ item.desc }}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="dev-info-card section-gap hover-effect" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-icon><Trophy /></el-icon>
          <span>开发环境与全栈技术</span>
        </div>
      </template>
      
      <el-descriptions border :column="4" direction="vertical" class="tech-descriptions">
        <el-descriptions-item label="前端框架">
          <el-tag>Vue 3</el-tag> <el-tag type="info">Vite</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="UI 组件库">Element Plus</el-descriptions-item>
        <el-descriptions-item label="后端核心">
          <el-tag type="success">Spring Boot 3</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开发语言">Java JDK 17</el-descriptions-item>
        
        <el-descriptions-item label="数据库">MySQL 8.0</el-descriptions-item>
        <el-descriptions-item label="持久层框架">MyBatis + PageHelper</el-descriptions-item>
        
        <el-descriptions-item label="缓存中间件">
          <el-tag type="danger" effect="dark">Redis</el-tag>
        </el-descriptions-item>
        
        <el-descriptions-item label="身份认证">JWT (Token)</el-descriptions-item>
        <el-descriptions-item label="对象存储">阿里云 OSS</el-descriptions-item>
        <el-descriptions-item label="接口文档">Knife4j + Swagger</el-descriptions-item>
        <el-descriptions-item label="工具库">Hutool + Lombok</el-descriptions-item>
        <el-descriptions-item label="版本控制">Git</el-descriptions-item>
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
}

/* =================================
   核心修复：统一的板块间距类
   解决重叠问题的关键
   ================================= */
.section-gap {
  margin-bottom: 25px; /* 每个大板块底部留出25px */
}

/* Hero 区域 */
.hero-card {
  background: linear-gradient(135deg, #f0f9eb 0%, #ffffff 100%);
  border: none;
  border-left: 6px solid #1a5e38; /* 左侧装饰条 */
}
.hero-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}
.school-logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-right: 30px;
}
.text-wrapper { text-align: left; }
.project-title {
  font-size: 26px;
  color: #1a5e38;
  margin: 0 0 10px 0;
  font-weight: 800;
  font-family: "KaiTi", "楷体", serif;
}
.school-name {
  font-size: 16px;
  color: #555;
  margin: 0 0 10px 0;
  font-weight: 500;
}

/* 卡片美化：左侧绿色装饰条 */
.hover-effect {
  border-left: 5px solid transparent;
  transition: all 0.3s;
}
.hover-effect:hover {
  border-left: 5px solid #1a5e38; /* 悬停时显示绿色边框 */
  transform: translateY(-2px); /* 微微上浮 */
}

/* 通用 Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #1a5e38;
  font-size: 16px;
}

/* 简介与轮播 */
.intro-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
/* 让简介内容撑开，保证底部链接对齐 */
.intro-text { 
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.8; 
  color: #444; 
  font-size: 14px; 
  text-indent: 2em; 
}
.intro-footer {
  margin-top: auto; /* 自动推到底部 */
  text-align: center;
  text-indent: 0;
}

.carousel-card { height: 100%; }
.school-carousel { border-radius: 4px; overflow: hidden; }
.carousel-img { width: 100%; height: 100%; object-fit: cover; }
.carousel-item-wrapper { position: relative; width: 100%; height: 100%; }
.carousel-desc { 
  position: absolute; 
  bottom: 0; 
  left: 0; 
  width: 100%; 
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); 
  color: white; 
  padding: 10px 15px; 
  font-size: 15px; 
  font-weight: bold;
}

/* 技术栈表格优化 */
:deep(.el-descriptions__label) {
  font-weight: bold;
  background-color: #f9fbf8;
  color: #1a5e38;
}

/* 亮点部分 */
.highlight-item {
  background-color: #fcfdfc;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eef2ed;
  height: 100%;
  transition: all 0.3s;
}
.highlight-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-5px);
  border-color: #1a5e38;
}
.highlight-item h4 {
  margin: 15px 0 10px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
.highlight-item p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}
.highlight-icon {
  background-color: #eaf5e6;
  padding: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>