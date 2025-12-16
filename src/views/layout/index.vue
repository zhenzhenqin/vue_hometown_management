<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { 
  Promotion, 
  User, 
  Menu, 
  Document, 
  Chicken, 
  LocationFilled, 
  CaretBottom, 
  SwitchButton, 
  Lock,         
  UserFilled,
  Setting,
  School // 1. 新增 School 图标
} from '@element-plus/icons-vue'
import { getUserInfo, clearAuth } from '@/utils/auth'
import { updatePassword } from '@/api/admin' 

const router = useRouter()
const username = ref('管理员')

// 页脚信息 - 请修改为你自己的信息
const footerInfo = ref({
  studentId: '23H034160336',
  name: '毛靖晨',
  email: '3378405015@qq.com',
  phone: '19817193250'
})

// 获取管理员ID (用于修改密码)
const adminId = ref(null)

onMounted(() => {
  const userInfo = getUserInfo()
  if (userInfo && userInfo.username) {
    username.value = userInfo.username
    adminId.value = userInfo.id
  }
})

const handleCommand = (command) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command === 'password') {
    openPasswordDialog()
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出系统吗？','提示',{
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => {
    clearAuth()
    ElMessage.success('已安全退出')
    router.push('/login')
  }).catch(() => {})
}

// =======================
// 修改密码逻辑 (保留你的原有逻辑)
// =======================
const passDialogVisible = ref(false)
const passFormRef = ref(null)
const passForm = ref({ oldPassword:'', newPassword:'', confirmPassword:'' })

const validatePass2 = (rule, value, callback) => {
  if (value === '') { callback(new Error('请再次输入密码')) }
  else if (value !== passForm.value.newPassword) { callback(new Error('两次输入密码不一致!')) }
  else { callback() }
}
const passRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
}

const openPasswordDialog = () => {
  passDialogVisible.value = true
  if (passFormRef.value) passFormRef.value.resetFields()
  passForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
}

const submitPassword = () => {
  if (!passFormRef.value) return
  passFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const params = {
          adminId: adminId.value,
          oldPassword: passForm.value.oldPassword,
          newPassword: passForm.value.newPassword
        }
        const res = await updatePassword(params)
        if (res.code === 1) {
          ElMessage.success('密码修改成功，请重新登录')
          passDialogVisible.value = false
          clearAuth()
          router.push('/login')
        } else {
          ElMessage.error(res.msg || '修改失败')
        }
      } catch (error) { console.error(error) }
    }
  })
}
</script>

<template>
  <div class="common-layout">
    <el-container class="outer-container">
      
      <el-header class="header">
        <div class="header-left">
          <span class="title">衢州地区信息管理系统</span>
          <div class="subtitle">南孔圣地 · 衢州有礼</div>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar :size="32" class="user-avatar" :icon="UserFilled" />
              <span class="username-text">{{ username }}</span>
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item command="password"><el-icon><Lock /></el-icon>修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout" class="logout-item"><el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="inner-container">
        <el-aside width="220px" class="aside">
          <el-menu router default-active="/index" class="el-menu-vertical-demo">
            
            <el-menu-item index="/index">
              <el-icon><Promotion /></el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-menu-item index="/school">
              <el-icon><School /></el-icon>
              <span>学校展示</span>
            </el-menu-item>

            <el-menu-item index="/admin">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>

            <el-sub-menu index="/manage1">
              <template #title>
                <el-icon><Menu /></el-icon><span>信息介绍</span>
              </template>
              <el-menu-item index="/culture"><el-icon><Document /></el-icon>文化模块</el-menu-item>
              <el-menu-item index="/specialties"><el-icon><Chicken /></el-icon>特产模块</el-menu-item>
              <el-menu-item index="/attraction"><el-icon><LocationFilled /></el-icon>景点模块</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/system">
              <template #title>
                <el-icon><Setting /></el-icon><span>系统管理</span>
              </template>
              <el-menu-item index="/adminList"><el-icon><UserFilled /></el-icon>管理员列表</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-container is-vertical class="content-wrapper">
          <el-main>
            <router-view></router-view>
          </el-main>

          <el-footer class="footer">
            <div class="footer-content">
              <span>&copy; 2025.12 Java Web 期末大作业</span>
              <el-divider direction="vertical" />
              <span>学号：{{ footerInfo.studentId }}</span>
              <el-divider direction="vertical" />
              <span>姓名：{{ footerInfo.name }}</span>
              <el-divider direction="vertical" />
              <span>邮箱：{{ footerInfo.email }}</span>
              <el-divider direction="vertical" />
              <span>电话：{{ footerInfo.phone }}</span>
            </div>
          </el-footer>
        </el-container>

      </el-container>
    </el-container>

    <el-dialog v-model="passDialogVisible" title="修改密码" width="500px" :close-on-click-modal="false" center destroy-on-close>
      <el-form ref="passFormRef" :model="passForm" :rules="passRules" label-width="100px" style="padding-right: 20px; padding-top: 10px;">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" type="password" show-password placeholder="请输入当前使用的密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" type="password" show-password placeholder="请输入新密码（6-20位）" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped>
/* 保持你原有的 Header 和 Aside 样式 */
.header {
  background-image: linear-gradient(to right, #1a5e38, #2a8c54, #3aad6e, #56c886, #74e49f);
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.header-left { display: flex; align-items: center; }
.title { color: white; font-size: 24px; font-weight: bolder; margin-right: 20px; font-family: "楷体"; }
.subtitle { color: rgba(255,255,255,0.9); font-size: 16px; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 15px; height: 24px; line-height: 24px; }
.header-right { display: flex; align-items: center; }
.el-dropdown-link { cursor: pointer; display: flex; align-items: center; color: #fff; padding: 6px 12px; border-radius: 30px; background-color: rgba(255, 255, 255, 0.1); }
.el-dropdown-link:hover { background-color: rgba(255, 255, 255, 0.25); }
.user-avatar { background-color: #fff; color: #1a5e38; margin-right: 10px; }
.username-text { font-size: 16px; font-weight: 600; margin-right: 5px; }

/* 布局调整 - 关键 */
.outer-container {
  height: 100vh; /* 占满全屏 */
  display: flex;
  flex-direction: column;
}

.inner-container {
  flex: 1; /* 占据 Header 剩下的空间 */
  overflow: hidden; /* 防止双重滚动条 */
}

.aside {
  background-color: #f9fbf8;
  border-right: 1px solid #d9e2d6;
  overflow-y: auto;
}

/* 右侧内容包裹器 (Main + Footer) */
.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
}

.el-main {
  flex: 1; /* 撑开剩余空间 */
  padding: 20px;
  overflow-y: auto; /* 内容溢出时滚动 */
}

/* 页脚样式 */
.footer {
  height: 40px; /* 固定高度 */
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 菜单样式 */
::v-deep .el-menu-vertical-demo { border-right: none; background-color: #f9fbf8; }
::v-deep .el-menu-item, ::v-deep .el-sub-menu__title { color: #333; height: 50px; line-height: 50px; font-size: 15px; }
::v-deep .el-menu-item:hover, ::v-deep .el-sub-menu__title:hover { background-color: #eaf5e6; color: #1a5e38; }
::v-deep .el-menu-item.is-active { background-color: #d9ead3; color: #1a5e38; font-weight: bold; }
::v-deep .el-menu-item.is-active::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background-color: #1a5e38; }
:global(.custom-dropdown .el-dropdown-menu__item) { padding: 10px 20px; font-size: 14px; }
:global(.logout-item) { color: #f56c6c; }
:global(.logout-item:hover) { background-color: #fef0f0 !important; color: #f56c6c !important; }
</style>