<script setup>

</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">衢州地区信息管理系统</span>
        <div class="subtitle">南孔圣地 · 衢州有礼</div>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu router='true' default-active="2" class="el-menu-vertical-demo" @open="handleOpen"
            @close="handleClose">

            <el-menu-item index="/index">
              <el-icon>
                <Promotion />
              </el-icon>
              <span>首页</span>
            </el-menu-item>

            <el-menu-item index="/user">
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
.header {
  background-image: linear-gradient(to right, #1a5e38, #2a8c54, #3aad6e, #56c886, #74e49f);
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  color: white;
  font-size: 28px;
  font-family: "楷体", "KaiTi", serif;
  line-height: 60px;
  font-weight: bolder;
  margin-right: 20px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-family: "宋体", "SimSun", serif;
  line-height: 60px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 15px;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
  margin-left: 15px;
  transition: all 0.3s;
}

a:hover {
  color: #e6f7ff;
  text-decoration: underline;
}

.aside {
  width: 220px;
  background-color: #f9fbf8;
  border-right: 1px solid #d9e2d6;
  height: calc(100vh - 60px);
}

/* 菜单样式调整 */
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
