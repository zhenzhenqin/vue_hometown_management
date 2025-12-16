<script setup>
import { ref, reactive, onMounted } from 'vue'
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
  School
} from '@element-plus/icons-vue'
import { updatePassword } from '@/api/admin'
import { getUserInfo, clearAuth } from '@/utils/auth' // 确保引入这些工具函数

const router = useRouter()

// 页脚信息 
const footerInfo = ref({
  studentId: '23H034160336',
  name: '毛靖晨',
  email: '3378405015@qq.com',
  phone: '19817193250'
})

// 获取管理员ID (用于修改密码)
const adminId = ref(null)
const username = ref('管理员')

// 1. 初始化
onMounted(() => {
  // 建议使用你在 utils/auth.js 中封装好的 getUserInfo，或者保持你原有的逻辑
  // 这里做一个兼容处理，防止 localStorage 为空报错
  try {
    const adminStr = localStorage.getItem('adminInfo')
    if (adminStr) {
      const admin = JSON.parse(adminStr)
      adminId.value = admin.id
      username.value = admin.username
    } else {
      // 如果本地没有存储，尝试从 auth 工具获取或重定向
      const userInfo = getUserInfo()
      if (userInfo) {
        username.value = userInfo.username
        adminId.value = userInfo.id
      }
    }
  } catch (e) {
    console.error("获取用户信息失败", e)
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
  ElMessageBox.confirm('确定要退出系统吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => {
    // 建议使用 clearAuth() 如果你封装了的话，或者手动清除
    localStorage.clear()
    ElMessage.success('已安全退出')
    router.push('/login')
  }).catch(() => { })
}

// 修改密码逻辑
const passDialogVisible = ref(false)
const passFormRef = ref(null)
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

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
          localStorage.clear() // 强制登出
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
          <el-tooltip content="访问 GitHub 源码仓库" placement="bottom" effect="light">
            <a href="https://github.com/zhenzhenqin/hometown" target="_blank" class="github-link">
              <svg height="28" viewBox="0 0 16 16" version="1.1" width="28" aria-hidden="true" style="fill: white;">
                <path fill-rule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
                </path>
              </svg>
            </a>
          </el-tooltip>

          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar :size="32" class="user-avatar" :icon="UserFilled" />
              <span class="username-text">{{ username }}</span>
              <el-icon class="el-icon--right">
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item command="password"><el-icon>
                    <Lock />
                  </el-icon>修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout" class="logout-item"><el-icon>
                    <SwitchButton />
                  </el-icon>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="inner-container">
        <el-aside width="220px" class="aside">
          <el-menu router default-active="/index" class="el-menu-vertical-demo">

            <el-menu-item index="/index">
              <el-icon>
                <Promotion />
              </el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-menu-item index="/school">
              <el-icon>
                <School />
              </el-icon>
              <span>学校展示</span>
            </el-menu-item>

            <el-menu-item index="/admin">
              <el-icon>
                <User />
              </el-icon>
              <span>个人信息</span>
            </el-menu-item>

            <el-sub-menu index="/manage1">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon><span>信息介绍</span>
              </template>
              <el-menu-item index="/culture"><el-icon>
                  <Document />
                </el-icon>文化模块</el-menu-item>
              <el-menu-item index="/specialties"><el-icon>
                  <Chicken />
                </el-icon>特产模块</el-menu-item>
              <el-menu-item index="/attraction"><el-icon>
                  <LocationFilled />
                </el-icon>景点模块</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/system">
              <template #title>
                <el-icon>
                  <Setting />
                </el-icon><span>系统管理</span>
              </template>
              <el-menu-item index="/adminList"><el-icon>
                  <UserFilled />
                </el-icon>管理员列表</el-menu-item>

              <el-menu-item index="/user">
                <el-icon>
                  <User />
                </el-icon>用户列表
              </el-menu-item>
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

    <el-dialog v-model="passDialogVisible" title="修改密码" width="500px" :close-on-click-modal="false" center
      destroy-on-close>
      <el-form ref="passFormRef" :model="passForm" :rules="passRules" label-width="100px"
        style="padding-right: 20px; padding-top: 10px;">
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

.header-left {
  display: flex;
  align-items: center;
}

.title {
  color: white;
  font-size: 24px;
  font-weight: bolder;
  margin-right: 20px;
  font-family: "楷体";
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 15px;
  height: 24px;
  line-height: 24px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* ⭐ 新增：GitHub 图标样式 ⭐ */
.github-link {
  margin-right: 20px;
  /* 与右侧头像的间距 */
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.github-link:hover {
  opacity: 0.8;
  /* 鼠标悬停时稍微透明 */
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 6px 12px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.1);
}

.el-dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.user-avatar {
  background-color: #fff;
  color: #1a5e38;
  margin-right: 10px;
}

.username-text {
  font-size: 16px;
  font-weight: 600;
  margin-right: 5px;
}

/* 布局调整 - 关键 */
.outer-container {
  height: 100vh;
  /* 占满全屏 */
  display: flex;
  flex-direction: column;
}

.inner-container {
  flex: 1;
  /* 占据 Header 剩下的空间 */
  overflow: hidden;
  /* 防止双重滚动条 */
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
  flex: 1;
  /* 撑开剩余空间 */
  padding: 20px;
  overflow-y: auto;
  /* 内容溢出时滚动 */
}

/* 页脚样式 */
.footer {
  height: 40px;
  /* 固定高度 */
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
::v-deep .el-menu-vertical-demo {
  border-right: none;
  background-color: #f9fbf8;
}

::v-deep .el-menu-item,
::v-deep .el-sub-menu__title {
  color: #333;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
}

::v-deep .el-menu-item:hover,
::v-deep .el-sub-menu__title:hover {
  background-color: #eaf5e6;
  color: #1a5e38;
}

::v-deep .el-menu-item.is-active {
  background-color: #d9ead3;
  color: #1a5e38;
  font-weight: bold;
}

::v-deep .el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #1a5e38;
}

:global(.custom-dropdown .el-dropdown-menu__item) {
  padding: 10px 20px;
  font-size: 14px;
}

:global(.logout-item) {
  color: #f56c6c;
}

:global(.logout-item:hover) {
  background-color: #fef0f0 !important;
  color: #f56c6c !important;
}
</style>