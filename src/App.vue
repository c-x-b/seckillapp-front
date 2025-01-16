<template>
  <div id="app">
    <el-menu :default-active="'1'" class="el-menu" mode="horizontal" @select="handleSelect" router>
      <!-- 左侧区域: 图标 -->
      <el-row type="flex" justify="start" align="middle">
        <el-col :span="12">
          <div class="geometric-pattern">
          </div>
        </el-col>
      </el-row>

      <!-- 中间区域: 导航标签 -->
      <el-row type="flex" justify="center" align="middle" class="menu-items">
        <el-col :span="12">
          <el-menu-item index="/">主页</el-menu-item>
        </el-col>
        <el-col :span="12">
          <el-menu-item index="/products">商品列表</el-menu-item>
        </el-col>
        <el-col :span="12">
          <el-menu-item index="/seckills">秒杀活动</el-menu-item>
        </el-col>
      </el-row>

      <!-- 右侧区域: 登录和注册按钮 -->
      <el-row type="flex" justify="end" align="middle">
        <div v-if="!isLoggedIn">
          <el-col :span="12">
            <el-button type="primary" @click="goToLogin">登录</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="goToRegister">注册</el-button>
          </el-col>
        </div>
        <el-col :span="40" v-else>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/userinfo">用户信息</el-dropdown-item>
              <el-dropdown-item command="/orders">订单管理</el-dropdown-item>
              <el-dropdown-item command="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </el-col>
      </el-row>
    </el-menu>

    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,  // 用于判断用户是否登录
      username: ''        // 存储用户名
    }
  },
  mounted() {
    this.checkLoginStatus(); // 确保在组件挂载时调用检查登录状态
    this.$bus.$on('login', (username) => {
      console.log("Bus on App: ", username);
      this.isLoggedIn = true;
      this.username = username;
    });
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key)
    },
    goToLogin() {
      this.checkLoginStatus();
      if (this.isLoggedIn)
        return;
      this.$router.push('/login');
    },
    goToRegister() {
      this.$router.push('/register');
    },
    checkLoginStatus() {
      // 假设通过本地存储的 token 或者通过 API 来检查登录状态
      const token = localStorage.getItem('token');
      if (token) {
        // 假设 token 存在时为已登录
        console.log("User is logged in");
        this.isLoggedIn = true;
        // 获取用户名等信息
        this.$axios.get('/api/user/info')
          .then(response => {
            this.username = response.data.data.username;
            console.log("User name: ", this.username);
          })
          .catch(error => {
            console.log("Failed to fetch user info", error);
          });
      }
    },
    handleCommand(command) {
      if (command.startsWith('/')) {
        this.$router.push(command);
      } else if (command === 'logout') {
        // 本地删除token
        localStorage.removeItem('token');
        this.isLoggedIn = false;
        this.$router.push('/');
      }
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

.el-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-items {
  margin-left: auto;
  margin-right: auto;
}

.logo-img {
  height: 40px;  /* 根据实际图标调整尺寸 */
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

.geometric-pattern {
  width: 50px;
  height: 50px;
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
</style>
