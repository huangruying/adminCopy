<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.name"
          placeholder="请输入产品名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.goOnline" @change="getData" class="input fl" placeholder="请选择上架状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
       </div> 
       <div class="btn_box">
         <div>
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
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column width="80" label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品图片" prop="picfilepath" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picfilepath" alt="" style="height: 55px; width: 82px;">
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品金额" prop="price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信上架金额" prop="wxAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="dateline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dateline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updatetime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" prop="goOnline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goOnline == 0? "未上架": "已上架"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="lookOver(scope.row)">编辑价格上下架</el-button>
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
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="50%"
      @close="close"
      center>
      <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemList" class="clearFix">
          <el-form-item label="微信上架金额：" prop="wxAmount" style="width: 100%">
              <el-input v-model="itemList.wxAmount" style="width:50%" placeholder="请输入微信上架金额"></el-input>
          </el-form-item>
          <el-form-item label="上架状态：" prop="goOnline" style="width: 100%">
              <el-radio-group v-model="itemList.goOnline">
                  <el-radio label="1">上架</el-radio>
                  <el-radio label="0">下架</el-radio>
              </el-radio-group>
          </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">返 回</el-button>
        <el-button type="primary"  @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findYyProductGoonLine , updateYyProductGoonLine } from '@/api/guest/WxProductList'
import Pagination from "@/components/Pagination"
import formatTime from "@/utils/formatTime"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      editDialog: false,
      dialogTitle: "查看",
      loading: false,
      itemID: null,
      itemArr: [],
      itemList: {},
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        name: null,
        goOnline: null
      },
      statusList: [
        {
          name: "未上架",
          value: 0
        },
        {
          name: "已上架",
          value: 1
        }
      ],
      rules: {
        wxAmount: [
          { required: true, message: '微信上架金额不能为空', trigger: 'blur' }
        ],
        goOnline: [
          { required: true, message: '请选择上架状态', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.name) {
        data.name = queryList.name
      }
      if(!(queryList.goOnline == null)){
        data.goOnline = queryList.goOnline
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYyProductGoonLine(data).then(res=>{
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
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
              if( v.dateline){
                v.dateline = formatTime(v.dateline*1000,'yyyy-mm-dd hh:mm:ss')
              }
              if( v.updatetime){
                v.updatetime = formatTime(v.updatetime*1000,'yyyy-mm-dd hh:mm:ss')
              }
          })
        }
      })
    },
    confirm(){
        this.itemList.id = this.itemID
        updateYyProductGoonLine(this.itemList).then(res=>{
            // console.log(res);
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
    },
    lookOver(item){
      this.itemList = item
      this.editDialog = true
      this.dialogTitle = item.name
      this.itemID = item.id
    },
    close(){
      this.itemList = {}
      this.imageUrl = ""
      this.itemID = null
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
        name: null,
        goOnline: null
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
.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
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
