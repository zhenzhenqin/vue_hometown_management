<template>
  <div class="dashboard-container" v-loading="loading" element-loading-background="rgba(242, 243, 245, 0.7)">
    
    <div class="dashboard-header">
      <div class="header-left">
        <h2 class="animate-title">👋 欢迎回来，数据监控中心</h2>
        <p class="subtitle">实时洞察网站流量趋势与用户粘性</p>
      </div>
      <div class="header-right">
        <el-button type="primary" circle class="refresh-btn" @click="fetchData">
          <el-icon :class="{ 'is-loading': loading }"><Refresh /></el-icon>
        </el-button>
        <span class="update-time">最后更新: {{ lastUpdateTime }}</span>
      </div>
    </div>

    <el-row :gutter="24" class="card-row">
      <el-col :xs="24" :sm="8">
        <div class="stat-card pv-card">
          <div class="card-icon">
            <el-icon><View /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-label">今日浏览量 (PV)</div>
            <div class="card-num">
              <span class="counter">{{ todayPV }}</span>
              <span class="live-tag"><span class="dot"></span>Live</span>
            </div>
            <div class="card-footer">
              较昨日 <span :class="getPctClass(pvGrowth)">{{ pvGrowth > 0 ? '+' : '' }}{{ pvGrowth }}%</span>
            </div>
          </div>
          <div class="card-bg-shape"></div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <div class="stat-card uv-card">
          <div class="card-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-label">今日访客数 (UV)</div>
            <div class="card-num">
              <span class="counter">{{ todayUV }}</span>
            </div>
            <div class="card-footer">
              较昨日 <span :class="getPctClass(uvGrowth)">{{ uvGrowth > 0 ? '+' : '' }}{{ uvGrowth }}%</span>
            </div>
          </div>
          <div class="card-bg-shape"></div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="8">
        <div class="stat-card depth-card">
          <div class="card-icon">
            <el-icon><Magnet /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-label">人均访问页数</div>
            <div class="card-num">
              <span class="counter">{{ avgDepth }}</span>
              <span class="unit">页/人</span>
            </div>
            <div class="card-footer">
              用户粘性评级: <span class="rating">{{ getRating(avgDepth) }}</span>
            </div>
          </div>
          <div class="card-bg-shape"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="chart-header">
              <div class="title-box">
                <el-icon><TrendCharts /></el-icon>
                <span>流量趋势分析 (近7天)</span>
              </div>
              <el-radio-group v-model="chartType" size="small" @change="updateChart">
                <el-radio-button label="trend">混合趋势</el-radio-button>
                <el-radio-button label="stack">堆叠分析</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="mainChartRef" class="echarts-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="info-row">
      <el-col :span="12">
        <div class="info-box">
          <h3>💡 运营小贴士</h3>
          <p>PV/UV 比值大于 3.0 说明内容吸引力较强，当前比值为 {{ avgDepth }}。</p>
        </div>
      </el-col>
      <el-col :span="12">
         <div class="info-box system-info">
          <h3>🛡️ 数据来源</h3>
          <p>基于 Redis HyperLogLog / Set 实时计算，MySQL 定时归档。</p>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Refresh, View, User, Magnet, TrendCharts } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { getVisitStats } from '@/api/report'
import { ElMessage } from 'element-plus'

// --- 状态定义 ---
const loading = ref(true)
const lastUpdateTime = ref('')
const chartType = ref('trend')
const mainChartRef = ref(null)
let myChart = null

// 核心数据
const todayPV = ref(0)
const todayUV = ref(0)
const pvGrowth = ref(0) // 较昨日增长率
const uvGrowth = ref(0)
const avgDepth = ref(0) // PV / UV

// 完整数据源
const rawData = ref({
  dateList: [],
  pvList: [],
  uvList: []
})

// --- 初始化与数据获取 ---
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getVisitStats()
    if (res.code === 1) {
      const data = res.data
      rawData.value = data
      
      // 1. 计算今日核心指标 (取数组最后一个元素)
      const len = data.pvList.length
      if (len > 0) {
        todayPV.value = data.pvList[len - 1]
        todayUV.value = data.uvList[len - 1]
        
        // 计算粘性
        avgDepth.value = todayUV.value > 0 ? (todayPV.value / todayUV.value).toFixed(1) : '0.0'

        // 计算增长率 (如果有前一天数据)
        if (len >= 2) {
          const yesterdayPV = data.pvList[len - 2]
          const yesterdayUV = data.uvList[len - 2]
          pvGrowth.value = calculateGrowth(todayPV.value, yesterdayPV)
          uvGrowth.value = calculateGrowth(todayUV.value, yesterdayUV)
        }
      }

      lastUpdateTime.value = new Date().toLocaleTimeString()
      initChart()
    }
  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const calculateGrowth = (now, prev) => {
  if (prev === 0) return 100 // 避免除以0
  return Math.round(((now - prev) / prev) * 100)
}

const getPctClass = (val) => {
  return val >= 0 ? 'text-up' : 'text-down'
}

const getRating = (val) => {
  if (val > 5) return '🔥 极高'
  if (val > 3) return '🌟 优秀'
  if (val > 1.5) return '🙂 良好'
  return '💤 需优化'
}

// --- ECharts 图表配置 --- 
const initChart = () => {
  if (myChart) myChart.dispose()
  
  myChart = echarts.init(mainChartRef.value)
  
  const isStack = chartType.value === 'stack'
  
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#eee',
      textStyle: { color: '#333' },
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#1a5e38' }
      }
    },
    legend: {
      data: ['浏览量 (PV)', '访客数 (UV)'],
      bottom: 0,
      icon: 'circle'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: rawData.value.dateList,
      axisLine: { lineStyle: { color: '#ccc' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
    },
    series: [
      {
        name: '浏览量 (PV)',
        type: 'line',
        smooth: true,
        stack: isStack ? 'Total' : null,
        showSymbol: false,
        lineStyle: { width: 4, color: '#1a5e38' }, // 衢州绿
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1a5e38' },
            { offset: 1, color: 'rgba(26, 94, 56, 0.01)' }
          ])
        },
        data: rawData.value.pvList
      },
      {
        name: '访客数 (UV)',
        type: 'line',
        smooth: true,
        stack: isStack ? 'Total' : null,
        showSymbol: false,
        lineStyle: { width: 4, color: '#3aad6e' }, // 浅一点的绿
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3aad6e' },
            { offset: 1, color: 'rgba(58, 173, 110, 0.01)' }
          ])
        },
        data: rawData.value.uvList
      }
    ]
  }

  myChart.setOption(option)
}

// 切换图表类型
const updateChart = () => {
  initChart()
}

// 响应式
const handleResize = () => {
  myChart && myChart.resize()
}

onMounted(() => {
  fetchData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (myChart) myChart.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding: 0;
  min-height: 100%;
}

/* --- 头部区域 --- */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}
.header-left h2 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-weight: 700;
  background: linear-gradient(120deg, #1a5e38, #3aad6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subtitle {
  color: #9ca3af;
  font-size: 13px;
  margin: 0;
}
.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}
.update-time {
  font-size: 12px;
  color: #d1d5db;
}

/* --- 卡片区域 --- */
.card-row {
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -10px rgba(26, 94, 56, 0.15);
  border-color: #1a5e38;
}

/* 卡片类型配色 */
.pv-card .card-icon { background: rgba(26, 94, 56, 0.1); color: #1a5e38; }
.uv-card .card-icon { background: rgba(64, 158, 255, 0.1); color: #409eff; }
.depth-card .card-icon { background: rgba(230, 162, 60, 0.1); color: #e6a23c; }

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: absolute;
  top: 24px;
  right: 24px;
}

.card-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.card-num {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.counter {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: -1px;
}

.unit {
  font-size: 14px;
  color: #9ca3af;
  font-weight: normal;
}

.card-footer {
  font-size: 13px;
  color: #9ca3af;
  margin-top: auto;
}

.text-up { color: #f56c6c; font-weight: 600; } /* 增长一般用红 */
.text-down { color: #67c23a; font-weight: 600; }

.rating { color: #e6a23c; font-weight: bold; }

/* 装饰背景图形 */
.card-bg-shape {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.03;
  right: -20px;
  bottom: -20px;
  pointer-events: none;
}
.pv-card { color: #1a5e38; }
.uv-card { color: #409eff; }

/* 呼吸灯效果 */
.live-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}
.dot {
  width: 6px;
  height: 6px;
  background-color: #f56c6c;
  border-radius: 50%;
  margin-right: 4px;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(245, 108, 108, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0); }
}

/* --- 图表区域 --- */
.chart-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #374151;
}
.echarts-box {
  height: 400px;
  width: 100%;
}

/* --- 底部信息 --- */
.info-row {
  margin-top: 24px;
}
.info-box {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  border: 1px dashed #e5e7eb;
}
.info-box h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #4b5563;
}
.info-box p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

/* Element UI 覆写 */
:deep(.el-card__header) {
  border-bottom: 1px solid #f3f4f6;
  padding: 15px 24px;
}
:deep(.el-radio-button__inner) {
  border-radius: 0;
  background: #f3f4f6;
  border: none;
  color: #666;
}
:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 6px 0 0 6px;
}
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 6px 6px 0;
}
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #1a5e38;
  color: #fff;
  box-shadow: none;
}
</style>