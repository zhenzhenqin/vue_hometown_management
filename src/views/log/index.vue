<template>
  <div class="log-timeline-container">
    <div class="filter-header">
      <div class="filter-left">
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
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          class="filter-item-date"
          @change="handleQuery"
        />
      </div>
      
      <div class="filter-right">
        <el-button type="primary" icon="Search" round @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" circle @click="resetQuery" title="重置"></el-button>
      </div>
    </div>

    <div class="timeline-wrapper" v-loading="loading" element-loading-text="加载日志中...">
      <el-empty v-if="logList.length === 0 && !loading" description="暂无操作记录" :image-size="120" />
      
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
                <el-avatar class="user-avatar" :size="36" :style="{ backgroundColor: stringToColor(log.username || '未知') }">
                  {{ (log.username || 'U').substring(0, 1).toUpperCase() }}
                </el-avatar>
                <div class="user-text">
                  <span class="username">{{ log.username || '未知用户' }}</span>
                  <div class="action-row">
                    <span class="action-label">执行了</span>
                    <el-tag :type="getLogType(log.operation)" size="small" effect="dark" round>
                      {{ log.operation }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <div class="meta-info">
                <el-tag v-if="log.location" type="info" size="small" effect="plain" icon="Location">
                  {{ log.location }}
                </el-tag>
                <el-tag type="info" size="small" effect="plain" icon="Monitor">
                  {{ log.ip }}
                </el-tag>
                <el-tag :type="getDurationType(log.time)" size="small" effect="light" icon="Timer">
                  {{ log.time }}ms
                </el-tag>
              </div>
            </div>

            <div class="log-card-body">
              <div class="method-line">
                <span class="label">调用方法:</span>
                <el-tooltip :content="log.method" placement="top" :show-after="500">
                  <code class="method-code">{{ formatMethodName(log.method) }}</code>
                </el-tooltip>
              </div>
              
              <el-collapse v-if="log.params && log.params !== '{}'" class="params-collapse">
                <el-collapse-item name="1">
                  <template #title>
                    <span class="collapse-title">请求参数详情</span>
                  </template>
                  <div class="code-wrapper">
                    <div class="code-block">
                      <pre>{{ tryFormatJson(log.params) }}</pre>
                    </div>
                    <el-button 
                      class="copy-btn" 
                      type="primary" 
                      link 
                      icon="DocumentCopy" 
                      @click="copyText(tryFormatJson(log.params))"
                    >复制</el-button>
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
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getLogList } from '@/api/log'
import { User, Edit, Search, Refresh, Monitor, Timer, Location, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const logList = ref([])
const total = ref(0)
const dateRange = ref([]) // 日期范围

const queryParams = reactive({
  page: 1,
  pageSize: 10, 
  username: '',
  operation: '',
  beginTime: '', // 预留给后端
  endTime: ''    // 预留给后端
})

// --- 核心逻辑 ---

const getList = async () => {
  loading.value = true
  // 处理日期参数
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.beginTime = dateRange.value[0] + ' 00:00:00'
    queryParams.endTime = dateRange.value[1] + ' 23:59:59'
  } else {
    queryParams.beginTime = ''
    queryParams.endTime = ''
  }

  try {
    const res = await getLogList(queryParams)
    if (res.code === 1) {
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
  dateRange.value = []
  queryParams.page = 1
  getList()
}

// --- 辅助 UI 函数 ---

// 1. 操作类型颜色
const getLogType = (operation) => {
  if (!operation) return 'info'
  if (operation.includes('删除') || operation.includes('禁用') || operation.includes('重置')) return 'danger'
  if (operation.includes('更新') || operation.includes('修改')) return 'warning'
  if (operation.includes('新增') || operation.includes('登录') || operation.includes('上传')) return 'success'
  return 'primary'
}

// 2. 耗时颜色分级 (超过1秒标红)
const getDurationType = (ms) => {
  if (ms >= 1000) return 'danger'
  if (ms >= 500) return 'warning'
  return 'success'
}

// 3. 简化方法名显示 (只显示类名最后一段 + 方法名)
const formatMethodName = (fullMethod) => {
  if (!fullMethod) return ''
  const parts = fullMethod.split('.')
  if (parts.length > 2) {
    // 取倒数第二个(类名) 和 倒数第一个(方法名)
    return parts[parts.length - 2] + '.' + parts[parts.length - 1]
  }
  return fullMethod
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr.replace('T', ' ')
}

const tryFormatJson = (jsonStr) => {
  try {
    const obj = JSON.parse(jsonStr)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return jsonStr
  }
}

// 一键复制功能
const copyText = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success('已复制到剪贴板')
    })
  } else {
    ElMessage.warning('当前浏览器不支持自动复制')
  }
}

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
  max-width: 1100px;
  margin: 0 auto;
}

/* 筛选栏优化 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.9);
  padding: 18px 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 10px;
  z-index: 100;
  border: 1px solid #ebeef5;
}

.filter-left {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-item {
  width: 180px;
}
.filter-item-date {
  width: 260px;
}

.timeline-wrapper {
  padding: 10px;
}

/* 卡片样式 */
.log-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  border-left: 4px solid #eee;
  overflow: visible; /* 允许阴影扩散 */
}

/* 动态边框颜色 */
:deep(.el-timeline-item__node--danger) ~ .el-timeline-item__wrapper .log-card { border-left-color: #f56c6c; }
:deep(.el-timeline-item__node--warning) ~ .el-timeline-item__wrapper .log-card { border-left-color: #e6a23c; }
:deep(.el-timeline-item__node--success) ~ .el-timeline-item__wrapper .log-card { border-left-color: #67c23a; }
:deep(.el-timeline-item__node--primary) ~ .el-timeline-item__wrapper .log-card { border-left-color: #409eff; }

.log-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.log-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-weight: bold;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-weight: 700;
  font-size: 14px;
  color: #303133;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-label {
  font-size: 12px;
  color: #909399;
}

.meta-info {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: flex-end;
  gap: 6px;
}

.log-card-body {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #ebeef5;
}

.method-line {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.method-code {
  background-color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  color: #f56c6c;
  border: 1px solid #e4e7ed;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
}

/* 代码块区域 */
.code-wrapper {
  position: relative;
  margin-top: 5px;
}

.code-block {
  background-color: #282c34;
  color: #abb2bf;
  padding: 15px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  font-family: Consolas, Monaco, monospace;
  max-height: 300px;
}

.copy-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  color: #fff;
  opacity: 0.6;
}
.copy-btn:hover { opacity: 1; color: #409eff; }

.pagination-center {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* 样式优化：Collapse */
:deep(.el-collapse), :deep(.el-collapse-item__header), :deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}
:deep(.el-collapse-item__header) {
  color: #409eff;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
}
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .log-card-header {
    flex-direction: column;
    gap: 10px;
  }
  .meta-info {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .filter-item, .filter-item-date {
    width: 100%;
  }
}
</style>