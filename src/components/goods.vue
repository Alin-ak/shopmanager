<template>
  <el-card>
    <CusBread lv1="商品列表" lv2="商品管理"></CusBread>
    <el-row class="rowInput">
      <el-input
        clearable
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        @clear="getAllGoods()"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
      </el-input>
      <el-button type="success" plain @click="changePage()">添加商品</el-button>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="goods" style="width: 100%" border height="480">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" min-width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="140"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="140"></el-table-column>

      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.add_time | frmdate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click="showEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="delGoods(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pageStyle"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: {},
      goods: [],
      pagenum: 1,
      pagesize: 7,
      query: "",
      total: -1
    };
  },
  created() {
    this.getAllGoods();
  },
  methods: {
    // 添加商品
    changePage(){
         this.$router.push({name:'goodsadd'})   
    },
    // 删除商品
    delGoods(goods) {
      this.$confirm("确定要删吗?", "呵呵", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
            const res = await this.$http.delete(`goods/${goods.goods_id}`)
            const {meta:{status,msg}} = res.data
            if(status === 200) {
                this.$message.success(msg)
                this.getAllGoods()
            }
        })
        .catch(() => {
            this.$message.info('取消删除')
        });
    },
    // 每页条目发生变化时
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getAllGoods();
    },
    //页数发生变化时
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAllGoods();
    },
    // 获取所有商品
    async getAllGoods() {
      const res = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.list = data;
        this.goods = this.list.goods;
        this.total = data.total;
        // console.log(this.goods)
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.input-with-select {
  width: 400px;
}
.rowInput {
  margin-top: 20px;
  margin-bottom: 10px;
}
.pageStyle {
  margin-top: 20px;
}
</style>
