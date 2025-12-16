<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshLeft, User, Lock, Unlock } from '@element-plus/icons-vue'
import { getUserPage, startOrStopUser } from '@/api/user' // 引入刚才定义的API

// --- 数据定义 ---
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  username: '', // 用户名搜索
  status: ''    // 状态搜索
})

// --- 方法定义 ---

// 1. 获取用户列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getUserPage(queryParams)
    if (res.code === 1) {
      tableData.value = res.data.records || res.data.rows // 根据后端PageResult结构适配
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络异常')
  } finally {
    loading.value = false
  }
}

// 2. 搜索与重置
const handleSearch = () => {
  queryParams.page = 1
  fetchList()
}

const resetQuery = () => {
  queryParams.username = ''
  queryParams.status = ''
  handleSearch()
}

// 3. 切换用户状态（拉黑/解除）
const handleStatusChange = (row) => {
  const text = row.status === 1 ? '拉黑' : '解除拉黑'
  const newStatus = row.status === 1 ? 0 : 1 // 假设 1是启用，0是禁用
  
  ElMessageBox.confirm(`确认要"${text}"用户 "${row.username}" 吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await startOrStopUser(newStatus, row.id)
      if (res.code === 1) {
        ElMessage.success(`${text}成功`)
        row.status = newStatus // 更新本地状态
      } else {
        // 失败则回滚开关状态（如果是用el-switch直接绑定的row.status，需要这一步）
        ElMessage.error(res.msg || '操作失败')
        fetchList() // 刷新列表以保证状态一致
      }
    } catch (error) {
      ElMessage.error('系统错误')
      fetchList()
    }
  }).catch(() => {
    // 取消操作，如果使用了v-model绑定，这里可能需要回滚UI状态
    // 为简单起见，el-switch 的 :before-change 也可以处理，或者直接刷新列表
    fetchList()
  })
}

// 分页事件
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  fetchList()
}
const handleCurrentChange = (val) => {
  queryParams.page = val
  fetchList()
}

// 初始化
onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="user-manage-container">
    <h1 class="page-title">用户管理</h1>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="用户名">
          <el-input 
            v-model="queryParams.username" 
            placeholder="请输入用户名" 
            clearable 
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
            <el-option label="正常" :value="1" />
            <el-option label="已拉黑" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
          <el-button @click="resetQuery" :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-table 
        v-loading="loading"
        :data="tableData" 
        border 
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column label="用户名" prop="username" align="center" min-width="120" />
        
        <el-table-column label="真实姓名" prop="realName" align="center" min-width="120">
          <template #default="scope">
            {{ scope.row.realName || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="手机号" prop="phone" align="center" width="150" />

        <el-table-column label="状态" align="center" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="danger">已拉黑</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="注册时间" prop="createTime" align="center" width="180">
          <template #default="scope">
            {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 1"
              type="danger" 
              size="small" 
              :icon="Lock"
              plain
              @click="handleStatusChange(scope.row)"
            >
              拉黑
            </el-button>
            <el-button 
              v-else
              type="success" 
              size="small" 
              :icon="Unlock"
              plain
              @click="handleStatusChange(scope.row)"
            >
              解除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.user-manage-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.page-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: 600;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.table-card {
  border-radius: 8px;
}

.pagination-bar {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 按钮样式微调 */
:deep(.el-button--danger.is-plain) {
  --el-button-bg-color: #fef0f0;
  --el-button-border-color: #fab6b6;
  --el-button-text-color: #f56c6c;
}
</style>