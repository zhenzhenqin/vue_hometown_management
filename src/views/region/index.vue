<template>
  <div class="map-wrapper">
    <div class="map-header">
      <div class="title-decor-left"></div>
      <div class="main-title">全国用户分布态势图</div>
      <div class="title-decor-right"></div>
    </div>
    
    <div ref="chartRef" class="chart-box"></div>

    <div class="special-panel" v-if="specialList.length > 0">
      <div class="panel-title">特殊/未分类区域</div>
      <div class="panel-list">
        <div class="panel-item" v-for="(item, index) in specialList" :key="index">
          <span class="item-name">{{ item.name }}</span>
          <div class="item-bar-box">
             <div class="item-bar" :style="{ width: getBarWidth(item.value) + '%' }"></div>
          </div>
          <span class="item-value">{{ item.value }}人</span>
        </div>
      </div>
    </div>

    <div class="stats-panel">
      <div class="stat-item">
        <span class="label">总用户数</span>
        <span class="num">{{ totalUsers }}</span>
      </div>
      <div class="stat-item">
        <span class="label">覆盖区域</span>
        <span class="num">{{ regionCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
// 替换成你实际的 API 路径
import { getUserRegionStats } from '@/api/report'
// 引入静态资源
import chinaMapData from '@/assets/json/china.json'
import cityCoords from '@/assets/json/cityCoords.json'

const chartRef = ref(null)
let myChart = null

// 用于地图渲染的数据
const mapDataList = ref([])
// 用于左侧列表展示的数据（未知、内网IP等）
const specialList = ref([])

// 计算总人数
const totalUsers = computed(() => {
  const mapTotal = mapDataList.value.reduce((sum, item) => sum + item.value[2], 0)
  const specialTotal = specialList.value.reduce((sum, item) => sum + item.value, 0)
  return mapTotal + specialTotal
})

// 计算区域总数
const regionCount = computed(() => mapDataList.value.length + specialList.value.length)

// 计算列表条形图的宽度比例
const getBarWidth = (val) => {
  if (specialList.value.length === 0) return 0
  const max = Math.max(...specialList.value.map(i => i.value))
  return (val / max) * 100
}

/**
 * 🛠️ 数据处理核心逻辑
 * 将后端数据拆分为：[地图可渲染数据] 和 [特殊展示数据]
 */
const processData = (data) => {
  const mapRes = []     // 给 ECharts 用
  const specialRes = [] // 给左侧列表用
  
  // 省份映射兜底：如果后端只传了“浙江”，我们把它映射到省会“杭州”的坐标
  // 这样既能在地图上显示，又不至于因为找不到“浙江市”的坐标而被丢弃
  const provinceMap = {
    '北京': '北京市', '上海': '上海市', '天津': '天津市', '重庆': '重庆市',
    '浙江': '杭州市', '江苏': '南京市', '广东': '广州市', '四川': '成都市',
    '山东': '济南市', '福建': '福州市', '安徽': '合肥市', '湖北': '武汉市',
    '湖南': '长沙市', '河南': '郑州市', '河北': '石家庄市', '山西': '太原市',
    '陕西': '西安市', '黑龙江': '哈尔滨市', '吉林': '长春市', '辽宁': '沈阳市',
    '江西': '南昌市', '海南': '海口市', '云南': '昆明市', '贵州': '贵阳市',
    '广西': '南宁市', '内蒙古': '呼和浩特市', '宁夏': '银川市', '新疆': '乌鲁木齐市',
    '西藏': '拉萨市', '青海': '西宁市', '甘肃': '兰州市'
  }

  for (let i = 0; i < data.length; i++) {
    let name = data[i].name
    const value = data[i].value

    // --- 1. 过滤掉空名字 ---
    if (!name) continue

    // --- 2. 提取城市名 (处理 "浙江·金华") ---
    if (name.includes('·')) {
      name = name.split('·')[1]
    }

    // --- 3. 识别特殊数据 (未知、内网IP) ---
    // 如果名字里包含这些关键词，直接扔进 specialRes，不走地图逻辑
    if (name === '未知' || name.includes('内网') || name.includes('IP')) {
      specialRes.push({ name: data[i].name, value: value }) // 用原始名字展示
      continue
    }

    // --- 4. 尝试补全地名 ---
    let searchName = name
    // 如果不是特殊省份名，且没后缀，尝试加“市”
    if (!provinceMap[name] && !/[市区州盟]$/.test(name)) {
      searchName = name + '市'
    }
    // 如果是省份名（如“浙江”），映射为省会（如“杭州市”）
    if (provinceMap[name]) {
      searchName = provinceMap[name]
    }

    // --- 5. 匹配坐标 ---
    const geoCoord = cityCoords[searchName]

    if (geoCoord) {
      mapRes.push({
        name: searchName, // 用补全后的名字去地图上画点
        value: geoCoord.concat(value), // [lng, lat, value]
        originalName: data[i].name // 记录原始名字，Tooltip 里可以用
      })
    } else {
      // 实在找不到坐标的（比如“火星”），也放进特殊列表展示
      specialRes.push({ name: data[i].name, value: value })
    }
  }

  return { mapRes, specialRes }
}

const initChart = async () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value)
  }
  
  echarts.registerMap('china', chinaMapData)

  try {
    const res = await getUserRegionStats()
    const rawData = res.data || []

    // 处理数据
    const { mapRes, specialRes } = processData(rawData)
    
    // 更新响应式数据，界面会自动渲染列表
    mapDataList.value = mapRes
    specialList.value = specialRes

    const option = {
      backgroundColor: '#02091d', 
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(2, 9, 29, 0.9)',
        borderColor: '#00d4c7',
        textStyle: { color: '#fff' },
        formatter: function (params) {
          if (params.seriesType === 'effectScatter') {
             return `${params.marker} ${params.data.originalName || params.name}<br/>
                     <span style="color:#aaa">用户数：</span><b style="color:#ffeb7b;font-size:14px">${params.value[2]}</b>`
          }
          return params.name
        }
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.1,
        center: [105, 36],
        label: { show: true, color: 'rgba(255,255,255,0.2)', fontSize: 10 },
        itemStyle: {
          normal: {
            areaColor: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: '#091834' }, { offset: 1, color: '#1a2c4e' }]
            },
            borderColor: '#375979',
            borderWidth: 1,
            shadowColor: 'rgba(0, 212, 199, 0.5)',
            shadowBlur: 5
          },
          emphasis: { areaColor: '#2B91B7', label: { color: '#fff' } }
        }
      },
      visualMap: {
        min: 0,
        max: 500, // ⚠️注意：如果你的未知IP很多，这里只影响地图上的点，不影响左侧列表
        left: 20,
        bottom: 20,
        calculable: true,
        text: ['High', 'Low'],
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d'],
          symbolSize: [6, 20]
        },
        textStyle: { color: '#fff' }
      },
      series: [
        {
          name: '用户',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: mapDataList.value,
          symbolSize: 8,
          showEffectOn: 'render',
          rippleEffect: { brushType: 'stroke', scale: 3 },
          label: { show: false }, // 地图上不显示名字，太乱，鼠标移上去看 Tooltip
          itemStyle: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          },
          zlevel: 1
        }
      ]
    }

    myChart.setOption(option)
    
  } catch (error) {
    console.error('地图加载失败:', error)
  }
}

const handleResize = () => myChart && myChart.resize()

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (myChart) myChart.dispose()
})
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 750px;
  background-color: #02091d;
  border-radius: 12px;
  border: 1px solid #1c2e4a;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/* 顶部标题 */
.map-header {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, rgba(10, 26, 51, 1), rgba(10, 26, 51, 0));
  position: absolute;
  top: 0;
  z-index: 10;
}
.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #00d4c7;
  letter-spacing: 4px;
  text-shadow: 0 0 10px rgba(0, 212, 199, 0.5);
  margin: 0 20px;
}
.title-decor-left, .title-decor-right {
  height: 2px;
  width: 80px;
  background: linear-gradient(to right, transparent, #00d4c7);
}
.title-decor-right { background: linear-gradient(to left, transparent, #00d4c7); }

.chart-box { flex: 1; width: 100%; height: 100%; }

/* --- 左侧特殊列表样式 --- */
.special-panel {
  position: absolute;
  top: 80px;
  left: 20px;
  width: 200px;
  z-index: 10;
  background: rgba(16, 36, 61, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 212, 199, 0.2);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.panel-title {
  color: #00d4c7;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.panel-list {
  max-height: 400px;
  overflow-y: auto;
}
/* 隐藏滚动条 */
.panel-list::-webkit-scrollbar { width: 0; }

.panel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #fff;
}

.item-name { width: 60px; text-align: right; margin-right: 10px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
.item-value { width: 40px; text-align: right; color: #ffeb7b; font-weight: bold; }
.item-bar-box {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}
.item-bar {
  height: 100%;
  background: linear-gradient(90deg, #00d4c7, #2B91B7);
  border-radius: 3px;
}

/* --- 右下角统计样式 --- */
.stats-panel {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
  display: flex;
  gap: 20px;
}
.stat-item {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #375979;
  padding: 10px 20px;
  border-radius: 6px;
  text-align: center;
  min-width: 100px;
}
.stat-item .label { display: block; font-size: 12px; color: #aaa; }
.stat-item .num { display: block; font-size: 24px; color: #f4e925; font-weight: bold; margin-top: 5px; }
</style>