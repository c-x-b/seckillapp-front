<template>
  <div class="seckill-list">
    <h1>秒杀活动</h1>
    <el-table :data="seckillProducts">
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="seckillPrice" label="秒杀价格"></el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column label="秒杀倒计时">
        <template slot-scope="scope">
          <el-button @click="goToSeckillDetail(scope.row.id)">倒计时</el-button>
          <span>{{ scope.row.countdown }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'SeckillList',
  data() {
    return {
      seckillProducts: [
        { id: 1, name: '商品1', seckillPrice: 100, stock: 10, countdown: '未开始' },
        { id: 2, name: '商品2', seckillPrice: 200, stock: 20, countdown: '未开始' },
        // ...更多商品
      ]
    };
  },
  methods: {
    goToSeckillDetail(id) {
      this.$router.push(`/seckill/${id}`);
    }
  }
}
</script>

<style scoped>
.seckill-list {
  padding: 20px;
}

.el-table {
  width: 100%;
}
</style>
