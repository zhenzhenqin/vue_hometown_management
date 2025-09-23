<script setup>
import { ref, onMounted } from 'vue'
// 1. 修正API导入路径（特产相关接口应从specialties导入）
import { listAllSpecialties, addSpecialty, getSpecialty, updateSpecialty, deleteSpecialtyById } from '../../api/specialties';
import { ElMessage, ElMessageBox, ElCard } from 'element-plus';

const searchForm = ref({
  name: '',
  price: '' 
});

const clear = () => {
  searchForm.value.name = '';
  searchForm.value.price = '';
  search();
};


const speList = ref([]);

const search = async () => {
  try {
    const result = await listAllSpecialties(
      searchForm.value.name,
      searchForm.value.price,
      currentPage.value,
      pageSize.value
    );
    if (result.code) {
      speList.value = result.data.rows;
      total.value = result.data.total;
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    ElMessage.error('查询失败：' + (error.message || '网络错误'));
  }
}

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

onMounted(() => {
  search();
});

const showDialog = ref(false);
const formTitle = ref('');


const spec = ref({
  id: null, 
  name: '',
  price: null, 
  description: '',
  image: ''
})

const add = () => {
  formTitle.value = '新增特产'; // 4. 修正按钮文字（文化→特产）
  spec.value = {
    id: null,
    name: '',
    price: null,
    description: '',
    image: ''
  }
  showDialog.value = true;
  if (specFormRef.value) {
    specFormRef.value.resetFields()
  }
}

const handleAvatarSuccess = (response) => {
  spec.value.image = response.data;
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
  if (!specFormRef.value) return;

  try {
    await specFormRef.value.validate();

    let result;
    // 5. 修正变量名拼写错误（spac→spec）
    if (spec.value.id) {
      result = await updateSpecialty(spec.value);
    } else {
      result = await addSpecialty(spec.value);
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
  name: [
    { required: true, message: '请输入特产名称', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  description: [ // 与spec对象的description字段匹配
    { required: true, message: '请填写特产描述', trigger: 'blur' }
  ]
})

const getById = async (id) => {
  const result = await getSpecialty(id);
  if (result.code) {
    spec.value = result.data;
  }
}

const specFormRef = ref();

const editSpec = (id) => {
  formTitle.value = '编辑特产'; // 7. 修正标题文字（文化→特产）
  showDialog.value = true;
  getById(id);
  if (specFormRef.value) {
    specFormRef.value.resetFields()
  }
}

// 8. 修正删除方法中的接口调用错误（deleteCultureById→deleteSpecialtyById）
const handleDeleteSpec = (row) => {
  ElMessageBox.confirm(
    '确认删除这个特产吗?', // 修正提示文字
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const result = await deleteSpecialtyById(row.id);
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

const specList = ref([])

const handleSelectionChange = (val) => {
  specList.value = val.map(item => item.id);
}

// 9. 优化批量删除（调用后端批量删除接口，而非循环单个删除）
const batchDeleteSpec = async () => {
  if (!specList.value || specList.value.length === 0) {
    ElMessage.error("请选择要删除的特产"); // 修正提示文字
    return;
  }

  ElMessageBox.confirm(
    `确认删除选中的${specList.value.length}个特产吗?`, // 修正提示文字
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        // 直接调用批量删除接口（传递id列表）
        const result = await deleteSpecialtyById(specList.value);
        if (result.code) {
          ElMessage.success(`成功删除${specList.value.length}个特产`);
          search();
          specList.value = [];
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
    <h1 class="page-title">特产管理</h1>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="medium">
        <el-form-item label="特产名称" class="search-form-item">
          <el-input v-model="searchForm.name" placeholder="请输入特产名称(支持模糊搜索)" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="价格" class="search-form-item">
          <el-input v-model="searchForm.price" type="number" placeholder="请输入价格" clearable class="search-input" /> <!-- 增加type="number" -->
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button type="primary" @click="search" icon="Search">查询</el-button>
        </el-form-item>
        <el-form-item class="search-form-item">
          <el-button type="info" @click="clear" icon="RefreshLeft">清空</el-button>
        </el-form-item>
      </el-form>  
    </el-card>

    <div class="operation-bar">
      <el-button type="primary" @click="add" icon="Plus" class="add-btn">新增特产</el-button>
      <el-button type="danger" @click="batchDeleteSpec" :disabled="specList.length === 0" icon="Delete"
        class="batch-delete-btn">
        批量删除
      </el-button>
    </div>

    <el-card class="table-card" shadow="hover" border="false">
      <el-table :data="speList" border style="width: 100%" @selection-change="handleSelectionChange" size="medium"
        :header-cell-style="tableHeaderStyle" :row-class-name="tableRowClassName" :cell-style="tableCellStyle">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="特产名称" width="160" align="center" />

        <el-table-column prop="image" label="图片" width="140" align="center">
          <template #default="scope">
            <div class="image-container">
              <img v-if="scope.row.image" :src="scope.row.image" alt="特产图片" class="culture-image" loading="lazy" />
              <el-icon v-else class="default-image-icon">Picture</el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="价格" width="140" align="center" /> 

        <el-table-column prop="description" label="描述" :min-width="350" align="center" show-overflow-tooltip
          tooltip-effect="dark" />
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center" />

        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editSpec(scope.row.id)" icon="Edit" class="edit-btn">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteSpec(scope.row)" icon="Delete"
              class="delete-btn">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="pagination-bar">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30, 50]"
        :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" size="medium" />
    </div>

    <el-dialog v-model="showDialog" :title="formTitle" width="700px" :close-on-click-modal="false"
      :destroy-on-close="true" center>
      <el-form :model="spec" :rules="rules" ref="specFormRef" label-width="100px" class="dialog-form"
        size="medium">
        <el-form-item label="特产名称" prop="name" class="form-item">
          <el-input v-model="spec.name" placeholder="请输入特产名称" class="form-input" />
        </el-form-item>

        <el-form-item label="特产描述" prop="description" class="form-item">
          <el-input v-model="spec.description" placeholder="请填写特产描述（最多500字）" type="textarea" :rows="6" resize="vertical"
            maxlength="500" show-word-limit class="form-textarea" />
        </el-form-item>

        <el-form-item label="上传图片" class="form-item">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :disabled="false">
            <div class="upload-container">
              <img v-if="spec.image" :src="spec.image" class="upload-avatar" alt="预览图" loading="lazy" /> <!-- 修正绑定 -->
              <div v-else class="upload-placeholder">
                <el-icon class="upload-icon">Plus</el-icon>
                <p class="upload-text">点击上传图片</p>
              </div>
            </div>
          </el-upload>
          <p class="upload-hint">支持JPG/PNG格式，大小不超过10MB</p>
        </el-form-item>

        <!-- 14. 增加价格输入项（之前遗漏，与后端实体匹配） -->
        <el-form-item label="价格" prop="price" class="form-item">
          <el-input v-model="spec.price" type="number" step="0.01" placeholder="请输入价格" class="form-input" />
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
/* 样式保持不变，此处省略 */
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