<template>
  <div class="gallery-page">
    <div class="header-title">
      <h2>📅 记忆碎片</h2>
      <p>这里收藏着 {{ total }} 个瞬间</p>
    </div>

    <div class="search-floater glass-effect">
      <el-input 
        v-model="queryParams.title" 
        placeholder="搜索某段回忆..." 
        prefix-icon="Search"
        clearable
        @keyup.enter="fetchList"
      />
    </div>

    <div class="card-grid" v-loading="loading">
      <div 
        v-for="(item, index) in list" 
        :key="item.id" 
        class="polaroid-card"
        @click="handleEdit(item.id)"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="photo-area">
          <img v-if="item.coverImg" :src="item.coverImg" class="real-img" />
          <div v-else class="no-img">📝 文字记录</div>
        </div>
        <div class="note-area">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span>{{ formatTime(item.createTime) }}</span>
            <el-icon class="delete-icon" @click.stop="handleDelete(item.id)"><Delete /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container" v-if="total > 0">
      <el-pagination 
        background
        layout="prev, pager, next" 
        :total="total" 
        v-model:current-page="queryParams.page"
        @current-change="fetchList" 
      />
    </div>

    <div class="inspiration-capsule" @click="goToPublish">
      <div class="capsule-core">
        <el-icon class="pen-icon"><EditPen /></el-icon>
        <span class="capsule-text">记录<br>此刻</span>
      </div>
      <div class="capsule-wave"></div>
    </div>

    <div class="portal-mask" :class="{ active: isPortalOpen }"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getArticleList, deleteArticle } from '@/api/article';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const loading = ref(true);
const list = ref([]);
const total = ref(0);
const queryParams = reactive({ page: 1, pageSize: 12, title: '' });
const isPortalOpen = ref(false); // 控制转场动画

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await getArticleList(queryParams);
    list.value = res.data.rows || res.data;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

// 触发穿越动画并跳转
const goToPublish = () => {
  isPortalOpen.value = true;
  // 动画播放0.8秒后跳转，配合CSS时间
  setTimeout(() => {
    router.push('/article/publish');
  }, 800);
};

const formatTime = (time) => time ? time.split('T')[0] : '';
const handleEdit = (id) => router.push(`/article/edit/${id}`);

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除这条记忆吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteArticle([id]);
      ElMessage.success('已删除');
      fetchList();
    });
};

onMounted(fetchList);
</script>

<style scoped lang="scss">
.gallery-page {
  padding: 20px 40px;
  min-height: 100vh;
  background-color: #f3f4f6;
  position: relative;
  overflow-x: hidden; // 防止动画溢出
}

/* 顶部标题 */
.header-title {
  text-align: center;
  margin-bottom: 30px;
  h2 {
    font-size: 2rem;
    color: #374151;
    margin-bottom: 5px;
    font-family: 'Courier New', Courier, monospace;
  }
  p { color: #9ca3af; font-size: 0.9rem; }
}

/* 悬浮搜索框 */
.search-floater {
  position: sticky;
  top: 20px;
  z-index: 100;
  width: 300px;
  margin: 0 auto 40px;
  
  :deep(.el-input__wrapper) {
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border: 1px solid rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(5px);
  }
}

/* 照片墙 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
  padding-bottom: 100px;
}

.polaroid-card {
  background: white;
  padding: 12px 12px 40px 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: rotate(-2deg);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: rotate(0deg) scale(1.05) translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 10;
  }
  
  // 偶数个向右歪一点
  &:nth-child(even) { transform: rotate(1deg); &:hover { transform: rotate(0deg) scale(1.05) translateY(-10px); } }

  .photo-area {
    aspect-ratio: 1;
    background: #f3f4f6;
    margin-bottom: 15px;
    overflow: hidden;
    .real-img { width: 100%; height: 100%; object-fit: cover; }
    .no-img { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; color: #d1d5db; font-size: 12px; }
  }

  .note-area {
    text-align: center;
    .card-title { font-size: 1.1rem; color: #1f2937; margin-bottom: 10px; font-family: cursive; }
    .card-meta {
      display: flex; justify-content: space-between; align-items: center; padding: 0 10px; color: #9ca3af; font-size: 0.8rem;
      .delete-icon { cursor: pointer; transition: color 0.2s; &:hover { color: #ef4444; } }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(50px) rotate(-2deg); }
  to { opacity: 1; transform: translateY(0) rotate(-2deg); }
}

/* === 灵感胶囊 (魔法按钮) === */
.inspiration-capsule {
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 80px;
  height: 80px;
  z-index: 999;
  cursor: pointer;
  
  &:hover .capsule-core {
    transform: scale(1.1);
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  }
  
  &:hover .capsule-wave {
    animation: wave-ripple 1.5s infinite;
  }

  .capsule-core {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;

    .pen-icon { font-size: 24px; margin-bottom: 2px; }
    .capsule-text { font-size: 10px; line-height: 1.1; font-weight: bold; }
  }

  .capsule-wave {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(139, 92, 246, 0.6);
    z-index: 1;
    opacity: 0;
  }
}

@keyframes wave-ripple {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

/* === 穿越转场遮罩 === */
.portal-mask {
  position: fixed;
  bottom: 90px; /* 对齐按钮中心 */
  right: 90px;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  z-index: 9999;
  transition: width 0.8s ease-in, height 0.8s ease-in, transform 0.8s ease-in;
  transform: translate(50%, 50%); /* 中心扩展 */
  pointer-events: none;

  &.active {
    width: 300vmax; /* 足够覆盖整个屏幕 */
    height: 300vmax;
    pointer-events: all;
  }
}

.pagination-container { text-align: center; margin-top: 20px; }
</style>