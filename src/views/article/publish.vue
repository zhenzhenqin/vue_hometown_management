<template>
  <div class="publish-container" :class="activeMood">
    <div class="glass-header">
      <div class="left-panel">
        <el-button circle icon="ArrowLeft" class="back-btn" @click="$router.back()" />
        <div class="mood-switcher">
          <span class="label">此刻心情:</span>
          <div 
            v-for="m in moods" 
            :key="m.key"
            class="mood-item"
            :class="{ active: form.mood === m.key }"
            @click="form.mood = m.key"
            :title="m.label"
          >
            {{ m.icon }}
          </div>
        </div>
      </div>

      <div class="right-panel">
        <el-button 
          type="primary" 
          class="publish-btn" 
          :loading="loading" 
          @click="handlePublish"
        >
          <el-icon class="el-icon--left"><Paperclip /></el-icon>
          发布瞬间
        </el-button>
      </div>
    </div>

    <div class="writing-zone">
      <input 
        v-model="form.title" 
        class="title-input" 
        :placeholder="moodPlaceholder"
        maxlength="50"
      />

      <div class="cover-section">
        <el-upload
          class="cover-uploader"
          action="/api/common/upload"
          :headers="uploadHeaders"
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeUpload"
        >
          <div v-if="form.coverImg" class="cover-preview" :style="{ backgroundImage: `url(${form.coverImg})` }">
            <div class="cover-mask"><el-icon><Edit /></el-icon> 更换封面</div>
          </div>
          <div v-else class="cover-placeholder">
            <el-icon><Picture /></el-icon> 添加一张有故事的封面
          </div>
        </el-upload>
      </div>

      <div class="editor-card glass-effect">
        <MdEditor 
          v-model="form.contentMd" 
          :theme="isDark ? 'dark' : 'light'"
          placeholder="在这里写下你的碎碎念... (支持截图粘贴、拖拽上传)"
          :toolbars="toolbars"
          @onUploadImg="onUploadImg"
          class="my-editor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { addArticle, getArticleDetail, updateArticle, uploadArticleImage } from '@/api/article';
import { ElMessage } from 'element-plus';
import confetti from 'canvas-confetti';

// === 引入 md-editor-v3 及其样式 ===
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const token = localStorage.getItem('token');
const uploadHeaders = { token: token }; 

// 心情配置
const moods = [
  { key: 'happy', icon: '😄', label: '开心', placeholder: '今天发生了什么好玩的事？' },
  { key: 'emo', icon: '🌧️', label: 'Emo', placeholder: '又是网抑云时刻吗？' },
  { key: 'calm', icon: '☕', label: '平静', placeholder: '内心毫无波澜...' },
  { key: 'angry', icon: '🔥', label: '暴躁', placeholder: '是谁惹你不爽了！' },
];

const form = reactive({
  id: null,
  title: '',
  contentMd: '',
  coverImg: '',
  mood: 'happy',
  isPublic: 1
});

// 编辑器工具栏配置 (按需精简)
const toolbars = [
  'bold', 'underline', 'italic', '-', 'title', 'strikeThrough', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task', '-',
  'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex', '-',
  'revoke', 'next', 'save', '=', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview', 'catalog'
];

// 根据心情动态调整编辑器主题 (可选)
const isDark = computed(() => ['emo', 'angry'].includes(form.mood));
const activeMood = computed(() => `mood-${form.mood}`);
const moodPlaceholder = computed(() => moods.find(m => m.key === form.mood)?.placeholder);

onMounted(async () => {
  if (route.params.id) {
    const res = await getArticleDetail(route.params.id);
    if (res.data) Object.assign(form, res.data);
  }
});

// === 处理编辑器图片上传 (md-editor-v3 方式) ===
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await uploadArticleImage(formData);
          // 假设后端返回 code=1 且 data 为图片URL
          if (res.code === 1) {
            resolve(res.data);
          } else {
            ElMessage.error(res.msg || '上传失败');
            reject(res.msg);
          }
        } catch (error) {
          ElMessage.error('网络错误');
          reject(error);
        }
      });
    })
  );
  
  // 回调将图片 URL 插入文档
  callback(res);
};

// 封面上传相关
const handleCoverSuccess = (res) => {
  if (res.code === 1) {
    form.coverImg = res.data;
    ElMessage.success('封面上传成功');
  }
};
const beforeUpload = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  return true;
};

// 发布逻辑
const handlePublish = async () => {
  if (!form.title) return ElMessage.warning('标题都不写，你想表达什么？😤');
  if (!form.contentMd) return ElMessage.warning('内容空空如也~ 👻');

  loading.value = true;
  try {
    const summary = form.contentMd.substring(0, 150).replace(/[#*`>]/g, '') + '...';
    const payload = { ...form, summary };

    if (form.id) {
      await updateArticle(payload);
      ElMessage.success('修改成功');
    } else {
      await addArticle(payload);
      triggerConfetti();
      ElMessage.success('发布成功！');
    }
    setTimeout(() => router.push('/article/list'), 1000);
  } finally {
    loading.value = false;
  }
};

const triggerConfetti = () => {
  confetti({ particleCount: 150, spread: 60 });
};
</script>

<style scoped lang="scss">
.publish-container {
  min-height: calc(100vh - 60px);
  padding: 20px;
  transition: all 0.5s ease;
  
  // 不同心情的背景色
  &.mood-happy { background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%); }
  &.mood-emo { background: linear-gradient(to top, #30cfd0 0%, #330867 100%); }
  &.mood-calm { background: linear-gradient(to right, #e0eafc, #cfdef3); }
  &.mood-angry { background: linear-gradient(to right, #eb5757, #000000); }
}

.glass-header {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.25); backdrop-filter: blur(10px);
  padding: 10px 20px; border-radius: 16px; margin-bottom: 30px;
  border: 1px solid rgba(255,255,255,0.2);
  
  .left-panel { display: flex; align-items: center; gap: 20px; }
  .mood-switcher {
    display: flex; align-items: center; gap: 10px;
    background: rgba(0,0,0,0.1); padding: 5px 10px; border-radius: 20px;
    .label { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: bold; }
    .mood-item { cursor: pointer; font-size: 20px; opacity: 0.6; transition: 0.2s; &:hover, &.active { opacity: 1; transform: scale(1.3); } }
  }
  .publish-btn { background: #1f2937; border: none; border-radius: 20px; &:hover { background: black; } }
}

.writing-zone { max-width: 1000px; margin: 0 auto; }

.title-input {
  width: 100%; border: none; background: transparent;
  font-size: 2.5rem; font-weight: 900; color: white;
  margin-bottom: 20px; text-shadow: 0 2px 5px rgba(0,0,0,0.1); outline: none;
  &::placeholder { color: rgba(255,255,255,0.5); }
}
.mood-calm .title-input, .mood-happy .title-input { color: #333; &::placeholder { color: rgba(0,0,0,0.3); } }

.cover-section {
  margin-bottom: 20px;
  .cover-placeholder {
    width: 100%; height: 120px; border: 2px dashed rgba(255,255,255,0.6); border-radius: 12px;
    display: flex; justify-content: center; align-items: center; color: rgba(255,255,255,0.9); cursor: pointer;
    &:hover { background: rgba(255,255,255,0.1); }
  }
  .cover-preview {
    width: 100%; height: 200px; background-size: cover; border-radius: 12px; position: relative; overflow: hidden;
    &:hover .cover-mask { opacity: 1; }
    .cover-mask {
      position: absolute; inset: 0; background: rgba(0,0,0,0.5); color: white;
      display: flex; justify-content: center; align-items: center; opacity: 0; transition: 0.3s;
    }
  }
}

.editor-card { 
  border-radius: 12px; 
  overflow: hidden; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  background: rgba(255,255,255,0.95);
}

:deep(.md-editor) {
  background-color: transparent;
  height: 600px;
}
</style>