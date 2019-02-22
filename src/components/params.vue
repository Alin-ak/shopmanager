<template>
  <el-card class="box">
    <cus-bread lv1="商品管理" lv2="商品列表"></cus-bread>
    <el-alert title="注意，只允许为第三级分类参数" type="warning" show-icon class="mr" :closable="false"></el-alert>

    <el-form label-position="left" :model="form" class="form" label="请选择商品分类">
      <el-form-item label="请选择商品分类">
        <!-- 级联选择器 -->
        <el-cascader
          :show-all-levels="false"
          :props="defaultProp"
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>

      <!-- tabs -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="1">
            <el-button disabled>设置参数</el-button>
            <!-- 表格 -->
            <el-table :data="attrDt" style="width: 100%" height="480" @expand-change="fn">
            <el-table-column type="expand" width="100">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row,item)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="400"></el-table-column>

            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
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

        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="2">
          <el-table :data="attrJt" style="width: 100%" height="480">
            
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="400"></el-table-column>
             <el-table-column prop="attr_vals" label="属性属性值" width="400"></el-table-column>

            <el-table-column label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
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
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      inputVisible:false,
      inputValue:'',
      activeName:'1',
      selectedOptions: [],
      options: [],
      attrDt: [],
      attrJt: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      }
    };
  },
  created() {
    this.getCateData();
  },
  methods: {
    fn(row, expandedRows) {
      if(expandedRows.length > 1) {
        expandedRows.shift()
      }
    },
    // 关闭标签时
    async handleClose(obj,item) {
        obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
        const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          attr_vals: obj.attr_vals.join(",")
        }
      );
      const {
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
      },
    // 显示获取input焦点
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    // 键盘enter事件
     async handleInputConfirm(obj) {
        const inputValue = this.inputValue;
        if (inputValue) {
          obj.attr_vals.push(inputValue);
          const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
          {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals.join(",")
          }
         );
          const {
          meta: { status,msg }
        } = res.data;
        if(status === 201) {
          this.$message.success(msg)
          this.inputVisible = false;
        this.inputValue = '';
        }
        }        
      },

    // tabs切换事件
    async handleClick ()  {
        
        if(this.selectedOptions.length !== 3) {
           this.$message.error('请先选择三级分类')
              if(this.activeName==="1") {
                this.attrDt =[]
              }
              if(this.activeName === "2") {
                this.attrJt =[]
              }
              return 
        }
              // 获取动态参数
             if(this.activeName ==="1") {
               const res = await this.$http.get(
              `categories/${this.selectedOptions[2]}/attributes?sel=many`)
            // console.log(res);
             const {
              data,
              meta: { status }
             } = res.data;
             if (status === 200) {
              this.attrDt = data;
              // console.log(data);
  
              this.attrDt.forEach(item => {
                if (item.attr_vals.length === 0) {
                  item.attr_vals = [];
                } else {
                  item.attr_vals = item.attr_vals.split(",");
                }
              });
            }    
          }
          // 静态参数
          if(this.activeName === '2') {

            const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.attrJt = data;
            // console.log(this.arrJt);
            //   console.log(data);
            this.attrJt.forEach(item => {
              // 如果后台返回的是个很多空格的字符，那么 trim去掉前后空格
              if (item.attr_vals.length === 0) {
                item.attr_vals.trim = [];
              } else {
                item.attr_vals = item.attr_vals.trim();
              }
            });
          
         }
        }
 
        
    },
    // 级联选择器数据发生变化
    handleChange() {
      this.handleClick()
    },
    async getCateData() {
      const res = await this.$http.get(`categories/?type=3`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.options = data;
        console.log(data);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.mr {
  margin: 15px 0;
}
</style>
