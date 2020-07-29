<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <!-- <el-input
          v-model="queryList.cardno"
          placeholder="请输入卡号"
          class="input fl"
          @keyup.enter.native="handleFilter"/> -->
       </div> 
       <div class="btn_box">
         <div>
           <!-- <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button> -->
           <!-- <el-button type="primary" @click="reset">重置</el-button> -->
         </div>
         <div>
           <el-button type="primary" @click="newly">新增</el-button>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
         </div>
       </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      fit
      style="width: 100%;">
      <!-- <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column> -->
     <el-table-column label="头像" prop="pic" align="center">
        <template slot-scope="scope">
           <img :src="scope.row.pic" alt="" style="height:75px;">
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="邮箱" prop="email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="昵称" prop="nickname" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="手机号" prop="mobile" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="registerTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" prop="lastloginTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastloginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="compile(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />

    <!-- 新增编辑 -->
    <el-dialog
        width="70%"
        :title="textInner"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
         @close="close"
        center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-form label-position="right" ref="lobby" :rules="rules" label-width="150px" :model="lobbyObj" class="clearFix">
                <el-form-item label="用户名：" prop="username" style="width: 100%">
                    <el-input v-model="lobbyObj.username" style="width:50%" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password" style="width: 100%">
                    <el-input v-model="lobbyObj.password" style="width:50%" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="mobile" style="width: 100%">
                    <el-input v-model="lobbyObj.mobile" style="width:50%" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="头像：" style="width: 100%">
                  <el-upload
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    list-type="picture-card"
                    :on-change="handleChange">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-button size="mini" type="danger" @click="imageUrl = ''" style="margin-left: 45px;">删除</el-button>
              </el-form-item>
            </el-form>
        </div>
        <el-divider content-position="left"><span class="title">权限管理</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-radio-group v-model="lobbyObj.type" @change="changeType" style="margin:20px;">
              <el-radio label="1" :disabled="disabled">超级管理员</el-radio>
              <el-radio label="2">普通管理员</el-radio>
          </el-radio-group>
          <div class="roles_list" v-if="lobbyObj.type == 2">
              <div class="qin">请选择可访问页面</div>
              <el-checkbox-group v-model="rolesList">
                <el-checkbox :label="item.value" v-for="(item,index) in rolesListCon" :key="index">{{item.name}}</el-checkbox>
              </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loadingBtn" @click="lobbyDialog">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import { findYuyueUserAll , updateYuyueUserByuId , saveYuyueUser , delYuyueByuId } from '@/api/guest/userList'
import { dotOssUpload } from '@/api/nodeList'
import Pagination from "@/components/Pagination"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      disabled: false,
      loadingBtn: false,
      imageUrl: "",
      rolesList: [],
      lobbyObj: {
        type: ""
      },
      textInner: "",
      innerVisible: false,
      loading: false,
      itemArr: [],
      rolesListCon: [
        {
          name: "洗车服务后台",
          value: "carWash"
        },
        {
          name: "贵宾厅后台",
          value: "service"
        },
        {
          name: "用户权限管理",
          value: "userList"
        }
      ],
      rules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          // password: [
          //   { required: true, message: '密码不能为空', trigger: 'blur' }
          // ],
          mobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' }
          ]
      },
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    changeType(type){
      this.$forceUpdate()
      // this.type = type
    },
    apiUploadImg(formData){
      dotOssUpload(formData).then(res => {
        if(res.code == 200){
          this.imageUrl = res.data
          this.$message({
            type: 'success',
            message: '上传成功！'
          })
        }else{
          this.$message.error('上传失败！');
        }
      })
    },
    handleChange(file, fileList){
      if (fileList) {
            var formData = new FormData()
            formData.append('file', file.raw)
           this.apiUploadImg(formData)
          } else {
          this.$message({ message: '请上传图片!' })
      }
    },
    lobbyDialog(){
      this.loadingBtn = true
      var data = this.lobbyObj
      if(data.type == 1){
        data.roles = ["admin"]
      }else{
        data.roles = this.rolesList
      }
      if(this.imageUrl){
         data.pic = this.imageUrl
      }
      delete data.type
      if(this.lobbyObj.id){
        updateYuyueUserByuId(data).then(res=>{
          this.loadingBtn = false
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.innerVisible = false
          }else{
            this.$message.error(res.msg);
          }
        })
      }else{
        saveYuyueUser(data).then(res=>{
          this.loadingBtn = false
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.innerVisible = false
          }else{
            this.$message.error(res.msg);
          }
        })
      }
    },
    newly(){
      this.innerVisible = true
      this.loadingBtn = false
      this.lobbyObj.type = "2"
      var a = localStorage.getItem("data")
      var b = JSON.parse(a)
      var admin =  b.roles.indexOf("admin")
      if(admin == -1){
        this.lobbyObj.type = "2"
        this.disabled = true
      }else{
        this.disabled = false
        this.lobbyObj.type = "2"
      }
    },
    compile(item){
      this.loadingBtn = false
      this.innerVisible = true
      this.lobbyObj = item
      this.imageUrl = item.pic
      // console.log(item);
      var admin =  item.roles.indexOf("admin")
      if(admin == -1){
        this.lobbyObj.type = "2"
        this.rolesList = item.roles
        // this.disabled = false
      }else{
        this.lobbyObj.roles = ["admin"]
        this.lobbyObj.type = "1"
      }
    },
    remove(item){
      this.open('确定删除该用户？' , item.id)
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delYuyueByuId({id: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getData()
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    getData(filter){
      this.loading = true
      let data = {}
      // var queryList = this.queryList
      // if (queryList.cardno) {
      //   data.cardno = queryList.cardno
      // }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYuyueUserAll(data).then(res=>{
        this.loading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.data = {
            current_page: 1,
            data: [],
            last_page: 1,
            per_page: 15,
            total: 0,
            link: ""
          }
        }
        if( res.data && res.data.length > 0){
          // console.log(res);
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
            
          })
        }
      })
    },
    close(){
      this.lobbyObj = {}
      this.itemID = null
      this.imageUrl = ""
      this.loadingBootm = false
      this.getData()
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
  }
}
</script>

<style lang="less" scoped>
.roles_list{
  margin: 20px;
  .qin{
    margin: 20px;
    color: #ff0000;
  }
}
.title{
  font-size: 18px;
  font-weight: 600;
}
/deep/.el-dialog__header{
  background: #f8f8f8;
}
/deep/.el-divider--horizontal{
  margin: 0;
}
.query{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-top: none;
  padding-top: 10px;
  padding-bottom: 20px;
}
.input{
  width: 200px;
  margin-left:20px;
  margin-top: 10px;
}
.picker{
  width: 250px;
  margin-left:20px;
  margin-top: 10px;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}
/deep/.el-table .warning-row {
    background: oldlace;
  }

/deep/.el-table .success-row {
    background: #f0f9eb;
}
.center{
  display: block;
  align-items: center;
  display: flex;
  justify-content: center;
}
// .fl{
//   float: left;
//   }
// .fr{
//   float: right;
//   }
/deep/.el-form-item{
  float: left;
}
.clearFix::before,
.clearFix::after{
      content: "";
      display: block;
      visibility: hidden;
      height: 0;
      line-height: 0;
      clear: both;
}
.boxUpload{   
    .textUp{
      position: relative;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 4.5%;
      margin-top: 3%;
      margin-left: 3%;
      .uploadTransparency{
          display: block;
          width: 150px;
          height: 100px;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
        }
      .text{
        margin-top: 5px;
      }
      .btn{
        margin-top: 3px;
      }
    }
}
.avatar-uploader .el-upload:hover {
   border-color: #409EFF;
 }
.avatar {
   width: 148px;
   height: 148px;
   border-radius: 4px;
   cursor: pointer;
 }
</style>
