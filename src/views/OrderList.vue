<template>
    <div class="order-list">
        <!-- 订单列表 -->
        <table>
        <thead>
            <tr>
            <th>订单编号</th>
            <th>商品信息</th>
            <th>订单状态</th>
            <th>下单时间</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in orders" :key="order.id">
            <td>
                <span class="order-id-link" @click="showOrderDetail(order.id)">
                    {{ order.id }}
                </span>
            </td>
            <td>{{ order.goodsName + "*" + order.goodsCount}}</td>
            <td>{{ getStatusText(order.status) }}</td>
            <td>{{ order.createDate }}</td>
            </tr>
        </tbody>
        </table>

        <!-- 订单详情对话框 -->
        <el-dialog
            title="订单详情"
            :visible.sync="dialogVisible"
            width="50%">
            <div v-if="orderDetail" class="order-detail">
                <p><strong>订单编号：</strong>{{ orderDetail.id }}</p>
                <p><strong>商品名称：</strong>{{ orderDetail.goodsName }}</p>
                <p><strong>商品数量：</strong>{{ orderDetail.goodsCount }}</p>
                <p><strong>商品单价：</strong>￥{{ orderDetail.goodsPrice }}</p>
                <p><strong>订单总价：</strong>￥{{ orderDetail.goodsPrice * orderDetail.goodsCount }}</p>
                <p><strong>订单状态：</strong>{{ getStatusText(orderDetail.status) }}</p>
                <p><strong>下单渠道：</strong>{{ getChannelText(orderDetail.orderChannel) }}</p>
                <p><strong>创建时间：</strong>{{ orderDetail.createDate }}</p>
                <p><strong>支付时间：</strong>{{ orderDetail.payDate || '未支付' }}</p>
            </div>
        </el-dialog>

        <!-- 分页组件 -->
        <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
        </div>
    </div>
</template>
  
<script>
  export default {
    name: 'OrderList',
    data() {
        return {
        orders: [], // 存储订单数据
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示的订单数
        totalOrders: 0, // 总订单数
        dialogVisible: false,
        orderDetail: null,
        };
    },
    computed: {
        totalPages() {
        // 计算总页数
        return Math.ceil(this.totalOrders / this.pageSize);
        },
    },
    methods: {
        async fetchOrders() {
            const params = {
                page: this.currentPage,
                size: this.pageSize
            };

            try {
                const response = await this.$axios.get('/api/orders', { params });
                
                if (response.data.code === 200) {
                    this.orders = response.data.data.records;
                    this.totalOrders = response.data.data.total;
                } else {
                    this.$message.error(response.data.message);
                }
            } catch (error) {
                console.error('获取订单数据失败:', error);
                this.$message.error('获取订单列表失败');
            }
        },
        changePage(page) {
        // 改变页码
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.fetchOrders();
        }
        },
        async showOrderDetail(orderId) {
            try {
                const response = await this.$axios.get('/api/order', {
                    params: { id: orderId }
                });
                
                if (response.data.code === 200) {
                    this.orderDetail = response.data.data;
                    this.dialogVisible = true;
                } else {
                    this.$message.error(response.data.message);
                }
            } catch (error) {
                console.error('获取订单详情失败:', error);
                this.$message.error('获取订单详情失败');
            }
        },
        getStatusText(status) {
            const statusMap = {
                0: '未支付',
                1: '已支付',
                2: '已发货',
                3: '已收货',
                4: '已退款',
                5: '已完成'
            };
            return statusMap[status] || '未知状态';
        },
        getChannelText(channel) {
            const channelMap = {
                1: 'PC',
                2: 'Android',
                3: 'iOS'
            };
            return channelMap[channel] || '其他';
        }
    },
    mounted() {
        // 组件挂载后获取订单数据
        this.fetchOrders();
    }
  };
</script>
  
  <style scoped>
  /* 你可以在这里添加一些CSS样式 */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .pagination {
    margin-top: 20px;
  }
  
  button {
    padding: 5px 10px;
    margin-right: 5px;
  }

  .order-id-link {
    color: #409EFF;
    cursor: pointer;
  }
  .order-id-link:hover {
    text-decoration: underline;
  }
  .order-detail p {
    margin: 10px 0;
  }
  </style>