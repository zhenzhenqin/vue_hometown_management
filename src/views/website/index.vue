<template>
  <div class="lanke-container">
    <div class="ink-landscape">
      <div class="mountain m-1"></div>
      <div class="mountain m-2"></div>
      <div class="mountain m-3"></div>
      <div class="sun"></div>
      <div class="fog-container" :style="{ opacity: fogOpacity }">
        <div class="fog f-1"></div>
        <div class="fog f-2"></div>
      </div>
    </div>

    <div class="chess-wrapper">
      <div class="board-frame">
        <div class="chess-board">
          <div class="grid-row" v-for="r in 18" :key="'r'+r">
            <div class="grid-cell" v-for="c in 18" :key="'c'+c"></div>
          </div>
          
          <transition-group name="stone-drop">
            <div 
              v-for="stone in stones" 
              :key="stone.id"
              class="stone"
              :class="stone.type"
              :style="{ left: stone.x + '%', top: stone.y + '%' }"
            ></div>
          </transition-group>

          <div class="star-point p-center"></div>
        </div>
      </div>
      
      <div class="chess-text">
        “ 烂柯山下局未残，岁月指间过 ”
      </div>
    </div>

    <div class="info-panel">
      
      <div class="info-card time-card">
        <div class="label">观 棋 岁 月</div>
        <div class="value-group">
          <div class="v-item">
            <span class="num">{{ uptime.days }}</span>
            <span class="txt">日</span>
          </div>
          <div class="v-item">
            <span class="num">{{ uptime.hours }}</span>
            <span class="txt">时</span>
          </div>
          <div class="v-item">
            <span class="num">{{ uptime.minutes }}</span>
            <span class="txt">分</span>
          </div>
          <div class="v-item highlight">
            <span class="num">{{ uptime.seconds }}</span>
            <span class="txt">秒</span>
          </div>
        </div>
        <div class="sub-text">始于：{{ startTimeStr }}</div>
      </div>

      <div class="info-card status-card">
        <div class="label">南 孔 气 象</div>
        <div class="weather-box">
          <div class="weather-item">
            <span>云雾浓度</span>
            <span class="weather-val">{{ cpuStatus }}</span>
          </div>
          <div class="weather-item">
            <span>斧柯状态</span>
            <span class="weather-val">{{ axeStatus }}</span>
          </div>
        </div>
      </div>

    </div>

    <div class="poetry-float">
      {{ currentPoem }}
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { getServerInfo } from '@/api/monitor'

// --- 数据定义 ---
const stones = ref([]) // 棋子数组
const uptime = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0 })
const startTimeStr = ref('')
const cpuLoad = ref(0)
const timer = ref(null)
const chessTimer = ref(null)

// 衢州/南孔相关诗句轮播
const poems = [
  "山中方一日，世上已千年。",
  "南孔圣地，礼门义路。",
  "信安湖水清，烂柯棋局深。",
  "有朋自远方来，不亦乐乎？",
  "逝者如斯夫，不舍昼夜。"
]
const currentPoem = ref(poems[0])

// --- 计算属性：数据趣味化 ---

// 根据CPU负载控制云雾透明度 (0.3 ~ 0.9)
const fogOpacity = computed(() => 0.3 + (cpuLoad.value / 200))

// 文案化 CPU 状态
const cpuStatus = computed(() => {
  if (cpuLoad.value < 20) return "天朗气清"
  if (cpuLoad.value < 50) return "云卷云舒"
  if (cpuLoad.value < 80) return "山雨欲来"
  return "浓雾锁山"
})

// 文案化 运行时长 (模拟烂柯传说)
const axeStatus = computed(() => {
  if (uptime.days < 1) return "崭新如初"
  if (uptime.days < 7) return "略有磨损"
  if (uptime.days < 30) return "木柄微朽"
  return "柯烂如泥"
})

// --- 核心逻辑 ---

// 1. 获取服务器数据
const initData = async () => {
  try {
    const res = await getServerInfo()
    if (res.code === 1) {
      startTimeStr.value = res.data.jvm.startTime
      // 获取CPU使用率用来控制天气
      cpuLoad.value = res.data.cpu.used
      
      startClock(res.data.jvm.startTime)
      startChessGame()
    }
  } catch (e) {
    console.error("获取天机失败", e)
    // 失败也给个默认时间演示
    startClock(new Date().getTime() - 100000000)
    startChessGame()
  }
}

// 2. 运行时长时钟
const startClock = (startStr) => {
  const start = new Date(startStr).getTime()
  timer.value = setInterval(() => {
    const now = new Date().getTime()
    const diff = now - start
    
    uptime.days = Math.floor(diff / (1000 * 60 * 60 * 24))
    uptime.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    uptime.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    uptime.seconds = Math.floor((diff % (1000 * 60)) / 1000)

    // 每10秒换句诗
    if (uptime.seconds % 10 === 0) {
      currentPoem.value = poems[Math.floor(Math.random() * poems.length)]
    }
  }, 1000)
}

// 3. 模拟围棋对弈 (自动落子)
const startChessGame = () => {
  let isBlack = true
  
  chessTimer.value = setInterval(() => {
    // 棋盘满了就清空重来
    if (stones.value.length > 50) {
      stones.value = []
    }

    // 随机坐标 (0-18线) -> 对应百分比位置 (0% - 100%)
    // 棋盘格子稍微留点边距，所以范围控制在 2% - 98%
    const x = Math.round(Math.random() * 18) * 5.2 + 2.5
    const y = Math.round(Math.random() * 18) * 5.2 + 2.5

    stones.value.push({
      id: Date.now(),
      type: isBlack ? 'black' : 'white',
      x, y
    })

    isBlack = !isBlack
  }, 1500) // 每1.5秒落一子
}

onMounted(() => {
  initData()
})

onUnmounted(() => {
  clearInterval(timer.value)
  clearInterval(chessTimer.value)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');

/* 全屏容器 */
.lanke-container {
  width: 100%;
  height: calc(100vh - 80px); /* 减去头部高度 */
  position: relative;
  background: linear-gradient(to bottom, #eef2f3 0%, #d9ded8 100%);
  overflow: hidden;
  font-family: "Ma Shan Zheng", "楷体", serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* --- 1. 纯CSS水墨背景 --- */
.ink-landscape {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  pointer-events: none;
}

/* 山峦通用样式 */
.mountain {
  position: absolute;
  bottom: -50px;
  border-radius: 50% 50% 0 0;
  filter: blur(2px);
  transition: all 1s;
}

/* 远山 */
.m-1 {
  width: 120%;
  height: 300px;
  left: -10%;
  background: #c1c8c7;
  opacity: 0.6;
  animation: breathe 10s infinite alternate;
}
/* 中山 */
.m-2 {
  width: 80%;
  height: 200px;
  right: -10%;
  background: #8b9694;
  opacity: 0.7;
  bottom: -30px;
  animation: breathe 8s infinite alternate-reverse;
}
/* 近山 */
.m-3 {
  width: 60%;
  height: 120px;
  left: 20%;
  background: #54605e;
  opacity: 0.8;
}

/* 太阳/月亮 */
.sun {
  position: absolute;
  top: -150px;
  right: 100px;
  width: 60px;
  height: 60px;
  background: #b22222;
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 0 0 20px rgba(178, 34, 34, 0.4);
}

/* 云雾 */
.fog-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  transition: opacity 2s;
}
.fog {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  filter: blur(30px);
  animation: fogFloat 20s linear infinite;
}
.f-1 { width: 300px; height: 100px; top: 20%; left: -200px; }
.f-2 { width: 400px; height: 150px; top: 40%; right: -200px; animation-delay: -10s; }

/* --- 2. 棋盘区域 --- */
.chess-wrapper {
  z-index: 10;
  position: relative;
  transform: translateY(-20px);
}

.board-frame {
  width: 440px;
  height: 440px;
  background: #e6cba6; /* 棋盘木色 */
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.1);
  padding: 20px;
  position: relative;
}

.chess-board {
  width: 100%;
  height: 100%;
  position: relative;
  border: 2px solid #5e4730;
}

/* 网格线 */
.grid-row {
  height: 5.55%;
  border-bottom: 1px solid #947e62;
  display: flex;
}
.grid-row:last-child { border-bottom: none; }
.grid-cell {
  flex: 1;
  border-right: 1px solid #947e62;
}
.grid-cell:last-child { border-right: none; }

/* 天元点 */
.star-point {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #5e4730;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.p-center { left: 50%; top: 50%; }

/* 棋子 */
.stone {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 1px 2px 4px rgba(0,0,0,0.3);
}
.stone.black {
  background: radial-gradient(circle at 30% 30%, #555, #000);
}
.stone.white {
  background: radial-gradient(circle at 30% 30%, #fff, #ddd);
}

/* 落子动画 */
.stone-drop-enter-active {
  animation: dropIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
@keyframes dropIn {
  0% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.chess-text {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #5e4730;
  font-weight: bold;
  letter-spacing: 2px;
}

/* --- 3. 信息面板 --- */
.info-panel {
  z-index: 10;
  display: flex;
  gap: 40px;
  margin-top: 40px;
}

.info-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  padding: 15px 30px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  text-align: center;
  min-width: 200px;
}

.label {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.value-group {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 8px;
}

.v-item .num {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  font-family: 'Georgia', serif;
}
.v-item .txt {
  font-size: 12px;
  color: #888;
}
.highlight .num {
  color: #b22222; /* 红色高亮秒数 */
}

.sub-text {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
  font-family: Arial, sans-serif;
}

.weather-box {
  display: flex;
  justify-content: space-around;
}
.weather-item {
  display: flex;
  flex-direction: column;
}
.weather-item span:first-child { font-size: 12px; color: #888; }
.weather-val { font-size: 18px; color: #2c3e50; font-weight: bold; }

/* --- 4. 诗句浮动 --- */
.poetry-float {
  position: absolute;
  top: 50px;
  right: 50px;
  writing-mode: vertical-rl;
  font-size: 24px;
  color: #333;
  opacity: 0.6;
  letter-spacing: 5px;
  border-left: 2px solid #b22222;
  padding-left: 10px;
  height: 300px;
}

/* 动画定义 */
@keyframes breathe {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}
@keyframes fogFloat {
  0% { transform: translateX(0); }
  100% { transform: translateX(100vw); }
}
</style>