<template>
    <div class="seckill-detail">
      <!-- 面包屑导航（可选） -->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><router-link to="/">首页</router-link></el-breadcrumb-item>
          <el-breadcrumb-item>秒杀详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 商品信息区域 -->
      <div class="seckill-info">
        <!-- 左侧图片展示 -->
        <div class="seckill-images">
          <!-- 主图展示，点击后进入预览模式 -->
          <el-image
            :src="mainImage"
            :preview-src-list="imageList"
            fit="cover"
            class="main-image"
          ></el-image>
          <!-- 缩略图列表，点击后切换主图 -->
          <div class="thumbnail-list">
            <el-image
              v-for="(img, index) in imageList"
              :key="index"
              :src="img"
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
            <span class="price">￥{{ seckill.price }}</span>
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
              :max="seckill.stock"
              @change="handleQuantityChange"
            ></el-input-number>
          </div>
          <!-- 购买按钮 -->
          <div class="purchase-buttons">
            <el-button type="primary" size="large" @click="buyNow">立即购买</el-button>
            <el-button type="warning" size="large" @click="addToCart">加入购物车</el-button>
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
        seckill: {},
        mainImage: '',
        imageList: [],
        quantity: 1
      };
    },
    mounted() {
      this.fetchseckillDetail();
    },
    methods: {
      fetchseckillDetail() {
        this.$axios.get(`/api/seckill/${this.seckillId}`)
          .then(response => {
            if (response.data.code === 200) {
              this.seckill = response.data.data;
              this.imageList = [this.seckill.img]; // 如果有多张图片，可调整此处
              this.mainImage = this.seckill.img;
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
      handleQuantityChange(value) {
        if (value > this.seckill.stock) {
          this.$message.warning('超出库存数量');
          this.quantity = this.seckill.stock;
        }
      },
      buyNow() {
        // 立即购买逻辑
        this.$message.success('购买功能尚未实现');
      },
      addToCart() {
        // 加入购物车逻辑
        this.$message.success('加入购物车功能尚未实现');
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
  .seckill-stock {
    margin-bottom: 10px;
  }
  .seckill-quantity {
    margin-bottom: 20px;
  }
  .purchase-buttons .el-button {
    margin-right: 20px;
  }
  .seckill-description {
    margin-top: 40px;
  }
  </style>
  