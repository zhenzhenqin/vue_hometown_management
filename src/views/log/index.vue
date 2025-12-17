<template>
  <div class="app-container">
    <el-card shadow="never" class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="操作人">
          <el-input 
            v-model="queryParams.username" 
            placeholder="请输入用户名" 
            clearable 
            @keyup.enter="handleQuery" 
          />
        </el-form-item>
        <el-form-item label="操作行为">
          <el-input 
            v-model="queryParams.operation" 
            placeholder="例如：登录、新增" 
            clearable 
            @keyup.enter="handleQuery" 
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-wrapper">
      <el-table 
        v-loading="loading" 
        :data="logList" 
        style="width: 100%" 
        border 
        stripe
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column prop="username" label="操作人" width="120" align="center">
          <template #default="scope">
            <el-tag effect="plain">{{ scope.row.username }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="operation" label="操作描述" width="180" align="center" />
        
        <el-table-column prop="method" label="请求方法" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <span style="font-family: monospace; font-size: 12px; color: #666;">
              {{ scope.row.method }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="ip" label="IP地址" width="140" align="center" />
        
        <el-table-column prop="createTime" label="操作时间" width="180" align="center">
          <template #default="scope">
            <el-icon style="vertical-align: middle; margin-right: 4px"><Clock /></el-icon>
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-if="total > 0"
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getLogList } from '@/api/log' // 引入第一步写的API
import { Search, Refresh, Clock } from '@element-plus/icons-vue' // 引入图标
import { ElMessage } from 'element-plus'

// --- 数据定义 ---
const loading = ref(false)
const logList = ref([])
const total = ref(0)

// 查询参数 (对应后端的 LogQueryParam)
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  username: '',
  operation: ''
})

// --- 方法定义 ---

// 获取日志列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getLogList(queryParams)
    // 根据后端返回结构: Result -> data -> { result: [], total: 0 }
    if (res.code === 1) {
      logList.value = res.data.result // 注意：这里取的是 PageResult 里的 result List
      total.value = res.data.total    // 取 total 总数
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

// 搜索按钮
const handleQuery = () => {
  queryParams.page = 1 // 搜索时重置为第一页
  getList()
}

// 重置按钮
const resetQuery = () => {
  queryParams.username = ''
  queryParams.operation = ''
  queryParams.page = 1
  getList()
}

// 简单的时间格式化 (如果后端传的是标准字符串可直接展示，如果是时间戳需处理)
const formatTime = (timeStr) => {
  if (!timeStr) return '-'
  return timeStr.replace('T', ' ') // 简单处理 '2023-12-01T12:00:00' 这种格式
}

// --- 初始化 ---
onMounted(() => {
  getList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.search-wrapper {
  margin-bottom: 20px;
}

.table-wrapper {
  min-height: 500px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>