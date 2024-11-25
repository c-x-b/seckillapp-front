<template>
<el-row>
  <el-button @click = "UserInfo">默认按钮</el-button>
</el-row> 
</template>
<script>
export default {
    name: 'Test',
      methods: {
        UserInfo() {
          this.$axios.get('/api/user/info')
            .then(response => {
              // 处理成功响应
              console.log("Success: ", response.data);
              this.$alert(response, '标题名称', {
                confirmButtonText: '确定',
                callback: action => {}
              });
            })
            .catch(error => {
              // 处理错误响应
              console.log("Failed: ", error);
            });
        }
      }
    }
  </script>