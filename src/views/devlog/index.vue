<template>
  <div class="devlog-page">
    <div class="log-dashboard">
      <div class="dash-content">
        <h1 class="glitch-text" data-text="SYSTEM EVOLUTION">SYSTEM EVOLUTION</h1>
        <p class="subtitle">Hometown Management System // DevLog v1.0.3</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="icon"><el-icon><Cpu /></el-icon></div>
            <div class="info">
              <div class="label">Current Version</div>
              <div class="value">v1.0.3</div>
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
      <p>DOWNLOADING DATA STREAM...</p>
    </div>

    <div v-else-if="error" class="error-wrapper">
      <el-empty description="SIGNAL LOST">
        <template #extra>
          <p class="error-text">{{ error }}</p>
          <el-button type="primary" class="cyber-btn" @click="initData">RECONNECT</el-button>
        </template>
      </el-empty>
    </div>

    <div v-else class="timeline-area">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in parsedCommits"
          :key="index"
          :timestamp="item.date"
          placement="top"
          :color="item.color"
          :hollow="true"
          size="large"
        >
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
              <p class="commit-desc">{{ item.body || 'System optimization and code maintenance.' }}</p>
            </div>
            
            <div class="card-footer">
              <div class="author">
                <el-avatar :size="24" :src="item.avatar" class="author-avatar" />
                <span class="author-name">{{ item.author }}</span>
              </div>
              <div class="time-ago">{{ item.timeAgo }}</div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>

      <div class="pagination-console">
        <button 
          class="cyber-nav-btn" 
          :disabled="currentPage === 1"
          @click="changePage(-1)"
        >
          <el-icon><ArrowLeftBold /></el-icon> PREV
        </button>

        <div class="page-indicator">
          <span class="pulse-dot"></span>
          PAGE {{ currentPage }}
          <span class="pulse-dot"></span>
        </div>

        <button 
          class="cyber-nav-btn" 
          :disabled="totalCount > 0 && currentPage * pageSize >= totalCount"
          @click="changePage(1)"
        >
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
  ArrowLeftBold, ArrowRightBold
} from '@element-plus/icons-vue'

// ==========================================
// 🔧 配置区域
// ==========================================
const GITHUB_OWNER = 'zhenzhenqin' 
const GITHUB_REPO = 'hometown'     
const BRANCH = 'master' 
// ==========================================

const commitList = ref([])
const totalCount = ref(0) // ⭐ 新增：存储总提交数
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = 15 // 每页显示15条

// --- 核心逻辑 1: 获取提交列表 ---
const fetchCommits = async (page = 1) => {
  loading.value = true
  error.value = ''
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?sha=${BRANCH}&page=${page}&per_page=${pageSize}`
    const { data } = await axios.get(url)
    commitList.value = data

    const mainContainer = document.querySelector('.el-main')
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // 2. 兜底方案：如果找不到容器，才试着滚动窗口
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    console.error('API Error:', err)
    error.value = 'Connection Interrupted. Retrying...'
  } finally {
    loading.value = false
  }
}

// --- 核心逻辑 2: 获取总提交数 (黑科技) ---
// GitHub API 没有直接返回 total count，我们需要请求 page=1&per_page=1 
// 然后解析 Header 里的 Link 属性来获取最后一页的页码
const fetchTotalCount = async () => {
  try {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?sha=${BRANCH}&per_page=1`
    const res = await axios.get(url)
    
    // 解析 Link Header: <...&page=54>; rel="last"
    const linkHeader = res.headers['link']
    if (linkHeader) {
      const match = linkHeader.match(/&page=(\d+)>; rel="last"/)
      if (match) {
        totalCount.value = parseInt(match[1])
      }
    } else {
      // 如果没有 Link Header，说明只有 1 页，且 per_page=1，说明总数可能就 1 条（或者 API 变了）
      // 这种情况下，我们暂且认为就是 commitList.length (虽然这个逻辑在并发时可能不准，但对于小仓库够用了)
      if (commitList.value.length > 0 && totalCount.value === 0) {
         // 兜底逻辑：如果没解析出来，暂时显示“1+”或者当前页数量
         totalCount.value = commitList.value.length
      }
    }
  } catch (e) {
    console.warn('Failed to fetch total count', e)
  }
}

// 初始化
const initData = () => {
  fetchCommits(1)
  fetchTotalCount()
}

const changePage = (step) => {
  const newPage = currentPage.value + step
  if (newPage < 1) return
  currentPage.value = newPage
  fetchCommits(newPage)
}

// ⏳ 时间格式化
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

// 🧠 智能样式解析
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
      date: new Date(item.commit.author.date).toLocaleString(),
      timeAgo: timeAgo(item.commit.author.date),
      subject, body, type, color, icon
    }
  })
})

const lastUpdate = computed(() => {
  if (parsedCommits.value.length > 0) {
    return parsedCommits.value[0].date.split(' ')[0]
  }
  return 'N/A'
})

onMounted(() => {
  initData()
})
</script>

<style scoped>
/* --- 基础设定 --- */
.devlog-page {
  padding: 0;
  background-color: #0a0e17;
  min-height: 100vh;
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  color: #e0e6ed;
  overflow-x: hidden;
}

/* --- 头部仪表盘 --- */
.log-dashboard {
  background: radial-gradient(circle at 50% -20%, #1a2a3a 0%, #0a0e17 80%);
  padding: 60px 20px;
  position: relative;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}
.glitch-text {
  font-size: 3rem; font-weight: 900; letter-spacing: 4px; margin: 0; color: #fff;
  text-shadow: 2px 2px 0px #ff0055, -2px -2px 0px #00d2ff;
  font-family: 'Courier New', monospace;
  text-align: center;
}
.subtitle { color: #00d2ff; font-family: monospace; margin-top: 10px; opacity: 0.8; letter-spacing: 1px; text-align: center;}
.grid-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: linear-gradient(rgba(0, 210, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px; z-index: 0; pointer-events: none;
}
.dash-content { position: relative; z-index: 2; }

/* --- 统计卡片 --- */
.stats-grid { display: flex; justify-content: center; gap: 30px; margin-top: 50px; flex-wrap: wrap; }
.stat-card {
  background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); padding: 20px 30px;
  border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; align-items: center; gap: 20px; min-width: 220px; transition: all 0.3s;
}
.stat-card:hover { transform: translateY(-5px); border-color: #00d2ff; box-shadow: 0 0 30px rgba(0, 210, 255, 0.2); }
.stat-card .icon { font-size: 32px; color: #00d2ff; }
.stat-card .value { font-size: 24px; font-weight: bold; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
.stat-card .label { font-size: 12px; color: #8899a6; text-transform: uppercase; letter-spacing: 1px; }

/* --- 时间轴与卡片 --- */
.timeline-area { max-width: 900px; margin: 0 auto; padding: 40px 20px 80px 20px; }
:deep(.el-timeline-item__timestamp) { color: #8899a6 !important; font-family: monospace; }
:deep(.el-timeline-item__tail) { border-left: 2px solid rgba(255,255,255,0.1); }

.log-card {
  background: rgba(20, 25, 35, 0.8); border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px; padding: 25px; position: relative; overflow: hidden; transition: all 0.3s;
  border-left: 4px solid var(--accent-color); 
}
.log-card:hover { transform: translateX(5px); background: rgba(30, 35, 45, 0.9); box-shadow: 0 0 30px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.1); }
.log-card::after {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
  transform: translateX(-100%); transition: 0.5s;
}
.log-card:hover::after { transform: translateX(100%); }

.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.type-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 800; border: 1px solid; letter-spacing: 1px; }
.commit-hash { font-family: 'Consolas', monospace; color: #556677; text-decoration: none; font-size: 13px; transition: color 0.3s; display: flex; align-items: center; gap: 5px;}
.commit-hash:hover { color: #00d2ff; }
.commit-title { color: #fff; font-size: 1.2rem; margin: 0 0 10px 0; line-height: 1.4; font-weight: 600; }
.commit-body-box { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 4px; margin-bottom: 15px; border-left: 2px solid rgba(255,255,255,0.1); }
.commit-desc { color: #aabccd; font-size: 14px; margin: 0; line-height: 1.6; }
.card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #556677; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; }
.author { display: flex; align-items: center; gap: 8px; }
.author-name { color: #8899a6; font-weight: bold; }

/* --- ⚡️ 分页控制台样式 --- */
.pagination-console {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 40px; padding: 20px;
  background: rgba(0,0,0,0.3); border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px; backdrop-filter: blur(5px);
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.cyber-nav-btn {
  background: transparent; border: 1px solid #00d2ff; color: #00d2ff;
  padding: 10px 20px; font-family: 'Rajdhani', sans-serif; font-weight: bold; font-size: 14px;
  cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px;
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}
.cyber-nav-btn:hover:not(:disabled) {
  background: #00d2ff; color: #000; box-shadow: 0 0 15px #00d2ff;
}
.cyber-nav-btn:disabled {
  border-color: #334455; color: #334455; cursor: not-allowed; opacity: 0.6;
}

.page-indicator {
  font-family: 'Courier New', monospace; font-size: 16px; color: #fff;
  display: flex; align-items: center; gap: 10px;
}
.pulse-dot {
  width: 8px; height: 8px; background-color: #00ff9d; border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } 100% { opacity: 0.5; transform: scale(1); } }

/* Loading & Error */
.loading-wrapper { text-align: center; padding: 100px; color: #00d2ff; font-family: monospace; letter-spacing: 2px;}
.cyber-spinner { width: 40px; height: 40px; border: 2px solid #00d2ff; border-top: 2px solid transparent; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; box-shadow: 0 0 15px #00d2ff; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .stats-grid { flex-direction: column; align-items: center; }
  .pagination-console { flex-direction: column; gap: 20px; }
  .cyber-nav-btn { width: 100%; justify-content: center; }
}
</style>