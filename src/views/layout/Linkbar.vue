<template>
  <div class="linkbar-wrapper">
    <el-menu mode="horizontal" theme="dark">
        <el-menu-item index="1">我的控制台</el-menu-item>
    </el-menu>
  </div>
</template>

<style rel="stylesheet/css" scoped>
  .linkbar-wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
  }
  .el-menu{
    border-radius: 0;
  }
  .el-menu-item:hover {
    color: #20a0ff;
  }
  .el-menu-item > a {
    text-decoration: none;
  }
</style>
