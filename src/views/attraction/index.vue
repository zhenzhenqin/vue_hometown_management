<script setup>
import { ref, onMounted } from 'vue'
import { listAllAttractions, addAttraction, getAttraction, updateAttraction, deleteAttractionById } from '../../api/attraction';
import { ElMessage, ElMessageBox, ElCard } from 'element-plus';

// 搜索表单数据（移除无关的description和image，与后端查询参数匹配）
const searchForm = ref({
  name: '',
  location: '',
  score: null
});

// 清空搜索表单
const clear = () => {
  searchForm.value.name = '';
  searchForm.value.location = '';
  searchForm.value.score = null;
  search();
};

// 景区列表数据（统一变量名）
const attractionList = ref([]);

// 搜索方法（修复接口返回数据处理）
const search = async () => {
  try {
    const result = await listAllAttractions(
      searchForm.value.name,
      searchForm.value.location,
      searchForm.value.score,
      currentPage.value,
      pageSize.value
    );
    if (result.code) {
      attractionList.value = result.data.rows;
      total.value = result.data.total;
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    ElMessage.error('查询失败：' + (error.message || '网络错误'));
  }
}

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
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

// 初始化加载
onMounted(() => {
  search();
});

// 弹窗相关
const showDialog = ref(false);
const formTitle = ref('');

// 景区表单数据
const attr = ref({
  id: null,
  name: '',
  location: '',
  score: null,
  description: '',
  image: ''
})

// 新增景区
const add = () => {
  formTitle.value = '新增景区';
  attr.value = {
    id: null,
    name: '',
    score: null,
    location: '',
    description: '',
    image: ''
  }
  showDialog.value = true;
  if (arrtFormRef.value) {
    arrtFormRef.value.resetFields()
  }
}

// 图片上传成功回调
const handleAvatarSuccess = (response) => {
  attr.value.image = response.data;
}

// 图片上传验证
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

// 保存景区（新增/编辑）
const save = async () => {
  if (!arrtFormRef.value) return;

  try {
    await arrtFormRef.value.validate();

    let result;
    if (attr.value.id) {
      // 修复接口方法名（updateAttractions → updateAttraction）
      result = await updateAttraction(attr.value);
    } else {
      // 修复接口方法名（addAttractions → addAttraction）
      result = await addAttraction(attr.value);
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

// 表单验证规则（修正描述文字）
const rules = ref({
  name: [
    { required: true, message: '请输入景区名称', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入位置', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请填写景区描述', trigger: 'blur' },  // 修正为景区
    { max: 500, message: '最多输入500个字符', trigger: 'change' }
  ],
  score: [
    { required: true, message: '请输入评分', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== null && value !== '') {
          const num = parseFloat(value);
          if (isNaN(num) || num < 0 || num > 5) {
            callback(new Error('评分必须在0-5之间'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入评分'));
        }
      },
      trigger: 'blur'
    }
  ]
})

// 根据ID查询景区（添加错误处理）
const getById = async (id) => {
  try {
    const result = await getAttraction(id);  // 修复接口方法名（getAttractions → getAttraction）
    if (result.code) {
      attr.value = result.data;
    } else {
      ElMessage.error(result.message || '获取景区信息失败');
    }
  } catch (error) {
    ElMessage.error('查询失败：' + (error.message || '网络错误'));
  }
}

const arrtFormRef = ref();

// 编辑景区（修正标题文字）
const editAttr = (id) => {
  formTitle.value = '编辑景区';  // 修正为景区
  showDialog.value = true;
  getById(id);
  if (arrtFormRef.value) {
    arrtFormRef.value.resetFields()
  }
}

// 删除单个景区（修复接口调用和文字描述）
const handleDeleteAttr = (row) => {
  ElMessageBox.confirm(
    '确认删除这个景区吗?',  // 修正为景区
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      // 修复接口方法名（deleteSpecialtyById → deleteAttractionById）
      const result = await deleteAttractionById([row.id]);
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

// 批量选择相关
const selectedIds = ref([])  // 统一变量名

const handleSelectionChange = (val) => {
  selectedIds.value = val.map(item => item.id);
}

// 批量删除景区（修复方法名和文字描述）
const batchDeleteAtt = async () => {  // 修正方法名
  if (!selectedIds.value || selectedIds.value.length === 0) {
    ElMessage.error("请选择要删除的景区");  // 修正为景区
    return;
  }

  ElMessageBox.confirm(
    `确认删除选中的${selectedIds.value.length}个景区吗?`,  // 修正为景区
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const result = await deleteAttractionById(selectedIds.value);
        if (result.code) {
          ElMessage.success(`成功删除${selectedIds.value.length}个景区`);  // 修正为景区
          search();
          selectedIds.value = [];
        } else {
          ElMessage.error('批量删除失败：' + result.message);
        }
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
    <h1 class="page-title">景点管理</h1>

    <!-- 搜索表单（修复位置输入框类型） -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="medium">
        <el-form-item label="景区名称" class="search-form-item">
          <el-input v-model="searchForm.name" placeholder="请输入景区名称(支持模糊搜索)" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="位置" class="search-form-item">
          <!-- 位置是字符串，移除type="number" -->
          <el-input v-model="searchForm.location" placeholder="请输入位置" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="评分" class="search-form-item">
          <el-input v-model="searchForm.score" type="number" placeholder="请输入评分" clearable class="search-input" />
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button type="primary" @click="search" icon="Search">查询</el-button>
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button type="info" @click="clear" icon="RefreshLeft">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮（修正新增按钮文字） -->
    <div class="operation-bar">
      <el-button type="primary" @click="add" icon="Plus" class="add-btn">新增景区</el-button> <!-- 修正为景区 -->
      <el-button type="danger" @click="batchDeleteAtt" :disabled="selectedIds.length === 0" icon="Delete"
        class="batch-delete-btn">
        批量删除
      </el-button>
    </div>

    <!-- 表格（修复数据绑定和图片alt文字） -->
    <el-card class="table-card" shadow="hover" border="false">
      <el-table :data="attractionList" border style="width: 100%" @selection-change="handleSelectionChange"
        size="medium" :header-cell-style="tableHeaderStyle" :row-class-name="tableRowClassName"
        :cell-style="tableCellStyle">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="景区名称" width="160" align="center" />
        <el-table-column prop="location" label="位置" width="200" align="center" />

        <!-- 图片展示 -->
        <el-table-column prop="image" label="图片" width="120" align="center">
          <template #default="scope">
            <div class="image-container">
              <img v-if="scope.row.image" :src="scope.row.image" alt="景区图片" class="attr-image" loading="lazy" />
              <el-icon v-else class="default-image-icon">Picture</el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="score" label="评分" width="70" align="center" />
        <el-table-column prop="liked" label="点赞数" width="70" align="center" />
        <el-table-column prop="disliked" label="差评数" width="70" align="center" />

        <el-table-column prop="description" label="描述" :min-width="350" align="center" show-overflow-tooltip
          tooltip-effect="dark" />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center" />

        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editAttr(scope.row.id)" icon="Edit" class="edit-btn">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteAttr(scope.row)" icon="Delete" class="delete-btn">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <div class="pagination-bar">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
        :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" size="medium" />
    </div>

    <!-- 弹窗表单（修复描述文字） -->
    <el-dialog v-model="showDialog" :title="formTitle" width="700px" :close-on-click-modal="false"
      :destroy-on-close="true" center>
      <!-- 1. el-form 是弹窗的内容区，footer 插槽要在 el-form 外面 -->
      <el-form :model="attr" :rules="rules" ref="arrtFormRef" label-width="100px" class="dialog-form" size="medium">
        <el-form-item label="景区名称" prop="name" class="form-item">
          <el-input v-model="attr.name" placeholder="请输入景区名称" class="form-input" />
        </el-form-item>

        <el-form-item label="景区位置" prop="location" class="form-item">
          <el-input v-model="attr.location" placeholder="请输入景区位置" class="form-input" />
        </el-form-item>

        <el-form-item label="评分" prop="score" class="form-item">
          <el-input v-model="attr.score" type="number" step="0.1" min="0" max="5" placeholder="0-10分"
            class="form-input" />
        </el-form-item>

        <el-form-item label="景区描述" prop="description" class="form-item">
          <el-input v-model="attr.description" placeholder="请填写景区描述（最多500字）" type="textarea" :rows="6" resize="vertical"
            maxlength="500" show-word-limit class="form-textarea" />
        </el-form-item>

        <!-- 上传图片 -->
        <el-form-item label="上传图片" class="form-item">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :disabled="false">
            <div class="upload-container">
              <img v-if="attr.image" :src="attr.image" class="upload-avatar" alt="预览图" loading="lazy" />
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
/* 样式保持不变 */
.culture-page-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
}

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

.operation-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.add-btn,
.batch-delete-btn {
  padding: 8px 16px;
  border-radius: 4px;
}

.table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 16px;
}

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

.attr-image {
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

.edit-btn {
  margin-right: 8px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}

.dialog-form {
  margin-top: 16px;
}

.form-item {
  margin-bottom: 20px;
}

.form-input,
.form-textarea {
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

.dialog-footer {
  display: flex;
  gap: 12px;
}

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