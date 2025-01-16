<template>
  <div class="seckill-list">
    <h1>秒杀活动</h1>
    <!-- 商品展示区域 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="product in seckillProducts" :key="product.id">
        <el-card :body-style="{ padding: '10px' }" class="product-card">
          <img :src="getImageUrl(product.img)" class="product-image" @click="goToSeckillDetail(product.id)" />
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">秒杀价：￥{{ product.seckillPrice }}</p>
            <p class="product-stock">剩余库存：{{ product.stock }}</p>
            <p class="product-countdown"><strong>{{ formatCountdown(product.remainingTime) }}</strong></p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页控件 -->
    <div class="pagination">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeckillList',
  data() {
    return {
      seckillProducts: [
        // { id: 1, name: '商品1', seckillPrice: 100, stock: 10, startTime: '2023-10-01T10:00:00', remainingTime: 0, img: '/images/product1.jpg' },
        // { id: 2, name: '商品2', seckillPrice: 200, stock: 20, startTime: '2025-01-10T12:00:00', remainingTime: 0, img: '/images/product2.jpg' },
        // ...更多商品
      ],
      currentPage: 1,
      pageSize: 5,
      total: 0
    };
  },
  methods: {
    getImageUrl(imgPath) {
      return `${this.$axios.defaults.baseURL}${imgPath}`; // 拼接后端基础路径
    },
    goToSeckillDetail(productId) {
      this.$router.push(`/seckill/${productId}`);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchSeckillProducts();
    },
    fetchSeckillProducts() {
      const params = {
        page: this.currentPage,
        size: this.pageSize
      };
      this.$axios.get('/api/seckills', { params })
        .then(response => {
          if (response.data.code === 200) {
            this.seckillProducts = response.data.data.content;
            this.total = response.data.data.totalElements;
            this.calculateRemainingTime();
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(error => {
          console.error(error);
          this.$message.error('获取秒杀活动列表失败');
        });
    },
    calculateRemainingTime() {
      this.seckillProducts.forEach(product => {
        const startTime = new Date(product.startTime).getTime();
        const currentTime = new Date().getTime();
        product.remainingTime = Math.max(0, Math.floor((startTime - currentTime) / 1000));
        if (product.remainingTime > 0) {
          const interval = setInterval(() => {
            if (product.remainingTime > 0) {
              product.remainingTime--;
            } else {
              product.remainingTime = '秒杀进行中'
              clearInterval(interval);
            }
          }, 1000);
        } else {
          product.remainingTime = '秒杀进行中'
        }
      });
    },
    formatCountdown(remainingTime) {
      if (typeof remainingTime === 'string') {
        return remainingTime;
      }
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = remainingTime - hours * 3600 - minutes * 60;
      let result = '';
      if (hours > 0) {
        result += `${hours}小时`;
      }
      if (minutes > 0 || hours > 0) {
        result += `${minutes}分钟`;
      }
      result += `${seconds}秒`;
      return result;
    }
  },
  mounted() {
    this.fetchSeckillProducts();
  }
}
</script>

<style scoped>
.seckill-list {
  padding: 20px;
}
.product-card {
  cursor: pointer;
  margin-bottom: 20px;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.product-info {
  text-align: center;
}
.product-name {
  font-size: 16px;
  margin: 10px 0;
}
.product-price {
  color: red;
  font-size: 18px;
}
.product-stock {
  font-size: 14px;
  color: #666;
}
.product-countdown {
  font-size: 16px;
  color: #f56c6c;
}
.pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
