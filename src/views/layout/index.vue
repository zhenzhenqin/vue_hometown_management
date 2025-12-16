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
  CaretBottom, // 下拉箭头图标
  SwitchButton // 退出按钮图标
} from '@element-plus/icons-vue'
import { getUserInfo, clearAuth } from '@/utils/auth' // 引入之前封装的工具

const router = useRouter()
const username = ref('管理员') // 默认显示，获取数据后会覆盖

// 1. 初始化时获取当前登录用户信息
onMounted(() => {
  const userInfo = getUserInfo()
  if (userInfo && userInfo.username) {
    username.value = userInfo.username
  }
})

// 2. 退出登录处理函数
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出系统吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 执行退出逻辑
    clearAuth() // 清除 token 和 info
    localStorage.clear() // 清除本地存储
    ElMessage.success('已安全退出')
    router.push('/login') // 跳转回登录页
  }).catch(() => {
    // 取消退出，不做操作
  })
}

// 菜单处理（保持原样）
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="title">衢州地区信息管理系统</span>
          <div class="subtitle">南孔圣地 · 衢州有礼</div>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-avatar :size="32" class="user-avatar" icon="UserFilled" />
              <span class="username-text">{{ username }}</span>
              <el-icon class="el-icon--right">
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu router default-active="/index" class="el-menu-vertical-demo" @open="handleOpen"
            @close="handleClose">

            <el-menu-item index="/index">
              <el-icon>
                <Promotion />
              </el-icon>
              <span>首页</span>
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
                </el-icon>
                <span>信息介绍</span>
              </template>
              <el-menu-item index="/culture">
                <el-icon>
                  <Document />
                </el-icon>
                文化模块
              </el-menu-item>
              <el-menu-item index="/specialties">
                <el-icon>
                  <Chicken />
                </el-icon>
                特产模块
              </el-menu-item>
              <el-menu-item index="/attraction">
                <el-icon>
                  <LocationFilled />
                </el-icon>
                景点模块
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<style scoped>
/* Header 样式重构为 Flex 布局 */
.header {
  background-image: linear-gradient(to right, #1a5e38, #2a8c54, #3aad6e, #56c886, #74e49f);
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex; /* 开启 Flex */
  justify-content: space-between; /* 左右贴边 */
  align-items: center; /* 垂直居中 */
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.title {
  color: white;
  font-size: 24px; /*稍微调小一点，适配不同屏幕*/
  font-family: "楷体", "KaiTi", serif;
  font-weight: bolder;
  margin-right: 20px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-family: "宋体", "SimSun", serif;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 15px;
  height: 24px;
  line-height: 24px;
}

/* 右侧用户区域样式 */
.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #fff;
  transition: all 0.3s;
  padding: 5px 10px;
  border-radius: 20px;
}

.el-dropdown-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  background-color: #fff;
  color: #1a5e38;
  margin-right: 8px;
}

.username-text {
  font-size: 16px;
  font-weight: 500;
  margin-right: 5px;
}

/* 侧边栏样式 */
.aside {
  width: 220px;
  background-color: #f9fbf8;
  border-right: 1px solid #d9e2d6;
  height: calc(100vh - 60px);
}

::v-deep .el-menu-vertical-demo {
  background-color: #f9fbf8;
  border-right: none;
}

::v-deep .el-menu-item,
::v-deep .el-sub-menu__title {
  color: #333;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  transition: all 0.3s;
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

el-main {
  background-color: #ffffff;
  padding: 20px;
}
</style>