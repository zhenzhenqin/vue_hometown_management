<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Promotion, User, Menu, Document, Chicken, LocationFilled,
  CaretBottom, SwitchButton, Lock, UserFilled, Setting,
  School, DataLine, Notebook, Odometer, 
  Cpu 
} from '@element-plus/icons-vue'
import { updatePassword } from '@/api/admin' 

const router = useRouter()

// 页脚信息 
const footerInfo = ref({
  studentId: '23H034160336',
  name: '毛靖晨',
  email: '3378405015@qq.com',
  phone: '19817193250'
})

// 管理员信息
const adminId = ref(null)
const username = ref('管理员')

// 初始化
onMounted(() => {
  const adminStr = localStorage.getItem('adminInfo')
  if (adminStr) {
    try {
      const admin = JSON.parse(adminStr)
      adminId.value = admin.id
      username.value = admin.username || '管理员'
    } catch (e) {
      console.error("JSON解析失败", e)
    }
  }
})

// 下拉菜单
const handleCommand = (command) => {
  if (command === 'logout') handleLogout()
  else if (command === 'password') openPasswordDialog()
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出系统吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminInfo')
    ElMessage.success('已安全退出')
    router.push('/login')
  }).catch(() => { })
}

// 修改密码相关
const passDialogVisible = ref(false)
const passFormRef = ref(null)
const passForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

const validatePass2 = (rule, value, callback) => {
  if (value === '') callback(new Error('请再次输入密码'))
  else if (value !== passForm.value.newPassword) callback(new Error('两次输入密码不一致!'))
  else callback()
}
const passRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 20, message: '6-20个字符', trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
}

const openPasswordDialog = () => {
  passDialogVisible.value = true
  if (passFormRef.value) passFormRef.value.resetFields()
}

const submitPassword = () => {
  if (!passFormRef.value) return
  passFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await updatePassword({
          id: adminId.value, // 注意参数名需跟后端DTO一致
          oldPassword: passForm.value.oldPassword,
          newPassword: passForm.value.newPassword
        })
        if (res.code === 1) {
          ElMessage.success('密码修改成功，请重新登录')
          passDialogVisible.value = false
          localStorage.clear()
          router.push('/login')
        } else {
          ElMessage.error(res.msg || '修改失败')
        }
      } catch (error) { ElMessage.error('网络请求异常') }
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
          <el-tooltip content="GitHub 源码" placement="bottom">
            <a href="https://github.com/zhenzhenqin/hometown" target="_blank" class="github-link">
              <svg height="24" viewBox="0 0 16 16" width="24" style="fill: white;"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </a>
          </el-tooltip>
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
          <el-menu router :default-active="$route.path" class="el-menu-vertical-demo">
            <el-menu-item index="/index"><el-icon><Promotion /></el-icon><span>首页</span></el-menu-item>
            <el-menu-item index="/school"><el-icon><School /></el-icon><span>学校展示</span></el-menu-item>
            <el-menu-item index="/admin"><el-icon><User /></el-icon><span>个人信息</span></el-menu-item>

            <el-sub-menu index="/manage1">
              <template #title><el-icon><Menu /></el-icon><span>信息介绍</span></template>
              <el-menu-item index="/culture"><el-icon><Document /></el-icon>文化模块</el-menu-item>
              <el-menu-item index="/specialties"><el-icon><Chicken /></el-icon>特产模块</el-menu-item>
              <el-menu-item index="/attraction"><el-icon><LocationFilled /></el-icon>景点模块</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/system">
              <template #title><el-icon><Setting /></el-icon><span>系统管理</span></template>
              <el-menu-item index="/adminList"><el-icon><UserFilled /></el-icon>管理员列表</el-menu-item>
              <el-menu-item index="/user"><el-icon><User /></el-icon>用户列表</el-menu-item>
              <el-menu-item index="/log"><el-icon><Notebook /></el-icon>日志管理</el-menu-item>
              <el-menu-item index="/devlog"><el-icon><Cpu /></el-icon>系统进化</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/report">
              <template #title><el-icon><DataLine /></el-icon><span>数据统计</span></template>
              <el-menu-item index="/report/dashboard"><el-icon><Odometer /></el-icon>数据概览</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-container is-vertical class="content-wrapper">
          <el-main>
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </el-main>
          <el-footer class="footer">
            <div class="footer-content">
              <span>&copy; 2025.12 Java Web 期末大作业</span>
              <el-divider direction="vertical" />
              <span>学号：{{ footerInfo.studentId }}</span>
              <el-divider direction="vertical" />
              <span>姓名：{{ footerInfo.name }}</span>
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>

    <el-dialog v-model="passDialogVisible" title="修改密码" width="400px" center destroy-on-close>
      <el-form ref="passFormRef" :model="passForm" :rules="passRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPassword">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 原有样式保持不变，略作精简 */
.header {
  background-image: linear-gradient(to right, #1a5e38, #3aad6e);
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.title { color: white; font-size: 24px; font-weight: bolder; margin-right: 20px; font-family: "楷体"; }
.subtitle { color: rgba(255,255,255,0.9); font-size: 16px; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 15px; }
.header-right { display: flex; align-items: center; }
.github-link { margin-right: 20px; display: flex; align-items: center; cursor: pointer; opacity: 0.9; }
.github-link:hover { opacity: 1; transform: scale(1.1); transition: all 0.3s; }
.el-dropdown-link { cursor: pointer; display: flex; align-items: center; color: #fff; padding: 6px 12px; border-radius: 30px; background-color: rgba(255, 255, 255, 0.1); }
.el-dropdown-link:hover { background-color: rgba(255, 255, 255, 0.2); }
.user-avatar { background-color: #fff; color: #1a5e38; margin-right: 10px; }
.username-text { font-size: 14px; font-weight: 600; margin-right: 5px; }

.outer-container { height: 100vh; display: flex; flex-direction: column; }
.inner-container { flex: 1; overflow: hidden; }
.aside { background-color: #f9fbf8; border-right: 1px solid #e0e0e0; overflow-y: auto; }
.content-wrapper { display: flex; flex-direction: column; height: 100%; background-color: #f2f3f5; }
.el-main { flex: 1; padding: 20px; overflow-y: auto; }
.footer { height: 36px; background-color: #fff; border-top: 1px solid #ebeef5; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #909399; }

/* 菜单微调 */
::v-deep .el-menu-vertical-demo { border-right: none; background-color: #f9fbf8; }
::v-deep .el-menu-item.is-active { background-color: #e6f7eb; color: #1a5e38; border-right: 3px solid #1a5e38; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>