<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>个人信息中心</h1>
      <el-button 
        type="primary" 
        size="mini" 
        @click="fetchUserInfo"
        class="refresh-btn"
      >
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
    </div>

    <!-- 加载状态 -->
    <el-loading 
      v-if="loading" 
      :fullscreen="true" 
      text="加载中..." 
    ></el-loading>

    <!-- 错误提示 -->
    <el-alert 
      v-if="error" 
      :message="error" 
      type="error" 
      show-icon 
      closable
      @close="error = null"
      class="error-alert"
    ></el-alert>

    <div v-else class="content-wrapper">
      <!-- 个人资料卡片 -->
      <el-card class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            <el-icon class="avatar-icon"><User /></el-icon>
          </div>
          <div class="user-info">
            <h2>{{ user.realName || user.username }}</h2>
            <p>@{{ user.username }}</p>
          </div>
          <el-button 
            type="primary" 
            size="mini" 
            @click="showEditDialog = true"
          >
            <el-icon><Edit /></el-icon> 编辑资料
          </el-button>
        </div>
        
        <!-- 个性签名 -->
        <div class="signature">
          <p>{{ user.introduction || '暂无个性签名' }}</p>
        </div>
      </el-card>

      <!-- 信息列表 -->
      <el-row :gutter="20" class="info-row">
        <el-col :span="24" :md="12">
          <el-card class="info-card">
            <div slot="header" class="card-title">
              <el-icon><User /></el-icon> 基本信息
            </div>
            <el-form label-width="100px" class="info-form">
              <el-form-item label="用户ID">
                <span>#{{ user.id }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ user.username }}</span>
              </el-form-item>
              <el-form-item label="真实姓名">
                <span>{{ user.realName || '<span class="text-red-500">未设置</span>' }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="24" :md="12">
          <el-card class="info-card">
            <div slot="header" class="card-title">
              <el-icon><Message /></el-icon> 联系信息
            </div>
            <el-form label-width="100px" class="info-form">
              <el-form-item label="邮箱">
                <span>{{ user.email || '<span class="text-red-500">未设置</span>' }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ user.phone || '<span class="text-red-500">未设置</span>' }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="24">
          <el-card class="info-card">
            <div slot="header" class="card-title">
              <el-icon><Document /></el-icon> 账户信息
            </div>
            <el-form label-width="120px" class="info-form" :model="user">
              <el-row :gutter="20">
                <el-col :span="24" :md="12">
                  <el-form-item label="注册时间">
                    <span>{{ formatDateTime(user.createTime) || '未知' }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :md="12">
                  <el-form-item label="最后更新">
                    <span>{{ formatDateTime(user.updateTime) || '未知' }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :md="12">
                  <el-form-item label="密码">
                    <span>•••••••• <span class="text-gray-500 text-xs">(已隐藏)</span></span>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :md="12">
                  <el-form-item label="资料完整度">
                    <!-- 进度条：根据完整度显示不同颜色，100%时显示成功色 -->
                    <el-progress 
                      :percentage="completion" 
                      :status="getProgressStatus()"
                      stroke-width="8"
                      style="width: 180px; display: inline-block;"
                    ></el-progress>
                    <span class="ml-3 text-lg font-medium">{{ completion }}%</span>
                    <!-- 未完善字段提示 -->
                    <p class="mt-2 text-sm text-gray-500" v-if="incompleteFields.length > 0">
                      未完善：{{ incompleteFields.join('、') }}
                    </p>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog 
      v-model="showEditDialog" 
      title="编辑个人信息" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="100px"
        class="edit-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" readonly placeholder="用户名不可修改" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="个性签名" prop="introduction">
          <el-input 
            v-model="form.introduction" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入个性签名" 
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      
      <div slot="footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs, watch, computed } from 'vue';
import { getUser, updateUser } from '@/api/user';
import { User, Edit, Refresh, Message, Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 状态管理
const state = reactive({
  user: {
    id: null,
    username: '',
    realName: '',
    email: '',
    phone: '',
    introduction: '',
    createTime: null,
    updateTime: null
  },
  form: {
    id: null,
    username: '',
    realName: '',
    email: '',
    phone: '',
    introduction: ''
  },
  loading: true,
  error: null,
  showEditDialog: false,
  formChanged: false
});

const { user, form, loading, error, showEditDialog, formChanged } = toRefs(state);

// 表单验证规则
const rules = ref({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
});

// 表单引用
const formRef = ref(null);

// 1. 计算资料完整度（总分100%，5个字段各20%）
const completion = computed(() => {
  let score = 0;
  // 统计所有需要完善的字段（共5个，每个20分）
  const fields = [
    { key: 'username', required: true }, // 用户名（必选，默认有值）
    { key: 'realName', required: false },
    { key: 'email', required: false },
    { key: 'phone', required: false },
    { key: 'introduction', required: false }
  ];

  // 计算得分
  fields.forEach(field => {
    // 用户名默认有值，直接得分；其他字段有值则得分
    if (field.required || (user.value[field.key] && user.value[field.key].trim() !== '')) {
      score += 20;
    }
  });

  return score; // 范围：0-100，所有字段填完时正好100%
});

// 2. 未完善字段列表（提示用户需要补什么）
const incompleteFields = computed(() => {
  const fieldsMap = {
    realName: '真实姓名',
    email: '邮箱',
    phone: '手机号',
    introduction: '个性签名'
  };
  const incomplete = [];

  // 遍历字段，收集未完善的
  Object.entries(fieldsMap).forEach(([key, label]) => {
    if (!user.value[key] || user.value[key].trim() === '') {
      incomplete.push(label);
    }
  });

  return incomplete;
});

// 3. 进度条状态（根据完整度显示不同颜色）
const getProgressStatus = () => {
  if (completion.value === 100) return 'success'; // 100% 绿色
  if (completion.value >= 60) return 'warning';  // 60%-99% 黄色
  return 'info';                                 // <60% 蓝色
};

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  try {
    const date = new Date(dateTime);
    return date.toLocaleString('zh-CN');
  } catch (e) {
    return dateTime;
  }
};

// 获取用户信息
const fetchUserInfo = async () => {
  state.loading = true;
  state.error = null;
  
  try {
    const response = await getUser();
    if (response.code) {
      state.user = { ...response.data };
    } else {
      state.error = response.message || '获取信息失败';
    }
  } catch (err) {
    state.error = '网络错误：' + (err.message || '无法连接服务器');
  } finally {
    state.loading = false;
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    const response = await updateUser(state.form);
    if (response.code) {
      ElMessage.success('信息更新成功');
      state.user = { ...state.form };
      state.showEditDialog = false;
      state.formChanged = false;
    } else {
      ElMessage.error(response.message || '更新失败');
    }
  } catch (err) {
    ElMessage.error('请检查输入内容是否正确');
  }
};

// 监听表单变化
watch(form, (newVal, oldVal) => {
  if (oldVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
    state.formChanged = true;
  }
}, { deep: true });

// 监听编辑弹窗显示
watch(showEditDialog, (value) => {
  if (value) {
    state.form = { ...state.user };
    state.formChanged = false;
  }
});

// 初始化
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
/* 基础样式不变，新增以下样式 */
/* 未设置字段的红色提示 */
.text-red-500 {
  color: #f56c6c;
}

/* 进度条旁的提示文字 */
.info-form .el-form-item:last-child p {
  margin-bottom: 0;
}

/* 确保富文本格式生效 */
.info-form span {
  white-space: normal;
}

/* 其他原有样式保持不变... */
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 20px;
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
}

.error-alert {
  margin-bottom: 20px;
}

.content-wrapper {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.avatar-icon {
  font-size: 40px;
  color: #409eff;
}

.user-info h2 {
  margin: 0 0 5px 0;
  font-size: 20px;
}

.user-info p {
  margin: 0;
  color: #666;
}

.profile-header .el-button {
  margin-left: auto;
}

.signature {
  padding: 20px;
  color: #666;
  border-left: 3px solid #409eff;
  margin: 10px 20px;
  background-color: #f5f7fa;
}

.info-row {
  margin-bottom: 20px;
}

.info-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-title {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.card-title el-icon {
  margin-right: 5px;
}

.info-form {
  margin-top: 10px;
}

.info-form .el-form-item {
  margin-bottom: 15px;
}

.edit-form {
  margin-top: 15px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .profile-header .el-button {
    margin-left: 0;
    margin-top: 15px;
    width: 100%;
  }
}
</style>