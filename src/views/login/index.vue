<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-left">
        <div class="left-content">
          <div class="logo-area">
            <div class="logo-circle">
              <el-icon><ElementPlus /></el-icon>
            </div>
            <span class="logo-text">衢州文旅管理</span>
          </div>
          <div class="illustration">
            <img 
              src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="浙西山水" 
            />
            <div class="overlay-text">
              <h3>探寻浙西山水</h3>
              <p>品味千年人文，传承匠心工艺</p>
            </div>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="form-container">
          <div class="welcome-text">
            <h2>欢迎回来 👋</h2>
            <p>请输入您的账号信息进行登录</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
            hide-required-asterisk
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                class="custom-input"
              />
            </el-form-item>

            <el-form-item prop="code">
              <div class="captcha-row">
                <el-input
                  v-model="loginForm.code"
                  placeholder="计算结果"
                  :prefix-icon="Key"
                  class="custom-input captcha-input"
                  @keyup.enter="handleLogin"
                />
                <div class="captcha-box" @click="refreshCaptcha" title="点击刷新">
                  <img
                    v-if="captchaUrl"
                    :src="captchaUrl"
                    alt="验证码"
                    class="captcha-img"
                  />
                  <div v-else class="captcha-placeholder">
                    <el-icon class="is-loading"><Loading /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>

            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              @click="handleLogin"
            >
              立即登录
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key, ElementPlus, Loading, ArrowRight } from '@element-plus/icons-vue'
import { login, getCaptchaImage } from '@/api/admin'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const captchaUrl = ref('')

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  code: '',
  uuid: ''
})

// 校验规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码结果', trigger: 'blur' }]
}

// 获取验证码
const refreshCaptcha = async () => {
  captchaUrl.value = '' // 先清空，显示loading
  try {
    const res = await getCaptchaImage()
    if (res.code === 1) {
      loginForm.value.uuid = res.data.uuid
      // 注意：确保前缀与后端返回的图片格式一致 (jpg/png/gif)
      captchaUrl.value = 'data:image/jpeg;base64,' + res.data.img
    }
  } catch (error) {
    ElMessage.error('验证码获取失败，请检查网络')
  }
}

// 登录处理
const handleLogin = () => {
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      const res = await login(loginForm.value)
      if (res.code === 1) {
        ElMessage.success({
          message: '登录成功，欢迎' + loginForm.value.username + '！',
          type: 'success',
          plain: true,
        })
        
        // 1. 存储 Token 和用户信息
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('adminInfo', JSON.stringify({
          id: res.data.id,
          username: res.data.username
        }))

        // 2. 路由跳转 (根据你的路由配置，首页是 /index)
        router.push('/index')
      } else {
        ElMessage.error(res.msg || '登录失败，请检查输入')
        refreshCaptcha() // 刷新验证码
      }
    } catch (error) {
      refreshCaptcha()
    } finally {
      loading.value = false
    }
  })
}

// 初始化
onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
/* =========================================
   1. 全屏背景：渲染山水氛围
   ========================================= */
.login-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* 使用同一张山水图作为底图 */
  background: url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
}

/* 增加一层遮罩：制造磨砂玻璃/模糊效果，让背景不抢眼 */
.login-wrapper::before {
  content: "";
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  /* 叠加深绿色半透明层，呼应主题色 */
  background-color: rgba(26, 94, 56, 0.15); 
  /* 关键：高斯模糊，营造景深感 */
  backdrop-filter: blur(8px); 
  z-index: 0;
}

/* =========================================
   2. 登录主盒子
   ========================================= */
.login-box {
  position: relative; /* 确保在遮罩层之上 */
  z-index: 1;
  width: 1000px;
  height: 600px;
  background: #ffffff;
  border-radius: 20px;
  /* 加深阴影，让卡片在复杂背景上更立体 */
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  overflow: hidden;
}

/* --- 左侧区域 --- */
.login-left {
  flex: 1.2;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.left-content {
  height: 100%;
  position: relative;
}

/* 左侧图片：保持清晰，与背景的模糊形成对比 */
.illustration img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 10s ease;
}
.login-left:hover .illustration img {
  transform: scale(1.05);
}

/* 图片上的文字遮罩 */
.overlay-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px;
  /* 渐变遮罩，保证文字清晰 */
  background: linear-gradient(to top, rgba(0,50,20,0.8), transparent);
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.overlay-text h3 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 1px;
}
.overlay-text p {
  font-size: 16px;
  opacity: 0.95;
  font-weight: 300;
}

/* Logo 区域 */
.logo-area {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  backdrop-filter: blur(5px);
}
.logo-circle {
  width: 32px;
  height: 32px;
  background: #1a5e38;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.logo-text {
  font-weight: bold;
  color: #1a5e38;
  font-size: 16px;
  letter-spacing: 0.5px;
}

/* --- 右侧区域 --- */
.login-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #fff;
}

.form-container {
  width: 100%;
  max-width: 360px;
}

.welcome-text {
  margin-bottom: 35px;
}
.welcome-text h2 {
  font-size: 28px;
  color: #1a5e38; /* 标题改用主色调 */
  margin-bottom: 8px;
  font-weight: 700;
}
.welcome-text p {
  color: #999;
  font-size: 14px;
}

/* 自定义 Input 样式覆盖 */
:deep(.custom-input .el-input__wrapper) {
  box-shadow: none;
  background-color: #f7f9fc;
  border: 1px solid #eef0f5;
  border-radius: 8px;
  padding: 10px 15px; /* 加大一点内边距 */
  transition: all 0.3s;
}

:deep(.custom-input .el-input__wrapper:hover) {
  background-color: #fff;
  border-color: #c2d9cc;
}

:deep(.custom-input .el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: #1a5e38;
  box-shadow: 0 0 0 3px rgba(26, 94, 56, 0.15);
}

/* 验证码行 */
.captcha-row {
  display: flex;
  gap: 12px;
}
.captcha-box {
  width: 120px;
  height: 52px; /* 高度匹配 */
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eef0f5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.3s;
}
.captcha-box:hover {
  border-color: #1a5e38;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.captcha-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 登录按钮 */
.submit-btn {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background-color: #1a5e38;
  border: none;
  margin-top: 15px;
  transition: transform 0.1s, background-color 0.3s, box-shadow 0.3s;
}
.submit-btn:hover {
  background-color: #247f4d;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(26, 94, 56, 0.25);
}
.submit-btn:active {
  transform: translateY(0);
}

/* 响应式适配 */
@media (max-width: 900px) {
  .login-box {
    width: 90%;
    min-height: 500px;
    flex-direction: column;
  }
  .login-left {
    display: none;
  }
  .login-right {
    padding: 60px 20px;
  }
}
</style>