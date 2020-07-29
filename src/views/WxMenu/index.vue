<template>
  <div class="WxMenu">
      <span class="title">微信自定义菜单栏</span>
      <div class="btn_box">
         <div style="margin-left:10px;">
           <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
         </div>
         <div>
           <el-button type="primary" @click="newly">新增</el-button>
         </div>
       </div>
      <el-table
      v-loading="loading"
      :data="data"
      border
      stripe
      fit
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column label="ID" prop="ID" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" prop="name" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" prop="url" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单状态" prop="isHide" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isHide == 1? "显示": "已隐藏" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="70%"
      @close="close"
      center>
       <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemList" class="clearFix">
          <el-form-item label="菜单名称：" prop="name" style="width: 100%">
              <el-input v-model="itemList.name" style="width:50%" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单状态：" prop="isHide" style="width: 100%">
              <el-radio-group v-model="itemList.isHide">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单级别：" prop="type" style="width: 100%">
              <el-radio-group v-model="itemList.type" @change="changeType">
                  <el-radio label="1">点击直接跳转</el-radio>
                  <el-radio label="2">2级菜单</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="二级菜单：" prop="weiXinMenus" style="width: 100%" v-if="itemList.type == 2">
            <div v-for="(value,index) in itemList.weiXinMenus" :key="index" style="margin-bottom: 9px;"> 
              <el-input v-model="value.names" style="width:190px" placeholder="请输入菜单名称" @input="input"></el-input>
              <el-input v-model="value.urls" style="width:310px" placeholder="请输入该菜单要跳转的链接" @input="input"></el-input>
              <el-button type="primary" @click="addition(index)">+添加</el-button>
              <el-button type="danger" @click="removeDialog(index)">删除</el-button>
            </div>
          </el-form-item>
          <el-form-item label="跳转链接：" prop="url" style="width: 100%" v-if="itemList.type == 1">
              <el-input v-model="itemList.url" style="width:50%" placeholder="请输入跳转链接"></el-input>
          </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findWeiXinMenuInfos , updateWxMenu , saveWxMenu } from "@/api/guest/WxMenu"
export default {
    data(){
      return{
        dialogTitle: "",
        loadingBootm: false,
        editDialog: false,
        loading: false,
        data: [],
        itemList: {},
        rules: {
          name: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' },
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
          ]
        },
      }
    },
    mounted(){
      this.getList()
    },
    methods: {
      async getList(){
        this.loading = true
        let res = await findWeiXinMenuInfos()
        this.loading = false
        this.data = res.data
      },
      input(){
        this.$forceUpdate()
      },
      newly(){
        this.itemList = {
          isHide: '1',
          type: '1',
          url: "",
          weiXinMenus: [
            {
              names: "",
              urls: "",
            }
          ]
        }
        this.editDialog = true
      },
      itemEditDialog(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loadingBootm = true
              var obj = this.itemList
              var data = {}
              if(obj.type == 2){
                obj.weiXinMenus.map((v,idx)=>{
                  delete v.createTimes
                  delete v.ids
                  if(!(v.names && v.urls)){
                    obj.weiXinMenus.splice(idx,1)
                  }
                })
                data.weiXinMenus = obj.weiXinMenus
              }else{
                data.url = obj.url
              }
              data.name = obj.name
              data.isHide = obj.isHide
              data.type = obj.type
              if(obj.id){
                data.id = obj.id
                updateWxMenu(data).then(res=>{
                  this.loadingBootm = false
                  if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.editDialog = false
                  }else{
                    this.$message({
                        type: 'info',
                        message: res.msg
                    })
                  }
                })
              }else{
                saveWxMenu(data).then(res=>{
                  this.loadingBootm = false
                  if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.editDialog = false
                  }else{
                    this.$message({
                        type: 'info',
                        message: res.msg
                    })
                  }
                })
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      changeType(type){
        // if(type == 2 && !this.itemList.weiXinMenus){
        //   this.itemList.weiXinMenus = [
        //     {
        //       menuId: this.itemList.id,
        //       names: "",
        //       urls: "",
        //     }
        //   ]
        // }
        this.itemList.type = type
        this.$forceUpdate()
      },
      compile(item){
        this.editDialog = true
        this.dialogTitle = "微信自定义菜单栏管理"
        this.itemList = item
        if(!item.weiXinMenus){
          this.itemList.weiXinMenus = [
            {
              menuId: this.itemList.id,
              names: "",
              urls: "",
            }
          ]
        }
        this.$forceUpdate()
      },
      removeDialog(index){
        if(this.itemList.weiXinMenus.length <= 1){
          this.$message({
            type: "info",
            message: "再删就没数据啦！"
          })
          return
        }
        this.itemList.weiXinMenus.splice(index,1)
        this.$forceUpdate()
      },
      addition(index,menuId){
        if(this.itemList.weiXinMenus.length >= 5){
          this.$message({
            type: "info",
            message: "最多添加5个!"
          })
          return
        }
        var obj = {
          menuId: this.itemList.id,
          names: "",
          urls: ""
        }
        this.itemList.weiXinMenus.splice(index+1,0,obj)
        this.$forceUpdate()
      },
      close(){
        this.loadingBootm = false
        this.itemList = {}
        this.getList()
      }
    }
}
</script>

<style lang="less" scoped>
.title{
  display: block;
  padding: 10px;
  font-size: 18px;
  font-weight: 600;
}
.btn_box{
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 10px 20px 10px;
}
</style>