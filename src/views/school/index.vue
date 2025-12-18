<script setup>
import { ref } from 'vue'
import { 
  Link, Trophy, School, Star, 
  Monitor, DataLine, Files, Connection, Odometer,
  Lightning, Cloudy, Lock, Document,
  Location, Reading, Medal, Timer, ArrowDown, ArrowUp
} from '@element-plus/icons-vue'

// 1. 手风琴画廊数据 (校园风光)
const sceneryList = ref([
  { id: 1, url: '/image/yifu.png', title: '逸夫图书馆', desc: '知识殿堂 · 思想高地' },
  { id: 2, url: '/image/qiming.jpg', title: '启明广场', desc: '晨读圣地 · 活力源泉' },
  { id: 3, url: '/image/riyuehu.jpg', title: '日月湖', desc: '湖光潋滟 · 岁月静好' },
  { id: 4, url: '/image/logo.png', title: '校徽', desc: '精思国计 · 细量民生', isLogo: true } // 增加一张Logo凑数，或者换成qu.svg
])

// 2. 核心数据 (带颜色)
const schoolStats = ref([
  { value: 'Top 1%', label: 'ESI全球学科排名', icon: Trophy, color: '#f56c6c' },
  { value: '15+', label: '一级学科硕士点', icon: Star, color: '#e6a23c' },
  { value: '4', label: '顶尖优势学科', icon: Medal, color: '#409eff' },
])

// 3. 亮点数据
const highlights = ref([
  { icon: Lightning, title: 'Redis 极速缓存', desc: '读写分离，性能飙升 50%', color: '#e6a23c' },
  { icon: Cloudy, title: 'OSS 云端存储', desc: '海量资源，CDN 全球分发', color: '#409eff' },
  { icon: Lock, title: 'JWT 安全卫士', desc: '无状态令牌，精准权限控制', color: '#67c23a' },
  { icon: Document, title: 'Swagger 文档', desc: '接口可视，开发协作无忧', color: '#f56c6c' }
])

// 4. 时光机控制
const showHistory = ref(false)
const historyEvents = [
  { year: '1978', title: '建校伊始', desc: '学校前身杭州计量学校成立，开启计量教育新篇章。' },
  { year: '1985', title: '升格本科', desc: '更名为中国计量学院，开始本科层次办学。' },
  { year: '2016', title: '更名大学', desc: '正式更名为中国计量大学，迈向高水平大学建设新征程。' },
  { year: '2021', title: '省部共建', desc: '浙江省人民政府与国家市场监管总局共建。' },
  { year: '2025', title: '未来可期', desc: '全栈信息管理系统上线，数字化建设迈上新台阶！' }
]
</script>

<template>
  <div class="school-container">
    
    <div class="hero-wrapper">
      <el-card class="hero-card" shadow="never">
        <div class="hero-inner">
          <div class="logo-box">
            <img src="/image/logo.png" alt="CJLU" class="school-logo" />
          </div>
          <div class="text-box">
            <div class="badges">
              <span class="badge-pill green">2025-2026 学年</span>
              <span class="badge-pill gray">Web 期末大作业</span>
            </div>
            <h1 class="main-title">衢州地区信息管理系统</h1>
            <p class="sub-title">China Jiliang University · 中国计量大学</p>
          </div>
        </div>
        <div class="hero-decoration"></div>
      </el-card>
    </div>

    <div class="intro-section">
      <div class="intro-left">
        <el-card class="glass-card" shadow="hover">
          <div class="motto-box">
            <el-icon class="quote-left"><Reading /></el-icon>
            <span class="motto-text">精思国计 · 细量民生</span>
          </div>
          
          <div class="desc-text">
            <p>坐落于<span class="highlight-word">杭州</span>，这是一所流淌着精准基因的高等学府。我们用代码丈量世界，用数据感知未来。</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card" v-for="(stat, idx) in schoolStats" :key="idx" :style="{ '--accent': stat.color }">
              <div class="stat-icon-wrapper">
                <el-icon><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-data">
                <div class="num">{{ stat.value }}</div>
                <div class="lbl">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <div class="action-row">
            <el-button type="primary" round plain tag="a" href="https://www.cjlu.edu.cn/" target="_blank">
              <el-icon class="mr-1"><Link /></el-icon> 访问官网
            </el-button>
            <el-button class="history-btn" :type="showHistory ? 'info' : 'warning'" circle @click="showHistory = !showHistory">
              <el-icon><component :is="showHistory ? ArrowUp : Timer" /></el-icon>
            </el-button>
            <span class="history-tip" v-if="!showHistory">👈 点击开启时光机</span>
          </div>
        </el-card>
      </div>

      <div class="intro-right">
        <div class="accordion-container">
          <div 
            v-for="item in sceneryList" 
            :key="item.id" 
            class="accordion-item"
            :class="{ 'is-logo': item.isLogo }"
          >
            <img :src="item.url" class="accordion-img" />
            <div class="accordion-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </div>
            <div class="accordion-overlay"></div>
          </div>
        </div>
      </div>
    </div>

    <el-collapse-transition>
      <div v-show="showHistory" class="history-section">
        <el-card class="history-card" shadow="never">
          <template #header>
            <div class="card-header-center">
              <el-icon><Timer /></el-icon> <span>校史里程碑 · Time Machine</span>
            </div>
          </template>
          <div class="timeline-box">
            <div class="timeline-item" v-for="(event, i) in historyEvents" :key="i">
              <div class="year-bubble">{{ event.year }}</div>
              <div class="event-content">
                <h4>{{ event.title }}</h4>
                <p>{{ event.desc }}</p>
              </div>
            </div>
            <div class="timeline-line"></div>
          </div>
        </el-card>
      </div>
    </el-collapse-transition>

    <div class="bottom-grid">
      <el-card class="tech-card hover-lift" shadow="hover">
        <template #header>
          <div class="card-header"><el-icon><Trophy /></el-icon> <span>全栈架构</span></div>
        </template>
        <div class="tech-tags">
          <div class="tag-group">
            <span class="group-label">Front</span>
            <el-tag type="success">Vue 3</el-tag>
            <el-tag type="info">Vite</el-tag>
            <el-tag>Element Plus</el-tag>
          </div>
          <div class="tag-group">
            <span class="group-label">Back</span>
            <el-tag type="success" effect="dark">Spring Boot 3</el-tag>
            <el-tag type="warning">MyBatis-Plus</el-tag>
          </div>
          <div class="tag-group">
            <span class="group-label">Data</span>
            <el-tag type="danger">Redis</el-tag>
            <el-tag type="info">MySQL</el-tag>
            <el-tag color="#fdf6ec" style="color:#e6a23c">Aliyun OSS</el-tag>
          </div>
        </div>
      </el-card>

      <el-card class="highlight-card hover-lift" shadow="hover">
        <template #header>
          <div class="card-header"><el-icon><Star /></el-icon> <span>核心亮点</span></div>
        </template>
        <div class="highlight-list">
          <div class="hl-item" v-for="(hl, i) in highlights" :key="i">
            <div class="hl-icon" :style="{ background: hl.color }">
              <el-icon><component :is="hl.icon" /></el-icon>
            </div>
            <div class="hl-info">
              <div class="hl-title">{{ hl.title }}</div>
              <div class="hl-desc">{{ hl.desc }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<style scoped>
/* 全局字体与容器 */
.school-container {
  padding: 10px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ================= Hero 区域 ================= */
.hero-card {
  background: linear-gradient(135deg, #ffffff 0%, #f2fcf5 100%);
  border: 1px solid #e1f3d8;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}
.hero-inner {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  padding: 10px;
}
.school-logo { width: 88px; margin-right: 24px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
.text-box .main-title {
  font-size: 28px; font-weight: 800; color: #1a5e38; margin: 8px 0; letter-spacing: 1px;
}
.text-box .sub-title { color: #666; font-size: 16px; margin: 0; }
.badges { display: flex; gap: 8px; font-size: 12px; font-weight: bold; }
.badge-pill { padding: 2px 8px; border-radius: 4px; }
.badge-pill.green { background: #e1f3d8; color: #1a5e38; }
.badge-pill.gray { background: #f4f4f5; color: #909399; }
.hero-decoration {
  position: absolute; top: -50px; right: -50px; width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(103,194,58,0.15), transparent 70%);
  border-radius: 50%; z-index: 1;
}

/* ================= 介绍区域 (非对称) ================= */
.intro-section { display: flex; gap: 24px; height: 400px; /* 固定高度给手风琴发挥 */ }
.intro-left { flex: 4; display: flex; flex-direction: column; }
.intro-right { flex: 6; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }

/* 左侧玻璃卡片 */
.glass-card {
  flex: 1; border-radius: 16px; border: none;
  background: rgba(255, 255, 255, 0.9);
  display: flex; flex-direction: column; justify-content: space-between;
}
.motto-box {
  display: flex; align-items: center; gap: 8px;
  font-family: "KaiTi", serif; font-size: 24px; font-weight: bold; color: #1a5e38;
  margin-bottom: 15px;
}
.desc-text { color: #555; line-height: 1.6; margin-bottom: 20px; font-size: 14px; }
.highlight-word { background: #e1f3d8; padding: 0 4px; border-radius: 2px; color: #1a5e38; font-weight: bold; }

/* 3D Stats Grid */
.stats-grid { display: flex; gap: 12px; margin-bottom: 20px; }
.stat-card {
  flex: 1; background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 12px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: default;
}
.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  border-color: var(--accent);
}
.stat-icon-wrapper { color: var(--accent); font-size: 24px; margin-bottom: 5px; }
.stat-data .num { font-size: 18px; font-weight: 800; color: #303133; }
.stat-data .lbl { font-size: 11px; color: #909399; }

/* 底部按钮行 */
.action-row { display: flex; align-items: center; gap: 10px; margin-top: auto; }
.history-tip { font-size: 12px; color: #e6a23c; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

/* ================= 手风琴画廊 (核心创新) ================= */
.accordion-container {
  display: flex; width: 100%; height: 100%; overflow: hidden;
}
.accordion-item {
  position: relative; flex: 1; height: 100%; cursor: pointer;
  transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
}
.accordion-img {
  width: 100%; height: 100%; object-fit: cover;
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  transition: transform 0.6s; filter: brightness(0.9);
}
.accordion-item:hover { flex: 4; /* 悬浮时展开占4份 */ }
.accordion-item:hover .accordion-img { filter: brightness(1.05); transform: translate(-50%, -50%) scale(1.05); }

/* 文字遮罩 */
.accordion-overlay {
  position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 40%);
  opacity: 0; transition: opacity 0.4s;
}
.accordion-content {
  position: absolute; bottom: 20px; left: 20px; color: #fff; z-index: 10;
  opacity: 0; transform: translateY(20px); transition: all 0.4s 0.1s; width: 80%;
}
.accordion-content h3 { font-size: 20px; margin: 0 0 5px 0; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.accordion-content p { font-size: 13px; margin: 0; opacity: 0.9; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }

/* 展开时显示文字 */
.accordion-item:hover .accordion-content { opacity: 1; transform: translateY(0); }
.accordion-item:hover .accordion-overlay { opacity: 1; }
/* Logo特殊处理 */
.is-logo .accordion-img { object-fit: contain; padding: 40px; background: #f9f9f9; }

/* ================= 时光机 (Timeline) ================= */
.history-section { margin-top: -10px; }
.history-card { border-radius: 16px; border: 2px dashed #e6a23c; background: #fffdf5; }
.card-header-center { display: flex; justify-content: center; align-items: center; font-weight: bold; color: #e6a23c; gap: 8px; }
.timeline-box {
  display: flex; justify-content: space-between; align-items: flex-start; position: relative; padding: 20px 10px;
}
.timeline-line {
  position: absolute; top: 35px; left: 20px; right: 20px; height: 2px; background: #e6a23c; z-index: 0; opacity: 0.3;
}
.timeline-item {
  z-index: 1; text-align: center; width: 18%; position: relative;
}
.year-bubble {
  display: inline-block; background: #e6a23c; color: #fff; padding: 4px 12px; border-radius: 12px; font-weight: bold; margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(230, 162, 60, 0.4);
}
.event-content h4 { font-size: 14px; font-weight: bold; color: #303133; margin: 0 0 4px 0; }
.event-content p { font-size: 12px; color: #909399; line-height: 1.4; }

/* ================= 底部网格 (Tech & Highlights) ================= */
.bottom-grid { display: flex; gap: 24px; }
.tech-card, .highlight-card { flex: 1; border-radius: 16px; }
.hover-lift { transition: transform 0.3s; }
.hover-lift:hover { transform: translateY(-3px); }

.tech-tags { display: flex; flex-direction: column; gap: 15px; }
.tag-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.group-label { width: 40px; font-size: 12px; font-weight: bold; color: #909399; text-transform: uppercase; }

.highlight-list { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.hl-item { display: flex; align-items: flex-start; gap: 10px; }
.hl-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.hl-title { font-size: 14px; font-weight: bold; color: #303133; }
.hl-desc { font-size: 12px; color: #999; line-height: 1.3; margin-top: 2px; }

/* 响应式 */
@media (max-width: 900px) {
  .intro-section { flex-direction: column; height: auto; }
  .intro-right { height: 300px; }
  .bottom-grid { flex-direction: column; }
  .timeline-box { flex-direction: column; gap: 20px; }
  .timeline-line { display: none; }
  .timeline-item { width: 100%; text-align: left; display: flex; gap: 15px; }
}
</style>