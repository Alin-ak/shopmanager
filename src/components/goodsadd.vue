<template>
  <el-card>
    <CusBread lv1="商品管理" lv2="商品列表"></CusBread>
    <!-- 步骤条 -->
    <el-alert title="添加商品信息" type="info" center show-icon class="alert"></el-alert>
    <el-steps :active="1" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab切换    -->
    <el-form label-position="top" label-width="80px" :model="form" class="form">
      <el-tabs @tab-click="changeTab()" v-model="active" tab-position="left">
        <!-- 基本信息 -->
        <el-tab-pane name="1" label="用户管理">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <!-- options是数据来源 
               selectedOptions2是选中的数组 
          -->
          <!-- {{selectedOptions}} -->
          <el-form-item label="商品分类">
            <el-cascader
              :props="defaultProp"
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品参数 -->
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrDt" :key="item.id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品属性 -->
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrJt" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品图片 -->
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              :headers="headers"
              multiple
              class="upload"
              action="http://localhost:8888/api/private/v1/upload"
              :on-success="handlesuccess"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品内容 -->
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>

            <quillEditor v-model="form.goods_introduce"></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <!-- 商品属性 -->
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      checkList: [],
      //数据的来源
      options: [],
      //当前选中的
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
      },
      arrDt: [],
      arrJt: [],
      //       请求头
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    //           {
    //   "goods_name":"test_goods_name2",
    //   "goods_price":20,
    //   "goods_number":30,
    //   "goods_weight":40,
    //   "goods_introduce":"abc",
    //   "pics":[
    //     {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
    //     ],
    //   "attrs":[
    //     {
    //       "attr_id":15,
    //       "attr_value":"ddd"
    //     },
    //     {
    //       "attr_id":15,
    //       "attr_value":"eee"
    //     }
    //     ]
    // }
    // 点击添加提交商品
    async addGoods() {
      //       goods_cat 分类赋值
      this.form.goods_cat = this.selectedOptions.join(",");
      //       attrs 商品参数赋值 动态添加属性数组对象 
//       const obj1 = {};
//       const arr1 = []
//       const arr1 = this.arrDt.forEach(item => {
//         obj.attr_id = item.attr_id;
//         obj.attr_value = item.attr_vals;
//         arr1.push(obj)
//       });
        const arr1 = this.arrDt.map(item=>{
             return {attr_id:item.attr_id,attr_value:item.attr_vals}
        })
        const arr2 = this.arrJt.map(item=>{
             return {attr_id:item.attr_id,attr_value:item.attr_vals}
        })
        this.form.attrs = [...arr1,...arr2]


        const res = await this.$http.post(`goods`, this.form);
        //      console.log(res)
        const {
            data,
            meta: { msg,status }
          } = res.data;
        if(status === 201) {
                this.$message.success(msg)
                this.$router.push({
                        name:'goods'
                })
        }else {
                this.$$message.info(msg)
                this.$router.push({
                        name:'goodsadd'
                })
        }
    },
    // 点击删除的时候变
    handleRemove(file, fileList) {
      // console.log(file);
      // file.response.data.tmp_path 删除图片的临时路径
      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tem_path;
      });
      this.form.pics.splice(Index, 1);
      console.log(this.form.pics);
    },

    handlesuccess(response, file, fileList) {
      // 上传成功后的临时路径
      //  response.data.tmp_path
      this.form.pics.push({
        pic: response.data.tmp_path
      });
      // console.log(this.form.pics)
    },
    // 点击tab给数据
    async changeTab() {
      //        判断有没有
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选择三级分类！");
          if(this.active ==="2"){
                 this.arrDt = []   
          }else {
                this.arrJt = []
          }
         
          return
        }
        
        // 如果请求的是3 那么获取静态参数
        if (this.active === "3") {
          //      发请求 静态参数
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.arrJt = data;
            console.log(this.arrJt);
            //   console.log(data);
            this.arrJt.forEach(item => {
              // 如果后台返回的是个很多空格的字符，那么 trim去掉前后空格
              if (item.attr_vals.length === 0) {
                item.attr_vals.trim = [];
              } else {
                item.attr_vals = item.attr_vals.trim();
              }
            });
          }
        }

        // 如果请求是2 获取动态参数
        if (this.active === "2") {
          //   发请求 categories/:id/attributes 动态参数
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.arrDt = data;
            //   console.log(data);
            this.arrDt.forEach(item => {
              // 如果后台返回的是个很多空格的字符，那么 trim去掉前后空格
              if (item.attr_vals.length === 0) {
                item.attr_vals.trim = [];
              } else {
                item.attr_vals = item.attr_vals.trim().split(",");
              }
            });
          }
        }
      }
    },

    async getGoods() {
      const res = await this.$http.get(`categories?type=3`);

      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.options = data;
        //    console.log(data)
      }
    },

    handleChange() {}
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
  margin-bottom: 10px;
}
.form {
  overflow: auto;
}
.upload {
  margin-top: 15px;
}
.ql-toolbar,
.ql-snow {
  min-height: 150px;
}
</style>
