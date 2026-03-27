<template>
  <div class="map-page-container" v-loading="loading" element-loading-text="正在加载景区数据...">
    <div id="quzhou-map" class="map-view"></div>

    <div class="map-info-panel">
      <div class="panel-header">
        <el-icon><LocationFilled /></el-icon>
        <span>景区分布概览</span>
      </div>
      <div class="panel-content">
        <p>已收录景点：<span class="highlight">{{ totalAttractions }}</span> 个</p>
        <p class="tip-text">缩放地图查看详细位置，点击红旗查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listAllAttractions } from '@/api/attraction' 
import { ElMessage } from 'element-plus'
import { LocationFilled } from '@element-plus/icons-vue'

const loading = ref(false)
const totalAttractions = ref(0)
let mapInstance = null

// 初始化地图
const initMap = () => {
  // 检查百度地图 API 是否加载
  if (typeof BMapGL === 'undefined') {
    ElMessage.error('地图资源加载失败，请检查网络或配置')
    return
  }

  // 1. 创建地图实例
  mapInstance = new BMapGL.Map('quzhou-map')
  
  // 2. 设置中心点：衢州市 (经纬度大概在 118.87, 28.94)
  const centerPoint = new BMapGL.Point(118.87263, 28.941708)
  mapInstance.centerAndZoom(centerPoint, 10) // 10级缩放刚好看到整个衢州
  mapInstance.enableScrollWheelZoom(true) // 开启滚轮缩放
}

// 加载并标记景点
const loadAndMarkAttractions = async () => {
  loading.value = true
  try {
    // 调用分页接口获取所有数据，pageSize 设为 1000 以获取全部数据
    const res = await listAllAttractions(null, null, null, 1, 1000)
    
    if (res.code === 1 && res.data && res.data.rows) {
      const list = res.data.rows
      totalAttractions.value = res.data.total // 或者 list.length

      const hasCoords = []
      const noCoords = []

      // 1. 数据分类
      list.forEach(item => {
        if (item.longitude && item.latitude) {
          hasCoords.push(item)
        } else {
          noCoords.push(item)
        }
      })

      // 2. 有坐标的：直接秒开，不需要请求百度 API
      hasCoords.forEach(item => {
        const point = new BMapGL.Point(item.longitude, item.latitude)
        addMarker(point, item)
      })

      // 3. 无坐标的：排队慢速处理，避免触发并发限制
      if (noCoords.length > 0) {
        console.warn(`有 ${noCoords.length} 个景点缺少坐标，正在慢速解析...`)
        processQueueSlowly(noCoords)
      }

    } else {
      ElMessage.warning(res.msg || '获取景区数据失败')
    }
  } catch (error) {
    console.error('地图数据加载错误:', error)
    ElMessage.error('网络请求失败')
  } finally {
    loading.value = false
  }
}

//慢速队列处理函数
const processQueueSlowly = async (list) => {
  for (const item of list) {
    // 尝试解析地址
    const myGeo = new BMapGL.Geocoder()
    const address = '衢州市 ' + (item.location || item.name)
    
    myGeo.getPoint(address, (point) => {
      if (point) {
        addMarker(point, item)
      }
    }, '衢州市')

    // 强制等待 300 毫秒再处理下一个
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}

// 添加标记和信息窗口
const addMarker = (point, item) => {
  // 创建红点标记
  const marker = new BMapGL.Marker(point)
  mapInstance.addOverlay(marker)

  const content = `
    <div style="width: 240px; font-family: 'Segoe UI', sans-serif;">
      <h4 style="margin: 0 0 8px 0; color: #1a5e38; font-size: 16px; font-weight: bold;">${item.name}</h4>
      <div style="width: 100%; height: 140px; border-radius: 4px; overflow: hidden; margin-bottom: 8px; background-color: #f0f0f0;">
        <img src="${item.image || ''}" 
             onerror="this.style.display='none'"
             style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <p style="font-size: 12px; color: #666; margin: 0 0 4px 0;">
        <span style="font-weight: bold;">📍 地址：</span>${item.location || '未知'}
      </p>
      <p style="font-size: 12px; color: #666; margin: 0;">
        <span style="font-weight: bold;">⭐ 评分：</span>${item.score || '暂无'}
      </p>
    </div>
  `
  
  const infoWindow = new BMapGL.InfoWindow(content, {
    width: 240,
    height: 240,
    title: '', 
    enableMessage: false
  })
  
  // 点击标记打开信息窗口
  marker.addEventListener('click', () => {
    mapInstance.openInfoWindow(infoWindow, point)
  })
}

onMounted(() => {
  // 稍微延迟初始化，确保 DOM 容器已准备好
  setTimeout(() => {
    initMap()
    loadAndMarkAttractions()
  }, 100)
})
</script>

<style scoped>
.map-page-container {
  width: 100%;
  height: 100%;
  position: relative;
  /* 确保填满父容器 */
  display: flex;
  flex-direction: column;
}

/* 地图画布 */
.map-view {
  width: 100%;
  height: 100%;
  min-height: 600px; /* 最小高度，防止在某些布局下高度塌陷 */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 右上角悬浮面板 */
.map-info-panel {
  position: absolute;
  top: 20px;
  left: 20px; /* 改为左上角，避免遮挡百度地图自带的控件 */
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  width: 220px;
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.panel-header {
  background: linear-gradient(to right, #1a5e38, #3aad6e);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 15px;
}

.panel-content {
  padding: 16px;
}

.panel-content p {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.panel-content p:last-child {
  margin-bottom: 0;
}

.highlight {
  color: #1a5e38;
  font-weight: bold;
  font-size: 18px;
  margin: 0 4px;
}

.tip-text {
  font-size: 12px !important;
  color: #999 !important;
  margin-top: 10px !important;
  line-height: 1.4;
}
</style>