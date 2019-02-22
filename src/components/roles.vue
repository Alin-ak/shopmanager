<template>
    <el-card>
        <CusBread lv1="权限管理" lv2="角色列表"></CusBread>    
        <el-button type="success" plain @click="showAddRole()" class="mr">添加角色</el-button>
        <!-- 表格 -->

      <el-table :data="list" style="width: 100%" @expand-change=fn>
       <!-- 展开行    一行两列 第二列再分一行两列 比例4：20 -->
      <el-table-column type="expand"  width="80"> 
          <template slot-scope="scope">
              <el-row  v-for="(item,i) in scope.row.children" :key="item.id">
               <el-col :span="4">
                   <el-tag closable type="danger"> 
                        {{item.authName}}
                   </el-tag>
                   <i class="el-icon-arrow-right"></i>
               </el-col>
              
               <el-col :span="20">
                   <el-row  v-for="(item1,i) in item.children" :key="item1.id">
                       <el-col :span="4">
                           <el-tag closable type="success">{{item1.authName}}</el-tag>
                           <i class="el-icon-arrow-right"></i>
                       </el-col>
                       <el-col :span="20">
                           <el-tag closable type="success" v-for="(item2,i) in item1.children" :key="item2.id">
                               {{item2.authName}}
                           </el-tag>
                           
                       </el-col>
                   </el-row>

               </el-col>
                          
               </el-row> 
               <el-row v-if="scope.row.children.length===0">
                   <el-col>

                       <span> 当前角色无权限</span>
                   </el-col>

               </el-row>
          </template>
          
      </el-table-column>


      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="姓名" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="邮箱" width="180"></el-table-column>

      <el-table-column prop="address" label="操作" min-width="180">
        <template slot-scope="scope">
        <el-button
        @click='showEditRole(scope.row)' type="primary"  icon="el-icon-edit" circle size="mini" plain></el-button>
        <el-button
        @click='delRole(scope.row)' type="danger"  icon="el-icon-delete" circle size="mini" plain></el-button>
        <el-button
        @click='showRole(scope.row)' type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>  
        </el-table-column>
      </el-table>

      <!-- 对话框 -->
       <el-dialog title="添加角色" :visible.sync="dialogFormVisibleRole">
         <!-- 树形控件   -->
                    <el-tree
                     ref="treeId"
                     default-expand-all
                     :data="listTree"
                     show-checkbox
                     node-key="id"
                     :default-expanded-keys="[2, 3]"
                     :default-checked-keys=checkedKey
                     :props="defaultProps">
                    </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole()" >确 定</el-button>
      </div>
    </el-dialog>
    </el-card>
</template>

<script>
export default {
    data () {
        return {
            list:[],
            listTree:[],
            checkedKey:[],
            dialogFormVisibleRole:false,
            defaultProps:{
                label:'authName',
                children:'children'
            },
            roles:[]
        }
    },
    created () {
        this.getRoleData()
    },

    methods:{
        // expand-change 当用户对某一行展开或者关闭的时候会触发该事件	
        fn(row, expandedRows) {

        //    console.log(row); 之前点的那个
        //    console.log(expandedRows); 新点的包括之前的数组
            if(expandedRows.length >1) {
                expandedRows.shift()
            }
           
        },
        // 点确定分配角色 roles/:roleId/rights
       async addRole(){
           const arr1 =this.$refs.treeId.getCheckedKeys()
           const arr2 =this.$refs.treeId.getHalfCheckedKeys()
           const arr3 = [...arr1,...arr2]
           const res = await this.$http.post(`roles/${this.roles.id}/rights`,{
               rids:arr3.join(',')
           })
        //    console.log(res)
           const {meta:{status,msg}} = res.data
           if( status === 200) {
               this.$message.success(msg)
               this.dialogFormVisibleRole = false
           }
        },
        // 点对勾弹出对话框
       async showRole(role) {
            this.roles = role
            this.dialogFormVisibleRole = true
            const res = await this.$http.get(`rights/tree`)
            const {data,meta:{status}} = res.data
            if(status === 200) {
                this.listTree = data               
            }
            
            // 遍历当前角色的所拥有权限
            const arr = [];
            role.children.forEach(item => {
                
                item.children.forEach(item1=>{

                    item1.children.forEach(item2=>{
                        arr.push(item2.id)
                    })
                })
            });
            this.checkedKey = arr

        },
        // 删除角色 roles/:id
        async delRole(role){
            if(confirm('确定删除?')) {
            const res = await this.$http.delete(`roles/${role.id}`)
            const {meta:{status,msg}} = res.data
            if(status===200) {
                this.$message.success(msg)
            }
            }
        },
        // 添加角色
        showAddRole(){

        },
        // 获取角色列表
       async getRoleData(){
           const res = await this.$http.get(`roles`)
           const {data,meta:{status}} = res.data
           if(status === 200) {
               this.list = data
           }
        }
    }
}
</script>

<style>
.mr{
    margin-top: 10px;
}
</style>
