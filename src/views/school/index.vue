<script setup>
import { ref, onMounted } from 'vue'
import { 
  Link, Trophy, School, Star, 
  Monitor, DataLine, Files, Connection, Odometer,
  Lightning, Cloudy, Lock, Document,
  Location, Reading, Medal, Timer, ArrowDown, ArrowUp
} from '@element-plus/icons-vue'

// 1. 手风琴画廊数据 (校园风光)
// 💡 提示：确保 public/image/ 下有这些图片，否则会裂图
const sceneryList = ref([
  { id: 1, url: '/image/yifu.png', title: '逸夫图书馆', desc: '知识殿堂 · 思想高地' },
  { id: 2, url: '/image/qiming.jpg', title: '启明广场', desc: '晨读圣地 · 活力源泉' },
  { id: 3, url: '/image/riyuehu.jpg', title: '日月湖', desc: '湖光潋滟 · 岁月静好' },
  // 替换了 Logo，改用一张更有氛围的图，或者保持 Logo 但加个背景样式
  { id: 4, url: '/image/logo.png', title: '校训石', desc: '精思国计 · 细量民生', isLogo: true } 
])

// 2. 核心数据 (配色微调，更符合教育气质)
const schoolStats = ref([
  { value: 'Top 1%', label: 'ESI全球学科排名', icon: Trophy, color: '#f56c6c' }, // 红
  { value: '15+', label: '一级学科硕士点', icon: Star, color: '#e6a23c' },   // 橙
  { value: '4', label: '顶尖优势学科', icon: Medal, color: '#409eff' },     // 蓝
])

// 3. 亮点数据 (技术栈亮点)
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

// 简单的入场动画控制
const isMounted = ref(false)
onMounted(() => {
  setTimeout(() => { isMounted.value = true }, 100)
})
</script>

<template>
  <div class="school-container" :class="{ 'fade-in': isMounted }">
    
    <div class="hero-wrapper">
      <el-card class="hero-card" shadow="never">
        <div class="hero-inner">
          <div class="logo-box">
            <img src="/image/logo.png" alt="CJLU" class="school-logo hover-pulse" />
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
        <div class="hero-decoration-2"></div>
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
            <img :src="item.url" class="accordion-img" loading="lazy" />
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
            <div class="timeline-line"></div>
            <div class="timeline-item" v-for="(event, i) in historyEvents" :key="i">
              <div class="year-bubble">{{ event.year }}</div>
              <div class="event-point"></div>
              <div class="event-content">
                <h4>{{ event.title }}</h4>
                <p>{{ event.desc }}</p>
              </div>
            </div>
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
            <el-tag type="success" effect="light">Vue 3</el-tag>
            <el-tag type="info" effect="plain">Vite</el-tag>
            <el-tag effect="plain">Element Plus</el-tag>
          </div>
          <div class="tag-group">
            <span class="group-label">Back</span>
            <el-tag type="success" effect="dark">Spring Boot</el-tag>
            <el-tag type="warning" effect="plain">MyBatis-Plus</el-tag>
          </div>
          <div class="tag-group">
            <span class="group-label">Data</span>
            <el-tag type="danger" effect="light">Redis</el-tag>
            <el-tag type="info" effect="light">MySQL</el-tag>
            <el-tag color="#fdf6ec" style="color:#e6a23c; border:none;">Aliyun OSS</el-tag>
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
/* 动画：入场淡入 */
.school-container {
  opacity: 0; transform: translateY(20px); transition: all 0.8s ease-out;
}
.school-container.fade-in { opacity: 1; transform: translateY(0); }

/* 全局布局 */
.school-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ================= Hero 区域 ================= */
.hero-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); /* 更清新的绿色渐变 */
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
  padding: 15px;
}
.school-logo { 
  width: 80px; margin-right: 24px; 
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); 
  transition: transform 0.3s;
}
.hover-pulse:hover { transform: scale(1.05); }

.text-box .main-title {
  font-size: 32px; font-weight: 800; color: #1a5e38; margin: 8px 0; letter-spacing: 1px;
  background: linear-gradient(to right, #1a5e38, #409eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.text-box .sub-title { color: #666; font-size: 16px; margin: 0; font-weight: 500;}
.badges { display: flex; gap: 8px; font-size: 12px; font-weight: bold; }
.badge-pill { padding: 2px 8px; border-radius: 4px; }
.badge-pill.green { background: #e1f3d8; color: #1a5e38; }
.badge-pill.gray { background: #f4f4f5; color: #909399; }

/* 动态背景装饰 */
.hero-decoration {
  position: absolute; top: -60px; right: -60px; width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(103,194,58,0.15), transparent 70%);
  border-radius: 50%; z-index: 1;
  animation: float 6s ease-in-out infinite;
}
.hero-decoration-2 {
  position: absolute; bottom: -40px; right: 120px; width: 120px; height: 120px;
  background: radial-gradient(circle, rgba(64,158,255,0.1), transparent 70%);
  border-radius: 50%; z-index: 1;
  animation: float 8s ease-in-out infinite reverse;
}
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* ================= 介绍区域 ================= */
.intro-section { display: flex; gap: 24px; height: 420px; }
.intro-left { flex: 4; display: flex; flex-direction: column; }
.intro-right { flex: 6; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }

/* 左侧卡片 */
.glass-card {
  flex: 1; border-radius: 16px; border: 1px solid #f0f0f0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex; flex-direction: column; justify-content: space-between;
}
.motto-box {
  display: flex; align-items: center; gap: 10px;
  font-family: "KaiTi", "STKaiti", serif; font-size: 26px; font-weight: bold; color: #1a5e38;
  margin-bottom: 20px;
}
.desc-text { color: #555; line-height: 1.8; margin-bottom: 25px; font-size: 15px; }
.highlight-word { background: #e1f3d8; padding: 2px 6px; border-radius: 4px; color: #1a5e38; font-weight: bold; }

/* 数据卡片 */
.stats-grid { display: flex; gap: 15px; margin-bottom: 20px; }
.stat-card {
  flex: 1; background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 15px 10px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  transition: all 0.3s; cursor: default;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  border-color: var(--accent);
}
.stat-icon-wrapper { color: var(--accent); font-size: 28px; margin-bottom: 8px; }
.stat-data .num { font-size: 20px; font-weight: 800; color: #303133; font-family: Arial, sans-serif; }
.stat-data .lbl { font-size: 12px; color: #909399; margin-top: 2px; }

/* 底部按钮 */
.action-row { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.history-tip { font-size: 13px; color: #e6a23c; animation: pulse 1.5s infinite; font-weight: 500; }
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

/* ================= 手风琴画廊 ================= */
.accordion-container { display: flex; width: 100%; height: 100%; overflow: hidden; background: #000; }
.accordion-item {
  position: relative; flex: 1; height: 100%; cursor: pointer;
  transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden; border-right: 1px solid rgba(255,255,255,0.2);
}
.accordion-item:last-child { border-right: none; }
.accordion-img {
  width: 100%; height: 100%; object-fit: cover;
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  transition: transform 0.6s; filter: brightness(0.8);
}
.accordion-item:hover { flex: 4; }
.accordion-item:hover .accordion-img { filter: brightness(1.05); transform: translate(-50%, -50%) scale(1.05); }

/* 文字遮罩 */
.accordion-overlay {
  position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%);
  opacity: 0; transition: opacity 0.4s;
}
.accordion-content {
  position: absolute; bottom: 30px; left: 20px; color: #fff; z-index: 10;
  opacity: 0; transform: translateY(20px); transition: all 0.4s 0.1s; width: 85%;
}
.accordion-content h3 { font-size: 22px; margin: 0 0 8px 0; font-weight: bold; letter-spacing: 1px; }
.accordion-content p { font-size: 14px; margin: 0; opacity: 0.9; line-height: 1.4; }

.accordion-item:hover .accordion-content { opacity: 1; transform: translateY(0); }
.accordion-item:hover .accordion-overlay { opacity: 1; }

.is-logo .accordion-img { object-fit: contain; padding: 60px; background: #fff; filter: none; }
.is-logo:hover .accordion-img { filter: none; transform: translate(-50%, -50%) scale(1.1); }
.is-logo .accordion-overlay { background: linear-gradient(to top, rgba(26,94,56,0.9), transparent 50%); }

/* ================= 时光机 ================= */
.history-section { margin-top: -10px; }
.history-card { border-radius: 16px; border: 2px dashed #e6a23c; background: #fffdf5; }
.card-header-center { display: flex; justify-content: center; align-items: center; font-weight: bold; color: #e6a23c; gap: 8px; font-size: 16px; }
.timeline-box {
  display: flex; justify-content: space-between; align-items: flex-start; position: relative; padding: 30px 20px 10px;
}
.timeline-line {
  position: absolute; top: 48px; left: 40px; right: 40px; height: 2px; background: #e6a23c; z-index: 0; opacity: 0.3;
}
.timeline-item {
  z-index: 1; text-align: center; width: 18%; position: relative; display: flex; flex-direction: column; align-items: center;
}
.year-bubble {
  background: #e6a23c; color: #fff; padding: 4px 14px; border-radius: 20px; font-weight: bold; font-size: 14px;
  box-shadow: 0 4px 10px rgba(230, 162, 60, 0.4); margin-bottom: 10px;
}
.event-point { width: 12px; height: 12px; background: #fff; border: 3px solid #e6a23c; border-radius: 50%; margin-bottom: 15px; }
.event-content h4 { font-size: 15px; font-weight: bold; color: #303133; margin: 0 0 6px 0; }
.event-content p { font-size: 13px; color: #606266; line-height: 1.5; text-align: left; background: rgba(255,255,255,0.5); padding: 5px; border-radius: 4px;}

/* ================= 底部网格 ================= */
.bottom-grid { display: flex; gap: 24px; }
.tech-card, .highlight-card { flex: 1; border-radius: 16px; border: 1px solid #eee; }
.card-header { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 16px; color: #333; }
.hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
.hover-lift:hover { transform: translateY(-5px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

.tech-tags { display: flex; flex-direction: column; gap: 18px; padding: 10px 0; }
.tag-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.group-label { width: 50px; font-size: 13px; font-weight: 800; color: #909399; text-transform: uppercase; letter-spacing: 0.5px; }

.highlight-list { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 5px 0; }
.hl-item { display: flex; align-items: flex-start; gap: 12px; }
.hl-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.hl-title { font-size: 15px; font-weight: bold; color: #303133; margin-bottom: 2px; }
.hl-desc { font-size: 12px; color: #999; line-height: 1.4; }

/* 响应式适配 */
@media (max-width: 900px) {
  .intro-section { flex-direction: column; height: auto; }
  .intro-right { height: 350px; }
  .bottom-grid { flex-direction: column; }
  .timeline-box { flex-direction: column; gap: 30px; padding-left: 20px; }
  .timeline-line { display: none; } /* 移动端隐藏横线 */
  .timeline-item { width: 100%; text-align: left; flex-direction: row; gap: 15px; align-items: flex-start; }
  .year-bubble { margin-bottom: 0; width: 60px; text-align: center; flex-shrink: 0; }
  .event-point { display: none; }
  .event-content { padding-top: 2px; border-left: 2px solid #e6a23c; padding-left: 15px; }
}
</style>