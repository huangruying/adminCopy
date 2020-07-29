<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.nickname"
          placeholder="请输入昵称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.sex" @change="getData" class="input fl" placeholder="请选择性别">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.sex"
              :key="item.sex"
            ></el-option>
          </el-select>
       </div> 
       <div class="btn_box">
         <div>
           <!-- <el-button type="danger" @click="remove(2)">批量删除</el-button> -->
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
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
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column>
      <el-table-column label="ID" prop="id" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" prop="headimgurl"  align="center">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl" alt="" style="width: 45px;height: 45px;">
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" prop="username"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在地" prop="country"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在省" prop="province"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在市" prop="city"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="examine(scope.row)">查 看</el-button>
          <!-- <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button> -->
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

    <!-- 查看車后信息 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="ID：" prop="id" style="width: 100%">
                  <el-input v-model="itemObj.id" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="昵称：" prop="nickname" style="width: 100%">
                  <el-input v-model="itemObj.nickname" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="真实姓名：" prop="username" style="width: 100%">
                  <el-input v-model="itemObj.username" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="性别：" prop="sex" style="width: 100%">
                  <el-input v-model="itemObj.sex" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="所在地：" prop="country" style="width: 100%">
                  <el-input v-model="itemObj.country" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="所在省：" prop="province" style="width: 100%">
                  <el-input v-model="itemObj.province" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="所在市：" prop="city" style="width: 100%">
                  <el-input v-model="itemObj.city" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="添加时间：" prop="createTime" style="width: 100%">
                  <el-input v-model="itemObj.createTime" style="width:50%" disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="title">车后信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="itemObj.vehicleUserIds"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column label="车牌号" prop="licensePlate" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.licensePlate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="发动机号" prop="engine" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.engine }}</span>
                </template>
              </el-table-column>
              <el-table-column label="车架号" prop="frame" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.frame }}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialog = false">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findWeixinUserInfos } from '@/api/userWxList'
import Pagination from "@/components/Pagination"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialogTitle: "查看",
      editDialog: false,
      loading: false,
      itemObj: {
        vehicleUserIds: {}
      },
      itemArr: [],
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        nickname: null,
        sex: null
      },
      statusList: [
        {
          name: "男",
          sex: 1
        },
        {
          name: "女",
          sex: 2
        },
        {
          name: "未知",
          sex: 0
        }
      ],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    examine(item){
      // console.log(item);
      if(!(item.vehicleUserIds)){
        item.vehicleUserIds = []
      }
      this.itemObj = item
      this.editDialog = true
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    remove(item){
      if(item === 2){
        if(this.itemArr.length == 0){
          this.$message({
            type: 'info',
            message: '请选择数据！'
          })
          return
        }
        var arr = []
        this.itemArr.forEach(v=>{
          arr.push(v.id)
        })
        this.open('确定批量删除？' , arr)
      }else{
        this.open('确定删除？' , [item.id])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delYyOrderytdetailById({ids: id}).then(res=>{
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
      var queryList = this.queryList
      if (queryList.nickname) {
        data.nickname = queryList.nickname
      }
      if(!(queryList.sex == null)){
        data.sex = queryList.sex
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findWeixinUserInfos(data).then(res=>{
        // this.data = res;
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
             if(v.sex == 0){
               v.sex = "未知"
             }else if(v.sex == 1){
               v.sex = "男"
             }else{
               v.sex = "女"
             }
          })
        }
      })
    },
    close(){
      this.itemObj = {
        vehicleUserIds: []
      }
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        nickname: null,
        sex: null
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
