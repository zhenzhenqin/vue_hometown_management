<template>
  <div class="page-container">
    <div class="page-header">
      <h1>个人信息中心</h1>
      <el-button 
        type="primary" 
        size="small" 
        @click="fetchUserInfo"
        class="refresh-btn"
      >
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
    </div>

    <el-loading 
      v-if="loading" 
      :fullscreen="true" 
      text="加载中..." 
    ></el-loading>

    <div v-else class="content-wrapper">
      <el-card class="profile-card" shadow="hover">
        <div class="profile-header">
          <div class="avatar-box">
            <div class="avatar">
              <el-icon class="avatar-icon"><User /></el-icon>
            </div>
            <el-tag size="small" type="info" class="ip-tag" v-if="user.ip">
              IP: {{ user.ip }}
            </el-tag>
          </div>
          
          <div class="user-info">
            <div class="name-row">
              <h2>{{ user.realName || user.username }}</h2>
              <el-tag v-if="user.city" type="success" size="small" effect="plain" class="location-badge">
                <el-icon><Location /></el-icon> {{ user.city }}
              </el-tag>
            </div>
            <p>@{{ user.username }}</p>
          </div>
          
          <el-button 
            type="primary" 
            plain
            round
            @click="showEditDialog = true"
          >
            <el-icon><Edit /></el-icon> 编辑资料
          </el-button>
        </div>
        
        <div class="signature">
          <p>
            <el-icon><ChatDotRound /></el-icon> 
            {{ user.introduction || '这个人很懒，什么都没写~' }}
          </p>
        </div>
      </el-card>

      <el-row :gutter="20" class="info-row">
        <el-col :span="24" :md="12">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="card-title">
                <el-icon><User /></el-icon> 基本信息
              </div>
            </template>
            <el-form label-width="100px" class="info-form">
              <el-form-item label="用户ID">
                <span class="text-mono">#{{ user.id }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ user.username }}</span>
              </el-form-item>
              <el-form-item label="真实姓名">
                <span v-if="user.realName">{{ user.realName }}</span>
                <span v-else class="text-placeholder">未设置</span>
              </el-form-item>
              <el-form-item label="所在地">
                <span v-if="user.city">{{ user.city }}</span>
                <span v-else class="text-placeholder">未知地区</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="24" :md="12">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="card-title">
                <el-icon><Message /></el-icon> 联系信息
              </div>
            </template>
            <el-form label-width="100px" class="info-form">
              <el-form-item label="邮箱">
                <span v-if="user.email">{{ user.email }}</span>
                <span v-else class="text-placeholder">未设置</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span v-if="user.phone">{{ user.phone }}</span>
                <span v-else class="text-placeholder">未设置</span>
              </el-form-item>
              <el-form-item label="最近登录IP">
                <span class="text-mono">{{ user.ip || '未知' }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="24">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="card-title">
                <el-icon><Document /></el-icon> 账户状态
              </div>
            </template>
            <el-form label-width="120px" class="info-form">
              <el-row :gutter="20">
                <el-col :span="24" :md="12">
                  <el-form-item label="注册时间">
                    <span class="text-mono">{{ formatDateTime(user.createTime) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :md="12">
                  <el-form-item label="最后更新">
                    <span class="text-mono">{{ formatDateTime(user.updateTime) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24" :md="12">
                  <el-form-item label="资料完整度">
                    <div class="completion-box">
                      <el-progress 
                        :percentage="completion" 
                        :status="getProgressStatus()"
                        :stroke-width="10"
                        style="width: 200px"
                      ></el-progress>
                      <span class="completion-text" v-if="incompleteFields.length > 0">
                        还需完善：{{ incompleteFields.join('、') }}
                      </span>
                      <span class="completion-text success" v-else>
                        完美！资料已全部填好 🎉
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog 
      v-model="showEditDialog" 
      title="编辑个人信息" 
      width="500px"
      destroy-on-close
    >
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="个性签名" prop="introduction">
          <el-input 
            v-model="form.introduction" 
            type="textarea" 
            :rows="3" 
            placeholder="写一句话介绍自己..." 
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs, computed, watch } from 'vue';
import { getAdminById, updateAdmin } from '@/api/admin';
import { User, Edit, Refresh, Message, Document, Location, ChatDotRound } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const state = reactive({
  user: {
    id: null,
    username: '',
    realName: '',
    email: '',
    phone: '',
    introduction: '',
    createTime: null,
    updateTime: null,
    ip: '', 
    city: ''  // ✨ 修改点3：state中 location 改为 city
  },
  form: {},
  loading: true,
  submitting: false,
  showEditDialog: false
});

const { user, form, loading, submitting, showEditDialog } = toRefs(state);
const formRef = ref(null);

const rules = {
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }]
};

// 计算完整度
const completion = computed(() => {
  const fields = ['realName', 'email', 'phone', 'introduction'];
  // 注意：后端返回 email 为空字符串 ""，trim() 是安全的
  const filled = fields.filter(k => state.user[k] && state.user[k].trim()).length;
  return 20 + filled * 20;
});

const incompleteFields = computed(() => {
  const map = { realName: '姓名', email: '邮箱', phone: '手机', introduction: '签名' };
  return Object.keys(map).filter(k => !state.user[k] || !state.user[k].trim()).map(k => map[k]);
});

const getProgressStatus = () => {
  if (completion.value === 100) return 'success';
  if (completion.value >= 60) return 'warning';
  return 'exception';
};

const formatDateTime = (time) => {
  if (!time) return '暂无数据';
  return time.replace('T', ' ');
};

const fetchUserInfo = async () => {
  state.loading = true;
  try {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    if (!adminInfo.id) throw new Error('未登录');

    const res = await getAdminById(adminInfo.id);
    if (res.code === 1) {
      // ✨ 修改点4：直接解构赋值，因为 res.data 里包含了 city 和 ip
      // 且删除了之前的模拟数据代码
      state.user = { ...res.data };
    }
  } catch (err) {
    ElMessage.error(err.message || '获取信息失败');
  } finally {
    state.loading = false;
  }
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      state.submitting = true;
      try {
        const res = await updateAdmin(state.form);
        if (res.code === 1) {
          ElMessage.success('保存成功');
          state.showEditDialog = false;
          fetchUserInfo(); // 刷新数据
        } else {
          ElMessage.error(res.msg || '保存失败');
        }
      } catch (e) {
        ElMessage.error('网络异常');
      } finally {
        state.submitting = false;
      }
    }
  });
};

watch(showEditDialog, (val) => {
  if (val) {
    state.form = { ...state.user };
  }
});

onMounted(fetchUserInfo);
</script>

<style scoped>
/* 样式部分保持完全不变 */
.page-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h1 { margin: 0; font-size: 22px; color: #303133; }

/* 资料卡片 */
.profile-card {
  border-radius: 12px;
  margin-bottom: 24px;
  border: none;
  background: linear-gradient(to right bottom, #ffffff, #fcfcfc);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px 0;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #ecf5ff;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  border: 4px solid #fff;
}

.ip-tag {
  transform: scale(0.9);
}

.user-info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.location-badge :deep(.el-tag__content) {
  display: flex;        /* 强制内部内容使用 flex */
  align-items: center;  /* 强制垂直居中 */
  height: 100%;         /* 撑满高度 */
}

/* 如果觉得图标贴得太近，可以单独给图标加个右边距 */
.location-badge .el-icon {
  margin-right: 3px; 
}

.user-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.signature {
  margin-top: 20px;
  padding: 12px 16px;
  background: #f4f4f5;
  border-radius: 8px;
  color: #606266;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.signature p { margin: 0; display: flex; align-items: center; gap: 8px; }

/* 信息卡片通用 */
.info-row { margin-bottom: 20px; }
.info-card { border-radius: 8px; height: 100%; border: none; }
.card-title { display: flex; align-items: center; gap: 6px; font-weight: 600; color: #303133; }

.info-form .el-form-item { margin-bottom: 12px; }
.text-placeholder { color: #c0c4cc; font-size: 13px; font-style: italic; }
.text-mono { font-family: Monaco, Consolas, monospace; color: #606266; }

/* 进度条区域 */
.completion-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.completion-text { font-size: 12px; color: #909399; }
.completion-text.success { color: #67c23a; }

@media (max-width: 768px) {
  .profile-header { flex-direction: column; text-align: center; }
  .name-row { justify-content: center; }
  .profile-header .el-button { width: 100%; margin-top: 10px; }
}
</style>