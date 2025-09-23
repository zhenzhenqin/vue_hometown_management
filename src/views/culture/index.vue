<script setup>
import { ref, onMounted } from 'vue'
import { listAllCulture, addCulture, getCulture, updateCulture, deleteCultureById } from '../../api/culture';
import { ElMessage, ElMessageBox, ElCard } from 'element-plus';

const searchForm = ref({
  title: ''
});

const clear = () => {
  searchForm.value.title = '';
  search();
};

const cultureList = ref([]);

const search = async () => {
  try {
    const result = await listAllCulture(
      searchForm.value.title,
      currentPage.value,
      pageSize.value
    );
    if (result.code) {
      cultureList.value = result.data.rows || [];
      total.value = result.data.total || 0;
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    ElMessage.error('查询失败：' + (error.message || '网络错误'));
  }
}

const currentPage = ref(1)
const pageSize = ref(10) // 调整默认每页条数为10，更符合常规使用
const background = ref(true)
const total = ref(0)

const handleSizeChange = (val) => {
  pageSize.value = val;
  search();
}

const handleCurrentChange = (val) => {
  currentPage.value = val;
  search();
}

onMounted(() => {
  search();
});

const showDialog = ref(false);
const formTitle = ref('');

const culture = ref({
  title: '',
  content: '',
  image: ''
})

const add = () => {
  formTitle.value = '新增文化';
  culture.value = {
    title: '',
    content: '',
    image: ''
  }
  showDialog.value = true;
  if (cultureFormRef.value) {
    cultureFormRef.value.resetFields()
  }
}

const handleAvatarSuccess = (response) => {
  culture.value.image = response.data;
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传JPG/PNG格式图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10MB以内图片!')
    return false
  }
  return true
}

const save = async () => {
  if (!cultureFormRef.value) return;

  try {
    await cultureFormRef.value.validate();

    let result;
    if (culture.value.id) {
      result = await updateCulture(culture.value);
    } else {
      result = await addCulture(culture.value);
    }

    if (result.code) {
      ElMessage.success("保存成功");
      showDialog.value = false;
      search();
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error('请填写正确的信息！');
    } else {
      ElMessage.error(error.message || '保存失败');
    }
  }
}

const rules = ref({
  title: [
    { required: true, message: '请输入文化名称', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请填写文化内容', trigger: 'blur' }
  ]
})

const getById = async (id) => {
  const result = await getCulture(id);
  if (result.code) {
    culture.value = result.data;
  }
}

const cultureFormRef = ref();

const editCulture = (id) => {
  formTitle.value = '编辑文化';
  showDialog.value = true;
  getById(id);
  if (cultureFormRef.value) {
    cultureFormRef.value.resetFields()
  }
}

const handleDeleteCulture = (row) => {
  ElMessageBox.confirm(
    '确认删除这个文化吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const result = await deleteCultureById(row.id);
      if (result.code) {
        ElMessage.success("删除成功");
        search();
      } else {
        ElMessage.error(result.message);
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    })
}

const collectList = ref([])

const handleSelectionChange = (val) => {
  collectList.value = val.map(item => item.id);
}

const batchDeleteCultures = async () => {
  if (!collectList.value || collectList.value.length === 0) {
    ElMessage.error("请选择要删除的文化");
    return;
  }

  ElMessageBox.confirm(
    `确认删除选中的${collectList.value.length}个文化吗?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const deletePromises = collectList.value.map(id => deleteCultureById(id));
        const results = await Promise.all(deletePromises);
        
        const successCount = results.filter(result => result.code).length;
        const failCount = results.length - successCount;
        
        if (successCount > 0) {
          ElMessage.success(`成功删除${successCount}个文化`);
        }
        
        if (failCount > 0) {
          ElMessage.error(`${failCount}个文化删除失败`);
        }
        
        search();
        collectList.value = [];
      } catch (error) {
        ElMessage.error('批量删除过程中发生错误：' + (error.message || '未知错误'));
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    })
}
</script>

<template>
  <div class="culture-page-container">
    <!-- 页面标题 - 增加视觉焦点 -->
    <h1 class="page-title">文化管理</h1>

    <!-- 搜索区域 - 用卡片包裹增加层次感 -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="medium">
        <el-form-item label="文化名称" class="search-form-item">
          <el-input 
            v-model="searchForm.title" 
            placeholder="请输入文化名称(支持模糊搜索)" 
            clearable 
            class="search-input"
          />
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button type="primary" @click="search" icon="Search">查询</el-button>
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button type="info" @click="clear" icon="RefreshLeft">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 - 与表格区分开，增加间距 -->
    <div class="operation-bar">
      <el-button type="primary" @click="add" icon="Plus" class="add-btn">新增文化</el-button>
      <el-button 
        type="danger" 
        @click="batchDeleteCultures" 
        :disabled="collectList.length === 0" 
        icon="Delete"
        class="batch-delete-btn"
      >
        批量删除
      </el-button>
    </div>

    <!-- 数据表格 - 优化表头样式和行交互 -->
    <el-card class="table-card" shadow="hover" border="false">
      <el-table 
        :data="cultureList" 
        border 
        style="width: 100%" 
        @selection-change="handleSelectionChange"
        size="medium"
        :header-cell-style="tableHeaderStyle"
        :row-class-name="tableRowClassName"
        :cell-style="tableCellStyle"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="title" label="文化标题" width="180" align="center" />

        <!-- 图片列 - 优化预览样式，增加默认图 -->
        <el-table-column prop="image" label="图片" width="140" align="center">
          <template #default="scope">
            <div class="image-container">
              <img 
                v-if="scope.row.image" 
                :src="scope.row.image" 
                alt="文化图片" 
                class="culture-image" 
                loading="lazy"
              />
              <el-icon v-else class="default-image-icon">Picture</el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          prop="content" 
          label="内容" 
          :min-width="350" 
          align="center" 
          show-overflow-tooltip
          tooltip-effect="dark"
        />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center" />
        
        <!-- 操作列 - 优化按钮间距和图标 -->
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="editCulture(scope.row.id)"
              icon="Edit"
              class="edit-btn"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDeleteCulture(scope.row)"
              icon="Delete"
              class="delete-btn"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页区域 - 右对齐，优化间距 -->
    <div class="pagination-bar">
      <el-pagination 
        v-model:current-page="currentPage" 
        v-model:page-size="pageSize" 
        :page-sizes="[5, 10, 20, 30, 50]"
        :background="background" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total"
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange"
        size="medium"
      />
    </div>

    <!-- 表单对话框 - 优化表单间距和上传样式 -->
    <el-dialog 
      v-model="showDialog" 
      :title="formTitle" 
      width="700px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      center
    >
      <el-form 
        :model="culture" 
        :rules="rules" 
        ref="cultureFormRef" 
        label-width="100px"
        class="dialog-form"
        size="medium"
      >
        <el-form-item label="文化名称" prop="title" class="form-item">
          <el-input 
            v-model="culture.title" 
            placeholder="请输入文化名称" 
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="文化内容" prop="content" class="form-item">
          <el-input 
            v-model="culture.content" 
            placeholder="请填写文化内容（最多500字）" 
            type="textarea" 
            :rows="6" 
            resize="vertical"
            maxlength="500" 
            show-word-limit
            class="form-textarea"
          />
        </el-form-item>

        <!-- 图片上传 - 优化上传框样式和预览图 -->
        <el-form-item label="上传图片" class="form-item">
          <el-upload 
            class="avatar-uploader" 
            action="/api/upload" 
            :show-file-list="false"
            :on-success="handleAvatarSuccess" 
            :before-upload="beforeAvatarUpload"
            :disabled="false"
          >
            <div class="upload-container">
              <img 
                v-if="culture.image" 
                :src="culture.image" 
                class="upload-avatar" 
                alt="预览图"
                loading="lazy"
              />
              <div v-else class="upload-placeholder">
                <el-icon class="upload-icon">Plus</el-icon>
                <p class="upload-text">点击上传图片</p>
              </div>
            </div>
          </el-upload>
          <p class="upload-hint">支持JPG/PNG格式，大小不超过10MB</p>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDialog = false" size="medium">取消</el-button>
          <el-button type="primary" @click="save" size="medium">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 页面整体容器 - 控制全局间距和背景 */
.culture-page-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 页面标题 - 突出显示 */
.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

/* 搜索卡片 - 增加层次感 */
.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
}

/* 搜索表单 - 优化间距 */
.demo-form-inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.search-form-item {
  margin-bottom: 0;
}

.search-input {
  width: 300px;
  border-radius: 4px;
}

/* 操作按钮栏 - 区分按钮优先级 */
.operation-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.add-btn, .batch-delete-btn {
  padding: 8px 16px;
  border-radius: 4px;
}

/* 表格卡片 - 优化内边距 */
.table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 16px;
}

/* 表格样式 - 表头和行优化 */
.tableHeaderStyle {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 500;
  font-size: 14px;
}

.tableRowClassName {
  &:nth-child(even) {
    background-color: #fdfdfe;
  }
}

.tableCellStyle {
  padding: 12px 8px;
  font-size: 13px;
  color: #374151;
}

/* 表格图片列 - 统一尺寸和样式 */
.image-container {
  width: 100px;
  height: 60px;
  margin: 0 auto;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.culture-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
}

.default-image-icon {
  font-size: 24px;
  color: #9ca3af;
}

/* 表格操作按钮 - 优化间距 */
.edit-btn {
  margin-right: 8px;
}

/* 分页区域 - 右对齐 */
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}

/* 对话框表单 - 优化间距和样式 */
.dialog-form {
  margin-top: 16px;
}

.form-item {
  margin-bottom: 20px;
}

.form-input, .form-textarea {
  border-radius: 4px;
  border-color: #e5e7eb;
  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
}

.form-textarea {
  resize: vertical;
}

/* 图片上传区域 - 美化上传框 */
.upload-container {
  width: 180px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.upload-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  &:hover {
    border-color: #409eff;
    background-color: #f0f7ff;
  }
}

.upload-icon {
  font-size: 28px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.upload-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
  margin-left: 100px;
}

/* 对话框底部按钮 - 优化间距 */
.dialog-footer {
  display: flex;
  gap: 12px;
}

/* 响应式适配 - 小屏幕优化 */
@media (max-width: 1200px) {
  .search-input {
    width: 220px;
  }
}

@media (max-width: 992px) {
  .culture-page-container {
    padding: 16px;
  }
  
  .search-input {
    width: 180px;
  }
  
  .el-table {
    font-size: 12px;
  }
  
  .el-table-column {
    &[width] {
      width: auto !important;
      min-width: 100px;
    }
  }
}

@media (max-width: 768px) {
  .demo-form-inline {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-input {
    width: 100%;
  }
  
  .operation-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination-bar {
    justify-content: center;
  }
}
</style>