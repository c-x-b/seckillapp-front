<template>
    <div class="seckill-detail">
      <!-- 面包屑导航（可选） -->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><router-link to="/seckills">秒杀活动</router-link></el-breadcrumb-item>
          <el-breadcrumb-item>秒杀详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息区域 -->
      <div class="seckill-info">
        <!-- 左侧图片展示 -->
        <div class="seckill-images">
          <!-- 主图展示，点击后进入预览模式 -->
          <el-image
            :src="getImageUrl(mainImage)"
            :preview-src-list="imageList"
            fit="cover"
            class="main-image"
          ></el-image>
          <!-- 缩略图列表，点击后切换主图 -->
          <div class="thumbnail-list">
            <el-image
              v-for="(img, index) in imageList"
              :key="index"
              :src="getImageUrl(img)"
              fit="cover"
              class="thumbnail-image"
              @click="changeMainImage(img)"
            ></el-image>
          </div>
        </div>
        <!-- 右侧商品信息 -->
        <div class="seckill-details">
          <h1 class="seckill-name">{{ seckill.name }}</h1>
          <p class="seckill-title">{{ seckill.title }}</p>
          <div class="seckill-price">
            <span>价格：</span>
            <span class="original-price">￥{{ seckill.originalPrice }}</span>
            <span class="price">￥{{ seckill.seckillPrice }}</span>
          </div>
          <div class="seckill-stock">
            库存：<span>{{ seckill.stock > 0 ? seckill.stock : '缺货' }}</span>
          </div>
          <!-- 规格选择（若有） -->
          <!-- 购买数量 -->
          <div class="seckill-quantity">
            <span>数量：</span>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="Math.min(seckill.stock, seckill.purchaseLimit)"
            ></el-input-number>
            <span class="purchase-limit">限购{{ seckill.purchaseLimit }}个</span>
          </div>
          <!-- 倒计时按钮 -->
          <div class="purchase-buttons">
            <el-button type="primary" size="large" @click="seckillNow">{{ formatCountdown(seckill.countdown) }}</el-button>
          </div>
        </div>
      </div>
      <!-- 商品详情区域 -->
      <div class="seckill-description">
        <el-tabs>
          <el-tab-pane label="商品详情">
            <div v-html="seckill.detail"></div>
          </el-tab-pane>
          <!-- 可添加其他选项卡，如规格参数、用户评价等 -->
        </el-tabs>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SeckillDetail',
    data() {
      return {
        seckillId: this.$route.params.id,
        seckill: {
          name: "test",
          title: "test",
          originalPrice: 100,
          seckillPrice: 50,
          stock: 2,
          purchaseLimit: 3,
          startTime: '2025-01-10T10:00:00',
          endTime: '2025-01-19T12:00:00',
          countdown: 10,
          detail: "test",
          img: "/images/product1.jpg"
        },
        mainImage: '',
        imageList: [],
        quantity: 1,
        lastClickTime: 0,
        lastWarningTime: 0
      };
    },
    mounted() {
      this.fetchseckillDetail();
    },
    methods: {
      getImageUrl(imgPath) {
        return `${this.$axios.defaults.baseURL}${imgPath}`; // 拼接后端基础路径
      },
      fetchseckillDetail() {
        this.$axios.get(`/api/seckill/${this.seckillId}`)
          .then(response => {
            if (response.data.code === 200) {
              this.seckill = response.data.data;
              this.imageList = [this.seckill.img]; // 如果有多张图片，可调整此处
              this.mainImage = this.seckill.img;
              this.startCountdown();
            } else {
              this.$message.error(response.data.message);
            }
          })
          .catch(error => {
            console.error(error);
            this.$message.error('获取秒杀详情失败');
          });
      },
      changeMainImage(img) {
        this.mainImage = img;
      },
      startCountdown() {
        // 倒计时逻辑
        const startTime = new Date(this.seckill.startTime).getTime();
        const currentTime = new Date().getTime();
        this.seckill.countdown = Math.max(0, Math.floor((startTime - currentTime) / 1000));
        if (this.seckill.countdown > 0) {
          const interval = setInterval(() => {
            if (this.seckill.countdown > 0) {
              this.seckill.countdown--;
            } else {
              this.seckill.countdown = '立即秒杀'
              clearInterval(interval);
            }
          }, 1000);
        } else {
          this.seckill.countdown = '立即秒杀'
        }
      },
      formatCountdown(countdown) {
        if (typeof countdown === 'string') {
          return countdown;
        }
        const hours = Math.floor(countdown / 3600);
        const minutes = Math.floor((countdown % 3600) / 60);
        const seconds = countdown - hours * 3600 - minutes * 60;
        let result = '';
        if (hours < 10) {
          result += `0${hours}:`;
        } else {
          result += `${hours}:`;
        }
        if (minutes < 10 ) {
          result += `0${minutes}:`;
        } else {
          result += `${minutes}:`;
        }
        if (seconds < 10) {
          result += `0${seconds}`;
        } else {
          result += `${seconds}`;
        }
        return result;
      },
      seckillNow() {
        const currentTime = Date.now();
        if (currentTime - this.lastClickTime < 1800) {
          if (currentTime - this.lastWarningTime >= 1000) {
            this.$message.warning('请勿频繁点击');
            this.lastWarningTime = currentTime;
          }
          return;
        }
        this.lastClickTime = currentTime;
        if (typeof this.seckill.countdown === 'number' && this.seckill.countdown > 0) {
          this.$message.warning('秒杀未开始');
          return;
        }
        // TODO 秒杀逻辑
        this.$message.success('秒杀功能尚未实现');
      }
    }
  };
  </script>
  
  <style scoped>
  .seckill-detail {
    padding: 20px;
  }
  .breadcrumb {
    margin-bottom: 20px;
  }
  .seckill-info {
    display: flex;
  }
  .seckill-images {
    width: 400px;
    margin-right: 20px;
  }
  .main-image {
    width: 400px;
    height: 400px;
  }
  .thumbnail-list {
    display: flex;
    margin-top: 10px;
  }
  .thumbnail-image {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    cursor: pointer;
  }
  .seckill-details {
    flex: 1;
  }
  .seckill-name {
    font-size: 24px;
    font-weight: bold;
  }
  .seckill-title {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
  }
  .seckill-price {
    font-size: 20px;
    color: red;
    margin-bottom: 10px;
  }
  .original-price {
    text-decoration: line-through;
    margin-right: 10px;
    font-size: 16px;
  }
  .price {
    font-size: 24px;
  }
  .seckill-stock {
    margin-bottom: 10px;
  }
  .seckill-quantity {
    margin-bottom: 20px;
  }
  .purchase-limit {
    margin-left: 10px;
    color: #666;
  }
  .purchase-buttons .el-button {
    margin-right: 20px;
  }
  .seckill-description {
    margin-top: 40px;
  }
  </style>
