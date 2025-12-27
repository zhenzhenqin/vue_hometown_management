<template>
  <div class="devlog-page">
    <div class="log-dashboard">
      <div class="dash-content">
        <div class="dash-header">
          <div class="title-section">
            <h1 class="glitch-text" :data-text="currentProject.name">{{ currentProject.name }}</h1>
            <p class="subtitle">System Module // {{ currentProject.repo }} // Branch: {{ currentProject.branch }}</p>
          </div>
          
          <a :href="`https://github.com/${currentProject.owner}/${currentProject.repo}`" target="_blank" class="repo-link-btn">
            <el-icon><Link /></el-icon> SOURCE CODE
            <div class="btn-glitch"></div>
          </a>
        </div>

        <div class="system-switcher">
          <div 
            v-for="proj in projects" 
            :key="proj.id"
            class="switch-btn"
            :class="{ active: currentProject.id === proj.id }"
            @click="switchProject(proj)"
          >
            <el-icon><component :is="proj.icon" /></el-icon>
            <span>{{ proj.label }}</span>
            <div class="active-bar"></div>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="icon"><el-icon><Cpu /></el-icon></div>
            <div class="info">
              <div class="label">System Status</div>
              <div class="value">ONLINE</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="icon"><el-icon><CircleCheck /></el-icon></div>
            <div class="info">
              <div class="label">Total Commits</div>
              <div class="value">{{ totalCount > 0 ? totalCount : 'Calculating...' }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="icon"><el-icon><Timer /></el-icon></div>
            <div class="info">
              <div class="label">Last Update</div>
              <div class="value">{{ lastUpdate }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid-bg"></div>
    </div>

    <div v-if="loading" class="loading-wrapper">
      <div class="cyber-spinner"></div>
      <p>ESTABLISHING LINK TO [ {{ currentProject.repo }} ]...</p>
    </div>

    <div v-else-if="error" class="error-wrapper">
      <el-empty description="SIGNAL LOST">
        <template #extra>
          <p class="error-text">{{ error }}</p>
          <el-button type="primary" class="cyber-btn" @click="initData">RECONNECT</el-button>
        </template>
      </el-empty>
    </div>

    <div v-else class="timeline-container">
      <div class="cyber-timeline">
        <div class="center-line"></div>

        <div 
          v-for="(item, index) in parsedCommits" 
          :key="index" 
          class="timeline-row"
          :class="index % 2 === 0 ? 'row-left' : 'row-right'"
        >
          
          <div class="col-side col-left">
            <template v-if="index % 2 === 0">
              <div class="log-card" :style="{ '--accent-color': item.color }">
                <div class="card-glow"></div>
                <div class="card-head">
                  <div class="type-badge" :style="{ borderColor: item.color, color: item.color, background: item.color + '15' }">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{ item.type.toUpperCase() }}</span>
                  </div>
                  <a :href="item.html_url" target="_blank" class="commit-hash">
                    <span class="hash-symbol">#</span>{{ item.sha.substring(0, 7) }}
                    <el-icon class="link-icon"><Link /></el-icon>
                  </a>
                </div>
                <h3 class="commit-title">{{ item.subject }}</h3>
                <div class="commit-body-box">
                  <p class="commit-desc">{{ item.body || 'System optimization and maintenance.' }}</p>
                </div>
                <div class="card-footer">
                  <div class="author">
                    <el-avatar :size="24" :src="item.avatar" class="author-avatar" />
                    <span class="author-name">{{ item.author }}</span>
                  </div>
                </div>
              </div>
            </template>
            
            <template v-else>
              <div class="date-display text-right">
                <div class="date-main">{{ item.date.split(' ')[0] }}</div>
                <div class="date-sub">{{ item.date.split(' ')[1] }} <span class="time-ago">({{ item.timeAgo }})</span></div>
              </div>
            </template>
          </div>

          <div class="col-center">
            <div class="timeline-dot" :style="{ borderColor: item.color, boxShadow: '0 0 15px ' + item.color }">
              <div class="dot-core" :style="{ backgroundColor: item.color }"></div>
            </div>
          </div>

          <div class="col-side col-right">
            <template v-if="index % 2 === 0">
              <div class="date-display text-left">
                <div class="date-main">{{ item.date.split(' ')[0] }}</div>
                <div class="date-sub">{{ item.date.split(' ')[1] }} <span class="time-ago">({{ item.timeAgo }})</span></div>
              </div>
            </template>

            <template v-else>
              <div class="log-card" :style="{ '--accent-color': item.color }">
                <div class="card-glow"></div>
                <div class="card-head">
                  <div class="type-badge" :style="{ borderColor: item.color, color: item.color, background: item.color + '15' }">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{ item.type.toUpperCase() }}</span>
                  </div>
                  <a :href="item.html_url" target="_blank" class="commit-hash">
                    <span class="hash-symbol">#</span>{{ item.sha.substring(0, 7) }}
                    <el-icon class="link-icon"><Link /></el-icon>
                  </a>
                </div>
                <h3 class="commit-title">{{ item.subject }}</h3>
                <div class="commit-body-box">
                  <p class="commit-desc">{{ item.body || 'System optimization and maintenance.' }}</p>
                </div>
                <div class="card-footer">
                  <div class="author">
                    <el-avatar :size="24" :src="item.avatar" class="author-avatar" />
                    <span class="author-name">{{ item.author }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

        </div>
      </div>

      <div class="pagination-console">
        <button class="cyber-nav-btn" :disabled="currentPage === 1" @click="changePage(-1)">
          <el-icon><ArrowLeftBold /></el-icon> PREV
        </button>
        <div class="page-indicator">
          <span class="pulse-dot"></span> PAGE {{ currentPage }} <span class="pulse-dot"></span>
        </div>
        <button class="cyber-nav-btn" :disabled="totalCount > 0 && currentPage * pageSize >= totalCount" @click="changePage(1)">
          NEXT <el-icon><ArrowRightBold /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { 
  Cpu, CircleCheck, Timer, Plus, Brush, Tools, WarningFilled, Document, Link, MagicStick,
  ArrowLeftBold, ArrowRightBold, Platform, Monitor, Management
} from '@element-plus/icons-vue'

// ==========================================
// 多仓库配置中心
// ==========================================
const projects = [
  {
    id: 'admin',
    label: 'ADMIN DASHBOARD',
    name: 'MANAGEMENT SYSTEM',
    owner: 'zhenzhenqin',
    repo: 'vue_hometown_management', 
    branch: 'master',
    icon: 'Management'
  },
  {
    id: 'backend',
    label: 'CORE SERVER',
    name: 'BACKEND SERVICES',
    owner: 'zhenzhenqin',
    repo: 'hometown', 
    branch: 'master',
    icon: 'Platform'
  },
  {
    id: 'user',
    label: 'USER INTERFACE',
    name: 'VISUAL FRONTEND',
    owner: 'zhenzhenqin',
    repo: 'vue_showHometown', 
    branch: 'master',
    icon: 'Monitor'
  }
]

const currentProject = ref(projects[0])
const commitList = ref([])
const totalCount = ref(0)
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = 15 

// 切换项目逻辑
const switchProject = (project) => {
  if (currentProject.value.id === project.id) return
  currentProject.value = project
  currentPage.value = 1
  totalCount.value = 0
  commitList.value = []
  initData()
}

// 获取提交列表
const fetchCommits = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const { owner, repo, branch } = currentProject.value
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&page=${page}&per_page=${pageSize}`
    const { data } = await axios.get(url)
    commitList.value = data
    
    // 滚动回顶部
    const mainContainer = document.querySelector('.el-main')
    if (mainContainer) mainContainer.scrollTo({ top: 0, behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (err) {
    console.error('API Error:', err)
    error.value = `Failed to connect to ${currentProject.value.repo}. Retrying...`
  } finally {
    loading.value = false
  }
}

// 获取总数
const fetchTotalCount = async () => {
  try {
    const { owner, repo, branch } = currentProject.value
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`
    const res = await axios.get(url)
    const linkHeader = res.headers['link']
    if (linkHeader) {
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
      if (match) totalCount.value = parseInt(match[1])
    } else {
      if (commitList.value.length > 0) totalCount.value = commitList.value.length
    }
  } catch (e) { console.warn('Total count error', e) }
}

const initData = () => {
  fetchCommits(currentPage.value)
  fetchTotalCount()
}

const changePage = (step) => {
  const newPage = currentPage.value + step
  if (newPage < 1) return
  currentPage.value = newPage
  fetchCommits(newPage)
}

const timeAgo = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + "Y ago"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + "M ago"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + "D ago"
  return "Today"
}

const parsedCommits = computed(() => {
  return commitList.value.map(item => {
    const rawMsg = item.commit.message
    const parts = rawMsg.split('\n\n')
    let subject = parts[0]
    const body = parts.slice(1).join('\n').trim()

    let type = 'UPDATE'
    let color = '#00d2ff'
    let icon = Document

    const lowerSubject = subject.toLowerCase()
    if (lowerSubject.match(/feat|init|add|create|new|新增|创建|初始化|完成|实现/)) {
      type = 'FEATURE'; color = '#00ff9d'; icon = Plus
    } else if (lowerSubject.match(/fix|bug|error|issue|repair|修复|解决|报错|问题/)) {
      type = 'BUGFIX'; color = '#ff0055'; icon = WarningFilled
    } else if (lowerSubject.match(/style|ui|css|design|layout|样式|界面|布局|美化|调整/)) {
      type = 'DESIGN'; color = '#ff9900'; icon = Brush
    } else if (lowerSubject.match(/chore|refactor|docs|merge|optimize|clean|优化|重构|文档|整理|集成|配置/)) {
      type = 'SYSTEM'; color = '#bd00ff'; icon = Tools
    } else if (lowerSubject.match(/update|modify|change|修改|更新/)) {
      type = 'UPDATE'; color = '#00d2ff'; icon = MagicStick
    }

    subject = subject.replace(/^(feat|fix|style|chore|refactor|docs|test|merge).*?:\s*/i, '')

    return {
      sha: item.sha,
      html_url: item.html_url,
      author: item.commit.author.name,
      avatar: item.author ? item.author.avatar_url : 'https://api.dicebear.com/7.x/bottts/svg?seed=' + item.sha,
      date: new Date(item.commit.author.date).toLocaleString('zh-CN', { hour12: false }),
      timeAgo: timeAgo(item.commit.author.date),
      subject, body, type, color, icon
    }
  })
})

const lastUpdate = computed(() => {
  if (parsedCommits.value.length > 0) return parsedCommits.value[0].date.split(' ')[0]
  return 'N/A'
})

onMounted(() => {
  initData()
})
</script>

<style scoped>
/* 全局样式 */
.devlog-page { padding: 0; background-color: #0a0e17; min-height: 100vh; font-family: 'Rajdhani', 'Segoe UI', sans-serif; color: #e0e6ed; overflow-x: hidden; }

/* 头部 */
.log-dashboard {
  background: radial-gradient(circle at 50% -20%, #1a2a3a 0%, #0a0e17 80%); padding: 40px 20px 60px 20px;
  position: relative; border-bottom: 1px solid rgba(0, 210, 255, 0.1); box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}
.grid-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(0, 210, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.05) 1px, transparent 1px); background-size: 40px 40px; z-index: 0; pointer-events: none; }
.dash-content { position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; }
.dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
.title-section { text-align: left; }
.glitch-text { font-size: 2.5rem; font-weight: 900; letter-spacing: 2px; margin: 0; color: #fff; text-shadow: 2px 2px 0px #ff0055, -2px -2px 0px #00d2ff; font-family: 'Courier New', monospace; text-transform: uppercase; }
.subtitle { color: #00d2ff; font-family: monospace; margin-top: 5px; opacity: 0.8; letter-spacing: 1px; font-size: 0.9rem; }
.repo-link-btn { display: flex; align-items: center; gap: 8px; background: rgba(0, 255, 157, 0.1); border: 1px solid #00ff9d; color: #00ff9d; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px; transition: all 0.3s; }
.repo-link-btn:hover { background: #00ff9d; color: #000; box-shadow: 0 0 20px #00ff9d; }

/* 切换器 */
.system-switcher { display: flex; justify-content: center; gap: 20px; margin-bottom: 40px; flex-wrap: wrap; }
.switch-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 12px 24px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; color: #8899a6; font-weight: bold; letter-spacing: 1px; transition: all 0.3s; position: relative; overflow: hidden; }
.switch-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.switch-btn.active { background: rgba(0, 210, 255, 0.15); border-color: #00d2ff; color: #fff; box-shadow: 0 0 15px rgba(0, 210, 255, 0.3); }
.active-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: #00d2ff; transform: scaleX(0); transition: transform 0.3s; }
.switch-btn.active .active-bar { transform: scaleX(1); }

/* 统计卡片 */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.stat-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); padding: 15px 25px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; gap: 15px; transition: all 0.3s; }
.stat-card:hover { transform: translateY(-3px); border-color: #00d2ff; box-shadow: 0 0 20px rgba(0, 210, 255, 0.1); }
.stat-card .icon { font-size: 28px; color: #00d2ff; }
.stat-card .value { font-size: 20px; font-weight: bold; color: #fff; margin-top: 4px; }
.stat-card .label { font-size: 11px; color: #8899a6; text-transform: uppercase; letter-spacing: 1px; }

/* ----------------------------------
   ⭐ 核心：中轴时间轴样式 
   ---------------------------------- */
.timeline-container {
  max-width: 1000px; margin: 0 auto; padding: 40px 20px 80px; position: relative;
}
.cyber-timeline { position: relative; }

/* 中心线 */
.center-line {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, transparent, #00d2ff 20%, #00d2ff 80%, transparent);
  transform: translateX(-1px); z-index: 0;
  box-shadow: 0 0 10px #00d2ff;
}

/* 每一行 */
.timeline-row {
  display: flex; align-items: flex-start; margin-bottom: 40px; position: relative; z-index: 1;
}

/* 左右两侧容器 (均分 50%) */
.col-side { width: 50%; box-sizing: border-box; }
.col-left { padding-right: 40px; display: flex; flex-direction: column; align-items: flex-end; }
.col-right { padding-left: 40px; display: flex; flex-direction: column; align-items: flex-start; }

/* 中心节点容器 */
.col-center {
  position: absolute; left: 50%; top: 20px; /* 调整节点垂直位置，使其对齐卡片顶部 */
  transform: translate(-50%, -50%);
}

.timeline-dot {
  width: 16px; height: 16px; border: 2px solid; border-radius: 50%; 
  background: #0a0e17; display: flex; justify-content: center; align-items: center;
  transition: all 0.3s;
}
.dot-core { width: 6px; height: 6px; border-radius: 50%; }

/* 日期显示 */
.date-display { opacity: 0.8; margin-top: 5px; } /* 稍微下移一点对齐卡片 */
.text-right { text-align: right; }
.text-left { text-align: left; }
.date-main { font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: bold; color: #fff; letter-spacing: 1px; }
.date-sub { font-family: 'Rajdhani', sans-serif; font-size: 0.9rem; color: #8899a6; }
.time-ago { color: #00d2ff; font-weight: bold; margin-left: 5px; }

/* 卡片样式 */
.log-card {
  background: rgba(20, 25, 35, 0.8); border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px; padding: 25px; position: relative; overflow: hidden; transition: all 0.3s;
  border-top: 3px solid var(--accent-color); width: 100%;
}
.log-card:hover { transform: translateY(-5px); background: rgba(30, 35, 45, 0.95); box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.2); }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.type-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 800; border: 1px solid; letter-spacing: 1px; }
.commit-hash { font-family: 'Consolas', monospace; color: #556677; text-decoration: none; font-size: 13px; transition: color 0.3s; display: flex; align-items: center; gap: 5px; }
.commit-hash:hover { color: #00d2ff; }
.commit-title { color: #fff; font-size: 1.2rem; margin: 0 0 10px 0; line-height: 1.4; font-weight: 600; }
.commit-body-box { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; margin-bottom: 15px; border-left: 2px solid rgba(255,255,255,0.1); }
.commit-desc { color: #aabccd; font-size: 14px; margin: 0; line-height: 1.6; }
.card-footer { display: flex; justify-content: flex-end; align-items: center; font-size: 12px; color: #556677; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
.author { display: flex; align-items: center; gap: 8px; }
.author-name { color: #8899a6; font-weight: bold; }

/* Loading & Error */
.loading-wrapper { text-align: center; padding: 100px; color: #00d2ff; font-family: monospace; letter-spacing: 2px; }
.cyber-spinner { width: 40px; height: 40px; border: 2px solid #00d2ff; border-top: 2px solid transparent; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; box-shadow: 0 0 15px #00d2ff; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* 分页 */
.pagination-console { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding: 20px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: 8px; backdrop-filter: blur(5px); box-shadow: 0 0 20px rgba(0,0,0,0.2); max-width: 1000px; margin: 40px auto 0; }
.cyber-nav-btn { background: transparent; border: 1px solid #00d2ff; color: #00d2ff; padding: 10px 20px; font-family: 'Rajdhani', sans-serif; font-weight: bold; font-size: 14px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%); }
.cyber-nav-btn:hover:not(:disabled) { background: #00d2ff; color: #000; box-shadow: 0 0 15px #00d2ff; }
.cyber-nav-btn:disabled { border-color: #334455; color: #334455; cursor: not-allowed; opacity: 0.6; }
.page-indicator { font-family: 'Courier New', monospace; font-size: 16px; color: #fff; display: flex; align-items: center; gap: 10px; }
.pulse-dot { width: 8px; height: 8px; background-color: #00ff9d; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } 100% { opacity: 0.5; transform: scale(1); } }

/* 📱 响应式适配：移动端回退到单列模式 */
@media (max-width: 768px) {
  .dash-header { flex-direction: column; gap: 20px; }
  .stats-grid { grid-template-columns: 1fr; }
  .center-line { left: 20px; } /* 线移到左侧 */
  .timeline-row { flex-direction: column; margin-left: 20px; margin-bottom: 30px; }
  .col-side { width: 100%; }
  .col-left { order: 2; padding-left: 30px; padding-right: 0; align-items: flex-start; } /* 强制左对齐 */
  .col-right { order: 2; padding-left: 30px; }
  .col-center { left: 0; top: 25px; transform: translate(-50%, 0); } /* 点移到线上 */
  
  /* 移动端不分左右，统一样式 */
  .date-display { text-align: left !important; margin-bottom: 10px; padding-left: 30px; order: 1; width: 100%;}
  .log-card { width: 100%; }
}
</style>