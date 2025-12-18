<template>
  <div class="monitor-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <el-card shadow="hover" class="mb-20">
          <template #header>
            <div class="card-header">
              <el-icon><Cpu /></el-icon> <span>CPU 使用率</span>
            </div>
          </template>
          <div class="chart-box">
            <el-progress type="dashboard" :percentage="server.cpu.used" :color="colors" />
            <div class="meta-info">
              <p>核心数: {{ server.cpu.cpuNum }}</p>
              <p>用户使用: {{ server.cpu.used }}%</p>
              <p>系统使用: {{ server.cpu.sys }}%</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" :xs="24">
        <el-card shadow="hover" class="mb-20">
          <template #header>
            <div class="card-header">
              <el-icon><Connection /></el-icon> <span>内存使用率</span>
            </div>
          </template>
          <div class="chart-box">
            <el-progress type="dashboard" :percentage="server.mem.usage" :color="colors" />
            <div class="meta-info">
              <p>总内存: {{ server.mem.total }} GB</p>
              <p>已用: {{ server.mem.used }} GB</p>
              <p>剩余: {{ server.mem.free }} GB</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="mb-20">
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon> <span>服务器信息</span>
            </div>
          </template>
          <el-descriptions border :column="2">
            <el-descriptions-item label="服务器名称">{{ server.sys.computerName }}</el-descriptions-item>
            <el-descriptions-item label="操作系统">{{ server.sys.osName }}</el-descriptions-item>
            <el-descriptions-item label="服务器IP">{{ server.sys.computerIp }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ server.sys.osArch }}</el-descriptions-item>
            <el-descriptions-item label="项目路径">{{ server.sys.userDir }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="mb-20">
          <template #header>
            <div class="card-header">
              <el-icon><Coffee /></el-icon> <span>Java虚拟机 (JVM)</span>
            </div>
          </template>
          <el-descriptions border :column="2">
            <el-descriptions-item label="JVM名称">{{ server.jvm.name || 'Java HotSpot(TM) 64-Bit Server VM' }}</el-descriptions-item>
            <el-descriptions-item label="Java版本">{{ server.jvm.version }}</el-descriptions-item>
            <el-descriptions-item label="启动时间">{{ server.jvm.startTime }}</el-descriptions-item>
            <el-descriptions-item label="运行时长">{{ server.jvm.runTime }}</el-descriptions-item>
            <el-descriptions-item label="安装路径">{{ server.jvm.home }}</el-descriptions-item>
            <el-descriptions-item label="JVM内存">
              当前: {{ server.jvm.total }}MB / 最大: {{ server.jvm.max }}MB
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Files /></el-icon> <span>磁盘状态</span>
            </div>
          </template>
          <el-table :data="server.sysFiles" border style="width: 100%">
            <el-table-column prop="dirName" label="盘符路径" width="180" />
            <el-table-column prop="typeName" label="文件系统" width="120" />
            <el-table-column prop="total" label="总大小" width="120" />
            <el-table-column prop="free" label="可用大小" width="120" />
            <el-table-column prop="used" label="已用大小" width="120" />
            <el-table-column label="使用率">
              <template #default="scope">
                <el-progress 
                  :percentage="scope.row.usage" 
                  :color="scope.row.usage > 80 ? '#f56c6c' : '#409eff'"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getServerInfo } from '@/api/monitor'
import { Cpu, Connection, Monitor, Coffee, Files } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const loading = ref(true)
const server = ref({
  cpu: {},
  mem: {},
  sys: {},
  jvm: {},
  sysFiles: []
})

// 进度条颜色
const colors = [
  { color: '#5cb87a', percentage: 20 },
  { color: '#1989fa', percentage: 40 },
  { color: '#e6a23c', percentage: 60 },
  { color: '#f56c6c', percentage: 80 },
]

const getInfo = async () => {
  try {
    loading.value = true
    const res = await getServerInfo()
    if(res.code === 1) {
      server.value = res.data
    } else {
      ElMessage.error(res.msg || '获取监控数据失败')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getInfo()
})
</script>

<style scoped>
.monitor-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}
.mb-20 {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}
.card-header .el-icon {
  margin-right: 8px;
  font-size: 18px;
}
.chart-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.meta-info {
  line-height: 2;
  font-size: 14px;
  color: #606266;
}
</style>