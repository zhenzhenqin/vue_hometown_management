<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="hover" class="metric-card">
          <template #header>
            <div class="card-header">
              <span>用户总数</span>
              <el-tag type="success">User</el-tag>
            </div>
          </template>
          <div class="card-num">{{ dashboardData.userCount || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="hover" class="metric-card">
          <template #header>
            <div class="card-header">
              <span>景点总数</span>
              <el-tag type="primary">View</el-tag>
            </div>
          </template>
          <div class="card-num">{{ dashboardData.attractionCount || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="hover" class="metric-card">
          <template #header>
            <div class="card-header">
              <span>特产总数</span>
              <el-tag type="warning">Food</el-tag>
            </div>
          </template>
          <div class="card-num">{{ dashboardData.specialtyCount || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card shadow="hover" class="metric-card">
          <template #header>
            <div class="card-header">
              <span>总点赞热度</span>
              <el-tag type="danger">Hot</el-tag>
            </div>
          </template>
          <div class="card-num">{{ dashboardData.totalLikes || 0 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <span>用户注册趋势 (近7天)</span>
          </template>
          <div ref="trendChartRef" style="height: 350px;"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>用户状态分布</span>
          </template>
          <div ref="statusChartRef" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>景点人气 Top榜</span>
          </template>
          <div ref="popularChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>特产价格区间分布</span>
          </template>
          <div ref="priceChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
// 引入上面定义的 API
import { 
  getDashboardMetrics, 
  getUserGrowthTrend, 
  getUserStatusDistribution, 
  getAttractionPopular, 
  getSpecialtyPriceDistribution 
} from '@/api/report'

// --- 数据状态 ---
const dashboardData = ref({})

// --- DOM 引用 ---
const trendChartRef = ref(null)
const statusChartRef = ref(null)
const popularChartRef = ref(null)
const priceChartRef = ref(null)

// --- 加载数据 ---
onMounted(async () => {
  await loadDashboardMetrics()
  initTrendChart()
  initStatusChart()
  initPopularChart()
  initPriceChart()
})

// 1. 加载核心指标
const loadDashboardMetrics = async () => {
  try {
    const res = await getDashboardMetrics()
    if (res.code === 1) {
      dashboardData.value = res.data
    }
  } catch (error) {
    console.error("加载面板数据失败", error)
  }
}

// 2. 初始化用户趋势折线图
const initTrendChart = async () => {
  const chart = echarts.init(trendChartRef.value)
  const res = await getUserGrowthTrend()
  if (res.code === 1) {
    const xData = res.data.map(item => item.name) // 日期
    const yData = res.data.map(item => item.value) // 数量
    
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: xData },
      yAxis: { type: 'value' },
      series: [{
        name: '新增用户',
        type: 'line',
        data: yData,
        smooth: true,
        areaStyle: { color: 'rgba(64, 158, 255, 0.2)' },
        itemStyle: { color: '#409EFF' }
      }]
    })
  }
}

// 3. 初始化用户状态饼图
const initStatusChart = async () => {
  const chart = echarts.init(statusChartRef.value)
  const res = await getUserStatusDistribution()
  if (res.code === 1) {
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%' },
      series: [{
        name: '用户状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        data: res.data // 格式 [{name: '正常', value: 99}, ...]
      }]
    })
  }
}

// 4. 初始化景点人气柱状图
const initPopularChart = async () => {
  const chart = echarts.init(popularChartRef.value)
  const res = await getAttractionPopular()
  if (res.code === 1) {
    // 数据倒序，让最多的显示在上面（如果是横向条形图）
    // 或者保持原样显示在左边（如果是纵向柱状图）
    const xData = res.data.map(item => item.name)
    const yData = res.data.map(item => item.value)
    
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: xData, axisLabel: { interval: 0, rotate: 30 } }, // 名字太长斜着放
      yAxis: { type: 'value' },
      series: [{
        name: '点赞数',
        type: 'bar',
        barWidth: '60%',
        data: yData,
        itemStyle: { color: '#67C23A' } // 绿色系
      }]
    })
  }
}

// 5. 初始化特产价格分布
const initPriceChart = async () => {
  const chart = echarts.init(priceChartRef.value)
  const res = await getSpecialtyPriceDistribution()
  if (res.code === 1) {
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        name: '价格区间',
        type: 'pie',
        radius: '50%',
        data: res.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })
  }
}

// 窗口大小改变时重绘图表
window.addEventListener('resize', () => {
  echarts.getInstanceByDom(trendChartRef.value)?.resize()
  echarts.getInstanceByDom(statusChartRef.value)?.resize()
  echarts.getInstanceByDom(popularChartRef.value)?.resize()
  echarts.getInstanceByDom(priceChartRef.value)?.resize()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 80px);
}

.metric-card {
  cursor: pointer;
  transition: all 0.3s;
}
.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-num {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-top: 10px;
  text-align: center;
}
</style>