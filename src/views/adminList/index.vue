<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshLeft, Plus, Edit, UserFilled } from '@element-plus/icons-vue'
// 引入API
import { getAdminList, addAdmin, getAdminById, updateAdmin, changeAdminStatus } from '@/api/admin'

// --- 搜索与分页数据 ---
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  username: '' // 根据 AdminQueryParam 只写了 username
})

// --- 表单与弹窗数据 ---
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const formData = reactive({
  id: null,
  username: '',
  realName: '',
  phone: '',
  email: '',
  status: 1
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
}

// ================= 方法定义 =================

// 1. 获取列表数据
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAdminList(queryParams)
    if (res.code === 1) {
      tableData.value = res.data.rows
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
  handleSearch()
}

// 3. 启用/禁用状态切换
const handleStatusChange = async (row) => {
  // 双重保护：如果是 admin，禁止操作
  if (row.username === 'admin') {
    row.status = 1 // 强制保持启用
    ElMessage.warning('超级管理员无法被禁用')
    return
  }

  const text = row.status === 1 ? '启用' : '禁用'
  
  try {
    // 调用接口
    const res = await changeAdminStatus(row.status, row.id)
    if (res.code === 1) {
      ElMessage.success(`${text}成功`)
    } else {
      // 失败回滚状态
      row.status = row.status === 1 ? 0 : 1
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('系统错误')
  }
}

// 4. 打开新增弹窗
const handleAdd = () => {
  dialogTitle.value = '新增管理员'
  dialogVisible.value = true
  // 重置表单
  formData.id = null
  formData.username = ''
  formData.realName = ''
  formData.phone = ''
  formData.email = ''
  // 清除校验结果
  if (formRef.value) formRef.value.resetFields()
}

// 5. 打开编辑弹窗
const handleEdit = async (id) => {
  dialogTitle.value = '编辑管理员'
  dialogVisible.value = true
  if (formRef.value) formRef.value.resetFields()
  
  try {
    const res = await getAdminById(id)
    if (res.code === 1) {
      // 回显数据
      Object.assign(formData, res.data)
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 6. 提交表单 (新增或修改)
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (formData.id) {
          // 修改
          res = await updateAdmin(formData)
        } else {
          // 新增
          res = await addAdmin(formData)
        }

        if (res.code === 1) {
          ElMessage.success(formData.id ? '修改成功' : '新增成功')
          dialogVisible.value = false
          fetchList()
        } else {
          ElMessage.error(res.msg || '操作失败')
        }
      } catch (error) {
        ElMessage.error('系统错误')
      }
    }
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
  <div class="admin-page-container">
    <h1 class="page-title">管理员管理</h1>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="queryParams" class="search-form" size="medium">
        <el-form-item label="登录账号">
          <el-input 
            v-model="queryParams.username" 
            placeholder="请输入账号" 
            clearable 
            @keyup.enter="handleSearch"
            class="search-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
          <el-button type="info" @click="resetQuery" :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd" :icon="Plus" class="add-btn">新增管理员</el-button>
    </div>

    <el-card class="table-card" shadow="hover" :border="false">
      <el-table 
        v-loading="loading"
        :data="tableData" 
        border 
        style="width: 100%"
        size="medium"
        :header-cell-style="{ background: '#f9fafb', color: '#4b5563', fontWeight: '500' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column label="登录账号" prop="username" align="center" min-width="120">
          <template #default="scope">
            <div v-if="scope.row.username === 'admin'" class="super-admin-tag">
              <el-icon><UserFilled /></el-icon> 超级管理员
            </div>
            <span v-else>{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column label="真实姓名" prop="realName" align="center" min-width="120" />
        <el-table-column label="手机号码" prop="phone" align="center" width="150" />
        <el-table-column label="邮箱" prop="email" align="center" width="180" show-overflow-tooltip />

        <el-table-column label="账号状态" align="center" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.username === 'admin'" 
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createTime" align="center" width="170">
          <template #default="scope">
            {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button 
              v-if="scope.row.username !== 'admin'"
              type="primary" 
              size="small" 
              @click="handleEdit(scope.row.id)" 
              :icon="Edit" 
              class="edit-btn"
            >
              编辑
            </el-button>
            <el-tag v-else type="info" size="small">不可操作</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      center
      destroy-on-close
    >
      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules" 
        label-width="100px" 
        class="dialog-form"
      >
        <el-form-item label="登录账号" prop="username">
          <el-input 
            v-model="formData.username" 
            placeholder="请输入登录账号" 
            :disabled="!!formData.id"
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入11位手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱 (选填)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 容器样式 */
.admin-page-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 标题样式 */
.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

/* 搜索区域 */
.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
}
.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.search-input {
  width: 240px;
}

/* 操作栏 */
.operation-bar {
  margin-bottom: 20px;
}
.add-btn {
  padding: 8px 20px;
  border-radius: 4px;
}

/* 表格区域 */
.table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 16px;
}

/* 超级管理员标签 */
.super-admin-tag {
  color: #E6A23C;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* 分页 */
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 弹窗 */
.dialog-form {
  margin-top: 10px;
  padding-right: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* 统一按钮色调 (Green Theme 适配) */
:deep(.el-button--primary) {
  --el-button-bg-color: #1a5e38;
  --el-button-border-color: #1a5e38;
  --el-button-hover-bg-color: #2a7d4a;
  --el-button-hover-border-color: #2a7d4a;
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #1a5e38;
}
</style>