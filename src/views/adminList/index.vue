<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  RefreshLeft, 
  Plus, 
  Edit, 
  UserFilled, 
  Location, 
  Key 
} from '@element-plus/icons-vue'
// 引入API (确保你的 api/admin.js 中导出了这些方法)
import { 
  getAdminList, 
  addAdmin, 
  getAdminById, 
  updateAdmin, 
  changeAdminStatus 
} from '@/api/admin'

// --- 1. 列表数据 ---
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  username: ''
})

// --- 2. 表单与弹窗数据 ---
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)

const formData = reactive({
  id: null,
  username: '',
  password: '', // ✨ 新增：密码字段
  realName: '',
  phone: '',
  email: '',
  status: 1
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度 3-20 位', trigger: 'blur' }
  ],
  // ✨ 密码校验：仅在新增时生效 (通过 v-if 控制 DOM，校验逻辑自动适配)
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度 6-20 位', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

// ================= 方法定义 =================

// 获取列表
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

// 搜索
const handleSearch = () => {
  queryParams.page = 1
  fetchList()
}
const resetQuery = () => {
  queryParams.username = ''
  handleSearch()
}

// 状态切换
const handleStatusChange = async (row) => {
  if (row.username === 'admin') {
    row.status = 1
    ElMessage.warning('超级管理员无法被禁用')
    return
  }
  const text = row.status === 1 ? '启用' : '禁用'
  try {
    const res = await changeAdminStatus(row.status, row.id)
    if (res.code === 1) {
      ElMessage.success(`${text}成功`)
    } else {
      row.status = row.status === 1 ? 0 : 1 // 失败回滚
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('操作失败')
  }
}

// 打开新增
const handleAdd = () => {
  dialogTitle.value = '新增管理员'
  dialogVisible.value = true
  
  // 重置表单
  formData.id = null
  formData.username = ''
  formData.password = '' 
  formData.realName = ''
  formData.phone = ''
  formData.email = ''
  formData.status = 1
  
  if (formRef.value) formRef.value.resetFields()
}

// 打开编辑
const handleEdit = async (id) => {
  dialogTitle.value = '编辑管理员'
  dialogVisible.value = true
  if (formRef.value) formRef.value.resetFields()
  
  try {
    const res = await getAdminById(id)
    if (res.code === 1) {
      Object.assign(formData, res.data)
      formData.password = '' // ✨ 编辑模式下不回显密码
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let res
        if (formData.id) {
          res = await updateAdmin(formData)
        } else {
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


// 分页
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  fetchList()
}
const handleCurrentChange = (val) => {
  queryParams.page = val
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="admin-page-container">
    <h1 class="page-title">管理员管理</h1>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="queryParams" class="search-form">
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
        :header-cell-style="{ background: '#f9fafb', color: '#4b5563', fontWeight: '600' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        
        <el-table-column label="登录账号" prop="username" align="center" width="180">
          <template #default="scope">
            <div v-if="scope.row.username === 'admin'" class="super-admin-tag">
              <el-icon><UserFilled /></el-icon> 超级管理员
            </div>
            <span v-else class="username-text">{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column label="真实姓名" prop="realName" align="center" width="100" />
        
        <el-table-column label="最后登录IP" prop="ip" align="center" width="230">
          <template #default="scope">
            <span class="mono-font">{{ scope.row.ip || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="IP归属地" prop="city" align="center" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.city" type="info" size="small" effect="light">
              <el-icon style="vertical-align: middle; margin-right: 2px"><Location /></el-icon>
              {{ scope.row.city }}
            </el-tag>
            <span v-else class="text-gray">-</span>
          </template>
        </el-table-column>

        <el-table-column label="手机号码" prop="phone" align="center" width="120" />
        
        <el-table-column label="状态" align="center" width="80">
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
            <span class="mono-font" style="font-size: 12px;">
              {{ scope.row.createTime ? scope.row.createTime.replace('T', ' ') : '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template #default="scope">
            <div v-if="scope.row.username !== 'admin'" class="action-buttons">
              <el-button 
                type="primary" 
                link 
                size="small" 
                @click="handleEdit(scope.row.id)" 
                :icon="Edit"
              >
                编辑
              </el-button>
            </div>
            <el-tag v-else type="info" size="small">禁止操作</el-tag>
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
      destroy-on-close
    >
      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules" 
        label-width="90px" 
        class="dialog-form"
      >
        <el-form-item label="登录账号" prop="username">
          <el-input 
            v-model="formData.username" 
            placeholder="请输入登录账号" 
            :disabled="!!formData.id"
          />
        </el-form-item>

        <el-form-item 
          label="初始密码" 
          prop="password" 
          v-if="!formData.id"
        >
          <el-input 
            v-model="formData.password" 
            placeholder="请输入初始密码" 
            type="password" 
            show-password
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
.admin-page-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  border-left: 4px solid #1a5e38;
  padding-left: 12px;
}

/* 搜索区 */
.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  border: none;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.search-input {
  width: 220px;
}

/* 操作区 */
.operation-bar {
  margin-bottom: 16px;
}
.add-btn {
  padding: 9px 20px;
}

/* 表格区 */
.table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.super-admin-tag {
  color: #e6a23c;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
}
.username-text {
  font-weight: 500;
  color: #333;
}

/* ✨ IP 专用等宽字体样式 */
.mono-font {
  font-family: "Menlo", "Monaco", "Consolas", "Courier New", monospace;
  color: #606266;
  font-size: 13px;
  background: #f4f4f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.text-gray {
  color: #c0c4cc;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 分页 */
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

/* 弹窗 */
.dialog-form {
  padding-right: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 主题色适配 */
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