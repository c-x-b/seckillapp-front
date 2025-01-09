<template>
  <div id="app">
    <el-menu :default-active="'1'" class="el-menu" mode="horizontal" @select="handleSelect" router>
      <!-- <div class="left-menu"> -->
        <el-menu-item index="/">主界面</el-menu-item>
        <el-menu-item index="/products">商品列表</el-menu-item>
        <el-menu-item index="/userinfo">用户信息</el-menu-item>
        <el-menu-item index="/orders">订单信息</el-menu-item>
        <el-menu-item index="/seckills">秒杀活动</el-menu-item> <!-- 新增秒杀活动菜单项 -->
      <!-- </div> -->
      <!-- <div class="right-menu"> -->
        <el-menu-item index="/login">登录</el-menu-item>
        <el-menu-item index="/register">注册</el-menu-item>
      <!-- </div> -->
    </el-menu>

    <router-view/>
  </div>
</template>

<script>
export default {
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key)
    }
  }
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>