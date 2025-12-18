<template>
  <div class="log-timeline-container">
    <div class="filter-header">
      <el-input
        v-model="queryParams.username"
        placeholder="搜索操作人..."
        class="filter-item"
        prefix-icon="User"
        clearable
        @keyup.enter="handleQuery"
      />
      <el-input
        v-model="queryParams.operation"
        placeholder="搜索操作行为..."
        class="filter-item"
        prefix-icon="Edit"
        clearable
        @keyup.enter="handleQuery"
      />
      <el-button type="primary" icon="Search" round @click="handleQuery">搜索</el-button>
      <el-button icon="Refresh" circle @click="resetQuery"></el-button>
    </div>

    <div class="timeline-wrapper" v-loading="loading">
      <el-empty v-if="logList.length === 0 && !loading" description="暂无操作记录" />
      
      <el-timeline v-else>
        <el-timeline-item
          v-for="(log, index) in logList"
          :key="log.id"
          :timestamp="formatTime(log.createTime)"
          placement="top"
          :type="getLogType(log.operation)"
          :hollow="true"
          size="large"
        >
          <el-card class="log-card" shadow="hover">
            <div class="log-card-header">
              <div class="user-info">
                <el-avatar class="user-avatar" :size="32" :style="{ backgroundColor: stringToColor(log.username) }">
                  {{ log.username.substring(0, 1).toUpperCase() }}
                </el-avatar>
                <span class="username">{{ log.username }}</span>
                <span class="action-text">执行了</span>
                <el-tag :type="getLogType(log.operation)" effect="dark" round>
                  {{ log.operation }}
                </el-tag>
              </div>
              <div class="meta-info">
                <el-tag type="info" size="small" effect="plain" icon="Monitor">
                  {{ log.ip }}
                </el-tag>
                <el-tag type="warning" size="small" effect="plain" icon="Timer" v-if="log.time > 0">
                  {{ log.time }}ms
                </el-tag>
              </div>
            </div>

            <div class="log-card-body">
              <div class="method-line">
                <span class="label">调用方法:</span>
                <code class="method-code">{{ log.method }}</code>
              </div>
              
              <el-collapse v-if="log.params && log.params !== '{}'" class="params-collapse">
                <el-collapse-item title="查看请求参数详情" name="1">
                  <div class="code-block">
                    <pre>{{ tryFormatJson(log.params) }}</pre>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <div class="pagination-center" v-if="total > 0">
        <el-pagination
          background
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          layout="prev, pager, next"
          :total="total"
          @current-change="getList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getLogList } from '@/api/log'
import { User, Edit, Search, Refresh, Monitor, Timer } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const logList = ref([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  pageSize: 10, // 时间轴模式下每页稍微少一点，体验更好
  username: '',
  operation: ''
})

// --- 核心逻辑 ---

const getList = async () => {
  loading.value = true
  try {
    const res = await getLogList(queryParams)
    if (res.code === 1) {
      // ★★★ 修复点：这里改成 rows ★★★
      logList.value = res.data.rows 
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取日志失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络请求异常')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.page = 1
  getList()
}

const resetQuery = () => {
  queryParams.username = ''
  queryParams.operation = ''
  queryParams.page = 1
  getList()
}

// --- 辅助 UI 函数 ---

// 1. 根据操作名称返回颜色类型 (增加视觉辨识度)
const getLogType = (operation) => {
  if (!operation) return 'info'
  if (operation.includes('删除') || operation.includes('禁用')) return 'danger'
  if (operation.includes('更新') || operation.includes('修改')) return 'warning'
  if (operation.includes('新增') || operation.includes('登录')) return 'success'
  return 'primary'
}

// 2. 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr.replace('T', ' ')
}

// 3. 尝试美化 JSON 参数
const tryFormatJson = (jsonStr) => {
  try {
    const obj = JSON.parse(jsonStr)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return jsonStr
  }
}

// 4. 根据用户名生成固定的头像背景色
const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.log-timeline-container {
  padding: 20px;
  max-width: 1000px; /* 限制宽度让时间轴更聚拢 */
  margin: 0 auto;
}

/* 搜索栏样式 */
.filter-header {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.filter-item {
  width: 200px;
}

/* 时间轴样式重写 */
.timeline-wrapper {
  padding: 10px;
}

.log-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fff;
  border-left: 4px solid #eee; /* 默认左边框 */
}

/* 配合 getLogType 的颜色 */
:deep(.el-timeline-item__node--danger) ~ .el-timeline-item__wrapper .log-card { border-left-color: #f56c6c; }
:deep(.el-timeline-item__node--warning) ~ .el-timeline-item__wrapper .log-card { border-left-color: #e6a23c; }
:deep(.el-timeline-item__node--success) ~ .el-timeline-item__wrapper .log-card { border-left-color: #67c23a; }
:deep(.el-timeline-item__node--primary) ~ .el-timeline-item__wrapper .log-card { border-left-color: #409eff; }

.log-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.log-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.username {
  font-weight: 700;
  color: #333;
}

.action-text {
  font-size: 13px;
  color: #999;
}

.meta-info {
  display: flex;
  gap: 8px;
}

.method-line {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  word-break: break-all;
}

.method-code {
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 4px;
  color: #c0392b;
  font-family: Consolas, Monaco, monospace;
}

.code-block {
  background-color: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  font-family: Consolas, Monaco, monospace;
}

.pagination-center {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 隐藏 Collapse 的边框让它看起来更一体 */
:deep(.el-collapse), :deep(.el-collapse-item__header), :deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}
:deep(.el-collapse-item__header) {
  color: #409eff;
  font-size: 12px;
}
</style>